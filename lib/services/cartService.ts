"use server";
import { getAuthClient } from '@faustwp/experimental-app-router';
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM } from '@/lib/graphql/mutations';
import { GET_CART } from '@/lib/graphql/queries';
import { AddToCartMutationVariables, UpdateCartItemQuantitiesMutationVariables } from "../graphql/generated/graphql";
import { cookies } from "next/headers";

// Tom kundvagn för fallback
const emptyCart = {
  contents: {
    nodes: [],
    itemCount: 0
  },
  subtotal: "0",
  total: "0",
  isEmpty: true
};

// Client-side cart service
export async function getCart() {
    try {
        // Hämta GraphQL-klienten direkt
        const client = await getAuthClient();
        
        if (!client) {
            console.log('User not authenticated, returning empty cart');
            return emptyCart;
        }
        
        console.log('Client obtained successfully, fetching cart data');
        const { data } = await client.query({
            query: GET_CART,
            fetchPolicy: 'network-only'
        });
        
        console.log('Cart data fetched successfully');
        return data.cart;
    } catch (error) {
        console.error('Error fetching cart:', error);
        // Returnera en tom kundvagn vid fel
        return emptyCart;
    }
}

export async function addToCart(variables: AddToCartMutationVariables) {
    try {
        console.log('Adding to cart:', variables);
        
        // Hämta GraphQL-klienten direkt
        const client = await getAuthClient();
        
        if (!client) {
            console.log('User not authenticated, cannot add to cart');
            return false;
        }
        
        // Extrahera input från variables
        const input = variables.input;
        
        console.log('Sending to GraphQL:', { input });
        const { data } = await client.mutate({
            mutation: ADD_TO_CART,
            variables: { input }
        });
        
        console.log('Add to cart response:', data);
        return data.addToCart.cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

export async function updateCartItem(variables: UpdateCartItemQuantitiesMutationVariables) {
    try {
        console.log('Updating cart item:', variables);
        
        // Hämta GraphQL-klienten direkt
        const client = await getAuthClient();
        
        if (!client) {
            console.log('User not authenticated, cannot update cart');
            return false;
        }
        
        // Extrahera key och quantity från variables
        const { key, quantity } = variables;
        
        console.log('Sending to GraphQL:', { key, quantity });
        const { data } = await client.mutate({
            mutation: UPDATE_CART_ITEM,
            variables: { key, quantity }
        });
        
        console.log('Update cart response:', data);
        return data.updateItemQuantities.cart;
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
}

export async function removeCartItem(keys: string[], all: boolean = false) {
    try {
        console.log('Removing from cart:', { keys, all });
        
        // Hämta GraphQL-klienten direkt
        const client = await getAuthClient();
        
        if (!client) {
            console.log('User not authenticated, cannot remove from cart');
            return false;
        }
        
        console.log('Sending to GraphQL:', { keys, all });
        const { data } = await client.mutate({
            mutation: REMOVE_FROM_CART,
            variables: { keys, all }
        });
        
        console.log('Remove from cart response:', data);
        return data.removeItemsFromCart.cart;
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
}
