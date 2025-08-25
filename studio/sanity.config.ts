import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Sierra Nevada - Friends of the Family',

  projectId: 'rimuhevv',
  dataset: 'production',
  apiVersion: '2024-10-28',
  studioUrl: 'http://localhost:3333',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
