# AI Assistant Guidelines - Sierra Nevada Friends of the Family

## Project Overview

**Sierra Nevada - Friends of the Family** is a members-only e-commerce storefront built with Shopify Hydrogen for Sierra Nevada Brewing Co.

### Technology Stack

- **Framework**: Shopify Hydrogen 2025.5.0
- **Routing**: React Router v7.6.0 ⚠️ **(NOT Remix)**
- **Styling**: CSS Modules + PostCSS + Open Props
- **Animations**: Motion library ⚠️ **(NOT Framer Motion)** with accessibility and SSR support
- **CMS**: Sanity CMS (not Shopify metafields)
- **Icons**: SVG-Go via vite-plugin-svgr
- **State**: React Query + React hooks
- **Security**: Pre-configured CSP with Klaviyo integration

## 🚨 Critical Import Rules

This project uses **React Router v7** (not Remix) and **Motion library** (not Framer Motion). Always use correct imports:

### Animation Library - Motion (NOT Framer Motion)

```typescript
// ✅ CORRECT - Motion library (successor to Framer Motion)
import {motion, useScroll, useMotionValue} from 'motion/react';

// ✅ ALWAYS use accessibility utilities with animations
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {withReducedMotion, buildTransition, EASINGS} from '~/utils/motion';

// ❌ INCORRECT - Never use Framer Motion (legacy library)
import {motion} from 'framer-motion'; // DON'T USE

// ⚠️ IMPORTANT: When prompted about animations, look for Motion library patterns first!
```

### Routing Library - React Router v7 (NOT Remix)

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

## Project Structure

```
app/
├── components/           # Reusable UI components
│   └── *.module.css     # Component-scoped styles
├── lib/                 # Utilities, constants, helpers
├── routes/              # File-based routing (React Router)
├── styles/              # Global styles and CSS setup
└── entry.server.tsx     # Server entry with CSP configuration
```

## Styling Guidelines

### CSS Architecture

```typescript
// Component styling pattern
import styles from './Component.module.css';
import clsx from 'clsx';

// Open Props design tokens available globally
const Component = ({ isActive }: Props) => (
  <div className={clsx(
    styles.component,
    isActive && styles.isActive
  )}>
    Content
  </div>
);
```

### CSS Custom Properties (Open Props)

```css
/* Available design tokens */
.component {
  color: var(--text-1);
  background: var(--surface-1);
  border-radius: var(--radius-2);
  padding: var(--size-3);
  font-size: var(--font-size-1);
}
```

## Motion Animation System

### Accessibility-First Animations

```typescript
// ✅ CORRECT - Always use accessibility hook and utilities
import {motion} from 'motion/react';
import {usePrefersReducedMotion} from '~/hooks/usePrefersReducedMotion';
import {withReducedMotion, buildTransition, EASINGS, DURATIONS} from '~/utils/motion';

// Component-local animation config (recommended pattern)
const COMPONENT_ANIMATION = {
  duration: DURATIONS.medium,  // 0.5s
  easing: EASINGS.smooth,      // easeInOut
  slideDistance: 50,           // px
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

// ❌ INCORRECT - Never ignore accessibility preferences
function BadComponent() {
  return (
    <motion.div
      animate={{ x: 100 }}
      transition={{ duration: 0.5 }} // No reduced motion handling!
    >
      Content
    </motion.div>
  );
}
```

### Animation Best Practices

```typescript
// ✅ Component-local configuration (flexible)
const HEADER_ANIMATION = {
  delay: 800, // ms - wait before appearing
  slideDistance: 100, // px - slide from above viewport
  duration: 0.4, // seconds - smooth timing
  easing: EASINGS.smooth, // Motion easing function
};

// ✅ Use shared constants for consistency
import {DURATIONS, EASINGS} from '~/utils/motion';
const transition = buildTransition(DURATIONS.fast, EASINGS.snappy);

// ✅ Common animation patterns
import {buildSlideVariants, withReducedMotionVariants} from '~/utils/motion';

const slideVariants = withReducedMotionVariants(
  prefersReducedMotion,
  buildSlideVariants(100, 'y'), // Slide from top
);

// ❌ Don't create rigid centralized animation systems
// ❌ Don't use overly long animations (>1s for UI elements)
// ❌ Don't animate too many elements simultaneously
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

## Sanity Image Optimization

### Modern Image Handling

```typescript
// ✅ CORRECT - Modern image optimization
import {getSanityImageUrlWithEnv} from '~/lib/sanity';

