const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'data', 'locales');
const files = ['th.ts', 'en.ts', 'zh.ts', 'ja.ts', 'hi.ts'];

const itemsArray = `        items: [
            { name: "KUBOTA", image: "kubota.png" },
            { name: "SATI", "image": "sati.png" },
            { name: "ATTG", "image": "attg.png" },
            { name: "HITACHI", "image": "hitachi.png" },
            { name: "OGIHARA", "image": "ogihara.png" },
            { name: "DONKI", "image": "donki.png" },
            { name: "YAMAHA", "image": "yamaha.png" },
            { name: "HINO", "image": "hino.png" },
            { name: "ICHIKOH", "image": "ichikoh.png" },
            { name: "TRA", "image": "tra.png" },
            { name: "IDAKA", "image": "idaka.png" },
            { name: "THK", "image": "thk.png" },
            { name": "THAI NAKANO", "image": "thai-nakano.png" },
            { name: "UNIC", "image": "unic.png" },
            { name: "TOR", "image": "tor.png" },
            { name: "PTS", "image": "pts.png" },
            { name: "NISSINBO", "image": "nissinbo.png" },
            { name: "DID", "image": "did.png" },
            { name: "TDK", "image": "tdk.png" },
            { name": "HAS", "image": "has.png" },
            { name: "SKMT", "image": "skmt.png" },
            { name": "BTKK", "image": "btkk.png" },
            { name": "BEW", "image": "bew.png" },
            { "name": "FUKOKU", "image": "fukoku.png" },
            { name: "TRANSTEC", "image": "transtec.png" },
            { name: "SHOWA", "image": "showa.png" },
            { name: "IDAC", "image": "idac.png" },
            { name: "ENPLA", "image": "enpla.png" },
            { name: "Y_AND_R", "image": "y_and_r.png" },
            { name: "KANG YONG", "image": "kang-yong.png" },
            { name: "NISSAN", "image": "nissan.png" },
            { name: "AKESONO", "image": "akesono.png" },
            { name: "TAIHO", "image": "taiho.png" },
            { name: "E_AND_C", "image": "e_and_c.png" },
            { name: "CPR", "image": "cpr.png" },
            { name: "NIPPON EXPRSS", "image": "nippon-exprss.png" },
            { name: "TOSHIBA", "image": "toshiba.png" },
            { name: "IKEA", "image": "ikea.png" },
            { name: "INDARAMA", "image": "indarama.png" },
            { name: "DUSIT", "image": "dusit.png" },
            { name: "AMCOGROUP", "image": "amcogroup.png" },
            { name: "ALPHA GROUP", "image": "alpha-group.png" },
            { name: "CENTRAL", "image": "central.png" },
            { name: "GREEN SPOT", "image": "green-spot.png" },
            { name: "HISAMITSU", "image": "hisamitsu.png" }
        ],`;

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Find the end of the clients object. It usually ends with `growingTogether: "...",\n    },`
        // We will insert `itemsArray` before the `    },` of the clients object.

        // Let's use string replacement
        const regex = /(growingTogether:\s*".*?",\s*\n)(\s*},)/g;
        // Wait, some might not have a trailing comma, so:
        const regexNoComma = /(growingTogether:\s*".*?")(\s*\n\s*},)/g;

        if (content.match(regex)) {
            content = content.replace(regex, `$1${itemsArray}\n$2`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        } else if (content.match(regexNoComma)) {
            content = content.replace(regexNoComma, `$1,\n${itemsArray}$2`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file} (added comma)`);
        } else {
            console.log(`Could not find growingTogether in ${file}`);
        }
    }
});
