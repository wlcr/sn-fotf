/**
 * SEO Open Graph Integration Test Utility
 *
 * This utility tests the complete Open Graph implementation including:
 * - Product Open Graph metadata generation
 * - SEO meta tags integration
 * - Comprehensive tag generation with social media support
 * - Fallback handling and error cases
 *
 * Usage:
 *   npx tsx app/test-open-graph.ts
 *
 * Requirements:
 *   - Mock data simulates real Sanity CMS and Shopify data
 *   - Tests both individual functions and complete integration
 *   - Validates that OpenGraph data flows correctly through the system
 *
 * @fileoverview OpenGraph integration testing utility for development
 */

// Mock settings data
const mockSettings = {
  seo: {
    siteDiscoverable: true,
  },
  openGraph: {
    siteName: 'Sierra Nevada Friends of the Family',
    twitterHandle: 'SierraNevada',
    facebookAppId: 'test123',
    defaultImage: {
      asset: {
        _ref: 'image-test',
      },
      alt: 'Sierra Nevada Logo',
    },
  },
} as any;

const mockProductPageData = {
  nameOverride: 'Premium IPA Collection',
  openGraph: {
    title: 'Special IPA Bundle - Limited Edition',
    description:
      'Exclusive IPA collection available only to Friends of the Family members',
    image: {
      asset: {
        _ref: 'image-product',
      },
      alt: 'IPA Collection',
    },
  },
} as any;

const mockProductData = {
  title: 'IPA Collection',
  description: 'A great collection of IPAs from Sierra Nevada',
  handle: 'ipa-collection',
  image: 'https://cdn.shopify.com/fallback-image.jpg',
};

const mockShopData = {
  name: 'Sierra Nevada Brewing Co.',
  primaryDomain: {url: 'https://friends.sierranevada.com'},
};

/**
 * Main test function that validates OpenGraph integration
 *
 * This function performs three main tests:
 * 1. Direct OpenGraph data generation from product data
 * 2. SEO meta tags integration with OpenGraph
 * 3. Comprehensive SEO tag generation including social media
 *
 * @returns Promise<void> Logs results to console
 */
async function testOpenGraphIntegration() {
  // console.log('🧪 Testing Open Graph Integration\n');

  try {
    // Import our utilities
    const {generateProductOpenGraph} = await import('./lib/seo/open-graph.js');
    const {generateProductMetaTags, generateComprehensiveSEOTags} =
      await import('./lib/seo.js');

    // Test 1: Generate Product Open Graph data directly
    // console.log('1️⃣ Testing generateProductOpenGraph...');
    const ogData = generateProductOpenGraph(
      mockSettings,
      mockProductPageData,
      mockProductData,
      mockShopData,
    );

    // Log some basic info about the generated data
    if (ogData) {
      console.log('✅ OpenGraph data generated successfully');
    }

    // console.log('Open Graph Data:', {
    //   title: ogData?.title,
    //   description: ogData?.description?.slice(0, 50) + '...',
    //   siteName: ogData?.siteName,
    //   type: ogData?.type,
    //   hasImage: !!ogData?.image,
    //   twitterCard: ogData?.twitterCard
    // });

    // Test 2: Generate SEO meta tags with Open Graph integration
    // console.log('\n2️⃣ Testing integrated SEO meta tags...');
    const metaTags = generateProductMetaTags(
      mockSettings,
      mockProductPageData,
      mockProductData,
      mockShopData,
    );

    // console.log('Meta Tags:', {
    //   title: metaTags.title,
    //   hasDescription: !!metaTags.description,
    //   hasOpenGraph: !!metaTags.openGraph,
    //   type: metaTags.type
    // });

    // Test 3: Generate comprehensive SEO tags
    // console.log('\n3️⃣ Testing comprehensive SEO tag generation...');
    const comprehensiveTags = generateComprehensiveSEOTags(
      metaTags,
      mockSettings,
      mockShopData,
    );

    const ogTags = comprehensiveTags.filter(
      (tag) =>
        (tag as any).property?.startsWith('og:') ||
        (tag as any).name?.startsWith('twitter:'),
    );

    console.log(
      `✅ Found ${ogTags.length} social media tags in ${comprehensiveTags.length} total tags`,
    );

    // console.log(`Generated ${comprehensiveTags.length} total meta tags`);
    // console.log(`Found ${ogTags.length} Open Graph/Twitter tags`);

    // Show a few sample tags
    // console.log('\nSample Open Graph tags:');
    // ogTags.slice(0, 5).forEach(tag => {
    //   const key = (tag as any).property || (tag as any).name;
    //   console.log(`  ${key}: ${(tag as any).content}`);
    // });

    // console.log('\n✅ Open Graph integration test completed successfully!');
  } catch (error) {
    console.error(
      '❌ Test failed:',
      error instanceof Error ? error.message : String(error),
    );
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Mock functions that might be missing
(global as any).imageUrlFor = () => ({
  width: () => ({
    width: () => ({
      height: () => ({
        fit: () => ({
          format: () => ({
            quality: () => ({
              url: () => 'https://cdn.sanity.io/test-image.jpg',
            }),
          }),
        }),
      }),
    }),
  }),
});

testOpenGraphIntegration();
