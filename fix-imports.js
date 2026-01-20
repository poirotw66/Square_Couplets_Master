#!/usr/bin/env node
/**
 * Post-build script to add .js extensions to imports in compiled files
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function fixImports(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  
  // Fix relative imports: from "../xxx" -> from "../xxx.js"
  // But skip @google/genai imports
  content = content.replace(
    /from\s+["'](\.\.[^"']+)["']/g,
    (match, path) => {
      if (path.endsWith('.js')) return match;
      if (path.includes('@google')) return match;
      return `from "${path}.js"`;
    }
  );
  
  writeFileSync(filePath, content, 'utf-8');
}

function processDirectory(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      console.log(`Fixing imports in: ${filePath}`);
      fixImports(filePath);
    }
  }
}

console.log('Adding .js extensions to imports in dist/...');
processDirectory('dist');
console.log('✅ Done!');
