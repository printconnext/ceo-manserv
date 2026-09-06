const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
});

async function main() {
    const org = 'manserv';
    const slug = 'samarth-th';
    
    const allOrgProfiles = await prisma.profile.findMany({
        where: { organization: { slug: org }, isPublished: true },
        include: { translations: true }
    });
    
    console.log(`Found ${allOrgProfiles.length} published profiles for ${org}`);

    const getBaseSlug = (s) => s.replace(/-[a-z]{2}$/i, '').toLowerCase();
    const currentBaseSlug = getBaseSlug(slug);

    console.log(`Current base slug: ${currentBaseSlug}`);
    
    const siblings = allOrgProfiles.filter(p => 
        getBaseSlug(p.slug) === currentBaseSlug && 
        p.slug.toLowerCase() !== slug.toLowerCase()
    );
    
    console.log(`Found ${siblings.length} siblings`);
    for (const s of siblings) {
        console.log(` - ${s.slug} (lang: ${s.translations[0]?.lang})`);
    }

    const org2 = 'utila';
    const slug2 = 'pramate-th';
    const allOrgProfiles2 = await prisma.profile.findMany({
        where: { organization: { slug: org2 }, isPublished: true },
        include: { translations: true }
    });
    
    const currentBaseSlug2 = getBaseSlug(slug2);
    const siblings2 = allOrgProfiles2.filter(p => 
        getBaseSlug(p.slug) === currentBaseSlug2 && 
        p.slug.toLowerCase() !== slug2.toLowerCase()
    );
    console.log(`Found ${siblings2.length} siblings for ${slug2}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
