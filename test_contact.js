const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const p = await prisma.profile.findFirst({ where: { slug: 'samarth-th' }, include: { translations: true } });
    console.log(JSON.stringify(p?.translations[0]?.contactData, null, 2));
}
main().finally(() => prisma.$disconnect());
