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
- **Quality**: Automated TypeScript checks, ESLint, Prettier, and Husky pre-commit hooks

## Automatic Deployments with Hydrogen and Oxygen

This project uses GitHub Actions to automatically deploy your Hydrogen app each time you push or merge changes.

**Deployment Environment Mapping:**

| Git branch           | Environment | URL                                                                                                                                          |
| -------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`               | Production  | [sn---friends-of-the-family-1f7cae97e15848f44e86.o2.myshopify.dev](https://sn---friends-of-the-family-1f7cae97e15848f44e86.o2.myshopify.dev) |
| (All other branches) | Preview     | `{hash}.myshopify.dev`                                                                                                                       |

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
- Automated quality checks with Husky pre-commit hooks
- Sanity CMS integration with live preview
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

After you've cloned your project, install the dependencies:

```bash
npm install
```

### Environment Variables Setup

**Environment variables are handled automatically by the Shopify CLI!** You don't need to create a `.env` file manually.

#### First-time setup on a new machine:

1. **Link your project to the Hydrogen storefront**:

```bash
npx shopify hydrogen link --storefront "SN - Friends of the Family"
```

2. **Pull environment variables**:

```bash
npx shopify hydrogen env pull
```

3. **Start development server**:

```bash
npm run dev
```

#### Managing Environment Variables

- **View current variables**: `shopify hydrogen env list`
- **Pull latest from Oxygen**: `shopify hydrogen env pull`
- **Push local changes**: `shopify hydrogen env push`
- **Admin Interface**: [Manage in Shopify Admin](https://admin.shopify.com/store/sierra-nevada-brewing/hydrogen/1000045394/settings/environments)

**Important**: The `.env` file is automatically generated and contains secrets. It's excluded from git (`.gitignore`) for security.

#### Available Environment Variables

The following variables are automatically configured:

**Shopify Variables** (Auto-managed):

- `PUBLIC_STORE_DOMAIN` - Your Shopify store domain
- `PUBLIC_STOREFRONT_API_TOKEN` - Storefront API access
- `SESSION_SECRET` - Session encryption key
- Customer Account API configuration

**Sanity CMS Variables** (Server-only secrets):

- `SANITY_API_TOKEN` - API access token for preview mode and authenticated queries
- `SANITY_PREVIEW_SECRET` - Secret for preview mode authentication
- `SANITY_REVALIDATE_SECRET` - Secret for webhook validation
- `SANITY_STUDIO_URL` - Studio development URL (optional, defaults to localhost:3000/studio)

**Important**: The Sanity project ID (`rimuhevv`), dataset (`production`), and API version (`2025-01-01`) are hardcoded in `app/lib/sanity.ts` since they're not sensitive information - project IDs are visible in API URLs and client requests. Only secrets like API tokens are stored as environment variables for security.

[Linking your project](https://shopify.dev/docs/custom-storefronts/hydrogen/cli#link) automatically keeps your local environment variables in sync with Oxygen, allows you to query your store data, and lets you create deployments from the command line at any time. Check the complete [list of Hydrogen CLI](https://shopify.dev/docs/custom-storefronts/hydrogen/cli) for a complete list of features.

## Quality Framework

This project includes a comprehensive quality framework with automated checks:

```bash
npm run quality-check    # Runs TypeScript checks + ESLint
npm run type-check      # TypeScript compilation check
npm run lint            # ESLint with auto-fix
npm run lint:fix        # ESLint with auto-fix
```

### SEO Testing & Validation

Comprehensive SEO testing with 100-point scoring system, available both via command line and embedded Sanity Studio:

#### **Embedded Studio SEO Tool** (Recommended)

1. Start development server: `npm run dev`
2. Navigate to **http://localhost:3000/studio**
3. Use the **"SEO Testing"** tool in Studio sidebar
4. Run real-time tests with visual scorecard and recommendations

#### **Command Line Testing** (Development & CI)

```bash
# Test production site with detailed SEO analysis
npm run seo:test

# Test with verbose output and scoring breakdown
npm run seo:test:verbose

