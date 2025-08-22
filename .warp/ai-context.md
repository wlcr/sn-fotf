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

## Project Context
This is a **members-only site** for Sierra Nevada Brewing Co. We're migrating proven patterns from a previous Rubato Wines project while adapting for:
- Sierra Nevada branding
- Members-only functionality  
- Sanity CMS integration
- Native Shopify account pages

## Common Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint checking
```

Always check existing code patterns before suggesting new approaches. The CSP configuration is already optimized - don't suggest changes to `app/entry.server.tsx` security settings.
