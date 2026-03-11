
import { LOCALES } from "@/data/locales";

// Dictionary of standard labels to translate between languages
// Key is the "Label Name", value is an object mapping lang -> translated string
const DICTIONARY: Record<string, Record<string, string>> = {
    "ติดต่อเรา": { th: "ติดต่อเรา", en: "Contact Us" },
    "Contact Us": { th: "ติดต่อเรา", en: "Contact Us" },
    "ช่องทางการติดต่อ": { th: "ช่องทางการติดต่อ", en: "Get in touch" },
    "Get in touch": { th: "ช่องทางการติดต่อ", en: "Get in touch" },
    "ที่ตั้งสำนักงาน": { th: "ที่ตั้งสำนักงาน", en: "Office Address" },
    "Office Address": { th: "ที่ตั้งสำนักงาน", en: "Office Address" },
    "อีเมล": { th: "อีเมล", en: "Email" },
    "Email": { th: "อีเมล", en: "Email" },
    "เบอร์โทรศัพท์": { th: "เบอร์โทรศัพท์", en: "Phone Number" },
    "Phone Number": { th: "เบอร์โทรศัพท์", en: "Phone Number" },
    "เว็บไซต์": { th: "เว็บไซต์", en: "Website" },
    "Website": { th: "เว็บไซต์", en: "Website" },
    "เกี่ยวกับ": { th: "เกี่ยวกับ", en: "About" },
    "About": { th: "เกี่ยวกับ", en: "About" },
    "บริการ": { th: "บริการ", en: "Services" },
    "Services": { th: "บริการ", en: "Services" },
    "ลูกค้า": { th: "ลูกค้า", en: "Key Customers" },
    "Key Customers": { th: "ลูกค้า", en: "Key Customers" },
    "กำลังมองหา": { th: "กำลังมองหา", en: "Looking For" },
    "Looking For": { th: "กำลังมองหา", en: "Looking For" },
    "ติดต่อ": { th: "ติดต่อ", en: "Contact" },
    "Contact": { th: "ติดต่อ", en: "Contact" },
    "มาตรฐานของเรา": { th: "มาตรฐานของเรา", en: "Our Standard" },
    "Our Standard": { th: "มาตรฐานของเรา", en: "Our Standard" },
};

/**
 * Recursively iterates through an object or array and translates strings
 * if they match keys in our DICTIONARY.
 */
function deepTranslate(obj: any, targetLang: string): any {
    if (typeof obj === 'string') {
        // Find if this string exists in our dictionary
        for (const key in DICTIONARY) {
            const entry = DICTIONARY[key];
            // If the current string matches ANY of the translations in the entry
            if (Object.values(entry).includes(obj)) {
                return entry[targetLang] || obj;
            }
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepTranslate(item, targetLang));
    }

    if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = deepTranslate(obj[key], targetLang);
        }
        return newObj;
    }

    return obj;
}

/**
 * Translates profile content (translations record) by deep-cloning and
 * recursively applying translation to all string fields.
 */
export function translateProfileContent(content: any, targetLang: string) {
    // 1. First, deep clone the entire content
    const result = JSON.parse(JSON.stringify(content));

    // 2. Apply deep translation recursively to the whole object
    // This will handle headers, badges, button labels, and items in services/clients/experience
    const translated = deepTranslate(result, targetLang);

    // 3. Force specific core navigation items from LOCALES for accuracy
    const targetLocale = LOCALES[targetLang] || LOCALES.th;
    translated.navAbout = targetLocale.header?.about || translated.navAbout;
    translated.navServices = targetLocale.header?.services || translated.navServices;
    translated.navCustomers = targetLocale.header?.keyCustomers || translated.navCustomers;
    translated.navLookingFor = targetLocale.header?.lookingFor || translated.navLookingFor;
    translated.navContact = targetLocale.header?.contact || translated.navContact;

    return translated;
}
