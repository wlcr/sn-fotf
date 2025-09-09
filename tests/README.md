# SEO Testing Framework

This directory contains comprehensive tests for the SEO functionality of the Sierra Nevada Friends of the Family site.

## 🏗️ **Test Structure**

```
tests/
├── unit/seo/           # Unit tests for SEO functions
├── integration/seo/    # Integration tests for full SEO workflows
├── e2e/seo/           # End-to-end SEO testing (future)
├── setup.ts           # Global test setup and mocks
└── README.md          # This file
```

## 🧪 **Test Categories**

### **Unit Tests (`tests/unit/seo/`)**

- **`seo-strategy.test.ts`** - Core SEO strategy logic
  - robots.txt generation for all strategies
  - Emergency mode overrides
  - Helper function validation
  - Edge cases and fallbacks

### **Integration Tests (`tests/integration/seo/`)**

- **`seo-implementation.test.ts`** - High-value SEO implementation testing
  - Business-critical robots.txt logic validation
  - SEO strategy impact verification
  - Member area protection enforcement
  - Performance and reliability testing
  - Error handling and edge cases

### **Legacy Scripts (maintained for compatibility)**

- **`scripts/seo-test.js`** - Live site SEO testing
- **`tests/unit/seo/quick-strategy-test.js`** - Quick validation script

## 🚀 **Running Tests**

### **All Tests**

```bash
npm test                    # Interactive test runner
npm run test:run           # Run all tests once
npm run test:coverage      # Run with coverage report
npm run test:ui           # Open Vitest UI dashboard
```

### **SEO-Specific Tests**

```bash
npm run test:seo          # Run all SEO tests
npm run test:seo:watch    # Watch mode for SEO tests
npm run seo:test:quick    # Quick strategy validation
```

### **Legacy SEO Testing**

```bash
npm run seo:test          # Comprehensive live site testing
npm run seo:test:verbose  # Detailed output
npm run seo:test:local    # Test local development server
```

## 🎯 **Test Framework: Vitest**

We chose **Vitest** because:

- ⚡ **Native Vite integration** - zero config, uses existing build setup
- 🔧 **TypeScript ready** - works seamlessly with our ESM + TS stack
- 🏃‍♂️ **Fast** - built on Vite's dev server for instant feedback
- 🧪 **Jest-compatible** - familiar API, existing ESLint rules work
- 📊 **Great DX** - watch mode, coverage, UI dashboard

## 📊 **Coverage Thresholds**

Global coverage targets:

- **70%** branches, functions, lines, statements

SEO-specific targets:

- **85%** for `app/lib/seo.ts` (core SEO logic)

## 🔧 **Mocks and Setup**

The `setup.ts` file provides:

- **Global fetch mock** for HTTP testing
- **Sanity image URL builder mock**
- **Environment variables** for testing
- **Mock data** for settings, products, shop data
- **Utility functions** for creating mock responses

## 📋 **Test Patterns**

### **Unit Test Pattern**

```typescript
import {describe, it, expect} from 'vitest';
import {generateRobotsTxt} from '~/lib/seo';

describe('SEO Function', () => {
  it('should handle expected case', () => {
    const result = generateRobotsTxt(mockSettings);
    expect(result).toContain('expected content');
  });
});
```

### **Integration Test Pattern**

```typescript
import {describe, it, expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {mockSettings, createMockResponse} from '../setup';

describe('SEO Integration', () => {
  it('should validate complete workflow', () => {
    const html = createMockHTML({title: 'Test'});
    const dom = new JSDOM(html);
    const document = dom.window.document;

    expect(document.querySelector('title')).toBeTruthy();
  });
});
```

## 🚨 **Critical SEO Tests**

These tests MUST pass for SEO functionality:

1. **Strategy Selection** - All 4 strategies generate valid robots.txt
2. **Emergency Override** - Emergency mode overrides all other settings
3. **Technical Controls** - Custom mode respects individual toggles
4. **Member Protection** - Account/member areas never exposed
5. **Business Logic** - SEO changes produce expected robots.txt output
6. **Error Handling** - Graceful fallbacks for invalid/missing settings

## 🎯 **Next Phase: Studio Integration**

See `studio/STUDIO-SEO-INTEGRATION.md` for the plan to integrate our comprehensive SEO testing directly into Sanity Studio, enabling content managers to:

- ✅ Run real SEO tests from Studio interface
- ✅ See actionable scorecards and recommendations
- ✅ Test strategy changes before publishing
- ✅ Export reports for stakeholders
- ✅ Monitor SEO health over time

## 📈 **Future Enhancements**

- **E2E Testing** - Playwright for full browser SEO validation
- **Performance Testing** - Core Web Vitals integration
- **Visual Regression** - SEO snippet preview testing
- **Accessibility Testing** - Automated a11y validation
- **Schema Validation** - JSON-LD structure validation

## 🔍 **Debugging Tests**

```bash
# Run specific test file
npx vitest run tests/unit/seo/seo-strategy.test.ts

# Run with verbose output
npx vitest run --reporter=verbose

# Debug specific test
npx vitest run -t "should generate Marketing Mode"

# Watch specific pattern
npx vitest watch -t "robots"
```

## 📚 **Resources**

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://vitest.dev/guide/best-practices)
- [SEO Testing Guide](internal docs)
- [Friends of the Family SEO Strategy](internal docs)
