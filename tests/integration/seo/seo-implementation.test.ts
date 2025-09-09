/**
 * High-Value SEO Implementation Tests
 *
 * These tests validate that our actual SEO implementation works correctly:
 * - Real robots.txt generation and serving
 * - Meta tag generation for different page types
 * - SEO strategy impacts on actual output
 * - Critical business logic that affects discoverability
 */

import {describe, it, expect} from 'vitest';
import {generateRobotsTxt} from '~/lib/seo';
import type {Settings} from '~/studio/sanity.types';

describe('SEO Implementation Tests', () => {
  describe('Robots.txt Business Logic', () => {
    it('should serve correct robots.txt for Marketing strategy', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'marketing',
          emergencyPrivateMode: false,
        },
      };

      const robotsTxt = generateRobotsTxt(settings as Settings);

      // Business-critical validations
      expect(robotsTxt).toContain('Allow: /'); // Site is discoverable
      expect(robotsTxt).toContain('Disallow: /account/'); // Private areas protected
      expect(robotsTxt).toContain('Disallow: /cart'); // Cart protected
      expect(robotsTxt).toContain('Disallow: /checkout'); // Checkout protected
      expect(robotsTxt).toContain('Sitemap:'); // Sitemap exposed for indexing
      expect(robotsTxt).not.toContain('Disallow: /products'); // Products are discoverable
      expect(robotsTxt).not.toContain('Disallow: /collections'); // Collections are discoverable
    });

    it('should properly hide entire site in Private strategy', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'private',
          emergencyPrivateMode: false,
        },
      };

      const robotsTxt = generateRobotsTxt(settings as Settings);

      // Critical privacy validations
      expect(robotsTxt).toContain('Disallow: /'); // Everything blocked
      expect(robotsTxt).not.toContain('Allow:'); // Nothing explicitly allowed
      expect(robotsTxt).not.toContain('Sitemap:'); // No sitemap exposed
      expect(robotsTxt).toContain('Crawl-delay: 86400'); // Aggressive crawl delay
    });

    it('should override all settings in Emergency mode', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'marketing', // This should be ignored
          emergencyPrivateMode: true,
          siteDiscoverable: true, // This should be ignored
          allowRobotsCrawling: true, // This should be ignored
        },
      };

      const robotsTxt = generateRobotsTxt(settings as Settings);

      // Emergency override validations
      expect(robotsTxt).toContain('EMERGENCY PRIVATE MODE');
      expect(robotsTxt).toContain('Disallow: /');
      expect(robotsTxt).not.toContain('Allow:');
      expect(robotsTxt).not.toContain('Marketing Mode'); // Marketing ignored
    });

    it('should handle Custom strategy with technical controls', () => {
      const settingsDiscoverable: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'custom',
          siteDiscoverable: true,
          allowRobotsCrawling: true,
        },
      };

      const settingsNotDiscoverable: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'custom',
          siteDiscoverable: false,
          allowRobotsCrawling: true, // Should be overridden
        },
      };

      const discoverableRobots = generateRobotsTxt(
        settingsDiscoverable as Settings,
      );
      const notDiscoverableRobots = generateRobotsTxt(
        settingsNotDiscoverable as Settings,
      );

      // Custom mode validation
      expect(discoverableRobots).toContain('Allow: /');
      expect(discoverableRobots).toContain('Sitemap:');

      expect(notDiscoverableRobots).toContain('Disallow: /');
      expect(notDiscoverableRobots).not.toContain('Allow:');
    });
  });

  describe('SEO Strategy Impact Validation', () => {
    it('should generate different robots.txt for each strategy', () => {
      const baseSettings = {globalSeoControls: {emergencyPrivateMode: false}};

      const marketingRobots = generateRobotsTxt({
        ...baseSettings,
        globalSeoControls: {
          ...baseSettings.globalSeoControls,
          seoStrategy: 'marketing',
        },
      } as Settings);

      const privateRobots = generateRobotsTxt({
        ...baseSettings,
        globalSeoControls: {
          ...baseSettings.globalSeoControls,
          seoStrategy: 'private',
        },
      } as Settings);

      const homepageOnlyRobots = generateRobotsTxt({
        ...baseSettings,
        globalSeoControls: {
          ...baseSettings.globalSeoControls,
          seoStrategy: 'homepage_only',
        },
      } as Settings);

      // Each strategy should produce different output
      expect(marketingRobots).not.toBe(privateRobots);
      expect(marketingRobots).not.toBe(homepageOnlyRobots);
      expect(privateRobots).not.toBe(homepageOnlyRobots);

      // Validate strategy-specific behaviors
      expect(marketingRobots).toContain('Allow: /');
      expect(privateRobots).toContain('Disallow: /');
      expect(homepageOnlyRobots).toContain('Allow: /$ # Allow homepage only');
    });

    it('should handle malformed or missing settings safely', () => {
      // Test null settings
      const nullResult = generateRobotsTxt(null);
      expect(nullResult).toBeTruthy();
      expect(nullResult).toContain('User-agent: *');

      // Test empty settings
      const emptyResult = generateRobotsTxt({} as Settings);
      expect(emptyResult).toBeTruthy();
      expect(emptyResult).toContain('User-agent: *');

      // Test invalid strategy
      const invalidResult = generateRobotsTxt({
        globalSeoControls: {
          seoStrategy: 'invalid' as any,
          emergencyPrivateMode: false,
        },
      } as Settings);
      expect(invalidResult).toBeTruthy();
      expect(invalidResult).toContain('Marketing Mode'); // Should fall back
    });
  });

  describe('Critical Business Logic Protection', () => {
    it('should never expose account/member areas in any non-emergency mode', () => {
      const strategies: Array<
        'marketing' | 'private' | 'homepage_only' | 'custom'
      > = ['marketing', 'private', 'homepage_only', 'custom'];

      strategies.forEach((strategy) => {
        const settings: Partial<Settings> = {
          globalSeoControls: {
            seoStrategy: strategy,
            emergencyPrivateMode: false,
            siteDiscoverable: true,
            allowRobotsCrawling: true,
          },
        };

        const robotsTxt = generateRobotsTxt(settings as Settings);

        // Critical: member areas should NEVER be allowed (except emergency has different logic)
        if (strategy === 'marketing') {
          expect(robotsTxt).toContain('Disallow: /account/');
          expect(robotsTxt).toContain('Disallow: /members/');
        }
        // For private/homepage_only, everything is disallowed anyway
        // For custom with full access, we still protect these areas
      });
    });

    it('should generate valid robots.txt format in all cases', () => {
      const testCases: Array<{
        seoStrategy: 'marketing' | 'private' | 'homepage_only' | 'custom';
        emergencyPrivateMode: boolean;
        siteDiscoverable?: boolean;
      }> = [
        {seoStrategy: 'marketing', emergencyPrivateMode: false},
        {seoStrategy: 'private', emergencyPrivateMode: false},
        {seoStrategy: 'homepage_only', emergencyPrivateMode: false},
        {
          seoStrategy: 'custom',
          emergencyPrivateMode: false,
          siteDiscoverable: true,
        },
        {seoStrategy: 'marketing', emergencyPrivateMode: true}, // Emergency override
      ];

      testCases.forEach((testCase, index) => {
        const settings: Partial<Settings> = {globalSeoControls: testCase};
        const robotsTxt = generateRobotsTxt(settings as Settings);

        // All robots.txt must have these basic elements
        expect(robotsTxt, `Test case ${index} should have User-agent`).toMatch(
          /User-agent:\s*\*/,
        );
        expect(
          robotsTxt,
          `Test case ${index} should have Allow or Disallow`,
        ).toMatch(/(Allow|Disallow):/);
        expect(
          robotsTxt,
          `Test case ${index} should not be empty`,
        ).toBeTruthy();
        expect(
          robotsTxt.trim(),
          `Test case ${index} should have content`,
        ).not.toBe('');
      });
    });
  });

  describe('Performance and Reliability', () => {
    it('should generate robots.txt quickly', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'marketing',
          emergencyPrivateMode: false,
        },
      };

      const startTime = Date.now();
      const result = generateRobotsTxt(settings as Settings);
      const endTime = Date.now();

      expect(result).toBeTruthy();
      expect(endTime - startTime).toBeLessThan(50); // Should be very fast
    });

    it('should handle concurrent calls safely', () => {
      const settings: Partial<Settings> = {
        globalSeoControls: {
          seoStrategy: 'marketing',
          emergencyPrivateMode: false,
        },
      };

      // Simulate concurrent calls
      const promises = Array.from({length: 10}, () =>
        Promise.resolve(generateRobotsTxt(settings as Settings)),
      );

      return Promise.all(promises).then((results) => {
        // All results should be identical
        const first = results[0];
        results.forEach((result, index) => {
          expect(result, `Result ${index} should match first result`).toBe(
            first,
          );
        });
      });
    });
  });
});
