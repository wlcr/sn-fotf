# Customer Account System - Complete Guide

## Overview

The Customer Account system implements **customer eligibility-based access control** for the Sierra Nevada "Friends of the Family" members-only program. It determines whether authenticated customers can make purchases based on customer tags in Shopify.

## Architecture

### Core Components

```
app/context/Customer.tsx          # React context for customer state
app/components/PageLayout.tsx     # CustomerProvider integration  
app/components/Header/Header.tsx  # Customer display and login UI
app/root.tsx                      # Customer data loading in root loader
```

### Data Flow

1. **Root Loader** (`app/root.tsx`) fetches customer data from Shopify Customer Account API
2. **CustomerProvider** (`app/context/Customer.tsx`) wraps the app and provides customer state
3. **Components** use `useCustomer()` hook to access customer data and eligibility status
4. **Account Routes** redirect unauthenticated users to homepage (configurable)

## Implementation Details

### Customer Context Provider

```typescript
// app/context/Customer.tsx
type CustomerContextType = {
  customer: CustomerDetailsQuery['customer'] | null;
  isEligible: boolean;
};

function customerIsEligibleToPurchase(
  tags: string[] | null,
  tag: string | null,
) {
  if (!tags || !tag) return false;
  return tags.includes(tag);
}
```

**Key Features:**
- Type-safe customer data from generated GraphQL types
- Eligibility determination based on configurable customer tag
- Null-safe handling for unauthenticated users

### Customer Data Loading

```typescript
// app/root.tsx - Customer data loaded in root loader
context.customerAccount.query(CUSTOMER_DETAILS_QUERY).catch((error: unknown) => {
  // Expected to fail for unauthenticated users
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (process.env.NODE_ENV === 'development' && !errorMessage.includes('Unauthenticated')) {
    console.warn('Customer query failed:', errorMessage);
  }
  return null;
});
```

**Key Features:**
- Graceful error handling for unauthenticated users
- Development logging for debugging
- Performance consideration: loads in root (blocking) but provides app-wide access

### Account Route Redirects

```typescript
// app/routes/account._index.tsx & app/routes/account.$.tsx
export async function loader() {
  return redirect('/'); // Currently redirects to homepage
}
```

**Current Behavior:**
- All account routes redirect to homepage for unauthenticated users
- Prevents access to account-specific functionality
- Configurable destination (pending Sanity settings integration)

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Customer eligibility tag - determines who can make purchases
PUBLIC_FOTF_ELIGIBLE_TO_PURCHASE_TAG=eligible_to_purchase

# Development: Your ngrok URL for local development (optional)
VITE_DEV_HOST=your-unique-id.ngrok-free.app
```

### TypeScript Configuration

Customer account types are defined in:

```typescript
// env.d.ts
interface Env extends HydrogenEnv {
  PUBLIC_FOTF_ELIGIBLE_TO_PURCHASE_TAG?: string;
}

// Global process env for Vite variables
const process: {
  env: {
    NODE_ENV: 'production' | 'development';
    VITE_DEV_HOST?: string;
  }
};
```

### Shopify Setup

1. **Enable Customer Account API** in your Shopify store
2. **Configure customer tags** in Shopify Admin:
   - Go to Customers → [Select Customer] → Tags
   - Add the eligibility tag (default: `eligible_to_purchase`)
3. **Set up public domain** following [Shopify's guide](https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development)

## Usage Examples

### Using Customer Data in Components

```typescript
import { useCustomer } from '~/context/Customer';

export function MyComponent() {
  const { customer, isEligible } = useCustomer();
  
  if (!customer) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h2>Welcome, {customer.firstName}!</h2>
      {isEligible ? (
        <button>Shop Now</button>
      ) : (
        <p>Contact us for program access</p>
      )}
    </div>
  );
}
```

### Conditional Rendering Based on Eligibility

```typescript
import { useCustomer } from '~/context/Customer';

export function PurchaseButton() {
  const { isEligible } = useCustomer();
  
  if (!isEligible) {
    return <div>Membership required to purchase</div>;
  }
  
  return <button>Add to Cart</button>;
}
```

## Testing

### Local Development Testing

1. **Start your development server**: `npm run dev`
2. **Set up ngrok** (optional): For testing customer account API with external domains
   ```bash
   ngrok http 3000
   # Copy the ngrok URL to VITE_DEV_HOST in .env
   ```
3. **Test customer scenarios**:
   - Log in with customers that have the eligibility tag
   - Log in with customers without the eligibility tag
   - Test unauthenticated user flows

### Customer Tag Testing

In Shopify Admin:
1. Create test customers with different tag configurations
2. Add/remove the eligibility tag to test different scenarios
3. Verify redirect behavior for account routes

## Troubleshooting

### Common Issues

**Customer data not loading:**
- Check Customer Account API is enabled in Shopify
- Verify environment variables are set correctly
- Check browser network tab for GraphQL errors

**TypeScript errors:**
- Run `npm run codegen` to regenerate GraphQL types
- Ensure `VITE_DEV_HOST` is added to env.d.ts

**Authentication loops:**
- Verify public domain setup in Shopify
- Check ngrok configuration for development

### Debug Information

Customer context includes debug information in development:

```typescript
// Current debug code in Header.tsx (TODO: remove in production)
{customer ? (
  <li style={{color: 'green'}}>
    Welcome, {customer.id} {isEligible ? 'can purchase' : 'cannot purchase'}
  </li>
) : (
  <NavLink to="/account">Login</NavLink>
)}
```

## Roadmap & TODOs

### Planned Improvements

**UX Enhancements:**
- [ ] Configurable redirect destinations via Sanity site settings
- [ ] Post-redirect messaging system for user feedback
- [ ] Toast notifications for authentication status changes
- [ ] Different redirect logic based on user intent (login vs eligibility)

**Technical Improvements:**
- [ ] Error boundary for customer context failures
- [ ] Performance optimization: consider deferring customer data loading
- [ ] Retry mechanisms for transient API failures
- [ ] Customer data caching strategies

**Integration Requirements:**
- [ ] **CRITICAL**: Sync with main branch before extending features (major conflicts exist)
- [ ] Integration with design system for user messaging
- [ ] Analytics tracking for customer eligibility events

## Security Considerations

### Environment Variables

- `PUBLIC_FOTF_ELIGIBLE_TO_PURCHASE_TAG`: Public (included in client bundle)
- `VITE_DEV_HOST`: Development only, excluded from production builds
- Customer data: Fetched server-side, transmitted securely to client

### Data Handling

- Customer data is fetched server-side in root loader
- Eligibility calculations happen client-side for performance  
- No sensitive customer data stored in local storage
- GraphQL queries use generated types for type safety

## Related Documentation

- **[Shopify Customer Account API](https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api)**
- **[React Context Documentation](https://react.dev/reference/react/useContext)**
- **[Project README](../README.md)** - Setup and quick start
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues
