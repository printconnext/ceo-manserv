import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { theme as defaultTheme } from "@/config/theme";
import { layout as defaultLayout } from "@/config/layout";
import { media as defaultMedia } from "@/config/media";
import { brand as defaultBrand } from "@/config/brand";

// Import TypeScript-based locales
import { th } from "@/data/locales/th";
import { en } from "@/data/locales/en";
import { ch } from "@/data/locales/ch";
import { jp } from "@/data/locales/jp";
import { hi } from "@/data/locales/hi";
import { fr } from "@/data/locales/fr";
import { it } from "@/data/locales/it";
import { es } from "@/data/locales/es";
import { de } from "@/data/locales/de";
import { ru } from "@/data/locales/ru";
import { fa } from "@/data/locales/fa";
import { pt } from "@/data/locales/pt";
import { br } from "@/data/locales/br";
import { vi } from "@/data/locales/vi";
import { lo } from "@/data/locales/lo";
import { my } from "@/data/locales/my";
import { ph } from "@/data/locales/ph";
import { id } from "@/data/locales/id";


const LOCALES: Record<string, any> = { th, en, ch, jp, hi, fr, it, es, de, ru, fa, pt, br, vi, lo, my, ph, id };


interface PageProps {
    params: Promise<{ org: string; slug: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
    const { org, slug } = await params;

    const profile = await prisma.profile.findFirst({
        where: {
            slug: slug,
            organization: { slug: org },
        },
        include: {
            organization: {
                include: {
                    user: {
                        select: { plan: true }
                    }
                }
            },
            translations: true,
        },
    });

    if (!profile) {
        notFound();
    }

    // Identify the language from the translation (each profile record now has exactly ONE)
    const translation = profile.translations[0];
    if (!translation) {
        notFound();
    }
    const resolvedLang = translation.lang;

    // Fetch sibling profiles (same person in other languages) to populate language switcher
    // We identify them by having the same fullName in the same organization
    const siblings = await prisma.profile.findMany({
        where: {
            orgId: profile.orgId,
            fullName: profile.fullName,
            id: { not: profile.id }
        },
        include: {
            translations: { select: { lang: true } }
        }
    });

    // Construct the actual language links available for this person
    const availableLanguages = [
        { code: translation.lang.toUpperCase(), langCode: translation.lang, slug: profile.slug, isCurrent: true },
        ...siblings.map(s => ({
            code: s.translations[0]?.lang?.toUpperCase() || "??",
            langCode: s.translations[0]?.lang || "",
            slug: s.slug,
            isCurrent: false
        }))
    ].filter(l => l.langCode !== "");

    // Sort to keep a consistent order (e.g. TH, EN, JP, CH)
    const langOrder = ['TH', 'EN', 'CH', 'JP', 'HI', 'FR', 'IT', 'ES', 'DE', 'RU', 'FA', 'PT', 'BR', 'VI', 'LO', 'MY', 'PH', 'ID'];

    availableLanguages.sort((a, b) => {
        const idxA = langOrder.indexOf(a.code);
        const idxB = langOrder.indexOf(b.code);
        return (idxA > -1 ? idxA : 99) - (idxB > -1 ? idxB : 99);
    });

    // Load static UI labels for fallbacks from the integrated locale system
    const baseContent = LOCALES[resolvedLang] || LOCALES.th;

    const tRaw = (translation as any) || {};

    // Helper: pick first non-null/undefined/empty value in priority order
    const pick = (...vals: (string | null | undefined)[]) =>
        vals.find(v => v != null && v !== "") ?? "";

    // Section data
    const aboutData = tRaw.aboutData || {};
    const servicesData = tRaw.servicesData || {};
    const experienceData = tRaw.experienceData || {};
    const clientsData = tRaw.clientsData || {};
    const contactData = tRaw.contactData || {};
    const footerData = tRaw.footerData || {};

    // Extract configs
    const dbThemeConfig = (profile.themeConfig as any) || {};
    const dbMediaConfig = (profile.mediaConfig as any) || {};

    const mergedMedia = {
        logo: dbMediaConfig.logo || defaultMedia.logo,
        heroImage: dbMediaConfig.heroImage || defaultMedia.heroImage,
        backgroundPattern: dbMediaConfig.backgroundPattern || defaultMedia.backgroundPattern,
        badges: dbMediaConfig.badges || defaultMedia.badges,
        heroGallery: dbMediaConfig.heroGallery || defaultMedia.heroGallery
    };

    const mergedThemeConfig = {
        colors: { ...defaultTheme.colors, ...(dbThemeConfig.colors || {}) },
        font: { ...defaultTheme.font, ...(dbThemeConfig.font || {}) },
        borderRadius: dbThemeConfig.borderRadius || defaultTheme.borderRadius,
        buttonStyle: dbThemeConfig.buttonStyle || defaultTheme.buttonStyle,
        layout: { ...defaultLayout, ...(dbThemeConfig.layout || {}) }
    };

    const layoutConfig = mergedThemeConfig.layout;

    const headerData = {
        about: pick(tRaw.navAbout, baseContent.header?.about),
        services: pick(tRaw.navServices, baseContent.header?.services),
        keyCustomers: pick(tRaw.navCustomers, baseContent.header?.keyCustomers),
        lookingFor: pick(tRaw.navLookingFor, baseContent.header?.lookingFor),
        contact: pick(tRaw.navContact, baseContent.header?.contact),
        language: resolvedLang.toUpperCase(),
        langLink: `/${org}/${slug}`,
        logo: mergedMedia.logo,
        companyName: profile.organization.name || defaultBrand.companyName,
        plan: (profile.organization as any).user?.plan || "free",
        orgSlug: org,
        profileSlug: slug,
        availableLanguages, // Passed to handle the smart switcher
    };

    const heroData = {
        badge: pick(tRaw.heroBadge, baseContent.hero.badge),
        name: pick(tRaw.heroName, profile.fullName),
        title: pick(tRaw.heroTitle, profile.organization.name),
        quote: pick(tRaw.heroQuote, profile.title),
        contactButton: pick(tRaw.heroContactBtn, tRaw.heroContact, baseContent.hero.contactButton),
        standardButton: pick(tRaw.heroStandardBtn, tRaw.heroStandard, baseContent.hero.standardButton),
        role: pick(tRaw.heroRole, profile.title),
        heroImage: mergedMedia.heroImage,
        backgroundPattern: mergedMedia.backgroundPattern,
        badges: mergedMedia.badges,
        heroGallery: mergedMedia.heroGallery,
        media: mergedMedia,
    };

    const aboutDataFormatted = {
        visionBadge: pick(aboutData.visionBadge, baseContent.about?.visionBadge || "VISION"),
        visionMission: pick(aboutData.visionMission, baseContent.about?.visionMission || "VISION & MISSION"),
        visionTitle: pick(aboutData.visionTitle, ""),
        visionDesc1: pick(aboutData.visionDesc1, profile.title),
        visionDesc2: aboutData.visionDesc2 || "",
        signature: pick(aboutData.signature, profile.fullName),
        stats: aboutData.stats || [],
        trustText: aboutData.trustText || "",
        showStats: layoutConfig.showAboutStats ?? true,
    };

    const servicesDataFormatted = {
        title: pick(servicesData.title, baseContent.services?.title),
        subtitle: pick(servicesData.subtitle, baseContent.services?.subtitle),
        items: servicesData.items || [],
    };

    const experienceDataFormatted = {
        title: pick(experienceData.title, baseContent.experience?.title),
        items: experienceData.items?.length > 0 ? experienceData.items : [],
    };

    const clientsDataFormatted = {
        keyCustomersBadge: pick(clientsData.keyCustomersBadge, baseContent.clients?.keyCustomersBadge),
        keyCustomersTitle: pick(clientsData.keyCustomersTitle, baseContent.clients?.keyCustomersTitle),
        lookingForBadge: pick(clientsData.lookingForBadge, baseContent.clients?.lookingForBadge),
        lookingForTitle: pick(clientsData.lookingForTitle, baseContent.clients?.lookingForTitle),
        lookingForDesc: clientsData.lookingForDesc || "",
        lookingForItems: clientsData.lookingForItems || [],
        growingTogether: clientsData.growingTogether || "",
        items: clientsData.items || [],
        associations: clientsData.associations || [],
    };

    const contactDataFormatted = {
        title: pick(contactData.title, baseContent.contact?.contactUs || baseContent.contact?.title),
        subtitle: pick(contactData.subtitle, baseContent.contact?.getInTouch || baseContent.contact?.subtitle),
        officeLabel: baseContent.contact?.officeLabel || "Office Address",
        officeValue: pick(contactData.office, profile.organization.name),
        mobileLabel: baseContent.contact?.mobileLabel || "Mobile Phone",
        mobileValue: pick(contactData.mobile, profile.phone1),
        emailLabel: baseContent.contact?.emailLabel || "Email",
        emailValue: pick(contactData.email, profile.email),
        websiteLabel: baseContent.contact?.websiteLabel || "Website",
        websiteValue: pick(contactData.website, profile.website),
        lineLabel: baseContent.contact?.lineLabel || "Line ID / Add Line Link",
        lineValue: pick(contactData.lineTitle, profile.lineUrl),
        clickToAdd: pick(contactData.clickToAdd, baseContent.contact?.clickToAdd),
        clickToCall: "",
        preferEmail: pick(contactData.preferEmail, baseContent.contact?.preferEmail),
    };


    const footerDataFormatted = {
        rights: footerData.rights || `© ${new Date().getFullYear()} ${profile.fullName}. All rights reserved.`,
        facebook: footerData.facebook || null,
        twitter: footerData.twitter || null,
        linkedin: footerData.linkedin || null,
    };

    return (
        <ThemeProvider themeConfig={mergedThemeConfig} className={`flex flex-col min-h-screen lang-${resolvedLang}`}>
            <Header data={headerData as any} />
            <main className="flex-grow">
                {layoutConfig.showHero && <Hero data={heroData} />}
                {layoutConfig.showAbout && <About data={aboutDataFormatted} />}
                {layoutConfig.showServices && <Services data={servicesDataFormatted} />}
                {layoutConfig.showExperience && <Experience data={experienceDataFormatted} />}
                {layoutConfig.showClients && <Clients data={clientsDataFormatted} />}
                {layoutConfig.showContact && <Contact data={contactDataFormatted} />}
            </main>
            <Footer data={footerDataFormatted} />
        </ThemeProvider>
    );
}
