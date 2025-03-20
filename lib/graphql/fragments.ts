import { gql, TypedDocumentNode } from "@apollo/client";
import { GetHomepageQuery, HeroFragmentFragment } from "./generated/graphql";

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
            ... on SimpleProduct {
              price(format: FORMATTED)
              stockStatus
              regularPrice(format: FORMATTED)
              onSale
            }
            ... on VariableProduct {
              stockStatus
              price(format: FORMATTED)
              regularPrice(format: FORMATTED)
              onSale
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

export const heroFragment: TypedDocumentNode<HeroFragmentFragment> = gql`
  fragment HeroFragment on Page {
    hero {
      heroButton1 {
        url
        title
      }
      heroButton2 {
        url
        title
      }
      heroHeading
      heroImage {
        node {
          sourceUrl
          title
          altText
        }
      }
      heroSubheading
    }
  }
`;
