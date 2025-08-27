import {getSanityImageUrlWithEnv} from '~/lib/sanity';

/**
 * Sanity Utilities for React Router v7 + Hydrogen
 *
 * Utility functions for visual editing, OpenGraph images, and other
 * Sanity-related helpers optimized for our React Router v7 setup.
 */

/**
 * Resolve OpenGraph image from Sanity image
 *
 * @param image - Sanity image object
 * @param width - Desired width (default: 1200)
 * @param height - Desired height (default: 627)
 * @returns OpenGraph image object or undefined
 */
export function resolveOpenGraphImage(
  image: any,
  width = 1200,
  height = 627,
): {url: string; alt: string; width: number; height: number} | undefined {
  if (!image) return;

  const url = getSanityImageUrlWithEnv(image, {
    width,
    height,
    fit: 'crop',
    format: 'jpg', // Better for social media than webp
    quality: 80,
  });

  if (!url) return;

  return {
    url,
    alt: image?.alt || '',
    width,
    height,
  };
}

/**
 * Create data attributes for Sanity Visual Editing
 *
 * This is a simplified version that works without @sanity/visual-editing
 * for basic visual editing support. For full visual editing, the proper
 * @sanity/visual-editing package should be configured.
 *
 * @param config - Data attribute configuration
 * @returns Data attribute string
 */
export function createSimpleDataAttr(config: {
  id: string;
  type: string;
  path?: string;
}): string {
  // Simple data-sanity attribute for basic visual editing
  const parts = [config.type, config.id];
  if (config.path) {
    parts.push(config.path);
  }
  return parts.join(':');
}

/**
 * Generate social media meta tags from Sanity content
 *
 * @param content - Content object with title, description, and image
 * @param fallbacks - Fallback values
 * @returns Social media meta tags
 */
export function generateSocialMeta(
  content: {
    title?: string;
    description?: string;
    image?: any;
  },
  fallbacks: {
    title: string;
    description: string;
  },
) {
  const title = content.title || fallbacks.title;
  const description = content.description || fallbacks.description;
  const image = content.image
    ? resolveOpenGraphImage(content.image)
    : undefined;

  const meta = [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'twitter:title', content: title},
    {property: 'twitter:description', content: description},
    {property: 'twitter:card', content: 'summary_large_image'},
  ];

  if (image) {
    meta.push(
      {property: 'og:image', content: image.url},
      {property: 'og:image:width', content: image.width.toString()},
      {property: 'og:image:height', content: image.height.toString()},
      {property: 'twitter:image', content: image.url},
    );
  }

  return meta;
}
