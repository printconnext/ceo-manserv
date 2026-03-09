import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/profile/content - Retrieve the current user's translated content
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lang = req.nextUrl.searchParams.get("lang") || "th";
    const profileId = req.nextUrl.searchParams.get("id");

    try {
        let profile;
        if (profileId) {
            profile = await prisma.profile.findFirst({
                where: { id: profileId, organization: { userId: session.user.id } },
                include: { organization: true }
            });
        } else {
            const organization = await prisma.organization.findFirst({
                where: { userId: session.user.id },
                include: { profiles: { take: 1 }, }
            });
            profile = organization?.profiles?.[0] ? { ...organization.profiles[0], organization } : null;
        }

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const allOrgProfiles = await prisma.profile.findMany({
            where: { orgId: profile.orgId },
            include: { translations: { select: { lang: true } } }
        });
        const existingLangs = Array.from(new Set(allOrgProfiles.flatMap(p => p.translations.map(t => t.lang))));

        const translation = await prisma.profileTranslation.findUnique({
            where: {
                profileId_lang: {
                    profileId: profile.id,
                    lang: lang
                }
            }
        });

        if (!translation) {
            // If translation doesn't exist, return empty config so the frontend can fallback
            return NextResponse.json({
                content: {},
                existingLangs,
                profileMetadata: {
                    orgSlug: (profile as any).organization?.slug,
                    profileSlug: profile.slug
                },
                profileData: {
                    lineUrl: profile.lineUrl,
                    phone1: profile.phone1,
                    email: profile.email,
                    website: profile.website,
                }
            });
        }

        return NextResponse.json({
            content: translation,
            existingLangs,
            profileMetadata: {
                orgSlug: (profile as any).organization?.slug,
                profileSlug: profile.slug
            },
            profileData: {
                lineUrl: profile.lineUrl,
                phone1: profile.phone1,
                email: profile.email,
                website: profile.website,
            }
        });
    } catch (error) {
        console.error("[API] Error fetching content:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/profile/content - Update the translated content
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { lang, content, id: profileId } = body;

        console.log("[API/Content] POST request received", { lang, profileId });

        // Fetch current plan status from database to avoid stale session data
        console.log("[API/Content] Fetching user plan for ID:", session.user.id);
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { plan: true }
        });
        const currentPlan = dbUser?.plan || "free";
        console.log("[API/Content] Current plan from DB:", currentPlan);

        // Enforce 1-language limit for free users
        if (currentPlan === "free" && lang !== "th") {
            console.warn("[API/Content] Free account restriction triggered for lang:", lang);
            return NextResponse.json(
                { error: "Free accounts are limited to Thai language only." },
                { status: 403 }
            );
        }

        let profile;
        if (profileId) {
            console.log("[API/Content] Looking for profile by ID:", profileId);
            profile = await prisma.profile.findFirst({
                where: { id: profileId, organization: { userId: session.user.id } }
            });
        } else {
            console.log("[API/Content] Looking for default profile for user:", session.user.id);
            const organization = await prisma.organization.findFirst({
                where: { userId: session.user.id },
                include: { profiles: true }
            });
            profile = organization?.profiles?.[0];
        }

        if (!profile || !profile.id) {
            console.error("[API/Content] Profile or Profile ID not found for request");
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        console.log("[API/Content] Upserting translation for profileId:", profile.id, "lang:", lang);

        // Use an explicit allow-list of fields from the Prisma schema
        // This prevents "Unknown argument" errors if the editor sends extra fields
        const allowedFields = [
            "heroBadge", "heroName", "heroTitle", "heroQuote", "heroContact",
            "heroContactBtn", "heroStandard", "heroStandardBtn", "heroRole",
            "navAbout", "navServices", "navCustomers", "navLookingFor", "navContact",
            "aboutData", "servicesData", "experienceData", "clientsData",
            "contactData", "footerData"
        ];

        const sanitizedContent: any = {};
        for (const field of allowedFields) {
            if (content[field] !== undefined) {
                sanitizedContent[field] = content[field];
            }
        }

        try {
            console.log("[API/Content] Payload keys:", Object.keys(sanitizedContent));
            const updatedTranslation = await prisma.profileTranslation.upsert({
                where: {
                    profileId_lang: {
                        profileId: profile.id,
                        lang: lang
                    }
                },
                create: {
                    profileId: profile.id,
                    lang: lang,
                    ...sanitizedContent
                },
                update: {
                    ...sanitizedContent
                }
            });
            console.log("[API/Content] Upsert successful for profileId:", profile.id);
            return NextResponse.json({ success: true, translation: updatedTranslation });
        } catch (upsertError: any) {
            console.error("[API/Content] Prisma Upsert Error Detail:", {
                message: upsertError.message,
                code: upsertError.code,
                meta: upsertError.meta,
                target: profile.id
            });
            return NextResponse.json(
                { error: `Database error: ${upsertError.message}` },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("[API/Content] CRITICAL POST ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
