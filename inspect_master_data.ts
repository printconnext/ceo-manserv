import 'dotenv/config';
import prisma from './src/lib/prisma';

async function main() {
  const data = await prisma.profileTranslation.findFirst({
    where: { profileId: 'cmmmo4vyi000coktwmjn43wmt', lang: 'th' },
    select: {
      heroStandard: true,
      servicesData: true,
      clientsData: true,
      contactData: true,
      heroStandardBtn: true,
      heroContactBtn: true
    }
  });
  console.log(JSON.stringify(data, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
