module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // AI-focused quality rules
    '@typescript-eslint/no-explicit-any': 'error', // Catch AI using 'any' types
    '@typescript-eslint/no-unused-vars': 'error', // Catch unused imports/variables
    '@typescript-eslint/prefer-nullish-coalescing': 'error', // Better null handling
    '@typescript-eslint/prefer-optional-chain': 'error', // Safer property access
    '@typescript-eslint/no-non-null-assertion': 'warn', // Flag risky assertions
    
    // Documentation and clarity
    '@typescript-eslint/explicit-function-return-type': 'warn', // Encourage explicit types
    'prefer-const': 'error', // AI often uses let unnecessarily
    'no-var': 'error', // Ensure modern JavaScript
    
    // Import organization
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external', 
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always',
      'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
    }],
    'import/no-unused-modules': ['error', { 'unusedExports': true }],
    'import/no-duplicates': 'error',
    
    // Error handling
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow error logging
    'prefer-promise-reject-errors': 'error', // Better error handling
    
    // Code quality that AI often misses
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }], // Strict equality
    'no-implicit-coercion': 'error', // Explicit type conversion
    'no-throw-literal': 'error', // Proper error throwing
    'require-await': 'error', // No unnecessary async
    
    // Platform-specific checks
    'no-restricted-globals': [
      'error',
      {
        'name': 'window',
        'message': 'Use typeof window !== "undefined" check before accessing window'
      },
      {
        'name': 'document', 
        'message': 'Use typeof document !== "undefined" check before accessing document'
      },
      {
        'name': 'localStorage',
        'message': 'Use safe storage access patterns with availability checks'
      }
    ]
  },
  overrides: [
    // React Router specific rules
    {
      files: ['app/routes/**/*.{ts,tsx}'],
      rules: {
        // Ensure proper React Router patterns
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      }
    },
    // API routes
    {
      files: ['app/routes/api.*.{ts,tsx}'],
      rules: {
        'no-restricted-globals': 'off', // API routes can use Node globals
      }
    },
    // Configuration files
    {
      files: ['*.config.{js,ts}', '*.rc.{js,ts}'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.cache/',
    'public/build/',
    '*.min.js'
  ]
};
