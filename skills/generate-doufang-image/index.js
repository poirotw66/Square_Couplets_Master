#!/usr/bin/env node

/**
 * Executable script for generate-doufang-image skill
 * Can be called directly by agents or users
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'fs';
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
const cwdEnvLocalPath = join(process.cwd(), '.env.local');
const cwdEnvPath = join(process.cwd(), '.env');

if (existsSync(envLocalPath)) {
  dotenvConfig({ path: envLocalPath });
} else if (existsSync(envPath)) {
  dotenvConfig({ path: envPath });
} else if (existsSync(cwdEnvLocalPath)) {
  dotenvConfig({ path: cwdEnvLocalPath });
} else if (existsSync(cwdEnvPath)) {
  dotenvConfig({ path: cwdEnvPath });
} else {
  dotenvConfig();
}

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const prompt = args[0];
    const model = args[1] || 'gemini-2.5-flash-image';
    const imageSize = args[2] || '1K';
    const referenceImagePath = args[3]; // Optional reference image path
    const outputPath = args[4]; // Optional output path
    
    if (!prompt) {
      console.error('❌ Error: Prompt is required');
      console.log('\nUsage:');
      console.log('  node skills/generate-doufang-image/index.js <prompt> [model] [size] [reference-image] [output-path]');
      console.log('\nParameters:');
      console.log('  prompt           - Image generation prompt (required)');
      console.log('  model            - Model to use: gemini-2.5-flash-image (default) or gemini-3-pro-image-preview');
      console.log('  size             - Image size: 1K (default), 2K, or 4K (Pro model only)');
      console.log('  reference-image  - Optional reference image path');
      console.log('  output-path      - Optional output file path (default: output/doufang-{timestamp}.png)');
      console.log('\nExample:');
      console.log('  node skills/generate-doufang-image/index.js "A diamond-shaped Doufang..."');
      console.log('  node skills/generate-doufang-image/index.js "..." gemini-3-pro-image-preview 2K');
      console.log('  node skills/generate-doufang-image/index.js "..." gemini-3-pro-image-preview 2K images/ref.png output/my-doufang.png');
      process.exit(1);
    }

    // Validate image size
    if (!['1K', '2K', '4K'].includes(imageSize)) {
      console.error('❌ Error: Invalid image size. Must be 1K, 2K, or 4K');
      process.exit(1);
    }

    // Validate model and size combination
    if (model === 'gemini-2.5-flash-image' && imageSize !== '1K') {
      console.error('❌ Error: Flash model only supports 1K resolution');
      console.log('💡 Use Pro model (gemini-3-pro-image-preview) for 2K/4K');
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
    const { generateDoufangImage } = serviceModule;

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

    // Generate image
    console.log(`🖼️  Generating image...`);
    console.log(`    Model: ${model}`);
    console.log(`    Size: ${imageSize}`);
    if (referenceImagePath) {
      console.log(`    Reference: ${referenceImagePath}`);
    }
    console.log('    This may take a while, please wait...\n');
    
    const imageDataUrl = await generateDoufangImage(
      prompt,
      apiKey,
      model,
      imageSize,
      referenceImageDataUrl
    );
    
    // Extract base64 data
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Determine output path
    let finalOutputPath = outputPath;
    if (!finalOutputPath) {
      const outputDir = join(process.cwd(), 'output');
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      const timestamp = Date.now();
      finalOutputPath = join(outputDir, `doufang-${timestamp}.png`);
    } else {
      finalOutputPath = resolve(process.cwd(), finalOutputPath);
      // Ensure output directory exists
      const outputDir = dirname(finalOutputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
    }
    
    // Save image
    writeFileSync(finalOutputPath, buffer);
    
    console.log('✅ Image generated successfully!');
    console.log(`📁 Saved to: ${finalOutputPath}`);
    console.log(`📊 File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Also output data URL for programmatic use
    console.log('\n📋 Image data URL (for programmatic use):');
    console.log(imageDataUrl.substring(0, 100) + '...');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
