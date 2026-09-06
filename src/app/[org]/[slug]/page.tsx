import { notFound } from "next/navigation";
import { Metadata } from "next";
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
import ClassicLayout from "@/components/templates/ClassicLayout";
import BentoLayout from "@/components/templates/BentoLayout";
import MinimalLayout from "@/components/templates/MinimalLayout";
import DarkTechLayout from "@/components/templates/DarkTechLayout";
import GlassLayout from "@/components/templates/GlassLayout";
import { theme as defaultTheme } from "@/config/theme";
import { layout as defaultLayout } from "@/config/layout";
import { media as defaultMedia } from "@/config/media";
import { brand as defaultBrand } from "@/config/brand";

const BASE_URL = 'https://www.ceoprofile.site';

function toAbsoluteUrl(url: string | undefined | null): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

interface PageProps {
    params: Promise<{ org: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { org, slug } = await params;

    const profile = await prisma.profile.findFirst({
        where: {
            slug: { equals: slug, mode: 'insensitive' },
            organization: { slug: org },
        },
        include: {
            organization: true,
            translations: true,
        },
    });

    if (!profile) {
        return {
            title: "Profile Not Found",
        };
    }

    const translation = profile.translations[0];
    const tRaw = (translation as any) || {};
    
    const name = (tRaw.heroName || profile.fullName || "").trim();
    const company = (tRaw.heroTitle || profile.organization?.name || "").trim();
    const role = (tRaw.heroRole || profile.title || "").trim();
    
    const servicesData = tRaw.servicesData || {};
    const expertiseList = Array.isArray((servicesData as any)?.items) 
        ? (servicesData as any).items.map((i: any) => i.title).filter(Boolean)
        : [];
    const expertiseText = expertiseList.length > 0 ? expertiseList.slice(0, 3).join(", ") : "Executive Leadership";
    
    const pageTitle = `${name} | ${role} ${company} | ${expertiseText}`.replace(/\s+/g, ' ').trim();
    
    let visionDesc = "";
    if ((tRaw.aboutData as any)?.visionDesc1) {
        visionDesc = String((tRaw.aboutData as any).visionDesc1).substring(0, 120);
    }
    const pageDesc = `${name}, ${role} at ${company}. Expertise: ${expertiseText}. ${visionDesc}`.trim();

    const dbMediaConfig = (profile.mediaConfig as any) || {};
    const heroImageRaw = dbMediaConfig.heroImage || dbMediaConfig.logo || "";
    const heroImage = toAbsoluteUrl(heroImageRaw);
    const canonicalUrl = `${BASE_URL}/${org}/${slug}`;

    const languages: Record<string, string> = {
        'x-default': canonicalUrl,
        [translation?.lang || 'en']: canonicalUrl,
    };

    return {
        title: pageTitle,
        description: pageDesc,
        alternates: {
            canonical: canonicalUrl,
            languages,
        },
        openGraph: {
            title: pageTitle,
            description: pageDesc,
            url: canonicalUrl,
            siteName: "CEO Profile",
            images: heroImage ? [{ url: heroImage, width: 800, height: 600 }] : [],
            locale: translation?.lang || "en",
            type: "profile",
        },
        twitter: {
            card: "summary_large_image",
            title: pageTitle,
            description: pageDesc,
            images: heroImage ? [heroImage] : [],
        }
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const { org, slug } = await params;

    const profile = await prisma.profile.findFirst({
        where: {
            slug: { equals: slug, mode: 'insensitive' },
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

    // Since there's no reliable person/group ID in the schema,
    // we omit sibling profiles to prevent incorrect cross-person linking.
    const siblings: any[] = [];

    // Construct the actual language links available for this person
    // In the new system, we just link to the sibling.slug directly
    const availableLanguages = [
        { code: translation.lang.toUpperCase(), langCode: translation.lang, slug: profile.slug, isCurrent: true },
        ...siblings.map(s => {
            const siblingLang = s.translations[0]?.lang || "";
            return {
                code: siblingLang.toUpperCase() || "??",
                langCode: siblingLang,
                slug: s.slug,
                isCurrent: false
            };
        })
    ].filter(l => l.langCode !== "");

    // Sort to keep a consistent order
    const langOrder = ['TH', 'EN', 'CH', 'JP', 'HI', 'FR', 'IT', 'ES', 'DE', 'RU', 'FA', 'PT', 'BR', 'VI', 'LO', 'MY', 'PH', 'ID', 'KM'];

    availableLanguages.sort((a, b) => {
        const idxA = langOrder.indexOf(a.code);
        const idxB = langOrder.indexOf(b.code);
        return (idxA > -1 ? idxA : 99) - (idxB > -1 ? idxB : 99);
    });

    const tRaw = (translation as any) || {};

    // Standard static UI labels
    const defaultLabels = {
        header: { about: "About", services: "Services", keyCustomers: "Clients", lookingFor: "Looking For", contact: "Contact" },
        hero: { badge: "Founder & CEO", contactButton: "Contact Us", standardButton: "Our Standard" },
        about: { visionBadge: "VISION", visionMission: "VISION & MISSION" },
        services: { title: "Services", subtitle: "Our Professional Services" },
        experience: { title: "Experience" },
        clients: { keyCustomersBadge: "PARTNERS", keyCustomersTitle: "Key Customers", lookingForBadge: "COOPERATION", lookingForTitle: "Looking For" },
        contact: { contactUs: "Contact Us", getInTouch: "Get In Touch", officeLabel: "Office Address", mobileLabel: "Mobile Phone", emailLabel: "Email", websiteLabel: "Website", lineLabel: "Line ID", clickToAdd: "Click to add Line", preferEmail: "Prefer to email?" }
    };

    const pick = (...vals: (string | null | undefined)[]) =>
        vals.find(v => v != null && v !== "") ?? "";

    const aboutData = tRaw.aboutData || {};
    const servicesData = tRaw.servicesData || {};
    const experienceData = tRaw.experienceData || {};
    const clientsData = tRaw.clientsData || {};
    const contactData = tRaw.contactData || {};
    const footerData = tRaw.footerData || {};

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
        layout: { ...defaultLayout, ...(dbThemeConfig.layout || {}) },
        templateId: dbThemeConfig.templateId || "classic"
    };

    const layoutConfig = mergedThemeConfig.layout;

    const headerData = {
        about: pick(tRaw.navAbout, defaultLabels.header.about),
        services: pick(tRaw.navServices, defaultLabels.header.services),
        keyCustomers: pick(tRaw.navCustomers, defaultLabels.header.keyCustomers),
        lookingFor: pick(tRaw.navLookingFor, defaultLabels.header.lookingFor),
        contact: pick(tRaw.navContact, defaultLabels.header.contact),
        language: resolvedLang.toUpperCase(),
        langLink: `/${org}/${slug}`,
        logo: mergedMedia.logo,
        companyName: profile.organization.name || defaultBrand.companyName,
        plan: (profile.organization as any).user?.plan || "free",
        orgSlug: org,
        profileSlug: slug,
        availableLanguages,
    };

    const heroData = {
        name: pick(tRaw.heroName, profile.fullName),
        title: pick(tRaw.heroTitle, profile.organization.name),
        quote: pick(tRaw.heroQuote, profile.title),
        contactButton: pick(tRaw.heroContactBtn, tRaw.heroContact, defaultLabels.hero.contactButton),
        standardButton: pick(tRaw.heroStandardBtn, tRaw.heroStandard, defaultLabels.hero.standardButton),
        role: pick(tRaw.heroRole, profile.title),
        heroImage: mergedMedia.heroImage,
        backgroundPattern: mergedMedia.backgroundPattern,
        badges: mergedMedia.badges,
        heroGallery: mergedMedia.heroGallery,
        media: mergedMedia,
        lang: resolvedLang,
    };

    const aboutDataFormatted = {
        visionBadge: pick(aboutData.visionBadge, defaultLabels.about.visionBadge),
        visionMission: pick(aboutData.visionMission, defaultLabels.about.visionMission),
        visionTitle: pick(aboutData.visionTitle, ""),
        visionDesc1: pick(aboutData.visionDesc1, profile.title),
        visionDesc2: aboutData.visionDesc2 || "",
        signature: pick(aboutData.signature, profile.fullName),
        stats: aboutData.stats || [],
        trustText: aboutData.trustText || "",
        showStats: layoutConfig.showAboutStats ?? true,
    };

    const servicesDataFormatted = {
        title: pick(servicesData.title, defaultLabels.services.title),
        subtitle: pick(servicesData.subtitle, defaultLabels.services.subtitle),
        items: servicesData.items || [],
    };

    const experienceDataFormatted = {
        title: pick(experienceData.title, defaultLabels.experience.title),
        items: experienceData.items?.length > 0 ? experienceData.items : [],
    };

    const clientsDataFormatted = {
        keyCustomersBadge: pick(clientsData.keyCustomersBadge, defaultLabels.clients.keyCustomersBadge),
        keyCustomersTitle: pick(clientsData.keyCustomersTitle, defaultLabels.clients.keyCustomersTitle),
        lookingForBadge: pick(clientsData.lookingForBadge, defaultLabels.clients.lookingForBadge),
        lookingForTitle: pick(clientsData.lookingForTitle, defaultLabels.clients.lookingForTitle),
        lookingForDesc: clientsData.lookingForDesc || "",
        lookingForItems: clientsData.lookingForItems || [],
        growingTogether: clientsData.growingTogether || "",
        items: clientsData.items || [],
        associations: clientsData.associations || [],
    };

    const contactDataFormatted = {
        title: pick(contactData.title, defaultLabels.contact.contactUs),
        subtitle: pick(contactData.subtitle, defaultLabels.contact.getInTouch),
        officeLabel: defaultLabels.contact.officeLabel,
        officeValue: pick(contactData.office, contactData.officeValue, contactData.address),
        officePhoneLabel: "Office Phone",
        officePhoneValue: contactData.officePhone || "",
        mobileLabel: defaultLabels.contact.mobileLabel,
        mobileValue: pick(contactData.mobile, contactData.mobileValue, profile.phone1),
        emailLabel: defaultLabels.contact.emailLabel,
        emailValue: pick(contactData.email, contactData.emailValue, profile.email),
        websiteLabel: defaultLabels.contact.websiteLabel,
        websites: Array.isArray(contactData.websites) && contactData.websites.length > 0 ? contactData.websites : (pick(contactData.website, contactData.websiteValue, profile.website) ? [pick(contactData.website, contactData.websiteValue, profile.website)] : []),
        lineLabel: defaultLabels.contact.lineLabel,
        lineValue: "", // Removed Line ID
        clickToAdd: pick(contactData.clickToAdd, defaultLabels.contact.clickToAdd),
        clickToCall: "",
        preferEmail: pick(contactData.preferEmail, defaultLabels.contact.preferEmail),
    };

    const footerDataFormatted = {
        rights: footerData.rights || `© ${new Date().getFullYear()} ${profile.fullName}. All rights reserved.`,
        facebook: footerData.facebook || null,
        twitter: footerData.twitter || null,
        linkedin: footerData.linkedin || null,
    };

    const layoutProps = {
        themeConfig: mergedThemeConfig,
        resolvedLang,
        layoutConfig,
        headerData: headerData as any,
        heroData,
        aboutDataFormatted,
        servicesDataFormatted,
        experienceDataFormatted,
        clientsDataFormatted,
        contactDataFormatted,
        footerDataFormatted
    };

    const canonicalUrl = `${BASE_URL}/${org}/${slug}`;
    const sameAsLinks = [...(contactDataFormatted.websites || [])].map((url: string) => url.startsWith('http') ? url : `https://${url}`);
    if (footerDataFormatted.linkedin) sameAsLinks.push(footerDataFormatted.linkedin);
    if (footerDataFormatted.facebook) sameAsLinks.push(footerDataFormatted.facebook);
    if (footerDataFormatted.twitter) sameAsLinks.push(footerDataFormatted.twitter);

    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${canonicalUrl}#person`,
        "name": heroData.name,
        "alternateName": profile.fullName !== heroData.name ? profile.fullName : undefined,
        "description": aboutDataFormatted.visionDesc1 || heroData.quote || "",
        "image": toAbsoluteUrl(heroData.heroImage || heroData.media.logo),
        "url": canonicalUrl,
        "jobTitle": heroData.role || heroData.quote,
        "email": contactDataFormatted.emailValue || undefined,
        "telephone": contactDataFormatted.mobileValue || contactDataFormatted.officePhoneValue || undefined,
        "worksFor": {
            "@type": "Organization",
            "@id": `${BASE_URL}/${org}#organization`,
            "name": headerData.companyName || heroData.title,
            "url": `${BASE_URL}/${org}`,
            "logo": toAbsoluteUrl(headerData.logo)
        },
        "knowsAbout": servicesDataFormatted.items.map((i: any) => i.title).filter(Boolean),
        "sameAs": sameAsLinks.filter(Boolean)
    };

    const machineIntro = `${heroData.name} ${heroData.role} ${headerData.companyName} Expertise: ${servicesDataFormatted.items.map((i: any) => i.title).slice(0, 4).join(", ")}. ${aboutDataFormatted.visionDesc1 ? String(aboutDataFormatted.visionDesc1).substring(0, 150) : ""}`;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <div className="sr-only" aria-hidden="false">
                {machineIntro}
            </div>
            {mergedThemeConfig.templateId === 'bento' && <BentoLayout {...layoutProps} />}
            {mergedThemeConfig.templateId === 'minimal' && <MinimalLayout {...layoutProps} />}
            {mergedThemeConfig.templateId === 'darktech' && <DarkTechLayout {...layoutProps} />}
            {mergedThemeConfig.templateId === 'glass' && <GlassLayout {...layoutProps} />}
            {!['bento', 'minimal', 'darktech', 'glass'].includes(mergedThemeConfig.templateId) && <ClassicLayout {...layoutProps} />}
        </>
    );
}
