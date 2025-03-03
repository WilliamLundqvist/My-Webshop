import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int
    $after: String
    $orderby: [ProductsOrderbyInput]
    $search: String
    $category: String
  ) {
    products(
      first: $first
      after: $after
      where: { orderby: $orderby, search: $search, category: $category }
    ) {
      nodes {
        id
        name
        description
        slug
        ... on SimpleProduct {
          price(format: RAW)
          stockStatus
        }
        image {
          sourceUrl
        }
        ... on VariableProduct {
          stockStatus
          price(format: FORMATTED)
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
export const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      name
          email
          posts {
            nodes {
              id
              title
            }
          }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GET_PRODUCT_BY_SLUG($slug: [String]) {
    products(where: { slugIn: $slug }) {
      nodes {
      ... on SimpleProduct {
        price(format: RAW)
        stockStatus
      }
      id
      name
      description(format: RAW)
      slug
      sku
      image {
        sourceUrl
      }
    }
  }
}
`;

export const GET_FOOTER_LINKS = gql`
  query GetLayout {
    footerMenuItems: menuItems(where: { location: FOOTER }) {
      nodes {
            id
            label
            uri
          }
        }
  }
`;

export const GET_HEADER_LINKS = gql`
  query GetLayout {
    generalSettings {
      title
          description
        }
        primaryMenuItems: menuItems(where: {location: PRIMARY}) {
          nodes {
            id
            label
            uri
            databaseId
          }
        }
  }
`;
