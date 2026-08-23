import prisma from "@/lib/prisma";
import { generateVCard } from "@/lib/vcard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const org = searchParams.get("org");
    const profile = searchParams.get("profile");

    if (!org || !profile) {
        return NextResponse.json({ error: "Missing org or profile" }, { status: 400 });
    }

    try {
        const profileData = await prisma.profile.findFirst({
            where: {
                slug: profile,
                organization: { slug: org }
            },
            include: {
                organization: true,
                translations: { where: { lang: "th" } }
            }
        });

        if (!profileData || !profileData.organization) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const mediaConfig = profileData.mediaConfig as any;
        const translation = profileData.translations?.[0] as any;
        const contactData = translation?.contactData as any || {};
        const portraitUrl = profileData.portraitUrl || mediaConfig?.heroImage || undefined;

        // Fetch photo as base64 if available
        let photoBase64 = "";
        let photoType = "JPEG"; // Default
        if (portraitUrl) {
            try {
                if (portraitUrl.startsWith("http")) {
                    const res = await fetch(portraitUrl);
                    if (res.ok) {
                        const contentType = res.headers.get("content-type") || "";
                        if (contentType.includes("png")) photoType = "PNG";
                        else if (contentType.includes("webp")) photoType = "WEBP";
                        else if (contentType.includes("gif")) photoType = "GIF";
                        
                        const buffer = await res.arrayBuffer();
                        photoBase64 = Buffer.from(buffer).toString("base64");
                    }
                }
            } catch (e) {
                console.error("Failed to fetch photo for vcard download:", e);
            }
        }

        const vCardData = {
            fullName: String(translation?.heroName || profileData.fullName || "Contact"),
            title: String(translation?.heroRole || translation?.heroQuote || profileData.title || ""),
            organization: String(translation?.heroTitle || profileData.organization?.name || ""),
            phone1: contactData?.mobile || contactData?.office || profileData.phone1 || "",
            phone2: profileData.phone2 || "",
            email: String(contactData?.email || profileData.email || ""),
            website: String(contactData?.website || profileData.website || ""),
            profileUrl: `https://www.ceoprofile.site/${org}/${profile}`,
            photoBase64: photoBase64 || undefined,
            photoType: photoType
        };

        const vcfContent = generateVCard(vCardData);
        const safeName = (profileData.fullName || "contact").replace(/[^a-zA-Z0-9\u0E00-\u0E7F\s_-]/g, "").replace(/\s+/g, "_");
        const fileName = `${safeName}.vcf`;

        return new NextResponse(vcfContent, {
            status: 200,
            headers: {
                "Content-Type": "text/vcard; charset=utf-8",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Cache-Control": "no-cache, no-store, must-revalidate",
            }
        });
    } catch (e) {
        console.error("Error generating vcard:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
