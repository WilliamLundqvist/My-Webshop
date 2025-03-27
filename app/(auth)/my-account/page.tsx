'use client';
import { useCustomer } from './customer-context';
import { logout } from './actions';

export default function Page() {
  const customer = useCustomer();

  return (
    <div>
      <h1>My Account</h1>
      <div className="flex items-center">
        <p>
          Welcome {customer?.customer?.firstName} {customer?.customer?.lastName} (Not{' '}
          {customer?.customer?.firstName} {customer?.customer?.lastName}?{'  '}
        </p>
        <form action={logout}>
          <button className="hover:cursor-pointer" type="submit">
            Logout )
          </button>
        </form>
      </div>

      <p>{customer?.customer?.email}</p>
      <p>{customer?.customer?.shipping?.address1}</p>
      <p>{customer?.customer?.shipping?.city}</p>
      <p>{customer?.customer?.shipping?.state}</p>
      <p>{customer?.customer?.shipping?.postcode}</p>
    </div>
  );
}
