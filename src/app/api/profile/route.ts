import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { LANG_NAMES } from "@/data/locales";
import { translateProfileContent, translateProfileSettings } from "@/lib/translator";

// Reserved slugs that cannot be used as org slugs
const RESERVED_SLUGS = ["dashboard", "api", "auth", "admin", "settings"];

// GET /api/profile - Get current user's profile data
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileId = req.nextUrl.searchParams.get("id");

    try {
        let organization: any = null;

        if (profileId) {
            // When editing a specific profile, find the org it belongs to
            const targetProfile = await prisma.profile.findUnique({
                where: { id: profileId },
                select: { orgId: true, organization: { select: { userId: true } } }
            });

            if (targetProfile && targetProfile.organization.userId === session.user.id) {
                organization = await prisma.organization.findUnique({
                    where: { id: targetProfile.orgId },
                    include: {
                        profiles: {
                            orderBy: { createdAt: 'desc' },
                            include: { translations: true },
                        },
                        user: { select: { plan: true } }
                    },
                });
            }
        }

        if (!organization) {
            organization = await prisma.organization.findFirst({
                where: { userId: session.user.id },
                include: {
                    profiles: {
                        orderBy: { createdAt: 'desc' },
                        include: { translations: true },
                    },
                    user: { select: { plan: true } }
                },
            });
        }

        if (!organization) {
            return NextResponse.json({ organization: null });
        }

        // Tier-based logic for available languages
        const plan = organization.user?.plan || "free";
        const maxProfiles = plan === "free" ? 1 : (plan === "pro" ? 10 : 100); // Rough limits
        const existingLangs = organization.profiles.flatMap((p: any) => p.translations.map((t: any) => t.lang));
        const uniqueLangs: string[] = Array.from(new Set(existingLangs));

        // Define fallback/available languages based on tier
        const standardLangs = Object.keys(LANG_NAMES);

        let availableLangs = standardLangs;

        if (profileId) {
            // CASE: Editing specific profile record
            // RULE: Only show languages that have already been created for this organization/person
            availableLangs = uniqueLangs.length > 0 ? uniqueLangs : standardLangs;
        } else {
            // CASE: Creating NEW profile record
            if (plan === "free") {
                if (uniqueLangs.length > 0) {
                    // Free: Already has 1 profile record, cannot create more? 
                    // Actually, let's just empty availableLangs so they can't save.
                    availableLangs = [];
                } else {
                    // Free: First time, can pick any one.
                    availableLangs = standardLangs;
                }
            } else {
                // Diamond/Pro/Ultra: Can create any new language
                availableLangs = standardLangs;
            }
        }

        return NextResponse.json({
            organization,
            plan,
            availableLangs,
            latestProfile: organization.profiles[0] || null,
            profileCount: organization.profiles.length
        });
    } catch (error) {
        console.error("[API] Error fetching profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Generate a slug from text (latin chars only)
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        || "profile";
}

// Check if org_slug + profile_slug combination is globally unique
async function isSlugCombinationAvailable(
    orgSlug: string,
    profileSlug: string,
    excludeProfileId?: string
): Promise<boolean> {
    const existing = await prisma.profile.findFirst({
        where: {
            slug: profileSlug,
            organization: { slug: orgSlug },
            ...(excludeProfileId ? { id: { not: excludeProfileId } } : {}),
        },
    });
    return !existing;
}

// Generate a unique profile slug within an org slug namespace
async function generateUniqueProfileSlug(
    baseSlug: string,
    orgSlug: string,
    excludeProfileId?: string
): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const available = await isSlugCombinationAvailable(orgSlug, slug, excludeProfileId);
        if (available) return slug;

        slug = `${baseSlug}-${counter}`;
        counter++;

        if (counter > 100) {
            return `${baseSlug}-${Date.now()}`;
        }
    }
}

