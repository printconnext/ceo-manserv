
// Mocking the behavior of the refactored translator.ts
function applyTranslations(obj, translationMap) {
    if (typeof obj === 'string') {
        return translationMap[obj] || obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => applyTranslations(item, translationMap));
    }
    if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = applyTranslations(obj[key], translationMap);
        }
        return newObj;
    }
    return obj;
}

const originalThai = "ต้นฉบับภาษาไทย";
const translationMap = { "ต้นฉบับภาษาไทย": "Khmer Translated Text" };

console.log("Target: km (Khmer)");
const resultKm = applyTranslations(originalThai, translationMap);
console.log("Result:", resultKm);
console.log(resultKm === "Khmer Translated Text" ? "SUCCESS (Translated)" : "FAILED (Stayed Thai)");

console.log("\nTarget: ko (Korean)");
const resultKo = applyTranslations({ quote: originalThai }, { [originalThai]: "Korean Text" });
console.log("Result Quote:", resultKo.quote);
