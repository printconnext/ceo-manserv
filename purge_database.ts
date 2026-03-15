
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("--- Starting TOTAL Database Purge (AUTHORIZED) ---");
    console.log("Goal: Keep ONLY /manserv/samarth/th and delete everything else.");

    // 1. Identify the Master Profile
    // The user specifically mentioned /manserv/samarth/th
    // In our DB, org slug should be 'manserv' and profile slug 'samarth-th' (lowercase)
    // We search broadly for anything matching 'samarth' or 'samart' in 'manserv' to be safe.
    const masterProfile = await prisma.profile.findFirst({
        where: {
            organization: { slug: { in: ['manserv', 'MANSERV'] } },
            slug: { 
                contains: 'samart', 
                mode: 'insensitive' 
            }
        },
        include: { organization: true, translations: true }
    });

    if (!masterProfile) {
        console.error("CRITICAL ERROR: Master profile (/manserv/samarth/th) not found! Search criteria failed.");
        console.log("Available profiles for inspection:");
        const all = await prisma.profile.findMany({ include: { organization: true } });
        all.forEach(p => console.log(`- /${p.organization.slug}/${p.slug}`));
        console.error("Purge aborted to prevent data loss.");
        return;
    }

    console.log(`FOUND MASTER: ID ${masterProfile.id}, Slug: ${masterProfile.slug}, Org: ${masterProfile.organization.slug}`);
    
    // We want specifically the TH version if multiple exist
    let targetProfile = masterProfile;
    if (!masterProfile.slug.toLowerCase().endsWith('-th')) {
        const thProfile = await prisma.profile.findFirst({
            where: {
                orgId: masterProfile.orgId,
                slug: { endsWith: '-th', mode: 'insensitive' }
            },
            include: { organization: true }
        });
        if (thProfile) targetProfile = thProfile;
    }

    console.log(`CLEANING UP: Keeping Profile ${targetProfile.id} (/${targetProfile.organization.slug}/${targetProfile.slug})`);

    // 2. Delete all translations for OTHER profiles first (though cascade handles it)
    // 3. Delete all other profiles
    const deletedProfiles = await prisma.profile.deleteMany({
        where: {
            id: { not: targetProfile.id }
        }
    });
    console.log(`Deleted ${deletedProfiles.count} other profiles.`);

    // 4. Delete all other organizations
    const deletedOrgs = await prisma.organization.deleteMany({
        where: {
            id: { not: targetProfile.orgId }
        }
    });
    console.log(`Deleted ${deletedOrgs.count} other organizations.`);

    // 5. Enforce lowercase on the remains
    console.log("Enforcing lowercase on master data...");
    const finalOrg = await prisma.organization.update({
        where: { id: targetProfile.orgId },
        data: { 
            slug: "manserv",
            name: "Man Management Service Co., Ltd."
        }
    });

    const finalProfile = await prisma.profile.update({
        where: { id: targetProfile.id },
        data: { 
            slug: "samarth-th"
        }
    });

    console.log(`SUCCESS: Remaining profile is /${finalOrg.slug}/${finalProfile.slug}`);
    
    // 6. Delete any translations other than 'th' for this master?
    // The user said "เหลือแค่ข้อมูลของหน้า /manserv/samarth/th" which implies other languages should go too.
    const deletedTranslations = await prisma.profileTranslation.deleteMany({
        where: {
            profileId: finalProfile.id,
            lang: { not: 'th' }
        }
    });
    console.log(`Deleted ${deletedTranslations.count} other language translations for the master profile.`);

    console.log("--- Purge Complete ---");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
