import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Target Profile (The one the user is looking at)
        const targetProfileId = "cmmmkheix0007oktwwa6c0j9q";

        // Source 1: Bio/Hero Text (Samart)
        const textSourceId = "cmm2pfb2r0002uotwckw731ys";
        // Source 2: Media/Contact (Nat-TH)
        const mediaSourceId = "cmmlwvwmb000004jmrt3o6sey";

        const textProfile = await prisma.profile.findUnique({
            where: { id: textSourceId },
            include: { translations: { where: { lang: "th" } } }
        });

        const mediaProfile = await prisma.profile.findUnique({
            where: { id: mediaSourceId },
            include: { translations: { where: { lang: "th" } } }
        });

        if (!textProfile || !mediaProfile) {
            return NextResponse.json({ error: "Source profiles not found" }, { status: 404 });
        }

        const textTrans = textProfile.translations[0];
        const mediaTrans = mediaProfile.translations[0];

        // 1. Update Profile fields (URLs and core info)
        await prisma.profile.update({
            where: { id: targetProfileId },
            data: {
                portraitUrl: mediaProfile.portraitUrl || textProfile.portraitUrl,
                phone1: mediaProfile.phone1 || textProfile.phone1,
                phone2: mediaProfile.phone2 || textProfile.phone2,
                email: mediaProfile.email || textProfile.email,
                website: mediaProfile.website || textProfile.website,
                lineUrl: mediaProfile.lineUrl || textProfile.lineUrl,
                lineQrUrl: mediaProfile.lineQrUrl || textProfile.lineQrUrl,
                themeConfig: mediaProfile.themeConfig || textProfile.themeConfig || {},
                mediaConfig: mediaProfile.mediaConfig || textProfile.mediaConfig || {},
            }
        });

        // 2. Update Translation (Merge Text + Contact Data)
        await prisma.profileTranslation.update({
            where: { profileId_lang: { profileId: targetProfileId, lang: "th" } },
            data: {
                // Text from Samart
                heroBadge: textTrans.heroBadge,
                heroName: textTrans.heroName,
                heroTitle: textTrans.heroTitle,
                heroQuote: textTrans.heroQuote,
                heroRole: textTrans.heroRole,
                heroContact: textTrans.heroContact,
                heroStandard: textTrans.heroStandard,
                navAbout: textTrans.navAbout,
                navServices: textTrans.navServices,
                navCustomers: textTrans.navCustomers,
                navLookingFor: textTrans.navLookingFor,
                navContact: textTrans.navContact,
                aboutData: textTrans.aboutData || {},
                servicesData: textTrans.servicesData || {},
                clientsData: textTrans.clientsData || {},
                footerData: textTrans.footerData || {},

                // Contact/Media from Nat-TH (Actual values)
                contactData: mediaTrans?.contactData || textTrans.contactData || {},
                experienceData: mediaTrans?.experienceData || textTrans.experienceData || {},

                // Extra fields
                heroContactBtn: textTrans.heroContactBtn,
                heroStandardBtn: textTrans.heroStandardBtn,
            }
        });

        return NextResponse.json({
            success: true,
            message: "100% Full Merge Restoration Complete."
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
