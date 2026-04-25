import prisma from './src/lib/prisma';

async function main() {
    try {
        const profiles = await prisma.profile.findMany({
            include: {
                organization: true,
                translations: {
                    select: { lang: true, heroName: true }
                }
            }
        });

        console.log(JSON.stringify(profiles, null, 2));
    } catch (err) {
        console.error("Error fetching profiles:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
