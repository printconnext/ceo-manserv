
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { translateProfileContent, translateProfileSettings } from "@/lib/translator";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const referer = req.headers.get("referer") || undefined;
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

        // 2. Determine base slug (remove existing lang suffix if any)
        const baseSlug = sourceProfile.slug.split('-')[0].toLowerCase();
        const newSlug = `${baseSlug}-${targetLang.toLowerCase()}`;

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

        // 3. Perform duplication in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Translate core profile data (Name and Title/Company)
            const translatedSettings = await translateProfileSettings(
                { fullName: sourceProfile.fullName || "", title: sourceProfile.title || "" },
                targetLang.toLowerCase(),
                referer
            );

            // Create new profile record
            const newProfile = await tx.profile.create({
                data: {
                    orgId: sourceProfile.orgId,
                    slug: newSlug,
                    fullName: sourceProfile.fullName, // Keep original name for linking
                    title: translatedSettings.title,
                    portraitUrl: sourceProfile.portraitUrl,
                    phone1: sourceProfile.phone1,
                    phone2: sourceProfile.phone2,
                    email: sourceProfile.email,
                    website: sourceProfile.website,
                    lineUrl: sourceProfile.lineUrl,
                    lineQrUrl: sourceProfile.lineQrUrl,
                    isPublished: sourceProfile.isPublished,
                    themeConfig: sourceProfile.themeConfig || {},
                    mediaConfig: sourceProfile.mediaConfig || {},
                }
            });

            // Clone and Translate content
            // Try to find translation matching source profile's current slug suffix, fallback to first
            const sourceSlugParts = sourceProfile.slug.split('-');
            const sourceLang = sourceSlugParts.length > 1 ? sourceSlugParts.pop()?.toLowerCase() : null;
            
            const sourceTrans = sourceProfile.translations.find(t => t.lang === sourceLang) || sourceProfile.translations[0];

            if (sourceTrans) {
                const translatedData = await translateProfileContent(sourceTrans, targetLang.toLowerCase(), referer);

                // Remove database-specific fields from the clone target
                const { id, profileId, lang, ...contentToClone } = translatedData;

                await tx.profileTranslation.create({
                    data: {
                        ...contentToClone,
                        profileId: newProfile.id,
                        lang: targetLang.toLowerCase(),
                        heroName: translatedSettings.fullName,
                        heroTitle: contentToClone.heroTitle, // Keep the translated company name from content
                        heroRole: translatedSettings.title,  // Use the translated position for heroRole
                    }
                });
            }

            console.log(`[API/Duplicate] Successfully created profile ${newProfile.id} for ${targetLang}`);
            return newProfile;
        });

        const profileUrl = `/${sourceProfile.organization.slug}/${newSlug}`;

        return NextResponse.json({
            success: true,
            profile: result,
            profileUrl
        });

    } catch (error: any) {
        console.error("[API/Duplicate] Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
