# Sanity CMS Developer Guide

**Friends of the Family Project - React Router v7 + Hydrogen**

This guide provides comprehensive documentation for developers working with Sanity CMS in the Friends of the Family project, which uses React Router v7 and Shopify Hydrogen.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Data Loading Patterns](#data-loading-patterns)
4. [Type Safety & Code Generation](#type-safety--code-generation)
5. [Caching Strategies](#caching-strategies)
6. [Content Types & Queries](#content-types--queries)
7. [Live Preview Integration](#live-preview-integration)
8. [Image Optimization](#image-optimization)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)
11. [Common Patterns](#common-patterns)

## Quick Start

### 1. Install Dependencies

```bash
npm install @sanity/client @sanity/image-url @sanity/react-loader
```

**Note**: We use a custom integration approach rather than `@sanity/codegen` or `@sanity/preview-kit` for better React Router v7 compatibility.

### 2. Configure Environment Variables

```bash path=null start=null
# .env
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_API_TOKEN=your-api-token
SANITY_USE_CDN=true

# Public variables for client-side usage
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production

# Preview mode configuration
SANITY_PREVIEW_SECRET=your-preview-secret
SANITY_REVALIDATE_SECRET=your-revalidate-secret
```

### 3. Basic Usage

```typescript path=null start=null
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

## Environment Setup

### Required Environment Variables

| Variable                   | Description                      | Required | Default        |
| -------------------------- | -------------------------------- | -------- | -------------- |
| `SANITY_PROJECT_ID`        | Your Sanity project ID           | ✅       | -              |
| `SANITY_DATASET`           | Dataset name                     | ❌       | `production`   |
| `SANITY_API_VERSION`       | API version date                 | ❌       | `2025-01-01`   |
| `SANITY_API_TOKEN`         | Read token (for private content) | ❌       | -              |
| `SANITY_USE_CDN`           | Enable CDN for production        | ❌       | `true` in prod |
| `SANITY_PREVIEW_SECRET`    | Secret for enabling preview mode | ❌       | -              |
| `SANITY_REVALIDATE_SECRET` | Secret for content revalidation  | ❌       | -              |

### Hydrogen Context Integration

In your `server.ts`, ensure Sanity environment variables are available:

```typescript path=null start=null
// server.ts
const env = {
  // ... other env vars
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
  SANITY_DATASET: process.env.SANITY_DATASET,
  SANITY_API_VERSION: process.env.SANITY_API_VERSION,
  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  SANITY_USE_CDN: process.env.SANITY_USE_CDN,
};
```

## Data Loading Patterns

### Server-Side Loading (SSR)

Use `sanityServerQuery` in React Router `loader` functions for server-side data fetching with Hydrogen caching:

```typescript path=null start=null
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

Use `sanityClientQuery` in `clientLoader` functions for browser-side data fetching:

```typescript path=null start=null
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

### Combined Server + Client Loading

For pages that need both static and dynamic data:

```typescript path=null start=null
// routes/events.tsx
export async function loader({context}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  // Load static event data on server
  const events = await sanityServerQuery(
    client,
    SANITY_QUERIES.UPCOMING_EVENTS,
    {},
    {cache: context.storefront.CacheShort()},
  );

  return {events};
}

export async function clientLoader({serverLoader}: Route.ClientLoaderArgs) {
  const {events} = await serverLoader();

  // Add user-specific registration status on client
  const client = createSanityClient({
    SANITY_PROJECT_ID: window.ENV.PUBLIC_SANITY_PROJECT_ID,
  });

  // This could query user registrations or preferences
  const userEventData = await sanityClientQuery(
    client,
    `*[_type == "eventRegistration" && userId == $userId]`,
    {userId: getCurrentUserId()},
  );

  return {
    events,
    userRegistrations: userEventData,
  };
}
```

## Type Safety & Code Generation

### Setup Sanity CodeGen

1. **Install the codegen package:**

   ```bash
   npm install --save-dev @sanity/codegen
   ```

2. **Create codegen config:**

   ```typescript path=null start=null
   // sanity.codegen.ts
   import {SanityCodegenConfig} from '@sanity/codegen';

   const config: SanityCodegenConfig = {
     schemaPath: './sanity/schemas',
     generates: {
       './app/types/sanity.generated.ts': {
         preset: 'typescript',
       },
     },
   };

   export default config;
   ```

3. **Add npm script:**

   ```json path=null start=null
   // package.json
   {
     "scripts": {
       "sanity:codegen": "sanity-codegen"
     }
   }
   ```

4. **Generate types:**
   ```bash
   npm run sanity:codegen
   ```

### Using Generated Types

```typescript path=null start=null
import type {Page, SiteSettings, Event} from '~/types/sanity.generated';
import {
  createSanityClient,
  sanityServerQuery,
  SANITY_QUERIES,
} from '~/lib/sanity';

export async function loader({params, context}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  // Fully type-safe queries
  const page = await sanityServerQuery<Page>(
    client,
    SANITY_QUERIES.PAGE_BY_SLUG,
    {slug: params.slug},
  );

  const settings = await sanityServerQuery<SiteSettings>(
    client,
    SANITY_QUERIES.SITE_SETTINGS,
  );

  return {page, settings};
}
```

## Caching Strategies

### Server-Side Caching with Sanity CDN

Our implementation relies on Sanity's built-in CDN caching rather than Hydrogen's Web API Cache for better reliability and simplicity:

```typescript path=null start=null
// Server-side queries automatically use Sanity's CDN cache in production
// CDN caching is controlled by the client configuration

// Static content - cached by Sanity CDN for optimal performance
const siteSettings = await sanityServerQuery(
  client,
  SANITY_QUERIES.SITE_SETTINGS,
  {},
  {displayName: 'Site settings'}, // For debugging only
);

// Dynamic content - still uses CDN cache but with shorter TTL
const announcements = await sanityServerQuery(
  client,
  SANITY_QUERIES.ANNOUNCEMENTS,
  {},
  {displayName: 'Announcements'},
);

// CDN behavior is controlled at client level:
const client = createSanityClient(env, {
  useCdn: env.NODE_ENV === 'production', // CDN only in production
  apiVersion: '2025-01-01',
});
```

**Why this approach:**

- ✅ **Sanity CDN**: Global edge caching with sub-100ms responses
- ✅ **Smart invalidation**: Automatically updates when content changes in Sanity Studio
- ✅ **Simple**: No complex cache invalidation logic needed
- ✅ **Reliable**: Proven caching infrastructure with 99.9% uptime

### Client-Side Caching

The `sanityClientQuery` function uses sessionStorage for browser caching:

```typescript path=null start=null
// Custom cache duration
const memberContent = await sanityClientQuery(
  client,
  SANITY_QUERIES.MEMBER_CONTENT,
  {},
  {
    useCache: true,
    cacheDuration: 15 * 60 * 1000, // 15 minutes
    cacheKey: 'member-content-dashboard', // Custom key
  },
);

// Disable caching for real-time data
const liveData = await sanityClientQuery(
  client,
  LIVE_DATA_QUERY,
  {},
  {useCache: false},
);
```

## Content Types & Queries

### Available Content Types

The project includes predefined queries for common content types:

#### Site Settings

```typescript path=null start=null
// Global site configuration
const settings = await sanityServerQuery<SiteSettings>(
  client,
  SANITY_QUERIES.SITE_SETTINGS,
);
// Contains: title, description, logo, favicon, socialMedia, membershipInfo
```

#### Navigation

```typescript path=null start=null
// Site navigation structure
const navigation = await sanityServerQuery(client, SANITY_QUERIES.NAVIGATION);
// Contains: mainNavigation, memberNavigation, footerNavigation
```

#### Pages

```typescript path=null start=null
// Individual page by slug
const page = await sanityServerQuery(client, SANITY_QUERIES.PAGE_BY_SLUG, {
  slug: 'about',
});

// All pages for sitemap
const allPages = await sanityServerQuery(client, SANITY_QUERIES.ALL_PAGES);
```

#### Member Content

```typescript path=null start=null
// Member-exclusive content
const memberContent = await sanityServerQuery(
  client,
  SANITY_QUERIES.MEMBER_CONTENT,
);
// Contains: welcome, benefits, exclusiveContent
```

#### Events

```typescript path=null start=null
// Upcoming events
const events = await sanityServerQuery(client, SANITY_QUERIES.UPCOMING_EVENTS);
```

#### Announcements

```typescript path=null start=null
// Recent announcements
const announcements = await sanityServerQuery(
  client,
  SANITY_QUERIES.ANNOUNCEMENTS,
);
```

### Custom Queries

For custom queries, follow the GROQ syntax:

```typescript path=null start=null
// Custom query example
const customQuery = `
  *[_type == "product" && category == $category] | order(_createdAt desc) {
    _id,
    title,
    slug,
    price,
    image,
    description,
    category,
    tags[]
  }
`;

const products = await sanityServerQuery(client, customQuery, {
  category: 'electronics',
});
```

## Live Preview Integration

Sanity's live preview allows content editors to see changes in real-time as they edit content in Sanity Studio. Our integration supports both simple preview mode and full live queries.

### Setup Live Preview

1. **Install preview dependencies:**

   ```bash
   npm install @sanity/preview-kit
   ```

2. **Configure environment variables:**

   ```bash
   SANITY_PREVIEW_SECRET=your-secret-key
   SANITY_REVALIDATE_SECRET=your-revalidate-secret
   SANITY_API_TOKEN=your-read-write-token  # Required for preview
   ```

3. **Set up preview API routes:**
   The integration includes API routes at:
   - `/api/preview/enter` - Enable preview mode
   - `/api/preview/exit` - Disable preview mode

### Preview Mode Detection

Use the smart query function that automatically detects preview mode:

```typescript path=null start=null
// routes/pages.$slug.tsx
import {sanityQuery, SANITY_QUERIES, createLiveQueryData} from '~/lib/sanity';
import type {Route} from './+types/pages.$slug';

export async function loader({params, context, request}: Route.LoaderArgs) {
  // This automatically detects preview mode and uses appropriate client
  const page = await sanityQuery(
    request,
    context.env,
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
}
```

### Live Queries with React Components

For real-time updates in preview mode, use the live query components:

```tsx path=null start=null
// routes/pages.$slug.tsx
import {LiveContent, PreviewModeBanner} from '~/components/SanityLivePreview';

export default function PageRoute({loaderData}: Route.ComponentProps) {
  const {page} = loaderData;

  return (
    <>
      <PreviewModeBanner />
      <LiveContent
        query={SANITY_QUERIES.PAGE_BY_SLUG}
        params={{slug: page.slug.current}}
        initial={page}
        projectId={window.ENV.PUBLIC_SANITY_PROJECT_ID}
        dataset={window.ENV.PUBLIC_SANITY_DATASET}
        token={window.ENV.SANITY_API_TOKEN}
      >
        {(liveData) => (
          <div>
            <h1>{liveData.title}</h1>
            <div>{liveData.content}</div>
          </div>
        )}
      </LiveContent>
    </>
  );
}
```

### Manual Live Query Hook

For more control, use the live query hook directly:

```tsx path=null start=null
import {useSanityLiveQuery} from '~/components/SanityLivePreview';

export default function PageRoute({loaderData}: Route.ComponentProps) {
  const {page} = loaderData;

  // This hook automatically handles preview mode detection
  const liveData = useSanityLiveQuery(
    SANITY_QUERIES.PAGE_BY_SLUG,
    {slug: page.slug.current},
    page, // Initial data from server
    {
      enabled: true,
      projectId: window.ENV.PUBLIC_SANITY_PROJECT_ID,
      dataset: window.ENV.PUBLIC_SANITY_DATASET,
      token: window.ENV.SANITY_API_TOKEN,
    },
  );

  return (
    <div>
      <h1>{liveData.title}</h1>
      <div>{liveData.content}</div>
    </div>
  );
}
```

### Preview Mode Components

Include preview components in your layout:

```tsx path=null start=null
// app/root.tsx
import {
  PreviewModeBanner,
  PreviewScripts,
  PreviewStatusIndicator,
} from '~/components/SanityLivePreview';

export default function App() {
  return (
    <html>
      <head>{/* ... */}</head>
      <body>
        <PreviewModeBanner />
        <Outlet />
        <PreviewStatusIndicator />
        <PreviewScripts />
      </body>
    </html>
  );
}
```

### Configuring Sanity Studio

In your Sanity Studio, configure preview URLs:

```typescript path=null start=null
// sanity.config.ts
import {defineConfig} from 'sanity';

export default defineConfig({
  // ... other config

  document: {
    productionUrl: async (prev, {document}) => {
      const baseUrl = 'https://your-site.com';
      const previewSecret = 'your-preview-secret';

      if (document._type === 'page') {
        return `${baseUrl}/api/preview/enter?secret=${previewSecret}&slug=${document.slug?.current}&type=page`;
      }

      if (document._type === 'post') {
        return `${baseUrl}/api/preview/enter?secret=${previewSecret}&slug=${document.slug?.current}&type=post`;
      }

      return prev;
    },
  },
});
```

### Preview URL Generation

Generate preview URLs programmatically:

```typescript path=null start=null
import {generatePreviewUrl} from '~/lib/sanity';

// Generate preview URLs for different content types
const pagePreview = generatePreviewUrl('about-us', 'page');
const postPreview = generatePreviewUrl('latest-news', 'post');

console.log(pagePreview);
// {
//   preview: 'https://your-site.com/pages/about-us?preview=secret',
//   exit: 'https://your-site.com/api/preview/exit'
// }
```

### Caching Considerations

**Preview mode automatically:**

- ✅ **Disables server-side caching** to show latest content
- ✅ **Uses preview client** with `perspective: 'previewDrafts'`
- ✅ **Includes draft content** not visible in production
- ✅ **Shows real-time updates** as editors make changes

```typescript path=null start=null
// The smart query function handles this automatically
export async function loader({request, context}: Route.LoaderArgs) {
  // In preview mode: no cache, includes drafts
  // In production mode: full caching, published content only
  const data = await sanityQuery(
    request,
    context.env,
    query,
    params,
    {cache: context.storefront.CacheLong()}, // Ignored in preview mode
  );

  return {data};
}
```

### Preview Security

**Important security considerations:**

1. **Use strong preview secrets** and rotate them regularly
2. **Restrict preview access** to content editors only
3. **Don't expose preview tokens** in client-side code
4. **Use environment-specific secrets** for different deployments

```typescript path=null start=null
// Example: Role-based preview access
export async function loader({request, context}: Route.LoaderArgs) {
  const isPreview = isPreviewMode(request, context.env);

  if (isPreview) {
    // Verify user has permission to view preview
    const user = await getAuthenticatedUser(request);
    if (!user || !user.roles.includes('editor')) {
      throw new Response('Unauthorized preview access', {status: 403});
    }
  }

  // ... rest of loader
}
```

### Development Workflow

1. **Start your development server**
2. **Open Sanity Studio**
3. **Edit content and click "Preview"**
4. **See changes in real-time** on your site
5. **Exit preview mode** when done

### Troubleshooting Preview Mode

**Common issues and solutions:**

```typescript path=null start=null
// Debug preview mode detection
import {isPreviewMode} from '~/lib/sanity';

export async function loader({request, context}: Route.LoaderArgs) {
  const inPreview = isPreviewMode(request, context.env);

  console.log('Preview mode:', inPreview);
  console.log('Preview secret:', context.env.SANITY_PREVIEW_SECRET);
  console.log('Has API token:', Boolean(context.env.SANITY_API_TOKEN));

  // ... rest of loader
}
```

**Checklist for preview issues:**

- ✅ `SANITY_API_TOKEN` is set and has read permissions
- ✅ `SANITY_PREVIEW_SECRET` matches Studio configuration
- ✅ Preview API routes are deployed and accessible
- ✅ Browser cookies are enabled
- ✅ Content has been published or saved as draft

## Image Optimization

### Using getSanityImageUrl

The utility function handles image optimization and responsive images:

```typescript path=null start=null
import {getSanityImageUrl} from '~/lib/sanity';

// Basic usage
const optimizedUrl = getSanityImageUrl(page.hero.image, {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp',
});

// Responsive images
const responsiveImages = {
  mobile: getSanityImageUrl(image, {width: 480, height: 320}),
  tablet: getSanityImageUrl(image, {width: 768, height: 512}),
  desktop: getSanityImageUrl(image, {width: 1200, height: 800}),
};

// Focal point cropping
const focalCroppedUrl = getSanityImageUrl(image, {
  width: 400,
  height: 400,
  crop: 'focalpoint',
  fit: 'crop',
});
```

### Component Usage

```tsx path=null start=null
// components/SanityImage.tsx
import {getSanityImageUrl} from '~/lib/sanity';

interface SanityImageProps {
  image: any;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function SanityImage({
  image,
  alt,
  className,
  width = 800,
  height = 600,
}: SanityImageProps) {
  if (!image?.asset) return null;

  const srcSet = [
    `${getSanityImageUrl(image, {width, height, format: 'webp'})} 1x`,
    `${getSanityImageUrl(image, {width: width * 2, height: height * 2, format: 'webp'})} 2x`,
  ].join(', ');

  const fallbackSrc = getSanityImageUrl(image, {width, height, format: 'jpg'});

  return (
    <picture className={className}>
      <source srcSet={srcSet} type="image/webp" />
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />
    </picture>
  );
}
```

## Error Handling

### SanityError Class

The utility provides a custom error class for better error handling:

```typescript path=null start=null
import {SanityError} from '~/lib/sanity';

try {
  const data = await sanityServerQuery(client, query, params);
  return data;
} catch (error) {
  if (error instanceof SanityError) {
    console.error('Sanity query failed:', {
      message: error.message,
      statusCode: error.statusCode,
      query: error.query,
    });

    // Handle different error types
    if (error.statusCode === 404) {
      throw new Response('Content not found', {status: 404});
    }

    throw new Response('Content unavailable', {status: 500});
  }

  // Handle other errors
  throw error;
}
```

### Route-Level Error Boundaries

```tsx path=null start=null
// routes/pages.$slug.tsx
import {isRouteErrorResponse, useRouteError} from 'react-router';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="error-page">
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>
      );
    }

    return (
      <div className="error-page">
        <h1>Something went wrong</h1>
        <p>We're having trouble loading this content.</p>
      </div>
    );
  }

  return (
    <div className="error-page">
      <h1>Unexpected Error</h1>
      <p>An unexpected error occurred.</p>
    </div>
  );
}
```

## Best Practices

### 1. Content Access Control

Use the helper functions for member-only content:

```typescript path=null start=null
import {isContentAvailable, filterActiveAnnouncements} from '~/lib/sanity';

export async function loader({context, request}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);
  const isMember = await checkMembershipStatus(request);

  const page = await sanityServerQuery(client, SANITY_QUERIES.PAGE_BY_SLUG, {
    slug,
  });

  // Check if user can access this content
  if (!isContentAvailable(page, isMember)) {
    throw new Response('Access denied', {status: 403});
  }

  const announcements = await sanityServerQuery(
    client,
    SANITY_QUERIES.ANNOUNCEMENTS,
  );
  const filteredAnnouncements = filterActiveAnnouncements(
    announcements,
    isMember,
  );

  return {page, announcements: filteredAnnouncements};
}
```

### 2. Progressive Enhancement

Structure your routes to work without JavaScript:

```typescript path=null start=null
// routes/events.tsx
export async function loader({context}: Route.LoaderArgs) {
  // Essential data loaded on server
  const client = createSanityClient(context.env);
  const events = await sanityServerQuery(
    client,
    SANITY_QUERIES.UPCOMING_EVENTS,
  );

  return {events};
}

export async function clientLoader({serverLoader}: Route.ClientLoaderArgs) {
  const {events} = await serverLoader();

  // Enhanced data loaded on client
  const client = createSanityClient({
    SANITY_PROJECT_ID: window.ENV.PUBLIC_SANITY_PROJECT_ID,
  });

  const userPreferences = await sanityClientQuery(
    client,
    USER_PREFERENCES_QUERY,
  );

  return {events, userPreferences};
}
```

### 3. Performance Optimization

#### Selective Field Loading

```typescript path=null start=null
// Only load fields you need
const query = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  content,
  // Don't load heavy fields like full content blocks if not needed
  "hasHero": defined(hero),
  "lastModified": _updatedAt
}`;
```

#### Batch Queries

```typescript path=null start=null
// Load related content in one query
const query = `{
  "page": *[_type == "page" && slug.current == $slug][0],
  "settings": *[_type == "siteSettings"][0],
  "navigation": *[_type == "navigation"][0]
}`;

const {page, settings, navigation} = await sanityServerQuery(client, query, {
  slug,
});
```

### 4. Type Safety

Always use generated types for better development experience:

```typescript path=null start=null
import type {Route} from './+types/route';
import type {Page, SiteSettings} from '~/types/sanity.generated';

interface RouteData {
  page: Page;
  settings: SiteSettings;
}

export async function loader({
  params,
  context,
}: Route.LoaderArgs): Promise<RouteData> {
  // Type-safe implementation
}
```

## Common Patterns

### 1. Layout Route with Global Data

```typescript path=null start=null
// routes/_layout.tsx
export async function loader({context}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  const [settings, navigation] = await Promise.all([
    sanityServerQuery(
      client,
      SANITY_QUERIES.SITE_SETTINGS,
      {},
      {
        cache: context.storefront.CacheLong(),
        displayName: 'Site Settings',
      },
    ),
    sanityServerQuery(
      client,
      SANITY_QUERIES.NAVIGATION,
      {},
      {
        cache: context.storefront.CacheLong(),
        displayName: 'Navigation',
      },
    ),
  ]);

  return {settings, navigation};
}
```

### 2. Dynamic Route with Fallback

```typescript path=null start=null
// routes/blog.$slug.tsx
export async function loader({params}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  const post = await sanityServerQuery(
    client,
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      content,
      publishedAt,
      author->,
      categories[]->
    }`,
    {slug: params.slug},
  );

  if (!post) {
    // Try to find similar posts
    const suggestions = await sanityServerQuery(
      client,
      `*[_type == "post"] | order(publishedAt desc) [0...3]{ title, slug }`,
    );

    throw json({suggestions}, {status: 404});
  }

  return {post};
}
```

### 3. Search and Filtering

```typescript path=null start=null
// routes/search.tsx
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';

  if (!query.trim()) {
    return {results: [], query: '', category: ''};
  }

  const client = createSanityClient(context.env);

  const groqQuery = `*[
    _type == "page" && 
    (title match $searchQuery || content[].children[].text match $searchQuery)
    ${category ? '&& category == $category' : ''}
  ] | order(_score desc) {
    _id,
    title,
    slug,
    _type,
    "excerpt": content[0].children[0].text[0...150]
  }`;

  const results = await sanityServerQuery(
    client,
    groqQuery,
    {
      searchQuery: `*${query}*`,
      ...(category && {category}),
    },
    {cache: context.storefront.CacheShort()},
  );

  return {results, query, category};
}
```

---

This guide covers the essential patterns for working with Sanity CMS in your React Router v7 + Hydrogen project. For additional questions or advanced use cases, refer to the [official Sanity documentation](https://www.sanity.io/docs) and [React Router v7 documentation](https://reactrouter.com/).

Remember to:

- Always use the appropriate caching strategy for your content type
- Implement proper error boundaries and fallbacks
- Test both server and client loading patterns
- Keep your generated types up to date with schema changes
- Monitor performance with Hydrogen's built-in profiler
