import { execSync } from 'child_process';

const BASE = 'http://localhost:3000';

async function fetchHtml(url: string) {
    const res = await fetch(url);
    return await res.text();
}

function extractHreflang(html: string) {
    const results: any[] = [];
    const re = /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        results.push({ lang: m[1], href: m[2] });
    }
    return results;
}

function extractLang(html: string) {
    const match = html.match(/<html[^>]*lang="([^"]+)"/i);
    return match ? match[1] : null;
}

function extractCanonical(html: string) {
    const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    return match ? match[1] : null;
}

function extractSwitcherLinks(html: string) {
    // The language switcher typically renders links with the class or something similar. 
    // We can just look for standard hrefs to siblings.
    const results: string[] = [];
    const re = /href="\/manserv\/samarth-([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        results.push(m[1]);
    }
    return [...new Set(results)]; // unique
}

function extractSwitcherLinksUtila(html: string) {
    const results: string[] = [];
    const re = /href="\/utila\/nittaya-([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        results.push(m[1]);
    }
    return [...new Set(results)]; // unique
}

async function verify() {
    console.log("== Verification ==");
    
    // Samarth TH
    const samarthTh = await fetchHtml(`${BASE}/manserv/samarth-th`);
    console.log("\n/manserv/samarth-th:");
    console.log("HTML lang:", extractLang(samarthTh));
    console.log("Canonical:", extractCanonical(samarthTh));
    console.log("Hreflang:", extractHreflang(samarthTh));
    console.log("Switcher sibling links found for samarth:", extractSwitcherLinks(samarthTh).length > 0 ? "Yes, to: " + extractSwitcherLinks(samarthTh).join(',') : "None");
    
    // Samarth EN
    const samarthEn = await fetchHtml(`${BASE}/manserv/samarth-en`);
    console.log("\n/manserv/samarth-en:");
    console.log("HTML lang:", extractLang(samarthEn));
    console.log("Canonical:", extractCanonical(samarthEn));
    console.log("Hreflang:", extractHreflang(samarthEn));
    
    // Pramate TH
    const pramateTh = await fetchHtml(`${BASE}/utila/pramate-th`);
    console.log("\n/utila/pramate-th:");
    console.log("HTML lang:", extractLang(pramateTh));
    console.log("Canonical:", extractCanonical(pramateTh));
    console.log("Hreflang:", extractHreflang(pramateTh));
    console.log("Switcher sibling links to nittaya found:", extractSwitcherLinksUtila(pramateTh).length > 0 ? "YES (FAIL)" : "No (PASS)");
    
    // Nittaya TH
    const nittayaTh = await fetchHtml(`${BASE}/utila/nittaya-th`);
    console.log("\n/utila/nittaya-th:");
    console.log("HTML lang:", extractLang(nittayaTh));
    console.log("Canonical:", extractCanonical(nittayaTh));
    console.log("Hreflang:", extractHreflang(nittayaTh));
}

verify();
