# Warp AI Context - SN Friends of the Family

## Project Identity

- **Sierra Nevada - Friends of the Family**: Members-only e-commerce storefront
- **Tech Stack**: Hydrogen + React Router v7 + Sanity CMS + PostCSS + Open Props
- **Security**: Production-ready CSP configuration (don't modify)

## 🚨 Critical Rules

### React Router Imports (NOT Remix!)

```typescript
// ✅ ALWAYS use these
import { useLoaderData, Link, Form } from 'react-router';

// ❌ NEVER use these
import { ... } from '@remix-run/react';
import { ... } from 'react-router-dom';
```

### Styling Pattern

```typescript
// Component styling approach
import styles from './Component.module.css';
import clsx from 'clsx';

// Use CSS Modules + Open Props design tokens
<div className={clsx(styles.component, styles.isActive)} />
```

### Content Management

- **Use**: Sanity CMS for content
- **Avoid**: Shopify metafields

### Embedded Sanity Studio (CRITICAL)

```bash
# ✅ EMBEDDED STUDIO - Single development server
npm run dev             # Starts both app AND embedded Studio
# App: http://localhost:3000/
# Studio: http://localhost:3000/studio

# ✅ Studio maintenance commands
npm run studio:clean    # Clear studio cache only
npm run sanity:codegen  # Generate types from schema

# ❌ NEVER use separate studio commands (deprecated)
# npm run studio:dev     ← NO LONGER EXISTS
# npm run studio:restart ← NO LONGER EXISTS
```

## Project Context

This is a **members-only site** for Sierra Nevada Brewing Co. We're migrating proven patterns from a previous Rubato Wines project while adapting for:

- Sierra Nevada branding
- Members-only functionality
- Sanity CMS integration
- Native Shopify account pages

## Required Development Workflow

### Quality Checks (ALWAYS run before suggesting code)

```bash
npm run quality-check    # TypeScript + ESLint + Sanity codegen (required before PR)
npm run type-check      # TypeScript compilation only
npm run lint:fix        # ESLint with auto-fix
npm run sanity:codegen  # Generate Sanity types from schema
```

### Code Generation (CRITICAL)

```bash
# ✅ ALWAYS use Shopify's built-in codegen for GraphQL types
npm run codegen         # Shopify GraphQL → TypeScript types
npm run sanity:codegen  # Sanity schema → TypeScript types

# ❌ NEVER create custom types for Shopify data manually
```

### Environment Setup (First-time on new machine)

```bash
# Link to Hydrogen storefront
npx shopify hydrogen link --storefront "SN - Friends of the Family"

# Pull environment variables
npx shopify hydrogen env pull

# Start development
npm run dev
```

### Development Server (Embedded Studio)

```bash
npm run dev          # Both Hydrogen app + embedded Studio
# - App: http://localhost:3000/
# - Studio: http://localhost:3000/studio
# - SEO Tool: Available in Studio sidebar
```

### Pre-commit Quality Gates

```bash
# Husky runs these automatically on commit:
# - TypeScript compilation check
# - ESLint validation
# - Prettier formatting

# To bypass (use sparingly):
git commit --no-verify -m "message"  # Only when TypeScript errors are unrelated
```

### SEO Testing (Dual Approach)

```bash
# ✅ Embedded Studio SEO Tool (Recommended for content managers)
# 1. Navigate to http://localhost:3000/studio
# 2. Click "SEO Testing" in Studio sidebar
# 3. Run real-time tests with visual scorecard

# ✅ Command Line SEO Tests (CI/CD & detailed analysis)
npm run seo:test         # Production SEO checks
npm run seo:test:local   # Local development SEO checks
npm run seo:test:verbose # Detailed SEO analysis
```

## 🚑 Critical Patterns

### GraphQL Types

```typescript
// ✅ ALWAYS use generated types from Shopify
import type {ProductQuery} from '~/storefrontapi.generated';

// ❌ NEVER create manual types for Shopify data
interface CustomProduct {
  title: string;
} // Don't do this
```

### Environment Variables

- **Shopify vars**: Auto-managed by `shopify hydrogen env pull`
- **Sanity secrets**: Set in `.env` (server-only)
- **Public configs**: Hardcoded in code (project ID, dataset, etc.)

Always check existing code patterns before suggesting new approaches. The CSP configuration is already optimized - don't suggest changes to `app/entry.server.tsx` security settings.
