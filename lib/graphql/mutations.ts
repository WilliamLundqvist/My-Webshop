import { gql } from "@apollo/client";


export const ADD_TO_CART = gql`
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

export const GET_CART = gql`
  query GetCart {
    cart {
      contents {
        nodes {
          key
          product {
            node {
              id
              name
              slug
              image {
                sourceUrl
              }
            }
          }
          variation {
            node {
              id
              name
              attributes {
                nodes {
                  name
                  value
                }
              }
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
`;
