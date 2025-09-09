# Troubleshooting Guide

**Common issues and solutions for Sierra Nevada Friends of the Family development.**

## 🚨 Emergency Quick Fixes

### Site Down

1. **Check Oxygen deployment status** in GitHub Actions
2. **Review error logs** in Shopify Admin → Hydrogen app
3. **Verify environment variables** with `shopify hydrogen env list`
4. **Test locally** with `npm run dev` to isolate the issue

### Studio Unavailable

1. **Verify Sanity API connectivity**: http://localhost:3000/studio
2. **Check authentication**: Sign in with your Sanity account
3. **Review environment variables**: `SANITY_API_TOKEN`, `SANITY_PREVIEW_SECRET`
4. **Clear Studio cache**: `npm run studio:clean`

### Deployment Failures

#### "Script startup exceeded CPU time limit"

**Problem:** Server bundle too large for Oxygen edge functions

```bash
# Quick diagnosis
npm run build
ls -lh dist/server/index.js
# If > 2MB, you have a bundle size problem

# Open bundle analyzer to find culprit
open dist/server/server-bundle-analyzer.html
```

**Common Causes:**

- Sanity Studio included in server bundle (~4MB)
- Heavy dependencies not externalized
- Server-side loader in client-only routes

**Quick Fix:**

```bash
# 1. Check studio routes have NO server loaders
# 2. Verify vite.config.ts SSR externals:
grep -A 10 "external:" vite.config.ts

# 3. Should include:
# 'sanity', '@sanity/vision', '@sanity/visual-editing'

# 4. Rebuild and verify size
npm run build
ls -lh dist/server/index.js  # Should be ~1.4MB
```

**See:** [Bundle Optimization Guide](./BUNDLE_OPTIMIZATION.md) for complete solution

---

## 🚀 Pre-Deployment Quality Checks

### Essential Checklist Before Any Deployment

```bash
echo "=== PRE-DEPLOYMENT QUALITY CHECKS ==="

# 1. TypeScript validation
echo "1. TypeScript check:"
npm run typecheck
if [ $? -ne 0 ]; then echo "❌ TypeScript errors - fix before deploying"; exit 1; fi

# 2. Build validation
echo "2. Build check:"
npm run build
if [ $? -ne 0 ]; then echo "❌ Build failed - fix before deploying"; exit 1; fi

# 3. Test suite
echo "3. Running tests:"
npm test
if [ $? -ne 0 ]; then echo "❌ Tests failed - fix before deploying"; exit 1; fi

# 4. Bundle size check
echo "4. Bundle size check:"
BUNDLE_SIZE=$(ls -l dist/server/index.js | awk '{print $5}')
if [ $BUNDLE_SIZE -gt 2097152 ]; then echo "❌ Server bundle too large: $BUNDLE_SIZE bytes (max 2MB)"; exit 1; fi
echo "✅ Server bundle size OK: $BUNDLE_SIZE bytes"

# 5. Studio loading test
echo "5. Studio functionality test:"
echo "   - Start dev server: npm run dev"
echo "   - Open http://localhost:3000/studio"
echo "   - Should load in < 10 seconds with full schema"
echo "   - Check that SEO plugin appears in sidebar"

echo "✅ All quality checks passed - ready for deployment!"
```

### Studio-Specific Checks

```bash
# Verify studio schema loading works
echo "Testing studio schema loading..."
node -e "
  (async () => {
    try {
      const {schemaTypes} = await import('./studio/schemaTypes/index.js');
      console.log('✅ Schema types loaded:', schemaTypes.length, 'types');
      if (schemaTypes.length < 10) throw new Error('Too few schema types');
    } catch (err) {
      console.error('❌ Schema loading failed:', err.message);
      process.exit(1);
    }
  })()"

# Verify no circular dependencies in schema imports
echo "Checking for schema import issues..."
grep -r "import.*schemaTypes" studio/schemaTypes/ && echo "⚠️  Found internal schema imports - check for circular deps" || echo "✅ No internal schema imports found"
```

---

## 🔧 Development Issues

### Environment Setup

