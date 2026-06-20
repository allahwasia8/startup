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

  // Match the first image tag and its src
  // Format usually: <img src="/images/blog/uuid.png" alt="...">
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/i;
  const match = content.match(imgRegex);

  if (match) {
    const fullImgTag = match[0];
    const imgSrc = match[1];

    // Remove the image tag from the content body
    content = content.replace(fullImgTag, '');

    // Add image: "src" to the frontmatter
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd !== -1 && !content.slice(0, frontmatterEnd).includes('\nimage:')) {
      const newFrontmatter = `image: "${imgSrc}"\n`;
      content = content.slice(0, frontmatterEnd) + newFrontmatter + content.slice(frontmatterEnd);
      
      fs.writeFileSync(filePath, content, 'utf8');
      processedCount++;
    }
  }
}

console.log(`Successfully extracted and set featured images in ${processedCount} blog posts.`);
