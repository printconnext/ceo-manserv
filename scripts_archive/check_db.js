const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const profile = await prisma.profile.findFirst({
        where: { slug: 'john-doe' },
        include: {
            organization: true,
            translations: true
        }
    });
    console.log(JSON.stringify(profile, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
