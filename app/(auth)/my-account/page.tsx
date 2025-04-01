'use client';
import { useCustomer } from './customer-context';
import { logout } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, LogOut } from 'lucide-react';

export default function Page() {
  const customer = useCustomer();
  const { firstName, lastName, email } = customer?.customer || {;
  const shipping = customer?.customer?.shipping;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Manage your account details and preferences</p>
        </div>
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">Name</p>
              <p className="text-muted-foreground">
                {firstName || '--'} {lastName || '--'}
              </p>
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-muted-foreground">{email || '--'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {shipping.address1 ? (
              <>
                <p>{shipping.address1}</p>
                {shipping.address2 && <p>{shipping.address2}</p>}
                <p>
                  {shipping.city || ''} {shipping.state || ''} {shipping.postcode || ''}
                </p>
                <p>{shipping.country || ''}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No shipping address saved</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
