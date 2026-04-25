
const { Client } = require('pg');

async function checkFields() {
    const client = new Client({ connectionString: "postgresql://neondb_owner:npg_uYreBf1tAiz4@ep-polished-smoke-a1m76clb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" });
    await client.connect();
    
    // Check Samarth's TH translation
    const res = await client.query("SELECT * FROM \"ProfileTranslation\" WHERE lang = 'th' AND \"profileId\" IN (SELECT id FROM \"Profile\" WHERE slug = 'samarth')");
    console.log("TH Translation contactData:", JSON.stringify(res.rows[0].contactData, null, 2));

    // Check JA translation
    const resJa = await client.query("SELECT * FROM \"ProfileTranslation\" WHERE lang = 'ja' AND \"profileId\" IN (SELECT id FROM \"Profile\" WHERE slug = 'samarth')");
    if (resJa.rows[0]) {
        console.log("JA Translation contactData:", JSON.stringify(resJa.rows[0].contactData, null, 2));
    }
    
    await client.end();
}

checkFields().catch(console.error);
