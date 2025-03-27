'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomer } from '../customer-context';
import { updateAddress } from '../actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddressFormData as AddressFormDataType } from '@/lib/utils/customer';
import { CountriesEnum } from '@/lib/graphql/generated/graphql';

// Schema för formuläret
const addressSchema = z.object({
  firstName: z.string().min(1, 'Förnamn krävs'),
  lastName: z.string().min(1, 'Efternamn krävs'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Adress krävs'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Stad krävs'),
  state: z.string().optional(),
  postcode: z.string().min(1, 'Postnummer krävs'),
  country: z.nativeEnum(CountriesEnum, {
    errorMap: () => ({ message: 'Välj ett land' }),
  }),
  email: z.string().email('Ogiltig e-postadress').optional(),
  phone: z.string().min(1, 'Telefonnummer krävs'),
});

type AddressFormData = z.infer<typeof addressSchema>;

const AddressesPage = () => {
  const customer = useCustomer();
  const [isPending, startTransition] = React.useTransition();
  const [formState, setFormState] = useState<{
    success?: string;
    error?: string;
  }>({});

  const shipping = customer?.customer?.shipping;

  // Shipping address form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: shipping?.firstName || '',
      lastName: shipping?.lastName || '',
      company: shipping?.company || '',
      address1: shipping?.address1 || '',
      address2: shipping?.address2 || '',
      city: shipping?.city || '',
      state: shipping?.state || '',
      postcode: shipping?.postcode || '',
      country: (shipping?.country as CountriesEnum) || CountriesEnum.Se,
      email: customer?.customer?.email || '',
      phone: shipping?.phone || '',
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    startTransition(async () => {
      // Uppdatera både leverans- och faktureringsadress eftersom de är samma
      const result = await updateAddress(data as AddressFormDataType);

      if (result.success) {
        setFormState({
          success: 'Din adress har uppdaterats!',
        });
      } else {
        setFormState({
          error: Array.isArray(result.errors)
            ? result.errors.join(', ')
            : 'Ett fel uppstod när adressen skulle uppdateras.',
        });
      }
    });
  };

  if (!customer) {
    return <div>Loading address data...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Din adress</h2>
      <p className="text-sm mb-6 text-muted-foreground">
        Din faktureringsadress kommer automatiskt att vara samma som din leveransadress.
      </p>

      <Card>
        <CardHeader className="py-6">
          <CardTitle className="text-lg">Leveransadress</CardTitle>
          {formState.success && (
            <CardDescription className="text-green-600">{formState.success}</CardDescription>
          )}
          {formState.error && (
            <CardDescription className="text-destructive">{formState.error}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="company">Företag (valfritt)</Label>
              <Input id="company" {...register('company')} />
            </div>

            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                {...register('phone')}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address1">Adress</Label>
              <Input
                id="address1"
                {...register('address1')}
                className={errors.address1 ? 'border-destructive' : ''}
              />
              {errors.address1 && (
                <p className="text-sm text-destructive mt-1">{errors.address1.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address2">Adress rad 2 (valfritt)</Label>
              <Input id="address2" {...register('address2')} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="postcode">Postnummer</Label>
                <Input
                  id="postcode"
                  {...register('postcode')}
                  className={errors.postcode ? 'border-destructive' : ''}
                />
                {errors.postcode && (
                  <p className="text-sm text-destructive mt-1">{errors.postcode.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="city">Stad</Label>
                <Input
                  id="city"
                  {...register('city')}
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country">Land</Label>
                <Select
                  onValueChange={(value) => setValue('country', value as CountriesEnum)}
                  defaultValue={watch('country')}
                >
                  <SelectTrigger
                    id="country"
                    className={errors.country ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Välj land" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CountriesEnum.Se}>Sverige</SelectItem>
                    <SelectItem value={CountriesEnum.No}>Norge</SelectItem>
                    <SelectItem value={CountriesEnum.Fi}>Finland</SelectItem>
                    <SelectItem value={CountriesEnum.Dk}>Danmark</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="state">Län/Stat (valfritt)</Label>
              <Input id="state" {...register('state')} />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? 'Uppdaterar...' : 'Uppdatera adress'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressesPage;
