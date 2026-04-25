const fs = require('fs');
const path = require('path');

const dirs = ['en', 'ch', 'jp', 'In'];
const baseDir = path.join(__dirname, 'src', 'app', 'manserv', 'samarth');

const localeMap = {
    'en': 'en',
    'zh': 'zh',
    'jp': 'ja',
    'In': 'hi'
};

dirs.forEach(lang => {
    const filePath = path.join(baseDir, lang, 'page.tsx');
    if (!fs.existsSync(filePath)) {
        console.log(`Not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const localeVar = localeMap[lang];

    // Replace the existing contactDataFormatted block
    const regex = /const contactDataFormatted = \{[\s\S]*?preferEmail: .*?,\n    \};\n/;
    const replacement = `const contactDataFormatted = {
        title: ${localeVar}.contact.title as string,
        subtitle: ${localeVar}.contact.subtitle as string,

        officeLabel: "Office Address",
        officeValue: "เปิดรับลดหย่อนภาษี และ โอกาสที่กำลังมองหา",

        mobileLabel: "Mobile Phone",
        mobileValue: "0994405888",

        emailLabel: "Email",
        emailValue: "printconnext@gmail.com",

        websiteLabel: "Website",
        websiteValue: "https://utila.co.th/web/",

        lineLabel: "Line ID / Add Line Link",
        lineValue: "@manserv",

        clickToAdd: ${localeVar}.contact.clickToAdd as string,
        clickToCall: "", 
        preferEmail: "Email Preferred",
    };\n`;

    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${lang}/page.tsx`);
});
