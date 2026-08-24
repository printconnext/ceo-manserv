import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import VCardQR from "@/components/VCardQR";
import { generateVCard } from "@/lib/vcard";
import { redirect } from "next/navigation";

export default async function VCardPage({
    searchParams: searchParamsPromise
}: {
    searchParams: Promise<{ id?: string }>
}) {
    const searchParams = await searchParamsPromise;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const { id: profileId } = searchParams;

    let profile;
    let organization;

    if (profileId) {
        profile = await prisma.profile.findFirst({
            where: { id: profileId, organization: { userId: session.user.id } },
            include: { organization: true, translations: { where: { lang: "th" } } }
        });
        organization = profile?.organization;
    } else {
        organization = await prisma.organization.findFirst({
            where: { userId: session.user.id },
            include: { profiles: { include: { translations: { where: { lang: "th" } } } } }
        });
        profile = organization?.profiles?.[0];
    }

    const mediaConfig = profile?.mediaConfig as any;
    const themeConfig = profile?.themeConfig as any;
    const portraitUrl = profile?.portraitUrl || mediaConfig?.heroImage || undefined;
    const translation = profile?.translations?.[0] as any;
    const contactData = translation?.contactData as any || {};

    let photoBase64 = "";
    if (portraitUrl) {
        try {
            if (portraitUrl.startsWith("http")) {
                const res = await fetch(portraitUrl);
                const buffer = await res.arrayBuffer();
                photoBase64 = Buffer.from(buffer).toString("base64");
            } else if (portraitUrl.startsWith("/")) {
                const fs = require("fs");
                const path = require("path");
                const filePath = path.join(process.cwd(), "public", portraitUrl);
                if (fs.existsSync(filePath)) {
                    photoBase64 = fs.readFileSync(filePath, { encoding: "base64" });
                }
            }
        } catch (e) {
            console.error("Failed to load heroImage for vcard", e);
        }
    }

    if (!profile || !organization) {
        return (
            <div className="p-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
                <p className="mb-8">Please complete your profile first.</p>
                <Link href="/dashboard/profile" className="text-brand-blue font-bold">Create Profile</Link>
            </div>
        );
    }

    const vCardData = {
        fullName: translation?.heroName || profile.fullName,
        title: translation?.heroRole || translation?.heroQuote || profile.title || "",
        organization: translation?.heroTitle || organization.name,
        phone1: contactData?.mobile || "",
        phone2: contactData?.officePhone || contactData?.office || "",
        email: contactData?.email || "",
        website: "",
        websites: [], // User requested to only show ceoprofile.site link in vCard
        profileUrl: `https://www.ceoprofile.site/${organization.slug}/${profile.slug}`,
        photoBase64: photoBase64 || undefined,
        photoUrl: mediaConfig?.heroImage || portraitUrl // Priority to mediaConfig
    };

    const qrValue = `https://www.ceoprofile.site/api/vcard?org=${organization.slug}&profile=${profile.slug}`; // URL triggers .vcf download on scan
    const fullVCardString = generateVCard(vCardData); // Full vCard 3.0 for .vcf download button

    return (
        <div className="p-6 max-w-lg mx-auto">
            <div className="mb-8">
                <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-brand-blue flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Dashboard
                </Link>
            </div>

            <VCardQR
                fullName={profile.fullName}
                portraitUrl={mediaConfig?.heroImage || undefined}
                qrValue={qrValue}
                fullVCardString={fullVCardString}
                primaryColor={themeConfig?.colors?.primary || "#00318C"}
            />

            <div className="mt-8 text-center text-xs text-gray-400">
                <p>Scan this QR code with your phone camera to instantly add contact details.</p>
            </div>
        </div>
    );
}
