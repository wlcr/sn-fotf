# Sanity CMS Integration Guide

**Complete guide to Sanity CMS development and content management for Sierra Nevada Friends of the Family.**

## ⚡ Quick Start

1. **Start development**: `npm run dev` (includes embedded Studio)
2. **Access Studio**: http://localhost:3000/studio
3. **Generate types**: `npm run sanity:codegen`
4. **Setup content**: Follow [Content Setup](#content-setup) section

## 🏗️ Architecture Overview

### Embedded Studio Benefits

- **Single Development Server**: No need to run separate terminals
- **Same Origin**: No CORS issues for API calls between Studio and app
- **Integrated SEO Tool**: Real-time SEO testing directly in Studio
- **Simplified Workflow**: Everything runs with `npm run dev`

### ⚠️ CRITICAL: Studio Must Be Client-Only

**Bundle Size Warning:** Sanity Studio is a ~4MB bundle designed for browsers. Including it in the server bundle will cause Oxygen deployment failures.

**Required Pattern:**

- Studio routes (`studio.$.tsx`) MUST have NO server-side loaders
- All Sanity Studio imports MUST use dynamic imports (`import('sanity')`)
- Studio dependencies MUST be externalized from SSR in `vite.config.ts`

**See:** [Bundle Optimization Guide](./BUNDLE_OPTIMIZATION.md) for complete details.

### Technology Integration

- **Project ID**: `rimuhevv` (hardcoded, not sensitive)
- **Dataset**: `production` (hardcoded)
- **API Version**: `2025-01-01` (hardcoded)
- **Environment Variables**: Only secrets are stored as env vars

---

## 🔧 Development Integration

### Environment Setup

**Environment Variables (Secrets Only):**

```bash
# .env - Only sensitive variables stored here
SANITY_API_TOKEN=your-api-token
SANITY_PREVIEW_SECRET=your-preview-secret
SANITY_REVALIDATE_SECRET=your-revalidate-secret
SANITY_STUDIO_URL=http://localhost:3000/studio
```

**Hardcoded Configuration (Not Sensitive):**

```typescript
// app/lib/sanity.ts
const config = {
  projectId: 'rimuhevv', // Project IDs are visible in API URLs
  dataset: 'production', // Dataset names are not sensitive
  apiVersion: '2025-01-01', // API version is not sensitive
};
```

### Basic Usage Pattern

```typescript
import {
  createSanityClient,
  sanityServerQuery,
  SANITY_QUERIES,
} from '~/lib/sanity';
import type {Route} from './+types/route';

export async function loader({context}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  const siteSettings = await sanityServerQuery(
    client,
    SANITY_QUERIES.SITE_SETTINGS,
    {},
    {
      cache: context.storefront.CacheLong(),
      displayName: 'Site Settings',
    },
  );

  return {siteSettings};
}
```

---

## 📊 Data Loading Patterns

### Server-Side Loading (SSR)

Use `sanityServerQuery` in React Router `loader` functions:

```typescript
// routes/pages.$slug.tsx
import type {Route} from './+types/pages.$slug';
import {
  createSanityClient,
  sanityServerQuery,
  SANITY_QUERIES,
} from '~/lib/sanity';

export async function loader({params, context}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  try {
    const page = await sanityServerQuery(
      client,
      SANITY_QUERIES.PAGE_BY_SLUG,
      {slug: params.slug},
      {
        cache: context.storefront.CacheLong(),
        displayName: `Page: ${params.slug}`,
      },
    );

    if (!page) {
      throw new Response('Page not found', {status: 404});
    }

    return {page};
  } catch (error) {
    console.error('Failed to load page:', error);
    throw new Response('Page not found', {status: 404});
  }
}
```

### Client-Side Loading

Use `sanityClientQuery` in `clientLoader` functions:

```typescript
// routes/dashboard.tsx
import type { Route } from './+types/route';
import { createSanityClient, sanityClientQuery, SANITY_QUERIES } from '~/lib/sanity';

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  // Get static data from server
  const serverData = await serverLoader();

  // Fetch personalized data on client
  const client = createSanityClient({
    SANITY_PROJECT_ID: window.ENV.PUBLIC_SANITY_PROJECT_ID,
    SANITY_DATASET: window.ENV.PUBLIC_SANITY_DATASET,
  });

  const memberContent = await sanityClientQuery(
    client,
    SANITY_QUERIES.MEMBER_CONTENT,
    {},
    {
      useCache: true,
      cacheDuration: 10 * 60 * 1000 // 10 minutes
    }
  );

  return {
    ...serverData,
    memberContent
  };
}

// Enable hydration fallback for SSR
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <div>Loading member dashboard...</div>;
}
```

---

## 🎨 Content Setup

### Essential Content Types

#### 1. Settings Document (Singleton)

**Priority: HIGH** - Required for site functionality

```typescript
// Global site configuration
{
  title: "Sierra Nevada Friends of the Family",
  description: "Exclusive craft beer experiences...",
  keywords: ["craft beer", "sierra nevada", "brewing"],
  siteDiscoverable: true,
  allowRobotsCrawling: true,
  companyName: "Sierra Nevada Brewing Co.",
  contactEmail: "friends@sierranevada.com",
  phone: "(530) 893-3520",
  address: "1075 E 20th St, Chico, CA 95928"
}
```

#### 2. Product Pages

**Individual product SEO and content overrides**

```typescript
// ProductPage document for enhanced product info
{
  product: {_ref: "shopify-product-id"},
  nameOverride: "Sierra Nevada Pale Ale - Craft Beer Classic",
  seoMetaDescription: "Experience the original craft beer...",
  customKeywords: ["pale ale", "cascade hops", "craft beer"],
  openGraph: {
    title: "Sierra Nevada Pale Ale | Craft Beer Pioneer",
    description: "The beer that launched the craft beer revolution...",
    image: {asset: {_ref: "image-asset-id"}},
    imageAlt: "Sierra Nevada Pale Ale bottle on white background"
  }
}
```

#### 3. Collection Pages

**Category-level SEO and marketing content**

```typescript
// CollectionPage document for enhanced collection info
{
  collection: {_ref: "shopify-collection-id"},
  seoMetaDescription: "Explore Sierra Nevada's full range of IPAs...",
  customKeywords: ["IPA", "India pale ale", "hop forward beer"],
  priorityLevel: "high",
  openGraph: {
    title: "IPA Collection | Sierra Nevada Brewing",
    description: "Discover our complete range of IPAs...",
    image: {asset: {_ref: "collection-image-id"}},
    imageAlt: "Sierra Nevada IPA collection featuring various bottles"
  }
}
```

---

## 🔍 GROQ Queries

### Complex Query Patterns with Comments

```groq
// Product with enhanced page data
*[_type == "product" && store.slug.current == $slug][0] {
  ...,
  "enhancedPage": *[_type == "productPage" && references(^._id)][0] {
    nameOverride,
    seoMetaDescription,
    customKeywords,
    openGraph {
      title,
      description,
      image {
        asset-> {
          _id,
          url,
          metadata {
            dimensions
          }
        }
      },
      imageAlt
    }
  }
}
```

```groq
// Navigation with conditional URL building
*[_type == "navigation"][0] {
  items[] {
    text,
    // GROQ conditional syntax: _type == "reference" => @->{...}
    // IF the item is a reference type, THEN resolve it (@->) and return these fields
    _type == "reference" => @->{
      title,
      "url": "/pages/" + slug.current  // Build URL from referenced page's slug
    },
    _type == "externalLink" => {
      url,
      openInNewTab
    },
    _type == "productLink" => {
      "url": "/products/" + product->store.slug.current,
      product->{ title }
    }
  }
}
```

---

## 🖼️ Image Optimization

### Sanity CDN URL Construction

```typescript
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder({
  projectId: 'rimuhevv',
  dataset: 'production',
});

// Generate optimized image URLs
function urlFor(source: any) {
  return builder.image(source);
}

// Usage examples
const productImage = urlFor(product.image)
  .width(800)
  .height(600)
  .quality(85)
  .format('webp')
  .url();

// Open Graph images (social media)
const ogImage = urlFor(openGraph.image)
  .width(1200)
  .height(630)
  .quality(85)
  .format('jpg') // JPG for better social media compatibility
  .url();
```

### Image Best Practices

**OpenGraph Images:**

- Dimensions: 1200x630px optimal
- Format: JPG for social media compatibility
- Quality: 85% for balance of size/quality

**Product Images:**

- High resolution source images
- WebP format for modern browsers
- Responsive sizing with multiple breakpoints

**Alt Text Guidelines:**

- Descriptive and specific
- Include brand name when relevant
- Avoid "image of" or "picture of"
- Keep under 100 characters

---

## ⚙️ Type Safety & Code Generation

### Automatic Type Generation

```bash
# Generate TypeScript types from Sanity schemas
npm run sanity:codegen

# This creates/updates:
# - studio/sanity.types.ts (comprehensive types)
# - Automatically imported in project
```

### Using Generated Types

```typescript
import type {
  SiteSettings,
  ProductPage,
  CollectionPage,
  SanityImageAsset,
} from '~/studio/sanity.types';

// Type-safe query results
const settings: SiteSettings = await sanityServerQuery(
  client,
  SANITY_QUERIES.SITE_SETTINGS,
  {},
);

// Type-safe image handling
function getImageUrl(image: SanityImageAsset | undefined): string | null {
  if (!image?.asset) return null;

  return urlFor(image).width(800).quality(85).url();
}
```

---

## 📱 Studio Usage & Features

### Accessing the Embedded Studio

**Development:**

- URL: http://localhost:3000/studio
- Authentication: Sign in with your Sanity account
- Project: Sierra Nevada - Friends of the Family
- Dataset: `production`

**Production:**

- URL: https://[your-deployment-url]/studio
- Same authentication and project access
- Live editing with immediate site updates

### Studio Features

**Content Management:**

- Rich text editing with Portable Text
- Media management with automatic optimization
- Schema validation for data integrity
- Version control and revision history

**SEO Integration:**

- Real-time SEO testing tool in sidebar
- Visual scorecard with recommendations
- Test changes immediately without switching tools
- No CORS issues - same-origin API calls

**Content Types:**

- Settings (singleton) - Global site configuration
- Product Pages - Product-specific enhancements
- Collection Pages - Category-level content
- Navigation - Site navigation structure

---

## 🔧 Advanced Patterns

### Caching Strategies

```typescript
// Long cache for relatively static content
const settings = await sanityServerQuery(
  client,
  SANITY_QUERIES.SITE_SETTINGS,
  {},
  {
    cache: context.storefront.CacheLong(), // 1 hour default
    displayName: 'Site Settings',
  },
);

// Short cache for frequently updated content
const announcements = await sanityServerQuery(
  client,
  SANITY_QUERIES.ANNOUNCEMENTS,
  {},
  {
    cache: context.storefront.CacheShort(), // 5 minutes default
    displayName: 'Announcements',
  },
);

// No cache for personalized content
const memberData = await sanityClientQuery(
  client,
  SANITY_QUERIES.MEMBER_CONTENT,
  {memberId},
  {
    useCache: false, // Always fresh
  },
);
```

### Error Handling Patterns

```typescript
import {SanityError} from '~/lib/sanity';

export async function loader({params, context}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  try {
    const data = await sanityServerQuery(
      client,
      SANITY_QUERIES.COMPLEX_QUERY,
      {slug: params.slug},
      {
        cache: context.storefront.CacheLong(),
        displayName: `Complex Query: ${params.slug}`,
      },
    );

    if (!data) {
      // Use custom error for better debugging
      throw new SanityError(
        `No data found for slug: ${params.slug}`,
        404,
        SANITY_QUERIES.COMPLEX_QUERY,
      );
    }

    return {data};
  } catch (error) {
    if (error instanceof SanityError) {
      console.error('Sanity query failed:', {
        message: error.message,
        query: error.query,
        statusCode: error.statusCode,
      });
    } else {
      console.error('Unexpected error:', error);
    }

    throw new Response('Content not found', {status: 404});
  }
}
```

---

## 🏗️ Embedded Studio Setup

### ✅ Correct Studio Route Pattern

**File: `app/routes/studio.$.tsx`**

```typescript
import { useEffect, useState } from 'react';

// ⚠️ CRITICAL: NO server-side loader function
// This ensures Sanity Studio stays client-only and doesn't bloat server bundle

export default function StudioPage() {
  const [Studio, setStudio] = useState(null);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up browser globals for Sanity Studio
    if (typeof window !== 'undefined') {
      window.global = window.global || window;
      if (!window.process) {
        window.process = { env: { NODE_ENV: 'development' } };
      }
    }

    async function loadStudio() {
      try {
        // ✅ Dynamic imports prevent server-side inclusion
        const [{ Studio: StudioComponent }, studioConfig] = await Promise.all([
          import('sanity'),                    // ~4MB - client only!
          import('../../studio/sanity.config'),
        ]);

        setStudio(() => StudioComponent);
        setConfig(studioConfig.default);
      } catch (err) {
        console.error('Failed to load Studio:', err);
        setError(err.message || 'Failed to load Studio');
      }
    }

    loadStudio();
  }, []);

  // Loading state
  if (!Studio || !config) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading Sanity Studio...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1>Studio Loading Error</h1>
        <p>{error}</p>
        <a href="/">← Back to Site</a>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Studio
        config={config}
        unstable_noAuthBoundary
        unstable_globalErrorHandler={(error) => {
          console.error('Studio error (handled):', error);
          return true; // Prevent error from bubbling up
        }}
      />
    </div>
  );
}
```

### ⚠️ Bundle Size Requirements

**Why Client-Only Matters:**

- Sanity Studio bundle: **~4MB** designed for browsers
- Shopify Oxygen server limit: **< 2MB total**
- Including Studio in server bundle = deployment failure

**Required Vite Configuration:**

```typescript
// vite.config.ts
export default defineConfig({
  ssr: {
    // Exclude heavy Sanity dependencies from server bundle
    external: [
      'sanity',
      '@sanity/vision',
      '@sanity/visual-editing',
      '@sanity/react-loader',
    ],
    noExternal: [
      // Keep light dependencies in server bundle
      '@sanity/client', // Small API client (~50KB)
      '@sanity/image-url', // Image URL builder (~10KB)
    ],
  },
});
```

### ✅ SEO API Route Pattern

**File: `app/routes/studio.seo.tsx`**

```typescript
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

// ✅ Server action for API functionality is OK
export async function action({request, context}: ActionFunctionArgs) {
  // Keep dependencies minimal and lightweight
  const {parse} = await import('ultrahtml'); // Dynamic import

  // SEO testing logic here...
  return new Response(JSON.stringify(results), {
    headers: {'Content-Type': 'application/json'},
  });
}

// ✅ NO default export component
// This prevents including client-side Studio dependencies
```

### 🔍 Bundle Size Verification

```bash
# Build and check server bundle size
npm run build
ls -lh dist/server/index.js

# Should show ~1.4MB, not 7MB+
# Open bundle analyzer if too large:
open dist/server/server-bundle-analyzer.html
```

**Target Sizes:**

- **Server bundle**: < 1.5MB ✅
- **Client Studio chunk**: ~4.4MB ✅ (lazy loaded)
- **Other client chunks**: < 1MB each ✅

---

## 🚀 Best Practices

### Performance Optimization

1. **Query Optimization:**
   - Only fetch required fields
   - Use projection to limit data transfer
   - Implement proper caching strategies

2. **Image Optimization:**
   - Always specify dimensions for layout stability
   - Use WebP format with JPG fallback
   - Implement responsive images

3. **Type Safety:**
   - Regenerate types after schema changes
   - Use generated types consistently
   - Validate required fields in components

### Content Strategy

1. **SEO-First Approach:**
   - Complete all SEO fields in Studio
   - Use descriptive, keyword-rich content
   - Optimize images with proper alt text

2. **Consistency:**
   - Maintain brand voice across all content
   - Use consistent naming conventions
   - Follow content guidelines for descriptions

3. **User Experience:**
   - Preview changes before publishing
   - Test content across different devices
   - Ensure accessibility standards

---

## 🔍 Troubleshooting

### Common Issues

**Studio Not Loading:**

- Verify development server is running: `npm run dev`
- Check console for JavaScript errors
- Ensure proper authentication

**Types Out of Date:**

- Run `npm run sanity:codegen` after schema changes
- Restart TypeScript server in your editor
- Clear Next.js cache if needed

**Query Failures:**

- Check GROQ syntax in Studio's Vision tool
- Verify referenced documents exist
- Review query parameters and data structure

**Image Loading Issues:**

- Verify image assets exist in Sanity
- Check image URL construction
- Ensure proper dimensions are specified

### Development Debugging

```typescript
// Debug query performance
import {debugSanityQuery} from '~/lib/sanity/debug';

if (process.env.NODE_ENV === 'development') {
  debugSanityQuery(query, params, result, performance);
}

// Debug image URL generation
console.log('Generated image URL:', {
  original: image,
  optimized: urlFor(image).width(800).url(),
  dimensions: image?.asset?.metadata?.dimensions,
});
```

---

## 📚 Commands Reference

```bash
# Development
npm run dev                 # Start app + embedded Studio
npm run sanity:codegen      # Generate TypeScript types
npm run studio:clean        # Clear Studio cache

# Content Management
# - Access Studio: http://localhost:3000/studio
# - Vision tool: Studio sidebar → "Vision"
# - SEO testing: Studio sidebar → "SEO Testing"

# Environment
shopify hydrogen env pull   # Update environment variables
# - SANITY_API_TOKEN
# - SANITY_PREVIEW_SECRET
# - SANITY_REVALIDATE_SECRET
```

---

**Quick Access:**

- 🎨 **Studio**: http://localhost:3000/studio
- 🔍 **Vision Tool**: Studio → Vision (GROQ query testing)
- 📊 **SEO Testing**: Studio → SEO Testing
- 🏗️ **Schema Types**: `studio/schemaTypes/`

_This guide covers everything you need to develop with and manage content in Sanity CMS for the Friends of the Family project._
