import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const profiles = await prisma.profile.findMany({
        where: {
            OR: [
                { slug: { contains: 'samart', mode: 'insensitive' } },
                { fullName: { contains: 'สามารถ', mode: 'insensitive' } },
                { fullName: { contains: 'Samart', mode: 'insensitive' } },
                { fullName: { contains: 'Samarth', mode: 'insensitive' } },
            ],
            orgId: 'cmmlf62oj000004joukv2o4z2' // Manserv Org ID
        },
        include: {
            translations: {
                select: { lang: true }
            }
        }
    });
    console.log(JSON.stringify(profiles, null, 2));
}

main();
