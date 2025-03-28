'use server';

import { getAuthClient } from '@faustwp/experimental-app-router';
import { CHECKOUT } from '@/lib/graphql/mutations';
import { GET_CART } from '@/lib/graphql/queries';

export async function handleCheckout(formData: {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  phone: string;
  company?: string;
  paymentMethod: string;
}) {
  // Hämta den autentiserade klienten
  const client = await getAuthClient();

  if (!client) {
    // Redirecta till login om användaren inte är autentiserad
    return { success: false, error: 'Du måste vara inloggad för att slutföra köpet.' };
  }

  try {
    // Hämta kundvagnen först för att verifiera att den finns
    const { data: cartData } = await client.query({
      query: GET_CART,
      fetchPolicy: 'network-only',
    });

    if (!cartData.cart || cartData.cart.isEmpty) {
      return { success: false, error: 'Din kundvagn är tom' };
    }

    // Skapa address input-objektet
    const addressInput = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address1: formData.address1,
      address2: formData.address2 || '',
      city: formData.city,
      state: formData.state || '',
      postcode: formData.postcode,
      country: formData.country,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || '',
      overwrite: true,
    };

    // Utför checkout-mutationen med autentiserad klient och användarens valda betalningsmetod
    const { data } = await client.mutate({
      mutation: CHECKOUT,
      variables: {
        paymentMethod: formData.paymentMethod,
        customerNote: '',
        billing: addressInput,
        shipping: addressInput,
        shipToDifferentAddress: false,
      },
    });

    if (data.checkout.order) {
      return {
        success: true,
        order: {
          orderNumber: data.checkout.order.orderNumber,
          total: data.checkout.order.total,
        },
      };
    } else {
      return { success: false, error: 'Något gick fel vid skapande av ordern' };
    }
  } catch (err: any) {
    console.error('Checkout error:', err);
    return { success: false, error: err.message || 'Ett fel uppstod när ordern skapades' };
  }
}
