#!/usr/bin/env node

/**
 * Executable script for generate-doufang-prompt skill
 * Can be called directly by agents or users
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';
import { config } from 'dotenv';

// Resolve project root and service path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const skillDir = resolve(__dirname);
const projectRoot = resolve(skillDir, '../..');

// Try to find services directory
function findServicesPath() {
  const possiblePaths = [
    join(projectRoot, 'services'),
    join(projectRoot, 'node_modules', '@justin_666', 'square-couplets-master-skills', 'services'),
    join(process.cwd(), 'services'),
    join(process.cwd(), 'node_modules', '@justin_666', 'square-couplets-master-skills', 'services'),
  ];

  for (const path of possiblePaths) {
    try {
      if (statSync(path).isDirectory()) {
        return path;
      }
    } catch (e) {
      // Path doesn't exist, try next
    }
  }
  return null;
}

// Load environment variables
const envLocalPath = join(projectRoot, '.env.local');
const envPath = join(projectRoot, '.env');

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  // Try current working directory
  config();
}

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const keyword = args[0];
    const referenceImagePath = args[1]; // Optional reference image path
    
    if (!keyword) {
      console.error('❌ Error: Keyword is required');
      console.log('\nUsage:');
      console.log('  node skills/generate-doufang-prompt/index.js <keyword> [reference-image-path]');
      console.log('\nExample:');
      console.log('  node skills/generate-doufang-prompt/index.js "財富"');
      console.log('  node skills/generate-doufang-prompt/index.js "健康" images/reference.png');
      process.exit(1);
    }

    // Get API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ Error: API Key is missing');
      console.log('💡 Set GEMINI_API_KEY in .env file or environment variable');
      process.exit(1);
    }

    // Try to import service function
    const servicesPath = findServicesPath();
    if (!servicesPath) {
      console.error('❌ Error: Cannot find services directory');
      console.log('💡 Make sure you are running from the project root or have installed the package');
      process.exit(1);
    }

    // Dynamic import of service (support both .ts and .js)
    let serviceModule;
    try {
      // Try .js first (for npm package)
      serviceModule = await import(`file://${join(servicesPath, 'geminiService.js')}`);
    } catch (e) {
      try {
        // Try .ts (for development)
        serviceModule = await import(`file://${join(servicesPath, 'geminiService.ts')}`);
      } catch (e2) {
        console.error('❌ Error: Cannot import service module');
        console.error('   Tried:', join(servicesPath, 'geminiService.js'));
        console.error('   Tried:', join(servicesPath, 'geminiService.ts'));
        process.exit(1);
      }
    }
    const { generateDoufangPrompt } = serviceModule;

    // Load reference image if provided
    let referenceImageDataUrl = null;
    if (referenceImagePath) {
      const fullPath = resolve(process.cwd(), referenceImagePath);
      if (!existsSync(fullPath)) {
        console.error(`❌ Error: Reference image not found: ${fullPath}`);
        process.exit(1);
      }
      
      const imageBuffer = readFileSync(fullPath);
      const base64 = imageBuffer.toString('base64');
      const ext = referenceImagePath.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
      referenceImageDataUrl = `data:${mimeType};base64,${base64}`;
    }

    // Generate prompt
    console.log(`📝 Generating prompt for keyword: "${keyword}"`);
    if (referenceImagePath) {
      console.log(`🖼️  Using reference image: ${referenceImagePath}`);
    }
    
    const result = await generateDoufangPrompt(keyword, apiKey, referenceImageDataUrl);
    
    // Output as JSON
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
