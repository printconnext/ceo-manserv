
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
 * Translates profile content by deep-cloning and applying smart translation.
 */
export function translateProfileContent(content: any, targetLang: string) {
    // 1. Build map of the Thai mockup (source of truth for translation)
    const thMap = buildStringMap(LOCALES.th);

    // 2. First, deep clone the entire content
    const result = JSON.parse(JSON.stringify(content));

    // 3. Apply smart translation recursively
    const translated = smartTranslate(result, targetLang, thMap);

    // 4. Force specific core navigation items from LOCALES for absolute accuracy
    const targetLocale = LOCALES[targetLang] || LOCALES.th;
    translated.navAbout = targetLocale.header?.about || translated.navAbout;
    translated.navServices = targetLocale.header?.services || translated.navServices;
    translated.navCustomers = targetLocale.header?.keyCustomers || translated.navCustomers;
    translated.navLookingFor = targetLocale.header?.lookingFor || translated.navLookingFor;
    translated.navContact = targetLocale.header?.contact || translated.navContact;

    return translated;
}
