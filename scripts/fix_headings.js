import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blogDir = path.join(__dirname, '../src/content/blog');

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

let processedCount = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  if (content.includes('<h2>') || content.includes('<h3>')) {
    content = content.replace(/<h2>(.*?)<\/h2>/gi, '\n\n## $1\n\n');
    content = content.replace(/<h3>(.*?)<\/h3>/gi, '\n\n### $1\n\n');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    processedCount++;
  }
}

console.log(`Successfully converted HTML headings to Markdown in ${processedCount} blog posts.`);
