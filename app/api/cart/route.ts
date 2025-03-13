import { getAuthClient } from '@faustwp/experimental-app-router';
import { NextRequest, NextResponse } from 'next/server';
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM } from '@/lib/graphql/mutations';
import { GET_CART } from '@/lib/graphql/queries';
import { cookies } from 'next/headers';

// Struktur för en tom kundvagn
const emptyCart = {
    contents: {
        nodes: [],
        itemCount: 0
    },
    subtotal: "0",
    total: "0",
    isEmpty: true
};

export async function GET(request: NextRequest) {
    try {
      
        // Försök hämta klienten med explicit cookie-hantering
        const client = await getAuthClient();
        
        if (!client) {
            console.log('User not authenticated, returning empty cart');
            return NextResponse.json({ cart: emptyCart });
        }
        
        console.log('Client obtained successfully, fetching cart data');
        const { data } = await client.query({
            query: GET_CART,
            fetchPolicy: 'network-only'
        });

        console.log('Cart data fetched successfully');
        return NextResponse.json({ cart: data.cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ cart: emptyCart });
    }
}

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        console.log('POST request data:', requestData);
        
        // Extrahera input korrekt baserat på hur det skickas från cartService
        let input;
        if (requestData.input && requestData.input.input) {
            // Gamla formatet: { input: { input: {...} } }
            input = requestData.input.input;
        } else if (requestData.input) {
            // Nya formatet: { input: {...} }
            input = requestData.input;
        } else {
            console.error('Invalid input format:', requestData);
            return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
        }
        
        console.log('Processed input for ADD_TO_CART:', input);

        // Logga cookies för felsökning
        const requestCookies = request.headers.get('cookie');
        console.log('Request cookies:', requestCookies);
        
        // Hämta cookies från Next.js API
        const cookieStore = cookies();
        const allCookies = cookieStore.getAll();
        console.log('Next.js cookies:', allCookies);

        const client = await getAuthClient();
        if (!client) {
            return NextResponse.json({ error: 'Authentication required to add items to cart' }, { status: 401 });
        }
        
        console.log('Sending to GraphQL:', { input });
        const { data } = await client.mutate({
            mutation: ADD_TO_CART,
            variables: { input }
        });

        console.log('Add to cart response:', data);
        return NextResponse.json({ cart: data.addToCart.cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ error: 'Failed to add to cart', details: error.message }, { status: 500 });
    }
}

// Du kan lägga till fler metoder som PUT för update och DELETE för remove 

export async function DELETE(request: NextRequest) {
    try {
        const requestData = await request.json();
        console.log('DELETE request data:', requestData);
        
        // Extrahera keys och all från requestData
        const keys = requestData.keys;
        const all = requestData.all || false;
        
        if (!keys && !all) {
            console.error('Invalid input format:', requestData);
            return NextResponse.json({ error: 'Invalid input format: missing keys or all flag' }, { status: 400 });
        }
        
        console.log('Processed input for REMOVE_FROM_CART:', { keys, all });

        // Logga cookies för felsökning
        const requestCookies = request.headers.get('cookie');
        console.log('Request cookies:', requestCookies);
        
        // Hämta cookies från Next.js API
        const cookieStore = cookies();
        const allCookies = cookieStore.getAll();
        console.log('Next.js cookies:', allCookies);

        const client = await getAuthClient();
        if (!client) {
            return NextResponse.json({ error: 'Authentication required to remove items from cart' }, { status: 401 });
        }

        console.log('Sending to GraphQL:', { keys, all });
        const { data } = await client.mutate({
            mutation: REMOVE_FROM_CART,
            variables: { keys, all }
        });

        console.log('Remove from cart response:', data);
        return NextResponse.json({ cart: data.removeItemsFromCart.cart });
    } catch (error) {
        console.error('Error removing items from cart:', error);
        return NextResponse.json({ error: 'Failed to remove items from cart', details: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { items } = await request.json();

        const client = await getAuthClient();
        if (!client) {
            return NextResponse.json({ error: 'Authentication required to update cart items' }, { status: 401 });
        }

        const input = {
            items
        };

        const { data } = await client.mutate({
            mutation: UPDATE_CART_ITEM,
            variables: { input }
        });

        return NextResponse.json({ cart: data.updateItemQuantities.cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }
}

