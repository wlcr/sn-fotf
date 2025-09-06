import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
    svgr({
      // SVG-React configuration with SVGO optimization
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: true, // Enable SVGO for automatic optimization
        svgoConfig: {
          // Basic SVGO optimization with preset-default (uses advanced optimizations from svgo.config.cjs at runtime)
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  removeTitle: false,
                  removeDesc: false,
                },
              },
            },
          ],
        },
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  define: {
    // Browser globals needed for Sanity Studio
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development',
    ),
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    // Exclude Sanity Studio and heavy dependencies from server bundle
    external: [
      'sanity',
      '@sanity/vision',
      '@sanity/visual-editing',
      '@sanity/react-loader',
      'framer-motion',
      'motion',
    ],
    noExternal: ['ultrahtml'],
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: [
        'rxjs',
        '@sanity/client',
        '@sanity/image-url',
        'use-sync-external-store/shim',
        '@radix-ui/react-use-is-hydrated',
        '@radix-ui/react-avatar',
        'classnames',
        '@radix-ui/themes',
      ],
    },
  },
});
