# Client-Side Rendering in React Router v7 + Hydrogen

This guide covers how to implement client-side rendering patterns in our Hydrogen project using React Router v7.6.0.

## Table of Contents

- [Key Differences from Next.js](#key-differences-from-nextjs)
- [Client-Side Rendering Patterns](#client-side-rendering-patterns)
- [Implementation Examples](#implementation-examples)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Additional Resources](#additional-resources)

## Key Differences from Next.js

### ❌ What React Router v7 DOESN'T have:

- **No `"use client"` directive** - This is Next.js specific
- **No `.client.` file naming convention** - This was old Remix, not React Router v7
- **No component-level client/server boundaries** - Control is at the route level

### ✅ What React Router v7 DOES have:

- **Route-level control** via [`clientLoader`](https://reactrouter.com/7.6.0/how-to/client-data#skip-the-server-hop) and [`clientAction`](https://reactrouter.com/7.6.0/how-to/client-data#client-side-caching)
- **Granular hydration control** with [`clientLoader.hydrate`](https://reactrouter.com/7.6.0/how-to/client-data#fullstack-state)
- **Fallback components** with [`HydrateFallback`](https://reactrouter.com/7.6.0/start/framework/route-module#hydratefallback)
- **Mixed server/client data loading** strategies

## Client-Side Rendering Patterns

### Pattern 1: Client-Only Data Loading

Use when you want data to be fetched entirely on the client (e.g., user-specific data, real-time updates).

> 📖 **Reference**: [React Router Client Data Guide - Choosing Server or Client Data Loading](https://reactrouter.com/7.6.0/how-to/client-data#choosing-server-or-client-data-loading)

```tsx
// app/routes/dashboard.tsx
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // This runs ONLY in the browser
  const userData = await fetchUserDataFromAPI(request);
  return userData;
}

// Tell React Router to run clientLoader during hydration
clientLoader.hydrate = true;

// Shown during SSR before client takes over
export function HydrateFallback() {
  return (
    <div className="animate-pulse">
      <h1>Dashboard</h1>
      <div className="bg-gray-200 h-4 w-full rounded"></div>
    </div>
  );
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {loaderData.user.name}!</p>
    </div>
  );
}
```

### Pattern 2: Skip Server on Navigation

Use when you want server-side rendering for initial page load but client-side for subsequent navigations.

> 📖 **Reference**: [React Router Client Data Guide - Skip the Server Hop](https://reactrouter.com/7.6.0/how-to/client-data#skip-the-server-hop)

```tsx
// app/routes/products.$handle.tsx
// Server loader for SEO and initial page load
export async function loader({ params }: Route.LoaderArgs) {
  const product = await shopify.query(PRODUCT_QUERY, {
    variables: { handle: params.handle }
  });
  return { product };
}

// Client loader for faster subsequent navigations
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // Fetch directly from Shopify Storefront API in browser
  const product = await fetch('/api/products/' + params.handle).then(r => r.json());
  return { product };
}

export default function Product({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>{loaderData.product.title}</h1>
      <p>{loaderData.product.description}</p>
    </div>
  );
}
```

### Pattern 3: Combined Server + Client Data

Use when you need to merge server data with client-specific data (e.g., server product data + client cart state).

> 📖 **Reference**: [React Router Client Data Guide - Fullstack State](https://reactrouter.com/7.6.0/how-to/client-data#fullstack-state)

```tsx
// app/routes/product-with-cart.tsx
export async function loader({ params }: Route.LoaderArgs) {
  // Server-side: Get product data for SEO
  const product = await shopify.query(PRODUCT_QUERY, {
    variables: { handle: params.handle }
  });
  return { product };
}

export async function clientLoader({ 
  params, 
  serverLoader 
}: Route.ClientLoaderArgs) {
  // Get server data + add client-specific data
  const [serverData, cartState, userPreferences] = await Promise.all([
    serverLoader(), // Call the server loader
    getCartFromLocalStorage(),
    getUserPreferencesFromIndexedDB()
  ]);
  
  return {
    ...serverData,
    cartState,
    userPreferences,
    isInCart: cartState.items.some(item => item.productId === serverData.product.id)
  };
}

clientLoader.hydrate = true;

export function HydrateFallback() {
  return <ProductSkeleton />;
}

export default function ProductWithCart({ loaderData }: Route.ComponentProps) {
  const { product, cartState, userPreferences, isInCart } = loaderData;
  
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <button disabled={isInCart}>
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
      <div>Cart has {cartState.items.length} items</div>
    </div>
  );
}
```

### Pattern 4: Client-Side Caching

Use for performance optimization with client-side caching.

> 📖 **Reference**: [React Router Client Data Guide - Client-Side Caching](https://reactrouter.com/7.6.0/how-to/client-data#client-side-caching)

```tsx
// app/routes/cached-products.tsx
export async function loader({ request }: Route.LoaderArgs) {
  const products = await shopify.query(PRODUCTS_QUERY);
  return { products };
}

let isInitialRequest = true;
const cache = new Map();

export async function clientLoader({ 
  request, 
  serverLoader 
}: Route.ClientLoaderArgs) {
  const cacheKey = new URL(request.url).pathname;
  
  if (isInitialRequest) {
    isInitialRequest = false;
    const serverData = await serverLoader();
    cache.set(cacheKey, serverData);
    return serverData;
  }
  
  // Check cache first
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  // Fallback to server
  const serverData = await serverLoader();
  cache.set(cacheKey, serverData);
  return serverData;
}

clientLoader.hydrate = true;

export async function clientAction({ 
  request, 
  serverAction 
}: Route.ClientActionArgs) {
  // Invalidate cache on mutations
  cache.clear();
  return serverAction();
}
```

## Implementation Examples

### Shopping Cart with Client State

This example demonstrates how to manage cart state entirely on the client side, which is common in Hydrogen applications.

> 🛒 **Hydrogen Context**: This pattern works well with [Hydrogen's cart utilities](https://shopify.dev/docs/api/hydrogen/2025.5/utilities/cartcreatecart) for managing Shopify cart state.

```tsx
// app/routes/cart.tsx
export async function clientLoader() {
  // Load cart from localStorage/sessionStorage
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    items: cartItems,
    total: cartTotal,
    count: cartItems.length
  };
}

clientLoader.hydrate = true;

export function HydrateFallback() {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <div>Loading your cart...</div>
    </div>
  );
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const action = formData.get('action');
  
  if (action === 'add') {
    // Add item to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      id: formData.get('productId'),
      title: formData.get('title'),
      price: Number(formData.get('price')),
      quantity: 1
    });
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  return { success: true };
}

export default function Cart({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Shopping Cart ({loaderData.count} items)</h1>
      {loaderData.items.map(item => (
        <div key={item.id}>
          <span>{item.title}</span>
          <span>${item.price}</span>
        </div>
      ))}
      <div>Total: ${loaderData.total}</div>
    </div>
  );
}
```

### User Dashboard with Authentication

This shows client-side authentication checking, which is useful for protected routes.

> 🔐 **Hydrogen Context**: This can be combined with [Hydrogen's Customer Account API](https://shopify.dev/docs/api/hydrogen/2025.5/utilities/customergetaccesstoken) for Shopify customer authentication.

```tsx
// app/routes/dashboard.tsx
export async function clientLoader() {
  // Check authentication in browser
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  // Fetch user data from API
  const userData = await fetch('/api/user', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
  
  return { user: userData };
}

clientLoader.hydrate = true;

export function HydrateFallback() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div>Authenticating...</div>
    </div>
  );
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Welcome, {loaderData.user.name}!</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Hydrogen-Specific: Product with Real-Time Inventory

This example shows how to combine Shopify product data with real-time inventory updates.

> 📦 **Hydrogen Context**: Uses [Hydrogen's GraphQL queries](https://shopify.dev/docs/api/hydrogen/2025.5/utilities/storefront) for product data and client-side updates for inventory.

```tsx
// app/routes/products.$handle.inventory.tsx
import type { Route } from './+types/products.$handle.inventory';
import { PRODUCT_QUERY } from '~/graphql/queries';

export async function loader({ params, context }: Route.LoaderArgs) {
  const { storefront } = context;
  
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle: params.handle }
  });
  
  if (!product) {
    throw new Response('Product not found', { status: 404 });
  }
  
  return { product };
}

export async function clientLoader({ 
  params, 
  serverLoader 
}: Route.ClientLoaderArgs) {
  // Get server product data
  const serverData = await serverLoader();
  
  // Fetch real-time inventory from a separate service
  const inventoryData = await fetch(`/api/inventory/${params.handle}`)
    .then(r => r.json())
    .catch(() => ({ available: null }));
  
  return {
    ...serverData,
    realTimeInventory: inventoryData,
    lastUpdated: new Date().toISOString()
  };
}

clientLoader.hydrate = true;

export function HydrateFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
}

export default function ProductHandleInventory() {
  const { product, realTimeInventory, lastUpdated } = useLoaderData<typeof clientLoader>();
  
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      
      {realTimeInventory.available !== null && (
        <div className="inventory-info">
          <span className={realTimeInventory.available > 0 ? 'text-green-600' : 'text-red-600'}>
            {realTimeInventory.available > 0 
              ? `${realTimeInventory.available} in stock` 
              : 'Out of stock'
            }
          </span>
          <small className="text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </small>
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### 1. Use HydrateFallback for Better UX

Always provide a fallback component that matches your final component's structure:

> 📖 **Reference**: [React Router Route Module - HydrateFallback](https://reactrouter.com/7.6.0/start/framework/route-module#hydratefallback)

```tsx
export function HydrateFallback() {
  return (
    <div className="product-page">
      {/* Match the structure but show loading states */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}
```

### 2. Handle Hydration Mismatches

Ensure server and client data structures match when using `serverLoader()`:

> ⚠️ **Important**: [React hydration errors](https://reactrouter.com/7.6.0/start/framework/rendering#hydration-errors) can occur if server and client render different content.

```tsx
export async function clientLoader({ serverLoader }) {
  const serverData = await serverLoader();
  
  // Add client-only fields that won't cause hydration mismatch
  return {
    ...serverData,
    // These should be optional/nullable in your components
    clientOnlyField: getClientOnlyData() || null
  };
}
```

### 3. Progressive Enhancement

Design components to work without JavaScript first:

> 🌐 **Hydrogen Context**: This aligns with [Hydrogen's progressive enhancement approach](https://shopify.dev/docs/custom-storefronts/hydrogen/react-router#progressive-enhancement) for better SEO and accessibility.

```tsx
export default function ProductForm({ loaderData }) {
  return (
    <form method="POST" action="/cart/add">
      <input type="hidden" name="productId" value={loaderData.product.id} />
      <button type="submit">
        Add to Cart {/* This works without JS */}
      </button>
    </form>
  );
}
```

### 4. Error Handling

Always handle client-side errors gracefully:

> 📖 **Reference**: [React Router Error Boundaries](https://reactrouter.com/7.6.0/how-to/error-boundary)

```tsx
export async function clientLoader() {
  try {
    const data = await fetchClientData();
    return data;
  } catch (error) {
    console.error('Client loader failed:', error);
    // Return fallback data or throw a proper Response
    return { error: 'Failed to load data' };
  }
}
```

### 5. Hydrogen-Specific: Leverage Oxygen Edge Functions

When deploying to Shopify's Oxygen platform, consider edge-specific optimizations:

> ☁️ **Hydrogen Context**: [Oxygen's edge runtime](https://shopify.dev/docs/custom-storefronts/hydrogen/migrate/redirect-traffic) can cache and optimize your client-side data patterns.

```tsx
export async function clientLoader({ request }) {
  // Check if we're running on Oxygen edge runtime
  // Oxygen uses the Web Cache API and standard Web APIs
  const isOxygen = typeof caches !== 'undefined' && 
                   request.headers.get('oxygen-deployment-id');
  
  if (isOxygen) {
    // Use Oxygen-optimized data fetching with Web Cache API
    const cache = caches.default;
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse.json();
    }
    
    // Fetch and cache for future requests
    const data = await fetchFromAPI();
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
    await cache.put(request, response.clone());
    return data;
  }
  
  // Fallback to regular client-side fetching
  const data = await fetchFromAPI();
  return data;
}
```

## Common Pitfalls

### ❌ Don't: Try to use "use client"

```tsx
// This doesn't work in React Router v7
"use client";

export default function MyComponent() {
  // ...
}
```

### ❌ Don't: Name files with .client.

```tsx
// This doesn't have special meaning in React Router v7
// app/routes/dashboard.client.tsx ← No special behavior
```

### ❌ Don't: Forget hydrate flag for client-only routes

```tsx
export async function clientLoader() {
  return await getClientData();
}
// Missing: clientLoader.hydrate = true;
// Result: Data won't load on initial page load
```

### ❌ Don't: Access browser APIs in server loaders

```tsx
export async function loader() {
  // This will crash on the server
  const data = localStorage.getItem('key');
  return data;
}
```

### ❌ Don't: Ignore Hydrogen's built-in utilities

```tsx
// Don't reinvent the wheel - use Hydrogen's utilities
const cart = JSON.parse(localStorage.getItem('cart') || '[]'); // ❌

// Instead, use Hydrogen's cart utilities:
import { cartCreate } from '@shopify/hydrogen'; // ✅
```

### ✅ Do: Use proper client-side patterns

```tsx
export async function clientLoader() {
  // This is safe - only runs in browser
  const data = localStorage.getItem('key');
  return data;
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <LoadingSpinner />;
}
```

## When to Use Each Pattern

- **Client-Only**: User dashboards, real-time data, browser-specific features, Shopify customer account data
- **Skip Server on Navigation**: Product pages, category pages with caching, faster subsequent loads
- **Combined Server + Client**: E-commerce with cart state, personalized content, inventory + user preferences
- **Client-Side Caching**: High-traffic pages, expensive Shopify GraphQL calls, inventory checks

## Project Configuration

Our current setup in [`react-router.config.ts`](../react-router.config.ts):

```typescript
export default {
  appDirectory: 'app',
  buildDirectory: 'dist',
  ssr: true, // Server-side rendering enabled
} satisfies Config;
```

This means:
- ✅ SSR is enabled by default
- ✅ Client-side hydration happens automatically
- ✅ You can use all client-side patterns above
- ✅ `HydrateFallback` components will be rendered during SSR

## Additional Resources

### React Router v7.6.0 Documentation
- [Client Data Guide](https://reactrouter.com/7.6.0/how-to/client-data) - Complete guide to client-side data loading
- [Route Module API](https://reactrouter.com/7.6.0/start/framework/route-module) - Route module exports and options
- [Rendering Strategies](https://reactrouter.com/7.6.0/start/framework/rendering) - SSR, hydration, and client-side rendering
- [Data Loading](https://reactrouter.com/7.6.0/start/framework/data-loading) - Server vs client data loading patterns
- [Error Boundaries](https://reactrouter.com/7.6.0/how-to/error-boundary) - Handling errors in client loaders

### Hydrogen 2025.5.0 Documentation  
- [React Router Integration](https://shopify.dev/docs/custom-storefronts/hydrogen/react-router) - How Hydrogen works with React Router v7
- [Data Loading](https://shopify.dev/docs/custom-storefronts/hydrogen/data-fetching) - Shopify-specific data patterns
- [Cart Utilities](https://shopify.dev/docs/api/hydrogen/2025.5/utilities/cartcreatecart) - Built-in cart management
- [Customer Account API](https://shopify.dev/docs/api/hydrogen/2025.5/utilities/customergetaccesstoken) - Authentication utilities
- [GraphQL Queries](https://shopify.dev/docs/api/hydrogen/2025.5/utilities/storefront) - Shopify Storefront API integration

### Project-Specific Files
- [`react-router.config.ts`](../react-router.config.ts) - Our React Router configuration
- [`app/entry.client.tsx`](../app/entry.client.tsx) - Client-side hydration entry point
- [`app/entry.server.tsx`](../app/entry.server.tsx) - Server-side rendering entry point
- [`package.json`](../package.json) - Dependencies and versions

---

**Version Info**: This guide is written for React Router v7.6.0 and Hydrogen 2025.5.0 as used in this project.
