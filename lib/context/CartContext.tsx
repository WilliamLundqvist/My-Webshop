"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useSWR from 'swr';
import { 
  getCart as fetchCart, 
  addToCart as apiAddToCart,
  // Andra cart-funktioner...
} from '@/lib/services/cartService';

// Mer explicit typning
interface CartContextType {
  cart: any;
  loading: boolean;
  error: any;
  addToCart: (productId: number, quantity: number, variationId?: number | null) => Promise<boolean>;
  refreshCart: () => Promise<any>;
  // Fler metoder...
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // SWR för att hantera cart data
  const { 
    data: cart, 
    error: fetchError, 
    mutate: refreshCart 
  } = useSWR('cart', fetchCart, {
    refreshInterval: 60000,
    revalidateOnFocus: true
  });

  const loading = !cart && !fetchError || actionInProgress;

  // Centraliserad addToCart funktion
  const addToCart = async (productId: number, quantity: number, variationId?: number | null) => {
    setActionInProgress(true);
    setActionError(null);
    
    try {
      // Anropa API
      const updatedCart = await apiAddToCart(productId, quantity, variationId);
      
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

  // Liknande funktioner för updateCartItem, removeCartItem, etc...

  const value = {
    cart,
    loading,
    error: fetchError || actionError,
    addToCart,
    refreshCart,
    // Andra cart-funktioner...
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