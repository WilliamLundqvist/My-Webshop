'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CountriesEnum } from '../../lib/graphql/generated/graphql';
import { handleCheckout } from '@/app/(shop)/checkout/actions';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';
import { getCartItems } from '@/lib/utils/cartUtils';

type PaymentMethod = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

type CheckoutFormProps = {
  initialCustomerData?: any;
  paymentMethods: PaymentMethod[];
};

// Zod schema för formulärvalidering
const checkoutSchema = z.object({
  firstName: z.string().min(1, 'Förnamn krävs'),
  lastName: z.string().min(1, 'Efternamn krävs'),
  email: z.string().email('Ogiltig e-postadress'),
  phone: z.string().min(1, 'Telefonnummer krävs'),
  address1: z.string().min(1, 'Adress krävs'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Stad krävs'),
  state: z.string().optional(),
  postcode: z.string().min(1, 'Postnummer krävs'),
  country: z.string().min(1, 'Land krävs'),
  paymentMethod: z.string().min(1, 'Välj en betalningsmetod'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm({ initialCustomerData, paymentMethods }: CheckoutFormProps) {
  const [orderCompleted, setOrderCompleted] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const [formState, setFormState] = React.useState<{
    success?: string;
    error?: string;
  }>({});

  const { cart } = useCart();

  // Installera react-hook-form med zod-validering
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: paymentMethods.length > 0 ? paymentMethods[0].id : undefined,
    },
  });

  // Fylla i formuläret automatiskt med kunddata
  useEffect(() => {
    if (initialCustomerData?.customer) {
      const customer = initialCustomerData.customer;
      const billing = customer.billing;

      setValue('firstName', billing.firstName || customer.firstName || '');
      setValue('lastName', billing.lastName || customer.lastName || '');
      setValue('email', billing.email || customer.email || '');
      setValue('address1', billing.address1 || '');
      setValue('address2', billing.address2 || '');
      setValue('city', billing.city || '');
      setValue('state', billing.state || '');
      setValue('postcode', billing.postcode || '');
      setValue('country', billing.country || CountriesEnum.Se);
      setValue('phone', billing.phone || '');
    }
  }, [initialCustomerData, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart) {
      setFormState({ error: 'Din varukorg är tom' });
      return;
    }

    startTransition(async () => {
      try {
        const result = await handleCheckout({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          postcode: data.postcode,
          country: data.country,
          paymentMethod: data.paymentMethod,
          company: '', // Lägg till detta fält som server action förväntar sig
        });

        if (result.success && result.order) {
          setOrderCompleted(true);
          setOrderNumber(result.order.orderNumber);
          setFormState({ success: 'Beställningen har slutförts!' });
        } else {
          setFormState({ error: result.error || 'Ett okänt fel inträffade' });
        }
      } catch (err: any) {
        console.error('Error during checkout:', err);
        setFormState({ error: 'Ett fel uppstod när ordern skapades. Försök igen.' });
      }
    });
  };

  // Beräkna summor från kundvagn
  const cartItems = getCartItems(cart);
  const subtotal = cart?.subtotal || '0';
  const total = cart?.total || '0';
  const itemCount = cart?.contents?.itemCount || 0;

  if (orderCompleted) {
    return (
      <Card className="mx-auto my-10 max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-green-600">Tack för din beställning!</CardTitle>
          <CardDescription>Din order har mottagits.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Ordernummer: <span className="font-bold">{orderNumber}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Detta är en demo-order och ingen betalning har skett.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Visa meddelande om inga betalningsmetoder finns
  if (paymentMethods.length === 0) {
    return (
      <Card className="mx-auto my-10 max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Checkout</CardTitle>
          <CardDescription className="text-destructive">
            Inga betalningsmetoder är aktiverade. Vänligen kontakta administratören.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="my-10">
      <CardHeader>
        <CardTitle className="text-2xl mt-2">Checkout</CardTitle>
        {formState?.error && (
          <CardDescription className="text-destructive">{formState.error}</CardDescription>
        )}
        {initialCustomerData?.customer && (
          <CardDescription className="text-green-600">
            Välkommen tillbaka! Dina adressuppgifter har fyllts i automatiskt.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-6 my-6">
            {/* Vänster kolumn: Kund- och adressinformation */}
            <div className="flex flex-col gap-3 md:w-1/2">
              <h3 className="text-lg font-medium">Kundinformation</h3>

              <div className="grid grid-cols-2 gap-3">
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

              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div className="flex flex-row gap-3 w-full">
                <div>
                  <Label htmlFor="city">Stad</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    className={errors.city ? 'border-destructive' : 'basis-1/2'}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                  )}
                </div>
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
                  <Label htmlFor="country">Land</Label>
                  <Select
                    onValueChange={(value) => setValue('country', value)}
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
              <h3 className="text-lg font-medium mt-4">Leveransadress</h3>

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
                <Label htmlFor="address2">Adress (rad 2)</Label>
                <Input
                  id="address2"
                  {...register('address2')}
                  className={errors.address2 ? 'border-destructive' : ''}
                />
                {errors.address2 && (
                  <p className="text-sm text-destructive mt-1">{errors.address2.message}</p>
                )}
              </div>
            </div>

            {/* Höger kolumn: Beställningssammanfattning och betalningsmetoder */}
            <div className="flex flex-col gap-4 md:w-1/2">
              <h3 className="text-lg font-medium">Ordersammanfattning</h3>

              <Card>
                <CardContent className="p-4">
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {/* Produktlista */}
                      <div className="space-y-3">
                        {cartItems.map((item) => {
                          const product = item.product.node;
                          const variation = item.variation?.node;
                          // Hitta attribut
                          const attributes = variation?.attributes?.nodes || [];
                          const color = attributes.find(
                            (attr) =>
                              attr.name.toLowerCase() === 'color' ||
                              attr.name.toLowerCase() === 'färg'
                          )?.value;
                          const size = attributes.find(
                            (attr) =>
                              attr.name.toLowerCase() === 'size' ||
                              attr.name.toLowerCase() === 'storlek'
                          )?.value;

                          return (
                            <div
                              key={item.key}
                              className="flex justify-between items-start py-2 border-b"
                            >
                              <div className="flex gap-3">
                                {variation?.image?.sourceUrl ? (
                                  <div className="w-12 h-12 rounded-md overflow-hidden">
                                    <Image
                                      src={variation.image.sourceUrl}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-md overflow-hidden">
                                    <Image
                                      src={product.image.sourceUrl}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  {(color || size) && (
                                    <p className="text-sm text-muted-foreground">
                                      {color && `Färg: ${color}`}
                                      {color && size && ' | '}
                                      {size && `Storlek: ${size}`}
                                    </p>
                                  )}
                                  <p className="text-sm">Antal: {item.quantity}</p>
                                </div>
                              </div>
                              <p
                                className="font-medium"
                                dangerouslySetInnerHTML={{ __html: item.total }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Summering */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Delsumma ({itemCount} artiklar)
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: subtotal }} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frakt</span>
                          <span>Beräknas i nästa steg</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t">
                          <span>Totalsumma</span>
                          <span dangerouslySetInnerHTML={{ __html: total }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Din varukorg är tom</p>
                  )}
                </CardContent>
              </Card>

              <h3 className="text-lg font-medium mt-4">Betalningsmetod</h3>
              <RadioGroup
                onValueChange={(value) => setValue('paymentMethod', value)}
                defaultValue={watch('paymentMethod')}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-start space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.title}
                      </Label>
                      {method.description && (
                        <p
                          className="text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: method.description }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
              {errors.paymentMethod && (
                <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isPending}>
            {isPending ? 'Bearbetar...' : 'Slutför beställning'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
