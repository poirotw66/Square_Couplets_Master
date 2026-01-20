#!/usr/bin/env node

/**
 * CLI command for generate-doufang-image skill
 * Usage: doufang-image <prompt> [model] [size] [reference-image] [output-path]
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync } from 'fs';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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

// Path to the skill script
const skillScript = join(packageRoot, 'skills', 'generate-doufang-image', 'index.js');

// Forward all arguments to the skill script
const args = process.argv.slice(2);

// Handle version flag
if (args[0] === '--version' || args[0] === '-v' || args[0] === 'version') {
  console.log(getVersion());
  process.exit(0);
}

const child = spawn('node', [skillScript, ...args], {
  stdio: 'inherit',
  cwd: process.cwd()
});

child.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
