# SVG Usage Guide

## 🎯 Overview

This guide covers how to properly work with SVG files in this project to ensure optimal bundle sizes and automatic optimization.

## 🏗️ Project Setup

We have an **automated SVGO pipeline** that optimizes all SVG files automatically:

### Automatic Optimization

- **Build-time:** Vite automatically optimizes SVGs imported as React components
- **Pre-commit:** Git hook runs SVG optimization before each commit
- **Manual:** Run optimization scripts manually when needed

### Configuration Files

- **`svgo.config.cjs`** - SVGO configuration for optimization settings
- **`scripts/optimize-svgs.js`** - Automated optimization script
- **`vite.config.ts`** - Vite SVG processing configuration

## 📁 Directory Structure

```
app/
├── assets/
│   ├── icons/          # App-specific SVG icons
│   └── favicon.svg     # Site favicon
│
studio/
└── static/             # Sanity CMS static assets
    ├── sierra-nevada-logo.svg
    └── friends-of-the-family-logo.svg
```

## ✅ Best Practices

### 1. Adding New SVG Files

**For App Icons/Graphics:**

```bash
# Place SVG in the appropriate directory
app/assets/icons/my-icon.svg

# The SVG will be automatically optimized on next commit
```

**For CMS/Studio Assets:**

```bash
# Place in studio static directory
studio/static/my-asset.svg
```

### 2. Using SVGs in React Components

#### ✅ Recommended: Import as React Component

```typescript
// Good: Import SVG as React component (automatically optimized)
import LogoIcon from '../assets/icons/logo.svg?react';

export function MyComponent() {
  return (
    <div>
      <LogoIcon />
    </div>
  );
}
```

#### ✅ Alternative: Import as URL

```typescript
// Good: Import as URL for img src
import logoUrl from '../assets/icons/logo.svg';

export function MyComponent() {
  return (
    <div>
      <img src={logoUrl} alt="Logo" />
    </div>
  );
}
```

#### ❌ Avoid: Large Inline SVG Components

```typescript
// Bad: Large inline SVG (bloats bundle)
export function Logo() {
  return (
    <svg viewBox="0 0 100 100">
      {/* 1000+ lines of SVG paths... */}
    </svg>
  );
}
```

**Instead, create an external SVG file and import it.**

### 3. Converting Inline SVGs to Files

If you have a large inline SVG component:

1. **Extract the SVG content:**

   ```bash
   # Copy the SVG content (without JSX wrapper) to a .svg file
   app/assets/icons/my-large-icon.svg
   ```

2. **Replace the component:**

   ```typescript
   // Before (large inline component)
   export function MyIcon() {
     return (
       <svg>...</svg> // 500+ lines
     );
   }

   // After (small import component)
   import MyIconSvg from '../assets/icons/my-large-icon.svg?react';

   export function MyIcon() {
     return <MyIconSvg />;
   }
   ```

3. **Automatic optimization:**
   The SVG will be automatically optimized on your next commit.

## 🛠️ Manual Commands

### Basic Commands

```bash
# Optimize all SVGs in the project
npm run svg:optimize

# Check all SVG file sizes (sorted by size)
npm run svg:check

# Optimize a single SVG file
npm run svg:optimize:single input.svg output.svg

# Analyze bundle after optimization
npm run bundle:analyze
```

### Advanced Commands

```bash
# Manual SVGO with project config
npx svgo --config=svgo.config.cjs --input=path/to/file.svg

# Batch optimize specific directory
npx svgo --config=svgo.config.cjs --folder=app/assets/icons --recursive
```

## 🔧 Configuration

### SVGO Settings (`svgo.config.cjs`)

Key optimizations enabled:

- ✅ **Cleanup numeric values** (reduce decimal precision)
- ✅ **Remove unused elements** (empty containers, unused namespaces)
- ✅ **Merge paths** (combine multiple paths when possible)
- ✅ **Minify styles** (compress CSS within SVGs)
- ✅ **Convert colors** (optimize color formats)
- ❌ **Keep viewBox** (preserve responsive scaling)
- ❌ **Keep accessibility attributes** (title, desc, aria-\*)

