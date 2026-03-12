import 'dotenv/config';
import prisma from './src/lib/prisma';

async function main() {
  const profiles = await prisma.profile.findMany({
    select: { id: true, slug: true }
  });
  console.log(JSON.stringify(profiles, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
