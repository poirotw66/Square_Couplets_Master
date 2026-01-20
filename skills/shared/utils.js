#!/usr/bin/env node

/**
 * Shared utility functions for all Doufang skills
 * Provides common functionality to avoid code duplication
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { createRequire } from 'module';

/**
 * Get project root directory
 */
export function getProjectRoot(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = dirname(__filename);
  const skillDir = resolve(__dirname);
  return resolve(skillDir, '../..');
}

/**
 * Load environment variables from .env files
 */
export async function loadEnvironmentVariables(projectRoot) {
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

/**
 * Find services directory (supports both compiled dist/ and source services/)
 */
export function findServicesPath(projectRoot) {
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
  
  // Build list of possible paths
  // IMPORTANT: We're looking for dist/services (compiled) not services/ (source)
  const possiblePaths = [
    // Global npm package - dist directory (compiled JS)
    ...(globalPrefix ? [
      join(globalPrefix, 'lib', 'node_modules', '@justin_666', 'square-couplets-master-skills', 'dist', 'services'),
      join(globalPrefix, 'node_modules', '@justin_666', 'square-couplets-master-skills', 'dist', 'services'),
    ] : []),
    // From resolved package root - dist directory
    ...(packageRoot ? [
      join(packageRoot, 'dist', 'services'),
      join(packageRoot, 'services'), // fallback to source
    ] : []),
    // Local project root - dist directory
    join(projectRoot, 'dist', 'services'),
    join(projectRoot, 'services'), // fallback to source
    // Local node_modules - dist directory
    join(projectRoot, 'node_modules', '@justin_666', 'square-couplets-master-skills', 'dist', 'services'),
    // Current working directory - dist directory
    join(process.cwd(), 'dist', 'services'),
    join(process.cwd(), 'services'),
    // Current working directory node_modules
    join(process.cwd(), 'node_modules', '@justin_666', 'square-couplets-master-skills', 'dist', 'services'),
  ];

  // Debug: log all paths being checked (enable with DEBUG_DOUFANG=1)
  if (process.env.DEBUG_DOUFANG) {
    console.log('🔍 Checking paths for services directory:');
    console.log(`   packageRoot: ${packageRoot || 'not found'}`);
    console.log(`   globalPrefix: ${globalPrefix || 'not found'}`);
    console.log(`   projectRoot: ${projectRoot}`);
    console.log(`   cwd: ${process.cwd()}`);
    console.log('\n   Trying paths:');
    for (const path of possiblePaths) {
      const exists = existsSync(path);
      console.log(`   ${exists ? '✅' : '❌'} ${path}`);
    }
  }
  
  for (const path of possiblePaths) {
    try {
      if (statSync(path).isDirectory()) {
        if (process.env.DEBUG_DOUFANG) {
          console.log(`\n✅ Found services at: ${path}`);
        }
        return path;
      }
    } catch (e) {
      // Path doesn't exist, try next
    }
  }
  
  // If not found, provide helpful error message
  if (process.env.DEBUG_DOUFANG) {
    console.log('\n❌ Services directory not found in any of the checked paths');
  }
  return null;
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filePath) {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp'
  };
  return mimeTypes[ext] || 'image/png'; // default to png
}

/**
 * Get API key from environment variables
 */
export function getApiKey() {
  return process.env.GEMINI_API_KEY || 
         process.env.API_KEY || 
         process.env.GOOGLE_GENAI_API_KEY;
}

/**
 * Show version from package.json
 */
export function showVersion(projectRoot) {
  const packageJsonPath = join(projectRoot, 'package.json');
  if (existsSync(packageJsonPath)) {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    console.log(`v${pkg.version}`);
  } else {
    console.log('version unknown');
  }
}

/**
 * Create a progress spinner for long-running operations
 */
export function createProgressSpinner(message = 'Processing...') {
  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let spinnerIndex = 0;
  let interval = null;

  return {
    start() {
      interval = setInterval(() => {
        process.stdout.write(`\r${spinner[spinnerIndex]} ${message}`);
        spinnerIndex = (spinnerIndex + 1) % spinner.length;
      }, 80);
    },
    
    stop(finalMessage = '') {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      if (finalMessage) {
        process.stdout.write(`\r${finalMessage}${' '.repeat(50)}\n`);
      } else {
        process.stdout.write('\r' + ' '.repeat(100) + '\r');
      }
    }
  };
}

/**
 * Load reference image as data URL
 */
export function loadReferenceImage(referenceImagePath) {
  const fullPath = resolve(process.cwd(), referenceImagePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Reference image not found: ${fullPath}`);
  }
  
  const imageBuffer = readFileSync(fullPath);
  const base64 = imageBuffer.toString('base64');
  const mimeType = getMimeType(referenceImagePath);
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Import service module dynamically
 */
export async function importServiceModule(servicesPath) {
  const possibleServicePaths = [
    // 1. Compiled JS in dist/ (npm package)
    join(dirname(servicesPath), 'dist', 'services', 'geminiService.js'),
    // 2. Compiled JS in services/ (if built locally)
    join(servicesPath, 'geminiService.js'),
    // 3. Source TS (development only)
    join(servicesPath, 'geminiService.ts'),
  ];
  
  let importError = null;
  for (const servicePath of possibleServicePaths) {
    try {
      if (existsSync(servicePath)) {
        return await import(`file://${servicePath}`);
      }
    } catch (e) {
      importError = e;
      continue;
    }
  }
  
  // If we get here, nothing worked
  const error = new Error('Cannot import service module');
  error.details = {
    triedPaths: possibleServicePaths,
    lastError: importError?.message
  };
  throw error;
}
