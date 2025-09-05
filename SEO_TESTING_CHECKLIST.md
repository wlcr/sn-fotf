# SEO Testing Checklist

This checklist helps verify that our SEO enhancements are working correctly once content is added to Sanity Studio.

## Prerequisites ✋

Before testing, ensure the following content is added in Sanity Studio:

### Settings Document

- [ ] **Global SEO Settings**
  - [ ] Site title and description
  - [ ] Keywords
  - [ ] Site discoverable toggle (enabled for testing)
  - [ ] Allow robots crawling (enabled for testing)

- [ ] **OpenGraph Settings**
  - [ ] Site name
  - [ ] Default OpenGraph image
  - [ ] Twitter handle
  - [ ] Facebook App ID

- [ ] **Company Information**
  - [ ] Company name
  - [ ] Contact email
  - [ ] Address information

### Product Content

- [ ] **At least 2-3 products with**
  - [ ] Product titles and descriptions
  - [ ] Product images
  - [ ] ProductPage documents with SEO overrides
  - [ ] Custom OpenGraph titles/descriptions where relevant

### Collection Content

- [ ] **At least 1-2 collections with**
  - [ ] Collection names and descriptions
  - [ ] CollectionPage documents with SEO metadata
  - [ ] Featured images for collections

---

## Testing Checklist 🧪

### 1. Embedded Studio SEO Tool Testing

- [ ] **Access Studio SEO Tool**
  - [ ] Navigate to `/studio` (or `http://localhost:3000/studio` in development)
  - [ ] Verify "SEO Testing" tool appears in Studio sidebar
  - [ ] Click to open SEO testing interface

- [ ] **Run SEO Tests from Studio**
  - [ ] Click "Run Full SEO Test" button
  - [ ] Verify loading state appears during test
  - [ ] Confirm test completes within 30 seconds
  - [ ] Check that results display without errors

- [ ] **Review SEO Scorecard**
  - [ ] Verify overall score displays (0-100)
  - [ ] Check category breakdown shows all 6 categories:
    - [ ] Meta Tags & Titles
    - [ ] Open Graph & Social Media
    - [ ] Structured Data
    - [ ] Performance & Technical
    - [ ] Accessibility
    - [ ] Members-Only Features
  - [ ] Confirm recommendations section appears
  - [ ] Verify timestamp shows when test was run

- [ ] **Test Error Handling**
  - [ ] Test with invalid/unreachable URL (if applicable)
  - [ ] Verify graceful error messages display
  - [ ] Confirm Studio remains responsive after errors

### 2. Meta Tags Generation

- [ ] **Homepage**
  - [ ] Visit homepage and inspect `<head>` section
  - [ ] Verify title, description, keywords present
  - [ ] Check OpenGraph tags (og:title, og:description, og:image, etc.)
  - [ ] Verify Twitter Card tags

- [ ] **Product Pages**
  - [ ] Visit product page (e.g., `/products/[handle]`)
  - [ ] Verify product-specific meta tags
  - [ ] Check if ProductPage SEO overrides are applied
  - [ ] Confirm product images used for og:image

- [ ] **Collection Pages**
  - [ ] Visit collection page (e.g., `/collections/[handle]`)
  - [ ] Verify collection-specific meta tags
  - [ ] Check CollectionPage SEO data is used

### 2. Structured Data

- [ ] **Test with Google's Rich Results Test**
  - [ ] Go to https://search.google.com/test/rich-results
  - [ ] Test homepage for Organization schema
  - [ ] Test product pages for Product schema
  - [ ] Test pages for WebSite schema

- [ ] **Browser DevTools Check**
  - [ ] Look for `<script type="application/ld+json">` tags
  - [ ] Verify JSON-LD content is valid
  - [ ] Check that all expected structured data types are present

### 3. SEO Routes

- [ ] **Robots.txt**
  - [ ] Visit `/robots.txt`
  - [ ] Verify it loads properly
  - [ ] Check that it respects global SEO settings
  - [ ] Confirm sitemap reference is included

- [ ] **Sitemap.xml**
  - [ ] Visit `/sitemap.xml`
  - [ ] Verify XML format is valid
  - [ ] Check that products and collections are listed
  - [ ] Verify priority and changefreq values

