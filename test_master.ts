import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const allProfiles = await prisma.profile.findMany({
        select: { id: true, slug: true, fullName: true, orgId: true }
    });
    console.log("All profiles:");
    console.table(allProfiles);

    const masterProfile = await prisma.profile.findFirst({
        where: { slug: { contains: 'samart', mode: 'insensitive' } },
        include: { translations: true }
    });
    console.log("Master profile matches:", masterProfile ? masterProfile.slug : "None");
}

main().finally(() => prisma.$disconnect());
