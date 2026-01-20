#!/usr/bin/env node

/**
 * Doufang Skills CLI Tool
 * Provides access to Claude Agent Skills for generating Chinese New Year Doufang artwork
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get package root directory (parent of bin/)
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
  // Try multiple possible locations
  const possiblePaths = [
    join(packageRoot, 'skills'),
    join(packageRoot, 'node_modules', '@square-couplets-master', 'skills', 'skills'),
    join(process.cwd(), 'node_modules', '@square-couplets-master', 'skills', 'skills'),
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

  // Fallback to package root skills
  return join(packageRoot, 'skills');
}

/**
 * List all available skills
 */
function listSkills() {
  const skillsPath = getSkillsPath();
  
  try {
    const skills = readdirSync(skillsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (skills.length === 0) {
      console.error('No skills found in', skillsPath);
      process.exit(1);
    }

    console.log('\n📚 Available Doufang Skills:\n');
    
    for (const skillName of skills) {
      const skillPath = join(skillsPath, skillName, 'SKILL.md');
      try {
        const skillContent = readFileSync(skillPath, 'utf-8');
        const frontmatterMatch = skillContent.match(/^---\n([\s\S]*?)\n---/);
        
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const nameMatch = frontmatter.match(/name:\s*(.+)/);
          const descMatch = frontmatter.match(/description:\s*(.+)/);
          
          const name = nameMatch ? nameMatch[1].trim() : skillName;
          const desc = descMatch ? descMatch[1].trim() : 'No description';
          
          console.log(`  ✨ ${name}`);
          console.log(`     ${desc}\n`);
        } else {
          console.log(`  ✨ ${skillName}\n`);
        }
      } catch (e) {
        console.log(`  ✨ ${skillName} (error reading skill file)\n`);
      }
    }
  } catch (error) {
    console.error('Error reading skills directory:', error.message);
    process.exit(1);
  }
}

/**
 * Show a specific skill
 */
function showSkill(skillName) {
  const skillsPath = getSkillsPath();
  const skillPath = join(skillsPath, skillName, 'SKILL.md');
  
  try {
    const skillContent = readFileSync(skillPath, 'utf-8');
    console.log(skillContent);
  } catch (error) {
    console.error(`Error reading skill "${skillName}":`, error.message);
    console.error(`\nAvailable skills:`);
    listSkills();
    process.exit(1);
  }
}

/**
 * Get skill path (for programmatic access)
 */
function getSkillPath(skillName) {
  const skillsPath = getSkillsPath();
  return join(skillsPath, skillName, 'SKILL.md');
}

/**
 * Main CLI handler
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Handle version flag
  if (command === '--version' || command === '-v' || command === 'version') {
    console.log(getVersion());
    process.exit(0);
  }
  
  if (!command || command === 'list' || command === 'ls') {
    listSkills();
  } else if (command === 'show' || command === 'view') {
    const skillName = args[1];
    if (!skillName) {
      console.error('Usage: doufang-skills show <skill-name>');
      console.error('\nAvailable skills:');
      listSkills();
      process.exit(1);
    }
    showSkill(skillName);
  } else if (command === 'path') {
    const skillName = args[1];
    if (!skillName) {
      console.error('Usage: doufang-skills path <skill-name>');
      process.exit(1);
    }
    const path = getSkillPath(skillName);
    console.log(path);
  } else if (command === 'help' || command === '--help' || command === '-h') {
    console.log(`
Doufang Skills CLI Tool

Usage:
  doufang-skills [command] [options]

Commands:
  list, ls              List all available skills
  show <skill-name>     Show a specific skill's content
  path <skill-name>     Get the file path to a skill
  version, --version    Show version number
  help                  Show this help message

Examples:
  doufang-skills list
  doufang-skills show generate-doufang-prompt
  doufang-skills path generate-doufang-image

For more information, visit:
  https://github.com/poirotw66/Square_Couplets_Master
    `);
  } else {
    console.error(`Unknown command: ${command}`);
    console.error('Run "doufang-skills help" for usage information.');
    process.exit(1);
  }
}

// Run CLI
main();
