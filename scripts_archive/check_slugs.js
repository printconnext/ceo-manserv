const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const profiles = await prisma.profile.findMany({
    include: { organization: true, translations: true }
  });
  console.log('--- PROFILE SLUGS ---');
  profiles.forEach(p => {
    console.log(`ID: ${p.id} | Name: ${p.fullName} | Slug: ${p.slug} | Org: ${p.organization.slug} | Langs: ${p.translations.map(t => t.lang).join(', ')}`);
  });
  await prisma.$disconnect();
}

check();
