const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'data', 'locales');
const files = ['th.ts', 'en.ts', 'zh.ts', 'ja.ts', 'hi.ts'];

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Fix the broken FUKOKU line: { "name: "FUKOKU", ... } -> { name: "FUKOKU", ... }
        content = content.replace(/\{ "name: "FUKOKU"/g, '{ name: "FUKOKU"');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${file}`);
    }
});