// POST /api/profile - Create or update user's profile
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const referer = req.headers.get("referer") || undefined;
        const requestBody = await req.json();
        const { orgName, orgSlug, profileSlug, fullName, title, phone1, phone2, email, website, lineUrl, portraitUrl, lineQrUrl, experience, id: profileId, uiLang = "th" } = requestBody;

        const userId = session.user.id;
        const targetLang = uiLang.toLowerCase();
        const langSuffix = targetLang.toLowerCase();

        // Generate slugs
        const finalOrgSlug = slugify(orgSlug || orgName || "my-org").toLowerCase();
        let baseProfileSlug = slugify(profileSlug || fullName || "profile").toLowerCase();

        // CLEANUP: Remove any trailing language suffix the user might have accidentally typed
        // so we don't end up with duplicate suffixes like samart-th-TH
        baseProfileSlug = baseProfileSlug.replace(/(?:-[a-z]{2})+$/i, '');

        // Ensure slug ends with proper lowercase -LANG (e.g., nat-medhee-th)
        if (!baseProfileSlug.endsWith(`-${langSuffix}`)) {
            baseProfileSlug = `${baseProfileSlug}-${langSuffix}`;
        }

        // Validate: org slug cannot be reserved
        if (RESERVED_SLUGS.includes(finalOrgSlug)) {
            return NextResponse.json(
                { error: `"${finalOrgSlug}" เป็นชื่อที่สงวนไว้ กรุณาใช้ชื่ออื่น` },
                { status: 400 }
            );
        }

        const plan = (session.user as any).plan || "free";

        // Find organization
        let organization = await prisma.organization.findFirst({
            where: { userId, ...((plan === "ultra" || plan === "diamond") ? { slug: finalOrgSlug } : {}) },
            include: { profiles: true },
        });

        if (!organization) {
            // Check limits for Free/Pro
            if (plan === "free" || plan === "pro") {
                const orgCount = await prisma.organization.count({ where: { userId } });
                if (orgCount >= 1) {
                    return NextResponse.json({ error: "Your plan only allows one organization." }, { status: 403 });
                }
            }

            organization = await prisma.organization.create({
                data: {
                    name: orgName || "My Organization",
                    slug: finalOrgSlug,
                    userId,
                },
                include: { profiles: true },
            });
        } else if (orgName || finalOrgSlug !== organization.slug) {
            // Update org if changed
            organization = await prisma.organization.update({
                where: { id: organization.id },
                data: {
                    ...(orgName ? { name: orgName } : {}),
                    ...(finalOrgSlug !== organization.slug ? { slug: finalOrgSlug } : {})
                },
                include: { profiles: true },
            });
        }

        // Profile data objects
        const profileData = {
            fullName: fullName || session.user.name || "",
            title: title || "",
            phone1: phone1 || "",
            phone2: phone2 || "",
            email: email || session.user.email || "",
            website: website || "",
            lineUrl: lineUrl || "",
            portraitUrl: portraitUrl || "",
            lineQrUrl: lineQrUrl || "",
        };

        // NEW LOGIC: Look for existing profile for THIS language specifically
        let existingProfile = null;
        if (profileId) {
            existingProfile = await prisma.profile.findUnique({
                where: { id: profileId },
                include: { translations: true }
            });

            // If the language in the form is different from the profile's primary language,
            // we treat it as a request to create a NEW profile record for that language
            // (unless a profile with that slug already exists).
            const isDifferentLang = existingProfile && !existingProfile.translations.some(t => t.lang === targetLang);
            if (isDifferentLang) {
                // Try to find if we already have this person's other language profile
                existingProfile = await prisma.profile.findFirst({
                    where: {
                        orgId: organization.id,
                        slug: baseProfileSlug // This already has -LANG suffix
                    },
                    include: { translations: true }
                });
            }
        } else {
            // Check by slug directly
            existingProfile = await prisma.profile.findFirst({
                where: {
                    orgId: organization.id,
                    slug: baseProfileSlug
                },
                include: { translations: true }
            });
        }

        let profile;

        if (existingProfile) {
            // Update existing record
            profile = await prisma.profile.update({
                where: { id: existingProfile.id },
                data: {
                    ...profileData,
                    slug: baseProfileSlug, // Keep the lang-specific slug
                },
            });
        } else {
            // Create NEW Record for this language
            const uniqueProfileSlug = await generateUniqueProfileSlug(
                baseProfileSlug,
                organization.slug
            );

            // NEW RULE #1: For NEW profiles, ALWAYS inherit from the global MASTER profile (samarth-TH)
            // as per user instructions.
            let latestProfile = await prisma.profile.findFirst({
                where: {
                    slug: { in: ['samarth-TH', 'samart-TH', 'samarth-th', 'samart'] },
                    organization: { slug: 'manserv' }
                },
                include: { translations: true }
            });

            // Ultimate fallback if manserv one is missing
            if (!latestProfile) {
                latestProfile = await prisma.profile.findFirst({
                    where: { slug: { in: ['samarth-TH', 'samart-TH', 'samarth-th', 'samart'] } },
                    include: { translations: true }
                });
            }

            // Inherit missing core profile data from the master/latest profile
            const inheritedThemeConfig = latestProfile?.themeConfig;
            const inheritedMediaConfig = latestProfile?.mediaConfig;

            const finalProfileData: any = {
                fullName: profileData.fullName || latestProfile?.fullName || "",
                title: profileData.title || latestProfile?.title || "",
                phone1: profileData.phone1 || latestProfile?.phone1 || "",
                phone2: profileData.phone2 || latestProfile?.phone2 || "",
                email: profileData.email || latestProfile?.email || "",
                website: profileData.website || latestProfile?.website || "",
                lineUrl: profileData.lineUrl || latestProfile?.lineUrl || "",
                portraitUrl: profileData.portraitUrl || latestProfile?.portraitUrl || "",
                lineQrUrl: profileData.lineQrUrl || latestProfile?.lineQrUrl || "",
            };

            const defaultThemeConfig = inheritedThemeConfig || {
                colors: { primary: "#0F766E", secondary: "#1E293B", accent: "#F59E0B", background: "#FFFFFF", text: "#111827" },
                font: { heading: "var(--font-prompt)", body: "var(--font-geist-sans)" },
                borderRadius: "12px",
                buttonStyle: "rounded",
                layout: { showHero: true, showVideo: false, showTestimonials: true, showContact: true, showExperience: true }
            };

            profile = await prisma.profile.create({
                data: {
                    ...finalProfileData,
                    slug: uniqueProfileSlug,
                    orgId: organization.id,
                    themeConfig: defaultThemeConfig,
                    mediaConfig: inheritedMediaConfig || Prisma.JsonNull,
                },
            });

            // Smart Inheritance & Translation (Rule #1: Inherit from Master and Translate)
            if (latestProfile) {
                const sourceTranslation = latestProfile.translations.find(t => t.lang === 'th')
                    || latestProfile.translations.find(t => t.lang === 'en')
                    || latestProfile.translations[0];

                if (sourceTranslation) {
                    // Translate the inherited content using AI
                    const translatedData = await translateProfileContent(sourceTranslation, targetLang.toLowerCase(), referer);
                    const translatedSettings = await translateProfileSettings(
                        { fullName: profileData.fullName || latestProfile.fullName || "", title: profileData.title || latestProfile.title || "" },
                        targetLang.toLowerCase(),
                        referer
                    );

                    const {
                        heroName, heroTitle, heroRole, heroBadge, heroQuote, heroContact, heroStandard,
                        navAbout, navServices, navCustomers, navLookingFor, navContact,
                        aboutData, servicesData, experienceData, clientsData, contactData, footerData
                    } = translatedData as any;

                    // Extract all fields from translated data, removing database-specific fields
                    const { id, profileId: pid, createdAt: cat, updatedAt: uat, lang: l, ...contentToClone } = translatedData as any;

                    await prisma.profileTranslation.create({
                        data: {
                            ...contentToClone,
                            profileId: profile.id,
                            lang: targetLang.toLowerCase(),
                            // Override with translated settings for sync
                            heroName: profileData.fullName || translatedSettings.fullName || contentToClone.heroName,
                            heroTitle: organization.name || contentToClone.heroTitle, // Default to Org Name
                            heroRole: profileData.title || translatedSettings.title || contentToClone.heroRole || "", // Map position to heroRole
                            // Merge contact data with user inputs
                            contactData: {
                                ...(contentToClone.contactData || {}),
                                mobile: profileData.phone1 || contentToClone.contactData?.mobile || "",
                                email: profileData.email || contentToClone.contactData?.email || "",
                                website: profileData.website || contentToClone.contactData?.website || "",
                                lineTitle: profileData.lineUrl || contentToClone.contactData?.lineTitle || contentToClone.contactData?.lineValue || "",
                            },
                            footerData: contentToClone.footerData || {
                                rights: `© ${new Date().getFullYear()} ${profileData.fullName || translatedSettings.fullName || contentToClone.heroName}. All rights reserved.`,
                            },
                        }
                    });
                }
            }
        }

        // Get existing translation if any (to preserve editor-set fields like address)
        const existingTranslation = await prisma.profileTranslation.findUnique({
            where: {
                profileId_lang: {
                    profileId: profile.id,
                    lang: targetLang,
                },
            },
        });
        const existingContactData = (existingTranslation as any)?.contactData || {};
        const existingExperienceData = (existingTranslation as any)?.experienceData;

        // Merge contactData: keep editor-set fields (like office/address), update phone/email/website from profile form
        const mergedContactData = {
            ...existingContactData,
            title: existingContactData.title || (targetLang === 'th' ? "ติดต่อเรา" : "Contact Us"),
            subtitle: existingContactData.subtitle || (targetLang === 'th' ? "ช่องทางการติดต่อ" : "Get in touch"),
            mobile: profile.phone1 || existingContactData.mobile || "",
            email: profile.email || existingContactData.email || "",
            website: profile.website || existingContactData.website || "",
        };

        // Update translation for the profile (only ONE translation per profile record now)
        // If we just created it via Rule #1 inheritance, skip this default overwrite
        if (!existingTranslation) {
            await prisma.profileTranslation.upsert({
                where: {
                    profileId_lang: {
                        profileId: profile.id,
                        lang: targetLang,
                    },
                },
                create: {
                    profileId: profile.id,
                    lang: targetLang,
                    heroName: profile.fullName,
                    heroTitle: organization.name || "", // Default to Org Name
                    heroRole: profile.title || "",      // Map position to heroRole
                    heroContact: targetLang === 'th' ? 'ติดต่อ' : 'Contact',
                    heroStandard: targetLang === 'th' ? 'มาตรฐานของเรา' : 'Our Standard',
                    navAbout: targetLang === 'th' ? 'เกี่ยวกับ' : 'About',
                    navServices: targetLang === 'th' ? 'บริการ' : 'Services',
                    navCustomers: targetLang === 'th' ? 'ลูกค้า' : 'Key Customers',
                    navLookingFor: targetLang === 'th' ? 'กำลังมองหา' : 'Looking For',
                    navContact: targetLang === 'th' ? 'ติดต่อ' : 'Contact',
                    experienceData: experience ? { items: experience } : Prisma.JsonNull,
                    contactData: mergedContactData,
                    footerData: {
                        rights: `© ${new Date().getFullYear()} ${profile.fullName}. All rights reserved.`,
                    },
                },
                update: {
                    heroName: profile.fullName,
                    heroTitle: organization.name || "", // Ensure org name is updated if changed
                    // heroRole is intentionally not updated here to avoid overwriting with company title
                    experienceData: experience ? { items: experience } : undefined,
                    contactData: mergedContactData,
                },
            });
        }

        // Return the clean URL structure
        const profileUrl = `/${organization.slug}/${profile.slug}`;

        return NextResponse.json({
            organization,
            profile,
            profileUrl,
        });
    } catch (error: any) {
        console.error("[API] Error saving profile:", error);
        return NextResponse.json(
            { error: error?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
            { status: 500 }
        );
    }
}
// DELETE /api/profile?id=... - Delete a profile
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileId = req.nextUrl.searchParams.get("id");
    if (!profileId) {
        return NextResponse.json({ error: "Missing profile ID" }, { status: 400 });
    }

    try {
        // Verify ownership through organization
        const profile = await prisma.profile.findUnique({
            where: { id: profileId },
            include: { organization: true }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        if (profile.organization.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden: You do not own this profile" }, { status: 403 });
        }

        // Delete the profile (Prisma will cascade delete translations if configured, 
        // but let's be explicit if needed. Schema says onDelete: Cascade for translations.)
        await prisma.profile.delete({
            where: { id: profileId }
        });

        return NextResponse.json({ success: true, message: "Profile deleted successfully" });
    } catch (error: any) {
        console.error("[API] Error deleting profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
