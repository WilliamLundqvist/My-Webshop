import { gql } from '@apollo/client';

 export const QUERIES = {
  ProductContentSlice,
  ProductVariationContentSlice,
  ProductContentFull,
  CartContent,
  CartItemContent,
  CustomerFields,
  AddToCart,
  UpdateCartItemQuantities,
  RemoveItemsFromCart,
  Login,
  UpdateCustomer
 }

 const ProductContentSlice = gql`
  fragment ProductContentSlice on Product {
    id
    databaseId
    name
    slug
    type
    image {
      id
      sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
      altText
    }
    ... on SimpleProduct {
      price
      regularPrice
      soldIndividually
    }
    ... on VariableProduct {
      price
      regularPrice
      soldIndividually
    }
  }
`;

 const ProductVariationContentSlice = gql`
  fragment ProductVariationContentSlice on ProductVariation {
    id
    databaseId
    name
    slug
    image {
      id
      sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
      altText
    }
    price
    regularPrice
  }
`;

 const ProductContentFull = gql`
  fragment ProductContentFull on Product {
    id
    databaseId
    slug
    name
    type
    description
    shortDescription(format: RAW)
    image {
      id
      sourceUrl
      altText
    }
    galleryImages {
      nodes {
        id
        sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
        altText
      }
    }
    productTags(first: 20) {
      nodes {
        id
        slug
        name
      }
    }
    attributes {
      nodes {
        id
        attributeId
        ... on LocalProductAttribute {
          name
          options
          variation
        }
        ... on GlobalProductAttribute {
          name
          options
          variation
        }
      }
    }
    ... on SimpleProduct {
      onSale
      stockStatus
      price
      rawPrice: price(format: RAW)
      regularPrice
      salePrice
      stockStatus
      stockQuantity
      soldIndividually
    }
    ... on VariableProduct {
      onSale
      price
      rawPrice: price(format: RAW)
      regularPrice
      salePrice
      stockStatus
      stockQuantity
      soldIndividually
      variations(first: 50) {
        nodes {
          id
          databaseId
          name
          price
          rawPrice: price(format: RAW)
          regularPrice
          salePrice
          onSale
          attributes {
            nodes {
              name
              label
              value
            }
          }
        }
      }
    }
  }
`;

 const VariationContent = gql`
  fragment VariationContent on ProductVariation {
    id
    name
    slug
    price
    regularPrice
    salePrice
    stockStatus
    stockQuantity
    onSale
    image {
      id
      sourceUrl
      altText
    }
  }
`;

 const CartItemContent = gql`
  fragment CartItemContent on CartItem {
    key
    product {
      node {
        ...ProductContentSlice
      }
    }
    variation {
      node {
        ...ProductVariationContentSlice
      }
    }
    quantity
    total
    subtotal
    subtotalTax
    extraData {
      key
      value
    }
  }
  ${ProductContentSlice}
  ${ProductVariationContentSlice}
`;

 const CartContent = gql`
  fragment CartContent on Cart {
    contents(first: 100) {
      itemCount
      nodes {
        ...CartItemContent
      }
    }
    appliedCoupons {
      code
      discountAmount
      discountTax
    }
    needsShippingAddress
    availableShippingMethods {
      packageDetails
      supportsShippingCalculator
      rates {
        id
        instanceId
        methodId
        label
        cost
      }
    }
    subtotal
    subtotalTax
    shippingTax
    shippingTotal
    total
    totalTax
    feeTax
    feeTotal
    discountTax
    discountTotal
  }
  ${CartItemContent}
`;

 const AddressFields = gql`
  fragment AddressFields on CustomerAddress {
    firstName
    lastName
    company
    address1
    address2
    city
    state
    country
    postcode
    phone
  }
`;

 const LineItemFields = gql`
  fragment LineItemFields on LineItem {
    databaseId
    product {
      node {
        ...ProductContentSlice
      }
    }
    orderId
    quantity
    subtotal
    total
    totalTax
  }
  ${ProductContentSlice}
`;

 const OrderFields = gql`
  fragment OrderFields on Order {
    id
    databaseId
    orderNumber
    orderVersion
    status
    needsProcessing
    subtotal
    paymentMethodTitle
    total
    totalTax
    date
    dateCompleted
    datePaid
    billing {
      ...AddressFields
    }
    shipping {
      ...AddressFields
    }
    lineItems(first: 100) {
      nodes {
          ...LineItemFields
      }
    }
  }
  ${AddressFields}
  ${LineItemFields}
`;

 const CustomerFields = gql`
  fragment CustomerFields on Customer {
    id
    databaseId
    firstName
    lastName
    displayName
    billing {
      ...AddressFields
    }
    shipping {
      ...AddressFields
    }
    orders(first: 100) {
      nodes {
        ...OrderFields
      } 
    }
  }
  ${AddressFields}
  ${OrderFields}
`;

 const CustomerContent = gql`
  fragment CustomerContent on Customer {
    id
    sessionToken
  }
`;



 const GetProduct = gql`
  query GetProduct($id: ID!, $idType: ProductIdTypeEnum) {
    product(id: $id, idType: $idType) {
      ...ProductContentFull
    }
  }
  ${ProductContentFull}
`;

 const GetProductVariation = gql`
  query GetProductVariation($id: ID!) {
    productVariation(id: $id, idType: DATABASE_ID) {
      ...VariationContent
    }
  }
  ${VariationContent}
`;

 const GetCart = gql`
  query GetCart($customerId: Int) {
    cart {
      ...CartContent
    }
    customer(customerId: $customerId) {
      ...CustomerContent
    }
  }
  ${CartContent}
  ${CustomerContent}
`;

 const AddToCart = gql`
  mutation AddToCart($productId: Int!, $variationId: Int, $quantity: Int, $extraData: String) {
    addToCart(
      input: {productId: $productId, variationId: $variationId, quantity: $quantity, extraData: $extraData}
    ) {
      cart {
        ...CartContent
      }
      cartItem {
        ...CartItemContent
      }
    }
  }
  ${CartContent}
  ${CartItemContent}
`;

 const UpdateCartItemQuantities = gql`
  mutation UpdateCartItemQuantities($items: [CartItemQuantityInput]) {
    updateItemQuantities(input: {items: $items}) {
      cart {
        ...CartContent
      }
      items {
        ...CartItemContent
      }
    }
  }
  ${CartContent}
  ${CartItemContent}
`;

 const RemoveItemsFromCart = gql`
  mutation RemoveItemsFromCart($keys: [ID], $all: Boolean) {
    removeItemsFromCart(input: {keys: $keys, all: $all}) {
      cart {
        ...CartContent
      }
      cartItems {
        ...CartItemContent
      }
    }
  }
  ${CartContent}
  ${CartItemContent}
`;
 const Login = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      customer {
        ...CustomerFields
      }
    }
  }
  ${CustomerFields}
`;

 const UpdateCustomer = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        ...CustomerFields
      }
    }
  }
  ${CustomerFields}
`;