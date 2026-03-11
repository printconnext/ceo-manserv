require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`
    SELECT p.id, p.slug, p."fullName", o.slug as org_slug, o.id as org_id
    FROM "Profile" p
    JOIN "Organization" o ON p."orgId" = o.id
    ORDER BY o.slug, p.slug
  `);
  for (const row of res.rows) {
    console.log(`${row.id} | ${row.org_slug}/${row.slug} | ${row.fullName}`);
  }
  await client.end();
}

main().catch(console.error);
