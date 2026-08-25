import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { sourceId, newName, newSlug } = body;

        if (!sourceId || !newName || !newSlug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Fetch source profile and its translations
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

        // 2. Determine base slug
        const baseSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/\s+/g, "-");

        // Check limits for Free/Pro
        const plan = (session.user as any).plan || "free";
        const orgProfilesCount = await prisma.profile.count({
            where: { orgId: sourceProfile.orgId }
        });

        if (plan === "free" && orgProfilesCount >= 1) {
            return NextResponse.json({ error: "Free plan is limited to 1 profile per organization." }, { status: 403 });
        }
        if (plan === "pro" && orgProfilesCount >= 3) {
            return NextResponse.json({ error: "Pro plan is limited to 3 profiles per organization." }, { status: 403 });
        }

        // 3. Perform cloning in a transaction
        const result = await prisma.$transaction(async (tx) => {
            
            // For each language the source has, we need to create a profile and a translation
            // But wait, the Profile model has a unique slug. 
            // In the current system, a "Person" is a collection of profiles with different lang suffixes (e.g. name-th, name-en).
            // So we need to clone all languages.
            
            let firstProfileId = "";
            let firstLang = "th";

            for (const sourceTrans of sourceProfile.translations) {
                const lang = sourceTrans.lang;
                const clonedSlug = `${baseSlug}-${lang}`;

                // Check if slug exists
                const existing = await tx.profile.findFirst({
                    where: { slug: clonedSlug, orgId: sourceProfile.orgId }
                });

                if (existing) {
                    throw new Error(`Profile URL "${clonedSlug}" already exists.`);
                }

                // Create new profile record for this language
                const newProfile = await tx.profile.create({
                    data: {
                        orgId: sourceProfile.orgId,
                        slug: clonedSlug,
                        fullName: newName,
                        title: sourceProfile.title,
                        portraitUrl: sourceProfile.portraitUrl, // Copy photo (can be changed later)
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

                if (!firstProfileId) {
                    firstProfileId = newProfile.id;
                    firstLang = lang;
                }

                // Clone the translation content
                const { id, profileId, lang: oldLang, ...contentToClone } = sourceTrans;

                await tx.profileTranslation.create({
                    data: {
                        ...(contentToClone as any),
                        profileId: newProfile.id,
                        lang: lang,
                        heroName: newName, // Replace hero name with the new person's name
                    }
                });
            }

            return { id: firstProfileId, firstLang };
        });

        return NextResponse.json({
            success: true,
            profile: { id: result.id },
            firstLang: result.firstLang
        });

    } catch (error: any) {
        console.error("[API/Clone] Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
