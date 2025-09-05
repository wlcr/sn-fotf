import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

/**
 * SEO Testing API Route for Sanity Studio Integration
 *
 * This route handles SEO test requests from the embedded Studio tool.
 * It provides a simplified but comprehensive SEO analysis suitable for
 * content managers to understand and act upon.
 */

interface SeoTestRequest {
  url?: string;
  testType?: 'full' | 'quick';
}

interface SeoTestResult {
  score: number;
  categories: Record<string, {score: number; maxScore: number}>;
  recommendations: string[];
  timestamp: string;
  settingsUsed: {
    seoStrategy: string;
    emergencyMode: boolean;
  };
}

// Simplified test categories for Studio interface
const TEST_CATEGORIES = {
  metaTags: {maxScore: 25, name: 'Meta Tags'},
  openGraph: {maxScore: 20, name: 'Open Graph'},
  structuredData: {maxScore: 20, name: 'Structured Data'},
  technical: {maxScore: 15, name: 'Technical SEO'},
  accessibility: {maxScore: 10, name: 'Accessibility'},
  content: {maxScore: 10, name: 'Content Quality'},
};

export async function action({request, context}: ActionFunctionArgs) {
  try {
    const requestData = (await request.json()) as SeoTestRequest;
    const testUrl = requestData.url || new URL(request.url).origin;
    const testPages = ['/', '/products', '/collections'];

    // Get current Sanity settings (simplified for Studio use)
    const settings = await getSettings(context);

    console.warn(`🔍 Running SEO test for: ${testUrl}`);

    const results = await Promise.all(
      testPages.map((page) => testPage(`${testUrl}${page}`)),
    );

    const validResults = results.filter((r) => !r.error);

    if (validResults.length === 0) {
      throw new Error('All test pages failed to load');
    }

    // Calculate overall metrics
    const overallScore = calculateOverallScore(validResults);
    const categoryBreakdown = calculateCategoryBreakdown(validResults);
    const recommendations = generateRecommendations(validResults, settings);

    return new Response(
      JSON.stringify({
        score: overallScore,
        categories: categoryBreakdown,
        recommendations,
        timestamp: new Date().toISOString(),
        settingsUsed: {
          seoStrategy: settings?.globalSeoControls?.seoStrategy || 'marketing',
          emergencyMode:
            settings?.globalSeoControls?.emergencyPrivateMode || false,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('SEO test error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'SEO test failed',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}

/**
 * Test a single page for SEO compliance
 */
async function testPage(url: string) {
  try {
    console.warn(`  📄 Testing: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Sanity Studio SEO Test)',
      },
    });

    if (!response.ok) {
      return {
        url,
        error: `HTTP ${response.status}: ${response.statusText}`,
        score: 0,
        categories: {},
      };
    }

    const html = await response.text();

    // Parse HTML using dynamic import to avoid bundling issues
    let document: any;
    let window: any;

    try {
      // Dynamic import to avoid esbuild bundling Node.js dependencies
      const {Window} = await import('happy-dom');
      window = new Window();
      window.document.write(html);
      document = window.document;
    } catch (error) {
      console.warn(
        'HappyDOM parsing failed, falling back to basic analysis:',
        error,
      );
      // Fallback to a simple object that will work with our basic tests
      document = {
        querySelector: () => null,
        querySelectorAll: () => [],
      };
      window = {close: () => {}};
    }

    // Run simplified test suite using DOM parsing
    const categories = {
      metaTags: testMetaTags(document),
      openGraph: testOpenGraph(document),
      structuredData: testStructuredData(html),
      technical: testTechnical(response, document),
      accessibility: testAccessibility(document),
      content: testContent(document),
    };

    // Clean up happy-dom window
    window.close();

    const score = Object.values(categories).reduce(
      (sum, cat) => sum + cat.score,
      0,
    );

    return {
      url,
      error: null,
      score,
      categories,
    };
  } catch (error) {
    return {
      url,
      error: error instanceof Error ? error.message : 'Test failed',
      score: 0,
      categories: {},
    };
  }
}

/**
 * Test meta tags (simplified for Studio)
 */
function testMetaTags(document: Document) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.metaTags.maxScore;

  // Title (8 points)
  const title = document.querySelector('title');
  if (title?.textContent?.trim()) {
    const titleLength = title.textContent.trim().length;
    if (titleLength >= 30 && titleLength <= 70) {
      score += 8;
    } else if (titleLength > 0) {
      score += 4;
    }
  }

  // Meta description (8 points)
  const description = document.querySelector(
    'meta[name="description"]',
  ) as HTMLMetaElement | null;
  if (description?.getAttribute('content')?.trim()) {
    const descLength = description.getAttribute('content')!.trim().length;
    if (descLength >= 120 && descLength <= 250) {
      score += 8;
    } else if (descLength > 0) {
      score += 4;
    }
  }

  // H1 tag (4 points)
  const h1 = document.querySelector('h1');
  if (h1?.textContent?.trim()) {
    score += 4;
  }

  // Canonical (3 points)
  const canonical = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;
  if (canonical?.getAttribute('href')) {
    score += 3;
  }

  // Robots meta (2 points)
  const robots = document.querySelector(
    'meta[name="robots"]',
  ) as HTMLMetaElement | null;
  if (robots?.getAttribute('content')?.trim()) {
    score += 2;
  }

  return {score: Math.min(score, maxScore), maxScore};
}

/**
 * Test Open Graph tags
 */
function testOpenGraph(document: Document) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.openGraph.maxScore;

  const ogTitle = document.querySelector(
    'meta[property="og:title"]',
  ) as HTMLMetaElement | null;
  const ogDescription = document.querySelector(
    'meta[property="og:description"]',
  ) as HTMLMetaElement | null;
  const ogImage = document.querySelector(
    'meta[property="og:image"]',
  ) as HTMLMetaElement | null;
  const ogType = document.querySelector(
    'meta[property="og:type"]',
  ) as HTMLMetaElement | null;
  const ogUrl = document.querySelector(
    'meta[property="og:url"]',
  ) as HTMLMetaElement | null;

  if (ogTitle?.getAttribute('content')) score += 4;
  if (ogDescription?.getAttribute('content')) score += 4;
  if (ogImage?.getAttribute('content')) score += 6; // Most important for social sharing
  if (ogType?.getAttribute('content')) score += 3;
  if (ogUrl?.getAttribute('content')) score += 3;

  return {score: Math.min(score, maxScore), maxScore};
}

/**
 * Test structured data
 */
function testStructuredData(html: string) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.structuredData.maxScore;

  const jsonLdMatches = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );

  if (jsonLdMatches?.length) {
    score += 8; // Base points for having structured data

    // Try to identify specific schema types
    const schemaTypes = new Set<string>();

    jsonLdMatches.forEach((match) => {
      try {
        const content = match
          .replace(/<script[^>]*>/, '')
          .replace(/<\/script>/, '');
        const data = JSON.parse(content);

        if (data && typeof data === 'object' && '@type' in data) {
          schemaTypes.add(data['@type'] as string);
        }
      } catch {
        // Invalid JSON, skip
      }
    });

    // Bonus points for relevant schema types
    if (schemaTypes.has('Organization')) score += 3;
    if (schemaTypes.has('Product')) score += 4;
    if (schemaTypes.has('WebSite')) score += 2;
    if (schemaTypes.has('BreadcrumbList')) score += 3;
  }

  return {score: Math.min(score, maxScore), maxScore};
}

/**
 * Test technical SEO factors
 */
function testTechnical(response: Response, document: Document) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.technical.maxScore;

  // Viewport meta tag (3 points)
  const viewport = document.querySelector(
    'meta[name="viewport"]',
  ) as HTMLMetaElement | null;
  if (viewport?.getAttribute('content')) {
    score += 3;
  }

  // Content-Type header (3 points)
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('text/html')) {
    score += 3;
  }

  // Compression (4 points)
  const encoding = response.headers.get('content-encoding');
  if (encoding && (encoding.includes('gzip') || encoding.includes('br'))) {
    score += 4;
  }

  // Cache headers (3 points)
  const cacheControl = response.headers.get('cache-control');
  if (cacheControl) {
    score += 3;
  }

  // Language declaration (2 points)
  const html = document.documentElement;
  if (html.lang) {
    score += 2;
  }

  return {score: Math.min(score, maxScore), maxScore};
}

/**
 * Test accessibility factors relevant to SEO
 */
function testAccessibility(document: Document) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.accessibility.maxScore;

  // Alt text on images (4 points)
  const images = document.querySelectorAll('img');
  const imagesWithAlt = Array.from(images).filter((img) => img.alt?.trim());
  if (images.length > 0) {
    const altRatio = imagesWithAlt.length / images.length;
    score += Math.round(4 * altRatio);
  } else {
    score += 2; // Bonus if no images need alt text
  }

  // Skip links or proper heading structure (3 points)
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (skipLinks.length > 0 || headings.length > 1) {
    score += 3;
  }

  // Form labels (3 points)
  const inputs = document.querySelectorAll('input, textarea, select');
  const labeledInputs = Array.from(inputs).filter((input) => {
    const id = input.id;
    return id && document.querySelector(`label[for="${id}"]`);
  });

  if (inputs.length > 0) {
    const labelRatio = labeledInputs.length / inputs.length;
    score += Math.round(3 * labelRatio);
  }

  return {score: Math.min(score, maxScore), maxScore};
}

/**
 * Test content quality factors
 */
function testContent(document: Document) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.content.maxScore;

  // Content length (4 points)
  const textContent = document.body?.textContent?.trim() || '';
  if (textContent.length > 300) {
    score += 4;
  } else if (textContent.length > 100) {
    score += 2;
  }

  // Heading structure (3 points)
  const h1Count = document.querySelectorAll('h1').length;
  const h2Count = document.querySelectorAll('h2').length;

  if (h1Count === 1 && h2Count > 0) {
    score += 3;
  } else if (h1Count === 1) {
    score += 2;
  }

  // Links (3 points)
  const internalLinks = document.querySelectorAll(
    'a[href^="/"], a[href^="./"]',
  );
  const externalLinks = document.querySelectorAll('a[href^="http"]');

  if (internalLinks.length > 0 && externalLinks.length > 0) {
    score += 3;
  } else if (internalLinks.length > 0 || externalLinks.length > 0) {
    score += 2;
  }

  return {score: Math.min(score, maxScore), maxScore};
}

/**
 * Calculate overall score from test results
 */
function calculateOverallScore(results: any[]): number {
  if (results.length === 0) return 0;

  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const maxPossibleScore =
    results.length *
    Object.values(TEST_CATEGORIES).reduce((sum, cat) => sum + cat.maxScore, 0);

  return Math.round((totalScore / maxPossibleScore) * 100);
}

/**
 * Calculate category breakdown
 */
function calculateCategoryBreakdown(results: any[]) {
  const breakdown: Record<string, {score: number; maxScore: number}> = {};

  Object.keys(TEST_CATEGORIES).forEach((category) => {
    const categoryScores = results
      .map((r) => r.categories[category])
      .filter(Boolean);

    if (categoryScores.length > 0) {
      const avgScore = Math.round(
        categoryScores.reduce((sum, cat) => sum + cat.score, 0) /
          categoryScores.length,
      );
      breakdown[category] = {
        score: avgScore,
        maxScore:
          TEST_CATEGORIES[category as keyof typeof TEST_CATEGORIES].maxScore,
      };
    }
  });

  return breakdown;
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(results: any[], settings: any): string[] {
  const recommendations: string[] = [];
  const overallScore = calculateOverallScore(results);

  // General recommendations based on score
  if (overallScore < 70) {
    recommendations.push(
      'Focus on improving basic meta tags (title and description)',
    );
    recommendations.push(
      'Add missing Open Graph tags for better social media sharing',
    );
  }

  if (overallScore < 90) {
    recommendations.push(
      'Consider adding structured data to improve rich snippets',
    );
    recommendations.push('Ensure all images have descriptive alt text');
  }

  // Strategy-specific recommendations
  const strategy = settings?.globalSeoControls?.seoStrategy;
  if (strategy === 'private') {
    recommendations.push(
      'Consider switching to Marketing Mode to improve discoverability',
    );
  } else if (strategy === 'homepage_only') {
    recommendations.push(
      'Review if Homepage Only mode aligns with your marketing goals',
    );
  }

  // Emergency mode warning
  if (settings?.globalSeoControls?.emergencyPrivateMode) {
    recommendations.push(
      '🚨 Emergency Private Mode is active - site is hidden from search engines',
    );
  }

  return recommendations.slice(0, 5); // Limit to top 5 recommendations
}

/**
 * Get current settings from Sanity (simplified for Studio use)
 * In a real implementation, this would use the Sanity client
 */
async function getSettings(context: any) {
  // TODO: Implement actual Sanity client call when available
  // For now, return mock settings
  return {
    globalSeoControls: {
      seoStrategy: 'marketing',
      emergencyPrivateMode: false,
    },
  };
}
