import { prisma } from './src/lib/prisma';
import { th } from './src/data/locales/th';
import { en } from './src/data/locales/en';

async function main() {
    console.log("Fixing Master Profiles to match 'One Profile Per Language' architecture");

    const org = await prisma.organization.findFirst({ where: { slug: 'manserv' } });
    if (!org) {
        console.error("Org not found");
        return;
    }

    // Remove the bad profile
    await prisma.profile.deleteMany({ where: { slug: 'samarth' } });

    // Create TH Profile
    await prisma.profile.create({
        data: {
            orgId: org.id,
            slug: 'samarth-th',
            fullName: 'สามารถ ไชยะ',
            title: 'บริษัท แมน แมนเนจเม้นท์ เซอร์วิส จำกัด',
            email: 'printconnext@gmail.com',
            phone1: '099-440-5888',
            website: 'https://utila.co.th/web/',
            lineUrl: '@manserv',
            translations: {
                create: {
                    lang: 'th',
                    heroBadge: th.hero.badge,
                    heroName: th.hero.name,
                    heroTitle: th.hero.title,
                    heroQuote: th.hero.quote,
                    heroContactBtn: th.hero.contactButton,
                    heroStandardBtn: th.hero.standardButton,
                    navAbout: th.header.about,
                    navServices: th.header.services,
                    navCustomers: th.header.keyCustomers,
                    navLookingFor: th.header.lookingFor,
                    navContact: th.header.contact,
                    aboutData: JSON.parse(JSON.stringify(th.about)),
                    servicesData: JSON.parse(JSON.stringify(th.services)),
                    clientsData: JSON.parse(JSON.stringify(th.clients)),
                    contactData: JSON.parse(JSON.stringify(th.contact)),
                }
            }
        }
    });

    // Create EN Profile
    await prisma.profile.create({
        data: {
            orgId: org.id,
            slug: 'samarth-en',
            fullName: 'สามารถ ไชยะ', // Same full name to link as siblings for language switcher
            title: 'Man Management Service Co., Ltd.',
            email: 'printconnext@gmail.com',
            phone1: '099-440-5888',
            website: 'https://utila.co.th/web/',
            lineUrl: '@manserv',
            translations: {
                create: {
                    lang: 'en',
                    heroBadge: en.hero.badge,
                    heroName: en.hero.name,
                    heroTitle: en.hero.title,
                    heroQuote: en.hero.quote,
                    heroContactBtn: en.hero.contactButton,
                    heroStandardBtn: en.hero.standardButton,
                    navAbout: en.header.about,
                    navServices: en.header.services,
                    navCustomers: en.header.keyCustomers,
                    navLookingFor: en.header.lookingFor,
                    navContact: en.header.contact,
                    aboutData: JSON.parse(JSON.stringify(en.about)),
                    servicesData: JSON.parse(JSON.stringify(en.services)),
                    clientsData: JSON.parse(JSON.stringify(en.clients)),
                    contactData: JSON.parse(JSON.stringify(en.contact)),
                }
            }
        }
    });

    console.log("✅ Fixed! TH: /manserv/samarth-th  |  EN: /manserv/samarth-en");
}

main().finally(() => prisma.$disconnect());
