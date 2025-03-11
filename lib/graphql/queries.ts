
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
      where: {
        orderby: $orderby
        search: $search
        category: $category
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
  products(where: {slugIn: $slug}) {
    nodes {
      ... on SimpleProduct {
        id
        name
        description(format: RAW)
        slug
        sku
        price(format: FORMATTED)
        image {
          sourceUrl
        }
      }
      ... on VariableProduct {
        id
        name
        description(format: RAW)
        slug
        sku
        price(format: FORMATTED)
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

export const GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION = gql`
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

export const GET_PRODUCT_COUNT = gql`
  query GetProductCount($search: String, $category: String) {
    products(
      where: {
        search: $search
        category: $category
      }
    ) {
      found
    }
  }
`;
