import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy static assets
const filesToCopy = ['index.html', 'style.css', 'javascript.js'];
for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
}

// Copy image folder recursively
const imageSrc = path.join(__dirname, 'image');
const imageDist = path.join(distDir, 'image');
if (fs.existsSync(imageSrc)) {
  fs.cpSync(imageSrc, imageDist, { recursive: true });
}

console.log('Build completed successfully.');
