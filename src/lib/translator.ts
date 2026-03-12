
import { LOCALES } from "@/data/locales";

/**
 * Builds a bi-directional map of strings to their paths for a given locale.
 * Example: "พนักงานขับรถผู้บริหาร" -> "services.items[0].title"
 */
function buildStringMap(obj: any, prefix = ""): Record<string, string> {
    const map: Record<string, string> = {};

    if (typeof obj === 'string') {
        map[obj] = prefix;
    } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            Object.assign(map, buildStringMap(item, `${prefix}[${index}]`));
        });
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            const newPrefix = prefix ? `${prefix}.${key}` : key;
            Object.assign(map, buildStringMap(obj[key], newPrefix));
        }
    }

    return map;
}

/**
 * Retrieves a value from an object given a dot-notated/array-indexed path.
 */
function getValueByPath(obj: any, path: string): any {
    const parts = path.split(/[.\[\]]+/).filter(Boolean);
    let current = obj;
    for (const part of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
    }
    return current;
}

/**
 * Smart translator that uses path-based mapping.
 * If a string in source matches a string in the 'th' mockup, 
 * it swaps it for the string at the same path in 'targetLang'.
 */
function smartTranslate(obj: any, targetLang: string, sourceMap: Record<string, string>): any {
    const targetLocale = LOCALES[targetLang] || LOCALES.th;

    if (typeof obj === 'string') {
        const path = sourceMap[obj];
        if (path) {
            const translatedValue = getValueByPath(targetLocale, path);
            if (typeof translatedValue === 'string') {
                return translatedValue;
            }
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => smartTranslate(item, targetLang, sourceMap));
    }

    if (typeof obj === 'object' && obj !== null) {
        // Special handling for common JSON objects to avoid deep recursion on weird objects
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = smartTranslate(obj[key], targetLang, sourceMap);
        }
        return newObj;
    }

    return obj;
}

/**
 * Translates an array of strings using Google Cloud Translation V2 API (Batched & Chunked).
 */
async function googleTranslateBatch(texts: string[], targetLang: string): Promise<string[]> {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey || texts.length === 0) return texts;

    // Google API typically allows up to 128 strings per request, 
    // but we use 50 to be safe with total character limits.
    const CHUNK_SIZE = 50;
    const results: string[] = [];

    for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
        const chunk = texts.slice(i, i + CHUNK_SIZE);
        try {
            const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Referer": process.env.NEXTAUTH_URL || "http://localhost:3000/" 
                },
                body: JSON.stringify({
                    q: chunk,
                    target: targetLang,
                    format: "text"
                })
            });

            const data = await res.json();
            if (data.data?.translations) {
                results.push(...data.data.translations.map((t: any) => t.translatedText));
            } else {
                if (data.error) {
                    console.error("[GoogleTranslateBatch] Chunk Error:", data.error.message);
                }
                // Fallback to original texts for this chunk
                results.push(...chunk);
            }
        } catch (error) {
            console.error("[GoogleTranslateBatch] Fetch Error:", error);
            results.push(...chunk);
        }
    }

    return results;
}

/**
 * Enhanced smart translator that handles both template-based and AI-based translation.
 * Now supports collecting strings for batching.
 */
function collectStringsToTranslate(obj: any, targetLang: string, sourceMap: Record<string, string>, collection: { text: string; path: string | null }[]) {
    if (obj instanceof Date) return;
    if (typeof obj === 'string') {
        const isUrl = /^(https?:\/\/|\/|supabase\.co)/i.test(obj);
        const isId = /^[c-z][a-z0-7]{24}$/.test(obj);
        const isNumberStr = !isNaN(Number(obj)) && obj.trim() !== "" && obj.length < 10;
        
        if (isUrl || isId || isNumberStr || obj.trim() === "") return;

        const path = sourceMap[obj];
        const targetLocale = LOCALES[targetLang];
        
        // If it's in the mockup, check if the target locale has a hardcoded translation
        if (path && targetLocale) {
            const translatedValue = getValueByPath(targetLocale, path);
            if (typeof translatedValue === 'string') {
                return; // Has a hardcoded translation, skip AI
            }
        }

        // If not in mockup or not in target locale, use AI
        collection.push({ text: obj, path: null });
    } else if (Array.isArray(obj)) {
        obj.forEach(item => collectStringsToTranslate(item, targetLang, sourceMap, collection));
    } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(val => collectStringsToTranslate(val, targetLang, sourceMap, collection));
    }
}

