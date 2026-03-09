import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfileEditorPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const searchParams = await searchParamsPromise;
    const session = await getServerSession(authOptions);
    const profileId = searchParams.id;

    // Fetch existing profile data
    let initialData = null;
    if (session?.user?.id) {
        try {
            const organization = await prisma.organization.findFirst({
                where: { userId: session.user.id },
                include: {
                    profiles: {
                        where: profileId ? { id: profileId } : undefined,
                        include: {
                            translations: {
                                take: 1, // Default translation (th)
                                orderBy: { lang: 'asc' }
                            },
                        },
                    },
                },
            });
            initialData = { organization };
        } catch (error) {
            console.error("[ProfileEditorPage] Error fetching profile:", error);
        }
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header is handled inside ProfileForm for dynamic localization */}

            <ProfileForm initialData={initialData} />
        </div>
    );
}
