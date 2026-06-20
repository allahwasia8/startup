import fs from 'fs/promises';
import { createWriteStream, unlink } from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const IMAGE_DIR = path.join(__dirname, '../public/images/blog');

// Ensure image directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Download image from URL to local file path
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: HTTP ${res.statusCode}`));
        return;
      }
      
      const file = createWriteStream(destPath);
      res.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function processFiles() {
  await ensureDir(IMAGE_DIR);
  
  const files = await fs.readdir(CONTENT_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  
  let totalImages = 0;
  let downloadedImages = 0;
  
  console.log(`Scanning ${mdFiles.length} markdown files for external images...`);
  
  for (const file of mdFiles) {
    const filePath = path.join(CONTENT_DIR, file);
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;
    
    // Match <img src="https://..."> 
    // Example: <img src="https://images.surferseo.art/20a254e2-3cb2-4a23-a3bf-52d19076c755.png" alt="...">
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    
    let match;
    const matches = [];
    while ((match = imgRegex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    
    for (const url of matches) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        totalImages++;
        
        // Extract filename from URL (e.g., 20a254e2.png)
        // If the URL has query params, ignore them for the filename
        const urlObj = new URL(url);
        let fileName = path.basename(urlObj.pathname);
        if (!fileName) fileName = `image-${Date.now()}.jpg`;
        
        const localPath = path.join(IMAGE_DIR, fileName);
        const publicPath = `/images/blog/${fileName}`;
        
        try {
          // Check if it already exists
          try {
            await fs.access(localPath);
            // Already downloaded, just replace in markdown
          } catch {
            // Need to download
            console.log(`Downloading ${fileName}...`);
            await downloadImage(url, localPath);
            downloadedImages++;
          }
          
          // Replace URL in content
          content = content.replace(url, publicPath);
          modified = true;
          
        } catch (err) {
          console.error(`Error processing ${url}: ${err.message}`);
        }
      }
    }
    
    if (modified) {
      await fs.writeFile(filePath, content, 'utf8');
    }
  }
  
  console.log(`\nFinished processing!`);
  console.log(`Total external images found: ${totalImages}`);
  console.log(`Newly downloaded images: ${downloadedImages}`);
}

processFiles().catch(console.error);
