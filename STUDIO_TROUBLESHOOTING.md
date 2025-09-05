# Sanity Studio Troubleshooting Guide

## 🚨 Studio Showing Raw JavaScript/Code Instead of Interface

If you see raw JavaScript code instead of the Sanity Studio interface, this is a cache issue.

### Quick Fix:

```bash
# Use the cache clearing script
npm run studio:restart
```

### Manual Fix:

```bash
# Clear all caches
rm -rf .sanity node_modules/.vite node_modules/.cache

# Kill any running processes
pkill -f "sanity" || true

# Start fresh
npm run studio:dev
```

### Browser Fix:

- **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Clear browser cache** for localhost:3333

## 🛡️ Prevention

### DO:

- ✅ Use `npm run studio:restart` when making config changes
- ✅ Hard refresh browser after studio changes
- ✅ Keep `.sanity/` in `.gitignore`

### DON'T:

- ❌ Create complex React components for studio icons
- ❌ Make rapid config changes without cache clearing
- ❌ Ignore build warnings

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

## 🔄 Development Workflow

1. Make studio config changes
2. Run `npm run studio:restart`
3. Hard refresh browser
4. Test changes

This prevents cache conflicts and ensures clean builds.
