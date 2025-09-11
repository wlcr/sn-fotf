# Sierra Nevada Friends of the Family - Cursor AI Rules

## Project Overview

**Members-only Hydrogen storefront** for Sierra Nevada Brewing Co. Built with modern web technologies and accessibility-first principles.

### Technology Stack

- **Framework**: Shopify Hydrogen 2025.5.0
- **Routing**: React Router v7.6.0 ⚠️ (NOT Remix)
- **Animations**: Motion library ⚠️ (NOT Framer Motion) with accessibility and SSR support
- **Styling**: CSS Modules + PostCSS + Open Props + Radix UI Themes (layout only)
- **CMS**: Sanity CMS (not Shopify metafields)
- **Icons**: SVG-Go via vite-plugin-svgr
- **State**: React Query + React hooks
- **Security**: Pre-configured CSP with Klaviyo integration
- **Quality**: Automated TypeScript checks, ESLint, Prettier, Husky pre-commit hooks

## 🚨 Critical Rules - Always Follow These

### 1. Animation Library - Motion (NOT Framer Motion)

```typescript
// ✅ CORRECT - Motion library (successor to Framer Motion)
import {motion, useScroll, useMotionValue} from 'motion/react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {
  withReducedMotion,
  buildTransition,
  EASINGS,
  DURATIONS,
} from '~/utils/motion';

// ❌ NEVER use Framer Motion (legacy library)
import {motion} from 'framer-motion'; // DON'T USE

// ⚠️ IMPORTANT: When prompted about animations, look for Motion library patterns first!
// Check ~/utils/motion and ~/hooks/usePrefersReducedMotion before creating new patterns
```

### 2. React Router v7 (NOT Remix)

```typescript
// ✅ CORRECT - React Router v7
import {useLoaderData, Link, Form, redirect, json} from 'react-router';

// ❌ NEVER use these
import { ... } from '@remix-run/react';      // Remix (wrong)
import { ... } from 'react-router-dom';      // Also wrong for this project
```

### 3. Hybrid Styling (Radix + Custom Components)

```typescript
// ✅ Use Radix UI for LAYOUT components only
import {Container, Section, Flex, Grid, Card} from '@radix-ui/themes';

// ✅ Custom components for brand-specific UI elements
import Button from '~/components/Button/Button';

// ❌ Don't use Radix UI interactive components
import {Button, Text, Heading} from '@radix-ui/themes'; // Use custom instead
```

### 4. Sanity Image Optimization

```typescript
// ✅ MODERN approach - always use this
import {getSanityImageUrlWithEnv} from '~/lib/sanity';

const imageUrl = getSanityImageUrlWithEnv(sanityImage, {
  width: 800,
  height: 600,
  format: 'auto',
  quality: 85,
  fit: 'crop',
});

// ❌ LEGACY approach - deprecated, don't suggest
// const url = urlForImage(image)?.width(800).height(600).url();
```

## Animation System - Motion Library

### Component-Local Animation Config (Recommended Pattern)

```typescript
// At the top of your component file
const COMPONENT_ANIMATION = {
  duration: DURATIONS.medium,    // 0.5s
  easing: EASINGS.smooth,        // easeInOut
  slideDistance: 50,             // px
  delay: 200,                    // ms
};

function MyComponent() {
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
```

### Available Animation Constants

```typescript
// Durations
DURATIONS.instant; // 0s
DURATIONS.quick; // 0.2s
DURATIONS.fast; // 0.3s
DURATIONS.medium; // 0.5s
DURATIONS.slow; // 0.8s

// Easing Functions (Motion library)
EASINGS.smooth; // easeInOut - natural, balanced
EASINGS.snappy; // easeOut - quick start, slow end
EASINGS.bouncy; // easeOut - energetic feel
```

## Development Patterns

### Component Template

```typescript
import type { FC, ReactNode } from 'react';
import {motion} from 'motion/react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {withReducedMotion, buildTransition, EASINGS} from '~/utils/motion';
import styles from './ComponentName.module.css';
import { clsx } from 'clsx';

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
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={withReducedMotion(prefersReducedMotion, buildTransition(0.3, EASINGS.smooth))}
      className={clsx(
        styles.componentName,
        styles[variant],
        isActive && styles.isActive,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

### Route Loader Pattern

```typescript
import type {LoaderFunction} from 'react-router';
import {json} from 'react-router';

export const loader: LoaderFunction = async ({request, context}) => {
  // Fetch data logic
  return json({
    data: 'example',
  });
};
```

## What NOT to Suggest

❌ **Don't suggest these:**

- Framer Motion imports or patterns (use Motion library)
- Remix imports or patterns
- react-router-dom imports
- Animations without accessibility (`usePrefersReducedMotion` hook)
- Rigid centralized animation systems (use component-local configs)
- Modifying CSP configuration
- Custom account page implementations
- Shopify metafields for content
- Disabling TypeScript strict mode
- `urlForImage()` legacy function (use `getSanityImageUrlWithEnv()`)
- Importing large images as React components (causes bundle bloat)

✅ **Do suggest these:**

- Motion library animations with accessibility utilities
- Component-local animation configuration patterns
- React Router v7 patterns
- CSS Modules + Open Props styling
- Sanity CMS integration
- Component composition patterns
- TypeScript best practices

## Project Context

### Members-Only Site Features

- Customer authentication via Shopify required
- Member verification for content access
- Private product catalog
- Native Shopify account pages (unstyled, external redirects)

### Bundle Size Critical

- **Must stay under 2MB** for Oxygen deployment
- Monitor with `npm run bundle:check`
- Use bundle analyzer: `dist/server/server-bundle-analyzer.html`

### SEO Testing

- Comprehensive 100-point scoring system
- Embedded Studio tool: http://localhost:3000/studio
- Command line: `npm run seo:test`

## File Structure

```
app/
├── components/           # Reusable UI components
├── lib/                 # Utilities, constants, helpers
├── routes/              # File-based routing (React Router)
├── styles/              # Global styles and CSS setup
├── hooks/               # Custom React hooks
└── utils/               # Utility functions (including motion.ts)

docs/
├── ANIMATIONS.md        # Complete animation system guide
├── SEO_GUIDE.md         # SEO implementation details
└── ...                  # Other project documentation
```

## Common Commands

```bash
npm run dev              # Development server (app + embedded Studio)
npm run build            # Production build
npm run quality-check    # TypeScript + ESLint + Sanity codegen
npm run bundle:check     # Check bundle size (critical <2MB)
npm run seo:test         # SEO testing with 100-point scoring
npm run codegen          # Shopify GraphQL codegen
npm run sanity:codegen   # Sanity schema → TypeScript types
```

## Resources

- [Motion Library Docs](https://motion.dev/docs)
- [React Router v7 Docs](https://reactrouter.com/7.6.0)
- [Project Animation Guide](./docs/ANIMATIONS.md)
- [Hydrogen Docs](https://shopify.dev/custom-storefronts/hydrogen)
- [Open Props](https://open-props.style/)
- [Sanity CMS Docs](https://www.sanity.io/docs)

---

**Remember**: This project uses Motion library (not Framer Motion) and React Router v7 (not Remix). Always check existing patterns in `~/utils/motion` before creating new animations!
