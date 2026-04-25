import 'dotenv/config';
import 'dotenv/config';
import { Prisma } from '@prisma/client';
import prisma from './src/lib/prisma';


async function main() {
    const userId = "test-user-id";
    const title = "CEO";
    const fullName = "Test User";
    const orgName = "Test Org";
    const experience = [
        { role: "CEO", company: "Test Company", period: "2020-2022", description: "testing" }
    ];

    try {
        let organization = await prisma.organization.findFirst({
            where: { slug: "test-org" },
        });

        if (!organization) {
            // Need a user first
            let user = await prisma.user.findFirst({ where: { email: "test@example.com" } });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: "test@example.com",
                        name: "Test User",
                    }
                });
            }

            organization = await prisma.organization.create({
                data: {
                    name: orgName,
                    slug: "test-org",
                    userId: user.id,
                }
            });
        }

        const profile = await prisma.profile.upsert({
            where: { orgId_slug: { orgId: organization.id, slug: "test-profile" } },
            create: {
                slug: "test-profile",
                orgId: organization.id,
                fullName: fullName,
                title: title,
            },
            update: {
                fullName: fullName,
                title: title,
            }
        });

        await prisma.profileTranslation.upsert({
            where: { profileId_lang: { profileId: profile.id, lang: "th" } },
            create: {
                profileId: profile.id,
                lang: "th",
                experienceData: experience ? { items: experience } : Prisma.JsonNull,
            },
            update: {
                experienceData: experience ? { items: experience } : undefined,
            }
        });

        const fetchedProfile = await prisma.profile.findFirst({
            where: { id: profile.id },
            include: { translations: true }
        });

        console.log("FETCHED PROFILE TRANSLATION:", JSON.stringify(fetchedProfile?.translations, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
