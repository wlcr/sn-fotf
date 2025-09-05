import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

/**
 * SEO Testing API Route for Sanity Studio Integration
 *
 * This route handles SEO test requests from the embedded Studio tool.
 * It provides a simplified but comprehensive SEO analysis suitable for
 * content managers to understand and act upon.
 *
 * Uses ultrahtml for accurate DOM parsing and element selection.
 */

// ultrahtml AST node types
interface UltrahtmlNode {
  type: 'element' | 'text' | 'comment';
  name?: string;
  attributes?: Record<string, string>;
  children?: UltrahtmlNode[];
  value?: string;
}

interface UltrahtmlAST {
  type: 'root';
  children: UltrahtmlNode[];
}

// Simplified DOM-like interfaces for SEO testing
interface SimpleDOMElement {
  textContent: string;
  getAttribute: (attr: string) => string | null;
}

interface SimpleDOMElementList {
  textContent: string;
  text: string;
  alt: string | null;
  id: string | null;
  getAttribute: (attr: string) => string | null;
}

interface SimpleDocument {
  querySelector: (selector: string) => SimpleDOMElement | null;
  querySelectorAll: (selector: string) => SimpleDOMElementList[];
  documentElement: {lang: string | null};
  body: {textContent: string};
}

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
    const testPages = ['/', '/collections'];

    // Get current Sanity settings (simplified for Studio use)
    const settings = await getSettings(context);

    console.log(`🔍 Running SEO test for: ${testUrl}`);

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
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
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
    console.log(`  📄 Testing: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Sanity-Studio-SEO-Test/1.0)',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 second timeout
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

    // Parse HTML using ultrahtml for accurate DOM parsing
    let document: SimpleDocument;
    let window: {close: () => void};

    try {
      // Try ultrahtml - zero dependencies, runtime-agnostic HTML parser
      const {parse} = await import('ultrahtml');
      const ast = parse(html) as UltrahtmlAST;

      // Create a document-like interface using ultrahtml AST
      const matchesAttributeSelector = (
        node: UltrahtmlNode,
        selector: string,
      ): boolean => {
        // Simple attribute selector matching like meta[name="description"]
        const match = selector.match(/(\w+)\[([^\]]+)\]/);
        if (!match) return false;
        const [, tagName, attrExpr] = match;
        if (node.name !== tagName) return false;

        if (!attrExpr) return false;
        const attrMatch = attrExpr.match(/(\w+)=["']([^"']*)["']/);
        if (!attrMatch) return false;
        const [, attrName, attrValue] = attrMatch;

        if (!attrName) return false;
        return node.attributes?.[attrName] === attrValue;
      };

      const findElement = (
        nodes: UltrahtmlNode[] | UltrahtmlAST,
        selector: string,
      ): UltrahtmlNode | null => {
        const nodeArray = Array.isArray(nodes) ? nodes : nodes?.children || [];
        for (const node of nodeArray) {
          if (node.type === 'element') {
            if (
              selector === node.name ||
              (selector.includes('[') &&
                selector.includes('=') &&
                matchesAttributeSelector(node, selector))
            ) {
              return node;
            }
            const found = node.children
              ? findElement(node.children, selector)
              : null;
            if (found) return found;
          }
        }
        return null;
      };

      const findElements = (
        nodes: UltrahtmlNode[] | UltrahtmlAST,
        selector: string,
      ): UltrahtmlNode[] => {
        const results: UltrahtmlNode[] = [];
        const nodeArray = Array.isArray(nodes) ? nodes : nodes?.children || [];
        for (const node of nodeArray) {
          if (node.type === 'element') {
            if (
              selector === node.name ||
              (selector.includes('[') &&
                selector.includes('=') &&
                matchesAttributeSelector(node, selector))
            ) {
              results.push(node);
            }
            if (node.children) {
              results.push(...findElements(node.children, selector));
            }
          }
        }
        return results;
      };

      const getTextContent = (node: UltrahtmlNode | null): string => {
        if (!node) return '';
        if (node.type === 'text') return node.value || '';
        if (node.children) {
          return node.children.map(getTextContent).join('');
        }
        return '';
      };

      document = {
        querySelector: (selector: string) => {
          const element = findElement(ast, selector);
          if (!element) return null;
          return {
            textContent: getTextContent(element),
            getAttribute: (attr: string) => element.attributes?.[attr] || null,
          };
        },
        querySelectorAll: (selector: string) => {
          const elements = findElements(ast, selector);
          return elements.map((el) => ({
            textContent: getTextContent(el),
            text: getTextContent(el),
            alt: el.attributes?.alt || null,
            id: el.attributes?.id || null,
            getAttribute: (attr: string) => el.attributes?.[attr] || null,
          }));
        },
        documentElement: {
          lang: findElement(ast, 'html')?.attributes?.lang || null,
        },
        body: {
          textContent:
            getTextContent(findElement(ast, 'body')) ||
            html.replace(/<[^>]*>/g, ''),
        },
      };
      window = {close: () => {}};
    } catch (error) {
      // Fallback to regex-based parsing if ultrahtml fails
      document = createRegexBasedDocument(html);
      window = {close: () => {}};
    }

    // Run SEO test suite using parsed DOM
    const categories = {
      metaTags: testMetaTags(document),
      openGraph: testOpenGraph(document),
      structuredData: testStructuredData(html),
      technical: testTechnical(response, document),
      accessibility: testAccessibility(document),
      content: testContent(document, html),
    };

    // Clean up window reference
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
 * Create a minimal document-like object using regex parsing
 * This is a fallback when ultrahtml parsing fails
 */
function createRegexBasedDocument(html: string): SimpleDocument {
  return {
    querySelector: (selector: string) => {
      if (selector === 'title') {
        const match = html.match(/<title[^>]*>([^<]*)</i);
        return match
          ? {textContent: match[1] || '', getAttribute: () => null}
          : null;
      }
      if (selector === 'meta[name="description"]') {
        const match = html.match(
          /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
        );
        return match
          ? {
              textContent: '',
              getAttribute: (attr: string) =>
                attr === 'content' ? match[1] || null : null,
            }
          : null;
      }
      if (selector === 'h1') {
        const match = html.match(/<h1[^>]*>([^<]*)</i);
        return match
          ? {textContent: match[1] || '', getAttribute: () => null}
          : null;
      }
      if (selector === 'link[rel="canonical"]') {
        const match = html.match(
          /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i,
        );
        return match
          ? {
              textContent: '',
              getAttribute: (attr: string) =>
                attr === 'href' ? match[1] || null : null,
            }
          : null;
      }
      if (selector === 'meta[name="robots"]') {
        const match = html.match(
          /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i,
        );
        return match
          ? {
              textContent: '',
              getAttribute: (attr: string) =>
                attr === 'content' ? match[1] || null : null,
            }
          : null;
      }
      return null;
    },
    querySelectorAll: (selector: string) => {
      if (selector === 'img') {
        const matches = html.match(/<img[^>]*>/gi) || [];
        return matches.map((img) => ({
          textContent: '',
          text: '',
          alt: null,
          id: null,
          getAttribute: (attr: string) => {
            const attrMatch = img.match(
              new RegExp(`${attr}=["']([^"']*)["']`, 'i'),
            );
            return attrMatch ? attrMatch[1] || null : null;
          },
        }));
      }
      if (selector === 'a[href]') {
        const matches = html.match(/<a[^>]*href=[^>]*>/gi) || [];
        return matches.map((link) => ({
          textContent: '',
          text: '',
          alt: null,
          id: null,
          getAttribute: (attr: string) => {
            const attrMatch = link.match(
              new RegExp(`${attr}=["']([^"']*)["']`, 'i'),
            );
            return attrMatch ? attrMatch[1] || null : null;
          },
        }));
      }
      return [];
    },
    documentElement: {
      lang: null,
    },
    body: {
      textContent: html.replace(/<[^>]*>/g, ''),
    },
  };
}

/**
 * Test meta tags (simplified for Studio)
 */
function testMetaTags(document: SimpleDocument) {
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
  const description = document.querySelector('meta[name="description"]');
  const descContent = description?.getAttribute('content')?.trim();
  if (descContent) {
    const descLength = descContent.length;
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
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical?.getAttribute('href')) {
    score += 3;
  }

  // Robots meta (2 points)
  const robots = document.querySelector('meta[name="robots"]');
  if (robots?.getAttribute('content')?.trim()) {
    score += 2;
  }

  return {score: Math.min(score, maxScore), maxScore};
}

/**
 * Test Open Graph tags
 */
function testOpenGraph(document: SimpleDocument) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.openGraph.maxScore;

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector(
    'meta[property="og:description"]',
  );
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogType = document.querySelector('meta[property="og:type"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');

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
function testTechnical(response: Response, document: SimpleDocument) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.technical.maxScore;

  // Viewport meta tag (3 points)
  const viewport = document.querySelector('meta[name="viewport"]');
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
  if (html && html.lang) {
    score += 2;
  }

  return {score: Math.min(score, maxScore), maxScore};
}

/**
 * Test accessibility factors relevant to SEO
 */
function testAccessibility(document: SimpleDocument) {
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
function testContent(document: SimpleDocument, html?: string) {
  let score = 0;
  const maxScore = TEST_CATEGORIES.content.maxScore;

  // Content length (4 points) - fallback to full HTML if body not available
  const textContent = (document.body?.textContent || html || '').trim();
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
