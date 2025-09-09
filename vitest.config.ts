import {defineConfig} from 'vitest/config';
import {resolve} from 'path';

export default defineConfig({
  test: {
    // Use jsdom for browser-like testing (already installed)
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./tests/setup.ts'],

    // Global test utilities
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        'tests/**',
        'studio/**', // Exclude Sanity studio from coverage
        '**/*.config.*',
        'scripts/**',
      ],
      include: ['app/**/*.{ts,tsx}'],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
        'app/lib/seo.ts': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
    },

    // Test patterns
    include: [
      'tests/**/*.{test,spec}.{ts,tsx}',
      'app/**/*.{test,spec}.{ts,tsx}',
    ],

    // Exclude patterns
    exclude: ['node_modules/**', 'dist/**', 'studio/**', '**/*.d.ts'],

    // Timeout settings
    testTimeout: 10000,
    hookTimeout: 10000,
  },

  resolve: {
    alias: {
      '~': resolve(__dirname, 'app'),
      '@': resolve(__dirname, 'app'),
    },
  },

  // Use existing esbuild/vite config for consistency
  esbuild: {
    target: 'es2020',
  },
});
