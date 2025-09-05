# Content Setup Guide for SEO Testing

This guide helps you quickly set up the necessary content in Sanity Studio to test our SEO implementation.

## Quick Start Checklist 🚀

### 1. Settings Document (Priority: HIGH)

**Navigate to**: Sanity Studio → Settings (singleton)

#### Global SEO Settings

```
Title: "Sierra Nevada Friends of the Family"
Description: "Exclusive craft beer experiences and products for Sierra Nevada brewing enthusiasts"
Keywords: "craft beer, sierra nevada, brewing, exclusive products, beer club"
```

#### OpenGraph Configuration

```
Site Name: "Friends of the Family"
Twitter Handle: "@SierraNevada" (without @)
Facebook App ID: [leave empty for now]
Default Image: [Upload Sierra Nevada logo or brewery image]
```

#### Company Information

```
Company Name: "Sierra Nevada Brewing Co."
Contact Email: "friends@sierranevada.com"
Phone: "(530) 893-3520"
Address: "1075 E 20th St, Chico, CA 95928"
```

#### Global SEO Controls

```
✅ Site Discoverable: TRUE (for testing)
✅ Allow Robots Crawling: TRUE (for testing)
Custom Robots Directives: [leave empty]
SEO Note: "SEO enabled for testing phase"
```

---

### 2. Sample Product Content

**Navigate to**: Products → [Select existing products or create new ones]

For each product, ensure Shopify data exists, then create/update ProductPage documents:

#### Product 1: "Pale Ale"

**ProductPage Document:**

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
- Custom Canonical URL: [leave empty - will auto-generate]
```

#### Product 2: "IPA"

**ProductPage Document:**

```
Name Override: "Sierra Nevada IPA - Bold & Hoppy"
SEO Meta Description: "Bold IPA bursting with hop character. Citrus and pine notes from Centennial and Chinook hops."

OpenGraph:
- Title: "Sierra Nevada IPA | Bold Hoppy Beer"
- Description: "Intense hop flavors meet smooth malt backbone in this West Coast IPA classic."
- Image: [Upload IPA product image]
- Alt Text: "Sierra Nevada IPA can with hop illustration"
```

---

### 3. Sample Collection Content

**Navigate to**: Collections → [Select existing or create new]

#### Collection: "IPAs"

**Shopify Collection**: Ensure basic info exists
**CollectionPage Document:**

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

#### Collection: "Seasonal Beers"

**CollectionPage Document:**

```
SEO Meta Description: "Limited-time seasonal craft beers from Sierra Nevada. Unique flavors celebrating each season."

OpenGraph:
- Title: "Seasonal Beer Collection | Sierra Nevada"
- Description: "Limited-edition seasonal brews crafted with unique ingredients for each time of year."
- Image: [Upload seasonal collection image]
```

---

## Content Entry Tips 💡

### Image Guidelines

- **OpenGraph Images**: 1200x630px optimal, minimum 600x315px
- **Product Images**: High-resolution, good lighting, consistent background
- **Alt Text**: Descriptive, specific, include brand name

### Writing SEO Descriptions

- **Length**: 150-160 characters for meta descriptions
- **Include**: Brand name, key product features, emotional appeal
- **Avoid**: Keyword stuffing, duplicate content

### OpenGraph Titles

- **Length**: Under 60 characters
- **Format**: "Product Name | Brand Name"
- **Include**: Key differentiators, emotional hooks

---

## Testing Quick Start 🧪

Once content is added:

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Check a product page**
   - Visit: `http://localhost:3000/products/[product-handle]`
   - Right-click → "View Page Source"
   - Look for meta tags in `<head>` section

3. **Verify structured data**
   - Look for `<script type="application/ld+json">` tags
   - Copy content and validate at: https://validator.schema.org/

4. **Test social previews**
   - Use Facebook debugger: https://developers.facebook.com/tools/debug/
   - Paste your product page URL

---

## Time Estimates ⏱️

- **Settings Document**: 10-15 minutes
- **2-3 Product Pages**: 20-30 minutes
- **1-2 Collection Pages**: 15-20 minutes
- **Basic Testing**: 15-20 minutes

**Total Setup Time**: ~60-90 minutes

---

## Next Steps

After content setup:

1. ✅ Complete all items in `SEO_TESTING_CHECKLIST.md`
2. 🔧 Fix any issues discovered during testing
3. 📊 Document results and performance metrics
4. 🚀 Plan production deployment

---

## Need Help?

- **Sanity Studio Issues**: Check `STUDIO_TROUBLESHOOTING.md`
- **SEO Questions**: Refer to `SEO_ENHANCEMENTS.md`
- **Testing Problems**: Follow `SEO_TESTING_CHECKLIST.md`
