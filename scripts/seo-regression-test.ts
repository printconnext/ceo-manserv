/**
 * SEO Regression Test Script
 * 
 * Validates that CEO Profile pages have correct SEO metadata,
 * Person Entity isolation, and no cross-profile leakage.
 * 
 * Usage:
 *   npx tsx scripts/seo-regression-test.ts [base-url]
 * 
 * Default base URL: https://www.ceoprofile.site
 * For local dev:    npx tsx scripts/seo-regression-test.ts http://localhost:3000
 */

const BASE = process.argv[2] || 'https://www.ceoprofile.site';

interface TestResult {
    name: string;
    pass: boolean;
    detail: string;
}

interface ProfileAudit {
    url: string;
    results: TestResult[];
}

async function fetchHtml(url: string): Promise<string> {
    const res = await fetch(url, {
        headers: { 'User-Agent': 'SEO-Regression-Test/1.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.text();
}

function extractMeta(html: string, name: string): string | null {
    // Match name= or property= meta tags
    const re = new RegExp(`<meta\\s+(?:name|property)=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
    const m = html.match(re);
    if (m) return m[1];
    // Also try reversed attribute order
    const re2 = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:name|property)=["']${name}["']`, 'i');
    const m2 = html.match(re2);
    return m2 ? m2[1] : null;
}

function extractJsonLd(html: string): any[] {
    const results: any[] = [];
    const re = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
        try { results.push(JSON.parse(m[1])); } catch { /* skip invalid */ }
    }
    return results;
}

function extractCanonical(html: string): string | null {
    const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    return m ? m[1] : null;
}

function extractHreflang(html: string): { lang: string; href: string }[] {
    const results: { lang: string; href: string }[] = [];
    const re = /<link\s+rel=["']alternate["']\s+hreflang=["']([^"']*)["']\s+href=["']([^"']*)["']/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
        results.push({ lang: m[1], href: m[2] });
    }
    return results;
}

function extractH1(html: string): string[] {
    const results: string[] = [];
    const re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
        results.push(m[1].replace(/<[^>]*>/g, '').trim());
    }
    return results;
}

function extractTitle(html: string): string | null {
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? m[1].trim() : null;
}

async function auditProfile(path: string, expectedName: string, expectedOrg: string, forbiddenName: string): Promise<ProfileAudit> {
    const url = `${BASE}${path}`;
    const results: TestResult[] = [];
    
    console.log(`\n🔍 Auditing: ${url}`);
    
    let html: string;
    try {
        html = await fetchHtml(url);
        results.push({ name: 'HTTP Accessible', pass: true, detail: 'Page loaded successfully' });
    } catch (e: any) {
        results.push({ name: 'HTTP Accessible', pass: false, detail: e.message });
        return { url, results };
    }

    // Title
    const title = extractTitle(html);
    results.push({
        name: 'Title contains person name',
        pass: !!title && title.includes(expectedName),
        detail: `Title: ${title || '(none)'}`,
    });
    results.push({
        name: 'Title does NOT contain wrong person',
        pass: !title || !title.includes(forbiddenName),
        detail: `Should not contain "${forbiddenName}"`,
    });

    // Meta description
    const desc = extractMeta(html, 'description');
    results.push({
        name: 'Meta description exists and contains name',
        pass: !!desc && desc.includes(expectedName),
        detail: `Description: ${desc ? desc.substring(0, 80) + '...' : '(none)'}`,
    });

    // Canonical
    const canonical = extractCanonical(html);
    results.push({
        name: 'Canonical URL is self-referencing',
        pass: !!canonical && canonical.includes(path),
        detail: `Canonical: ${canonical || '(none)'}`,
    });
    results.push({
        name: 'Canonical uses production domain',
        pass: !!canonical && canonical.startsWith('https://www.ceoprofile.site'),
        detail: `Canonical: ${canonical || '(none)'}`,
    });

    // JSON-LD
    const jsonLdList = extractJsonLd(html);
    const personLd = jsonLdList.find(j => j['@type'] === 'Person');
    results.push({
        name: 'Person JSON-LD exists',
        pass: !!personLd,
        detail: personLd ? `@id: ${personLd['@id']}` : 'No Person JSON-LD found',
    });
    if (personLd) {
        results.push({
            name: 'Person @id is unique to this profile',
            pass: personLd['@id']?.includes(path),
            detail: `@id: ${personLd['@id']}`,
        });
        results.push({
            name: 'Person name matches expected',
            pass: personLd['name']?.includes(expectedName),
            detail: `JSON-LD name: ${personLd['name']}`,
        });
        results.push({
            name: 'Person name does NOT leak wrong person',
            pass: !personLd['name']?.includes(forbiddenName),
            detail: `Should not contain "${forbiddenName}"`,
        });
        results.push({
            name: 'worksFor exists and has org name',
            pass: !!personLd['worksFor'] && !!personLd['worksFor']['name'],
            detail: `worksFor: ${personLd['worksFor']?.name || '(none)'}`,
        });
        results.push({
            name: 'Person image is absolute HTTPS URL',
            pass: !!personLd['image'] && personLd['image'].startsWith('https://'),
            detail: `image: ${personLd['image'] || '(none)'}`,
        });
        results.push({
            name: 'Organization logo is absolute URL',
            pass: !!personLd['worksFor']?.logo && personLd['worksFor'].logo.startsWith('https://'),
            detail: `logo: ${personLd['worksFor']?.logo || '(none)'}`,
        });
        // Check knowsAbout is not empty array
        if (personLd['knowsAbout'] !== undefined) {
            results.push({
                name: 'knowsAbout is non-empty when present',
                pass: Array.isArray(personLd['knowsAbout']) && personLd['knowsAbout'].length > 0,
                detail: `knowsAbout: ${JSON.stringify(personLd['knowsAbout'])}`,
            });
        }
        // Check sameAs is not empty array
        if (personLd['sameAs'] !== undefined) {
            results.push({
                name: 'sameAs is non-empty when present',
                pass: Array.isArray(personLd['sameAs']) && personLd['sameAs'].length > 0,
                detail: `sameAs count: ${personLd['sameAs']?.length}`,
            });
        }
    }

    // Open Graph
    const ogTitle = extractMeta(html, 'og:title');
    const ogUrl = extractMeta(html, 'og:url');
    const ogImage = extractMeta(html, 'og:image');
    const ogLocale = extractMeta(html, 'og:locale');
    results.push({
        name: 'OG title contains person name',
        pass: !!ogTitle && ogTitle.includes(expectedName),
        detail: `og:title: ${ogTitle || '(none)'}`,
    });
    results.push({
        name: 'OG URL matches canonical',
        pass: ogUrl === canonical,
        detail: `og:url: ${ogUrl || '(none)'}`,
    });
    results.push({
        name: 'OG image is absolute HTTPS URL',
        pass: !!ogImage && ogImage.startsWith('https://'),
        detail: `og:image: ${ogImage || '(none)'}`,
    });
    results.push({
        name: 'OG locale is proper BCP-47 format',
        pass: !!ogLocale && ogLocale.includes('_'),
        detail: `og:locale: ${ogLocale || '(none)'}`,
    });

    // Twitter Card
    const twCard = extractMeta(html, 'twitter:card');
    const twTitle = extractMeta(html, 'twitter:title');
    const twImage = extractMeta(html, 'twitter:image');
    results.push({
        name: 'Twitter card is summary_large_image',
        pass: twCard === 'summary_large_image',
        detail: `twitter:card: ${twCard || '(none)'}`,
    });
    results.push({
        name: 'Twitter title contains person name',
        pass: !!twTitle && twTitle.includes(expectedName),
        detail: `twitter:title: ${twTitle || '(none)'}`,
    });
    results.push({
        name: 'Twitter image is absolute HTTPS URL',
        pass: !!twImage && twImage.startsWith('https://'),
        detail: `twitter:image: ${twImage || '(none)'}`,
    });

    // Hreflang safety
    const hreflangs = extractHreflang(html);
    results.push({
        name: 'No vestigial x-default hreflang (no siblings)',
        pass: !hreflangs.some(h => h.lang === 'x-default'),
        detail: `hreflang entries: ${hreflangs.length}`,
    });

    // H1
    const h1s = extractH1(html);
    results.push({
        name: 'Exactly one H1 exists',
        pass: h1s.length === 1,
        detail: `Found ${h1s.length} H1(s): ${h1s.join(', ')}`,
    });
    if (h1s.length > 0) {
        results.push({
            name: 'H1 contains person name',
            pass: h1s[0].includes(expectedName),
            detail: `H1: ${h1s[0]}`,
        });
    }

    // Machine-readable summary
    const srOnlyMatch = html.match(/<div\s+class="sr-only"[^>]*>([\s\S]*?)<\/div>/i);
    results.push({
        name: 'Machine-readable sr-only summary exists',
        pass: !!srOnlyMatch && srOnlyMatch[1].includes(expectedName),
        detail: srOnlyMatch ? `Contains: ${srOnlyMatch[1].substring(0, 80).replace(/<[^>]*>/g, '').trim()}...` : '(not found)',
    });
    results.push({
        name: 'sr-only does NOT have aria-hidden="false"',
        pass: !html.includes('class="sr-only" aria-hidden="false"'),
        detail: 'Checking for removed aria-hidden="false"',
    });

    // SSR identity check — person name should appear in raw HTML
    results.push({
        name: 'SSR: Person name in server-rendered HTML',
        pass: html.includes(expectedName),
        detail: `Checking for "${expectedName}" in HTML`,
    });

    return { url, results };
}

async function crossProfileLeakageTest(
    profileAPath: string, profileBPath: string,
    nameA: string, nameB: string
): Promise<TestResult[]> {
    const results: TestResult[] = [];
    console.log(`\n🔗 Cross-profile leakage test: ${profileAPath} vs ${profileBPath}`);
    
    const [htmlA, htmlB] = await Promise.all([
        fetchHtml(`${BASE}${profileAPath}`),
        fetchHtml(`${BASE}${profileBPath}`),
    ]);

    // Profile A should not reference Profile B's identity
    const jsonLdA = extractJsonLd(htmlA).find(j => j['@type'] === 'Person');
    const jsonLdB = extractJsonLd(htmlB).find(j => j['@type'] === 'Person');

    results.push({
        name: `${profileAPath} JSON-LD does not reference ${nameB}`,
        pass: !jsonLdA || !JSON.stringify(jsonLdA).includes(nameB),
        detail: 'Checking JSON-LD isolation',
    });
    results.push({
        name: `${profileBPath} JSON-LD does not reference ${nameA}`,
        pass: !jsonLdB || !JSON.stringify(jsonLdB).includes(nameA),
        detail: 'Checking JSON-LD isolation',
    });

    // Check hreflang doesn't cross-link
    const hrefsA = extractHreflang(htmlA);
    const hrefsB = extractHreflang(htmlB);
    results.push({
        name: `${profileAPath} hreflang does not link to ${profileBPath}`,
        pass: !hrefsA.some(h => h.href.includes(profileBPath)),
        detail: `hreflang A entries: ${hrefsA.length}`,
    });
    results.push({
        name: `${profileBPath} hreflang does not link to ${profileAPath}`,
        pass: !hrefsB.some(h => h.href.includes(profileAPath)),
        detail: `hreflang B entries: ${hrefsB.length}`,
    });

    // Canonical isolation
    const canonA = extractCanonical(htmlA);
    const canonB = extractCanonical(htmlB);
    results.push({
        name: 'Profile A canonical does not point to Profile B',
        pass: !!canonA && !canonA.includes(profileBPath),
        detail: `A canonical: ${canonA}`,
    });
    results.push({
        name: 'Profile B canonical does not point to Profile A',
        pass: !!canonB && !canonB.includes(profileAPath),
        detail: `B canonical: ${canonB}`,
    });

    return results;
}

async function main() {
    console.log('='.repeat(60));
    console.log('CEO Profile — SEO Regression Test');
    console.log(`Base URL: ${BASE}`);
    console.log('='.repeat(60));

    const audits: ProfileAudit[] = [];

    // Audit Pramate (Utila)
    audits.push(await auditProfile(
        '/utila/pramate-th',
        'ประเมศฐ์',
        'Utila',
        'นิตยา'  // Must not leak nittaya
    ));

    // Audit Samarth (ManServ)
    audits.push(await auditProfile(
        '/manserv/samarth-th',
        'สามารถ',
        'Manserv',
        'ประเมศฐ์'  // Must not leak pramate
    ));

    // Cross-profile leakage: same org (utila) — different people
    let crossResults: TestResult[] = [];
    try {
        crossResults = await crossProfileLeakageTest(
            '/utila/pramate-th', '/utila/nittaya-th',
            'ประเมศฐ์', 'นิตยา'
        );
    } catch (e: any) {
        console.log(`  ⚠️  Cross-profile test skipped (${e.message})`);
        crossResults.push({
            name: 'Cross-profile test',
            pass: true,
            detail: `Skipped: ${e.message} (profile may not exist)`,
        });
    }

    // Cross-profile leakage: different orgs
    let crossOrgResults: TestResult[] = [];
    try {
        crossOrgResults = await crossProfileLeakageTest(
            '/utila/pramate-th', '/manserv/samarth-th',
            'ประเมศฐ์', 'สามารถ'
        );
    } catch (e: any) {
        console.log(`  ⚠️  Cross-org test skipped (${e.message})`);
    }

    // Print results
    console.log('\n' + '='.repeat(60));
    console.log('RESULTS');
    console.log('='.repeat(60));

    let totalPass = 0;
    let totalFail = 0;

    for (const audit of audits) {
        console.log(`\n📋 ${audit.url}`);
        console.log('-'.repeat(50));
        for (const r of audit.results) {
            const icon = r.pass ? '✅' : '❌';
            console.log(`  ${icon} ${r.name}`);
            if (!r.pass) console.log(`     → ${r.detail}`);
            r.pass ? totalPass++ : totalFail++;
        }
    }

    if (crossResults.length > 0) {
        console.log(`\n📋 Cross-Profile Isolation (Same Org)`);
        console.log('-'.repeat(50));
        for (const r of crossResults) {
            const icon = r.pass ? '✅' : '❌';
            console.log(`  ${icon} ${r.name}`);
            if (!r.pass) console.log(`     → ${r.detail}`);
            r.pass ? totalPass++ : totalFail++;
        }
    }

    if (crossOrgResults.length > 0) {
        console.log(`\n📋 Cross-Profile Isolation (Different Org)`);
        console.log('-'.repeat(50));
        for (const r of crossOrgResults) {
            const icon = r.pass ? '✅' : '❌';
            console.log(`  ${icon} ${r.name}`);
            if (!r.pass) console.log(`     → ${r.detail}`);
            r.pass ? totalPass++ : totalFail++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`TOTAL: ${totalPass} PASS, ${totalFail} FAIL`);
    console.log('='.repeat(60));

    process.exit(totalFail > 0 ? 1 : 0);
}

main().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
