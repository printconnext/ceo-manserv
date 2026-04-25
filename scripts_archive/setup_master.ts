import { prisma } from './src/lib/prisma';
import { th } from './src/data/locales/th';
import { en } from './src/data/locales/en';

async function main() {
    console.log("Setting up Master Test Profile: /manserv/samarth/th");

    // 1. Ensure User exists
    let user = await prisma.user.findFirst({ where: { email: 'admin@ceoprofile.site' } });
    if (!user) {
        user = await prisma.user.create({
            data: { email: 'admin@ceoprofile.site', name: 'Admin', plan: 'pro' }
        });
        console.log("Created Admin User:", user.id);
    }

    // 2. Ensure Organization 'manserv' exists
    let org = await prisma.organization.findFirst({ where: { slug: 'manserv' } });
    if (!org) {
        org = await prisma.organization.create({
            data: {
                slug: 'manserv',
                name: 'บริษัท แมน แมนเนจเม้นท์ เซอร์วิส จำกัด',
                userId: user.id
            }
        });
        console.log("Created Org:", org.slug);
    }

    // 3. Ensure Profile 'samarth' exists
    let profile = await prisma.profile.findFirst({ where: { orgId: org.id, slug: 'samarth' } });
    if (!profile) {
        profile = await prisma.profile.create({
            data: {
                orgId: org.id,
                slug: 'samarth',
                fullName: 'สามารถ ไชยะ',
                title: 'บริษัท แมน แมนเนจเม้นท์ เซอร์วิส จำกัด',
                email: 'printconnext@gmail.com',
                phone1: '099-440-5888',
                website: 'https://utila.co.th/web/',
                lineUrl: '@manserv',
            }
        });
        console.log("Created Profile:", profile.slug);
    } else {
        console.log("Profile already exists. Ensuring translations.");
    }

    // 4. Ensure TH translation exists
    let thTrans = await prisma.profileTranslation.findUnique({
        where: { profileId_lang: { profileId: profile.id, lang: 'th' } }
    });

    if (!thTrans) {
        await prisma.profileTranslation.create({
            data: {
                profileId: profile.id,
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
        });
        console.log("Created TH Translation");
    }

    // 5. Ensure EN translation exists
    let enTrans = await prisma.profileTranslation.findUnique({
        where: { profileId_lang: { profileId: profile.id, lang: 'en' } }
    });

    if (!enTrans) {
        await prisma.profileTranslation.create({
            data: {
                profileId: profile.id,
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
        });
        console.log("Created EN Translation");
    }


    console.log("✅ Master profile ready at: /manserv/samarth/th");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
