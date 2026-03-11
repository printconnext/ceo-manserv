
import { LOCALES } from "@/data/locales";

/**
 * Basic dictionary-based translator for standard profile fields.
 * If a field's value in the source profile matches a default string in the 
 * source language, it swaps it for the target language's default string.
 */
export function translateProfileContent(content: any, targetLang: string) {
    const target = LOCALES[targetLang] || LOCALES.th;

    // Clone to avoid mutation
    const result = JSON.parse(JSON.stringify(content));

    // 1. Hero Labels (Standard ones)
    if (!result.heroContact || result.heroContact === "ติดต่อ" || result.heroContact === "Contact") {
        result.heroContact = target.hero?.contactButton || (targetLang === 'th' ? 'ติดต่อ' : 'Contact');
    }
    if (!result.heroStandard || result.heroStandard === "มาตรฐานของเรา" || result.heroStandard === "Our Standard") {
        result.heroStandard = target.hero?.standardButton || (targetLang === 'th' ? 'มาตรฐานของเรา' : 'Our Standard');
    }

    // 2. Navigation
    result.navAbout = target.header?.about;
    result.navServices = target.header?.services;
    result.navCustomers = target.header?.keyCustomers;
    result.navLookingFor = target.header?.lookingFor;
    result.navContact = target.header?.contact;

    // 3. Contact Section Labels
    if (result.contactData) {
        result.contactData.title = target.contact?.contactUs || target.contact?.title || (targetLang === 'th' ? "ติดต่อเรา" : "Contact Us");
        result.contactData.subtitle = target.contact?.getInTouch || target.contact?.subtitle || (targetLang === 'th' ? "ช่องทางการติดต่อ" : "Get in touch");
        // We don't translate the values (address/email) unless they were defaults
    }

    // 4. About Section Labels
    if (result.aboutData) {
        result.aboutData.visionBadge = target.about?.visionBadge || "VISION";
        result.aboutData.visionMission = target.about?.visionMission || "VISION & MISSION";
    }

    // 5. Services section title
    if (result.servicesData) {
        result.servicesData.title = target.services?.title || "Our Services";
        result.servicesData.subtitle = target.services?.subtitle || "Our Expertise";
    }

    // 6. Experience title
    if (result.experienceData) {
        result.experienceData.title = target.experience?.title || "Experience";
    }

    // 7. Clients labels
    if (result.clientsData) {
        result.clientsData.keyCustomersBadge = target.clients?.keyCustomersBadge || "CUSTOMERS";
        result.clientsData.keyCustomersTitle = target.clients?.keyCustomersTitle || "Trusted by";
        result.clientsData.lookingForBadge = target.clients?.lookingForBadge || "PARTNERS";
        result.clientsData.lookingForTitle = target.clients?.lookingForTitle || "Looking For";
    }

    return result;
}