#### Environment Variables Not Loading

```bash
# Problem: Variables undefined or missing
# Solution: Pull latest from Oxygen
shopify hydrogen link --storefront "SN - Friends of the Family"
shopify hydrogen env pull

# Verify variables are loaded
shopify hydrogen env list

# Check .env file exists and is properly formatted
cat .env
```

#### TypeScript Errors

```bash
# Problem: Type errors preventing compilation
# Solution: Run quality checks
npm run type-check
npm run quality-check

# Generate updated types
npm run codegen          # Shopify GraphQL types
npm run sanity:codegen   # Sanity CMS types

# Clear TypeScript cache if needed
rm -rf node_modules/.cache
npm install
```

#### Build Failures

```bash
# Problem: Build failing in CI or locally
# Solution: Debug build process
npm run build 2>&1 | tee build.log

# Check for common issues:
# - Missing environment variables
# - TypeScript compilation errors
# - Import path issues
# - Asset loading problems

# Clear all caches and rebuild
rm -rf .hydrogen node_modules/.cache dist
npm install
npm run build
```

### React Router v7 Issues

#### Wrong Imports

```typescript
// ❌ PROBLEM: Using Remix or incorrect imports
import {useLoaderData} from '@remix-run/react';
import {json} from 'react-router-dom';

// ✅ SOLUTION: Use React Router v7 imports
import {useLoaderData, json} from 'react-router';

// ❌ PROBLEM: Using getServerSideProps pattern
export async function getServerSideProps() {}

// ✅ SOLUTION: Use React Router v7 loader pattern
export async function loader({context}: Route.LoaderArgs) {}
```

#### Route Type Issues

```typescript
// ❌ PROBLEM: Missing or incorrect route types
export async function loader({request, context}) {
  // TypeScript errors
}

// ✅ SOLUTION: Import and use proper route types
import type {Route} from './+types/filename';

export async function loader({request, context}: Route.LoaderArgs) {
  // Properly typed
}
```

---

## 🎨 Sanity CMS Issues

### Studio Access Problems

#### Authentication Issues

1. **Clear browser cache and cookies**
2. **Try incognito/private browsing mode**
3. **Verify Sanity account has project access**
4. **Check network connectivity to sanity.io**

### Studio Not Loading

#### Studio Hanging/Infinite Loading (Critical Issue)

**Symptoms:**

- Studio route loads indefinitely at `/studio`
- No error messages in console
- Dev server appears to hang on studio requests
- Browser shows loading spinner forever

**Root Cause:** Complex schema import patterns causing circular dependencies

**Quick Fix:**

```bash
# 1. Stop any hung dev servers
pkill -f "npm run dev"

# 2. Clean ports and cache
# Try graceful termination first
lsof -ti:3000 | xargs kill -TERM 2>/dev/null || true
lsof -ti:3001 | xargs kill -TERM 2>/dev/null || true
# Wait a moment for graceful shutdown
sleep 2
# If processes persist, force kill as last resort
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
rm -rf dist/ .cache/ node_modules/.cache/

# 3. Restart clean
npm run dev

# 4. Test studio loads in < 10 seconds
# Open http://localhost:3000/studio
```

**If Still Hanging:** Check `app/lib/studio-schema.client.ts` uses simple pattern:

```typescript
// ✅ CORRECT - Simple index import
const {schemaTypes} = await import('../../studio/schemaTypes');

// ❌ WRONG - Individual schema imports (causes hanging)
const [{page}, {productPage}] = await Promise.all([
  import('../../studio/schemaTypes/documents/page'),
  import('../../studio/schemaTypes/documents/productPage'),
]);
```

#### General Studio Loading Issues

```bash
# Verify development server is running
npm run dev

# Check console for errors in browser DevTools
# Common issues:
# - CORS errors (should not occur with embedded Studio)
# - JavaScript errors in console
# - Network request failures

# Clear Studio cache
npm run studio:clean
rm -rf node_modules/.sanity
npm install
```

#### Content Not Appearing

1. **Check document is published** (not just saved as draft)
2. **Verify GROQ query syntax** using Studio Vision tool
3. **Check reference relationships** between documents
4. **Review caching** - use short cache or no cache for testing

