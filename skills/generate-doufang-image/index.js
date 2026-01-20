#!/usr/bin/env node

/**
 * Executable script for generate-doufang-image skill
 * Can be called directly by agents or users
 */

import { dirname, join, resolve } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import {
  getProjectRoot,
  loadEnvironmentVariables,
  findServicesPath,
  getApiKey,
  showVersion,
  loadReferenceImage,
  importServiceModule,
  createProgressSpinner
} from '../shared/utils.js';

// Initialize
const projectRoot = getProjectRoot(import.meta.url);

async function main() {
  try {
    // Check for version flag
    if (process.argv.includes('--version') || process.argv.includes('-v')) {
      showVersion(projectRoot);
      process.exit(0);
    }

    // Load environment variables first
    await loadEnvironmentVariables(projectRoot);
    
    // Parse command line arguments
    const args = process.argv.slice(2).filter(arg => !arg.startsWith('-'));
    const prompt = args[0];
    const model = args[1] || 'gemini-2.5-flash-image';
    const imageSize = args[2] || '1K';
    const referenceImagePath = args[3]; // Optional reference image path
    const outputPath = args[4]; // Optional output path
    
    if (!prompt) {
      console.error('❌ Error: Prompt is required');
      console.log('\nUsage:');
      console.log('  doufang-image <prompt> [model] [size] [reference-image] [output-path]');
      console.log('\nParameters:');
      console.log('  prompt           - Image generation prompt (required)');
      console.log('  model            - Model to use: gemini-2.5-flash-image (default) or gemini-3-pro-image-preview');
      console.log('  size             - Image size: 1K (default), 2K, or 4K (Pro model only)');
      console.log('  reference-image  - Optional reference image path');
      console.log('  output-path      - Optional output file path (default: output/doufang-{timestamp}.png)');
      console.log('\nOptions:');
      console.log('  -v, --version    Show version number');
      console.log('\nExample:');
      console.log('  doufang-image "A diamond-shaped Doufang..."');
      console.log('  doufang-image "..." gemini-3-pro-image-preview 2K');
      console.log('  doufang-image "..." gemini-3-pro-image-preview 2K images/ref.png output/my-doufang.png');
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
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error('❌ Error: API Key is missing');
      console.log('💡 Set GEMINI_API_KEY in .env file or environment variable');
      process.exit(1);
    }

    // Find and import service module
    const servicesPath = findServicesPath(projectRoot);
    if (!servicesPath) {
      console.error('❌ Error: Cannot find services directory');
      console.log('💡 Make sure you are running from the project root or have installed the package');
      console.log('💡 Set DEBUG_DOUFANG=1 to see detailed path checking');
      process.exit(1);
    }

    const serviceModule = await importServiceModule(servicesPath);
    const { generateDoufangImage } = serviceModule;

    // Load reference image if provided
    let referenceImageDataUrl = null;
    if (referenceImagePath) {
      try {
        referenceImageDataUrl = loadReferenceImage(referenceImagePath);
        console.log(`🖼️  Using reference image: ${referenceImagePath}`);
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
      }
    }

    // Generate image with progress spinner
    console.log(`🎨 Generating image...`);
    console.log(`    Model: ${model}`);
    console.log(`    Size: ${imageSize}`);
    console.log('');
    
    const spinner = createProgressSpinner('Generating image... (this may take 30-60 seconds)');
    spinner.start();
    
    let imageDataUrl;
    try {
      imageDataUrl = await generateDoufangImage(
        prompt,
        apiKey,
        model,
        imageSize,
        referenceImageDataUrl
      );
      spinner.stop('✅ Image generated successfully!');
    } catch (error) {
      spinner.stop('');
      throw error;
    }
    
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
    
    console.log(`📁 Saved to: ${finalOutputPath}`);
    console.log(`📊 File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Also output data URL for programmatic use
    console.log('\n📋 Image data URL (for programmatic use):');
    console.log(imageDataUrl.substring(0, 100) + '...');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) {
      console.error('\nDetails:');
      if (error.details.triedPaths) {
        console.error('  Tried paths:');
        error.details.triedPaths.forEach(p => console.error(`    - ${p}`));
      }
      if (error.details.lastError) {
        console.error(`  Last error: ${error.details.lastError}`);
      }
    }
    if (process.env.DEBUG_DOUFANG && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
