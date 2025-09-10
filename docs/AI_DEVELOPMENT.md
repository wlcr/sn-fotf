# AI-Assisted Development Guide

**Complete workflow for using AI assistants effectively in React Router v7 + Hydrogen + Sanity development.**

## 🚨 Critical Framework Rules

This project uses **React Router v7**, not Remix. Always use correct imports:

```typescript
// ✅ CORRECT - React Router v7
import {
  useLoaderData,
  Link,
  Form,
  useActionData,
  useNavigation,
  redirect,
  json
} from 'react-router';

// ❌ INCORRECT - Never use these
import { ... } from '@remix-run/react';      // Remix (wrong)
import { ... } from 'react-router-dom';      // Also wrong for this project
```

## ⚡ Quick Start Checklist

Before asking AI for code:

- [ ] Run `npm run quality-check` to ensure current code passes
- [ ] Review project context (technology stack, patterns, constraints)
- [ ] Use the [PR Template](./.github/PULL_REQUEST_TEMPLATE.md) as a quality guide
- [ ] Gather existing patterns from codebase

## 🏗️ Project Context for AI

### Technology Stack

- **Framework**: Shopify Hydrogen 2025.5.0
- **Routing**: React Router v7.6.0 ⚠️ **(NOT Remix)**
- **Styling**: CSS Modules + PostCSS + Open Props
- **CMS**: Sanity CMS (not Shopify metafields)
- **Icons**: SVG-Go via vite-plugin-svgr
- **State**: React Query + React hooks
- **Security**: Pre-configured CSP with Klaviyo integration
- **Deployment**: Shopify Oxygen (edge functions)

### Critical Patterns

#### React Router v7 Specifics

- Use `loader` and `clientLoader` functions, not `getServerSideProps`
- Route files use `+types` imports: `import type { Route } from './+types/filename'`
- Components export as default function, not named exports
- File-based routing with `$` for dynamic segments

#### Environment Safety

```typescript
// ✅ CORRECT - Safe environment detection
const isClient = typeof window !== 'undefined';
const projectId =
  env?.SANITY_PROJECT_ID ||
  (isClient ? window.ENV?.SANITY_PROJECT_ID : process.env.SANITY_PROJECT_ID);

// ❌ INCORRECT - Unsafe global access
window.localStorage.setItem(); // Should check availability first
```

#### TypeScript Standards

- Strict mode enabled with no `any` types without justification
- Prefer `type` imports: `import type { Foo } from 'bar'`
- Explicit return types for public functions
- Proper error handling with custom error classes

---

## 🎯 AI Development Workflow

### Phase 1: Pre-Development Planning

#### 1.1 Define Requirements Clearly

```markdown
Instead of: "Add authentication"
Use: "Add JWT-based authentication for React Router v7 routes with:

- Token storage in httpOnly cookies
- Route protection middleware
- Automatic token refresh
- TypeScript interfaces for user data
- Error handling for auth failures"
```

#### 1.2 Gather Project Context

```bash
# Show current project structure
tree -L 3 -I node_modules

# Check existing patterns
grep -r "interface.*{" app/lib/ | head -5
grep -r "export.*function" app/lib/ | head -5

# Verify dependencies
npm list react-router @shopify/hydrogen
```

#### 1.3 Identify Integration Points

- Which existing utilities will this integrate with?
- What naming conventions should be followed?
- Are there performance requirements?
- What are the error handling patterns?

### Phase 2: AI-Assisted Development

#### 2.1 Effective Prompt Template

```markdown
CONTEXT:

- Project: React Router v7 + Hydrogen e-commerce (Shopify)
- TypeScript: Strict mode, no `any` types
- Environment: Browser + Server (Oxygen edge functions)
- Existing: app/lib/sanity.ts has similar patterns

TASK:
Create a type-safe product search utility that:

1. Integrates with Shopify GraphQL API
2. Provides client-side caching with sessionStorage
3. Handles server/client environment differences
4. Includes debouncing for real-time search

REQUIREMENTS:

- TypeScript: Strict interfaces, explicit return types
- Error Handling: Network failures, empty results, invalid queries
- Performance: Debounced requests, cache invalidation
- Documentation: JSDoc with usage examples
- Compatibility: Works in both SSR and client-side contexts

EXISTING PATTERNS:
[paste relevant existing code showing patterns]

OUTPUT: Complete implementation + usage examples + integration guide
```

#### 2.2 Review AI Output Immediately

Before accepting AI output, check:

