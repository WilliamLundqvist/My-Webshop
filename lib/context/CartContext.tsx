"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useSWR from 'swr';
import {
  getCart as fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem
} from '@/lib/services/cartService';
import { GetCartQuery, UpdateCartItemQuantitiesMutationVariables, AddToCartMutationVariables } from '../graphql/generated/graphql';
import { useRouter } from 'next/navigation';

// Mer explicit typning
interface CartContextType {
  cart: GetCartQuery['cart'];
  loading: boolean;
  error: any;
  addToCart: (productId: AddToCartMutationVariables) => Promise<boolean>;
  refreshCart: () => Promise<any>;
  updateCartItem: (items: UpdateCartItemQuantitiesMutationVariables) => Promise<boolean>;
  removeCartItem: (keys: string[], all: boolean) => Promise<boolean>;
  // Fler metoder...
}

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // SWR för att hantera cart data
  const {
    data: cart,
    error: fetchError,
    mutate: refreshCart
  } = useSWR('cart', fetchCart, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
    fallbackData: emptyCart // Använd tom kundvagn som fallback
  });

  const loading = !cart && !fetchError || actionInProgress;

  // Centraliserad addToCart funktion
  const addToCart = async (input: AddToCartMutationVariables) => {
    setActionInProgress(true);
    setActionError(null);

    try {
      // Anropa API
      const updatedCart = await apiAddToCart(input);

      // Om vi får false tillbaka, betyder det att användaren behöver logga in
      if (updatedCart === false) {
        setActionInProgress(false);
        // Omdirigera till inloggningssidan
        router.push('/login');
        return false;
      }

      // Uppdatera global cart state endast om API-anropet lyckas
      await refreshCart(updatedCart);

      setActionInProgress(false);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to add to cart');
      setActionInProgress(false);
      return false;
    }
  };

  const updateCartItem = async (items: UpdateCartItemQuantitiesMutationVariables) => {
    setActionInProgress(true);
    setActionError(null);

    try {
      const updatedCart = await apiUpdateCartItem(items);
      await refreshCart(updatedCart);
      setActionInProgress(false);
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to update cart item');
      setActionInProgress(false);
      return false;
    }
  };

  const removeCartItem = async (keys: string[], all: boolean = false) => {
    setActionInProgress(true);

    try {
      const updatedCart = await apiRemoveCartItem(keys, all);
      await refreshCart(updatedCart);
      setActionInProgress(false);
      return true;
    } catch (error) {
      console.error('Error removing cart item:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to remove cart item');
      setActionInProgress(false);
      return false;
    }
  };

  const value = {
    cart: cart || emptyCart, // Använd tom kundvagn om cart är null
    loading,
    error: fetchError || actionError,
    addToCart,
    refreshCart,
    updateCartItem,
    removeCartItem
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 