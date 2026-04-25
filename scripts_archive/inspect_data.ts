import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
}

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching profiles...");
    const profiles = await prisma.profile.findMany({
        orderBy: { createdAt: 'desc' },
        include: { translations: { select: { lang: true } }, organization: { select: { slug: true } } },
        take: 10
    });

    console.log("ALL PROFILES (LAST 10):");
    console.log(JSON.stringify(profiles.map(p => ({
        id: p.id,
        slug: p.slug,
        orgSlug: p.organization?.slug,
        langs: p.translations.map(t => t.lang).join(", "),
        createdAt: p.createdAt
    })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
