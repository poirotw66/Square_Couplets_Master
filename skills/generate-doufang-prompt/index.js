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

// Try to find dist directory (compiled JS) or services directory (source TS)
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
  
  // Build list of possible paths
  // IMPORTANT: We're looking for dist/services (compiled) not services/ (source)
  const possiblePaths = [
    // Global npm package - dist directory (compiled JS)
    ...(globalPrefix ? [
      join(globalPrefix, 'lib', 'node_modules', '@justin_666', 'square-couplets-master-skills', 'dist', 'services'),
      join(globalPrefix, 'node_modules', '@justin_666', 'square-couplets-master-skills', 'dist', 'services'),
    ] : []),
    // From resolved package root - dist directory
    ...(packageRoot ? [
      join(packageRoot, 'dist', 'services'),
      join(packageRoot, 'services'), // fallback to source
    ] : []),
    // Local project root - dist directory
    join(projectRoot, 'dist', 'services'),
    join(projectRoot, 'services'), // fallback to source
    // Local node_modules - dist directory
    join(projectRoot, 'node_modules', '@justin_666', 'square-couplets-master-skills', 'dist', 'services'),
    // Current working directory - dist directory
    join(process.cwd(), 'dist', 'services'),
    join(process.cwd(), 'services'),
    // Current working directory node_modules
    join(process.cwd(), 'node_modules', '@justin_666', 'square-couplets-master-skills', 'dist', 'services'),
  ];

  // Debug: log all paths being checked (enable with DEBUG_DOUFANG=1)
  if (process.env.DEBUG_DOUFANG) {
    console.log('🔍 Checking paths for services directory:');
    console.log(`   packageRoot: ${packageRoot || 'not found'}`);
    console.log(`   globalPrefix: ${globalPrefix || 'not found'}`);
    console.log(`   projectRoot: ${projectRoot}`);
    console.log(`   cwd: ${process.cwd()}`);
    console.log('\n   Trying paths:');
    for (const path of possiblePaths) {
      const exists = existsSync(path);
      console.log(`   ${exists ? '✅' : '❌'} ${path}`);
    }
  }
  
  for (const path of possiblePaths) {
    try {
      if (statSync(path).isDirectory()) {
        if (process.env.DEBUG_DOUFANG) {
          console.log(`\n✅ Found services at: ${path}`);
        }
        return path;
      }
    } catch (e) {
      // Path doesn't exist, try next
    }
  }
  
  // If not found, provide helpful error message
  if (process.env.DEBUG_DOUFANG) {
    console.log('\n❌ Services directory not found in any of the checked paths');
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

    // Dynamic import of service (prioritize compiled .js from dist/)
    let serviceModule;
    const possibleServicePaths = [
      // 1. Compiled JS in dist/ (npm package)
      join(dirname(servicesPath), 'dist', 'services', 'geminiService.js'),
      // 2. Compiled JS in services/ (if built locally)
      join(servicesPath, 'geminiService.js'),
      // 3. Source TS (development only)
      join(servicesPath, 'geminiService.ts'),
    ];
    
    let importError = null;
    for (const servicePath of possibleServicePaths) {
      try {
        if (existsSync(servicePath)) {
          serviceModule = await import(`file://${servicePath}`);
          break;
        }
      } catch (e) {
        importError = e;
        continue;
      }
    }
    
    if (!serviceModule) {
      console.error('❌ Error: Cannot import service module');
      console.error('   Tried paths:');
      possibleServicePaths.forEach(p => console.error(`   - ${p}`));
      if (importError) {
        console.error('\n   Last error:', importError.message);
      }
      console.error('\n💡 This usually means the package was not properly built.');
      console.error('   Please report this issue at: https://github.com/poirotw66/Square_Couplets_Master/issues');
      process.exit(1);
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
