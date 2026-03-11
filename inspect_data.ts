
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Find the LATEST profile (likely the duplicated one)
    const profile = await prisma.profile.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { translations: true }
    });

    if (profile) {
        console.log("PROFILE_DATA:", JSON.stringify({
            id: profile.id,
            fullName: profile.fullName,
            slug: profile.slug,
            portraitUrl: profile.portraitUrl,
            translation: profile.translations[0]
        }, null, 2));
    } else {
        console.log("No profiles found.");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