### GROQ Query Issues

#### Query Syntax Errors

```groq
# ❌ PROBLEM: Incorrect GROQ syntax
*[_type == "product" and slug.current == $slug]

# ✅ SOLUTION: Use proper GROQ syntax
*[_type == "product" && slug.current == $slug]

# ❌ PROBLEM: Missing parameter binding
*[_type == "product" && slug.current == "pale-ale"]

# ✅ SOLUTION: Use parameter binding
*[_type == "product" && slug.current == $slug]
```

#### Empty Query Results

1. **Use Studio Vision tool** to test queries interactively
2. **Check document structure** matches query expectations
3. **Verify parameter values** are passed correctly
4. **Review reference relationships** and use proper resolution

### Type Generation Issues

#### Types Out of Date

```bash
# Problem: TypeScript errors after schema changes
# Solution: Regenerate types
npm run sanity:codegen

# Clear TypeScript server cache
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Verify generated types
cat studio/sanity.types.ts | head -50
```

#### Missing Generated Types

```bash
# Problem: No generated types file
# Solution: Check Sanity configuration
ls -la studio/sanity.types.ts
ls -la sanity-typegen.json

# Regenerate types with verbose output
npm run sanity:codegen -- --debug

# Check schema files are properly structured
find studio/schemaTypes -name "*.ts" | head -10
```

---

## 🔍 SEO Issues

### SEO Tool Not Working

#### Embedded Studio SEO Tool

```bash
# Problem: SEO tool not appearing in Studio
# Solution: Verify development setup
npm run dev
# Navigate to: http://localhost:3000/studio
# Check sidebar for "SEO Testing" tool

# Check console for errors
# Verify API route exists: app/routes/studio.seo.tsx
```

#### Command Line SEO Testing

```bash
# Problem: SEO test scripts failing
# Solution: Debug test execution
npm run seo:test:verbose

# Check specific URL
node scripts/seo-test.js --url=http://localhost:3000/ --verbose

# Common issues:
# - Site not running (start with npm run dev)
# - Network connectivity issues
# - JSDOM parsing errors
# - Missing meta tags or structured data
```

### Meta Tags Missing

#### Tags Not Appearing

1. **Check Sanity content setup** - verify Settings document exists
2. **Review route implementation** - ensure meta function is exported
3. **Test with minimal content** - use fallback/default values
4. **Inspect page source** - check `<head>` section in browser

```typescript
// Debug meta tag generation
export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  console.log('Meta function data:', data); // Debug output

  const tags = generateProductMetaTags(
    data.settings,
    data.productPage,
    data.product,
    data.shopData,
  );

  console.log('Generated meta tags:', tags); // Debug output
  return tags;
};
```

### Social Media Previews

#### Open Graph Issues

1. **Verify image URLs are publicly accessible**
2. **Check image dimensions** (1200x630px optimal)
3. **Use Facebook debugger** to clear cache: https://developers.facebook.com/tools/debug/
4. **Test Twitter cards** at: https://cards-dev.twitter.com/validator

---

## ⚡ Performance Issues

### Slow Loading

#### Development Performance

```bash
# Problem: Development server slow
# Solution: Check for performance bottlenecks

# Monitor bundle size
npm run build -- --analyze

# Check for excessive re-renders
# Use React DevTools Profiler

# Review caching strategies
# Ensure proper cache headers are set
```

#### Image Loading Issues

1. **Verify Sanity image optimization** is configured correctly
2. **Check image URLs** are properly constructed with dimensions
3. **Use WebP format** with appropriate fallbacks
4. **Implement responsive images** for different screen sizes

```typescript
// Debug image URL generation
const imageUrl = urlFor(image)
  .width(800)
  .height(600)
  .quality(85)
  .format('webp')
  .url();

console.log('Generated image URL:', imageUrl);
console.log('Original image data:', image);
```

### Build Performance

```bash
# Problem: Slow build times
# Solution: Optimize build process

# Clear all caches
rm -rf .hydrogen node_modules/.cache dist
npm install

# Use build profiling
npm run build -- --profile

# Check for large dependencies
npm run build -- --analyze
```

