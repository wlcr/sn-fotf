const fs = require('fs');

try {
  // Read and parse the extracted schema
  const schemaData = JSON.parse(fs.readFileSync('./schema-test.json', 'utf8'));
  
  // Schema is an array, not an object with types
  // Find settings schema
  const settingsSchema = schemaData.find(type => type.name === 'settings');
  
  if (!settingsSchema) {
    console.log('❌ PROBLEM: Settings schema not found in extracted schema!');
    console.log('Available schemas:', schemaData.map(t => t.name).join(', '));
    process.exit(1);
  }
  
  console.log('✅ Settings schema found in extracted schema');
  
  // Check for our new fields
  const attributes = settingsSchema.attributes || {};
  const fieldNames = Object.keys(attributes).filter(key => !key.startsWith('_'));
  
  console.log('📋 Fields in settings schema:', fieldNames);
  
  // Check for specific fields we added
  const expectedFields = ['title', 'description', 'gtmContainerId', 'companyName', 'socialMedia'];
  const foundFields = expectedFields.filter(field => fieldNames.includes(field));
  const missingFields = expectedFields.filter(field => !fieldNames.includes(field));
  
  console.log('✅ Found expected fields:', foundFields);
  if (missingFields.length > 0) {
    console.log('❌ Missing expected fields:', missingFields);
  }
  
  // Check for old venue fields that should be gone
  const oldFields = ['venueName', 'googleMapLink'];
  const remainingOldFields = oldFields.filter(field => fieldNames.includes(field));
  
  if (remainingOldFields.length > 0) {
    console.log('❌ PROBLEM: Old venue fields still present:', remainingOldFields);
  } else {
    console.log('✅ Old venue fields successfully removed');
  }
  
} catch (error) {
  console.log('❌ ERROR reading schema:', error.message);
}
