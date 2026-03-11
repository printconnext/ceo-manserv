import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

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
        const standardLangs = ["th", "en", "ch", "jp", "hi", "fr", "it", "es", "de", "ru", "fa", "pt", "br", "vi", "lo", "my", "ph", "id"];

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
        const body = await req.json();
        const { orgName, orgSlug, profileSlug, fullName, title, phone1, phone2, email, website, lineUrl, experience, id: profileId, uiLang = "th" } = body;

        const userId = session.user.id;
        const targetLang = uiLang.toLowerCase();
        const langSuffix = targetLang.toUpperCase();

        // Generate slugs
        const finalOrgSlug = slugify(orgSlug || orgName || "my-org");
        let baseProfileSlug = slugify(profileSlug || fullName || "profile");

        // Ensure slug ends with -LANG (e.g., nat-medhee-TH)
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

            // 1. If this person already has a profile in another language in this org, inherit from that.
            //    (e.g., they have NAT MEDHEE TH, now creating NAT MEDHEE JP)
            let latestProfile = await prisma.profile.findFirst({
                where: {
                    orgId: organization.id,
                    slug: { startsWith: baseProfileSlug.split('-')[0] } // Find any profile of this person (starts with same base name)
                },
                orderBy: { createdAt: 'desc' },
                include: { translations: true }
            });

            // 2. If NO profile exists for this person at all, we use the global MASTER profile (samart-TH)
            if (!latestProfile) {
                latestProfile = await prisma.profile.findFirst({
                    where: { slug: 'samart-th' }, // The master template slug
                    include: { translations: true }
                });

                // If master template is missing (e.g. dev environment), fallback to any latest profile in this org
                if (!latestProfile) {
                    latestProfile = await prisma.profile.findFirst({
                        where: { orgId: organization.id },
                        orderBy: { createdAt: 'desc' },
                        include: { translations: true }
                    });
                }
            }

            const inheritedThemeConfig = latestProfile?.themeConfig;
            const inheritedMediaConfig = latestProfile?.mediaConfig;

            const defaultThemeConfig = inheritedThemeConfig || {
                colors: { primary: "#0F766E", secondary: "#1E293B", accent: "#F59E0B", background: "#FFFFFF", text: "#111827" },
                font: { heading: "var(--font-prompt)", body: "var(--font-geist-sans)" },
                borderRadius: "12px",
                buttonStyle: "rounded",
                layout: { showHero: true, showVideo: false, showTestimonials: true, showContact: true, showExperience: true }
            };

            profile = await prisma.profile.create({
                data: {
                    ...profileData,
                    slug: uniqueProfileSlug,
                    orgId: organization.id,
                    themeConfig: defaultThemeConfig,
                    mediaConfig: inheritedMediaConfig || Prisma.JsonNull,
                },
            });

            // Smart Inheritance (Copy exactly as mockup)
            if (latestProfile) {
                // If the user already has a TH profile and is making an EN profile, grab their TH profile.
                // If it's a completely new user getting the master template (samart-th), grab its TH profile.
                const sourceTranslation = latestProfile.translations.find(t => t.lang === 'th')
                    || latestProfile.translations.find(t => t.lang === 'en')
                    || latestProfile.translations[0];

                if (sourceTranslation) {
                    const {
                        heroName, heroTitle, heroRole, heroBadge, heroQuote, heroContact, heroStandard,
                        navAbout, navServices, navCustomers, navLookingFor, navContact,
                        aboutData, servicesData, experienceData, clientsData, contactData, footerData
                    } = sourceTranslation as any;

                    await prisma.profileTranslation.create({
                        data: {
                            profileId: profile.id,
                            lang: targetLang, // Save under the NEW language target
                            heroName: profileData.fullName || heroName, // Always use their chosen name
                            heroTitle: profileData.title || heroTitle, // Always use their chosen org title
                            heroRole: profileData.title || heroRole || "",
                            heroBadge: heroBadge || "",
                            heroQuote: heroQuote || "",
                            heroContact: heroContact || (targetLang === 'th' ? 'ติดต่อ' : 'Contact'),
                            heroStandard: heroStandard || (targetLang === 'th' ? 'มาตรฐานของเรา' : 'Our Standard'),
                            navAbout: navAbout || (targetLang === 'th' ? 'เกี่ยวกับ' : 'About'),
                            navServices: navServices || (targetLang === 'th' ? 'บริการ' : 'Services'),
                            navCustomers: navCustomers || (targetLang === 'th' ? 'ลูกค้า' : 'Key Customers'),
                            navLookingFor: navLookingFor || (targetLang === 'th' ? 'กำลังมองหา' : 'Looking For'),
                            navContact: navContact || (targetLang === 'th' ? 'ติดต่อ' : 'Contact'),
                            aboutData: aboutData || Prisma.JsonNull,
                            servicesData: servicesData || Prisma.JsonNull,
                            experienceData: experienceData || Prisma.JsonNull,
                            clientsData: clientsData || Prisma.JsonNull,
                            contactData: {
                                ...(contactData || {}),
                                mobile: profileData.phone1 || contactData?.mobile || "",
                                email: profileData.email || contactData?.email || "",
                                website: profileData.website || contactData?.website || "",
                                lineTitle: profileData.lineUrl || contactData?.lineTitle || contactData?.lineValue || "",
                            },
                            footerData: footerData || {
                                rights: `© ${new Date().getFullYear()} ${profileData.fullName || heroName}. All rights reserved.`,
                            },
                        }
                    });
                }
            }
        }

        // Update translation for the profile (only ONE translation per profile record now)
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
                heroTitle: profile.title || "",
                heroRole: profile.title || "",
                heroContact: targetLang === 'th' ? 'ติดต่อ' : 'Contact',
                heroStandard: targetLang === 'th' ? 'มาตรฐานของเรา' : 'Our Standard',
                navAbout: targetLang === 'th' ? 'เกี่ยวกับ' : 'About',
                navServices: targetLang === 'th' ? 'บริการ' : 'Services',
                navCustomers: targetLang === 'th' ? 'ลูกค้า' : 'Key Customers',
                navLookingFor: targetLang === 'th' ? 'กำลังมองหา' : 'Looking For',
                navContact: targetLang === 'th' ? 'ติดต่อ' : 'Contact',
                experienceData: experience ? { items: experience } : Prisma.JsonNull,
                contactData: {
                    title: targetLang === 'th' ? "ติดต่อเรา" : "Contact Us",
                    subtitle: targetLang === 'th' ? "ช่องทางการติดต่อ" : "Get in touch",
                    mobile: profile.phone1 || "",
                    email: profile.email || "",
                    website: profile.website || "",
                },
                footerData: {
                    rights: `© ${new Date().getFullYear()} ${profile.fullName}. All rights reserved.`,
                },
            },
            update: {
                heroName: profile.fullName,
                heroTitle: profile.title || "",
                heroRole: profile.title || "",
                experienceData: experience ? { items: experience } : undefined,
                contactData: {
                    title: targetLang === 'th' ? "ติดต่อเรา" : "Contact Us",
                    subtitle: targetLang === 'th' ? "ช่องทางการติดต่อ" : "Get in touch",
                    mobile: profile.phone1 || "",
                    email: profile.email || "",
                    website: profile.website || "",
                },
            },
        });

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
