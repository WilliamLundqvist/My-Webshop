'use server';

import { onLogout } from '@faustwp/experimental-app-router';
import { redirect } from 'next/navigation';
import { getAuthClient } from '@faustwp/experimental-app-router';
import { gql } from '@apollo/client';
import { revalidatePath } from 'next/cache';
import {
  AddressFormData,
  AccountDetailsFormData,
  validateAccountDetails,
  validateAddress,
  addressFormToInput,
} from '@/lib/utils/customer';

export async function logout() {
  await onLogout();
  redirect('/login');
}

/**
 * Update account details action
 */
export async function updateAccountDetails(formData: AccountDetailsFormData) {
  const errors = validateAccountDetails(formData);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  try {
    const client = await getAuthClient();

    if (!client) {
      return { success: false, errors: ['Du måste vara inloggad'] };
    }

    // Update customer data
    const { data, errors: gqlErrors } = await client.mutate({
      mutation: gql`
        mutation UpdateCustomer($input: UpdateCustomerInput!) {
          updateCustomer(input: $input) {
            customer {
              id
              firstName
              lastName
              email
            }
          }
        }
      `,
      variables: {
        input: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
      },
    });

    if (gqlErrors?.length) {
      return { success: false, errors: gqlErrors.map((e) => e.message) };
    }

    // If password change is requested
    if (formData.newPassword && formData.currentPassword) {
      const { errors: pwdErrors } = await client.mutate({
        mutation: gql`
          mutation UpdateCustomerPassword($input: UpdateCustomerPasswordInput!) {
            updateCustomerPassword(input: $input) {
              customer {
                id
              }
            }
          }
        `,
        variables: {
          input: {
            password: formData.newPassword,
            currentPassword: formData.currentPassword,
          },
        },
      });

      if (pwdErrors?.length) {
        return { success: false, errors: pwdErrors.map((e) => e.message) };
      }
    }

    // Revalidate pages to show updated information
    revalidatePath('/my-account');

    return {
      success: true,
      customer: data?.updateCustomer?.customer,
    };
  } catch (error: any) {
    console.error('Error updating account details:', error);
    return {
      success: false,
      errors: [error.message || 'Ett fel uppstod vid uppdatering av kontoinformationen'],
    };
  }
}

/**
 * Update address action
 */
export async function updateAddress(formData: AddressFormData) {
  const errors = validateAddress(formData);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  try {
    const client = await getAuthClient();

    if (!client) {
      return { success: false, errors: ['Du måste vara inloggad'] };
    }

    // Prepare mutation - använd samma mutation för både shipping och billing
    const mutation = gql`
      mutation UpdateAddress($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
          customer {
            id
            firstName
            lastName
            email
            shipping {
              firstName
              lastName
              address1
              address2
              city
              state
              postcode
              country
              phone
              company
            }
          }
        }
      }
    `;

    // Convert form data to input object
    const addressInput = addressFormToInput(formData);

    // För leverans: uppdatera både leverans- och faktureringsadress
    // eftersom shippingSameAsBilling är true
    const variables = {
      input: {
        shipping: addressInput,
        billing: addressInput,
        // Se till att email från formuläret hamnar i billing.email
        ...(formData.email && { billing: { ...addressInput, email: formData.email } }),
      },
    };

    // Execute mutation
    const { data, errors: gqlErrors } = await client.mutate({
      mutation,
      variables,
    });

    if (gqlErrors?.length) {
      return { success: false, errors: gqlErrors.map((e) => e.message) };
    }

    // Revalidate pages to show updated information
    revalidatePath('/my-account');
    revalidatePath('/my-account/address');

    return {
      success: true,
      customer: data?.updateCustomer?.customer,
    };
  } catch (error: any) {
    console.error(`Error updating address:`, error);
    return {
      success: false,
      errors: [error.message || `Ett fel uppstod vid uppdatering av adressen`],
    };
  }
}