---

## 🚀 Deployment Issues

### Oxygen Deployment Failures

#### GitHub Actions Errors

1. **Check Actions tab** in GitHub repository
2. **Review deployment logs** for specific error messages
3. **Verify environment variables** are set in repository secrets
4. **Test deployment locally** with production build

```bash
# Test production build locally
npm run build
npm run preview

# Check for environment-specific issues
# Ensure all required environment variables are available
```

#### Environment Variable Issues

```bash
# Problem: Environment variables missing in production
# Solution: Verify Oxygen configuration

# Check variables in Shopify Admin
# Navigate to: Hydrogen app → Settings → Environments

# Update variables if needed
shopify hydrogen env push

# Verify variables are loaded in deployment
# Check deployment logs for "Environment variables loaded" messages
```

### Preview Environment Issues

#### Preview Links Not Working

1. **Check GitHub Actions** completed successfully
2. **Verify branch is pushed** to GitHub repository
3. **Review preview environment logs** in Oxygen dashboard
4. **Test with different branch name** if needed

---

## 🔐 Security Issues

### CSP Violations

#### Content Security Policy Errors

```typescript
// Problem: CSP blocking scripts or resources
// Note: CSP is pre-configured and optimized - avoid modifying

// Check browser console for CSP violation reports
// Common issues:
// - Inline scripts not using proper nonce
// - External resources not in allowed domains
// - Eval usage in development tools

// If legitimate CSP issue found, document thoroughly before changes
console.log('CSP violation:', event.violatedDirective);
```

#### Authentication Issues

1. **Verify Shopify Customer Account API** configuration
2. **Check redirect URLs** are properly configured
3. **Review session management** and token storage
4. **Test authentication flow** in incognito mode

---

## 📊 Monitoring & Debugging

### Development Debugging

#### Enable Debug Mode

```bash
# Set development environment variables
export DEBUG=hydrogen:*
export NODE_ENV=development

# Run with verbose logging
npm run dev -- --verbose

# Check specific subsystems
export DEBUG=sanity:*  # Sanity queries
export DEBUG=seo:*     # SEO functionality
```

#### Browser DevTools Usage

1. **Console tab**: Check for JavaScript errors and warnings
2. **Network tab**: Monitor API requests and response times
3. **Application tab**: Review localStorage, sessionStorage, cookies
4. **Performance tab**: Profile page loading and rendering

### Production Monitoring

#### Health Checks

```bash
# Check site availability
curl -I https://your-site.myshopify.dev

# Test specific endpoints
curl -I https://your-site.myshopify.dev/robots.txt
curl -I https://your-site.myshopify.dev/sitemap.xml

# Monitor Core Web Vitals
# Use Lighthouse or PageSpeed Insights
```

---

## 📞 Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide** thoroughly
2. **Review error messages** carefully for specific details
3. **Test in incognito/private mode** to rule out browser issues
4. **Try local development** to isolate deployment issues
5. **Document reproduction steps** with specific error messages

### Information to Include

When reporting issues, include:

- **Specific error messages** (full text, screenshots)
- **Steps to reproduce** the issue
- **Environment details** (local/preview/production)
- **Browser and version** (if relevant)
- **Recent changes** that might be related
- **Debug output** from console or logs

### Escalation Path

1. **Check documentation** (this guide and others in `/docs`)
2. **Review existing issues** in GitHub repository
3. **Search Shopify Hydrogen docs** for framework-specific issues
4. **Check Sanity documentation** for CMS-related problems
5. **Create detailed issue report** with reproduction steps

---

**Emergency Commands:**

```bash
npm run dev              # Start development server
npm run quality-check    # Check code quality
shopify hydrogen env pull # Update environment variables
npm run sanity:codegen   # Regenerate CMS types
npm run seo:test:local   # Test SEO implementation
```

_Most issues can be resolved by following the steps in this guide. When in doubt, start with the basics: ensure the development server is running, environment variables are loaded, and check the browser console for specific error messages._
