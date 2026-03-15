
const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_VIHw71tdhbFn@ep-still-hat-a1tchh12-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    const client = new Client({ connectionString });
    await client.connect();
    console.log("--- Connected to Database (via pg) ---");

    try {
        // 1. List current data
        console.log("Current Data State:");
        const res = await client.query(`
            SELECT o.slug as org_slug, p.slug as profile_slug, p.id as profile_id, p."fullName"
            FROM "Profile" p
            JOIN "Organization" o ON p."orgId" = o.id
        `);
        res.rows.forEach(row => {
            console.log(`- /${row.org_slug}/${row.profile_slug} [ID: ${row.profile_id}] Name: ${row.fullName}`);
        });

        // 2. Identify Master Profile
        // Looking for /manserv/samarth-th (or variations)
        const masterRow = res.rows.find(row => 
            row.org_slug.toLowerCase() === 'manserv' && 
            row.profile_slug.toLowerCase().includes('samart')
        );

        if (!masterRow) {
            console.error("Master profile not found in lists. Aborting.");
            return;
        }

        console.log(`MASTER FOUND: /${masterRow.org_slug}/${masterRow.profile_slug}`);

        // 3. PURGE everything else
        console.log("Purging all other profiles...");
        const delProfiles = await client.query('DELETE FROM "Profile" WHERE id != $1', [masterRow.profile_id]);
        console.log(`Deleted ${delProfiles.rowCount} other profiles.`);

        console.log("Purging all other organizations...");
        const delOrgs = await client.query('DELETE FROM "Organization" WHERE id != (SELECT "orgId" FROM "Profile" WHERE id = $1)', [masterRow.profile_id]);
        console.log(`Deleted ${delOrgs.rowCount} other organizations.`);

        console.log("Purging other language translations for master...");
        const delTrans = await client.query('DELETE FROM "ProfileTranslation" WHERE "profileId" = $1 AND lang != \'th\'', [masterRow.profile_id]);
        console.log(`Deleted ${delTrans.rowCount} translations.`);

        // 4. Force lowercase and clean names
        console.log("Cleaning master profile slugs...");
        await client.query('UPDATE "Organization" SET slug = \'manserv\', name = \'Man Management Service Co., Ltd.\' WHERE id = (SELECT "orgId" FROM "Profile" WHERE id = $1)', [masterRow.profile_id]);
        await client.query('UPDATE "Profile" SET slug = \'samarth-th\' WHERE id = $1', [masterRow.profile_id]);

        console.log("--- PURGE SUCCESSFUL ---");
        
    } catch (err) {
        console.error("Error during purge:", err);
    } finally {
        await client.end();
    }
}

main();
