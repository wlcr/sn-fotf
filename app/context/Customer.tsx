import {createContext, useContext, ReactNode} from 'react';

import type {CustomerDetailsQuery} from 'customer-accountapi.generated';

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
  return context.customer;
}

function customerIsEligibleToPurchase(
  tags: string[] | null,
  tag: string | null,
) {
  if (!tags || !tag) return false;
  return tags.includes(tag);
}
