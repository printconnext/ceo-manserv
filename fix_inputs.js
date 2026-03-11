const fs = require('fs');
const file = 'src/components/UnifiedEditor.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace all className="..." strings that belong to input or textarea
// We can just find all classNames that look like input styling and don't have text- color
const patterns = [
    'className="w-full rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue"',
    'className="w-full rounded-2xl border-none p-6 text-sm font-medium shadow-sm focus:ring-2 focus:ring-brand-blue leading-relaxed"',
    'className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm"',
    'className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm font-bold"',
    'className="flex-grow rounded-xl border-none bg-white p-2 text-sm font-bold shadow-sm"',
    'className="w-full rounded-xl border-none bg-white p-3 text-xs text-gray-500 shadow-sm"', // Will replace text-gray-500 with 900
];

const replacements = [
    'className="w-full text-gray-900 rounded-2xl border-none p-5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-brand-blue"',
    'className="w-full text-gray-900 rounded-2xl border-none p-6 text-sm font-medium shadow-sm focus:ring-2 focus:ring-brand-blue leading-relaxed"',
    'className="w-full text-gray-900 rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm"',
    'className="w-full text-gray-900 rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm font-bold"',
    'className="flex-grow text-gray-900 rounded-xl border-none bg-white p-2 text-sm font-bold shadow-sm"',
    'className="w-full text-gray-900 rounded-xl border-none bg-white p-3 text-xs shadow-sm"',
];

for (let i = 0; i < patterns.length; i++) {
    content = content.split(patterns[i]).join(replacements[i]);
}

fs.writeFileSync(file, content);
console.log('Fixed inputs in', file);
