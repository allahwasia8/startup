import fs from 'fs';
import path from 'path';

const inputDir = path.resolve('./sample/Content');
const outputDir = path.resolve('./src/content/blog');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.html'));
console.log(`Found ${files.length} HTML files to convert.`);

files.forEach(file => {
  const filePath = path.join(inputDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Extract title (usually the first <h1>)
  let titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : file.replace('.html', '');

  // Extract excerpt (usually the first <p> after the title, or any <p>)
  // But wait, the <h1> might have some HTML in it, we stripped it out above.
  let excerptMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
  let excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').trim() : "Discover more about this topic.";
  // Trim excerpt if too long
  if (excerpt.length > 150) {
    excerpt = excerpt.substring(0, 147) + '...';
  }

  // Remove the H1 from the content body so it's not duplicated (since the template will render the title)
  if (titleMatch) {
    content = content.replace(titleMatch[0], '');
  }

  // Create a slug from the title or filename
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!slug) slug = file.replace('.html', '');

  // To prevent Astro JSX errors from raw HTML attributes or unmatched tags, 
  // the safest way is to wrap the content in a raw markdown block or let Astro parse it as MDX/MD.
  // We'll write it as a .md file. Markdown allows raw HTML inside.
  // But unescaped { } in inline style strings can still break MDX if we use MDX.
  // Standard Markdown (.md) in Astro handles raw HTML very well without treating it as JSX expressions.

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
date: "Oct 15, 2026"
category: "Insights"
---

`;

  const outPath = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(outPath, frontmatter + content, 'utf-8');
});

console.log('Conversion complete!');
