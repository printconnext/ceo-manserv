
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("--- Starting Database Slug Cleanup ---");

    // 1. Lowercase all Organization slugs
    const orgs = await prisma.organization.findMany();
    for (const org of orgs) {
        const lowerSlug = org.slug.toLowerCase();
        if (org.slug !== lowerSlug) {
            console.log(`Updating Organization: ${org.name} (${org.slug} -> ${lowerSlug})`);
            await prisma.organization.update({
                where: { id: org.id },
                data: { slug: lowerSlug }
            });
        }
    }

    // 2. Lowercase all Profile slugs
    const profiles = await prisma.profile.findMany();
    for (const profile of profiles) {
        const lowerSlug = profile.slug.toLowerCase();
        if (profile.slug !== lowerSlug) {
            console.log(`Updating Profile: ${profile.fullName} (${profile.slug} -> ${lowerSlug})`);
            await prisma.profile.update({
                where: { id: profile.id },
                data: { slug: lowerSlug }
            });
        }
    }

    console.log("--- Cleanup Finished ---");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
