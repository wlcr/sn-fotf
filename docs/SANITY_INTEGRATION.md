# Sanity Integration Guide for Hydrogen 2025.5.0 + React Router v7

This document outlines our **current working implementation** of Sanity CMS with Hydrogen 2025.5.0 and React Router v7.

## Table of Contents

- [Current Implementation Overview](#current-implementation-overview)
- [Environment Setup](#environment-setup)
- [Basic Usage Pattern](#basic-usage-pattern)
- [Type Generation](#type-generation)
- [Caching Strategy](#caching-strategy)
- [Advanced Features (Optional)](#advanced-features-optional)
- [Best Practices](#best-practices)

## Current Implementation Overview

Our Sanity integration follows a **simple, reliable pattern** that works with Hydrogen 2025.5.0:

### ✅ What's Working

- **Basic CMS Integration**: Homepage loads content from Sanity CMS
- **Type Generation**: Automatic TypeScript types from Sanity schema
- **CDN Caching**: Uses Sanity's built-in CDN for performance
- **Environment Variables**: Clean separation of secrets vs. configuration
- **Studio Access**: Local development studio at localhost:3333

### 🎯 Architecture Principles

1. **Simplicity First**: Use proven patterns, avoid over-engineering
2. **Hydrogen Compatible**: Uses current Hydrogen 2025.5.0 patterns
3. **Type Safety**: Generated types from Sanity schema
4. **Performance**: Leverages Sanity CDN caching

## Environment Setup

### Configuration Strategy

**Hardcoded Values** (in `app/lib/sanity.ts`):

```typescript
export const sanityConfig = {
  projectId: 'rimuhevv', // Not sensitive - visible in API URLs
  dataset: 'production', // Public information
  apiVersion: '2025-01-01', // Version string
  studioUrl: 'http://localhost:3333', // Development default
};
```

**Environment Variables** (secrets only):

```bash
# In .env (managed by Shopify CLI)
SANITY_API_TOKEN=sk... # For preview mode (optional)
SANITY_PREVIEW_SECRET=... # For preview authentication (optional)
SANITY_REVALIDATE_SECRET=... # For webhook validation (optional)
SANITY_STUDIO_URL=... # Override studio URL (optional)
```

### Why This Approach?

- ✅ **Security**: Only secrets are environment variables
- ✅ **Simplicity**: No complex env var management
- ✅ **Reliability**: Hardcoded values won't break in different environments
- ✅ **Performance**: No runtime env var lookups for basic config

## Basic Usage Pattern

### 1. Server-Side Data Loading

This is our **current working pattern** as seen in `app/routes/_index.tsx`:

```typescript
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {createSanityClient, sanityServerQuery} from '~/lib/sanity';
import type {Homepage, SettingsQueryResult} from '~/studio/sanity.types';
import {homeQuery, settingsQuery} from '~/studio/queries/index';

export async function loader({context}: LoaderFunctionArgs) {
  // Create Sanity client with environment variables
  const sanityClient = createSanityClient(context.env);

  // Load content with error handling
  const [siteSettings, homepage] = await Promise.all([
    sanityServerQuery<SettingsQueryResult | null>(
      sanityClient,
      settingsQuery,
      {},
      {
        displayName: 'Site Settings',
        env: context.env,
      },
    ).catch((error) => {
      console.error('Failed to load Sanity site settings:', error);
      return null; // Continue without Sanity data if it fails
    }),

    sanityServerQuery<Homepage | null>(
      sanityClient,
      homeQuery,
      {},
      {
        displayName: 'Homepage Content',
        env: context.env,
      },
    ).catch((error) => {
      console.error('Failed to load Sanity homepage content:', error);
      return null; // Continue without homepage data if it fails
    }),
  ]);

  return {
    siteSettings,
    homepage,
  };
}
```

### 2. Component Usage

```typescript
export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      {/* Render Sanity homepage content if available */}
      {data.homepage?.pageBuilder && (
        <PageSectionsBuilder
          parent={{_id: data.homepage._id, _type: data.homepage._type}}
          pageBuilder={data.homepage.pageBuilder}
        />
      )}

      {/* Keep existing Shopify content */}
      <FeaturedCollection collection={data.featuredCollection} />
    </div>
  );
}
```

## Type Generation

### Automatic Type Generation

We use Sanity's built-in type generation:

```bash
# Generate types from Sanity schema
npm run sanity:codegen
```

This creates `studio/sanity.types.ts` with full TypeScript types for all content.

### Usage with Generated Types

```typescript
import type {Homepage, SettingsQueryResult} from '~/studio/sanity.types';

// Type-safe queries
const homepage = await sanityServerQuery<Homepage>(client, homeQuery, {});

// IntelliSense works perfectly
homepage.pageBuilder?.forEach((section) => {
  // Full type safety and autocompletion
});
```

#### Benefits of Type Generation:

- ✅ **Auto-sync**: Types update when Sanity schema changes
- ✅ **IntelliSense**: Full autocompletion for content fields
- ✅ **Error Prevention**: Compile-time checks for field access
- ✅ **Refactoring Safety**: Rename detection across codebase

### Integration with Project's Type Philosophy

This aligns perfectly with our existing approach mentioned in the README:

> **Important**: Always use Shopify's built-in codegen for GraphQL types instead of creating custom types manually.

We'll follow the same pattern for Sanity:

- ✅ **Use Sanity's codegen** for CMS types
- ✅ **Use Shopify's codegen** for commerce types
- ❌ **Avoid manual type definitions**

## Data Loading Patterns

### Pattern 1: Static Content (Pages, Settings)

**Use Case**: About page, site settings, navigation
**Pattern**: Server-side with long caching

```tsx
// app/routes/about.tsx
export async function loader({context}: Route.LoaderArgs) {
  const [page, settings] = await Promise.all([
    sanityServerQuery<Page>(
      context.sanity,
      QUERIES.ABOUT_PAGE,
      {},
      {displayName: 'About page'},
    ),
    sanityServerQuery<SiteSettings>(
      context.sanity,
      QUERIES.SITE_SETTINGS,
      {},
      {displayName: 'Site settings'},
    ),
  ]);

  return {page, settings};
}
```

### Pattern 2: Dynamic Content (User-Personalized)

**Use Case**: Member-specific content, personalized recommendations
**Pattern**: Combined server + client loading

```tsx
// app/routes/members.dashboard.tsx
export async function loader({context}: Route.LoaderArgs) {
  // Public member content for SEO with CDN caching
  const memberContent = await sanityServerQuery<MemberContent>(
    context.sanity,
    QUERIES.MEMBER_CONTENT,
  );
  return {memberContent};
}

export async function clientLoader({serverLoader}: Route.ClientLoaderArgs) {
  // Add personalized data
  const [serverData, userProfile] = await Promise.all([
    serverLoader(),
    getUserProfile(), // From localStorage/API
  ]);

  return {
    ...serverData,
    userProfile,
    personalizedContent: await sanityClientQuery<PersonalizedContent>(
      client,
      QUERIES.PERSONALIZED_CONTENT,
      {userId: userProfile.id},
    ),
  };
}
clientLoader.hydrate = true;
```

### Pattern 3: Real-time Content Updates

**Use Case**: Live member updates, event information
**Pattern**: Client-side with short caching

```tsx
// app/routes/live.updates.tsx
export async function clientLoader({request}: Route.ClientLoaderArgs) {
  const updates = await sanityClientQuery<LiveUpdate[]>(
    client,
    QUERIES.LIVE_UPDATES,
    {},
    {
      useCache: true,
      cacheKey: 'live-updates', // Custom cache key
    },
  );

  return {updates};
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <div>Loading live updates...</div>;
}
```

## Implementation Examples

### Environment Configuration

```typescript
// app/lib/env.ts - Add to existing env types
declare global {
  interface Env extends HydrogenEnv {
    // Existing Shopify vars...

    // Sanity Configuration (only secrets as env vars)
    SANITY_API_TOKEN?: string;
    SANITY_PREVIEW_SECRET?: string;
    SANITY_REVALIDATE_SECRET?: string;
    SANITY_STUDIO_URL?: string;
  }
}

// Project ID, dataset, and API version are hardcoded in app/lib/sanity.ts:
// projectId: 'rimuhevv', dataset: 'production', apiVersion: '2025-01-01'
```

### Hydrogen Context Integration

```typescript
// app/lib/context.ts - Add to existing createAppLoadContext
import {createSanityClient} from '~/lib/sanity';

export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  // ... existing Shopify context setup

  // Add Sanity client to context
  const sanity = createSanityClient(env);

  return {
    ...hydrogenContext,
    sanity, // Make available to all loaders
  };
}
```

### Route Implementation

```tsx
// app/routes/pages.$slug.tsx
import type {Route} from './+types/pages.$slug';
import type {Page} from '~/lib/sanity.types'; // Generated types
import {sanityServerQuery, SANITY_QUERIES} from '~/lib/sanity';

export async function loader({params, context}: Route.LoaderArgs) {
  const page = await sanityServerQuery<Page>(
    context.sanity,
    SANITY_QUERIES.PAGE_BY_SLUG,
    {slug: params.slug},
    {displayName: 'Page by slug'},
  );

  if (!page) {
    throw new Response('Page not found', {status: 404});
  }

  return {page};
}

export default function PageRoute({loaderData}: Route.ComponentProps) {
  const {page} = loaderData;

  return (
    <div>
      <h1>{page.title}</h1>
      {/* Render Portable Text content */}
      <PortableText value={page.content} />
    </div>
  );
}
```

## Caching Strategy

### How Sanity Caching Works in Our Implementation

Our caching approach is designed to be **simple, reliable, and performant** by leveraging Sanity's built-in capabilities rather than complex custom caching logic.

#### **Server-Side: Sanity CDN Caching**

```tsx
// ✅ Recommended: Let Sanity handle caching with CDN
const sanityClient = createSanityClient(env, {
  useCdn: env.NODE_ENV === 'production', // CDN in production, fresh data in dev
});

// This automatically uses Sanity's global CDN for fast responses
const content = await sanityServerQuery(
  context.sanity,
  query,
  params,
  {displayName: 'Content query'}, // For debugging only
);
```

**Benefits of Sanity CDN Caching:**

- 🚀 **Sub-100ms responses** from global edge locations
- 🔄 **Smart invalidation** when content changes in Sanity Studio
- 🌍 **Global distribution** with 99.9% uptime
- 🎯 **Query-aware caching** that understands GROQ queries

#### **Client-Side: SessionStorage Caching**

```tsx
// ✅ Client-side caching for browser performance
const clientContent = await sanityClientQuery(client, query, params, {
  useCache: true, // Enable sessionStorage caching
  cacheDuration: 5 * 60 * 1000, // 5 minutes (customizable)
  cacheKey: 'my-content', // Optional custom cache key
});
```

**Benefits of SessionStorage Caching:**

- ⚡ **Instant responses** for repeat queries within session
- 🔄 **Automatic expiration** based on cacheDuration
- 💾 **Survives page reloads** within the same browser session
- 🎛️ **Fully configurable** cache duration and keys

#### **Why We Don't Use Complex Caching**

We **intentionally avoid** Hydrogen's Web API Cache or custom cache invalidation because:

- ❌ **Complexity**: Hard to debug and maintain
- ❌ **Reliability**: Cache invalidation is notoriously difficult
- ❌ **Overkill**: Sanity's CDN already provides excellent caching
- ❌ **Framework Coupling**: Ties us to specific Hydrogen APIs

Instead, our approach is:

- ✅ **Simple**: Rely on proven Sanity CDN + basic client storage
- ✅ **Reliable**: Let Sanity handle the hard parts of cache invalidation
- ✅ **Maintainable**: Easy to understand and debug
- ✅ **Flexible**: Works across different environments and frameworks

### **Caching Configuration Examples**

```tsx
// Static content - long CDN cache + client cache
export async function loader({context}: Route.LoaderArgs) {
  const settings = await sanityServerQuery(
    context.sanity,
    SANITY_QUERIES.SITE_SETTINGS,
    {},
    {displayName: 'Site settings'},
  );
  // Sanity CDN will cache this for hours automatically
  return {settings};
}

// Dynamic content - CDN cache + short client cache
export async function clientLoader(): Route.ClientLoaderArgs {
  const updates = await sanityClientQuery(
    client,
    SANITY_QUERIES.RECENT_UPDATES,
    {},
    {
      useCache: true,
      cacheDuration: 1 * 60 * 1000, // 1 minute for fresh content
      cacheKey: 'recent-updates',
    },
  );
  return {updates};
}

// Real-time content - no caching
export async function liveLoader(): Route.ClientLoaderArgs {
  const liveData = await sanityClientQuery(
    client,
    SANITY_QUERIES.LIVE_DATA,
    {},
    {useCache: false}, // Always fresh
  );
  return {liveData};
}
```

## Advanced Features (Optional)

### Preview Mode (Future Implementation)

If you need preview mode in the future, here's the Hydrogen 2025.5.0 compatible approach:

```typescript
// Preview mode compatible with current LoaderFunctionArgs pattern
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {isPreviewMode, createSanityPreviewClient} from '~/lib/sanity';

export async function loader({context, request}: LoaderFunctionArgs) {
  const inPreviewMode = isPreviewMode(request, context.env);

  const client = inPreviewMode
    ? createSanityPreviewClient(context.env)
    : createSanityClient(context.env);

  const data = await sanityServerQuery(client, query, params);
  return {data, preview: inPreviewMode};
}
```

### Client-Side Loading (Future Implementation)

For future client-side enhancements using Hydrogen 2025.5.0 patterns:

```typescript
// Note: This would require React Router v7 clientLoader support in Hydrogen
// Currently, Hydrogen 2025.5.0 still uses LoaderFunctionArgs pattern

// Server-side data for SEO
export async function loader({context}: LoaderFunctionArgs) {
  const staticData = await sanityServerQuery(client, query, params);
  return {staticData};
}

// Future client enhancement when available
export async function clientLoader({serverLoader}: any) {
  const {staticData} = await serverLoader();

  // Add client-side enhancements
  const userSpecificData = await sanityClientQuery(client, userQuery, {
    userId: getCurrentUserId(),
  });

  return {
    ...staticData,
    userSpecificData,
  };
}
```

### Error Boundaries for Sanity Content

```typescript
// Error boundary component for Sanity content failures
import {isRouteErrorResponse, useRouteError} from 'react-router';

export function SanityErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 503) {
    return (
      <div className="sanity-error">
        <h2>Content temporarily unavailable</h2>
        <p>We're experiencing issues loading content. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="sanity-error">
      <h2>Something went wrong</h2>
      <p>Unable to load content.</p>
    </div>
  );
}
```

## Best Practices

### 1. **Use Appropriate Caching Strategies**

**Server-Side Caching**:
Sanity provides excellent CDN caching by default. Our approach leverages this built-in caching:

```tsx
// Static content - relies on Sanity CDN caching (fast and reliable)
const staticContent = await sanityServerQuery(context.sanity, query, params, {
  displayName: 'Static content query',
});

// For production: useCdn: true enables Sanity's global CDN
// For development: useCdn: false ensures fresh data
const sanityClient = createSanityClient(env, {
  useCdn: env.NODE_ENV === 'production', // Automatic CDN caching in production
});
```

**Client-Side Caching**:
For browser-side queries, we use sessionStorage caching:

```tsx
// Client-side with sessionStorage caching (5 minutes default)
const clientContent = await sanityClientQuery(client, query, params, {
  useCache: true,
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  cacheKey: 'custom-cache-key', // Optional custom key
});

// Real-time content - no client cache
const liveContent = await sanityClientQuery(client, query, params, {
  useCache: false,
});
```

**Why This Approach Works:**

- ✅ **Sanity CDN**: Global edge caching (sub-100ms responses)
- ✅ **Client Storage**: Browser-level caching for repeat visits
- ✅ **Environment Aware**: Production uses CDN, development uses fresh data
- ✅ **Simple**: No complex cache invalidation logic needed

### 2. **Handle Errors Gracefully**

```tsx
export async function loader({params, context}: Route.LoaderArgs) {
  try {
    const page = await sanityServerQuery<Page>(
      context.sanity,
      SANITY_QUERIES.PAGE_BY_SLUG,
      {slug: params.slug},
      {displayName: 'Page by slug loader'},
    );

    return {page};
  } catch (error) {
    console.error('Sanity query failed:', error);
    throw new Response('Content unavailable', {status: 503});
  }
}
```

### 3. **Optimize Image Loading**

```tsx
// Use Sanity's image CDN with optimization
import {getSanityImageUrl} from '~/lib/sanity';

export default function PageHero({image}: {image: any}) {
  const optimizedUrl = getSanityImageUrl(image, {
    width: 800,
    height: 400,
    format: 'webp',
    quality: 80,
  });

  return <img src={optimizedUrl} alt="Hero image" />;
}
```

### 4. **Progressive Enhancement**

```tsx
// Ensure content works without JavaScript
export function HydrateFallback() {
  return (
    <div className="page-skeleton">
      {/* Show basic structure during SSR */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}
```

### 5. **Leverage React Router v7 Features**

```tsx
// Use React Router v7's data loading optimization
export async function clientLoader({serverLoader}: Route.ClientLoaderArgs) {
  // Only fetch additional data on client, reuse server data
  const serverData = await serverLoader();

  // Add client-specific enhancements
  return {
    ...serverData,
    enhanced: true,
    timestamp: new Date().toISOString(),
  };
}
```

## Next Steps

1. **Install Dependencies**:

   ```bash
   npm install @sanity/client @sanity/codegen
   ```

2. **Set Up Environment Variables**:
   - Add Sanity credentials to `.env` files
   - Configure Oxygen environment variables

3. **Generate Types**:
   - Set up Sanity schema export
   - Configure automatic type generation

4. **Implement Core Utilities**:
   - Create `app/lib/sanity.ts` with project-specific utilities
   - Add Sanity client to Hydrogen context

5. **Create Content Routes**:
   - Implement page routes using Sanity data
   - Set up navigation and site settings

## Related Documentation

- [Client-Side Rendering Guide](./CLIENT_SIDE_RENDERING.md) - Our React Router v7 data loading patterns
- [Sanity CodeGen Documentation](https://www.sanity.io/docs/sanity-codegen) - Official type generation guide
- [React Router v7 Data Loading](https://reactrouter.com/7.6.0/start/framework/data-loading) - Framework data patterns
- [Hydrogen Caching](https://shopify.dev/docs/api/hydrogen/2025.5/utilities/cache) - Built-in caching strategies

---

**Version Info**: This strategy is designed for React Router v7.6.0, Hydrogen 2025.5.0, and @sanity/client v6+.
