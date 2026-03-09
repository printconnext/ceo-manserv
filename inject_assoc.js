const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'data', 'locales');
const files = ['th.ts', 'en.ts', 'zh.ts', 'ja.ts', 'hi.ts'];

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Insert associations array at the end of the clients object
        content = content.replace(/\n    \},\n    contact: \{/g, ',\n        associations: [\n            { name: "BNI Everest", image: "bni-logo.png" }\n        ]\n    },\n    contact: {');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
