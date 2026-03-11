import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Source Profile (Original Good TH Data)
        const sourceProfileId = "cmm2pfb2r0002uotwckw731ys";
        // Target Org (User printconnext's manserv org)
        const targetOrgId = "cmmlf62oj000004joukv2o4z2";

        const sourceProfile = await prisma.profile.findUnique({
            where: { id: sourceProfileId },
            include: { translations: { where: { lang: "th" } } }
        });

        if (!sourceProfile) {
            return NextResponse.json({ error: "Source profile not found" }, { status: 404 });
        }

        const sourceTranslation = sourceProfile.translations[0];
        if (!sourceTranslation) {
            return NextResponse.json({ error: "Source translation (TH) not found" }, { status: 404 });
        }

        // 1. Create the new Profile in the target org
        const newProfile = await prisma.profile.create({
            data: {
                slug: "samarth-th", // Use lowercase for safety/standard
                orgId: targetOrgId,
                fullName: sourceProfile.fullName,
                title: sourceProfile.title,
                portraitUrl: sourceProfile.portraitUrl,
                phone1: sourceProfile.phone1,
                phone2: sourceProfile.phone2,
                email: sourceProfile.email,
                website: sourceProfile.website,
                lineUrl: sourceProfile.lineUrl,
                lineQrUrl: sourceProfile.lineQrUrl,
                isPublished: true,
                themeConfig: sourceProfile.themeConfig || {},
                mediaConfig: sourceProfile.mediaConfig || {},
            }
        });

        // 2. Clone the Translation
        await prisma.profileTranslation.create({
            data: {
                profileId: newProfile.id,
                lang: "th",
                heroBadge: sourceTranslation.heroBadge,
                heroName: sourceTranslation.heroName,
                heroTitle: sourceTranslation.heroTitle,
                heroQuote: sourceTranslation.heroQuote,
                heroContact: sourceTranslation.heroContact,
                heroStandard: sourceTranslation.heroStandard,
                heroRole: sourceTranslation.heroRole,
                navAbout: sourceTranslation.navAbout,
                navServices: sourceTranslation.navServices,
                navCustomers: sourceTranslation.navCustomers,
                navLookingFor: sourceTranslation.navLookingFor,
                navContact: sourceTranslation.navContact,
                aboutData: sourceTranslation.aboutData || {},
                servicesData: sourceTranslation.servicesData || {},
                clientsData: sourceTranslation.clientsData || {},
                contactData: sourceTranslation.contactData || {},
                footerData: sourceTranslation.footerData || {},
                experienceData: sourceTranslation.experienceData || {},
                heroContactBtn: sourceTranslation.heroContactBtn,
                heroStandardBtn: sourceTranslation.heroStandardBtn,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Recreated profile and restored 100% Thai data.",
            profileId: newProfile.id,
            slug: newProfile.slug
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
