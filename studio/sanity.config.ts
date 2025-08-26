import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_PROJECT_ID || 'rimuhevv'
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2024-10-28'
const studioUrl = process.env.SANITY_STUDIO_URL || 'http://localhost:3333'

export default defineConfig({
  name: 'default',
  title: 'Sierra Nevada - Friends of the Family',
  // useCdn: process.env.NODE_ENV === 'production',
  useCdn: false,
  projectId,
  dataset,
  studioUrl,
  schema: {
    types: schemaTypes,
  },
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: apiVersion})],
})
