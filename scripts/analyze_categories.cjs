const fs = require('fs');
const path = require('path');
const blogDir = 'src/content/blog';
const files = fs.readdirSync(blogDir).slice(0, 100); // Get first 100 to see trends

files.forEach(f => {
  const content = fs.readFileSync(path.join(blogDir, f), 'utf8');
  const match = content.match(/title:\s*"([^"]+)"/);
  if (match) console.log(match[1]);
});