const imageUrl = getSanityImageUrlWithEnv(sanityImage, {
  width: 800,
  height: 600,
  format: 'auto', // Let Sanity choose best format (WebP, JPEG, etc.)
  quality: 85,    // Good balance of quality/file size
  fit: 'crop',    // Or 'max' for logos
});

// Use in components
<img
  src={imageUrl}
  alt={sanityImage.alt || 'Image description'}
  width={800}
  height={600}
  loading="lazy"
/>

// ❌ NEVER use legacy urlForImage() - deprecated
// const imageUrl = urlForImage(image)?.width(800).height(600).url();

// ❌ NEVER import large images as React components - causes bundle bloat
// import {ReactComponent as Logo} from './logo.svg'; // Use Sanity instead
```

### Image Quality Guidelines

```typescript
// Thumbnails and small images
getSanityImageUrlWithEnv(image, {
  quality: 70,
  format: 'webp',
  fit: 'crop',
  crop: 'focalpoint',
});

// Hero images and banners
getSanityImageUrlWithEnv(image, {
  quality: 85,
  format: 'auto',
  fit: 'crop',
});

// Logos (preserve aspect ratio)
getSanityImageUrlWithEnv(logo, {
  quality: 85,
  format: 'auto',
  fit: 'max', // Don't crop logos
});

// OpenGraph social images
getSanityImageUrlWithEnv(image, {
  width: 1200,
  height: 630,
  format: 'jpg', // Better social media compatibility
  quality: 85,
  fit: 'crop',
});
```

## Development Patterns

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
import type {LoaderFunction} from 'react-router';
import {json} from 'react-router';

export const loader: LoaderFunction = async ({request, context}) => {
  // Fetch data logic
  return json({
    data: 'example',
  });
};
```

## Security Notes

### Content Security Policy

The project has a **production-ready CSP** configuration in `app/entry.server.tsx`:

- ✅ Klaviyo marketing integration supported
- ✅ Shopify CDN and store assets allowed
- ✅ React Router v7 inline script compatibility
- ✅ Font and media asset support

**Important**: Don't suggest modifying the CSP configuration - it's already optimized and secure.

## Project Context

### Members-Only Site

- Customer authentication via Shopify required
- Member verification for content access
- Private product catalog
- Native Shopify account pages (unstyled, external redirects)

### Migration from Rubato Wines

We're migrating proven patterns from a previous project while adapting for:

- Sierra Nevada Brewing Co. branding
- Members-only functionality
- Sanity CMS instead of metafields
- Enhanced security and performance

## What NOT to Suggest

❌ **Don't suggest these:**

- Remix imports or patterns
- react-router-dom imports
- Animations without accessibility (`usePrefersReducedMotion` hook)
- Rigid centralized animation systems (use component-local configs)
- Framer Motion (use Motion library instead)
- Modifying CSP configuration
- Custom account page implementations
- Shopify metafields for content
- Disabling TypeScript strict mode
- `urlForImage()` legacy function (use `getSanityImageUrlWithEnv()` instead)
- Importing large images as React components (causes bundle bloat)

✅ **Do suggest these:**

- React Router v7 patterns
- CSS Modules + Open Props styling
- Motion animations with accessibility utilities (`usePrefersReducedMotion`, `withReducedMotion`)
- Component-local animation configuration patterns
- Sanity CMS integration
- Component composition patterns
- TypeScript best practices

## Common Commands

```bash
npm run dev          # Development server (usually port 3000)
npm run build        # Production build
npm run preview      # Preview production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint checking
npm run codegen      # Shopify GraphQL codegen
```

## Resources

- [React Router v7 Docs](https://reactrouter.com/7.6.0)
- [Hydrogen Docs](https://shopify.dev/docs/custom-storefronts/hydrogen)
- [Open Props](https://open-props.style/)
- [Sanity CMS Docs](https://www.sanity.io/docs)

---

**Remember**: This is React Router, not Remix. Always check existing code patterns before suggesting new approaches.
