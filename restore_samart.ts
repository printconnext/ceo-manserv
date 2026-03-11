import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const targetProfileId = "cmmmkheix0007oktwwa6c0j9q"; // The profile the user is frustrated with
        const sourceProfileId = "cmm2pfb2r0002uotwckw731ys"; // The pristine Samart source

        console.log('Fetching source data...');
        const source = await prisma.profile.findUnique({
            where: { id: sourceProfileId },
            include: { translations: { where: { lang: 'th' } } }
        });

        if (!source || !source.translations[0]) {
            console.error('Source Samart profile not found!');
            return;
        }

        const t = source.translations[0];

        console.log('Restoring Samart identity to target profile...');
        await prisma.profile.update({
            where: { id: targetProfileId },
            data: {
                fullName: source.fullName,
                title: source.title,
                portraitUrl: source.portraitUrl, // Samart's portrait
                phone1: source.phone1,
                phone2: source.phone2,
                email: source.email,
                website: source.website,
                lineUrl: source.lineUrl,
                lineQrUrl: source.lineQrUrl,
                themeConfig: source.themeConfig || {},
                mediaConfig: source.mediaConfig || {},
            }
        });

        await prisma.profileTranslation.update({
            where: { profileId_lang: { profileId: targetProfileId, lang: 'th' } },
            data: {
                heroBadge: t.heroBadge,
                heroName: t.heroName,
                heroTitle: t.heroTitle,
                heroQuote: t.heroQuote,
                heroRole: t.heroRole,
                heroContact: t.heroContact,
                heroStandard: t.heroStandard,
                navAbout: t.navAbout,
                navServices: t.navServices,
                navCustomers: t.navCustomers,
                navLookingFor: t.navLookingFor,
                navContact: t.navContact,
                aboutData: t.aboutData || {},
                servicesData: t.servicesData || {},
                clientsData: t.clientsData || {},
                contactData: t.contactData || {}, // Samart's contact data
                footerData: t.footerData || {},
                experienceData: t.experienceData || {},
            }
        });

        console.log('SUCCESS: Samart identity restored. Nat\'s info removed.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
