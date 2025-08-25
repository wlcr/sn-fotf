import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Sierra Nevada - Friends of the Family',

  projectId: process.env.SANITY_PROJECT_ID || 'rimuhevv',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-10-28',
  studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
  // useCdn: process.env.NODE_ENV === 'production',
  useCdn: false,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
