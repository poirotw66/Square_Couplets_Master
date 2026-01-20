#!/usr/bin/env node

/**
 * Executable script for generate-doufang-prompt skill
 * Can be called directly by agents or users
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { createRequire } from 'module';

// Load environment variables helper
async function loadEnvironmentVariables() {
  try {
    const dotenv = await import('dotenv');
    const envLocalPath = join(projectRoot, '.env.local');
    const envPath = join(projectRoot, '.env');
    const cwdEnvLocalPath = join(process.cwd(), '.env.local');
    const cwdEnvPath = join(process.cwd(), '.env');

    if (existsSync(envLocalPath)) {
      dotenv.config({ path: envLocalPath });
    } else if (existsSync(envPath)) {
      dotenv.config({ path: envPath });
    } else if (existsSync(cwdEnvLocalPath)) {
      dotenv.config({ path: cwdEnvLocalPath });
    } else if (existsSync(cwdEnvPath)) {
      dotenv.config({ path: cwdEnvPath });
    } else {
      dotenv.config();
    }
  } catch (e) {
    // dotenv not available, continue without it (will use environment variables)
  }
}

// Resolve project root and service path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const skillDir = resolve(__dirname);
const projectRoot = resolve(skillDir, '../..');

// Try to find services directory
function findServicesPath() {
  // Get npm global prefix to find globally installed packages
  let globalPrefix = null;
  try {
    globalPrefix = execSync('npm config get prefix', { encoding: 'utf-8' }).trim();
  } catch (e) {
    // Ignore error, try other methods
  }
  
  // Try to resolve package location using createRequire (works in ES modules)
  let packageRoot = null;
  try {
    const require = createRequire(import.meta.url);
    const packageJsonPath = require.resolve('@justin_666/square-couplets-master-skills/package.json');
    packageRoot = dirname(packageJsonPath);
  } catch (e) {
    // Package not found via require.resolve, will try other paths
  }
  
  const possiblePaths = [
    // Global npm package (highest priority - most reliable for installed packages)
    ...(globalPrefix ? [
      join(globalPrefix, 'lib', 'node_modules', '@justin_666', 'square-couplets-master-skills', 'services'),
      join(globalPrefix, 'node_modules', '@justin_666', 'square-couplets-master-skills', 'services'),
    ] : []),
    // From resolved package root (if it has services)
    ...(packageRoot ? [join(packageRoot, 'services')] : []),
    // Local project root
    join(projectRoot, 'services'),
    // Local node_modules
    join(projectRoot, 'node_modules', '@justin_666', 'square-couplets-master-skills', 'services'),
    // Current working directory
    join(process.cwd(), 'services'),
    // Current working directory node_modules
    join(process.cwd(), 'node_modules', '@justin_666', 'square-couplets-master-skills', 'services'),
  ];

  // Debug: log all paths being checked (only in development)
  if (process.env.DEBUG_DOUFANG) {
    console.log('🔍 Checking paths for services directory:');
    for (const path of possiblePaths) {
      console.log(`   - ${path} ${existsSync(path) ? '✅' : '❌'}`);
    }
  }
  
  for (const path of possiblePaths) {
    try {
      if (statSync(path).isDirectory()) {
        if (process.env.DEBUG_DOUFANG) {
          console.log(`✅ Found services at: ${path}`);
        }
        return path;
      }
    } catch (e) {
      // Path doesn't exist, try next
    }
  }
  
  // If not found, provide helpful error message
  if (process.env.DEBUG_DOUFANG) {
    console.log('❌ Services directory not found in any of the checked paths');
  }
  return null;
}


async function main() {
  try {
    // Load environment variables first
    await loadEnvironmentVariables();
    
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
      // Try .js first (for compiled npm package)
      serviceModule = await import(`file://${join(servicesPath, 'geminiService.js')}`);
    } catch (e) {
      try {
        // Try .ts (for development or source packages)
        // Node.js cannot directly import .ts files
        console.error('❌ Error: Cannot import TypeScript service module');
        console.error('   The package contains TypeScript source files (.ts) which cannot be directly executed');
        console.error('');
        console.error('💡 Solution: Use the CLI command instead (recommended):');
        console.error(`   doufang-prompt "${keyword}"${referenceImagePath ? ` ${referenceImagePath}` : ''}`);
        console.error('');
        console.error('   Or if you need to use the script directly:');
        console.error('   1. Install tsx: npm install -g tsx');
        console.error(`   2. Run: tsx skills/generate-doufang-prompt/index.js "${keyword}"${referenceImagePath ? ` ${referenceImagePath}` : ''}`);
        process.exit(1);
      } catch (e2) {
        console.error('❌ Error: Cannot import service module');
        console.error('   Tried:', join(servicesPath, 'geminiService.js'));
        console.error('   Tried:', join(servicesPath, 'geminiService.ts'));
        console.error('   💡 Solution: Use the CLI command instead:');
        console.error(`      doufang-prompt "${keyword}"${referenceImagePath ? ` ${referenceImagePath}` : ''}`);
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
