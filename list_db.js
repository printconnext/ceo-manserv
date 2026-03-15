
const { PrismaClient } = require('@prisma/client');

// Explicitly set the environment variable in Node
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Listing All Database Entries (Explicit ENV) ---");
    const orgs = await prisma.organization.findMany({
        include: { profiles: { include: { translations: true } } }
    });
    
    orgs.forEach(org => {
        console.log(`Org: ${org.name} (${org.slug}) [ID: ${org.id}]`);
        org.profiles.forEach(p => {
            console.log(`  Profile: ${p.fullName} (${p.slug}) [ID: ${p.id}]`);
            p.translations.forEach(t => {
                console.log(`    Lang: ${t.lang}`);
            });
        });
    });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
