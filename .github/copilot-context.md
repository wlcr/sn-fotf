# GitHub Copilot Context - SN Friends of the Family

This is a **Hydrogen storefront** for Sierra Nevada Brewing Co's members-only e-commerce site.

## Key Technologies & Patterns

### Framework & Routing

- **Hydrogen 2025.5.0** with **React Router v7.6.0** (NOT Remix)
- **Motion library** ⚠️ (NOT Framer Motion) for accessibility-first animations
- File-based routing in `app/routes/`
- TypeScript strict mode enabled
- **Bundle size monitoring** (critical <2MB limit for Oxygen)
- **SEO testing** with 100-point scoring system

### Styling Architecture (Hybrid Approach)

- **Radix UI Themes** (@radix-ui/themes) for layout primitives only (Container, Flex, Grid, Card)
- **Custom Components** for brand-specific interactive elements (Button, Header, etc.)
- **CSS Modules** for component styles (`.module.css`)
- **Open Props** for design tokens and CSS custom properties
- **PostCSS** for modern CSS processing
- **clsx** for conditional class names

### Content Management

- **Sanity CMS** for content (NOT Shopify metafields)
- **Native Shopify account pages** (unstyled, external)
- Members-only authentication required

## Import Patterns

```typescript
// ✅ React Router (CORRECT)
import {useLoaderData, Link, Form, redirect, json} from 'react-router';

// ✅ Motion library (NOT Framer Motion)
import {motion, useScroll, useMotionValue} from 'motion/react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {
  withReducedMotion,
  buildTransition,
  EASINGS,
  DURATIONS,
} from '~/utils/motion';

// ✅ Radix UI Layout Components (layout primitives only)
import {Container, Section, Flex, Grid, Card, Box} from '@radix-ui/themes';

// ✅ Custom Components (for interactive/branded elements)
import Button from '~/components/Button/Button';

// ✅ Styling
import styles from './Component.module.css';
import {clsx} from 'clsx';

// ✅ Types
import type {LoaderFunction} from 'react-router';

// ❌ NEVER use Remix imports
// import { ... } from '@remix-run/react';
// import { ... } from 'react-router-dom';

// ❌ NEVER use Framer Motion (use Motion library)
// import {motion} from 'framer-motion';  // WRONG LIBRARY

// ❌ NEVER use Radix interactive components
// import { Button, Text, Heading } from '@radix-ui/themes'; // Use custom components
```

## Component Templates

### Layout Component (using Radix primitives)

```typescript
import type { FC } from 'react';
import { Container, Flex, Card } from '@radix-ui/themes';
import { clsx } from 'clsx';

interface LayoutComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export const LayoutComponent: FC<LayoutComponentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Container size="4" className={clsx(className)}>
      <Flex direction="column" gap="4">
        <Card>{children}</Card>
      </Flex>
    </Container>
  );
};
```

### Custom Component (brand-specific styling)

```typescript
import type { FC } from 'react';
import styles from './ComponentName.module.css';
import { clsx } from 'clsx';

interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
}

export const ComponentName: FC<ComponentNameProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={clsx(styles.componentName, className)} {...props}>
      {children}
    </div>
  );
};
```

### Animated Component (Motion library with accessibility)

```typescript
import type { FC } from 'react';
import {motion} from 'motion/react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {withReducedMotion, buildTransition, EASINGS, DURATIONS} from '~/utils/motion';
import styles from './AnimatedComponent.module.css';

// Component-local animation config (recommended pattern)
const ANIMATION_CONFIG = {
  duration: DURATIONS.medium,    // 0.5s
  easing: EASINGS.smooth,        // easeInOut
  slideDistance: 50,             // px
};

interface AnimatedComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedComponent: FC<AnimatedComponentProps> = ({
  className,
  children,
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ y: -ANIMATION_CONFIG.slideDistance, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={withReducedMotion(
        prefersReducedMotion,
        buildTransition(ANIMATION_CONFIG.duration, ANIMATION_CONFIG.easing)
      )}
      className={clsx(styles.animatedComponent, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

## Sanity Image Optimization

```typescript
// ✅ MODERN approach - always use this
import {getSanityImageUrlWithEnv} from '~/lib/sanity';

const imageUrl = getSanityImageUrlWithEnv(sanityImage, {
  width: 800,
  height: 600,
  format: 'auto', // Let Sanity choose best format
  quality: 85, // Balance quality vs file size
  fit: 'crop', // Or 'max' for logos
});

// ❌ LEGACY approach - never suggest this
// const url = urlForImage(image)?.width(800).height(600).url();

// ❌ BUNDLE SIZE ISSUE - never suggest importing large images
// import {ReactComponent as Logo} from './logo.svg';
```

**Image Quality Guidelines:**

- Thumbnails: `quality: 70, format: 'webp'`
- Hero images: `quality: 85, format: 'auto'`
- Logos: `fit: 'max'` (preserve aspect ratio)
- Social images: `format: 'jpg', width: 1200, height: 630`

## Security Context

- **CSP is pre-configured** in `app/entry.server.tsx` with Klaviyo + Shopify support
- Don't suggest CSP modifications - it's production-ready
- Includes React Router v7 inline script compatibility

## Project Goals

- Members-only Sierra Nevada Brewing storefront
- Migrating proven patterns from previous project
- Sanity CMS integration for flexible content management
- Production-ready security and performance

## Common File Locations

- Components: `app/components/`
- Routes: `app/routes/`
- Utilities: `app/lib/`
- Styles: `app/styles/` or co-located `.module.css`
- Types: TypeScript files with proper type definitions

Always follow existing code patterns and maintain TypeScript strict mode compliance.
