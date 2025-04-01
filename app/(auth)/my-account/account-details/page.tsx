'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomer } from '../customer-context';
import { updateAccountDetails } from '../actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AccountDetailsFormData } from '@/lib/utils/customer';
import { Separator } from '@/components/ui/separator';
// Schema för formuläret
const accountSchema = z
  .object({
    firstName: z.string().min(1, 'Förnamn krävs'),
    lastName: z.string().min(1, 'Efternamn krävs'),
    email: z.string().email('Ogiltig e-postadress'),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword) {
        return data.currentPassword && data.newPassword.length >= 8;
      }
      return true;
    },
    {
      message: 'Nytt lösenord måste vara minst 8 tecken och kräver nuvarande lösenord',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Lösenorden matchar inte',
      path: ['confirmPassword'],
    }
  );

type AccountFormData = z.infer<typeof accountSchema>;

const AccountDetailsPage = () => {
  const customer = useCustomer();
  const [isPending, startTransition] = React.useTransition();
  const [formState, setFormState] = useState<{
    success?: string;
    error?: string;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: customer?.customer?.firstName || '',
      lastName: customer?.customer?.lastName || '',
      email: customer?.customer?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    startTransition(async () => {
      const result = await updateAccountDetails(data as AccountDetailsFormData);

      if (result.success) {
        setFormState({
          success: 'Dina kontouppgifter har uppdaterats!',
        });
      } else {
        setFormState({
          error: Array.isArray(result.errors)
            ? result.errors.join(', ')
            : 'Ett fel uppstod när kontouppgifterna skulle uppdateras.',
        });
      }
    });
  };

  if (!customer) {
    return <div>Loading customer data...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kontouppgifter</h1>
        <p className="text-muted-foreground">Uppdatera dina kontouppgifter</p>
      </div>

      <Separator />
      <Card>
        <CardHeader>
          {formState.success && (
            <CardDescription className="text-green-600">{formState.success}</CardDescription>
          )}
          {formState.error && (
            <CardDescription className="text-destructive">{formState.error}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Förnamn</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Efternamn</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Byt lösenord (valfritt)</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Nuvarande lösenord</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...register('currentPassword')}
                    className={errors.currentPassword ? 'border-destructive' : ''}
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newPassword">Nytt lösenord</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register('newPassword')}
                    className={errors.newPassword ? 'border-destructive' : ''}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Uppdaterar...' : 'Spara ändringar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDetailsPage;
