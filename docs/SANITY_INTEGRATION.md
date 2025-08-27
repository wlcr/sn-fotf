# Sanity Integration Strategy for React Router v7 + Hydrogen

This document outlines our approach for integrating Sanity CMS with our React Router v7 + Hydrogen project.

## Table of Contents

- [Why Not hydrogen-sanity Package](#why-not-hydrogen-sanity-package)
- [Our Recommended Approach](#our-recommended-approach)
- [Integration Strategy](#integration-strategy)
- [Type Generation](#type-generation)
- [Data Loading Patterns](#data-loading-patterns)
- [Implementation Examples](#implementation-examples)
- [Caching Strategy](#caching-strategy)
- [Best Practices](#best-practices)

## Why Not `hydrogen-sanity` Package?

The official [`hydrogen-sanity`](https://github.com/sanity-io/hydrogen-sanity/) package has several compatibility issues with our React Router v7 setup:

### ❌ Compatibility Issues:

1. **Outdated Architecture**: Designed for Remix-based Hydrogen (pre-React Router v7)
2. **Wrong Loader Pattern**: Uses `LoaderFunctionArgs` instead of React Router v7's `Route.LoaderArgs`
3. **Context Mismatch**: Assumes Remix context structure, not React Router v7
4. **Version Gap**: Examples show Hydrogen 2024.7.9, we're on 2025.5.0
5. **Framework Lock-in**: Tightly coupled to old Hydrogen patterns

### Example of Incompatible Code:

```tsx
// ❌ hydrogen-sanity approach (doesn't work with React Router v7)
// Note: Uses old LoaderFunctionArgs type instead of Route.LoaderArgs
export async function loader({context, params}: LoaderFunctionArgs) {
  const query = `*[_type == "page" && _id == $id][0]`;
  const initial = await context.sanity.loadQuery(query, params);
  return json({initial});
}
```

```tsx
// ✅ Our React Router v7 approach
export async function loader({params}: Route.LoaderArgs) {
  const page = await sanityServerQuery(client, query, params);
  return {page};
}
```

## Our Recommended Approach

### ✅ Use `@sanity/client` + Custom Utilities

**Benefits:**

1. **Framework Agnostic**: Works with any React setup
2. **Full Control**: Complete control over caching and data loading
3. **React Router v7 Compatible**: Integrates perfectly with our data loading patterns
4. **Future-Proof**: Won't break when Hydrogen updates
5. **Hydrogen Caching**: Can leverage Hydrogen's built-in caching strategies
6. **Type Safety**: Full TypeScript support with Sanity's type generation

## Integration Strategy

### 1. **Server-Side Data Loading**

Use React Router v7 `loader` functions with Sanity's built-in CDN caching:

```tsx
// app/routes/pages.$slug.tsx
export async function loader({params, context}: Route.LoaderArgs) {
  const page = await sanityServerQuery(
    context.sanity, // Sanity client from Hydrogen context
    SANITY_QUERIES.PAGE_BY_SLUG,
    {slug: params.slug},
    {displayName: 'Page by slug'}, // For debugging
  );
  return {page};
}
```

### 2. **Client-Side Data Loading**

Use React Router v7 `clientLoader` for browser-side fetching:

```tsx
export async function clientLoader({params}: Route.ClientLoaderArgs) {
  const page = await sanityClientQuery(
    sanityClient,
    SANITY_QUERIES.PAGE_BY_SLUG,
    {slug: params.slug},
    {useCache: true}, // Client-side caching
  );
  return {page};
}
clientLoader.hydrate = true;
```

### 3. **Combined Server + Client Pattern**

Perfect for personalized content:

```tsx
export async function loader({params, context}: Route.LoaderArgs) {
  // Server: Get public content for SEO with CDN caching
  const page = await sanityServerQuery(context.sanity, query, params, {
    displayName: 'Page content',
  });
  return {page};
}

export async function clientLoader({serverLoader}: Route.ClientLoaderArgs) {
  // Client: Add user-specific data
  const [serverData, userPrefs] = await Promise.all([
    serverLoader(),
    getUserPreferences(),
  ]);

  return {
    ...serverData,
    personalized: true,
    userPreferences: userPrefs,
  };
}
```

## Type Generation

### Sanity TypeGen Integration

Yes! Sanity has excellent type generation tools. We'll use [`@sanity/codegen`](https://www.sanity.io/docs/sanity-codegen) to automatically generate TypeScript types from our Sanity schema.

#### Setup Process:

1. **Install Sanity CodeGen**:

```bash
npm install @sanity/codegen --save-dev
```

2. **Configure Type Generation** in `package.json`:

```json
{
  "scripts": {
    "sanity:codegen": "sanity schema extract --path=./sanity-schema.json && sanity typegen generate"
  }
}
```

3. **Use Generated Types**:

```tsx
// Generated types from Sanity schema
import type {Page, SiteSettings} from './sanity.types';

// Type-safe queries
export async function loader({params, context}: Route.LoaderArgs) {
  const page = await sanityServerQuery<Page>(
    context.sanity,
    SANITY_QUERIES.PAGE_BY_SLUG,
    {slug: params.slug},
    {displayName: 'Typed page query'},
  );
  return {page}; // page is fully typed!
}
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
