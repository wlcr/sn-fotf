#!/usr/bin/env node

/**
 * SEO Testing and Validation Script for Sierra Nevada Friends of the Family
 *
 * Comprehensive 100-point SEO testing system adapted from Rubato Wines
 * implementation, enhanced for members-only site context and Sanity CMS integration.
 *
 * Usage:
 *   npm run seo:test
 *   npm run seo:test -- --url=https://friends.sierranevada.com/products/pale-ale
 *   npm run seo:test -- --report=detailed
 */

import {JSDOM} from 'jsdom';
import fetch from 'node-fetch';
import {program} from 'commander';

// Configuration
const DEFAULT_BASE_URL = 'https://friends.sierranevada.com';
const DEFAULT_TEST_PAGES = [
  '/',
  '/products',
  '/collections',
  '/products/pale-ale', // Example product - adjust based on actual products
  '/collections/ales', // Example collection - adjust based on actual collections
];

// SEO Test Categories and Weights
const SEO_CATEGORIES = {
  META_TAGS: {weight: 25, name: 'Meta Tags & Titles'},
  OPEN_GRAPH: {weight: 20, name: 'Open Graph & Social Media'},
  STRUCTURED_DATA: {weight: 20, name: 'Structured Data'},
  PERFORMANCE: {weight: 15, name: 'Performance & Technical'},
  ACCESSIBILITY: {weight: 10, name: 'Accessibility'},
  MEMBERS_ONLY: {weight: 10, name: 'Members-Only Features'},
};

