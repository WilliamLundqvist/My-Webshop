import { gql, TypedDocumentNode } from "@apollo/client";
import { AddToCartMutation, RemoveItemsFromCartMutation, UpdateCartItemQuantitiesMutation } from "./generated/graphql";


export const ADD_TO_CART: TypedDocumentNode<AddToCartMutation> = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cart {
        contents {
          nodes {
            key
            product {
              node {
                id
                name
              }
            }
            quantity
            total
          }
        }
        subtotal
        total
        isEmpty
      }
    }
  }
`;

export const REMOVE_FROM_CART: TypedDocumentNode<RemoveItemsFromCartMutation> = gql`
 mutation RemoveItemsFromCart($keys: [ID], $all: Boolean) {
    removeItemsFromCart(input: {keys: $keys, all: $all}) {
      cart {
        contents {
          nodes {
            key
            product {
              node {
                id
                name
              }
            }
            quantity
            total
          }
        }
        subtotal
        total
        isEmpty
      }
    }
  }
`;

export const UPDATE_CART_ITEM: TypedDocumentNode<UpdateCartItemQuantitiesMutation> = gql`
  mutation UpdateCartItemQuantities($key: ID!, $quantity: Int!) {
  updateItemQuantities(input: {items: {key: $key, quantity: $quantity}}) {
    cart {
        contents {
          nodes {
            key
            product {
              node {
                id
                name
              }
            }
            quantity
            total
          }
        }
        subtotal
        total
        isEmpty
      }
    }

  }
`;

