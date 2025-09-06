# Bundle Optimization Guide for Oxygen Deployment

## 🚨 Critical Issue: Bundle Size Limits

Shopify Oxygen edge functions have **strict CPU and memory limits** for startup time. Large server bundles cause deployment failures with:

```
Error: Script startup exceeded CPU time limit.
```

## 📊 Target Bundle Sizes

- **Server bundle**: < 2MB (ideally < 1.5MB)
- **Client chunks**: < 1MB each (large chunks can lazy load)
- **Total client bundle**: No hard limit (lazy loaded)

## 🔍 Diagnosing Bundle Size Issues

### 1. Check Current Bundle Sizes

```bash
npm run build
```

Look for the build output:

- `dist/server/index.js` - **This is the critical one for Oxygen**
- `dist/client/assets/` - Client chunks (less critical)

### 2. Analyze Server Bundle

The build automatically generates a bundle analyzer:

- `dist/server/server-bundle-analyzer.html`
- `dist/server/metafile.server.json`

Open the HTML file to see what's consuming server bundle space.

### 3. Common Culprits

**Heavy Dependencies Often Found in Server Bundle:**

- `sanity` (entire Studio) - **~200KB**
- `@sanity/vision` - **~139KB**
- `@sanity/visual-editing` - **~100KB+**
- `framer-motion` / `motion` - **~100KB+**
- `@radix-ui` components - **~50KB+**
- Large SVG icons/logos - **~200KB+**

## 🛠️ Solution Strategies

### 1. Externalize from SSR Bundle

**In `vite.config.ts`:**

```typescript
export default defineConfig({
  ssr: {
    // Exclude heavy dependencies from server bundle
    external: [
      'sanity', // Sanity Studio
      '@sanity/vision', // Studio plugins
      '@sanity/visual-editing', // Visual editing
      '@sanity/react-loader', // Studio components
      'framer-motion', // Animation library
      'motion', // Motion library
      '@radix-ui/themes', // UI components (if not used server-side)
    ],
    noExternal: [
      // Keep these in server bundle (small/necessary)
      '@sanity/client', // Small client library
      '@sanity/image-url', // Image URL helper
      'ultrahtml', // HTML parser
    ],
  },
});
```

### 2. Make Routes Client-Only

**For Studio routes** (`studio.$.tsx`, `studio.seo.tsx`):

```typescript
// ❌ WRONG - Causes server-side inclusion
export async function loader({request}: LoaderFunctionArgs) {
  return null;
}

// ✅ CORRECT - No server-side loader
// This route is client-only to avoid including Sanity Studio in server bundle

export default function StudioPage() {
  // Client-side dynamic imports only
  useEffect(() => {
    async function loadStudio() {
      const [{Studio}, config] = await Promise.all([
        import('sanity'), // Client-only import
        import('../../studio/sanity.config'),
      ]);
      // ...
    }
    loadStudio();
  }, []);
}
```

### 3. Dynamic Imports for Heavy Components

```typescript
// ❌ WRONG - Static import includes in server bundle
import {Studio} from 'sanity';

// ✅ CORRECT - Dynamic import (client-only)
const [{Studio}] = await Promise.all([import('sanity')]);
```

### 4. Conditional Client-Side Loading

```typescript
// Only load heavy dependencies on client
if (typeof window !== 'undefined') {
  const {heavyLibrary} = await import('heavy-library');
}
```

## 📝 Sanity Studio Specific Guidelines

### Critical Rule: Studio Must Be Client-Only

**Why:** Sanity Studio is a massive bundle (~4MB+) designed for browser environments. Including it in the server bundle will exceed Oxygen limits.

### Studio Route Pattern

```typescript
// app/routes/studio.$.tsx - CORRECT PATTERN

import { useEffect, useState } from 'react';

// ✅ NO server-side loader function
// This ensures Studio stays client-only

export default function StudioPage() {
  const [Studio, setStudio] = useState(null);

  useEffect(() => {
    // ✅ Client-side dynamic import only
    async function loadStudio() {
      try {
        const [{ Studio: StudioComponent }, config] = await Promise.all([
          import('sanity'),                    // ~4MB - client only!
          import('../../studio/sanity.config'),
        ]);
        setStudio(() => StudioComponent);
      } catch (error) {
        console.error('Studio loading failed:', error);
      }
    }

    loadStudio();
  }, []);

  // Loading state while Studio loads
  if (!Studio) {
    return <div>Loading Sanity Studio...</div>;
  }

  return <Studio config={config} />;
}
```

