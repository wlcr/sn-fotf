import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// fallback wild card for all unauthenticated routes in account section

// TODO: UX Improvements for Account Redirects (matches account._index.tsx)
// Before implementing, sync with main branch updates (substantial changes to related files):
// 1. Make redirect destination configurable via Sanity site settings
// 2. Add post-redirect messaging system with user-friendly explanations
// 3. Consider different redirect logic based on authentication status vs eligibility
// 4. Potentially preserve the original intended route for post-login redirect
export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return redirect('/');
}
