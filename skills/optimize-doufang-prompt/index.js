#!/usr/bin/env node

/**
 * Executable script for optimize-doufang-prompt skill
 * Optimizes prompts to reduce white margins and improve composition
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, statSync } from 'fs';
import { config } from 'dotenv';

// Resolve project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const skillDir = resolve(__dirname);
const projectRoot = resolve(skillDir, '../..');

// Load environment variables
const envLocalPath = join(projectRoot, '.env.local');
const envPath = join(projectRoot, '.env');

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  config();
}

async function optimizePrompt(originalPrompt) {
  // This is a simple optimization - in a real implementation,
  // you might want to use an LLM to optimize the prompt
  
  let optimized = originalPrompt;
  
  // Replace wide margin descriptions with minimal margin
  optimized = optimized.replace(/wide\s+white\s+margins/gi, 'minimal elegant margins (2-5% of frame width)');
  optimized = optimized.replace(/wide\s+margins/gi, 'minimal margins (2-5%)');
  optimized = optimized.replace(/excessive\s+white\s+space/gi, 'minimal white space');
  
  // Ensure Doufang fills 85-95% of frame
  if (!optimized.includes('85-95%')) {
    optimized = optimized.replace(
      /(Composition:.*?)(\.|$)/i,
      (match, p1, p2) => {
        if (!p1.includes('85-95%')) {
          return p1 + ' The Doufang should fill 85-95% of the image area, maximizing visual impact.' + p2;
        }
        return match;
      }
    );
  }
  
  // Add explicit margin requirements if not present
  if (!optimized.includes('2-5%')) {
    optimized += '\n\nIMPORTANT: The diamond-shaped Doufang must fill 85-95% of the frame with minimal margins (2-5% of frame width). Avoid excessive white space or wide margins.';
  }
  
  return optimized;
}

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const prompt = args[0];
    
    if (!prompt) {
      console.error('❌ Error: Prompt is required');
      console.log('\nUsage:');
      console.log('  node skills/optimize-doufang-prompt/index.js <prompt>');
      console.log('\nOr pipe prompt:');
      console.log('  echo "A diamond-shaped..." | node skills/optimize-doufang-prompt/index.js');
      console.log('\nExample:');
      console.log('  node skills/optimize-doufang-prompt/index.js "A diamond-shaped Doufang with wide white margins..."');
      process.exit(1);
    }

    // Optimize prompt
    console.log('✨ Optimizing prompt...\n');
    const optimized = await optimizePrompt(prompt);
    
    // Output optimized prompt
    console.log('✅ Optimized prompt:');
    console.log('─'.repeat(60));
    console.log(optimized);
    console.log('─'.repeat(60));
    
    // Also output as JSON for programmatic use
    console.log('\n📋 JSON output:');
    console.log(JSON.stringify({ optimizedPrompt: optimized }, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
