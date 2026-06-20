const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

let missingTitle = 0;
let missingDesc = 0;
let overlongTitle = 0;
let overlongDesc = 0;

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Use regex to find frontmatter block
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return;
  const fm = fmMatch[1];
  
  const matchTitle = fm.match(/seo_title:\s*\"(.*)\"/);
  const matchDesc = fm.match(/seo_description:\s*\"(.*)\"/);
  
  if (!matchTitle) missingTitle++;
  else if (matchTitle[1].length > 70) overlongTitle++;
  
  if (!matchDesc) missingDesc++;
  else if (matchDesc[1].length > 170) overlongDesc++;
});

console.log('Total files:', files.length);
console.log('Missing seo_title:', missingTitle);
console.log('Over 70 char seo_title:', overlongTitle);
console.log('Missing seo_description:', missingDesc);
console.log('Over 170 char seo_description:', overlongDesc);
