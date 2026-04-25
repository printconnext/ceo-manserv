import prisma from './src/lib/prisma';

async function main() {
    const orgs = await prisma.organization.findMany();
    console.log("ORGANIZATIONS:", JSON.stringify(orgs, null, 2));

    const profiles = await prisma.profile.findMany();
    console.log("PROFILES:", JSON.stringify(profiles, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
