#!/usr/bin/env node

/**
 * CLI command for optimize-doufang-prompt skill
 * Usage: doufang-optimize <prompt>
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, '..');

// Path to the skill script
const skillScript = join(packageRoot, 'skills', 'optimize-doufang-prompt', 'index.js');

// Forward all arguments to the skill script
const args = process.argv.slice(2);

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
