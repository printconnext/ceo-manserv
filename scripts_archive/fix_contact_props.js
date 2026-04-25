const fs = require('fs');
const path = require('path');

const dirs = ['en', 'zh', 'jp', 'hi']; // already did th
const baseDir = path.join(__dirname, 'src', 'app', 'manserv', 'samarth');

dirs.forEach(lang => {
    const filePath = path.join(baseDir, lang, 'page.tsx');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Find the export default function line
    const funcMatch = content.match(/export default function \w+\(\) \{/);
    if (!funcMatch) return;

    // Create the replacement block using the exact locale var name
    // e.g., import { en } from "@/data/locales/en"; -> the var is `en`
    const localeVar = lang; // mostly it matches

    if (content.includes('const contactDataFormatted')) {
        console.log(`Already formatted: ${lang}`);
        return;
    }

    const replacement = `${funcMatch[0]}
    const contactDataFormatted = {
        title: ${localeVar}.contact.title,
        subtitle: ${localeVar}.contact.subtitle,
        
        officeLabel: ${localeVar}.contact.office,
        officeValue: "8/69 ถนนวิภาวดีรังสิต",
        
        mobileLabel: ${localeVar}.contact.mobile,
        mobileValue: "099 440 5888",
        
        emailLabel: ${localeVar}.contact.email,
        emailValue: "printconnext@gmail.com",
        
        websiteLabel: ${localeVar}.contact.website,
        websiteValue: "https://www.manserv.co.th",
        
        lineLabel: ${localeVar}.contact.lineTitle,
        lineValue: "@manserv",
        
        clickToAdd: ${localeVar}.contact.clickToAdd,
        clickToCall: ${localeVar}.contact.clickToCall,
        preferEmail: ${localeVar}.contact.preferEmail,
    };
`;

    // Replace the function open
    content = content.replace(funcMatch[0], replacement);

    // Replace <Contact data={foo.contact} /> with contactDataFormatted
    content = content.replace(new RegExp(`<Contact data=\\{${localeVar}\\.contact\\} />`), '<Contact data={contactDataFormatted} />');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${lang}/page.tsx`);
});
