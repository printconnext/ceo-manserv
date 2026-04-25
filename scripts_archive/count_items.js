
const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    try {
        const res = await client.query("SELECT id, slug FROM \"Profile\" WHERE slug = 'samarth-th' LIMIT 1");
        if (res.rows.length > 0) {
            const profileId = res.rows[0].id;
            const transRes = await client.query("SELECT * FROM \"ProfileTranslation\" WHERE \"profileId\" = $1", [profileId]);
            const trans = transRes.rows[0];
            
            console.log("Services items:", trans.servicesData?.items?.length);
            console.log("Client items:", trans.clientsData?.items?.length);
            console.log("Looking for items:", trans.clientsData?.lookingForItems?.length);
            console.log("Stats items:", trans.aboutData?.stats?.length);
        }
    } finally {
        await client.end();
    }
}

main().catch(console.error);
