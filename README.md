# SN - Friends of the Family

A **members-only** Hydrogen-powered headless commerce storefront for Sierra Nevada Brewing Co.'s "Friends of the Family" program. Built with Shopify's modern stack including Hydrogen, React Router v7, and Oxygen deployment.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with React Router v7](https://reactrouter.com/7.6.0)

## Technology Stack

- **Framework**: Shopify Hydrogen 2025.5.0
- **Routing**: React Router v7.6.0 ⚠️ **(NOT Remix)**
- **Styling**: CSS Modules + PostCSS + Open Props
- **CMS**: Sanity CMS (not Shopify metafields)
- **Icons**: SVG-Go via vite-plugin-svgr
- **State**: React Query + React hooks
- **Security**: Pre-configured CSP with Klaviyo integration

## Automatic Deployments with Hydrogen and Oxygen

This project uses GitHub Actions to automatically deploy your Hydrogen app each time you push or merge changes.

**Deployment Environment Mapping:**

| Git branch | Environment | URL |
|------------|-------------|-----|
| `main` | Production | [sn---friends-of-the-family-1f7cae97e15848f44e86.o2.myshopify.dev](https://sn---friends-of-the-family-1f7cae97e15848f44e86.o2.myshopify.dev) |
| (All other branches) | Preview | `{hash}.myshopify.dev` |

You can also create your own [custom environments](https://shopify.dev/docs/custom-storefronts/hydrogen/environments#managing-environments) (like "Staging" or "QA") and assign them to your own [custom domains](https://shopify.dev/docs/custom-storefronts/hydrogen/migrate/redirect-traffic#step-1-set-up-the-domains).

## What's included

- Remix
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- PostCSS with preset-env configuration
- Open Props for CSS custom properties
- SVG support with vite-plugin-svgr
- AI assistant configuration files
- Comprehensive CSP security configuration
- Minimal setup of components and routes

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

```bash
npm create @shopify/hydrogen@latest
```

## Building for production

```bash
npm run build
```

## Local development

After you've cloned your project, install the dependencies and run the local development server:

```bash
npm install && npm run dev
```

Link your local development environment to your Shopify store to render your product inventory data:

```bash
npx shopify hydrogen link --storefront "SN - Friends of the Family"
```

[Linking your project](https://shopify.dev/docs/custom-storefronts/hydrogen/cli#link) automatically keeps your local environment variables in sync with Oxygen, allows you to query your store data, and lets you create deployments from the command line at any time. Check the complete [list of Hydrogen CLI](https://shopify.dev/docs/custom-storefronts/hydrogen/cli) for a complete list of features.

## GraphQL & Type Safety

**Important**: Always use Shopify's built-in codegen for GraphQL types instead of creating custom types manually.

```bash
npm run codegen      # Generates TypeScript types from GraphQL schemas
```

This ensures:
- ✅ **Type accuracy**: Types match Shopify's actual GraphQL schema
- ✅ **Auto-updates**: Types stay in sync when Shopify updates their API
- ✅ **IntelliSense**: Full autocompletion for Shopify queries and mutations
- ✅ **Error prevention**: Compile-time checks for invalid field access

Use the generated types in your components:

```typescript
import type { ProductQuery } from '~/storefrontapi.generated';

// ✅ GOOD: Use generated types
export function ProductDetails({ product }: { product: ProductQuery['product'] }) {
  return <div>{product?.title}</div>;
}

// ❌ AVOID: Manual type definitions for Shopify data
interface CustomProduct { title: string; } // Don't do this
```

## Setup for using Customer Account API (`/account` section)

Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>
