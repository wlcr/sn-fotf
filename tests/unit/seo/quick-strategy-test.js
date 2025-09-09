#!/usr/bin/env node

// Quick test to verify the SEO strategy logic works correctly
import {generateRobotsTxt} from '../../../app/lib/seo';

console.log('🧪 Testing SEO Strategy Logic\n');

// Test Marketing Mode (default/recommended)
console.log('🎯 MARKETING MODE:');
const marketingResult = generateRobotsTxt({
  globalSeoControls: {
    seoStrategy: 'marketing',
    emergencyPrivateMode: false,
  },
});
console.log(marketingResult);
console.log('\n' + '='.repeat(50) + '\n');

// Test Private Mode
console.log('🔒 PRIVATE MODE:');
const privateResult = generateRobotsTxt({
  globalSeoControls: {
    seoStrategy: 'private',
    emergencyPrivateMode: false,
  },
});
console.log(privateResult);
console.log('\n' + '='.repeat(50) + '\n');

// Test Homepage Only Mode
console.log('🏠 HOMEPAGE ONLY MODE:');
const homepageOnlyResult = generateRobotsTxt({
  globalSeoControls: {
    seoStrategy: 'homepage_only',
    emergencyPrivateMode: false,
  },
});
console.log(homepageOnlyResult);
console.log('\n' + '='.repeat(50) + '\n');

// Test Emergency Mode (overrides everything)
console.log('🚨 EMERGENCY MODE:');
const emergencyResult = generateRobotsTxt({
  globalSeoControls: {
    seoStrategy: 'marketing', // This should be overridden
    emergencyPrivateMode: true,
  },
});
console.log(emergencyResult);
console.log('\n' + '='.repeat(50) + '\n');

// Test Custom Mode - Discoverable + Crawling Allowed
console.log('⚙️ CUSTOM MODE (Full Access):');
const customFullResult = generateRobotsTxt({
  globalSeoControls: {
    seoStrategy: 'custom',
    emergencyPrivateMode: false,
    siteDiscoverable: true,
    allowRobotsCrawling: true,
  },
});
console.log(customFullResult);
console.log('\n' + '='.repeat(50) + '\n');

// Test Custom Mode - Not Discoverable
console.log('⚙️ CUSTOM MODE (Not Discoverable):');
const customPrivateResult = generateRobotsTxt({
  globalSeoControls: {
    seoStrategy: 'custom',
    emergencyPrivateMode: false,
    siteDiscoverable: false,
    allowRobotsCrawling: true, // This should be overridden by siteDiscoverable
  },
});
console.log(customPrivateResult);

console.log(
  '\n✅ All tests completed! Check the outputs above to verify they match expected behavior.',
);
