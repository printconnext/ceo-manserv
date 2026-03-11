
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { translateProfileContent } from "@/lib/translator";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { sourceId, targetLang } = body;

        if (!sourceId || !targetLang) {
            return NextResponse.json({ error: "Missing sourceId or targetLang" }, { status: 400 });
        }

        // 1. Fetch source profile
        const sourceProfile = await prisma.profile.findUnique({
            where: { id: sourceId },
            include: { translations: true, organization: true }
        });

        if (!sourceProfile) {
            return NextResponse.json({ error: "Source profile not found" }, { status: 404 });
        }

        // Verify ownership
        if (sourceProfile.organization.userId !== session.user.id) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        // 2. Determine new slug (e.g. samath-TH -> samath-EN)
        const baseSlug = sourceProfile.slug.replace(/-(TH|EN|CH|JP|LO|HI|FR|IT|ES|DE|RU|FA|PT|BR|VI|MY|PH|ID)$/i, "");
        const newSlug = `${baseSlug}-${targetLang.toUpperCase()}`;

        // Check if already exists
        const existing = await prisma.profile.findFirst({
            where: {
                slug: newSlug,
                orgId: sourceProfile.orgId
            }
        });

        if (existing) {
            return NextResponse.json({ error: `Profile for ${targetLang.toUpperCase()} already exists.` }, { status: 409 });
        }

        // 3. Create new profile record (metadata clone)
        const newProfile = await prisma.profile.create({
            data: {
                orgId: sourceProfile.orgId,
                slug: newSlug,
                fullName: sourceProfile.fullName,
                title: sourceProfile.title,
                phone1: sourceProfile.phone1,
                phone2: sourceProfile.phone2,
                email: sourceProfile.email,
                website: sourceProfile.website,
                lineUrl: sourceProfile.lineUrl,
                themeConfig: sourceProfile.themeConfig || {},
                mediaConfig: sourceProfile.mediaConfig || {},
            }
        });

        // 4. Clone and Translate first found translation
        const sourceTrans = sourceProfile.translations[0];
        if (sourceTrans) {
            const translatedData = translateProfileContent(sourceTrans, targetLang.toLowerCase());

            await prisma.profileTranslation.create({
                data: {
                    profileId: newProfile.id,
                    lang: targetLang.toLowerCase(),
                    heroBadge: translatedData.heroBadge || "",
                    heroName: translatedData.heroName || "",
                    heroTitle: translatedData.heroTitle || "",
                    heroQuote: translatedData.heroQuote || "",
                    heroContact: translatedData.heroContact || "",
                    heroContactBtn: translatedData.heroContactBtn || "",
                    heroStandard: translatedData.heroStandard || "",
                    heroStandardBtn: translatedData.heroStandardBtn || "",
                    heroRole: translatedData.heroRole || "",
                    navAbout: translatedData.navAbout || "",
                    navServices: translatedData.navServices || "",
                    navCustomers: translatedData.navCustomers || "",
                    navLookingFor: translatedData.navLookingFor || "",
                    navContact: translatedData.navContact || "",
                    aboutData: translatedData.aboutData || {},
                    servicesData: translatedData.servicesData || {},
                    experienceData: translatedData.experienceData || {},
                    clientsData: translatedData.clientsData || {},
                    contactData: translatedData.contactData || {},
                    footerData: translatedData.footerData || {},
                }
            });
        }

        const profileUrl = `/${sourceProfile.organization.slug}/${baseSlug}/${targetLang.toLowerCase()}`;

        return NextResponse.json({
            success: true,
            profile: newProfile,
            profileUrl
        });

    } catch (error: any) {
        console.error("[API/Duplicate] Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
