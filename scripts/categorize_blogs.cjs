const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const categories = [
  { name: 'Business', keywords: ['compan', 'director', 'startup', 'venture', 'plc', 'sic', 'sole trader', 'cic', 'business', 'incorporat', 'office'] },
  { name: 'Motoring', keywords: ['mot', 'car', 'driving', 'automobile', 'bhp', 'vehicle', 'dvla', 'mileage'] },
  { name: 'Passports', keywords: ['passport', 'travel'] },
  { name: 'Tax', keywords: ['tax', 'hmrc', 'vat', 'gateway', 'self assessment'] },
  { name: 'Benefits', keywords: ['universal credit', 'benefit', 'allowance', 'welfare', 'childcare', 'pension', 'dwp'] },
];

function determineCategory(title) {
  const lowerTitle = title.toLowerCase();
  for (const cat of categories) {
    if (cat.keywords.some(kw => lowerTitle.includes(kw.toLowerCase()))) {
      return cat.name;
    }
  }
  return 'Business'; // Default fallback
}

let updated = 0;
files.forEach(f => {
  const filePath = path.join(blogDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  if (!titleMatch) return;
  const title = titleMatch[1];
  
  const category = determineCategory(title);
  
  // Replace the category string in the frontmatter
  const newContent = content.replace(/category:\s*"[^"]+"/, `category: "${category}"`);
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    updated++;
  }
});

console.log(`Updated ${updated} files with new categories.`);
