// Script to clear Next.js cache
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Paths to clear
const pathsToClear = [
  './.next/cache',
  './node_modules/.cache'
];

console.log('🧹 Clearing Next.js cache...');

// Delete cache directories
pathsToClear.forEach(cachePath => {
  if (fs.existsSync(cachePath)) {
    console.log(`Removing ${cachePath}...`);
    fs.rmSync(cachePath, { recursive: true, force: true });
  } else {
    console.log(`${cachePath} does not exist, skipping.`);
  }
});

// Run next clean
try {
  console.log('Running next clean...');
  execSync('npx next clean', { stdio: 'inherit' });
} catch (error) {
  console.error('Error running next clean:', error.message);
}

console.log('✅ Cache cleared successfully!');
console.log('🚀 Restart your dev server with: npm run dev'); 