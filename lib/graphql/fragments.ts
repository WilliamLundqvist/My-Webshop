import { gql } from "@apollo/client";

export const cartFragment = gql`
  fragment CartFragment on Cart {
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
            image {
              sourceUrl
            }
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
      itemCount
    }
    subtotal
    total
    isEmpty
  }
`;
