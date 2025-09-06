/**
 * Client-side schema definitions for Sanity Studio
 *
 * This module dynamically imports and re-exports all schema types
 * from the studio directory. This approach avoids server-side bundling
 * of Sanity dependencies while providing the full schema to the client.
 */

/**
 * Creates Sanity schema types by importing them from the studio directory
 * This function runs only on the client side to avoid server-side imports
 */
export async function createSchemaTypes() {
  // Import schema types from the studio index file
  // This happens at runtime on the client, avoiding server-side bundling
  const {schemaTypes} = await import('../../studio/schemaTypes');

  // Return the schema types directly from the studio
  return schemaTypes;
}

/**
 * Creates the SEO testing plugin for the studio
 * This loads the custom SEO tool from the studio directory
 */
export async function createSeoPlugin() {
  try {
    // Import the SEO testing tool
    const {default: SeoTestingTool} = await import(
      '../../studio/tools/SeoTestingTool'
    );

    // Check if @sanity/ui is available
    await import('@sanity/ui');

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
  } catch (error) {
    console.warn(
      'SEO Testing tool disabled - dependencies not available:',
      error,
    );
    return {
      name: 'seo-testing-disabled',
      tools: [],
    };
  }
}

/**
 * Creates the studio structure configuration
 * This imports the structure from the studio directory
 */
export async function createStudioStructure() {
  try {
    const {structure} = await import('../../studio/structure');
    return structure;
  } catch (error) {
    console.warn('Studio structure not available, using default:', error);
    return undefined;
  }
}
