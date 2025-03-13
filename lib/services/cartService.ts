"use server";
import { AddToCartInput, AddToCartMutationVariables, CartItemInput, UpdateCartItemQuantitiesMutation, UpdateCartItemQuantitiesMutationVariables } from "../graphql/generated/graphql";
import { cookies } from "next/headers";

// Hjälpfunktion för att få absolut URL
function getBaseUrl() {
  // I produktion, använd den faktiska domänen
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // I utvecklingsmiljö, använd localhost
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : '';
}

// Client-side cart service
export async function getCart() {
    try {
        const baseUrl = getBaseUrl();
        
        // Hämta alla cookies från Next.js cookies API
        let cookieHeader = '';
        try {
            // Detta fungerar bara i serverkomponenter
            const cookieStore = cookies();
            const allCookies = cookieStore.getAll();
            cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
            console.log('Server cookies:', cookieHeader);
        } catch (e) {
            // Om vi är på klientsidan, använd document.cookie
            if (typeof document !== 'undefined') {
                cookieHeader = document.cookie;
                console.log('Client cookies:', cookieHeader);
            }
        }
        
        const response = await fetch(`${baseUrl}/api/cart`, {
            method: 'GET',
            credentials: 'include', // Viktigt för att skicka cookies!
            headers: {
                'Cookie': cookieHeader, // Explicit skicka cookies
            }
        });

        // Även om vi får en 500-status, försöker vi tolka svaret
        const data = await response.json();
        
        // Om vi har cart-data, returnera den
        if (data && data.cart) {
            return data.cart;
        }
        
        // Annars returnera en tom kundvagn
        return {
            contents: {
                nodes: [],
                itemCount: 0
            },
            subtotal: "0",
            total: "0",
            isEmpty: true
        };
    } catch (error) {
        console.error('Error fetching cart:', error);
        // Returnera en tom kundvagn vid fel
        return {
            contents: {
                nodes: [],
                itemCount: 0
            },
            subtotal: "0",
            total: "0",
            isEmpty: true
        };
    }
}

export async function addToCart(input: AddToCartMutationVariables) {
    try {
        const baseUrl = getBaseUrl();
        
        // Hämta alla cookies från Next.js cookies API
        let cookieHeader = '';
        try {
            // Detta fungerar bara i serverkomponenter
            const cookieStore = cookies();
            const allCookies = cookieStore.getAll();
            cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
            console.log('Server cookies in addToCart:', cookieHeader);
        } catch (e) {
            // Om vi är på klientsidan, använd document.cookie
            if (typeof document !== 'undefined') {
                cookieHeader = document.cookie;
                console.log('Client cookies in addToCart:', cookieHeader);
            }
        }
        
        console.log('Sending to API:', input);
        
        const response = await fetch(`${baseUrl}/api/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader, // Explicit skicka cookies
            },
            credentials: 'include', // Viktigt för att skicka cookies!
            body: JSON.stringify(input) // Skicka input direkt utan att nesta det
        });

        if (!response.ok) {
            // Om vi får 401 (ej autentiserad), omdirigera till inloggningssidan
            if (response.status === 401) {
                // I en server-komponent kan vi inte använda router.push, så vi returnerar ett särskilt värde
                return false;
            }
            
            const errorText = await response.text();
            console.error('Server response error:', response.status, errorText);
            throw new Error(`Failed to add to cart: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data.cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

export async function updateCartItem(items: UpdateCartItemQuantitiesMutationVariables) {
    try {
        const baseUrl = getBaseUrl();
        
        // Hämta alla cookies från Next.js cookies API
        let cookieHeader = '';
        try {
            // Detta fungerar bara i serverkomponenter
            const cookieStore = cookies();
            const allCookies = cookieStore.getAll();
            cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
        } catch (e) {
            // Om vi är på klientsidan, använd document.cookie
            if (typeof document !== 'undefined') {
                cookieHeader = document.cookie;
            }
        }

        const response = await fetch(`${baseUrl}/api/cart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader, // Explicit skicka cookies
            },
            credentials: 'include', // Viktigt för att skicka cookies!
            body: JSON.stringify({
                items
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update cart item');
        }

        const data = await response.json();
        return data.cart;
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
}

export async function removeCartItem(keys: string[], all: boolean = false) {
    try {
        const baseUrl = getBaseUrl();
        
        // Hämta alla cookies från Next.js cookies API
        let cookieHeader = '';
        try {
            // Detta fungerar bara i serverkomponenter
            const cookieStore = cookies();
            const allCookies = cookieStore.getAll();
            cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
            console.log('Server cookies in removeCartItem:', cookieHeader);
        } catch (e) {
            // Om vi är på klientsidan, använd document.cookie
            if (typeof document !== 'undefined') {
                cookieHeader = document.cookie;
                console.log('Client cookies in removeCartItem:', cookieHeader);
            }
        }

        console.log('Removing from cart:', { keys, all });

        const response = await fetch(`${baseUrl}/api/cart`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader, // Explicit skicka cookies
            },
            credentials: 'include', // Viktigt för att skicka cookies!
            body: JSON.stringify({
                keys,
                all
            })
        });

        if (!response.ok) {
            // Om vi får 401 (ej autentiserad), omdirigera till inloggningssidan
            if (response.status === 401) {
                return false;
            }
            
            const errorText = await response.text();
            console.error('Server response error:', response.status, errorText);
            throw new Error(`Failed to remove cart item: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data.cart;
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
}