- [ ] TypeScript interfaces are properly defined
- [ ] No `any` types without justification
- [ ] Error handling covers edge cases
- [ ] Platform detection is safe (no direct global access)
- [ ] Functions have JSDoc documentation
- [ ] Complex patterns have inline comments

#### 2.3 Request Improvements Iteratively

If output isn't perfect, use targeted improvement prompts:

```markdown
IMPROVEMENT NEEDED:
The error handling doesn't cover network timeout scenarios.

CURRENT CODE:
[paste the problematic section]

ENHANCEMENT REQUEST:
Add timeout handling with configurable timeout duration, retry logic for failed requests, and specific error types for different failure scenarios.

CONTEXT:
This will be used in e-commerce product search where reliability is critical.
```

### Phase 3: Quality Validation

#### 3.1 Automated Quality Checks

```bash
# Run all quality checks
npm run quality-check

# Fix auto-fixable issues
npm run lint:fix

# Check types specifically
npm run type-check
```

#### 3.2 Manual Code Review

Use the PR template checklist:

- [ ] AI Prompt Quality - Were prompts specific and context-rich?
- [ ] Code Quality Review - No TypeScript errors, proper imports?
- [ ] AI Output Refinement - Platform assumptions checked?
- [ ] Documentation Standards - Complex patterns explained?
- [ ] Cross-Environment Compatibility - Safe environment detection?

#### 3.3 Integration Testing

```bash
# Test the code in development
npm run dev

# Verify it works in different contexts
# - Server-side rendering
# - Client-side hydration
# - Error scenarios
```

---

## 🏷️ Development Patterns

### Component Template

```typescript
import type { FC, ReactNode } from 'react';
import styles from './ComponentName.module.css';
import clsx from 'clsx';

interface ComponentNameProps {
  className?: string;
  children?: ReactNode;
  variant?: 'primary' | 'secondary';
  isActive?: boolean;
}

export const ComponentName: FC<ComponentNameProps> = ({
  className,
  children,
  variant = 'primary',
  isActive = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        styles.componentName,
        styles[variant],
        isActive && styles.isActive,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

### Route Loader Pattern

```typescript
import type { Route } from './+types/route';

export async function loader({ context }: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  const data = await sanityServerQuery(
    client,
    SANITY_QUERIES.EXAMPLE,
    {},
    {
      cache: context.storefront.CacheLong(),
      displayName: 'Example Query',
    },
  );

  return { data };
}

export default function RouteComponent() {
  const { data } = useLoaderData<typeof loader>();
  return <div>{data.title}</div>;
}
```

### Sanity Integration Pattern

```typescript
import {
  createSanityClient,
  sanityServerQuery,
  getSanityImageUrlWithEnv,
  SANITY_QUERIES,
} from '~/lib/sanity';

// Server-side data loading
export async function loader({context}: Route.LoaderArgs) {
  const client = createSanityClient(context.env);

  try {
    const pageData = await sanityServerQuery(
      client,
      SANITY_QUERIES.PAGE_BY_SLUG,
      {slug: 'example'},
      {
        cache: context.storefront.CacheLong(),
        displayName: 'Page Data',
      },
    );

    if (!pageData) {
      throw new Response('Page not found', {status: 404});
    }

    return {pageData};
  } catch (error) {
    console.error('Failed to load page:', error);
    throw new Response('Page not found', {status: 404});
  }
}
```

### Sanity Image Optimization Pattern

```typescript
import {getSanityImageUrlWithEnv} from '~/lib/sanity';

// ✅ CORRECT - Modern image optimization
const optimizedImageUrl = getSanityImageUrlWithEnv(sanityImage, {
  width: 800,
  height: 600,
  format: 'auto', // Let Sanity choose best format (WebP, JPEG, etc.)
  quality: 85,    // Good balance of quality/file size
  fit: 'crop',    // Or 'max' for logos
});

// ✅ Use in components
<img
  src={optimizedImageUrl}
  alt={sanityImage.alt || 'Image description'}
  width={800}
  height={600}
  loading="lazy"
/>

// ❌ NEVER use legacy urlForImage() - deprecated
// const imageUrl = urlForImage(image)?.width(800).height(600).url();
```

### Image Use Cases & Quality Settings

```typescript
// Thumbnails and small images
getSanityImageUrlWithEnv(image, {
  width: 150,
  height: 150,
  format: 'webp',
  quality: 70,
  fit: 'crop',
  crop: 'focalpoint', // Use image focal point for cropping
});