# Test local development server
npm run seo:test:local

# Test OpenGraph integration (development utility)
npx tsx app/test-open-graph.ts
```

**Testing includes:**

- ✅ **Meta Tags & Titles** (25 points): Length, presence, optimization
- ✅ **Open Graph & Social Media** (20 points): Complete social tags
- ✅ **Structured Data** (20 points): JSON-LD presence and validity
- ✅ **Performance & Technical** (15 points): Headers, compression, viewport
- ✅ **Accessibility** (10 points): ARIA, headings, focus management
- ✅ **Members-Only Features** (10 points): Proper noindex, exclusive content

**Technical Implementation:**

- **DOM Parsing**: Uses `ultrahtml` for zero-dependency HTML parsing compatible with SSR environments
- **Fallback Support**: Regex-based parsing when DOM libraries unavailable
- **Studio Integration**: Real-time testing interface at `/studio/seo` API route

**Documentation:**

- 📋 `SEO_ENHANCEMENTS.md` - Complete SEO implementation guide
- ✅ `SEO_TESTING_CHECKLIST.md` - Manual testing checklist
- 🛠️ `CONTENT_SETUP_GUIDE.md` - Content preparation for testing

### Pre-commit Hooks

Husky automatically runs quality checks before each commit:

- ✅ **TypeScript compilation**: Ensures no type errors
- ✅ **ESLint**: Code quality and style consistency
- ✅ **Prettier**: Code formatting (via lint-staged)

**Bypassing Pre-commit Hooks (Use Sparingly)**:

If you need to commit with known TypeScript errors (e.g., during incremental fixes):

```bash
git commit --no-verify -m "your commit message"
```

⚠️ **Important**: Only use `--no-verify` when:

- TypeScript errors are unrelated to your changes
- You're making incremental progress on large refactoring
- Document the remaining errors in your commit message

## Sanity Studio (Content Management)

This project uses Sanity CMS for content management with an **embedded Studio** that runs alongside your Hydrogen app for seamless development.

### Embedded Studio Benefits

- **Single Development Server**: No need to run separate terminals
- **Same Origin**: No CORS issues for API calls between Studio and app
- **Integrated SEO Tool**: Real-time SEO testing directly in Studio
- **Simplified Workflow**: Everything runs with `npm run dev`

### Running the Embedded Studio

**Start the development server** (serves both app and Studio):

```bash
npm run dev
```

**Access points:**

- **Hydrogen app**: http://localhost:3000/
- **Embedded Studio**: http://localhost:3000/studio

### Sanity Studio Access

#### Local Development

- **URL**: http://localhost:3000/studio
- **Authentication**: Sign in with your Sanity account
- **Project**: Sierra Nevada - Friends of the Family
- **Dataset**: `production`

#### Production Studio

- **URL**: https://[your-project-id].sanity.studio/
- **Authentication**: Same Sanity account credentials
- **Live editing**: Changes are immediately available to the live site

### Studio Features

- **Content Editor**: Rich text editing with Portable Text
- **Media Management**: Image uploads with automatic optimization
- **Schema Validation**: Type-safe content structure
- **Preview Mode**: See changes in your Hydrogen app before publishing
- **Version Control**: Content versioning and revision history
- **Vision Tool**: GROQ query testing and debugging

### Content Schema

The Studio uses schema definitions located in `studio/schemaTypes/`:

- **Documents**: Pages, products, announcements
- **Objects**: Reusable content blocks, links, images
- **Singletons**: Site settings, navigation, footer

### Sanity Commands

```bash
# Development (embedded Studio)
npm run dev                 # Start both app and embedded Studio

# Code Generation
npm run sanity:codegen      # Generate TypeScript types from schema
npm run studio:clean        # Clear Studio cache if needed
```

### Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Sanity CMS Developer Guide](./docs/SANITY_DEVELOPER_GUIDE.md)** - Complete integration guide
- **[GitHub Copilot Instructions](./.github/copilot-instructions.md)** - AI assistant configuration

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
