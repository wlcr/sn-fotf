/**
 * SEO Strategy Unit Tests
 *
 * Tests all SEO strategy functionality including:
 * - robots.txt generation for different strategies
 * - Emergency mode overrides
 * - Custom mode individual controls
 * - Fallback behavior
 */

import {describe, it, expect} from 'vitest';
import {generateRobotsTxt} from '~/lib/seo';
import {
  isSiteDiscoverable,
  isRobotsCrawlingAllowed,
  getGlobalSeoControls,
} from '~/lib/sanity/queries/settings';
import type {Settings} from '~/studio/sanity.types';

describe('SEO Strategy', () => {
  describe('generateRobotsTxt', () => {
    it('should generate Marketing Mode robots.txt correctly', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'marketing',
          emergencyPrivateMode: false,
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      expect(result).toContain('# Friends of the Family - Marketing Mode');
      expect(result).toContain('User-agent: *');
      expect(result).toContain('Allow: /');
      expect(result).toContain('Disallow: /account/');
      expect(result).toContain('Disallow: /cart');
      expect(result).toContain('Disallow: /checkout');
      expect(result).toContain('Disallow: /members/');
      expect(result).toContain('Disallow: /api/');
      expect(result).toContain(
        'Sitemap: https://friends.sierranevada.com/sitemap.xml',
      );
    });

    it('should generate Private Mode robots.txt correctly', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'private',
          emergencyPrivateMode: false,
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      expect(result).toContain('# Friends of the Family - Private Mode');
      expect(result).toContain('User-agent: *');
      expect(result).toContain('Disallow: /');
      expect(result).toContain('Crawl-delay: 86400');
      expect(result).not.toContain('Allow:');
      expect(result).not.toContain('Sitemap:');
    });

    it('should generate Homepage Only Mode robots.txt correctly', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'homepage_only',
          emergencyPrivateMode: false,
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      expect(result).toContain('# Friends of the Family - Homepage Only Mode');
      expect(result).toContain('User-agent: *');
      expect(result).toContain('Disallow: /');
      expect(result).toContain('Allow: /$ # Allow homepage only');
      expect(result).toContain('Allow: /robots.txt');
      expect(result).toContain('Allow: /sitemap.xml');
      expect(result).toContain('Crawl-delay: 3600');
    });

    it('should generate Custom Mode robots.txt with full access', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'custom',
          emergencyPrivateMode: false,
          siteDiscoverable: true,
          allowRobotsCrawling: true,
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      expect(result).toContain(
        '# Friends of the Family - Custom Configuration',
      );
      expect(result).toContain('User-agent: *');
      expect(result).toContain('Allow: /');
      expect(result).toContain(
        'Sitemap: https://friends.sierranevada.com/sitemap.xml',
      );
      expect(result).not.toContain('Disallow: /');
    });

    it('should generate Custom Mode robots.txt with no indexing', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'custom',
          emergencyPrivateMode: false,
          siteDiscoverable: false,
          allowRobotsCrawling: true, // Should be overridden by siteDiscoverable
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      expect(result).toContain('# Friends of the Family - Custom: No Indexing');
      expect(result).toContain('User-agent: *');
      expect(result).toContain('Disallow: /');
      expect(result).toContain('Crawl-delay: 86400');
      expect(result).not.toContain('Allow:');
      expect(result).not.toContain('Sitemap:');
    });

    it('should generate Custom Mode robots.txt with limited crawling', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'custom',
          emergencyPrivateMode: false,
          siteDiscoverable: true,
          allowRobotsCrawling: false,
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      expect(result).toContain(
        '# Friends of the Family - Custom: Limited Crawling',
      );
      expect(result).toContain('User-agent: *');
      expect(result).toContain('Disallow: /');
      expect(result).toContain('Allow: /$ # Allow homepage only');
      expect(result).toContain('Crawl-delay: 3600');
    });

    it('should prioritize Emergency Mode over all other settings', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'marketing', // This should be ignored
          emergencyPrivateMode: true,
          siteDiscoverable: true,
          allowRobotsCrawling: true,
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      expect(result).toContain(
        '# Friends of the Family - EMERGENCY PRIVATE MODE',
      );
      expect(result).toContain(
        '🚨 Site temporarily hidden from all search engines',
      );
      expect(result).toContain('User-agent: *');
      expect(result).toContain('Disallow: /');
      expect(result).toContain('Crawl-delay: 86400');
      expect(result).toContain('Last updated:');
      // Should not contain marketing mode directives
      expect(result).not.toContain('Allow: /');
      expect(result).not.toContain('Sitemap:');
    });

    it('should fallback to Marketing Mode for invalid strategy', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'invalid-strategy' as any,
          emergencyPrivateMode: false,
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      // Should recursively call with marketing mode
      expect(result).toContain('# Friends of the Family - Marketing Mode');
      expect(result).toContain('Allow: /');
      expect(result).toContain(
        'Sitemap: https://friends.sierranevada.com/sitemap.xml',
      );
    });

    it('should handle null settings gracefully', () => {
      const result = generateRobotsTxt(null);

      // Should default to marketing mode
      expect(result).toContain('# Friends of the Family - Marketing Mode');
      expect(result).toContain('Allow: /');
    });

    it('should handle missing globalSeoControls', () => {
      const settings: Partial<Settings> = {};

      const result = generateRobotsTxt(settings as Settings);

      // Should default to marketing mode
      expect(result).toContain('# Friends of the Family - Marketing Mode');
      expect(result).toContain('Allow: /');
    });
  });

  describe('Helper Functions', () => {
    describe('isSiteDiscoverable', () => {
      it('should return false by default (members-only site)', () => {
        expect(isSiteDiscoverable(null)).toBe(false);
        expect(isSiteDiscoverable({} as Settings)).toBe(false);
        expect(isSiteDiscoverable({globalSeoControls: {}} as Settings)).toBe(
          false,
        );
      });

      it('should return correct value when set', () => {
        const settingsTrue: Partial<Settings> = {
          globalSeoControls: {siteDiscoverable: true},
        };
        const settingsFalse: Partial<Settings> = {
          globalSeoControls: {siteDiscoverable: false},
        };

        expect(isSiteDiscoverable(settingsTrue as Settings)).toBe(true);
        expect(isSiteDiscoverable(settingsFalse as Settings)).toBe(false);
      });
    });

    describe('isRobotsCrawlingAllowed', () => {
      it('should return false by default', () => {
        expect(isRobotsCrawlingAllowed(null)).toBe(false);
        expect(isRobotsCrawlingAllowed({} as Settings)).toBe(false);
        expect(
          isRobotsCrawlingAllowed({globalSeoControls: {}} as Settings),
        ).toBe(false);
      });

      it('should return correct value when set', () => {
        const settingsTrue: Partial<Settings> = {
          globalSeoControls: {allowRobotsCrawling: true},
        };
        const settingsFalse: Partial<Settings> = {
          globalSeoControls: {allowRobotsCrawling: false},
        };

        expect(isRobotsCrawlingAllowed(settingsTrue as Settings)).toBe(true);
        expect(isRobotsCrawlingAllowed(settingsFalse as Settings)).toBe(false);
      });
    });

    describe('getGlobalSeoControls', () => {
      it('should return null for null/undefined settings', () => {
        expect(getGlobalSeoControls(null)).toBe(null);
        expect(getGlobalSeoControls(undefined as any)).toBe(null);
      });

      it('should return null when globalSeoControls is missing', () => {
        expect(getGlobalSeoControls({} as Settings)).toBe(null);
      });

      it('should return the globalSeoControls when present', () => {
        const controls = {
          seoStrategy: 'marketing' as const,
          emergencyPrivateMode: false,
        };
        const settings: Partial<Settings> = {
          globalSeoControls: controls,
        };

        expect(getGlobalSeoControls(settings as Settings)).toEqual(controls);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle robots.txt generation with custom directives', () => {
      // This test would be implemented once custom directives are fully integrated
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'custom',
          siteDiscoverable: true,
          allowRobotsCrawling: true,
          customRobotsDirectives: [
            'User-agent: Googlebot',
            'Crawl-delay: 10',
            'Disallow: /temp/',
          ],
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      expect(result).toContain(
        '# Friends of the Family - Custom Configuration',
      );
      expect(result).toContain('Allow: /');
      // Custom directives integration would be tested here
    });

    it('should generate valid robots.txt format', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'marketing',
        },
      };

      const result = generateRobotsTxt(settings as Settings);

      // Check basic robots.txt format requirements
      expect(result).toMatch(/^#.*$/m); // Has comment lines
      expect(result).toMatch(/^User-agent:\s+\*$/m); // Has user-agent directive
      expect(result).toMatch(/^(Allow|Disallow):\s+/m); // Has allow/disallow directives
      expect(result.trim()).not.toBe(''); // Not empty
    });
  });
});
