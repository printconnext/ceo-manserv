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
            include: { organization: true }
        });
        organization = profile?.organization;
    } else {
        organization = await prisma.organization.findFirst({
            where: { userId: session.user.id },
            include: { profiles: true }
        });
        profile = organization?.profiles?.[0];
    }

    const mediaConfig = profile?.mediaConfig as any;
    const themeConfig = profile?.themeConfig as any;

    if (!profile || !organization) {
        return (
            <div className="p-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
                <p className="mb-8">Please complete your profile first.</p>
                <Link href="/dashboard/profile" className="text-brand-blue font-bold">Create Profile</Link>
            </div>
        );
    }

    const vCardString = generateVCard({
        fullName: profile.fullName,
        title: profile.title || "",
        organization: organization.name,
        phone1: profile.phone1 || "",
        phone2: profile.phone2 || "",
        email: profile.email || "",
        website: profile.website || "",
        profileUrl: `https://www.ceoprofile.site/${organization.slug}/${profile.slug}/th`
    });

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
                vCardString={vCardString}
                primaryColor={themeConfig?.colors?.primary || "#00318C"}
            />

            <div className="mt-8 text-center text-xs text-gray-400">
                <p>Scan this QR code with your phone camera to instantly add contact details.</p>
            </div>
        </div>
    );
}
