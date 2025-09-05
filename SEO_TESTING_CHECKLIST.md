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

### 1. Meta Tags Generation

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

- [ ] **All meta tags generating correctly**
- [ ] **Structured data validates successfully**
- [ ] **Social media previews working**
- [ ] **SEO routes (robots.txt, sitemap.xml) functional**
- [ ] **Global controls working as expected**
- [ ] **Performance impact acceptable**

**Tested by**: ******\_\_\_******  
**Date**: ******\_\_\_******  
**Notes**: ******\_\_\_******
