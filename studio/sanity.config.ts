/**
 * Sanity Studio Configuration
 *
 * This configuration file defines the Sanity Studio setup for the
 * Friends of the Family project. It's separate from the main Hydrogen
 * app to ensure clean codegen separation.
 */

import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';
import {schemaTypes} from './schemaTypes';

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

  basePath: '/studio', // Studio will be available at /studio

  plugins: [
    structureTool(),
    visionTool(), // GROQ query tool for development
  ],

  schema: {
    types: schemaTypes,
  },

  // Studio URL for preview functionality
  studioUrl:
    (process.env as Record<string, string | undefined>).SANITY_STUDIO_URL ||
    'http://localhost:3333',
});

// Export config values for use in app
export const config = {
  projectId,
  dataset,
  apiVersion,
  studioUrl:
    (process.env as Record<string, string | undefined>).SANITY_STUDIO_URL ||
    'http://localhost:3333',
};
