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

  const metaIndex = content.indexOf('<p><strong>Meta tags</strong></p>');
  if (metaIndex === -1) continue;

  const metaText = content.slice(metaIndex);
  
  const titleMatch = metaText.match(/<p><strong>title<\/strong><\/p>\s*<p>(.*?)<\/p>/);
  const title = titleMatch ? titleMatch[1].trim().replace(/"/g, '\\"') : '';

  const descMatch = metaText.match(/<p><strong>description<\/strong><\/p>\s*<p>(.*?)<\/p>/);
  const description = descMatch ? descMatch[1].trim().replace(/"/g, '\\"') : '';

  const frontmatterEnd = content.indexOf('---', 3);
  if (frontmatterEnd !== -1 && (title || description)) {
    let newFrontmatter = '';
    if (title) newFrontmatter += `seo_title: "${title}"\n`;
    if (description) newFrontmatter += `seo_description: "${description}"\n`;
    
    content = content.slice(0, frontmatterEnd) + newFrontmatter + content.slice(frontmatterEnd);
  }

  // Remove the meta tags HTML block
  content = content.slice(0, content.indexOf('<p><strong>Meta tags</strong></p>'));

  fs.writeFileSync(filePath, content, 'utf8');
  processedCount++;
}

console.log(`Successfully processed and cleaned ${processedCount} blog posts.`);
