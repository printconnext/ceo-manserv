import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
});

async function main() {
    const profiles = await prisma.profile.findMany({
        select: {
            slug: true,
            isPublished: true,
            organization: {
                select: { slug: true }
            }
        }
    });
    console.log(profiles);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
