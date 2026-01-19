#!/usr/bin/env node

/**
 * Doufang Skills Initialization Tool
 * Sets up skills for Cursor / Windsurf / Antigravity
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, statSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get package root directory
const packageRoot = resolve(__dirname, '..');

/**
 * Get the path to skills directory
 */
function getSkillsPath() {
  const possiblePaths = [
    join(packageRoot, 'skills'),
    join(packageRoot, 'node_modules', '@justin_666', 'square-couplets-master-skills', 'skills'),
    join(process.cwd(), 'node_modules', '@justin_666', 'square-couplets-master-skills', 'skills'),
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

  return join(packageRoot, 'skills');
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Initialize for Cursor
 */
function initCursor(projectPath) {
  const skillsPath = getSkillsPath();
  const targetSkillsPath = join(projectPath, 'skills');
  
  console.log('📦 Setting up Doufang Skills for Cursor...');
  
  // Copy skills directory to project
  if (existsSync(skillsPath)) {
    console.log(`   Copying skills from ${skillsPath}...`);
    copyDir(skillsPath, targetSkillsPath);
    console.log(`   ✅ Skills copied to ${targetSkillsPath}`);
  } else {
    console.error(`   ❌ Skills directory not found at ${skillsPath}`);
    return false;
  }
  
  // Create .cursorrules file
  const cursorRulesPath = join(projectPath, '.cursorrules');
  const cursorRules = `# Doufang Skills Configuration

This project uses Doufang Skills for generating Chinese New Year artwork.

## Available Skills

- \`generate-doufang-prompt\`: Generate professional Doufang artwork prompts
- \`generate-doufang-image\`: Generate Doufang artwork images using Gemini API
- \`optimize-doufang-prompt\`: Optimize prompts to reduce white margins

## Usage

Use the slash command: \`/doufang\` followed by your request.

Examples:
- \`/doufang Generate a prompt for wealth theme\`
- \`/doufang Create a 2K image using Gemini 3 Pro\`
- \`/doufang Optimize this prompt to reduce white space\`

Skills are located in the \`skills/\` directory.
`;
  
  writeFileSync(cursorRulesPath, cursorRules);
  console.log(`   ✅ Created ${cursorRulesPath}`);
  
  console.log('\n✨ Cursor setup complete!');
  console.log('\n📝 Usage:');
  console.log('   Type "/doufang" in Cursor chat followed by your request');
  console.log('   Example: /doufang Generate a prompt for wealth theme');
  
  return true;
}

/**
 * Initialize for Windsurf
 */
function initWindsurf(projectPath) {
  const skillsPath = getSkillsPath();
  const targetSkillsPath = join(projectPath, 'skills');
  
  console.log('📦 Setting up Doufang Skills for Windsurf...');
  
  // Copy skills directory
  if (existsSync(skillsPath)) {
    console.log(`   Copying skills from ${skillsPath}...`);
    copyDir(skillsPath, targetSkillsPath);
    console.log(`   ✅ Skills copied to ${targetSkillsPath}`);
  } else {
    console.error(`   ❌ Skills directory not found at ${skillsPath}`);
    return false;
  }
  
  // Create .windsurfrules file
  const windsurfRulesPath = join(projectPath, '.windsurfrules');
  const windsurfRules = `# Doufang Skills Configuration

This project uses Doufang Skills for generating Chinese New Year artwork.

## Available Skills

- \`generate-doufang-prompt\`: Generate professional Doufang artwork prompts
- \`generate-doufang-image\`: Generate Doufang artwork images using Gemini API
- \`optimize-doufang-prompt\`: Optimize prompts to reduce white margins

## Usage

Use the slash command: \`/doufang\` followed by your request.

Examples:
- \`/doufang Generate a prompt for wealth theme\`
- \`/doufang Create a 2K image using Gemini 3 Pro\`
- \`/doufang Optimize this prompt to reduce white space\`

Skills are located in the \`skills/\` directory.
`;
  
  writeFileSync(windsurfRulesPath, windsurfRules);
  console.log(`   ✅ Created ${windsurfRulesPath}`);
  
  console.log('\n✨ Windsurf setup complete!');
  console.log('\n📝 Usage:');
  console.log('   Type "/doufang" in Windsurf chat followed by your request');
  console.log('   Example: /doufang Generate a prompt for wealth theme');
  
  return true;
}

/**
 * Initialize for Antigravity
 */
function initAntigravity(projectPath) {
  const skillsPath = getSkillsPath();
  const targetSkillsPath = join(projectPath, 'skills');
  
  console.log('📦 Setting up Doufang Skills for Antigravity...');
  
  // Copy skills directory
  if (existsSync(skillsPath)) {
    console.log(`   Copying skills from ${skillsPath}...`);
    copyDir(skillsPath, targetSkillsPath);
    console.log(`   ✅ Skills copied to ${targetSkillsPath}`);
  } else {
    console.error(`   ❌ Skills directory not found at ${skillsPath}`);
    return false;
  }
  
  // Create .antigravityrules file
  const antigravityRulesPath = join(projectPath, '.antigravityrules');
  const antigravityRules = `# Doufang Skills Configuration

This project uses Doufang Skills for generating Chinese New Year artwork.

## Available Skills

- \`generate-doufang-prompt\`: Generate professional Doufang artwork prompts
- \`generate-doufang-image\`: Generate Doufang artwork images using Gemini API
- \`optimize-doufang-prompt\`: Optimize prompts to reduce white margins

## Usage

Use the slash command: \`/doufang\` followed by your request.

Examples:
- \`/doufang Generate a prompt for wealth theme\`
- \`/doufang Create a 2K image using Gemini 3 Pro\`
- \`/doufang Optimize this prompt to reduce white space\`

Skills are located in the \`skills/\` directory.
`;
  
  writeFileSync(antigravityRulesPath, antigravityRules);
  console.log(`   ✅ Created ${antigravityRulesPath}`);
  
  console.log('\n✨ Antigravity setup complete!');
  console.log('\n📝 Usage:');
  console.log('   Type "/doufang" in Antigravity chat followed by your request');
  console.log('   Example: /doufang Generate a prompt for wealth theme');
  
  return true;
}

/**
 * Main CLI handler
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // Parse --ai option
  let aiOption = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--ai' && args[i + 1]) {
      aiOption = args[i + 1];
      break;
    } else if (args[i]?.startsWith('--ai=')) {
      aiOption = args[i].replace('--ai=', '');
      break;
    }
  }
  
  if (command !== 'init') {
    console.log(`
Doufang Skills Initialization Tool

Usage:
  doufang init --ai <ai-assistant>

Options:
  --ai <assistant>    AI assistant to configure (cursor, windsurf, antigravity, or claude)

Examples:
  doufang init --ai cursor
  doufang init --ai windsurf
  doufang init --ai antigravity
  doufang init --ai claude

For more information, visit:
  https://github.com/poirotw66/Square_Couplets_Master
    `);
    process.exit(1);
  }
  
  if (!aiOption) {
    console.error('❌ Error: Please specify an AI assistant with --ai option');
    console.error('   Example: doufang init --ai cursor');
    process.exit(1);
  }
  
  const projectPath = process.cwd();
  const ai = aiOption.toLowerCase();
  
  let success = false;
  
  switch (ai) {
    case 'cursor':
      success = initCursor(projectPath);
      break;
    case 'windsurf':
      success = initWindsurf(projectPath);
      break;
    case 'antigravity':
      success = initAntigravity(projectPath);
      break;
    case 'claude':
      // Claude Code uses same setup as Cursor
      success = initCursor(projectPath);
      break;
    default:
      console.error(`❌ Error: Unknown AI assistant "${ai}"`);
      console.error('   Supported: cursor, windsurf, antigravity, claude');
      process.exit(1);
  }
  
  if (!success) {
    process.exit(1);
  }
}

// Run CLI
main();
