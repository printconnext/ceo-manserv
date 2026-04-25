const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const profiles = await prisma.profile.findMany({
        include: {
            organization: true,
            translations: {
                select: { lang: true, heroName: true }
            }
        }
    });

    console.log(JSON.stringify(profiles, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
