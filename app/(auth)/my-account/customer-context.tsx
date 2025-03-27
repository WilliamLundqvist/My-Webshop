'use client';

import { createContext, useContext, ReactNode } from 'react';
import { GetCustomerQuery } from '@/lib/graphql/generated/graphql';

const CustomerContext = createContext<GetCustomerQuery | null>(null);

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: GetCustomerQuery;
}) => {
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};
