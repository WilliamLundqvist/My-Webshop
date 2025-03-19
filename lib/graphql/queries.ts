import { gql, TypedDocumentNode } from "@apollo/client";

// När typerna har genererats korrekt, ta bort kommentarerna nedan

import {
  GetCartQuery,
  GetFooterLayoutQuery,
  GetHeaderLayoutQuery,
  GetProductBySlugQuery,
  GetProductsQuery,
  GetCategoriesAndUnderCategoriesBySectionQuery,
  GetProductCountQuery,
  GetProductsQueryVariables,
  GetProductBySlugQueryVariables,
  GetFooterLayoutQueryVariables,
  GetHeaderLayoutQueryVariables,
  GetProductCountQueryVariables,
  GetCartQueryVariables,
  GetCategoriesAndUnderCategoriesBySectionQueryVariables,
  GetViewerQuery,
} from "./generated/graphql";
import { cartFragment } from "./fragments";
export const GET_PRODUCTS: TypedDocumentNode<GetProductsQuery, GetProductsQueryVariables> = gql`
  query GetProducts(
    $first: Int
    $after: String
    $orderby: [ProductsOrderbyInput]
    $search: String
    $category: String
    $maxPrice: Float
    $minPrice: Float
  ) {
    products(
      first: $first
      after: $after
      where: {
        orderby: $orderby
        search: $search
        category: $category
        maxPrice: $maxPrice
        minPrice: $minPrice
      }
    ) {
      nodes {
        id
        name
        description
        slug
        ... on SimpleProduct {
          price(format: FORMATTED)
          stockStatus
          regularPrice(format: FORMATTED)
          onSale
          galleryImages {
            nodes {
              sourceUrl
            }
          }
        }
        image {
          sourceUrl
        }
        ... on VariableProduct {
          stockStatus
          price(format: FORMATTED)
          regularPrice(format: FORMATTED)
          onSale
          galleryImages {
            nodes {
              sourceUrl
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_VIEWER: TypedDocumentNode<GetViewerQuery> = gql`
  query GetViewer {
    viewer {
      name
      email
    }
  }
`;

export const GET_PRODUCT_BY_SLUG: TypedDocumentNode<
  GetProductBySlugQuery,
  GetProductBySlugQueryVariables
> = gql`
  query GetProductBySlug($slug: [String]) {
    products(where: { slugIn: $slug }) {
      nodes {
        ... on SimpleProduct {
          id
          name
          description(format: RAW)
          slug
          sku
          databaseId

          price(format: FORMATTED)
          regularPrice(format: FORMATTED)
          onSale
          image {
            sourceUrl
          }
        }
        ... on VariableProduct {
          id
          databaseId
          name
          description(format: RAW)
          slug
          sku
          price(format: FORMATTED)
          regularPrice(format: FORMATTED)
          onSale
          attributes {
            nodes {
              name
              options
              variation
            }
          }
          variations {
            nodes {
              id
              databaseId
              name
              price(format: FORMATTED)
              stockStatus
              attributes {
                nodes {
                  name
                  value
                }
              }
              image {
                sourceUrl
              }
            }
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

export const GET_FOOTER_LINKS: TypedDocumentNode<
  GetFooterLayoutQuery,
  GetFooterLayoutQueryVariables
> = gql`
  query GetFooterLayout {
    footerMenuItems: menuItems(where: { location: FOOTER }) {
      nodes {
        id
        label
        uri
      }
    }
  }
`;

export const GET_HEADER_LINKS: TypedDocumentNode<
  GetHeaderLayoutQuery,
  GetHeaderLayoutQueryVariables
> = gql`
  query GetHeaderLayout {
    generalSettings {
      title
      description
    }
    primaryMenuItems: menuItems(where: { location: PRIMARY }) {
      nodes {
        id
        label
        uri
        databaseId
      }
    }
  }
`;

export const GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION: TypedDocumentNode<
  GetCategoriesAndUnderCategoriesBySectionQuery,
  GetCategoriesAndUnderCategoriesBySectionQueryVariables
> = gql`
  query GetCategoriesAndUnderCategoriesBySection($section: ID!) {
    productCategory(id: $section, idType: SLUG) {
      name
      slug
      children {
        nodes {
          id
          name
          slug
          children {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_COUNT: TypedDocumentNode<
  GetProductCountQuery,
  GetProductCountQueryVariables
> = gql`
  query GetProductCount($search: String, $category: String) {
    products(where: { search: $search, category: $category }) {
      found
    }
  }
`;

export const GET_CART: TypedDocumentNode<GetCartQuery, GetCartQueryVariables> = gql`
  query GetCart {
    cart {
      ...CartFragment
    }
  }
  ${cartFragment}
`;

export const GET_CUSTOMER = gql`
  query GetCustomer {
    customer {
      firstName
      lastName
      email
      billing {
        firstName
        lastName
        address1
        address2
        city
        state
        postcode
        country
        email
        phone
        company
      }
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
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentGateways {
      nodes {
        id
        title
        description
        icon
      }
    }
  }
`;
