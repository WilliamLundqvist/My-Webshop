import { gql, TypedDocumentNode } from "@apollo/client";
import {
  RemoveItemsFromCartMutation,
  UpdateCartItemQuantitiesMutation,
  RegisterCustomerMutation,
  AddToCartMutation,
  CheckoutMutation,
  CheckoutMutationVariables,
} from "./generated/graphql";
import { cartFragment } from "./fragments";

export const ADD_TO_CART: TypedDocumentNode<AddToCartMutation> = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cart {
        ...CartFragment
      }
    }
  }
  ${cartFragment}
`;

export const REMOVE_FROM_CART: TypedDocumentNode<RemoveItemsFromCartMutation> = gql`
  mutation RemoveItemsFromCart($keys: [ID], $all: Boolean) {
    removeItemsFromCart(input: { keys: $keys, all: $all }) {
      cart {
        ...CartFragment
      }
    }
  }
  ${cartFragment}
`;

export const UPDATE_CART_ITEM: TypedDocumentNode<UpdateCartItemQuantitiesMutation> = gql`
  mutation UpdateCartItemQuantities($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: { items: { key: $key, quantity: $quantity } }) {
      cart {
        ...CartFragment
      }
    }
  }
  ${cartFragment}
`;

export const REGISTER_CUSTOMER: TypedDocumentNode<RegisterCustomerMutation> = gql`
  mutation RegisterCustomer(
    $country: CountriesEnum
    $postcode: String
    $phone: String
    $lastName: String
    $email: String
    $firstName: String
    $address1: String
    $address2: String
    $city: String
    $password: String
  ) {
    registerCustomer(
      input: {
        email: $email
        firstName: $firstName
        lastName: $lastName
        shipping: {
          address1: $address1
          address2: $address2
          city: $city
          country: $country
          phone: $phone
          postcode: $postcode
        }
        password: $password
        shippingSameAsBilling: true
      }
    ) {
      clientMutationId
    }
  }
`;

export const CHECKOUT: TypedDocumentNode<CheckoutMutation, CheckoutMutationVariables> = gql`
  mutation Checkout(
    $paymentMethod: String!
    $customerNote: String
    $billing: CustomerAddressInput
    $shipping: CustomerAddressInput
    $shipToDifferentAddress: Boolean
  ) {
    checkout(
      input: {
        paymentMethod: $paymentMethod
        customerNote: $customerNote
        billing: $billing
        shipping: $shipping
        shipToDifferentAddress: $shipToDifferentAddress
      }
    ) {
      clientMutationId
      order {
        id
        databaseId
        orderKey
        orderNumber
        status
        total
      }
      redirect
    }
  }
`;
