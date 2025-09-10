# Sanity Image Utilities Guide

## Overview

This project has consolidated image handling utilities to avoid duplication and provide clear, consistent patterns for working with Sanity images.

## 🎯 Recommended Approach

### **Primary Utility: `getSanityImageUrlWithEnv()`**

This is the **preferred method** for generating Sanity image URLs throughout the application.

```typescript
import {getSanityImageUrlWithEnv} from '~/lib/sanity';

// Basic usage
const imageUrl = getSanityImageUrlWithEnv(image, {
  width: 800,
  height: 600,
  format: 'webp',
  quality: 80,
});

// Advanced usage with all options
const optimizedUrl = getSanityImageUrlWithEnv(image, {
  width: 1200,
  height: 630,
  fit: 'crop',
  format: 'jpg',
  quality: 85,
  crop: 'focalpoint',
});
```

**Benefits:**

- ✅ Direct, simple API
- ✅ Full TypeScript support
- ✅ Comprehensive options
- ✅ Environment-safe configuration
- ✅ No complex chaining required

---

## 🔧 Available Components

### **1. SanityImage Component** (Recommended)

Use this for most image rendering needs with automatic optimization.

```tsx
import SanityImage from '~/components/sanity/SanityImage';

<SanityImage
  image={sanityImageObject}
  width={800}
  height={600}
  alt="Product image"
/>;
```

**Features:**

- Automatic aspect ratio calculation
- Smart sizing with max dimensions (2000px)
- Lazy loading by default
- Automatic format optimization

### **2. CoverImage Component**

Specialized component for cover/hero images with automatic dimensions.

```tsx
import CoverImage from '~/components/sanity/CoverImage';

<CoverImage image={heroImage} priority={true} />;
```

**Use cases:**

- Hero images
- Cover photos
- Full-width banners

---

## 📋 Migration Guide

### **Legacy `urlForImage()` → Modern Approach**

**❌ Old Pattern (Avoid):**

```typescript
// Complex chaining pattern - AVOID
const url = urlForImage(image)
  ?.width(800)
  .height(600)
  .fit('crop')
  .auto('format')
  .url();
```

**✅ New Pattern (Recommended):**

```typescript
// Direct, clear API - USE THIS
const url = getSanityImageUrlWithEnv(image, {
  width: 800,
  height: 600,
  fit: 'crop',
  format: 'auto',
});
```

**✅ Or use the component:**

```tsx
<SanityImage image={image} width={800} height={600} alt="Description" />
```

---

## 🎨 Common Use Cases

### **1. OpenGraph Images**

```typescript
// For social media previews - always use JPG for better compatibility
const ogImageUrl = getSanityImageUrlWithEnv(image, {
  width: 1200,
  height: 630,
  fit: 'crop',
  format: 'jpg',
  quality: 85,
});
```

### **2. Responsive Images**

```typescript
// Generate multiple sizes for responsive images
const sizes = [400, 800, 1200].map((width) => ({
  url: getSanityImageUrlWithEnv(image, {
    width,
    format: 'webp',
    quality: 80,
  }),
  width,
}));
```

### **3. Thumbnail Images**

```typescript
// Small thumbnails with crop focus
const thumbnailUrl = getSanityImageUrlWithEnv(image, {
  width: 150,
  height: 150,
  fit: 'crop',
  crop: 'focalpoint',
  format: 'webp',
  quality: 70,
});
```

---

## 🔍 Implementation Status

### **✅ Updated Components:**

- `Header.tsx` - Uses modern approach
- `open-graph.ts` - Uses modern approach
- `utils.ts` - Uses modern approach

### **✅ Migration Complete:**

- `SanityImage.tsx` - **Updated** to use modern approach with enhanced options
- `Footer.tsx` - **Updated** to use modern approach with quality control
- `Cta.tsx` - **Updated** to use modern approach with null safety
- `Header.tsx` - **Updated** to use modern approach for logo display

### **📋 Legacy Function Status:**

- `urlForImage()` wrapper function **kept for backward compatibility**
- **No active usage** in application code - all components migrated
- Can be removed in future if no external dependencies exist

### **📋 TODO:**

1. ✅ ~~Update remaining components to use `getSanityImageUrlWithEnv()`~~ **COMPLETE**
2. Add automated tests for image optimization
3. Consider removing `urlForImage()` wrapper if no external usage

---

## 🚀 Performance Best Practices

### **Format Selection:**

- **WebP**: Best for modern browsers (smaller file sizes)
- **JPG**: Better social media compatibility
- **Auto**: Let Sanity choose based on browser support

### **Quality Settings:**

- **70-80**: Good for thumbnails and small images
- **80-85**: Good for main content images
- **85-90**: For high-quality hero images

### **Sizing Guidelines:**

- Always specify dimensions to prevent layout shift
- Use `fit: 'crop'` with `crop: 'focalpoint'` for intelligent cropping
- Consider mobile/desktop breakpoints in your sizing strategy

---

## 🏷️ Logo Management

### **Sanity-First Approach** (Recommended)

Logos and branding assets should be managed through Sanity CMS rather than bundled as local assets.

**✅ Benefits:**

- **Dramatically smaller bundle size** - Eliminates large assets from JavaScript bundle
- **Content editor control** - Marketing team can update logos without code changes
- **Automatic optimization** - Sanity CDN handles responsive sizing and formats
- **Better performance** - Cached and optimized delivery

**Implementation:**

```typescript
// Header component automatically uses Sanity logo when available
// Falls back to lightweight text logo when not configured
{logo && logo.asset ? (
  <img
    src={getSanityImageUrlWithEnv(logo, {
      width: 200,
      height: 80,
      fit: 'max',
      format: 'auto',
    })}
    alt={logo.alt || 'Site logo'}
  />
) : (
  <FallbackTextLogo /> // Lightweight fallback
)}
```

### **Bundle Size Impact**

**Real Example from This Project:**

- **Before**: 98KB logo.svg consumed 10.0% of server bundle (101.9kb)
- **After**: Logo moved to Sanity = **~101KB bundle size reduction**
- **Result**: Server bundle reduced from 1,041.69 kB to 940.24 kB

**⚠️ Avoid:** Never import large images as React components via `vite-plugin-svgr`

```typescript
// ❌ This bundles the entire SVG into JavaScript
import {ReactComponent as LogoSvg} from '../../assets/logo.svg';
```

---

## 🛠️ Development Notes

The legacy `urlForImage()` function exists only for backward compatibility and will be removed once all components are migrated. New development should always use `getSanityImageUrlWithEnv()` or the provided components.

For complex image manipulation needs, refer to the [Sanity Image URL Documentation](https://www.sanity.io/docs/image-url) for available parameters.

### **Bundle Optimization Checklist**

- [ ] Move large images (>10KB) from local assets to Sanity CMS
- [ ] Use `getSanityImageUrlWithEnv()` for Sanity images
- [ ] Provide lightweight fallbacks for when Sanity images aren't configured
- [ ] Avoid importing images as React components unless absolutely necessary
- [ ] Run `npm run build` regularly to monitor bundle size impact
