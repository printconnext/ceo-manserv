import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Target Profile (The one we are restoring)
        const targetProfileId = "cmmmkheix0007oktwwa6c0j9q";
        // Source Profile (Original Good Samart Data - Absolutely NO Nat data)
        const sourceProfileId = "cmm2pfb2r0002uotwckw731ys";

        const sourceProfile = await prisma.profile.findUnique({
            where: { id: sourceProfileId },
            include: { translations: { where: { lang: "th" } } }
        });

        if (!sourceProfile) {
            return NextResponse.json({ error: "Source Samart profile not found" }, { status: 404 });
        }

        const sourceTrans = sourceProfile.translations[0];

        // 1. Update Core Profile (Samart's Identity Only)
        await prisma.profile.update({
            where: { id: targetProfileId },
            data: {
                fullName: sourceProfile.fullName,
                title: sourceProfile.title,
                portraitUrl: sourceProfile.portraitUrl,
                phone1: sourceProfile.phone1,
                phone2: sourceProfile.phone2,
                email: sourceProfile.email,
                website: sourceProfile.website,
                lineUrl: sourceProfile.lineUrl,
                lineQrUrl: sourceProfile.lineQrUrl,
                themeConfig: sourceProfile.themeConfig || {},
                mediaConfig: sourceProfile.mediaConfig || {},
            }
        });

        // 2. Update Thai Translation (Pure Copy from Samart)
        await prisma.profileTranslation.update({
            where: { profileId_lang: { profileId: targetProfileId, lang: "th" } },
            data: {
                heroBadge: sourceTrans.heroBadge,
                heroName: sourceTrans.heroName,
                heroTitle: sourceTrans.heroTitle,
                heroQuote: sourceTrans.heroQuote,
                heroRole: sourceTrans.heroRole,
                heroContact: sourceTrans.heroContact,
                heroStandard: sourceTrans.heroStandard,
                navAbout: sourceTrans.navAbout,
                navServices: sourceTrans.navServices,
                navCustomers: sourceTrans.navCustomers,
                navLookingFor: sourceTrans.navLookingFor,
                navContact: sourceTrans.navContact,
                aboutData: sourceTrans.aboutData || {},
                servicesData: sourceTrans.servicesData || {},
                clientsData: sourceTrans.clientsData || {},
                contactData: sourceTrans.contactData || {},
                footerData: sourceTrans.footerData || {},
                experienceData: sourceTrans.experienceData || {},
                heroContactBtn: sourceTrans.heroContactBtn,
                heroStandardBtn: sourceTrans.heroStandardBtn,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Samart Identity fully restored. Nat's personal data has been purged from this profile."
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
