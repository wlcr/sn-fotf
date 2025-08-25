module.exports = {
  // TypeScript and JavaScript files
  '**/*.{ts,tsx,js,jsx}': [
    // Type check only changed files (faster than full type check)
    'bash -c "tsc --noEmit"',
    // Fix linting issues automatically
    'eslint --fix',
    // Format with prettier
    'prettier --write',
  ],
  
  // JSON files
  '**/*.json': [
    'prettier --write',
  ],
  
  // Markdown files 
  '**/*.{md,mdx}': [
    'prettier --write',
  ],
  
  // CSS files
  '**/*.{css,scss,sass}': [
    'prettier --write',
  ],
  
  // Run additional checks on specific file patterns
  'app/lib/**/*.ts': [
    // Extra strict checks for utility libraries
    'eslint --max-warnings 0',
  ],
  
  'app/routes/**/*.{ts,tsx}': [
    // Ensure React Router patterns are correct
    'eslint --max-warnings 0',
  ],
  
  // Documentation files that might need updates
  '{docs,README}/**/*.md': [
    // Check for broken links or formatting issues
    'prettier --check',
  ],
};
