'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useSWR from 'swr';
import {
  getCart as fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from '@/lib/services/cartService';
import {
  GetCartQuery,
  UpdateCartItemQuantitiesMutationVariables,
  AddToCartMutationVariables,
} from '../graphql/generated/graphql';
import { useRouter } from 'next/navigation';

// Mer explicit typning
interface CartContextType {
  cart: GetCartQuery['cart'];
  loading: boolean;
  processingItems: string[];
  error: Error | null;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  addToCart: (productId: AddToCartMutationVariables) => Promise<boolean>;
  refreshCart: () => Promise<GetCartQuery['cart']>;
  updateCartItem: (items: UpdateCartItemQuantitiesMutationVariables) => Promise<boolean>;
  removeCartItem: (keys: string[], all: boolean) => Promise<boolean>;
}

// Tom kundvagn för fallback
const emptyCart = {
  contents: {
    nodes: [],
    itemCount: 0,
  },
  subtotal: '0',
  total: '0',
  isEmpty: true,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // SWR för att hantera cart data
  const {
    data: cart,
    error: fetchError,
    mutate: refreshCart,
    isValidating,
  } = useSWR('cart', fetchCart, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
    fallbackData: emptyCart,
    keepPreviousData: true, // Behåll tidigare data medan ny data hämtas
    revalidateIfStale: true,
    dedupingInterval: 2000, // Förhindra för många förfrågningar på kort tid
  });

  // Centraliserad addToCart funktion
  const addToCart = async (input: AddToCartMutationVariables) => {
    setActionInProgress(true);
    setActionError(null);

    try {
      const updatedCart = await apiAddToCart(input);

      // Om vi får false tillbaka, betyder det att användaren behöver logga in
      if (updatedCart === false) {
        setActionInProgress(false);
        // Omdirigera till inloggningssidan
        router.push('/login');
        return false;
      }

      // Uppdatera global cart state endast om API-anropet lyckas
      // Använd false för revalidate för att använda den returnerade datan direkt
      await refreshCart(updatedCart as GetCartQuery['cart'], false);

      setActionInProgress(false);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to add to cart');

      // Vid fel, återställ till den ursprungliga datan
      await refreshCart();

      setActionInProgress(false);
      return false;
    }
  };

  const updateCartItem = async (items: UpdateCartItemQuantitiesMutationVariables) => {
    setActionInProgress(true);
    setActionError(null);

    try {
      // Optimistisk uppdatering kan implementeras här om det behövs

      const updatedCart = await apiUpdateCartItem(items);
      await refreshCart(updatedCart as GetCartQuery['cart'], false);

      setActionInProgress(false);
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to update cart item');

      // Vid fel, återställ till den ursprungliga datan
      await refreshCart();

      setActionInProgress(false);
      return false;
    }
  };

  const removeCartItem = async (keys: string[], all: boolean = false) => {
    setProcessingItems((prev) => [...prev, ...keys]);
    setActionInProgress(true);
    setActionError(null);

    try {
      // Optimistisk uppdatering kan implementeras här om det behövs

      const updatedCart = await apiRemoveCartItem(keys, all);
      await refreshCart(updatedCart as GetCartQuery['cart'], false);

      setActionInProgress(false);
      setProcessingItems((prev) => prev.filter((key) => !keys.includes(key)));
      return true;
    } catch (error) {
      console.error('Error removing cart item:', error);
      setActionError(error instanceof Error ? error.message : 'Failed to remove cart item');

      // Vid fel, återställ till den ursprungliga datan
      await refreshCart();

      setActionInProgress(false);
      setProcessingItems((prev) => prev.filter((key) => !keys.includes(key)));
      return false;
    }
  };

  const value = {
    cart: cart || emptyCart, // Använd tom kundvagn om cart är null
    loading: isValidating || actionInProgress, // Visa loading när någon operation pågår
    processingItems,
    error: fetchError || actionError,
    dropdownOpen,
    setDropdownOpen,
    addToCart,
    refreshCart,
    updateCartItem,
    removeCartItem,
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
