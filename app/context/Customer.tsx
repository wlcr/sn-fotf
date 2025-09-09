import {createContext, useContext, ReactNode} from 'react';

import type {CustomerDetailsQuery} from 'customer-accountapi.generated';

// TODO: CRITICAL - Sync with main branch before extending customer features
// The main branch has substantial updates to:
// - Header/PageLayout components (conflicts with our customer integration)
// - Sanity settings schema (needed for configurable redirect destinations)
// - Bundle optimization and studio configuration
// - Documentation structure and SEO enhancements
// Many files we've modified have significant changes on main that need to be merged first.

// TODO: Error Handling & Resilience Improvements
// 8. Add error boundary for customer context failures
//    - Wrap CustomerProvider with error boundary component
//    - Add fallback UI when customer context throws errors
//    - Handle edge cases like malformed customer data
//    - Graceful degradation when customer features unavailable
//    - Consider retry mechanisms for transient failures

type CustomerContextType = {
  customer: CustomerDetailsQuery['customer'] | null;
  isEligible: boolean;
};

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({
  children,
  customer,
  eligibleToPurchaseTag,
}: {
  children: ReactNode;
  customer: CustomerDetailsQuery['customer'] | null;
  eligibleToPurchaseTag: string | null;
}) {
  return (
    <CustomerContext.Provider
      value={{
        customer,
        isEligible: customerIsEligibleToPurchase(
          customer?.tags || null,
          eligibleToPurchaseTag,
        ),
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return {customer: context.customer, isEligible: context.isEligible};
}

function customerIsEligibleToPurchase(
  tags: string[] | null,
  tag: string | null,
) {
  if (!tags || !tag) return false;
  return tags.includes(tag);
}
