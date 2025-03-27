'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils/utils';
import Link from 'next/link';
import { signUpAction } from '@/app/(auth)/sign-up/action';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { registerSchema, type RegisterFormData } from '@/lib/validation/registerSchema';
import { CountriesEnum } from '@/lib/graphql/generated/graphql';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = React.useState<{
    success?: string;
    error?: string;
    errors?: Record<string, string[]>;
  }>({});

  // Använd react-hook-form med zod-validering
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Hantera formulärinlämning
  const onSubmit = async (data: RegisterFormData) => {
    startTransition(async () => {
      // Skapa FormData objekt
      const formData = new FormData();
      // Lägg till alla fält till FormData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value === undefined ? '' : value.toString());
      });

      // Anropa server action
      const result = await signUpAction({}, formData);
      setFormState(result);
    });
  };

  return (
    <div className={cn('flex flex-col gap-6 ')}>
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          {formState?.error && (
            <CardDescription className="text-destructive">{formState.error}</CardDescription>
          )}
          {formState?.success && (
            <CardDescription className="text-green-600">{formState.success}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" flex flex-col md:flex-row gap-6 my-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-medium">Personal Information</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-3" htmlFor="firstName">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      type="text"
                      placeholder="First name"
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-3" htmlFor="lastName">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      type="text"
                      placeholder="Last name"
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register('email')}
                    type="email"
                    placeholder="Email address"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    type="tel"
                    placeholder="Phone number"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-3">
                  <h3 className="text-lg font-medium mt-4">Account Information</h3>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      {...register('password')}
                      type="password"
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      type="password"
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

              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-medium">Shipping Address</h3>
                <div className="grid gap-3">
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input
                    id="address1"
                    {...register('address1')}
                    type="text"
                    placeholder="Street address"
                    className={errors.address1 ? 'border-destructive' : ''}
                  />
                  {errors.address1 && (
                    <p className="text-sm text-destructive mt-1">{errors.address1.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address2"
                    {...register('address2')}
                    type="text"
                    placeholder="Apartment, suite, etc."
                    className={errors.address2 ? 'border-destructive' : ''}
                  />
                  {errors.address2 && (
                    <p className="text-sm text-destructive mt-1">{errors.address2.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-3" htmlFor="city">
                      City
                    </Label>
                    <Input
                      id="city"
                      {...register('city')}
                      type="text"
                      placeholder="City"
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-3" htmlFor="postcode">
                      Postal Code
                    </Label>
                    <Input
                      id="postcode"
                      {...register('postcode')}
                      type="text"
                      placeholder="Postal code"
                      className={errors.postcode ? 'border-destructive' : ''}
                    />
                    {errors.postcode && (
                      <p className="text-sm text-destructive mt-1">{errors.postcode.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    {...register('country')}
                    onValueChange={(value) => {
                      setValue('country', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {Object.values(CountriesEnum).map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Creating account...' : 'Sign Up'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account? <Link href="/login">Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
