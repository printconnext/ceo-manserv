const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'data', 'locales');
const files = ['th.ts', 'en.ts', 'zh.ts', 'ja.ts', 'hi.ts'];

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Fix formatting errors introduced by the previous inject script
        content = content.replace(/name": /g, 'name: ');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${file}`);
    }
});
