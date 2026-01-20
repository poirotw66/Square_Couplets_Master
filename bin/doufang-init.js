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
 * Get package version
 */
function getVersion() {
  try {
    const packageJsonPath = join(packageRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version || 'unknown';
  } catch (e) {
    return 'unknown';
  }
}

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
  
  // Create .cursor/commands directory for Cursor Commands (preferred over rules)
  const cursorCommandsDir = join(projectPath, '.cursor', 'commands');
  if (!existsSync(cursorCommandsDir)) {
    mkdirSync(cursorCommandsDir, { recursive: true });
  }
  
  // Create doufang.md command file for slash command
  const doufangCommandPath = join(cursorCommandsDir, 'doufang.md');
  const doufangCommand = `# Doufang Skills Command

## Description
Generate Chinese New Year Doufang artwork using Doufang Skills CLI commands.

## CRITICAL RULES - READ FIRST

**🚨 NEVER CREATE SCRIPT FILES 🚨**
- **DO NOT** create any .js, .ts, .mjs, or any script files
- **DO NOT** write code to files
- **DO** execute CLI commands directly in the terminal
- The CLI commands are already installed and ready to use

## How This Works

You are a Doufang assistant. When the user uses the \`/doufang\` command or asks about Doufang functionality, follow these guidelines:

## Available CLI Commands

1. **Generate Prompt**: \`doufang-prompt <keyword> [reference-image]\`
   - Generates a professional Doufang artwork prompt based on a keyword
   - Example: \`doufang-prompt "財富"\`
   - Example with reference: \`doufang-prompt "健康" images/reference.png\`

2. **Generate Image**: \`doufang-image <prompt> [model] [size] [reference-image] [output-path]\`
   - Generates actual Doufang artwork images using Gemini API
   - Models: \`gemini-2.5-flash-image\` (fast, 1K only) or \`gemini-3-pro-image-preview\` (high quality, 1K/2K/4K)
   - Sizes: \`1K\` (default), \`2K\`, \`4K\` (Pro model only)
   - Example: \`doufang-image "A diamond-shaped Doufang..." gemini-3-pro-image-preview 2K\`

3. **Optimize Prompt**: \`doufang-optimize <prompt>\`
   - Optimizes prompts to reduce white margins and improve composition
   - Example: \`doufang-optimize "A prompt with wide margins..."\`

## Step-by-Step Execution Guide

### When User Says: "生成財富主題的 prompt"
1. Execute this command in terminal: \`doufang-prompt "財富"\`
2. Wait for JSON output
3. Show the result to user

### When User Says: "用上述 prompt 生成 2K 圖片"
1. Extract the imagePrompt from previous output
2. Execute this command in terminal: \`doufang-image "<imagePrompt>" gemini-3-pro-image-preview 2K\`
3. Wait for image to be saved
4. Show the file path to user

### When User Says: "優化這個 prompt"
1. Execute this command in terminal: \`doufang-optimize "<prompt>"\`
2. Wait for optimized prompt
3. Show the result to user

## Execution Guidelines

- **Use Terminal Command Execution**: Use the run_terminal_cmd tool to execute commands
- **No Script Creation**: You must NOT create any files. Just execute the CLI commands.
- **API Key**: Commands automatically read GEMINI_API_KEY from .env or .env.local
- **Error Handling**: If API key is missing, guide user to set GEMINI_API_KEY in .env file
- **Output**: Commands output JSON or save files to output/ directory

## Common Workflows

### Generate Image from Keyword
1. Execute: \`doufang-prompt "財富"\` (directly in terminal, no script creation)
2. Extract imagePrompt from JSON output
3. Execute: \`doufang-image "<imagePrompt>" gemini-3-pro-image-preview 2K\` (directly in terminal, no script creation)

### Generate Image with Reference
1. Execute: \`doufang-prompt "健康" images/reference.png\` (directly in terminal)
2. Extract imagePrompt from JSON output
3. Execute: \`doufang-image "<imagePrompt>" gemini-3-pro-image-preview 2K images/reference.png\` (directly in terminal)

### Optimize and Generate
1. Execute: \`doufang-prompt "財富"\` (directly in terminal)
2. Execute: \`doufang-optimize "<imagePrompt>"\` (directly in terminal)
3. Execute: \`doufang-image "<optimizedPrompt>" gemini-3-pro-image-preview 2K\` (directly in terminal)

## Example: Complete Workflow

\`\`\`
User: /doufang 生成一個財富主題的 2K 圖片

Your Action:
Step 1: Execute in terminal
$ doufang-prompt "財富"
[Wait for output]

Step 2: Extract imagePrompt from JSON output, then execute in terminal
$ doufang-image "<extracted-imagePrompt>" gemini-3-pro-image-preview 2K
[Wait for image to be saved]

Step 3: Tell user the image path
\`\`\`

## FINAL REMINDERS

✅ DO:
- Execute: \`doufang-prompt "keyword"\`
- Execute: \`doufang-image "prompt" model size\`
- Execute: \`doufang-optimize "prompt"\`
- Use run_terminal_cmd tool

❌ DO NOT:
- Create .js files
- Create .ts files
- Create any script files
- Write code to files
- Use write tool or edit tool

The commands are already installed. Just run them!

## Skills Location

Skills are located in the \`skills/\` directory. Each skill has a \`SKILL.md\` file with detailed instructions.

## API Key Setup

The \`generate-doufang-image\` command requires GEMINI_API_KEY. Check for it in:
- .env.local (priority)
- .env
- Environment variable GEMINI_API_KEY

Get API key from: https://aistudio.google.com/
`;
  
  writeFileSync(doufangCommandPath, doufangCommand);
  console.log(`   ✅ Created ${doufangCommandPath}`);
  console.log(`   ✅ Slash command /doufang registered in Cursor Commands`);
  
  console.log('\n✨ Cursor setup complete!');
  console.log('\n📝 Usage:');
  console.log('   1. Restart Cursor to load the new command');
  console.log('   2. Type "/" in Cursor chat to see available commands');
  console.log('   3. Select "/doufang" from the dropdown');
  console.log('   4. Enter your request, e.g.: "Generate a prompt for wealth theme"');
  console.log('   5. Or directly type: /doufang Generate a prompt for wealth theme');
  console.log('\n⚠️  IMPORTANT: The /doufang command will execute CLI commands directly.');
  console.log('   It will NOT create any script files. Just run terminal commands.');
  
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
  
  // Handle version flag (check before parsing other options)
  if (command === '--version' || command === '-v' || command === 'version') {
    console.log(getVersion());
    process.exit(0);
  }
  
  // Parse --ai option
  let aiOption = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--ai' && args[i + 1]) {
      aiOption = args[i + 1];
      break;
    } else if (args[i]?.startsWith('--ai=')) {
      aiOption = args[i].replace('--ai=', '');
      break;
    } else if (args[i] === '--version' || args[i] === '-v' || args[i] === 'version') {
      console.log(getVersion());
      process.exit(0);
    }
  }
  
  if (command !== 'init') {
    console.log(`
Doufang Skills Initialization Tool

Usage:
  doufang init --ai <ai-assistant>

Options:
  --ai <assistant>    AI assistant to configure (cursor, windsurf, antigravity, or claude)
  --version, -v       Show version number

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