// Hero images and banners
getSanityImageUrlWithEnv(image, {
  width: 1200,
  height: 600,
  format: 'auto',
  quality: 85,
  fit: 'crop',
});

// Logos (preserve aspect ratio)
getSanityImageUrlWithEnv(logo, {
  width: 200,
  height: 80,
  format: 'auto',
  quality: 85,
  fit: 'max', // Don't crop logos, scale to fit
});

// OpenGraph social images (fixed dimensions)
getSanityImageUrlWithEnv(image, {
  width: 1200,
  height: 630,
  format: 'jpg', // Better social media compatibility
  quality: 85,
  fit: 'crop',
});
```

---

## 🔧 AI Assistant Configuration

### GitHub Copilot Instructions

Key points for AI assistants working on this project:

**Framework Recognition:**

- ✅ React Router v7.6.0 patterns (not Remix or Next.js)
- ✅ Hydrogen 2025.5.0 with Oxygen deployment
- ✅ Custom Sanity integration (not hydrogen-sanity package)

**Type Safety Requirements:**

- ✅ Strict TypeScript with no `any` types without justification
- ✅ Explicit return types for public functions
- ✅ Type imports: `import type { Foo } from 'bar'`

**Environment Safety:**

- ✅ Safe cross-environment variable access patterns
- ✅ Proper server/client environment detection
- ✅ Edge function compatibility for Oxygen deployment

**Common Patterns to Flag:**

- ❌ Using Next.js or Remix patterns instead of React Router v7
- ❌ Direct global access without safety checks
- ❌ Missing TypeScript interfaces or `any` usage
- ❌ Suggesting `hydrogen-sanity` package (known incompatible)

### Warp Terminal Context

This project benefits from AI terminal assistance for:

**Development Commands:**

```bash
npm run dev              # Start development server + embedded Studio
npm run quality-check    # Run TypeScript + ESLint checks
npm run seo:test         # Run comprehensive SEO testing
```

**Environment Management:**

```bash
shopify hydrogen link --storefront "SN - Friends of the Family"
shopify hydrogen env pull  # Download latest environment variables
```

**Code Generation:**

```bash
npm run codegen          # Shopify GraphQL types
npm run sanity:codegen   # Sanity CMS types
```

---

## 📚 Documentation Standards

### Function Documentation

Public functions need JSDoc:

```typescript
/**
 * Create type-safe Sanity client for server-side queries
 *
 * @param env - Environment variables with proper typing
 * @param options - Optional client configuration overrides
 * @returns Configured Sanity client instance
 */
export function createSanityClient(
  env: Env,
  options?: ClientConfig,
): SanityClient {
  // Implementation
}
```

### GROQ Query Comments

Complex GROQ patterns should have explanatory comments:

```groq
// GROQ conditional syntax: _type == "reference" => @->{...}
// IF the item is a reference type, THEN resolve it (@->) and return these fields
_type == "reference" => @->{
  title,
  "url": "/pages/" + slug.current  // Build URL from referenced page's slug
}
```

---

## 🚫 What NOT to Suggest

❌ **Don't suggest these:**

- Remix imports or patterns
- react-router-dom imports
- Modifying CSP configuration (already optimized)
- Custom account page implementations (use Shopify native)
- Shopify metafields for content (use Sanity CMS)
- Disabling TypeScript strict mode
- `hydrogen-sanity` package (known incompatible)
- `urlForImage()` legacy function (deprecated, use `getSanityImageUrlWithEnv()`)
- Importing large images as React components (use Sanity CMS instead)

✅ **Do suggest these:**

- React Router v7 patterns
- CSS Modules + Open Props styling
- Sanity CMS integration with custom client
- Component composition patterns
- TypeScript best practices
- Hydrogen-specific optimizations

---

## 🏆 Success Metrics

Good AI-assisted development should result in:

- ✅ Code passes `npm run quality-check` on first run
- ✅ Proper React Router v7 patterns used
- ✅ Safe environment detection implemented
- ✅ TypeScript strict mode compliance
- ✅ Documentation includes usage examples
- ✅ Error handling covers edge cases
- ✅ Integration works in both SSR and client-side contexts

**Remember**: This is React Router v7 with Hydrogen, not Remix. Always verify patterns match the project's architecture before implementation.

---

**Quick Commands Reference:**

```bash
npm run dev              # Development + Studio
npm run quality-check    # Full validation
npm run seo:test         # SEO testing
npm run codegen          # Type generation
```

_Use this guide as context when working with AI assistants to ensure consistent, high-quality code that matches project patterns._
