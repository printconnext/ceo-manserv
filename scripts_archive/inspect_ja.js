
const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    try {
        const res = await client.query("SELECT id, slug FROM \"Profile\" WHERE slug ILIKE 'samarth-ja%' LIMIT 1");
        if (res.rows.length > 0) {
            const profileId = res.rows[0].id;
            const transRes = await client.query("SELECT * FROM \"ProfileTranslation\" WHERE \"profileId\" = $1", [profileId]);
            console.log("Translation for JA:", JSON.stringify(transRes.rows[0], null, 2));
        } else {
            console.log("No samarth-ja profile found.");
        }
    } finally {
        await client.end();
    }
}

main().catch(console.error);