### 4. Social Media Previews

- [ ] **Facebook Debugger**
  - [ ] Go to https://developers.facebook.com/tools/debug/
  - [ ] Test product page URLs
  - [ ] Verify OpenGraph image, title, description appear correctly

- [ ] **Twitter Card Validator**
  - [ ] Go to https://cards-dev.twitter.com/validator
  - [ ] Test page URLs
  - [ ] Verify Twitter card displays properly

### 5. Global SEO Controls

- [ ] **Site Discoverability Test**
  - [ ] In Sanity Studio, disable "Site Discoverable"
  - [ ] Verify robots.txt shows "Disallow: /"
  - [ ] Verify meta tags include "noindex, nofollow"
  - [ ] Re-enable and verify changes revert

### 6. Performance & Technical

- [ ] **Page Load Speed**
  - [ ] Check that SEO additions don't significantly impact load time
  - [ ] Verify structured data doesn't cause layout shifts

- [ ] **Error Handling**
  - [ ] Test pages without SEO data (should use fallbacks)
  - [ ] Test with missing images (should use defaults)

### 7. Development Test Utilities

- [ ] **Embedded Studio SEO Testing** (Recommended)
  1. **Start Development Environment**:

     ```bash
     npm run dev  # Starts both app and embedded studio
     ```

  2. **Access Studio SEO Tool**:
     - [ ] Navigate to `http://localhost:3000/studio`
     - [ ] Use "SEO Testing" tool for real-time validation
     - [ ] Test changes immediately without switching tools

- [ ] **Command Line SEO Test Script** (CI/CD & Detailed Analysis)

  ```bash
  npm run seo:test:local  # Test local development
  npm run seo:test        # Test production
  npm run seo:test:verbose # Detailed output
  ```

  - [ ] Verify 100-point scoring system results
  - [ ] Check all test categories pass
  - [ ] Review detailed analysis output
  - [ ] Confirm JSDOM parsing works correctly

- [ ] **Run OpenGraph Integration Test**

  ```bash
  npx tsx app/test-open-graph.ts
  ```

  - [ ] Verify step-by-step progress indicators
  - [ ] Check OpenGraph data generation
  - [ ] Validate meta tags integration
  - [ ] Confirm sample tags display correctly

- [ ] **Use SEO Route Debug Utility**

  ```typescript
  // Add to development code
  import {debugSEORoutes} from '~/lib/seo/routes';
  debugSEORoutes(globalSettings);
  ```

  - [ ] Review route-by-route SEO rules
  - [ ] Verify site discoverability status
  - [ ] Check noIndex reasons and robots directives

---

---

## Tools for Testing 🛠️

### Browser Extensions

- **MetaSEO Inspector** - Quick meta tag overview
- **SEO META in 1 CLICK** - Comprehensive SEO analysis

### Online Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Schema.org Validator**: https://validator.schema.org/

### Browser DevTools

- Elements tab → inspect `<head>` section
- Console → check for JavaScript errors
- Network → verify images and resources load correctly

---

## Common Issues & Solutions 🔧

### Missing Meta Tags

- Check if content exists in Sanity Studio
- Verify GROQ queries are returning data
- Ensure component is importing SEO utilities correctly

### Broken OpenGraph Images

- Verify Sanity image URLs are accessible
- Check image dimensions and formats
- Confirm fallback images are configured

### Invalid Structured Data

- Use JSON-LD validator to check syntax
- Verify required schema.org properties are present
- Check for missing context or type declarations

### Robots.txt Not Working

- Verify route is properly configured
- Check global SEO settings in Sanity Studio
- Confirm environment variables are set correctly

---

## Sign-off ✅

- [ ] **Embedded Studio SEO tool functional**
- [ ] **All meta tags generating correctly**
- [ ] **Structured data validates successfully**
- [ ] **Social media previews working**
- [ ] **SEO routes (robots.txt, sitemap.xml) functional**
- [ ] **Global controls working as expected**
- [ ] **Performance impact acceptable**
- [ ] **Both Studio and command line testing working**

**Tested by**: **\*\***\_\_\_**\*\***  
**Date**: **\*\***\_\_\_**\*\***  
**Notes**: **\*\***\_\_\_**\*\***
