import {redirect} from '@shopify/remix-oxygen';

// TODO: UX Improvements for Account Redirects
// Before implementing these changes, sync with main branch updates (substantial changes to related files):
// 1. Make redirect destination configurable via Sanity site settings
//    - Add 'accountRedirectUrl' field to studio/schemaTypes/singletons/settings.tsx
//    - Default to '/' but allow customization (e.g., '/account/login', '/auth')
// 2. Add post-redirect messaging system
//    - Show user-friendly message after redirect explaining why they were redirected
//    - Message should be configurable in Sanity settings
//    - Consider using toast notifications or banner component
//    - Pending design team input on messaging approach
// 3. Consider redirect logic based on user intent
//    - Differentiate between logged-out users vs users without account access
//    - Potentially redirect to login vs homepage based on context
export async function loader() {
  return redirect('/');
}
