
const { th } = require('./src/data/locales/th');
const { ja } = require('./src/data/locales/ja');

const LOCALES = { th, ja };

function buildStringMap(obj, prefix = "") {
    const map = {};
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
    const targetLocale = LOCALES[targetLang] || LOCALES.th;
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
        const newObj = {};
        for (const key in obj) {
            newObj[key] = applyTranslations(obj[key], targetLang, sourceMap, translationMap);
        }
        return newObj;
    }
    return obj;
}

const samarthThaiData = {
  "aboutData": {
    "stats": [
      { "label": "ประสบการณ์ (ปี)", "value": "20+" }
    ]
  }
};

const thMap = buildStringMap(LOCALES.th);
console.log("Path for 'ประสบการณ์ (ปี)':", thMap["ประสบการณ์ (ปี)"]);

const result = applyTranslations(samarthThaiData, 'ja', thMap, {});
console.log("Translation Result (Expected '経験年数'):", result.aboutData.stats[0].label);
