'use client';
import React from 'react';
import { useCustomer } from '../customer-context';
const OrdersPage = () => {
  const customer = useCustomer();
  const orders = customer?.customer?.orders?.nodes;

  console.log(orders);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!orders ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order.id}>
              <h2>{order.status}</h2>
              <p>{order.subtotal}</p>
              <p>{order.billing.address1}</p>
              <p>{order.billing.city}</p>
              <p>{order.billing.state}</p>
              <p>{order.billing.postcode}</p>
              <p>{order.billing.country}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
