import { getAuthClient } from '@faustwp/experimental-app-router';
import { gql } from '@apollo/client';
import { NextRequest, NextResponse } from 'next/server';
import { GET_CART, ADD_TO_CART } from '@/lib/graphql/mutations';
// GraphQL queries and mutations

export async function GET() {
    try {
        const client = await getAuthClient();
        const { data } = await client.query({
            query: GET_CART,
            fetchPolicy: 'network-only'
        });

        return NextResponse.json({ cart: data.cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { productId, quantity, variationId } = await request.json();

        const client = await getAuthClient();
        const input = {
            clientMutationId: 'add_to_cart',
            productId,
            quantity,
            variationId
        };

        const { data } = await client.mutate({
            mutation: ADD_TO_CART,
            variables: { input }
        });

        return NextResponse.json({ cart: data.addToCart.cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
    }
}

// Du kan lägga till fler metoder som PUT för update och DELETE för remove 