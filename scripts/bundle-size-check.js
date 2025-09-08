#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 *
 * Prevents deployment failures by monitoring server bundle size
 * and alerting when changes would exceed Shopify Oxygen limits.
 *
 * Usage:
 *   npm run bundle:check           # Check current bundle size
 *   npm run bundle:check --strict  # Fail if over 1.2MB (stricter)
 *   npm run bundle:check --ci      # CI mode with detailed output
 */

import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bundle size limits (in bytes)
const LIMITS = {
  // Shopify Oxygen hard limit (deployments fail above this)
  HARD_LIMIT: 2 * 1024 * 1024, // 2MB

  // Warning threshold (should optimize above this)
  WARNING_THRESHOLD: 1.5 * 1024 * 1024, // 1.5MB

  // Optimal threshold (target size)
  OPTIMAL_THRESHOLD: 1.2 * 1024 * 1024, // 1.2MB

  // Strict mode (for CI)
  STRICT_THRESHOLD: 1.2 * 1024 * 1024, // 1.2MB
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function checkBundleExists() {
  const serverBundlePath = path.join(process.cwd(), 'dist/server/index.js');

  if (!fs.existsSync(serverBundlePath)) {
    console.log(
      colorize('⚠️  No server bundle found. Running build...', 'yellow'),
    );

    try {
      execSync('npm run build', {stdio: 'inherit'});
    } catch (error) {
      console.error(
        colorize('❌ Build failed. Cannot check bundle size.', 'red'),
      );
      process.exit(1);
    }
  }

  return serverBundlePath;
}

function analyzeBundleSize(bundlePath) {
  const stats = fs.statSync(bundlePath);
  const bundleSize = stats.size;

  // Determine status based on size
  let status, statusColor, recommendation;

  if (bundleSize > LIMITS.HARD_LIMIT) {
    status = 'CRITICAL - DEPLOYMENT WILL FAIL';
    statusColor = 'red';
    recommendation = 'IMMEDIATE ACTION REQUIRED: Bundle exceeds Oxygen limit';
  } else if (bundleSize > LIMITS.WARNING_THRESHOLD) {
    status = 'WARNING - Approaching Limit';
    statusColor = 'yellow';
    recommendation = 'Consider optimizing bundle size';
  } else if (bundleSize > LIMITS.OPTIMAL_THRESHOLD) {
    status = 'ACCEPTABLE';
    statusColor = 'blue';
    recommendation = 'Bundle size is acceptable but could be optimized';
  } else {
    status = 'OPTIMAL';
    statusColor = 'green';
    recommendation = 'Bundle size is optimal';
  }

  return {
    size: bundleSize,
    formatted: formatBytes(bundleSize),
    status,
    statusColor,
    recommendation,
    percentage: ((bundleSize / LIMITS.HARD_LIMIT) * 100).toFixed(1),
  };
}

function displayResults(analysis, options = {}) {
  const {size, formatted, status, statusColor, recommendation, percentage} =
    analysis;

  console.log('\n' + colorize('📦 Bundle Size Analysis', 'bold'));
  console.log('─'.repeat(50));
  console.log(`Server Bundle: ${colorize(formatted, statusColor)}`);
  console.log(`Status: ${colorize(status, statusColor)}`);
  console.log(
    `Oxygen Usage: ${percentage}% of ${formatBytes(LIMITS.HARD_LIMIT)} limit`,
  );
  console.log(`Recommendation: ${recommendation}`);

  if (options.verbose || options.ci) {
    console.log('\n' + colorize('📊 Size Thresholds:', 'bold'));
    console.log(
      `• Optimal: < ${formatBytes(LIMITS.OPTIMAL_THRESHOLD)} ${size <= LIMITS.OPTIMAL_THRESHOLD ? '✅' : ''}`,
    );
    console.log(
      `• Warning: < ${formatBytes(LIMITS.WARNING_THRESHOLD)} ${size <= LIMITS.WARNING_THRESHOLD ? '✅' : ''}`,
    );
    console.log(
      `• Hard Limit: < ${formatBytes(LIMITS.HARD_LIMIT)} ${size <= LIMITS.HARD_LIMIT ? '✅' : '❌'}`,
    );

    if (size > LIMITS.WARNING_THRESHOLD) {
      console.log('\n' + colorize('🔧 Optimization Suggestions:', 'bold'));
      console.log(
        '• Check dist/server/server-bundle-analyzer.html for large dependencies',
      );
      console.log('• Consider externalizing heavy client-only packages');
      console.log('• Review SVG imports and optimize large assets');
      console.log('• Use dynamic imports for client-only components');
    }
  }

  console.log('─'.repeat(50));
}

function saveBaselineSize(size) {
  const baselinePath = path.join(process.cwd(), '.bundle-baseline');
  fs.writeFileSync(baselinePath, size.toString(), 'utf8');
}

function compareWithBaseline(currentSize) {
  const baselinePath = path.join(process.cwd(), '.bundle-baseline');

  if (!fs.existsSync(baselinePath)) {
    console.log(colorize('📝 Saving current size as baseline...', 'blue'));
    saveBaselineSize(currentSize);
    return null;
  }

  const baselineSize = parseInt(fs.readFileSync(baselinePath, 'utf8'));
  const difference = currentSize - baselineSize;
  const percentChange = ((difference / baselineSize) * 100).toFixed(1);

  if (Math.abs(difference) > 1024) {
    // Only show if change > 1KB
    const changeColor = difference > 0 ? 'red' : 'green';
    const changeSymbol = difference > 0 ? '↗️' : '↘️';

    console.log(
      colorize(
        `${changeSymbol} Bundle size change: ${formatBytes(Math.abs(difference))} (${percentChange}%)`,
        changeColor,
      ),
    );

    if (difference > 100 * 1024) {
      // Warn if increase > 100KB
      console.log(
        colorize('⚠️  Significant bundle size increase detected!', 'yellow'),
      );
    }
  }

  // Update baseline
  saveBaselineSize(currentSize);

  return {
    baseline: baselineSize,
    current: currentSize,
    difference,
    percentChange,
  };
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    strict: args.includes('--strict'),
    ci: args.includes('--ci'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    help: args.includes('--help') || args.includes('-h'),
  };

  if (options.help) {
    console.log(`
${colorize('Bundle Size Checker', 'bold')}

Usage: node scripts/bundle-size-check.js [options]

Options:
  --strict     Use strict 1.2MB threshold (for CI)
  --ci         CI mode with detailed output
  --verbose    Show detailed size breakdown
  --help       Show this help message

Thresholds:
  • Optimal:    < ${formatBytes(LIMITS.OPTIMAL_THRESHOLD)}
  • Warning:    < ${formatBytes(LIMITS.WARNING_THRESHOLD)}  
  • Hard Limit: < ${formatBytes(LIMITS.HARD_LIMIT)}
`);
    process.exit(0);
  }

  console.log(colorize('🔍 Checking server bundle size...', 'blue'));

  try {
    const bundlePath = checkBundleExists();
    const analysis = analyzeBundleSize(bundlePath);

    // Compare with baseline
    compareWithBaseline(analysis.size);

    // Display results
    displayResults(analysis, options);

    // Exit code logic
    let exitCode = 0;

    if (analysis.size > LIMITS.HARD_LIMIT) {
      console.log(
        colorize('❌ CRITICAL: Bundle exceeds Oxygen deployment limit!', 'red'),
      );
      exitCode = 1;
    } else if (options.strict && analysis.size > LIMITS.STRICT_THRESHOLD) {
      console.log(
        colorize('❌ STRICT MODE: Bundle exceeds strict threshold!', 'red'),
      );
      exitCode = 1;
    } else if (analysis.size > LIMITS.WARNING_THRESHOLD) {
      console.log(
        colorize(
          '⚠️  WARNING: Bundle approaching limit - consider optimization',
          'yellow',
        ),
      );
      // Don't exit with error for warnings, but alert in CI
      if (options.ci) {
        console.log('::warning::Bundle size approaching Oxygen limit');
      }
    } else {
      console.log(
        colorize('✅ Bundle size is within acceptable limits', 'green'),
      );
    }

    process.exit(exitCode);
  } catch (error) {
    console.error(
      colorize(`❌ Error checking bundle size: ${error.message}`, 'red'),
    );
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {analyzeBundleSize, formatBytes, LIMITS};