### SEO Testing Route Pattern

```typescript
// app/routes/studio.seo.tsx - API route pattern

// ✅ This is OK - server action for API functionality
export async function action({request, context}: ActionFunctionArgs) {
  // Server-side SEO testing logic
  // Keep dependencies minimal and light
}

// ✅ NO default component export
// This prevents client-side bundle inclusion
```

## 🚀 Deployment Verification

### 1. Local Build Test

```bash
npm run build

# Check server bundle size
ls -lh dist/server/index.js

# Should show < 2MB, ideally ~1.4MB
```

### 2. Bundle Analysis

```bash
# Open the analyzer
open dist/server/server-bundle-analyzer.html

# Look for unexpected large dependencies in server bundle
```

### 3. Deployment Test

```bash
# Deploy to staging/preview
npm run build
# Push to trigger GitHub Action

# Monitor for "Script startup exceeded CPU time limit"
```

## 🐛 Common Mistakes

### 1. Accidental Server-Side Import

```typescript
// ❌ WRONG - Static import at module level
import {Studio} from 'sanity';

export default function SomePage() {
  // Even if never used, this includes sanity in server bundle!
}
```

### 2. Server-Side Route Loader

```typescript
// ❌ WRONG - Server-side loader forces server bundle inclusion
export async function loader() {
  return null; // Even empty loader causes inclusion!
}
```

### 3. Shared Component Usage

```typescript
// ❌ WRONG - Shared component that imports heavy library
import { HeavyComponent } from 'heavy-library';

export function MyComponent() {
  return <HeavyComponent />;
}

// If MyComponent is used in server-rendered routes,
// heavy-library gets included in server bundle
```

## ✅ Bundle Optimization Checklist

### Before Adding New Dependencies

- [ ] Check dependency size: `npm ls --depth=0`
- [ ] Consider if needed server-side or client-only
- [ ] Use dynamic imports for large client-only libraries
- [ ] Test build size impact: `npm run build`

### For Studio/CMS Features

- [ ] Studio routes have NO server loaders
- [ ] All Sanity imports are dynamic (client-side only)
- [ ] Studio dependencies externalized in `vite.config.ts`
- [ ] Build output confirms server bundle < 2MB

### Deployment Ready

- [ ] Production build completes successfully
- [ ] Server bundle analyzer shows expected dependencies
- [ ] Bundle sizes within Oxygen limits
- [ ] Test deployment succeeds without CPU timeout

## 🔧 Emergency Bundle Size Fix

If deployment suddenly fails with bundle size issues:

### 1. Quick Diagnosis

```bash
npm run build
ls -lh dist/server/index.js

# If > 2MB, open bundle analyzer:
open dist/server/server-bundle-analyzer.html
```

### 2. Find the Culprit

Look for unexpected large dependencies in the analyzer. Common culprits:

- New static imports of heavy libraries
- Server loaders in client-only routes
- Accidentally importing Studio components in server-rendered pages

### 3. Quick Fix

```bash
# Add problematic dependency to SSR externals
# Edit vite.config.ts:
ssr: {
  external: [
    // ... existing externals
    'problematic-dependency-name'
  ]
}

# Rebuild and test
npm run build
```

### 4. Verify Fix

```bash
ls -lh dist/server/index.js
# Should be back under 2MB

git add .
git commit -m "fix: externalize [dependency] from server bundle"
git push
```

## 📚 Related Documentation

- [Sanity Studio Integration](./SANITY_GUIDE.md#embedded-studio)
- [Troubleshooting Deployment Issues](./TROUBLESHOOTING.md#deployment-failures)
- [Vite Configuration](../vite.config.ts)

---

**Remember:** When in doubt, keep heavy dependencies client-side only! Oxygen edge functions are optimized for small, fast server bundles.
