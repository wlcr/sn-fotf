#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 SANITY SCHEMA VALIDATION TOOLKIT\n');

// Step 1: TypeScript Check
console.log('1️⃣ Checking TypeScript compilation...');
try {
  execSync('npm run type-check', { stdio: 'pipe' });
  console.log('✅ TypeScript: PASS\n');
} catch (error) {
  console.log('❌ TypeScript: FAIL');
  console.log(error.stdout.toString());
  process.exit(1);
}

// Step 2: Schema Extraction
console.log('2️⃣ Extracting Sanity schema...');
try {
  execSync('npx sanity schema extract --path ./temp-schema.json', { stdio: 'pipe' });
  console.log('✅ Schema extraction: PASS\n');
} catch (error) {
  console.log('❌ Schema extraction: FAIL');
  console.log(error.message);
  process.exit(1);
}

// Step 3: Schema Analysis
console.log('3️⃣ Analyzing schema structure...');
try {
  const schemaData = JSON.parse(fs.readFileSync('./temp-schema.json', 'utf8'));
  
  // Check for settings schema
  const settingsSchema = schemaData.find(type => type.name === 'settings');
  if (!settingsSchema) {
    console.log('❌ Settings schema not found!');
    console.log('Available schemas:', schemaData.map(t => t.name).slice(0, 10).join(', '), '...');
    process.exit(1);
  }
  
  console.log('✅ Settings schema: FOUND');
  
  // Analyze fields
  const attributes = settingsSchema.attributes || {};
  const fieldNames = Object.keys(attributes).filter(key => !key.startsWith('_'));
  
  console.log(`📋 Total fields: ${fieldNames.length}`);
  console.log('🔧 Custom fields:', fieldNames.slice(0, 10).join(', '), fieldNames.length > 10 ? '...' : '');
  
  // Check for specific issues
  const expectedNewFields = ['gtmContainerId', 'companyName', 'socialMedia'];
  const oldVenueFields = ['venueName', 'googleMapLink'];
  
  const foundNewFields = expectedNewFields.filter(f => fieldNames.includes(f));
  const foundOldFields = oldVenueFields.filter(f => fieldNames.includes(f));
  
  console.log('✅ New fields present:', foundNewFields.join(', '));
  
  if (foundOldFields.length > 0) {
    console.log('❌ Old venue fields still present:', foundOldFields.join(', '));
  } else {
    console.log('✅ Old venue fields removed');
  }
  
} catch (error) {
  console.log('❌ Schema analysis: FAIL');
  console.log(error.message);
  process.exit(1);
}

// Step 4: Structure Check  
console.log('\n4️⃣ Checking Studio structure...');
try {
  const structureContent = fs.readFileSync('./studio/structure.ts', 'utf8');
  if (structureContent.includes('page', 'productPage')) {
    console.log('✅ Structure filters: PRESENT (duplicate prevention)');
  } else {
    console.log('❌ Structure filters: MISSING');
  }
} catch (error) {
  console.log('❌ Structure check: FAIL');
}

// Cleanup
try {
  fs.unlinkSync('./temp-schema.json');
} catch (e) {
  // ignore
}

console.log('\n🎉 SCHEMA VALIDATION COMPLETE!');
console.log('\nIf Studio still shows old fields:');
console.log('1. Hard refresh browser (Cmd+Shift+R)');
console.log('2. Clear browser cache for localhost:3333'); 
console.log('3. Try incognito/private window');
console.log('4. Delete existing settings document content and save empty');
