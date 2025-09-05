/**
 * Dynamic Robots.txt Route for Sierra Nevada Friends of the Family
 *
 * Generates robots.txt content based on Sanity global SEO settings.
 * Respects members-only site controls and discoverable content settings.
 *
 * Adapted from Rubato Wines implementation with Sanity CMS integration.
 */

import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';
import {SETTINGS_QUERY} from '~/lib/sanity/queries/settings';
import {generateRobotsTxt} from '~/lib/seo';
import type {Settings} from '~/studio/sanity.types';

export async function loader({context}: LoaderFunctionArgs) {
  try {
    // Create Sanity client to fetch global SEO settings
    const sanityClient = createSanityClient(context.env);

    // Load global settings for robots.txt generation
    const settings = await sanityServerQuery<Settings | null>(
      sanityClient,
      SETTINGS_QUERY,
      {},
      {
        displayName: 'Settings for Robots.txt',
        env: context.env,
      },
    ).catch((error) => {
      // Log error but don't fail - fall back to restrictive robots.txt
      console.error(
        'Failed to load settings for robots.txt:',
        error instanceof Error ? error.message : String(error),
      );
      return null;
    });

    // Generate robots.txt content based on Sanity settings
    const robotsTxtContent = generateRobotsTxt(settings);

    // Return with appropriate headers for search engines
    return new Response(robotsTxtContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex', // Don't index the robots.txt file itself
      },
    });
  } catch (error) {
    // If anything fails, return a safe, restrictive robots.txt
    console.error(
      'Critical error in robots.txt generation:',
      error instanceof Error ? error.message : String(error),
    );

    const fallbackRobotsTxt = `# Friends of the Family - Error Fallback
User-agent: *
Disallow: /

# Error occurred generating robots.txt, defaulting to restrictive policy
User-agent: *
Crawl-delay: 86400`;

    return new Response(fallbackRobotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=300', // Shorter cache for error state
        'X-Robots-Tag': 'noindex',
      },
    });
  }
}

// This route only handles GET requests for robots.txt
// No component export needed as this is a resource route
