const fs = require('fs');
const path = require('path');
const blogDir = 'src/content/blog';
const imgDir = 'public/images/blog';

const files = fs.readdirSync(blogDir);
const images = fs.readdirSync(imgDir);

// Get a list of currently used images
let usedImages = new Set();
files.forEach(f => {
  const content = fs.readFileSync(path.join(blogDir, f), 'utf8');
  const match = content.match(/image:\s*"([^"]+)"/);
  if (match) usedImages.add(path.basename(match[1]));
});

// Find unused images
const unusedImages = images.filter(img => !usedImages.has(img));

let unusedIdx = 0;
files.forEach(f => {
  const filePath = path.join(blogDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('\nimage:')) {
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      const selectedImg = unusedImages[unusedIdx] || images[Math.floor(Math.random() * images.length)];
      const newFrontmatter = `image: "/images/blog/${selectedImg}"\n`;
      content = content.slice(0, frontmatterEnd) + newFrontmatter + content.slice(frontmatterEnd);
      fs.writeFileSync(filePath, content, 'utf8');
      unusedIdx++;
      console.log(`Assigned ${selectedImg} to ${f}`);
    }
  }
});