/**
 * Replaces strings with their translations from a provided map.
 */
function applyTranslations(obj: any, targetLang: string, sourceMap: Record<string, string>, translationMap: Record<string, string>): any {
    const targetLocale = LOCALES[targetLang] || LOCALES.th;

    if (obj instanceof Date) return obj;

    if (typeof obj === 'string') {
        const path = sourceMap[obj];
        if (path) {
            const translatedValue = getValueByPath(targetLocale, path);
            if (typeof translatedValue === 'string') return translatedValue;
        }
        return translationMap[obj] || obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => applyTranslations(item, targetLang, sourceMap, translationMap));
    }

    if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = applyTranslations(obj[key], targetLang, sourceMap, translationMap);
        }
        return newObj;
    }

    return obj;
}

/**
 * Re-added to handle core profile data with batching.
 */
export async function translateProfileSettings(data: { fullName: string, title: string }, targetLang: string) {
    const texts = [data.fullName, data.title];
    const translated = await googleTranslateBatch(texts, targetLang.toLowerCase());
    return { 
        fullName: translated[0], 
        title: translated[1] 
    };
}

/**
 * Optimized profile content translation using batching.
 */
export async function translateProfileContent(content: any, targetLang: string) {
    const thMap = buildStringMap(LOCALES.th);
    const result = JSON.parse(JSON.stringify(content));

    // 1. Collect all unique strings that need AI translation
    const stringsToTranslate: { text: string; path: string | null }[] = [];
    
    // Explicitly add top-level fields to ensure they are captured regardless of object structure
    const topLevelFields = [
        'heroBadge', 'heroName', 'heroTitle', 'heroQuote', 'heroContact', 'heroStandard',
        'heroStandardBtn', 'heroContactBtn', 'navAbout', 'navServices', 'navCustomers', 
        'navLookingFor', 'navContact'
    ];
    topLevelFields.forEach(field => {
        if (typeof result[field] === 'string' && result[field].trim() !== "") {
            collectStringsToTranslate(result[field], targetLang, thMap, stringsToTranslate);
        }
    });

    // Recursively collect from the whole object (for JSON fields like servicesData, etc.)
    collectStringsToTranslate(result, targetLang, thMap, stringsToTranslate);
    
    const uniqueTexts = Array.from(new Set(stringsToTranslate.map(s => s.text)));

    // 2. Perform batched AI translation (Chunked)
    const translatedTexts = await googleTranslateBatch(uniqueTexts, targetLang);
    
    const translationMap: Record<string, string> = {};
    uniqueTexts.forEach((text, i) => {
        translationMap[text] = translatedTexts[i];
    });

    // 3. Apply translations
    const translated = applyTranslations(result, targetLang, thMap, translationMap);

    // 4. Force core nav from locales if they exist
    const targetLocale = LOCALES[targetLang];
    if (targetLocale) {
        translated.navAbout = targetLocale.header?.about || translated.navAbout;
        translated.navServices = targetLocale.header?.services || translated.navServices;
        translated.navCustomers = targetLocale.header?.keyCustomers || translated.navCustomers;
        translated.navLookingFor = targetLocale.header?.lookingFor || translated.navLookingFor;
        translated.navContact = targetLocale.header?.contact || translated.navContact;
    }

    return translated;
}