### Vite Integration (`vite.config.ts`)

```typescript
svgr({
  svgrOptions: {
    exportType: 'named',
    ref: true,
    svgo: true, // Enable automatic optimization
    titleProp: true,
    svgoConfig: {
      configFile: './svgo.config.cjs',
    },
  },
  include: '**/*.svg',
});
```

## 📊 Bundle Impact

### Real-World Results

**Logo Component Optimization:**

- **Before:** 205KB inline TSX component (1,326 lines)
- **After:** 98KB optimized SVG file + 115-byte import component
- **Savings:** 51% SVG reduction + 99.94% component reduction
- **Bundle Impact:** 198KB server bundle reduction

**All SVGs Optimized:**

- **Sierra Nevada Logo:** 154KB → 88KB (43% reduction)
- **Friends Logo:** 16KB → 10KB (36% reduction)
- **Favicon:** 690B → 388B (44% reduction)

### Performance Benefits

1. **Smaller server bundle** (better Oxygen deployment)
2. **Faster page loads** (less code to parse)
3. **Better caching** (separate SVG assets can be cached independently)
4. **Improved tree-shaking** (unused SVGs won't be bundled)

## ⚠️ Common Mistakes

### 1. Forgetting the `?react` Suffix

```typescript
// ❌ Wrong: Imports as URL, not React component
import Logo from './logo.svg';

// ✅ Correct: Imports as React component
import Logo from './logo.svg?react';
```

### 2. Skipping Optimization

```typescript
// ❌ Wrong: Using unoptimized SVG
// File: logo.svg (200KB, unoptimized)

// ✅ Correct: Let the pipeline optimize it
// File: logo.svg (98KB, automatically optimized)
```

### 3. Wrong Directory Placement

```bash
# ❌ Wrong: Random placement
public/images/my-icon.svg

# ✅ Correct: Structured placement
app/assets/icons/my-icon.svg
```

## 🚀 Automation Features

### Pre-commit Hook

Every time you commit, the system automatically:

1. **Finds all SVG files** in `app/` and `studio/static/`
2. **Optimizes them** using SVGO with our configuration
3. **Reports savings** and file size reductions
4. **Includes optimized versions** in your commit

### Build-time Optimization

During build, Vite automatically:

1. **Processes SVG imports** using vite-plugin-svgr
2. **Applies SVGO optimization** to imported SVGs
3. **Generates optimized React components**
4. **Enables proper tree-shaking** of unused SVGs

### Continuous Monitoring

Use these commands to monitor SVG usage:

```bash
# Check current SVG sizes
npm run svg:check

# Analyze bundle composition
npm run bundle:analyze

# Find large files in bundle
grep -E "(svg|icon)" dist/server/server-bundle-analyzer.html
```

## 📋 Checklist for New SVGs

When adding a new SVG to the project:

- [ ] **Place in correct directory** (`app/assets/icons/` or `studio/static/`)
- [ ] **Use descriptive filename** (e.g., `user-profile-icon.svg`)
- [ ] **Commit the file** (automatic optimization will run)
- [ ] **Import using `?react` suffix** for React components
- [ ] **Verify optimization** worked by checking file size
- [ ] **Test in development** to ensure it renders correctly

## 🔍 Troubleshooting

### SVG Not Optimizing

1. **Check file size:** Files under 500 bytes are skipped
2. **Check location:** Only `app/` and `studio/static/` are processed
3. **Run manually:** `npm run svg:optimize` to see detailed output

### Import Errors

1. **Missing `?react` suffix:** Add it for React component imports
2. **Wrong path:** Verify the relative path to the SVG file
3. **TypeScript errors:** Ensure SVG types are properly configured

### Build Issues

1. **Large bundle:** Check for inline SVG components that should be files
2. **Missing SVGs:** Verify Vite is processing the SVG imports correctly
3. **SVGO errors:** Check `svgo.config.cjs` for configuration issues

---

**Need help?** Check the [Bundle Optimization Guide](./BUNDLE_OPTIMIZATION.md) for more advanced bundle size techniques.
