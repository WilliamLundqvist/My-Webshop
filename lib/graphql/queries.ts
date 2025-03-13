
import { gql, TypedDocumentNode } from "@apollo/client";
import { GetCartQuery, GetFooterLayoutQuery, GetHeaderLayoutQuery, GetProductBySlugQuery, GetProductsQuery, GetViewerQuery } from "./generated/graphql";

export const GET_PRODUCTS: TypedDocumentNode<GetProductsQuery> = gql`
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

    export const GET_VIEWER: TypedDocumentNode<GetViewerQuery> = gql`
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

export const GET_PRODUCT_BY_SLUG: TypedDocumentNode<GetProductBySlugQuery> = gql`
 query getProductBySlug($slug: [String]) {
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
        databaseId
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

export const GET_FOOTER_LINKS: TypedDocumentNode<GetFooterLayoutQuery> = gql`
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

export const GET_HEADER_LINKS: TypedDocumentNode<GetHeaderLayoutQuery> = gql`
  query GetHeaderLayout {
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

export const GET_CART: TypedDocumentNode<GetCartQuery> = gql`
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
        itemCount
      }
      subtotal
      total
      isEmpty
    }
  }
`;

