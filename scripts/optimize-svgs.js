#!/usr/bin/env node

import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automatically optimize SVG files using SVGO
 * This script is designed to run as a pre-commit hook or manually
 */

// Configuration
const CONFIG = {
  // Directories to search for SVGs
  searchDirs: ['app', 'studio/static'],
  // Minimum file size to optimize (in bytes) - skip tiny files
  minFileSize: 500,
  // SVGO config file
  svgoConfig: './svgo.config.cjs',
  // Extensions to process
  extensions: ['.svg'],
};

function findSvgFiles(dir) {
  const svgFiles = [];

  function walkDir(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !file.startsWith('.') &&
        file !== 'node_modules'
      ) {
        walkDir(fullPath);
      } else if (
        CONFIG.extensions.some((ext) => file.toLowerCase().endsWith(ext))
      ) {
        svgFiles.push(fullPath);
      }
    }
  }

  walkDir(dir);
  return svgFiles;
}

function getSvgFiles() {
  const allSvgFiles = [];

  for (const dir of CONFIG.searchDirs) {
    if (fs.existsSync(dir)) {
      allSvgFiles.push(...findSvgFiles(dir));
    }
  }

  return allSvgFiles.filter((file) => {
    try {
      const stats = fs.statSync(file);
      return stats.size >= CONFIG.minFileSize;
    } catch (error) {
      console.warn(`Warning: Could not stat file ${file}:`, error.message);
      return false;
    }
  });
}

function optimizeSvg(inputFile) {
  const originalSize = fs.statSync(inputFile).size;
  const tempFile = inputFile + '.tmp';

  try {
    // Run SVGO optimization
    execSync(
      `npx svgo --config=${CONFIG.svgoConfig} --input="${inputFile}" --output="${tempFile}"`,
      {
        stdio: 'pipe',
      },
    );

    // Check if optimization was successful and beneficial
    if (fs.existsSync(tempFile)) {
      const optimizedSize = fs.statSync(tempFile).size;

      // Only replace if the optimized version is smaller or roughly the same size
      if (optimizedSize <= originalSize * 1.05) {
        // Allow 5% increase for edge cases
        fs.renameSync(tempFile, inputFile);

        const savings = originalSize - optimizedSize;
        const percentage = ((savings / originalSize) * 100).toFixed(1);

        if (savings > 0) {
          console.log(`✅ Optimized: ${inputFile}`);
          console.log(
            `   ${originalSize} bytes → ${optimizedSize} bytes (-${percentage}%)`,
          );
          return {success: true, savings, percentage};
        } else {
          console.log(`✅ Processed: ${inputFile} (no size reduction)`);
          return {success: true, savings: 0, percentage: 0};
        }
      } else {
        // Optimization made the file larger, keep original
        fs.unlinkSync(tempFile);
        console.log(
          `⚠️  Skipped: ${inputFile} (optimization increased file size)`,
        );
        return {success: false, reason: 'larger'};
      }
    } else {
      console.error(
        `❌ Failed to optimize: ${inputFile} (no output file created)`,
      );
      return {success: false, reason: 'no_output'};
    }
  } catch (error) {
    // Clean up temp file if it exists
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

    console.error(`❌ Failed to optimize: ${inputFile}`);
    console.error(`   Error: ${error.message}`);
    return {success: false, reason: 'error', error: error.message};
  }
}

function main() {
  console.log('🔍 Finding SVG files to optimize...');

  const svgFiles = getSvgFiles();

  if (svgFiles.length === 0) {
    console.log('✨ No SVG files found that need optimization.');
    return;
  }

  console.log(`📦 Found ${svgFiles.length} SVG file(s) to process:`);
  svgFiles.forEach((file) => console.log(`   - ${file}`));
  console.log('');

  let totalSavings = 0;
  let optimizedCount = 0;
  let failedCount = 0;

  for (const svgFile of svgFiles) {
    const result = optimizeSvg(svgFile);

    if (result.success) {
      totalSavings += result.savings || 0;
      optimizedCount++;
    } else {
      failedCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully processed: ${optimizedCount}`);
  if (failedCount > 0) {
    console.log(`   ❌ Failed: ${failedCount}`);
  }
  if (totalSavings > 0) {
    console.log(
      `   💾 Total space saved: ${totalSavings} bytes (${(totalSavings / 1024).toFixed(1)} KB)`,
    );
  }

  console.log('\n✨ SVG optimization complete!');
}

// Run the script if called directly (ES modules)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {main, optimizeSvg, getSvgFiles};
