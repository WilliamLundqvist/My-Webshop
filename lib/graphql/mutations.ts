import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
mutation ADD_TO_CART($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
        key
        product {
          node {
            id
            name
            }
        }
        variation {
          node {
            id
            name
          }
        }
        quantity
      }
    }
  }
`;