class SEOTester {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.verbose = options.verbose || false;
    this.testResults = {};
  }

  /**
   * Main test runner
   */
  async runTests(pages = DEFAULT_TEST_PAGES) {
    console.log(`🔍 Starting SEO Testing for ${this.baseUrl}`);
    console.log(`Testing ${pages.length} pages...\\n`);

    const results = [];

    for (const page of pages) {
      console.log(`📄 Testing: ${page}`);
      const result = await this.testPage(page);
      results.push(result);
      this.printPageResult(result);
      console.log(''); // Empty line for readability
    }

    this.printSummary(results);
    return results;
  }

  /**
   * Test a single page
   */
  async testPage(path) {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Test-Bot/1.0)',
        },
      });

      if (!response.ok) {
        return {
          url,
          path,
          status: response.status,
          score: 0,
          tests: {},
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Run all test categories
      const tests = {
        metaTags: this.testMetaTags(document),
        openGraph: this.testOpenGraph(document),
        structuredData: this.testStructuredData(html),
        performance: this.testPerformance(response, document),
        accessibility: this.testAccessibility(document),
        membersOnly: this.testMembersOnlyFeatures(document, path),
      };

      // Calculate overall score
      const score = this.calculateScore(tests);

      return {
        url,
        path,
        status: response.status,
        score,
        tests,
        error: null,
      };
    } catch (error) {
      return {
        url,
        path,
        status: null,
        score: 0,
        tests: {},
        error: error.message,
      };
    }
  }

  /**
   * Test meta tags and titles
   */
  testMetaTags(document) {
    const tests = {};
    let score = 0;
    const maxScore = SEO_CATEGORIES.META_TAGS.weight;

    // Title tag (5 points)
    const title = document.querySelector('title');
    if (title && title.textContent.trim()) {
      const titleLength = title.textContent.trim().length;
      if (titleLength >= 30 && titleLength <= 70) {
        // Updated 2024-2025 standards
        tests.title = {
          pass: true,
          score: 5,
          message: `Title length optimal (${titleLength} chars)`,
        };
        score += 5;
      } else {
        tests.title = {
          pass: false,
          score: 2,
          message: `Title length suboptimal (${titleLength} chars). Ideal: 30-70 chars`,
        };
        score += 2;
      }
    } else {
      tests.title = {pass: false, score: 0, message: 'No title tag found'};
    }

    // Meta description (5 points)
    const description = document.querySelector('meta[name="description"]');
    if (description && description.content.trim()) {
      const descLength = description.content.trim().length;
      if (descLength >= 120 && descLength <= 250) {
        // Modern standards allow longer, quality descriptions
        tests.description = {
          pass: true,
          score: 5,
          message: `Description length optimal (${descLength} chars)`,
        };
        score += 5;
      } else {
        tests.description = {
          pass: false,
          score: 2,
          message: `Description length suboptimal (${descLength} chars). Ideal: 120-250 chars`,
        };
        score += 2;
      }
    } else {
      tests.description = {
        pass: false,
        score: 0,
        message: 'No meta description found',
      };
    }

    // Robots meta tag (3 points)
    const robots = document.querySelector('meta[name="robots"]');
    if (robots && robots.content.trim()) {
      tests.robots = {
        pass: true,
        score: 3,
        message: `Robots directive: ${robots.content}`,
      };
      score += 3;
    } else {
      tests.robots = {
        pass: false,
        score: 0,
        message: 'No robots meta tag found',
      };
    }

    // Canonical tag (4 points)
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) {
      tests.canonical = {
        pass: true,
        score: 4,
        message: `Canonical URL set: ${canonical.href}`,
      };
      score += 4;
    } else {
      tests.canonical = {
        pass: false,
        score: 0,
        message: 'No canonical URL found',
      };
    }

    // H1 tag (3 points)
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) {
      tests.h1 = {
        pass: true,
        score: 3,
        message: `H1 found: ${h1.textContent.trim().substring(0, 50)}...`,
      };
      score += 3;
    } else {
      tests.h1 = {pass: false, score: 0, message: 'No H1 tag found'};
    }

    // Keywords meta tag (2 points) - bonus if present and reasonable
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords && keywords.content.trim()) {
      const keywordCount = keywords.content.split(',').length;
      if (keywordCount <= 10) {
        tests.keywords = {
          pass: true,
          score: 2,
          message: `Keywords present (${keywordCount} keywords)`,
        };
        score += 2;
      } else {
        tests.keywords = {
          pass: false,
          score: 0,
          message: `Too many keywords (${keywordCount}). Max recommended: 10`,
        };
      }
    } else {
      tests.keywords = {
        pass: false,
        score: 1,
        message: 'No keywords meta tag (optional but helpful)',
      };
      score += 1;
    }

    // Theme color (3 points)
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor && themeColor.content) {
      tests.themeColor = {
        pass: true,
        score: 3,
        message: `Theme color set: ${themeColor.content}`,
      };
      score += 3;
    } else {
      tests.themeColor = {
        pass: false,
        score: 0,
        message: 'No theme color meta tag',
      };
    }

    return {
      score: Math.min(score, maxScore),
      maxScore,
      tests,
    };
  }

  /**
   * Test Open Graph and social media tags
   */
  testOpenGraph(document) {
    const tests = {};
    let score = 0;
    const maxScore = SEO_CATEGORIES.OPEN_GRAPH.weight;

    // Basic Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector(
      'meta[property="og:description"]',
    );
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogSiteName = document.querySelector('meta[property="og:site_name"]');

    if (ogTitle) {
      tests.ogTitle = {
        pass: true,
        score: 3,
        message: `OG title: ${ogTitle.content}`,
      };
      score += 3;
    } else {
      tests.ogTitle = {pass: false, score: 0, message: 'No og:title found'};
    }

    if (ogDescription) {
      tests.ogDescription = {
        pass: true,
        score: 3,
        message: `OG description present (${ogDescription.content.length} chars)`,
      };
      score += 3;
    } else {
      tests.ogDescription = {
        pass: false,
        score: 0,
        message: 'No og:description found',
      };
    }

    if (ogImage) {
      tests.ogImage = {
        pass: true,
        score: 4,
        message: `OG image: ${ogImage.content}`,
      };
      score += 4;
    } else {
      tests.ogImage = {pass: false, score: 0, message: 'No og:image found'};
    }

    if (ogType) {
      tests.ogType = {
        pass: true,
        score: 2,
        message: `OG type: ${ogType.content}`,
      };
      score += 2;
    } else {
      tests.ogType = {pass: false, score: 0, message: 'No og:type found'};
    }

    if (ogUrl) {
      tests.ogUrl = {pass: true, score: 2, message: `OG URL set`};
      score += 2;
    } else {
      tests.ogUrl = {pass: false, score: 0, message: 'No og:url found'};
    }

    if (ogSiteName) {
      tests.ogSiteName = {
        pass: true,
        score: 2,
        message: `Site name: ${ogSiteName.content}`,
      };
      score += 2;
    } else {
      tests.ogSiteName = {
        pass: false,
        score: 0,
        message: 'No og:site_name found',
      };
    }

    // Twitter Card tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');

    if (twitterCard) {
      tests.twitterCard = {
        pass: true,
        score: 2,
        message: `Twitter card: ${twitterCard.content}`,
      };
      score += 2;
    } else {
      tests.twitterCard = {
        pass: false,
        score: 0,
        message: 'No twitter:card found',
      };
    }

    if (twitterTitle && twitterImage) {
      tests.twitterComplete = {
        pass: true,
        score: 2,
        message: 'Twitter card complete',
      };
      score += 2;
    } else {
      tests.twitterComplete = {
        pass: false,
        score: 0,
        message: 'Twitter card incomplete',
      };
    }

    return {
      score: Math.min(score, maxScore),
      maxScore,
      tests,
    };
  }

  /**
   * Test structured data
   */
  testStructuredData(html) {
    const tests = {};
    let score = 0;
    const maxScore = SEO_CATEGORIES.STRUCTURED_DATA.weight;

    // Look for JSON-LD structured data
    const jsonLdMatches = html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    );

    if (jsonLdMatches && jsonLdMatches.length > 0) {
      tests.jsonLdPresent = {
        pass: true,
        score: 5,
        message: `Found ${jsonLdMatches.length} JSON-LD script(s)`,
      };
      score += 5;

      // Try to parse and validate JSON-LD
      let validJsonLd = 0;
      let structuredDataTypes = new Set();

      jsonLdMatches.forEach((match) => {
        try {
          const content = match
            .replace(/<script[^>]*>/, '')
            .replace(/<\/script>/, '');
          const data = JSON.parse(content);

          if (data['@type']) {
            structuredDataTypes.add(data['@type']);
            validJsonLd++;
          } else if (Array.isArray(data)) {
            data.forEach((item) => {
              if (item['@type']) {
                structuredDataTypes.add(item['@type']);
                validJsonLd++;
              }
            });
          }
        } catch {
          // Invalid JSON-LD, but don't fail the test entirely
        }
      });

      if (validJsonLd > 0) {
        tests.validStructuredData = {
          pass: true,
          score: 5,
          message: `${validJsonLd} valid structured data objects. Types: ${Array.from(structuredDataTypes).join(', ')}`,
        };
        score += 5;
      }

      // Specific checks for expected structured data types
      if (structuredDataTypes.has('Organization')) {
        tests.organizationData = {
          pass: true,
          score: 3,
          message: 'Organization structured data found',
        };
        score += 3;
      }

      if (structuredDataTypes.has('Product')) {
        tests.productData = {
          pass: true,
          score: 3,
          message: 'Product structured data found',
        };
        score += 3;
      }

      if (structuredDataTypes.has('WebSite')) {
        tests.websiteData = {
          pass: true,
          score: 2,
          message: 'Website structured data found',
        };
        score += 2;
      }

      if (structuredDataTypes.has('BreadcrumbList')) {
        tests.breadcrumbData = {
          pass: true,
          score: 2,
          message: 'Breadcrumb structured data found',
        };
        score += 2;
      }
    } else {
      tests.jsonLdPresent = {
        pass: false,
        score: 0,
        message: 'No JSON-LD structured data found',
      };
    }

    return {
      score: Math.min(score, maxScore),
      maxScore,
      tests,
    };
  }

  /**
   * Test performance and technical SEO
   */
  testPerformance(response, document) {
    const tests = {};
    let score = 0;
    const maxScore = SEO_CATEGORIES.PERFORMANCE.weight;

    // Check response headers
    const headers = response.headers;

    // Content-Type (2 points)
    const contentType = headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      tests.contentType = {
        pass: true,
        score: 2,
        message: `Correct content-type: ${contentType}`,
      };
      score += 2;
    } else {
      tests.contentType = {
        pass: false,
        score: 0,
        message: 'Invalid or missing content-type header',
      };
    }

    // Cache headers (3 points)
    const cacheControl = headers.get('cache-control');
    if (cacheControl) {
      tests.cacheHeaders = {
        pass: true,
        score: 3,
        message: `Cache headers present: ${cacheControl}`,
      };
      score += 3;
    } else {
      tests.cacheHeaders = {
        pass: false,
        score: 0,
        message: 'No cache-control headers found',
      };
    }

    // Compression (3 points)
    const contentEncoding = headers.get('content-encoding');
    if (
      contentEncoding &&
      (contentEncoding.includes('gzip') || contentEncoding.includes('br'))
    ) {
      tests.compression = {
        pass: true,
        score: 3,
        message: `Compression enabled: ${contentEncoding}`,
      };
      score += 3;
    } else {
      tests.compression = {
        pass: false,
        score: 0,
        message: 'No compression detected',
      };
    }

    // Meta viewport (2 points)
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      tests.viewport = {
        pass: true,
        score: 2,
        message: `Viewport meta tag: ${viewport.content}`,
      };
      score += 2;
    } else {
      tests.viewport = {
        pass: false,
        score: 0,
        message: 'No viewport meta tag found',
      };
    }

    // Language declaration (2 points)
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang) {
      tests.language = {
        pass: true,
        score: 2,
        message: `Language declared: ${htmlLang}`,
      };
      score += 2;
    } else {
      tests.language = {
        pass: false,
        score: 0,
        message: 'No language declaration in HTML tag',
      };
    }

    // Images with alt text (3 points)
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    if (images.length > 0) {
      const altRatio = imagesWithAlt.length / images.length;
      if (altRatio >= 0.9) {
        tests.imageAlt = {
          pass: true,
          score: 3,
          message: `${imagesWithAlt.length}/${images.length} images have alt text`,
        };
        score += 3;
      } else {
        tests.imageAlt = {
          pass: false,
          score: 1,
          message: `Only ${imagesWithAlt.length}/${images.length} images have alt text`,
        };
        score += 1;
      }
    } else {
      tests.imageAlt = {pass: true, score: 3, message: 'No images to test'};
      score += 3;
    }

    return {
      score: Math.min(score, maxScore),
      maxScore,
      tests,
    };
  }

  /**
   * Test accessibility features
   */
  testAccessibility(document) {
    const tests = {};
    let score = 0;
    const maxScore = SEO_CATEGORIES.ACCESSIBILITY.weight;

    // ARIA landmarks (3 points)
    const landmarks = document.querySelectorAll(
      '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer',
    );
    if (landmarks.length >= 2) {
      tests.landmarks = {
        pass: true,
        score: 3,
        message: `${landmarks.length} ARIA landmarks found`,
      };
      score += 3;
    } else {
      tests.landmarks = {
        pass: false,
        score: 1,
        message: `Only ${landmarks.length} ARIA landmarks found`,
      };
      score += 1;
    }

    // Heading hierarchy (3 points)
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length >= 3) {
      tests.headingHierarchy = {
        pass: true,
        score: 3,
        message: `${headings.length} headings found`,
      };
      score += 3;
    } else {
      tests.headingHierarchy = {
        pass: false,
        score: 1,
        message: `Only ${headings.length} headings found`,
      };
      score += 1;
    }

    // Skip links (2 points)
    const skipLinks = document.querySelectorAll(
      'a[href^="#"], a[href="#main"], a[href="#content"]',
    );
    if (skipLinks.length > 0) {
      tests.skipLinks = {
        pass: true,
        score: 2,
        message: `${skipLinks.length} potential skip links found`,
      };
      score += 2;
    } else {
      tests.skipLinks = {pass: false, score: 0, message: 'No skip links found'};
    }

    // Focus management (2 points) - check for focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]',
    );
    if (focusableElements.length > 0) {
      tests.focusableElements = {
        pass: true,
        score: 2,
        message: `${focusableElements.length} focusable elements found`,
      };
      score += 2;
    } else {
      tests.focusableElements = {
        pass: false,
        score: 0,
        message: 'No focusable elements found',
      };
    }

    return {
      score: Math.min(score, maxScore),
      maxScore,
      tests,
    };
  }

  /**
   * Test members-only specific features
   */
  testMembersOnlyFeatures(document, path) {
    const tests = {};
    let score = 0;
    const maxScore = SEO_CATEGORIES.MEMBERS_ONLY.weight;

    // Check for member authentication indicators (3 points)
    const authElements = document.querySelectorAll(
      '[data-member], [data-auth], .member-only, .authenticated',
    );
    if (authElements.length > 0) {
      tests.memberFeatures = {
        pass: true,
        score: 3,
        message: `${authElements.length} member-specific elements found`,
      };
      score += 3;
    } else if (path.includes('/account') || path.includes('/member')) {
      tests.memberFeatures = {
        pass: false,
        score: 0,
        message: 'Member area detected but no member-specific elements',
      };
    } else {
      tests.memberFeatures = {
        pass: true,
        score: 3,
        message: 'Public page - no member features expected',
      };
      score += 3;
    }

    // Check for proper noindex on sensitive pages (4 points)
    const robots = document.querySelector('meta[name="robots"]');
    const isSensitivePage =
      path.includes('/account') ||
      path.includes('/checkout') ||
      path.includes('/member');

    if (isSensitivePage) {
      if (robots && robots.content.includes('noindex')) {
        tests.sensitivePageNoindex = {
          pass: true,
          score: 4,
          message: 'Sensitive page properly set to noindex',
        };
        score += 4;
      } else {
        tests.sensitivePageNoindex = {
          pass: false,
          score: 0,
          message: 'Sensitive page should be noindex',
        };
      }
    } else {
      tests.sensitivePageNoindex = {
        pass: true,
        score: 4,
        message: 'Public page - indexing appropriate',
      };
      score += 4;
    }

    // Check for member-only content indicators (3 points)
    const memberContent = document.querySelectorAll(
      '.members-only-content, [data-members-only]',
    );
    const exclusiveText = document.body.textContent.toLowerCase();
    const hasExclusiveLanguage =
      exclusiveText.includes('members only') ||
      exclusiveText.includes('friends of the family') ||
      exclusiveText.includes('exclusive');

    if (memberContent.length > 0 || hasExclusiveLanguage) {
      tests.exclusiveContent = {
        pass: true,
        score: 3,
        message: 'Member-exclusive content indicators found',
      };
      score += 3;
    } else {
      tests.exclusiveContent = {
        pass: true,
        score: 3,
        message: 'No exclusive content markers (may be appropriate)',
      };
      score += 3;
    }

    return {
      score: Math.min(score, maxScore),
      maxScore,
      tests,
    };
  }

  /**
   * Calculate overall score from test results
   */
  calculateScore(testResults) {
    let totalScore = 0;
    let totalMaxScore = 0;

    Object.values(testResults).forEach((category) => {
      totalScore += category.score;
      totalMaxScore += category.maxScore;
    });

    return Math.round((totalScore / totalMaxScore) * 100);
  }

  /**
   * Print results for a single page
   */
  printPageResult(result) {
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      return;
    }

    const scoreColor =
      result.score >= 90 ? '🟢' : result.score >= 70 ? '🟡' : '🔴';
    console.log(`${scoreColor} Score: ${result.score}/100`);

    if (this.verbose) {
      Object.entries(result.tests).forEach(([category, data]) => {
        console.log(`  ${category}: ${data.score}/${data.maxScore}`);
        Object.entries(data.tests).forEach(([test, testResult]) => {
          const icon = testResult.pass ? '✅' : '❌';
          console.log(`    ${icon} ${test}: ${testResult.message}`);
        });
      });
    }
  }

  /**
   * Print summary of all test results
   */
  printSummary(results) {
    console.log('📊 SEO Test Summary');
    console.log('='.repeat(50));

    const validResults = results.filter((r) => !r.error);
    const avgScore =
      validResults.reduce((sum, r) => sum + r.score, 0) / validResults.length;

    console.log(`Average Score: ${Math.round(avgScore)}/100`);
    console.log(`Tested Pages: ${validResults.length}/${results.length}`);

    // Category breakdown
    console.log('\\nCategory Breakdown:');
    Object.entries(SEO_CATEGORIES).forEach(([key, category]) => {
      const categoryScores = validResults.map(
        (r) => r.tests[key.toLowerCase()]?.score || 0,
      );
      const avgCategoryScore =
        categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length;
      const percentage = Math.round((avgCategoryScore / category.weight) * 100);
      console.log(`  ${category.name}: ${percentage}%`);
    });

    // Recommendations
    console.log('\\n💡 Recommendations:');
    if (avgScore < 70) {
      console.log('  • Focus on improving meta tags and Open Graph data');
      console.log('  • Ensure all pages have proper structured data');
      console.log('  • Review robots and indexing settings for member areas');
    } else if (avgScore < 90) {
      console.log('  • Fine-tune meta descriptions and title lengths');
      console.log('  • Add missing social media tags');
      console.log('  • Improve accessibility features');
    } else {
      console.log('  • Excellent SEO implementation!');
      console.log('  • Monitor regularly to maintain high scores');
    }
  }
}

// CLI setup
program
  .name('seo-test')
  .description(
    'SEO testing and validation for Sierra Nevada Friends of the Family',
  )
  .option('-u, --url <url>', 'Base URL to test', DEFAULT_BASE_URL)
  .option('-p, --page <page>', 'Single page to test (e.g., /products/pale-ale)')
  .option('-v, --verbose', 'Verbose output with detailed test results')
  .option(
    '-r, --report <type>',
    'Report type: summary (default) or detailed',
    'summary',
  );

program.parse();

const options = program.opts();

// Run the tests
async function main() {
  const tester = new SEOTester({
    baseUrl: options.url,
    verbose: options.verbose || options.report === 'detailed',
  });

  const pages = options.page ? [options.page] : DEFAULT_TEST_PAGES;

  try {
    await tester.runTests(pages);
  } catch (error) {
    console.error('❌ SEO test failed:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
