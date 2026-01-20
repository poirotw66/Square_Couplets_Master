#!/usr/bin/env node

/**
 * Executable script for generate-doufang-prompt skill
 * Can be called directly by agents or users
 */

import { resolve } from 'path';
import {
  getProjectRoot,
  loadEnvironmentVariables,
  findServicesPath,
  getApiKey,
  showVersion,
  loadReferenceImage,
  importServiceModule
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
    const keyword = args[0];
    const referenceImagePath = args[1]; // Optional reference image path
    
    if (!keyword) {
      console.error('❌ Error: Keyword is required');
      console.log('\nUsage:');
      console.log('  doufang-prompt <keyword> [reference-image-path]');
      console.log('\nOptions:');
      console.log('  -v, --version    Show version number');
      console.log('\nExample:');
      console.log('  doufang-prompt "財富"');
      console.log('  doufang-prompt "健康" images/reference.png');
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
    const { generateDoufangPrompt } = serviceModule;

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

    // Generate prompt
    console.log(`📝 Generating prompt for keyword: "${keyword}"`);
    
    const result = await generateDoufangPrompt(keyword, apiKey, referenceImageDataUrl);
    
    // Output as JSON
    console.log(JSON.stringify(result, null, 2));

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
