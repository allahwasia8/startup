import fs from 'fs';
import path from 'path';

function cleanHtml(filePath, outPath, assetFolderName) {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Add frontmatter to make it a valid Astro component
  content = `---\n// Auto-generated from raw HTML sample\n---\n` + content;

  // Add is:inline to script and style tags to prevent Astro JSX parsing errors
  content = content.replace(/<script\b(?![^>]*is:inline)([^>]*)>/gi, '<script is:inline$1>');
  content = content.replace(/<style\b(?![^>]*is:inline)([^>]*)>/gi, '<style is:inline$1>');

  // Fix asset paths
  // Sometimes browsers save them as "./Folder_files/" or "Folder_files/"
  // We want to ensure they are absolute from root "/Folder_files/"
  const escapedFolderName = assetFolderName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const assetRegex = new RegExp(`(?:"|')(?:\.\/)?(${escapedFolderName}\/.*?)("|')`, 'gi');
  
  content = content.replace(assetRegex, (match, p1, p2) => {
    return `"/` + p1 + `"`;
  });

  // Astro compiler will crash on unescaped { } in text sometimes if it thinks it's an expression.
  // We've protected script and style. If there are others, it'll show in the build log.

  fs.writeFileSync(outPath, content, 'utf-8');
  console.log(`Saved to ${outPath}`);
}

const baseDir = path.resolve('./sample');
const srcDir = path.resolve('./src/pages/blog');

const archiveFile = path.join(baseDir, 'monday.com Blog_ Tips And Trends For The New Way Of Working.html');
const archiveAssetDir = 'monday.com Blog_ Tips And Trends For The New Way Of Working_files';
const archiveOut = path.join(srcDir, 'index.astro');

const singleFile = path.join(baseDir, 'Best AI-Powered CRM Software Benefits and Use Cases for 2026 blog Single.html');
const singleAssetDir = 'Best AI-Powered CRM Software Benefits and Use Cases for 2026 blog Single_files';
const singleOut = path.join(srcDir, 'best-ai-crm.astro');

cleanHtml(archiveFile, archiveOut, archiveAssetDir);
cleanHtml(singleFile, singleOut, singleAssetDir);

console.log('Done!');
