# GitHub Copilot Context - SN Friends of the Family

This is a **Hydrogen storefront** for Sierra Nevada Brewing Co's members-only e-commerce site.

## Key Technologies & Patterns

### Framework & Routing
- **Hydrogen 2025.5.0** with **React Router v7.6.0** (NOT Remix)
- File-based routing in `app/routes/`
- TypeScript strict mode enabled

### Styling Architecture  
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
import { useLoaderData, Link, Form, redirect, json } from 'react-router';

// ✅ Styling
import styles from './Component.module.css';
import clsx from 'clsx';

// ✅ Utilities
import { clsx } from 'clsx';
import type { LoaderFunction } from 'react-router';

// ❌ NEVER use Remix imports
// import { ... } from '@remix-run/react';
// import { ... } from 'react-router-dom';
```

## Component Template

```typescript
import type { FC } from 'react';
import styles from './ComponentName.module.css';
import clsx from 'clsx';

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
