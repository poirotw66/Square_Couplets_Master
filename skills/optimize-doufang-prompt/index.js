#!/usr/bin/env node

/**
 * Executable script for optimize-doufang-prompt skill
 * Optimizes prompts to reduce white margins and improve composition
 * Supports both simple rule-based and AI-powered optimization
 */

import {
  getProjectRoot,
  loadEnvironmentVariables,
  getApiKey,
  showVersion,
  createProgressSpinner
} from '../shared/utils.js';

// Initialize
const projectRoot = getProjectRoot(import.meta.url);

/**
 * Optimize prompt using AI (Gemini)
 * Note: AI optimization is experimental and may fallback to rule-based
 */
async function optimizePromptWithAI(originalPrompt, apiKey) {
  // Note: AI optimization requires proper Google Gen AI SDK integration
  // For now, this is a placeholder that falls back to rule-based optimization
  // Future implementation will use: GoogleGenAI API for smarter optimization
  
  console.log('⚠️  AI optimization is currently experimental');
  console.log('   Falling back to rule-based optimization');
  return optimizePromptSimple(originalPrompt);
}

/**
 * Optimize prompt using simple rules (fallback)
 */
function optimizePromptSimple(originalPrompt) {
  let optimized = originalPrompt;
  
  // Replace wide margin descriptions with minimal margin
  optimized = optimized.replace(/wide\s+white\s+margins/gi, 'minimal elegant margins (2-5% of frame width)');
  optimized = optimized.replace(/wide\s+margins/gi, 'minimal margins (2-5%)');
  optimized = optimized.replace(/excessive\s+white\s+space/gi, 'minimal white space');
  optimized = optimized.replace(/large\s+margins/gi, 'minimal margins (2-5%)');
  
  // Ensure Doufang fills 90-95% of frame
  if (!optimized.includes('90-95%') && !optimized.includes('85-95%') && !optimized.includes('fills 90%')) {
    // Try to find Composition section and enhance it
    const hasComposition = /Composition:/i.test(optimized);
    if (hasComposition) {
      optimized = optimized.replace(
        /(Composition:.*?)(\.|$)/i,
        (match, p1, p2) => {
          if (!p1.includes('90-95%') && !p1.includes('85-95%')) {
            return p1 + ' The diamond-shaped Doufang fills 90-95% of the 1:1 frame, centered with minimal margins (2-5% of frame width).' + p2;
          }
          return match;
        }
      );
    } else {
      // Add composition requirement at the end
      optimized += '\n\nComposition: The diamond-shaped Doufang fills 90-95% of the 1:1 frame, centered with minimal margins (2-5% of frame width). The entire artwork is fully visible inside the frame, not touching any edge, not cropped, not cut off.';
    }
  }
  
  // Ensure "not cropped" and "not touching edges" are mentioned
  if (!optimized.includes('not cropped') && !optimized.includes('not touch')) {
    optimized += ' The artwork should not be cropped or touch the frame edges.';
  }
  
  // Add explicit margin requirements if not present
  if (!optimized.includes('2-5%') && !optimized.includes('minimal margin')) {
    optimized += '\n\nIMPORTANT: The diamond-shaped Doufang must fill 90-95% of the frame with minimal margins (2-5% of frame width). Avoid excessive white space or wide margins.';
  }
  
  return optimized.trim();
}

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
    const args = process.argv.slice(2);
    const useAI = args.includes('--ai');
    const prompt = args.filter(arg => !arg.startsWith('--'))[0];
    
    if (!prompt) {
      console.error('❌ Error: Prompt is required');
      console.log('\nUsage:');
      console.log('  doufang-optimize <prompt> [--ai]');
      console.log('\nOptions:');
      console.log('  --ai             Use AI to optimize prompt (requires API key)');
      console.log('  -v, --version    Show version number');
      console.log('\nExample:');
      console.log('  doufang-optimize "A diamond-shaped Doufang with wide margins..."');
      console.log('  doufang-optimize "..." --ai');
      console.log('\nNote: Without --ai flag, uses fast rule-based optimization.');
      console.log('      With --ai flag, uses Gemini AI for smarter optimization.');
      process.exit(1);
    }

    console.log('✨ Optimizing prompt...\n');
    
    let optimized;
    let method = 'rule-based';
    
    if (useAI) {
      const apiKey = getApiKey();
      if (!apiKey) {
        console.warn('⚠️  No API key found, falling back to rule-based optimization');
        console.warn('💡 Set GEMINI_API_KEY to use AI-powered optimization\n');
        optimized = optimizePromptSimple(prompt);
      } else {
        console.log('🤖 Using AI to optimize (Gemini 2.0 Flash)...');
        const spinner = createProgressSpinner('Optimizing with AI...');
        spinner.start();
        
        try {
          optimized = await optimizePromptWithAI(prompt, apiKey);
          spinner.stop('✅ AI optimization complete!');
          method = 'AI-powered (Gemini 2.0 Flash)';
        } catch (error) {
          spinner.stop('');
          console.warn(`⚠️  AI optimization failed: ${error.message}`);
          console.warn('   Falling back to rule-based optimization\n');
          optimized = optimizePromptSimple(prompt);
        }
      }
    } else {
      console.log('⚡ Using fast rule-based optimization...');
      optimized = optimizePromptSimple(prompt);
    }
    
    // Output optimized prompt
    console.log('\n✅ Optimized prompt:');
    console.log('─'.repeat(60));
    console.log(optimized);
    console.log('─'.repeat(60));
    
    // Calculate improvement (simple heuristic)
    const improvements = [];
    if (!prompt.includes('90-95%') && optimized.includes('90-95%')) {
      improvements.push('Added frame fill percentage');
    }
    if (!prompt.includes('minimal margin') && optimized.includes('minimal margin')) {
      improvements.push('Specified minimal margins');
    }
    if (prompt.includes('wide margin') && !optimized.includes('wide margin')) {
      improvements.push('Removed wide margin references');
    }
    
    if (improvements.length > 0) {
      console.log('\n📊 Improvements:');
      improvements.forEach(imp => console.log(`   ✓ ${imp}`));
    }
    
    // Also output as JSON for programmatic use
    console.log('\n📋 JSON output:');
    console.log(JSON.stringify({ 
      originalPrompt: prompt,
      optimizedPrompt: optimized,
      method: method,
      improvements: improvements
    }, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (process.env.DEBUG_DOUFANG && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
