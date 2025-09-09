# SEO Implementation Guide

**Complete guide to SEO features, testing, and content optimization for Sierra Nevada Friends of the Family.**

## 🎯 Overview

Our SEO strategy balances search engine visibility with the exclusive nature of a members-only platform. Content editors have complete control over SEO settings through Sanity CMS while maintaining technical excellence.

## ⚡ Quick Start

1. **Set up content** in Sanity Studio following [Content Setup](#content-setup) section
2. **Test SEO implementation** using the [embedded Studio tool](#embedded-studio-seo-testing)
3. **Validate with external tools** per [Testing Checklist](#testing-checklist)

---

## 🏗️ SEO Architecture

### Core Components

- **Embedded Sanity Studio** - Integrated CMS with real-time SEO testing
- **Global SEO Controls** - Site-wide settings for discoverability and defaults
- **Page-Level Overrides** - Individual product and collection SEO customization
- **Open Graph Integration** - Rich social media previews
- **Structured Data System** - JSON-LD schema for search engines
- **Dynamic XML/TXT Generation** - robots.txt and sitemap.xml
- **100-Point Testing System** - Comprehensive validation and scoring

### Technology Integration

```typescript
// Route-level SEO implementation
export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  const metaTags = generateProductMetaTags(
    data.settings, // Sanity global settings
    data.productPage, // Sanity page data
    data.product, // Shopify product data
    data.shopData, // Shop branding
  );

  return generateComprehensiveSEOTags(metaTags, data.settings, data.shopData);
};
```

---

## 🎨 Content Setup

### Prerequisites - Sanity Studio Configuration

#### 1. Settings Document (Priority: HIGH)

**Navigate to**: Sanity Studio → Settings (singleton)

**Global SEO Settings:**

```
Title: "Sierra Nevada Friends of the Family"
Description: "Exclusive craft beer experiences and products for Sierra Nevada brewing enthusiasts"
Keywords: "craft beer, sierra nevada, brewing, exclusive products, beer club"
```

**OpenGraph Configuration:**

```
Site Name: "Friends of the Family"
Twitter Handle: "SierraNevada" (without @)
Facebook App ID: [leave empty for now]
Default Image: [Upload Sierra Nevada logo or brewery image]
```

**Company Information:**

```
Company Name: "Sierra Nevada Brewing Co."
Contact Email: "friends@sierranevada.com"
Phone: "(530) 893-3520"
Address: "1075 E 20th St, Chico, CA 95928"
```

**Global SEO Controls:**

```
✅ Site Discoverable: TRUE (for testing)
✅ Allow Robots Crawling: TRUE (for testing)
Custom Robots Directives: [leave empty]
SEO Note: "SEO enabled for testing phase"
```

#### 2. Product Content Setup

**For each product, create ProductPage documents:**

**Example: "Pale Ale"**

```
Name Override: "Sierra Nevada Pale Ale - Craft Beer Classic"
SEO Meta Description: "Experience the original craft beer that started it all. Sierra Nevada Pale Ale features Cascade hops and bold citrus flavors."

OpenGraph:
- Title: "Sierra Nevada Pale Ale | Craft Beer Pioneer"
- Description: "The beer that launched the craft beer revolution. Citrusy Cascade hops meet rich malt character."
- Image: [Upload product bottle/can image]
- Alt Text: "Sierra Nevada Pale Ale bottle on white background"

Additional SEO:
- Custom Keywords: "pale ale, cascade hops, craft beer, sierra nevada"
```

#### 3. Collection Content Setup

**Example: "IPAs" Collection**

```
SEO Meta Description: "Explore Sierra Nevada's full range of India Pale Ales, from classic West Coast to modern hazy styles."

OpenGraph:
- Title: "IPA Collection | Sierra Nevada Brewing"
- Description: "Discover our complete range of IPAs - from traditional West Coast to innovative hazy styles."
- Image: [Upload collection hero image showing multiple IPAs]
- Alt Text: "Sierra Nevada IPA collection featuring various bottles and cans"

Additional SEO:
- Custom Keywords: "IPA, India pale ale, hop forward beer, craft beer collection"
- Priority Level: "High"
```

### Content Best Practices

#### Writing Guidelines

- **Meta Descriptions**: 150-160 characters, include brand name and key benefits
- **Page Titles**: Under 60 characters, format: "Product Name | Sierra Nevada"
- **Keywords**: Maximum 10 keywords, focus on relevance over quantity
- **Images**: Use descriptive alt text, optimize for 1200x630px for social sharing

#### SEO Content Strategy

- Include Sierra Nevada brand name in titles and descriptions
- Focus on craft beer terminology and brewing expertise
- Emphasize exclusive/members-only benefits when appropriate
- Use location-based keywords (Chico, California) when relevant

**Time Estimate**: ~60-90 minutes for complete content setup

---

## 🧪 SEO Testing

### Embedded Studio SEO Testing (Recommended)

**Real-time testing interface directly in Sanity Studio:**

1. **Access Studio SEO Tool**
   - Navigate to `http://localhost:3000/studio`
   - Click "SEO Testing" in Studio sidebar
   - No CORS issues - same-origin API calls

2. **Run SEO Tests**
   - Click "Run Full SEO Test" button
   - Visual scorecard with 100-point scoring system
   - Category breakdown and recommendations
   - Instant feedback on SEO performance

3. **Review Results**
   - Overall score (0-100 points)
   - 6 testing categories:
     - Meta Tags & Titles (25 points)
     - Open Graph & Social Media (20 points)
     - Structured Data (20 points)
     - Performance & Technical (15 points)
     - Accessibility (10 points)
     - Members-Only Features (10 points)

### Command Line Testing

**For CI/CD integration and detailed analysis:**

```bash
# Test production site with detailed SEO analysis
npm run seo:test

# Test with verbose output and scoring breakdown
npm run seo:test:verbose

# Test local development server
npm run seo:test:local

# Test specific URL
node scripts/seo-test.js --url=https://friends.sierranevada.com/products/pale-ale
```

**Technical Implementation:**

- Uses JSDOM for full DOM implementation in Node.js
- Perfect for automated testing and CI/CD integration
- Detailed reporting with category-by-category analysis

### Testing Checklist

#### 1. Meta Tags Validation

- [ ] **Homepage**: Verify title, description, keywords, OpenGraph tags
- [ ] **Product Pages**: Check product-specific meta tags and SEO overrides
- [ ] **Collection Pages**: Verify collection-specific SEO data application

#### 2. Structured Data Testing

- [ ] **Google Rich Results Test**: https://search.google.com/test/rich-results
- [ ] **Browser DevTools**: Look for `<script type="application/ld+json">` tags
- [ ] **Schema Validation**: Verify Organization, Product, and WebSite schemas

#### 3. Social Media Previews

- [ ] **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- [ ] **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- [ ] Verify OpenGraph images, titles, and descriptions display correctly

#### 4. SEO Routes

- [ ] **Robots.txt**: Visit `/robots.txt`, verify global SEO settings respected
- [ ] **Sitemap.xml**: Visit `/sitemap.xml`, check XML format and content inclusion

#### 5. Global SEO Controls

- [ ] **Site Discoverability Test**:
  - Disable "Site Discoverable" in Sanity Studio
  - Verify robots.txt shows "Disallow: /"
  - Verify meta tags include "noindex, nofollow"
  - Re-enable and verify changes revert

---

## 🔧 Technical Implementation

### Enhanced Meta Tag Generation

**Features:**

- Automatic validation and optimization
- Smart truncation at word boundaries
- Intelligent robots directives
- Canonical URL generation
- Keywords management (max 10)

**Core Functions:**

```typescript
generateProductMetaTags(settings, productPage, productData, shopData);
generateCollectionMetaTags(settings, collectionPage, collectionData, shopData);
generatePageMetaTags(settings, pageData, pageOpenGraph, shopData);
generateComprehensiveSEOTags(seoData, settings, shopData);
```

### Open Graph System

**Sanity-First Approach:**

1. Page-Specific Open Graph (from Sanity CMS editors)
2. Global Default Open Graph (from Sanity settings)
3. Shopify Data Fallback (product/collection data)

**Features:**

- Image optimization: Sanity CDN with 1200x630 @ 85% quality
- Complete social support: Facebook, Twitter, LinkedIn
- Smart fallbacks: Never breaks if data is missing
- Development debugging with console logs

### Structured Data Implementation

**Comprehensive Schema.org Support:**

- Organization: Company information and branding
- WebSite: Site metadata and search actions
- Product: Rich product information with pricing
- BreadcrumbList: Navigation hierarchy

```tsx
// Component usage
const structuredData = combineStructuredData(
  generateSiteStructuredData(settings, shop),
  generateProductData(product, settings),
  generateBreadcrumbData(breadcrumbs, baseUrl),
);

return (
  <>
    <StructuredData data={structuredData} id="product-data" />
    {/* Your page content */}
  </>
);
```

### Route-Based SEO Configuration

**Smart Route Rules:**

```typescript
const ROUTE_SEO_CONFIG = {
  '/account/*': {indexable: false, reason: 'Private account pages'},
  '/checkout/*': {indexable: false, reason: 'Checkout process'},
  '/admin/*': {indexable: false, reason: 'Admin interface'},
  // ... more rules
};
```

**Integration Points:**

- Meta tag generation with automatic noindex
- Sitemap generation excluding non-indexable routes
- Robots.txt with disallowed sensitive paths

---

## 🚀 Best Practices

### Members-Only SEO Strategy

1. **Strategic Indexing**: Index public content, protect member areas
2. **Social Sharing**: Rich previews without revealing exclusive content
3. **SEO-Friendly Public Pages**: Optimize landing pages for discovery
4. **Member Value Proposition**: Clear exclusive content indicators

### Content Strategy

1. **Keyword Optimization**: Target brewery and craft beer terms
2. **Local SEO**: Sierra Nevada location-based optimization
3. **Brand Consistency**: Maintain voice across all touchpoints
4. **Exclusive Language**: Emphasize membership benefits

### Technical Maintenance

1. **Regular Testing**: Weekly SEO validation runs
2. **Content Audits**: Monthly review of meta tags and descriptions
3. **Performance Monitoring**: Core Web Vitals tracking
4. **Schema Updates**: Stay current with Schema.org changes

---

## 🔍 Troubleshooting

### Common Issues

**SEO Tool Not Loading:**

- Verify development server is running: `npm run dev`
- Check Studio access at `http://localhost:3000/studio`
- Ensure no browser console errors

**Meta Tags Not Appearing:**

- Verify content setup in Sanity Studio
- Check global SEO settings are enabled
- Review page-specific overrides

**Structured Data Invalid:**

- Test with Google's Rich Results Test
- Verify JSON-LD syntax in browser DevTools
- Check required fields are present

**Social Previews Not Working:**

- Verify OpenGraph images are 1200x630px
- Check image URLs are publicly accessible
- Use Facebook Debugger to clear cache

### Performance Considerations

- SEO additions should not significantly impact load time
- Structured data should not cause layout shifts
- Test pages without SEO data use proper fallbacks
- Missing images should gracefully use defaults

---

## 📊 Monitoring & Results

### Success Metrics

✅ **Editor Control**: Complete Sanity CMS integration for SEO management  
✅ **Technical Excellence**: Comprehensive meta tags and structured data  
✅ **Social Media**: Rich previews with automatic image optimization  
✅ **Members-Only Balance**: Public discovery with private content protection  
✅ **Performance**: Optimized loading and caching strategies  
✅ **Monitoring**: 100-point testing system with actionable insights

### Analytics Integration

- **Search Console**: Monitor indexing status
- **Social Media Analytics**: Track Open Graph performance
- **Member Engagement**: Monitor exclusive content effectiveness
- **Core Web Vitals**: Performance and user experience tracking

---

## 🔮 Future Enhancements

### Planned Features

- **Article Schema**: Blog post structured data
- **Event Schema**: Brewery events and tastings
- **Review Schema**: Member product reviews
- **Local Business**: Enhanced location data

### CI/CD Integration

- **Automated Testing**: SEO tests on every deploy
- **Performance Budgets**: Core Web Vitals thresholds
- **Content Validation**: Structured data validation
- **Social Media Testing**: Open Graph validation

---

**Quick Access:**

- 🎨 **Studio**: http://localhost:3000/studio
- 📊 **SEO Testing**: http://localhost:3000/studio → "SEO Testing"
- 🔍 **Live Site**: http://localhost:3000/

_This comprehensive SEO system creates a world-class foundation that respects the exclusive nature of the Friends of the Family platform while maximizing search engine visibility where appropriate._
