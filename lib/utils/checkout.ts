import { Cart, CustomerAddressInput, CountriesEnum } from "../graphql/generated/graphql";

/**
 * Interface för LineItemInput anpassat för vår implementation
 */
export interface LineItemInput {
  productId?: number;
  variationId?: number;
  quantity?: number;
  name?: string;
  taxClass?: string;
  subtotal?: string;
  total?: string;
  metaData?: Array<{ key: string; value: string }>;
}

/**
 * Konverterar cart-items till lineItems format som behövs för createOrder mutation
 */
export const cartToLineItems = (cart: any): LineItemInput[] => {
  if (!cart?.contents?.nodes) {
    return [];
  }

  return cart.contents.nodes.map((item: any) => {
    const productId = item?.product?.node?.databaseId;
    const variationId = item?.variation?.node?.databaseId;

    return {
      productId,
      variationId,
      quantity: item?.quantity || 0,
    };
  });
};

/**
 * Skapar ett dummy-ordernummer för demo-syfte
 */
export const generateDummyTransactionId = (): string => {
  return `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Validerar checkout-formulär
 */
export const validateCheckoutForm = (formData: CheckoutFormData): string[] => {
  const errors: string[] = [];

  if (!formData.firstName) errors.push("Förnamn krävs");
  if (!formData.lastName) errors.push("Efternamn krävs");
  if (!formData.email) errors.push("E-post krävs");
  if (!formData.address1) errors.push("Adress krävs");
  if (!formData.city) errors.push("Stad krävs");
  if (!formData.postcode) errors.push("Postnummer krävs");
  if (!formData.phone) errors.push("Telefonnummer krävs");

  return errors;
};

/**
 * Typinterface för checkout-formulär
 */
export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: CountriesEnum;
  phone: string;
}

/**
 * Konverterar formulärdata till CustomerAddressInput
 */
export const formDataToAddress = (formData: CheckoutFormData): CustomerAddressInput => {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    address1: formData.address1,
    address2: formData.address2 || "",
    city: formData.city,
    state: formData.state || "",
    postcode: formData.postcode,
    country: formData.country,
    email: formData.email,
    phone: formData.phone,
    company: "",
    overwrite: true,
  };
};
