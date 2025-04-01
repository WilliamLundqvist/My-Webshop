'use client';
import React from 'react';
import { useCustomer } from '../customer-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Calendar, CreditCard } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

const OrdersPage = () => {
  const customer = useCustomer();
  const orders = customer?.customer?.orders?.nodes || [];

  // Get order status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'refunded':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'on-hold':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Format date function (stub - implement in utils)
  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString();
  // };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      <Separator />

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium">No orders found</p>
            <p className="text-muted-foreground">You haven&apos;t placed any orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-start gap-2">
                      <CardTitle className="text-base">Order #{order.databaseId}</CardTitle>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </div>
                    <CardDescription className="flex items-center text-xs mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {order.date ? formatDate(order.date) : 'Date unavailable'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span
                    className="font-medium"
                    dangerouslySetInnerHTML={{ __html: order.total }}
                  ></span>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1 flex items-center">
                    <CreditCard className="h-3 w-3 mr-1" /> Billing Address
                  </p>
                  <div className="text-xs space-y-1">
                    <p>
                      {order.billing?.firstName} {order.billing?.lastName}
                    </p>
                    <p>{order.billing?.address1}</p>
                    {order.billing?.address2 && <p>{order.billing.address2}</p>}
                    <p>
                      {order.billing?.city}, {order.billing?.state} {order.billing?.postcode}
                    </p>
                    <p>{order.billing?.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
