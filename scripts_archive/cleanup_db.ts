import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
}

const prisma = new PrismaClient();

async function main() {
    // Both samarth-th and samarth-TH got polluted with Chinese due to fallback bugs
    console.log("Emptying translations for corrupted profiles to allow fallbacks to display properly...");

    // cmmmh0skq000204jf6w6t4avs = samarth-TH
    // cmmlebhor0000hwtw1lr6xyh1 = samarth-th
    // We will clear their translation records so the editor fallbacks take over next time they edit

    await prisma.profileTranslation.update({
        where: { profileId_lang: { profileId: "cmmmh0skq000204jf6w6t4avs", lang: "th" } },
        data: {
            heroBadge: null,
            heroName: null,
            heroTitle: null,
            heroQuote: null,
            heroRole: null,
            heroContactBtn: null,
            heroStandardBtn: null,
            aboutData: {},
            servicesData: {},
            contactData: {}
        }
    });

    await prisma.profileTranslation.update({
        where: { profileId_lang: { profileId: "cmmlebhor0000hwtw1lr6xyh1", lang: "th" } },
        data: {
            heroBadge: null,
            heroName: null,
            heroTitle: null,
            heroQuote: null,
            heroRole: null,
            heroContactBtn: null,
            heroStandardBtn: null,
            aboutData: {},
            servicesData: {},
            contactData: {}
        }
    });

    console.log("Cleanup complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
