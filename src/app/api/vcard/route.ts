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

        const translation = profileData.translations?.[0] as any;
        let mediaConfig = profileData.mediaConfig as any;
        if (typeof mediaConfig === "string") {
            try { mediaConfig = JSON.parse(mediaConfig); } catch (e) {}
        }
        const contactData = translation?.contactData as any || {};
        const portraitUrl = mediaConfig?.heroImage || profileData.portraitUrl || undefined;

        // Fetch photo as base64 if available
        let photoBase64 = "";
        let photoType = "JPEG"; // Default
        
        let absolutePortraitUrl = portraitUrl;
        if (absolutePortraitUrl && absolutePortraitUrl.startsWith("/")) {
            absolutePortraitUrl = `https://www.ceoprofile.site${absolutePortraitUrl}`;
        }

        if (absolutePortraitUrl) {
            try {
                if (absolutePortraitUrl.startsWith("http")) {
                    const res = await fetch(absolutePortraitUrl);
                    if (res.ok) {
                        const contentType = res.headers.get("content-type") || "";
                        if (contentType.includes("png")) photoType = "PNG";
                        else if (contentType.includes("webp")) photoType = "WEBP";
                        else if (contentType.includes("gif")) photoType = "GIF";
                        const buffer = await res.arrayBuffer();
                        if (buffer.byteLength < 250000) { // Limit to 250KB to prevent vCard import crashes on phones
                            photoBase64 = Buffer.from(buffer).toString("base64");
                        } else {
                            console.warn("Photo too large for vCard embedding:", buffer.byteLength, "bytes");
                        }
                    }
                }
            } catch (e: any) {
                console.error("Failed to fetch photo for vcard download:", e);
            }
        }

        const vCardData = {
            fullName: String(translation?.heroName || profileData.fullName || "Contact"),
            title: String(translation?.heroRole || translation?.heroQuote || profileData.title || ""),
            organization: String(translation?.heroTitle || profileData.organization?.name || ""),
            phone1: contactData?.mobile || "",
            phone2: contactData?.officePhone || contactData?.office || "",
            email: String(contactData?.email || ""),
            website: "",
            websites: Array.isArray(contactData?.websites) && contactData.websites.length > 0 ? contactData.websites : (contactData?.website ? [String(contactData.website)] : []),
            profileUrl: `https://www.ceoprofile.site/${org}/${profile}`,
            photoBase64: photoBase64 || undefined,
            photoType: photoType,
            photoUrl: absolutePortraitUrl
        };

        const vcfContent = generateVCard(vCardData);
        const safeName = (profileData.fullName || "contact").replace(/[^a-zA-Z0-9\u0E00-\u0E7F\s_-]/g, "").replace(/\s+/g, "_");
        const fileName = `${safeName}.vcf`;
        const encodedFileName = encodeURIComponent(fileName);

        return new NextResponse(vcfContent, {
            status: 200,
            headers: {
                "Content-Type": "text/vcard; charset=utf-8",
                "Content-Disposition": `attachment; filename="contact.vcf"; filename*=UTF-8''${encodedFileName}`,
                "Cache-Control": "no-cache, no-store, must-revalidate",
            }
        });
    } catch (e: any) {
        console.error("Error generating vcard:", e);
        return new NextResponse(`Internal Server Error: ${e.message}\n${e.stack}`, { status: 500 });
    }
}
