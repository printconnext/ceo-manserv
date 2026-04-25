
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
 * Translates an array of strings using Google Cloud Translation V2 API (Batched & Chunked).
 */
async function googleTranslateBatch(texts: string[], targetLang: string, referer?: string): Promise<string[]> {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey || texts.length === 0) return texts;

    // Sanitize: Google API rejects null/undefined
    const sanitizedTexts = texts.map(t => t?.toString() || "");
    // Use a default referer if not provided, favoring NEXTAUTH_URL
    const finalReferer = referer || process.env.NEXTAUTH_URL || "http://localhost:3000/";

    const CHUNK_SIZE = 50;
    const results: string[] = [];

    for (let i = 0; i < sanitizedTexts.length; i += CHUNK_SIZE) {
        const chunk = sanitizedTexts.slice(i, i + CHUNK_SIZE);
        try {
            const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Referer": finalReferer 
                },
                body: JSON.stringify({
                    q: chunk,
                    target: targetLang,
                    format: "text"
                })
            });

            const data = await res.json();
            if (data.data?.translations) {
                // Google V2 API returns HTML entities like &quot; which we need to decode
                const decoded = data.data.translations.map((t: any) => {
                    let text = t.translatedText;
                    return text
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/&amp;/g, "&")
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">");
                });
                results.push(...decoded);
            } else {
                console.error(`[GoogleTranslateBatch] Error (${targetLang}):`, {
                    status: res.status,
                    statusText: res.statusText,
                    error: data.error,
                    referer: finalReferer,
                    textsCount: chunk.length
                });
                results.push(...chunk);
            }
        } catch (error) {
            console.error(`[GoogleTranslateBatch] Fetch Error (${targetLang}):`, error);
            results.push(...chunk);
        }
    }

    return results;
}

/**
 * Enhanced smart translator that handles both template-based and AI-based translation.
 * Now simplified to rely 100% on AI translation for profile content.
 */
function collectStringsToTranslate(obj: any, collection: { text: string; path: string | null }[]) {
    if (obj instanceof Date) return;
    if (typeof obj === 'string') {
        const isUrl = /^(https?:\/\/|\/|supabase\.co|drive\.google\.com)/i.test(obj);
        const isId = /^[c-z][a-z0-7]{24}$/.test(obj);
        // Skip IDs, URLs, and numeric strings
        const isNumberStr = !isNaN(Number(obj.replace(/[%+,]/g, ''))) && obj.trim() !== "" && obj.length < 20;
        
        if (isUrl || isId || isNumberStr || obj.trim() === "") return;

        // Collect every other non-empty string for AI translation
        collection.push({ text: obj, path: null });
    } else if (Array.isArray(obj)) {
        obj.forEach(item => collectStringsToTranslate(item, collection));
    } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(val => collectStringsToTranslate(val, collection));
    }
}

/**
 * Replaces strings with their translations from a provided map.
 */
function applyTranslations(obj: any, translationMap: Record<string, string>): any {
    if (obj instanceof Date) return obj;

    if (typeof obj === 'string') {
        return translationMap[obj] || obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => applyTranslations(item, translationMap));
    }

    if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = applyTranslations(obj[key], translationMap);
        }
        return newObj;
    }

    return obj;
}

/**
 * Re-added to handle core profile data with batching.
 */
export async function translateProfileSettings(data: { fullName: string, title: string }, targetLang: string, referer?: string) {
    const texts = [data.fullName, data.title];
    const translated = await googleTranslateBatch(texts, targetLang.toLowerCase(), referer);
    return { 
        fullName: translated[0], 
        title: translated[1] 
    };
}

/**
 * Optimized profile content translation using 100% AI batching.
 * Decoupled from hardcoded locale files as per user request.
 */
export async function translateProfileContent(content: any, targetLang: string, referer?: string) {
    const result = JSON.parse(JSON.stringify(content));

    // 1. Collect all unique strings that need AI translation
    const stringsToTranslate: { text: string; path: string | null }[] = [];
    
    // Explicitly add top-level fields to ensure they are captured regardless of object structure
    const topLevelFields = [
        'heroBadge', 'heroName', 'heroTitle', 'heroQuote', 'heroContact', 'heroStandard',
        'heroStandardBtn', 'heroContactBtn', 'heroRole', 'navAbout', 'navServices', 
        'navCustomers', 'navLookingFor', 'navContact'
    ];
    topLevelFields.forEach(field => {
        if (typeof result[field] === 'string' && result[field].trim() !== "") {
            collectStringsToTranslate(result[field], stringsToTranslate);
        }
    });

    // Recursively collect from the whole object (for JSON fields like servicesData, etc.)
    collectStringsToTranslate(result, stringsToTranslate);
    
    const uniqueTexts = Array.from(new Set(stringsToTranslate.map(s => s.text)));

    // 2. Perform batched AI translation (Chunked)
    const translatedTexts = await googleTranslateBatch(uniqueTexts, targetLang, referer);
    
    const translationMap: Record<string, string> = {};
    uniqueTexts.forEach((text, i) => {
        translationMap[text] = translatedTexts[i];
    });

    // 3. Apply translations
    const translated = applyTranslations(result, translationMap);

    return translated;
}
