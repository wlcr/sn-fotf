/**
 * Sanity Studio Configuration
 *
 * This configuration file defines the Sanity Studio setup for the
 * Friends of the Family project. It's separate from the main Hydrogen
 * app to ensure clean codegen separation.
 */

import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schemaTypes';
import {structure} from './structure';
import SeoTestingTool from './tools/SeoTestingTool';

// Conditionally import visionTool to handle cases where it might be externalized
// We'll create a plugin function that tries to load the vision tool
function createVisionPlugin() {
  try {
    // This will work if @sanity/vision is available in the bundle
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const {visionTool} = require('@sanity/vision');
    return visionTool();
  } catch {
    // Vision tool not available (externalized), return null
    console.warn(
      'Vision tool not available - GROQ queries will not be available in Studio',
    );
    return null;
  }
}
// import StudioIcon from './components/StudioIcon';

// Define SEO Testing plugin with conditional loading
function seoTestingPlugin() {
  try {
    // Only load if @sanity/ui is available (not externalized)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@sanity/ui');
    return {
      name: 'seo-testing',
      tools: [
        {
          name: 'seo-testing',
          title: 'SEO Testing',
          component: SeoTestingTool,
        },
      ],
    };
  } catch {
    // @sanity/ui not available, return minimal plugin
    console.warn('SEO Testing tool disabled - @sanity/ui not available');
    return {
      name: 'seo-testing-disabled',
      tools: [],
    };
  }
}

// Sanity Studio Configuration
// Note: Project IDs are not sensitive - they're visible in API URLs and client requests
// Only API tokens and secrets should be kept private
const projectId = 'rimuhevv'; // Sanity project ID (not sensitive)
const dataset = 'production';
const apiVersion = '2025-01-01';

export default defineConfig({
  name: 'sn-friends-of-the-family',
  title: 'SN - Friends of the Family',

  projectId,
  dataset,
  apiVersion,

  // Set basePath for embedded setup - this ensures internal Studio routes
  // are prefixed with /studio so they match our Remix route
  basePath: '/studio',

  plugins: [
    structureTool({structure}),
    // Conditionally include visionTool if available
    createVisionPlugin(),
    seoTestingPlugin(), // Custom SEO Testing tool
  ].filter(Boolean), // Remove null plugins

  schema: {
    types: schemaTypes,
  },

  // Studio URL for preview functionality (now embedded)
  studioUrl:
    (process.env as Record<string, string | undefined>).SANITY_STUDIO_URL ||
    'http://localhost:3000/studio',

  // Modern preview configuration for embedded setup
  document: {
    productionUrl: async (prev, {document}) => {
      const baseUrl =
        (process.env as Record<string, string | undefined>)
          .PUBLIC_STORE_DOMAIN || 'https://friends.sierranevada.com';

      // Generate preview URLs for different document types
      switch (document._type) {
        case 'product':
          return `${baseUrl}/products/${(document as any).handle?.current}`;
        case 'collection':
          return `${baseUrl}/collections/${(document as any).handle?.current}`;
        case 'page':
          return `${baseUrl}/${(document as any).slug?.current}`;
        case 'settings':
          return `${baseUrl}?preview=settings`;
        default:
          return baseUrl;
      }
    },
  },
});

// Export config values for use in app
export const config = {
  projectId,
  dataset,
  apiVersion,
  studioUrl:
    (process.env as Record<string, string | undefined>).SANITY_STUDIO_URL ||
    'http://localhost:3000/studio',
};
