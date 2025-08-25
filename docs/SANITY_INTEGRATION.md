# Sanity Integration Strategy for React Router v7 + Hydrogen

This document outlines our approach for integrating Sanity CMS with our React Router v7 + Hydrogen project.

## Table of Contents

- [Why Not hydrogen-sanity Package](#why-not-hydrogen-sanity-package)
- [Our Recommended Approach](#our-recommended-approach)
- [Integration Strategy](#integration-strategy)
- [Type Generation](#type-generation)
- [Data Loading Patterns](#data-loading-patterns)
- [Implementation Examples](#implementation-examples)
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
export async function loader({ context, params }: LoaderFunctionArgs) {
  const query = `*[_type == "page" && _id == $id][0]`
  const initial = await context.sanity.loadQuery(query, params)
  return json({ initial })
}
```

```tsx
// ✅ Our React Router v7 approach
export async function loader({ params }: Route.LoaderArgs) {
  const page = await sanityServerQuery(client, query, params)
  return { page }
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
Use React Router v7 `loader` functions with Hydrogen caching:

```tsx
// app/routes/pages.$slug.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const page = await sanityServerQuery(
    sanityClient,
    SANITY_QUERIES.PAGE_BY_SLUG,
    { slug: params.slug },
    { cache: CacheLong() } // Hydrogen caching
  );
  return { page };
}
```

### 2. **Client-Side Data Loading**
Use React Router v7 `clientLoader` for browser-side fetching:

```tsx
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const page = await sanityClientQuery(
    sanityClient,
    SANITY_QUERIES.PAGE_BY_SLUG,
    { slug: params.slug },
    { useCache: true } // Client-side caching
  );
  return { page };
}
clientLoader.hydrate = true;
```

### 3. **Combined Server + Client Pattern**
Perfect for personalized content:

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  // Server: Get public content for SEO
  const page = await sanityServerQuery(client, query, params);
  return { page };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  // Client: Add user-specific data
  const [serverData, userPrefs] = await Promise.all([
    serverLoader(),
    getUserPreferences()
  ]);
  
  return {
    ...serverData,
    personalized: true,
    userPreferences: userPrefs
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
import type { Page, SiteSettings } from './sanity.types';

// Type-safe queries
export async function loader({ params }: Route.LoaderArgs) {
  const page = await sanityServerQuery<Page>(
    client,
    SANITY_QUERIES.PAGE_BY_SLUG,
    { slug: params.slug }
  );
  return { page }; // page is fully typed!
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
export async function loader(): Route.LoaderArgs {
  const [page, settings] = await Promise.all([
    sanityServerQuery<Page>(client, QUERIES.ABOUT_PAGE),
    sanityServerQuery<SiteSettings>(client, QUERIES.SITE_SETTINGS)
  ]);
  
  return { page, settings };
}
```

### Pattern 2: Dynamic Content (User-Personalized)
**Use Case**: Member-specific content, personalized recommendations
**Pattern**: Combined server + client loading

```tsx
// app/routes/members.dashboard.tsx
export async function loader(): Route.LoaderArgs {
  // Public member content for SEO
  const memberContent = await sanityServerQuery<MemberContent>(
    client, 
    QUERIES.MEMBER_CONTENT
  );
  return { memberContent };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  // Add personalized data
  const [serverData, userProfile] = await Promise.all([
    serverLoader(),
    getUserProfile() // From localStorage/API
  ]);
  
  return {
    ...serverData,
    userProfile,
    personalizedContent: await sanityClientQuery<PersonalizedContent>(
      client,
      QUERIES.PERSONALIZED_CONTENT,
      { userId: userProfile.id }
    )
  };
}
clientLoader.hydrate = true;
```

### Pattern 3: Real-time Content Updates
**Use Case**: Live member updates, event information
**Pattern**: Client-side with short caching

```tsx
// app/routes/live.updates.tsx
export async function clientLoader(): Route.ClientLoaderArgs {
  const updates = await sanityClientQuery<LiveUpdate[]>(
    client,
    QUERIES.LIVE_UPDATES,
    {},
    { 
      useCache: true,
      cacheKey: 'live-updates' // Custom cache key
    }
  );
  
  return { updates };
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
    
    // Sanity Configuration
    SANITY_PROJECT_ID: string;
    SANITY_DATASET?: string;
    SANITY_API_VERSION?: string;
    SANITY_API_TOKEN?: string;
    SANITY_USE_CDN?: string;
  }
}
```

### Hydrogen Context Integration

```typescript
// app/lib/context.ts - Add to existing createAppLoadContext
import { createSanityClient } from '~/lib/sanity';

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
import type { Route } from './+types/pages.$slug';
import type { Page } from '~/lib/sanity.types'; // Generated types
import { sanityServerQuery, SANITY_QUERIES } from '~/lib/sanity';

export async function loader({ params, context }: Route.LoaderArgs) {
  const page = await sanityServerQuery<Page>(
    context.sanity,
    SANITY_QUERIES.PAGE_BY_SLUG,
    { slug: params.slug },
    { cache: CacheLong() }
  );

  if (!page) {
    throw new Response('Page not found', { status: 404 });
  }

  return { page };
}

export default function PageRoute({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;
  
  return (
    <div>
      <h1>{page.title}</h1>
      {/* Render Portable Text content */}
      <PortableText value={page.content} />
    </div>
  );
}
```

## Best Practices

### 1. **Use Appropriate Caching Strategies**

```tsx
// Static content - cache for a long time
const staticContent = await sanityServerQuery(
  client, 
  query, 
  params, 
  { cache: CacheLong() } // 1 hour default
);

// Dynamic content - shorter cache
const dynamicContent = await sanityServerQuery(
  client, 
  query, 
  params, 
  { cache: CacheShort() } // 30 seconds default
);

// Real-time content - no server cache
const liveContent = await sanityClientQuery(
  client, 
  query, 
  params, 
  { useCache: false }
);
```

### 2. **Handle Errors Gracefully**

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  try {
    const page = await sanityServerQuery<Page>(
      client,
      SANITY_QUERIES.PAGE_BY_SLUG,
      { slug: params.slug }
    );
    
    return { page };
  } catch (error) {
    console.error('Sanity query failed:', error);
    throw new Response('Content unavailable', { status: 503 });
  }
}
```

### 3. **Optimize Image Loading**

```tsx
// Use Sanity's image CDN with optimization
import { getSanityImageUrl } from '~/lib/sanity';

export default function PageHero({ image }: { image: any }) {
  const optimizedUrl = getSanityImageUrl(image, {
    width: 800,
    height: 400,
    format: 'webp',
    quality: 80
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
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  // Only fetch additional data on client, reuse server data
  const serverData = await serverLoader();
  
  // Add client-specific enhancements
  return {
    ...serverData,
    enhanced: true,
    timestamp: new Date().toISOString()
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
