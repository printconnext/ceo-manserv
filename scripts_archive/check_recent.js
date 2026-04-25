
const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    try {
        const res = await client.query("SELECT id, slug, \"fullName\", \"createdAt\" FROM \"Profile\" ORDER BY \"createdAt\" DESC LIMIT 10");
        console.log("Recent Profiles:", res.rows);

        for (const profile of res.rows) {
            const transRes = await client.query("SELECT * FROM \"ProfileTranslation\" WHERE \"profileId\" = $1", [profile.id]);
            console.log("Translations for " + profile.slug + ":");
            transRes.rows.forEach(t => {
                console.log(`- Lang: ${t.lang}, heroName: ${t.heroName}, servicesData empty? ${!t.servicesData}, aboutData empty? ${!t.aboutData}`);
                if (t.lang === 'ja') {
                    console.log("JA ServicesData:", JSON.stringify(t.servicesData, null, 2));
                    console.log("JA AboutData:", JSON.stringify(t.aboutData, null, 2));
                }
            });
        }
    } finally {
        await client.end();
    }
}

main().catch(console.error);
