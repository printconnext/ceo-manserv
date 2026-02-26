import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Map lang codes to flag labels for the dropdown
const langMap: Record<string, string> = {
    en: "EN",
    th: "TH",
    ja: "JA",
    zh: "ZH",
    hi: "HI",
    gb: "EN", // alias
};

interface PageProps {
    params: Promise<{ org: string; person: string; lang: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
    const { org, person, lang } = await params;

    // Resolve lang alias
    const resolvedLang = lang === "gb" ? "en" : lang;

    // Fetch profile + translation from database
    const profile = await prisma.profile.findFirst({
        where: {
            slug: person,
            organization: { slug: org },
        },
        include: {
            organization: true,
            translations: {
                where: { lang: resolvedLang },
            },
        },
    });

    if (!profile || profile.translations.length === 0) {
        notFound();
    }

    const translation = profile.translations[0];
    const aboutData = translation.aboutData as any;
    const servicesData = translation.servicesData as any;
    const clientsData = translation.clientsData as any;
    const contactData = translation.contactData as any;
    const footerData = translation.footerData as any;

    // Build data objects matching the existing component interfaces
    const headerData = {
        about: translation.navAbout || "About",
        services: translation.navServices || "Services",
        keyCustomers: translation.navCustomers || "Key Customers",
        lookingFor: translation.navLookingFor || "Looking For",
        contact: translation.navContact || "Contact",
        language: langMap[lang] || lang.toUpperCase(),
        langLink: `/${org}/${person}/${lang}`,
    };

    const heroData = {
        badge: translation.heroBadge || "",
        name: translation.heroName || profile.fullName,
        title: translation.heroTitle || profile.organization.name,
        quote: translation.heroQuote || "",
        contactMe: translation.heroContact || "Contact",
        ourStandard: translation.heroStandard || "Our Standard",
        role: translation.heroRole || profile.title || "CEO",
    };

    const aboutDataFormatted = {
        visionBadge: aboutData?.visionBadge || "",
        visionTitle: aboutData?.visionTitle || "",
        visionDesc1: aboutData?.visionDesc1 || "",
        visionDesc2: aboutData?.visionDesc2 || "",
        signature: aboutData?.signature || "",
        stats: aboutData?.stats || [],
        trustText: aboutData?.trustText || "",
    };

    const servicesDataFormatted = {
        title: servicesData?.title || "",
        subtitle: servicesData?.subtitle || "",
        items: servicesData?.items || [],
    };

    const clientsDataFormatted = {
        keyCustomersBadge: clientsData?.keyCustomersBadge || "",
        keyCustomersTitle: clientsData?.keyCustomersTitle || "",
        lookingForBadge: clientsData?.lookingForBadge || "",
        lookingForTitle: clientsData?.lookingForTitle || "",
        lookingForDesc: clientsData?.lookingForDesc || "",
        lookingForItems: clientsData?.lookingForItems || [],
        growingTogether: clientsData?.growingTogether || "",
    };

    const contactDataFormatted = {
        title: contactData?.title || "",
        subtitle: contactData?.subtitle || "",
        office: contactData?.office || "",
        mobile: contactData?.mobile || "",
        email: contactData?.email || "",
        website: contactData?.website || "",
        lineTitle: contactData?.lineTitle || "",
        clickToAdd: contactData?.clickToAdd || "",
        clickToCall: contactData?.clickToCall || "",
        preferEmail: contactData?.preferEmail || "",
    };

    const footerDataFormatted = {
        rights: footerData?.rights || "CEO Profile. All rights reserved.",
    };

    return (
        <div className={`flex flex-col min-h-screen lang-${resolvedLang}`}>
            <Header data={headerData} />
            <main className="flex-grow">
                <Hero data={heroData} />
                <About data={aboutDataFormatted} />
                <Services data={servicesDataFormatted} />
                <Clients data={clientsDataFormatted} />
                <Contact data={contactDataFormatted} />
            </main>
            <Footer data={footerDataFormatted} />
        </div>
    );
}
