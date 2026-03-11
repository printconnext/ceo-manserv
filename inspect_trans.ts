import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
}

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching translation details...");
    const trans = await prisma.profileTranslation.findMany({
        where: { profileId: "cmmmh0skq000204jf6w6t4avs" }
    });

    console.log("THAI PROFILE TRANSLATIONS:");
    console.log(JSON.stringify(trans, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
