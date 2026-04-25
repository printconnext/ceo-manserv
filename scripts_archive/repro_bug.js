
const LOCALES = {
    th: {
        hero: { quote: "ต้นฉบับภาษาไทย" }
    },
    en: {
        hero: { quote: "English Version" }
    }
};

function getValueByPath(obj, path) {
    const parts = path.split(/[.\[\]]+/).filter(Boolean);
    let current = obj;
    for (const part of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
    }
    return current;
}

function applyTranslations(obj, targetLang, sourceMap, translationMap) {
    const targetLocale = LOCALES[targetLang] || LOCALES.th; // THE BUG IS HERE

    if (typeof obj === 'string') {
        const path = sourceMap[obj];
        if (path) {
            const translatedValue = getValueByPath(targetLocale, path);
            if (typeof translatedValue === 'string') return translatedValue;
        }
        return translationMap[obj] || obj;
    }
    return obj;
}

const sourceMap = { "ต้นฉบับภาษาไทย": "hero.quote" };
const translationMap = { "ต้นฉบับภาษาไทย": "Khmer Translated Text" };

console.log("Target: km (Khmer)");
const resultKm = applyTranslations("ต้นฉบับภาษาไทย", "km", sourceMap, translationMap);
console.log("Result:", resultKm);
console.log(resultKm === "ต้นฉบับภาษาไทย" ? "FAILED (Stayed Thai)" : "SUCCESS (Translated)");

console.log("\nTarget: en (English)");
const resultEn = applyTranslations("ต้นฉบับภาษาไทย", "en", sourceMap, translationMap);
console.log("Result:", resultEn);
