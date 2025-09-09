/**
 * Global test setup for Sierra Nevada Friends of the Family
 *
 * This file runs before all tests and provides:
 * - Global mocks for external services
 * - Test utilities and helpers
 * - Environment setup
 */

import {beforeAll, beforeEach, afterAll, afterEach, vi} from 'vitest';

// Mock fetch globally for all tests (override existing fetch)
(global as typeof globalThis).fetch = vi.fn();

// Mock Sanity image URL builder
(
  global as typeof globalThis & {imageUrlFor: ReturnType<typeof vi.fn>}
).imageUrlFor = vi.fn(() => ({
  width: vi.fn(() => ({
    height: vi.fn(() => ({
      fit: vi.fn(() => ({
        format: vi.fn(() => ({
          quality: vi.fn(() => ({
            url: vi.fn(() => 'https://cdn.sanity.io/test-image.jpg'),
          })),
        })),
      })),
    })),
  })),
}));

// Mock environment variables - extend process.env directly
beforeAll(() => {
  Object.assign(process.env, {
    SANITY_PROJECT_ID: 'test-project',
    SANITY_DATASET: 'test',
    SANITY_API_VERSION: '2024-01-01',
  });
});

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Export test utilities
export const mockSettings = {
  title: 'Sierra Nevada Friends of the Family',
  description:
    "Join Sierra Nevada's exclusive Friends of the Family program. Access limited-edition craft beers, member-only releases, and behind-the-scenes brewery experiences.",
  keywords: [
    'craft beer',
    'sierra nevada',
    'exclusive brewing',
    'limited edition',
  ],
  globalSeoControls: {
    seoStrategy: 'marketing' as const,
    emergencyPrivateMode: false,
    siteDiscoverable: true,
    allowRobotsCrawling: true,
  },
  openGraph: {
    siteName: 'Sierra Nevada Friends of the Family',
    twitterHandle: '@SierraNevada',
    facebookAppId: '12345',
    defaultImage: {
      asset: {
        _ref: 'image-test-ref',
      },
      alt: 'Sierra Nevada Logo',
    },
  },
};

export const mockProductData = {
  title: 'Test IPA Collection',
  description: 'A great collection of IPAs from Sierra Nevada',
  handle: 'test-ipa-collection',
  image: 'https://cdn.shopify.com/test-image.jpg',
};

export const mockShopData = {
  name: 'Sierra Nevada Brewing Co.',
  primaryDomain: {url: 'https://friends.sierranevada.com'},
  brand: {
    colors: {
      primary: [{background: '#C8102E'}],
    },
  },
};

export const createMockResponse = (
  body: any,
  status: number = 200,
  headers: Record<string, string> = {'content-type': 'text/html'},
) => {
  return new Response(body, {
    status,
    headers: new Headers(headers),
  });
};
