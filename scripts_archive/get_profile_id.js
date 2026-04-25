
const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    try {
        const res = await client.query("SELECT id, slug, \"fullName\" FROM \"Profile\" WHERE slug = 'samarth-th' LIMIT 1");
        console.log("Profile Found:", res.rows);

        if (res.rows.length > 0) {
            const profileId = res.rows[0].id;
            const transRes = await client.query("SELECT * FROM \"ProfileTranslation\" WHERE \"profileId\" = $1", [profileId]);
            console.log("Translations for " + profileId + ":");
            // Log only relevant fields to avoid huge output, but include JSON ones
            transRes.rows.forEach(row => {
               const { id, profileId, ...rest } = row;
               console.log(JSON.stringify(rest, null, 2));
            });
        } else {
            // Try generic search
            const allRes = await client.query("SELECT id, slug FROM \"Profile\" LIMIT 10");
            console.log("Available Profiles:", allRes.rows);
        }
    } finally {
        await client.end();
    }
}

main().catch(console.error);
