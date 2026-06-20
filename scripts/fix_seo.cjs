const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

function truncateString(str, num) {
  if (str.length <= num) return str;
  return str.slice(0, num).trim() + '...';
}

function escapeQuotes(str) {
  return str.replace(/"/g, "'");
}

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return;
  
  let fm = fmMatch[1];
  let updated = false;
  
  // Extract existing fields
  const titleMatch = fm.match(/^title:\s*"(.*?)"/m);
  const excerptMatch = fm.match(/^excerpt:\s*"(.*?)"/m);
  const seoTitleMatch = fm.match(/^seo_title:\s*"(.*?)"/m);
  const seoDescMatch = fm.match(/^seo_description:\s*"(.*?)"/m);
  
  let seoTitle = seoTitleMatch ? seoTitleMatch[1] : null;
  let seoDesc = seoDescMatch ? seoDescMatch[1] : null;
  
  const originalTitle = titleMatch ? titleMatch[1] : 'Blog Post';
  const originalExcerpt = excerptMatch ? excerptMatch[1] : '';
  
  // Fix SEO Title
  if (!seoTitle) {
    seoTitle = truncateString(escapeQuotes(originalTitle), 60);
    fm = fm.trim() + `\nseo_title: "${seoTitle}"\n`;
    updated = true;
  } else if (seoTitle.length > 70) {
    const newSeoTitle = truncateString(seoTitle, 60);
    fm = fm.replace(/^seo_title:\s*".*?"/m, `seo_title: "${newSeoTitle}"`);
    updated = true;
  }
  
  // Fix SEO Description
  if (!seoDesc) {
    seoDesc = truncateString(escapeQuotes(originalExcerpt), 155);
    fm = fm.trim() + `\nseo_description: "${seoDesc}"\n`;
    updated = true;
  } else if (seoDesc.length > 170) {
    const newSeoDesc = truncateString(seoDesc, 155);
    fm = fm.replace(/^seo_description:\s*".*?"/m, `seo_description: "${newSeoDesc}"`);
    updated = true;
  }
  
  if (updated) {
    const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${fm.trim()}\n---`);
    fs.writeFileSync(filePath, newContent, 'utf8');
    updatedCount++;
  }
});

console.log(`Successfully fixed SEO metadata for ${updatedCount} files.`);
