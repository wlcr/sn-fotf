# Embedded Sanity Studio Troubleshooting Guide

## 🚨 Embedded Studio Not Loading or Showing Errors

If the embedded Studio at `/studio` doesn't load or shows errors, this is usually a cache or configuration issue.

### Quick Fix:

```bash
# Clear Studio cache and restart
npm run studio:clean
npm run dev
```

### Manual Fix:

```bash
# Clear all caches
rm -rf .sanity studio/.sanity node_modules/.vite node_modules/.cache

# Kill any running processes
pkill -f "hydrogen" || true
pkill -f "vite" || true

# Start fresh
npm run dev
```

### Browser Fix:

- **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Clear browser cache** for localhost:3000
- **Check URL**: Make sure you're accessing `http://localhost:3000/studio`

## 🔧 Common Embedded Studio Issues

### Studio Route Not Found (404)

**Symptoms**: `/studio` returns 404 error

**Fix**: Verify embedded Studio route exists:

```bash
# Check if route file exists
ls -la app/routes/studio.$.tsx
```

### SEO Testing Tool Not Working

**Symptoms**: SEO Testing tool shows connection errors

**Fix**: Ensure API route is working:

```bash
# Test the API endpoint
curl -X POST http://localhost:3000/studio/seo \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost:3000"}'
```

### Studio Loading Forever

**Symptoms**: Studio shows loading spinner indefinitely

**Solutions**:

1. Check browser console for JavaScript errors
2. Verify all Studio dependencies are installed:
   ```bash
   npm list sanity @sanity/vision
   ```
3. Clear cache and restart:
   ```bash
   npm run studio:clean && npm run dev
   ```

## 🛡️ Prevention

### DO:

- ✅ Use `npm run studio:clean` when making config changes
- ✅ Hard refresh browser after studio changes
- ✅ Keep `.sanity/` and `studio/.sanity/` in `.gitignore`
- ✅ Check browser console for errors
- ✅ Test both app and Studio after changes

### DON'T:

- ❌ Create complex React components for studio icons
- ❌ Make rapid config changes without restarting dev server
- ❌ Ignore TypeScript or build warnings
- ❌ Forget that Studio is now at `/studio`, not `:3333`

## 📝 Safe Icon Options

Instead of custom React components, use:

```javascript
// Simple emoji
icon: () => '🏔️';

// Sanity built-in icons
import {CogIcon} from '@sanity/icons';
icon: CogIcon;

// Simple string
icon: 'SN';
```

## 🔄 Embedded Studio Development Workflow

1. Make studio config changes in `studio/sanity.config.ts`
2. Stop development server (Ctrl+C)
3. Run `npm run studio:clean` (if needed)
4. Start development server: `npm run dev`
5. Navigate to `http://localhost:3000/studio`
6. Hard refresh browser (Cmd+Shift+R)
7. Test changes in both app and Studio
8. Use SEO Testing tool to verify integration

This prevents cache conflicts and ensures clean builds in the embedded environment.
