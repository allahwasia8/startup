const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const stopWords = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'for', 'with', 'on', 'in', 'at', 'to', 'from', 'by', 'about', 'of', 'how', 'what', 'why', 'when', 'where', 'is', 'it', 'can', 'you', 'do', 'your'
]);

let renamedCount = 0;
const usedSlugs = new Set();

files.forEach(file => {
  const oldPath = path.join(dir, file);
  
  // Remove .md extension
  const baseName = file.replace('.md', '');
  
  // Split into words, filter stop words, take first 4-5 meaningful words
  const words = baseName.split('-');
  const meaningfulWords = words.filter(w => !stopWords.has(w.toLowerCase()));
  
  // Take up to 4 words to keep it short and punchy
  let newSlugBase = meaningfulWords.slice(0, 4).join('-');
  
  // Fallback if filtering removed everything
  if (!newSlugBase) {
    newSlugBase = words.slice(0, 4).join('-');
  }
  
  // Ensure uniqueness
  let newSlug = newSlugBase;
  let counter = 1;
  while (usedSlugs.has(newSlug) || (newSlug + '.md' !== file && fs.existsSync(path.join(dir, newSlug + '.md')))) {
    newSlug = `${newSlugBase}-${counter}`;
    counter++;
  }
  
  usedSlugs.add(newSlug);
  
  const newFileName = newSlug + '.md';
  if (file !== newFileName) {
    const newPath = path.join(dir, newFileName);
    fs.renameSync(oldPath, newPath);
    renamedCount++;
  }
});

console.log(`Successfully shortened ${renamedCount} slugs (filenames).`);
