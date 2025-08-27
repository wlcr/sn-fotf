/**
 * Server-only Sanity API token handling
 *
 * This file should only be imported on the server side to avoid
 * accidentally exposing API tokens to the client.
 */

// Note: React Router v7 doesn't have 'server-only' package like Next.js
// But this file should only be used in server-side loaders

export function getSanityToken(
  env?: Record<string, string | undefined>,
): string | undefined {
  // Try multiple possible token env var names for flexibility
  // Only use env parameter to avoid unsafe process.env access
  const token =
    env?.SANITY_API_TOKEN || env?.SANITY_API_READ_TOKEN || undefined;

  return token;
}

export function assertSanityToken(
  env?: Record<string, string | undefined>,
): string {
  const token = getSanityToken(env);

  if (!token) {
    throw new Error(
      'Missing SANITY_API_TOKEN or SANITY_API_READ_TOKEN environment variable',
    );
  }

  return token;
}
