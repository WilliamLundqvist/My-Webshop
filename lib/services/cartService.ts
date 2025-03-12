
import { gql } from '@apollo/client';

// Cart mutations
const ADD_TO_CART = gql`
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
        contentsCount
      }
    }
  }
`;

const GET_CART = gql`
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
      contentsCount
    }
  }
`;

// Fler mutations för UPDATE, REMOVE, etc.

// Client-side cart service
export async function getCart() {
    try {
        const response = await fetch('/api/cart', {
            method: 'GET',
            credentials: 'include', // Viktigt för att skicka cookies!
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }

        const data = await response.json();
        return data.cart;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return null;
    }
}

export async function addToCart(productId, quantity = 1, variationId = null) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Viktigt för att skicka cookies!
            body: JSON.stringify({
                productId,
                quantity,
                variationId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add to cart');
        }

        const data = await response.json();
        return data.cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

// Implementera updateCartItem, removeCartItem, etc. på liknande sätt 