import { prisma } from './src/lib/prisma';

async function fix() {
    await prisma.profile.update({
        where: { id: 'cmmlf647k000104joscuo2evk' },
        data: { slug: 'samart-TH' }
    });
    console.log("Updated slug to samart-TH");
}

fix().finally(() => prisma.$disconnect());
