# Warp AI Context - SN Friends of the Family

## Project Identity

- **Sierra Nevada - Friends of the Family**: Members-only e-commerce storefront
- **Tech Stack**: Hydrogen + React Router v7 + **Motion library** (NOT Framer Motion) + Sanity CMS + Radix UI Themes (layout) + Open Props + PostCSS
- **Security**: Production-ready CSP configuration (don't modify)

## 🚨 Critical Rules

### Motion Library Imports (NOT Framer Motion!)

```typescript
// ✅ ALWAYS use Motion library (successor to Framer Motion)
import {motion, useScroll, useMotionValue} from 'motion/react';

// ✅ ALWAYS use accessibility utilities
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {withReducedMotion, buildTransition, EASINGS} from '~/utils/motion';

// ❌ NEVER use Framer Motion (legacy library)
import {motion} from 'framer-motion'; // DON'T USE

// ❌ NEVER suggest Framer Motion patterns
// When prompted about animations, look for Motion library patterns first!
```

### React Router Imports (NOT Remix!)

```typescript
// ✅ ALWAYS use these
import { useLoaderData, Link, Form } from 'react-router';

// ❌ NEVER use these
import { ... } from '@remix-run/react';
import { ... } from 'react-router-dom';
```

### Hybrid Styling Pattern (Radix Layout + Custom Components)

```typescript
// ✅ Use Radix UI for LAYOUT components only
import { Container, Section, Flex, Grid, Card } from '@radix-ui/themes';

// Layout with Radix primitives
<Container size="4">
  <Section>
    <Flex direction="column" gap="4">
      <Card variant="surface">
        Content here
      </Card>
    </Flex>
  </Section>
</Container>

// ✅ Custom components for brand-specific UI elements
import Button from '~/components/Button/Button';
import styles from './Component.module.css';
import { clsx } from 'clsx';

// Use custom Button component (not Radix Button)
<Button appearance="dark" variant="solid" label="Click me" />

// CSS Modules + Open Props for styling
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

## 🔥 Critical Patterns

### Motion Animation Patterns (NOT Framer Motion!)

```typescript
// ✅ ALWAYS check existing Motion patterns first!
// Look in: ~/utils/motion, ~/hooks/usePrefersReducedMotion

// Component-local animation config (recommended)
const COMPONENT_ANIMATION = {
  duration: DURATIONS.medium,    // 0.5s
  easing: EASINGS.smooth,        // easeInOut
  slideDistance: 50,             // px
  delay: 200,                    // ms
};

function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ y: -COMPONENT_ANIMATION.slideDistance, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={withReducedMotion(
        prefersReducedMotion,
        buildTransition(COMPONENT_ANIMATION.duration, COMPONENT_ANIMATION.easing)
      )}
    >
      Content
    </motion.div>
  );
}

// ❌ NEVER suggest Framer Motion imports
// import {motion} from 'framer-motion';  // DON'T USE

// ❌ NEVER ignore accessibility
// <motion.div animate={{x: 100}} />  // Missing reduced motion handling!
```

### Component Patterns (Hybrid Approach)

```typescript
// ✅ Radix UI for LAYOUT and STRUCTURE only
import { Container, Section, Flex, Grid, Card, Box } from '@radix-ui/themes';

// ✅ Custom components for interactive/branded elements
import Button from '~/components/Button/Button';
import Header from '~/components/Header/Header';

// ✅ Layout structure with Radix
<Container size="4">
  <Flex direction="column" gap="4">
    <Card>Custom content</Card>
  </Flex>
</Container>

// ✅ Brand-specific components (don't use Radix Button, Text, etc.)
<Button appearance="dark" variant="solid" label="Custom Button" />

// ✅ CSS Modules + Open Props for custom styling
import styles from './CustomComponent.module.css';
<div className={styles.customLayout} />

// ❌ Don't use Radix UI interactive components (Button, Input, etc.)
// ❌ Don't use Radix Text, Heading - we have custom typography
```

### GraphQL Types

```typescript
// ✅ ALWAYS use generated types from Shopify
import type {ProductQuery} from '~/storefrontapi.generated';

// ❌ NEVER create manual types for Shopify data
interface CustomProduct {
  title: string;
} // Don't do this
```

### Sanity Image Optimization

```typescript
// ✅ MODERN approach - use getSanityImageUrlWithEnv()
import {getSanityImageUrlWithEnv} from '~/lib/sanity';

const imageUrl = getSanityImageUrlWithEnv(sanityImage, {
  width: 800,
  height: 600,
  format: 'auto',
  quality: 85,
  fit: 'crop',
});

// ✅ Different use cases
// Thumbnails: quality: 70, format: 'webp'
// Logos: fit: 'max' (preserve aspect ratio)
// Social images: format: 'jpg', width: 1200, height: 630

// ❌ LEGACY approach - deprecated, don't use
// const imageUrl = urlForImage(image)?.width(800).height(600).url();

// ❌ BUNDLE SIZE ISSUE - never import large images as React components
// import {ReactComponent as Logo} from './logo.svg'; // Use Sanity instead
```

### Environment Variables

- **Shopify vars**: Auto-managed by `shopify hydrogen env pull`
- **Sanity secrets**: Set in `.env` (server-only)
- **Public configs**: Hardcoded in code (project ID, dataset, etc.)

Always check existing code patterns before suggesting new approaches. The CSP configuration is already optimized - don't suggest changes to `app/entry.server.tsx` security settings.
