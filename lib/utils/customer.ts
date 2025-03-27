import { CustomerAddressInput, CountriesEnum } from '../graphql/generated/graphql';

/**
 * Interface för AccountDetails formulär
 */
export interface AccountDetailsFormData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/**
 * Interface för Address formulär
 */
export interface AddressFormData {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: CountriesEnum;
  email?: string; // Only for billing
  phone: string;
}

/**
 * Validates the account details form
 */
export const validateAccountDetails = (data: AccountDetailsFormData): string[] => {
  const errors: string[] = [];
  if (!data.firstName) errors.push('Förnamn krävs');
  if (!data.lastName) errors.push('Efternamn krävs');
  if (!data.email) errors.push('E-post krävs');

  // Validate email format
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Ogiltig e-postadress');
  }

  // Password validation
  if (data.newPassword && !data.currentPassword) {
    errors.push('Nuvarande lösenord krävs för att byta lösenord');
  }

  if (data.newPassword && data.newPassword.length < 8) {
    errors.push('Lösenordet måste vara minst 8 tecken');
  }

  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    errors.push('Lösenorden matchar inte');
  }

  return errors;
};

/**
 * Validates the address form
 */
export const validateAddress = (data: AddressFormData): string[] => {
  const errors: string[] = [];

  if (!data.firstName) errors.push('Förnamn krävs');
  if (!data.lastName) errors.push('Efternamn krävs');
  if (!data.address1) errors.push('Adress krävs');
  if (!data.city) errors.push('Stad krävs');
  if (!data.postcode) errors.push('Postnummer krävs');
  if (!data.phone) errors.push('Telefonnummer krävs');

  // Email is required for billing
  if (!data.email) {
    errors.push('E-post krävs för faktureringsadress');
  }

  // Email format
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Ogiltig e-postadress');
  }

  return errors;
};

/**
 * Converts form data to CustomerAddressInput
 */
export const addressFormToInput = (data: AddressFormData): CustomerAddressInput => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    company: data.company || '',
    address1: data.address1,
    address2: data.address2 || '',
    city: data.city,
    state: data.state || '',
    postcode: data.postcode,
    country: data.country,
    email: data.email || '',
    phone: data.phone,
    overwrite: true,
  };
};
