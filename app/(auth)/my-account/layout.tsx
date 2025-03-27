import { ReactNode } from 'react';
import { getAuthClient } from '@faustwp/experimental-app-router';
import AuthSidebar from '@/components/auth/auth-sidebar';
import { GET_CUSTOMER } from '@/lib/graphql/queries';
import { CustomerProvider } from './customer-context';
import { redirect } from 'next/navigation';
export default async function MyAccountLayout({ children }: { children: ReactNode }) {
  const client = await getAuthClient();
  if (!client) {
    return redirect('/login');
  }

  const { data, error } = await client.query({
    query: GET_CUSTOMER,
  });

  if (error) {
    console.error('Error fetching customer data:', error);
  }

  console.log('customer', data);

  return (
    <CustomerProvider value={data}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <AuthSidebar />
          </div>
          <div className="w-full md:mx-auto md:max-w-3xl ">{children}</div>
        </div>
      </div>
    </CustomerProvider>
  );
}
