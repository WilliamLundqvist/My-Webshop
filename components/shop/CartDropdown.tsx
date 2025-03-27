'use client';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { formatPrice } from '@/lib/utils/formatters';
import { CartItemType } from '@/types/cart';
import {
  getCartItems,
  isCartEmpty as checkCartEmpty,
  getCartItemCount,
  getCartItemColor,
  getCartItemSize,
  getCartTotal,
} from '@/lib/utils/cartUtils';

export default function CartDropdown() {
  const {
    cart,
    loading,
    processingItems,
    dropdownOpen,
    setDropdownOpen,
    removeCartItem,
    updateCartItem,
  } = useCart();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  // Använd hjälpfunktioner för säkrare typkontroll
  const cartItems = getCartItems(cart);
  const hasCartData = cartItems.length > 0;
  const isCartEmpty = checkCartEmpty(cart);
  const itemCount = getCartItemCount(cart);

  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(() => {
    const quantities: Record<string, number> = {};
    cartItems.forEach((item) => {
      quantities[item.key] = item.quantity || 0;
    });
    return quantities;
  });

  useEffect(() => {
    if (cartItems.length > 0) {
      const newQuantities: Record<string, number> = {};
      cartItems.forEach((item) => {
        newQuantities[item.key] = item.quantity || 0;
      });
      setItemQuantities(newQuantities);
    }
  }, [cart, cartItems]);

  const debouncedUpdateCartItem = useDebounce(
    (input: { key: string; quantity: number }) => updateCartItem(input),
    700,
    [updateCartItem]
  );

  const handleQuantityChange = (key: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [key]: newQuantity,
    }));
    debouncedUpdateCartItem({ key, quantity: newQuantity });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Icon */}
      <Button
        className="relative"
        variant="ghost"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Visa kundvagn"
      >
        <ShoppingCart className="w-6 h-6" />

        {/* Badge med antal produkter - visa alltid om vi har data */}
        {hasCartData && itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-50">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Din kundvagn</h2>
          </div>

          {!hasCartData && loading ? (
            <div className="p-4 text-center">Laddar...</div>
          ) : isCartEmpty ? (
            <div className="p-4 text-center">
              <p>Din kundvagn är tom</p>
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto p-2">
                {cartItems.map((item: CartItemType) => {
                  const product = item.product.node;
                  const variation = item.variation?.node;
                  const isProcessing = processingItems.includes(item.key);

                  // Använd hjälpfunktionerna för att hämta färg och storlek
                  const color = getCartItemColor(item);
                  const size = getCartItemSize(item);

                  return (
                    <div
                      key={item.key}
                      className={`flex gap-2 py-2 border-b ${isProcessing ? 'opacity-70' : ''}`}
                    >
                      {/* Produktbild */}
                      {variation?.image?.sourceUrl ? (
                        <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={variation.image.sourceUrl}
                            alt={variation.name || product.name}
                            className="w-full h-full object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={product.image.sourceUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                      )}

                      {/* Produktinfo */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        {(color || size) && (
                          <p className="text-xs text-gray-500">
                            {color && <span>Färg: {color}</span>}
                            {color && size && <span> | </span>}
                            {size && <span>Storlek: {size}</span>}
                          </p>
                        )}
                        <div className="flex items-end mt-auto justify-between">
                          <span className="text-xs">Antal: {itemQuantities[item.key]}</span>
                          <span className="text-sm font-medium">{formatPrice(item.total)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <Button
                          className="w-full"
                          variant="destructive"
                          onClick={() => removeCartItem([item.key], false)}
                          disabled={isProcessing || processingItems.length > 0}
                        >
                          <Trash2 className="w-2 h-2" />
                        </Button>
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            className={`${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isProcessing || processingItems.length > 0}
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(item.key, itemQuantities[item.key] - 1)
                            }
                            size="icon"
                          >
                            <Minus className="w-2 h-2" />
                          </Button>
                          <Button
                            className={`${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isProcessing || processingItems.length > 0}
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(item.key, itemQuantities[item.key] + 1)
                            }
                            size="icon"
                          >
                            <Plus className="w-2 h-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Visa loading-indikator om data uppdateras */}

              {/* Totalsumma och knappar */}
              {!checkCartEmpty(cart) && (
                <div className="p-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Totalt:</span>
                    <span className="font-bold">{formatPrice(getCartTotal(cart))}</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/cart"
                      className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Visa kundvagn
                    </Link>
                    <Link
                      href="/checkout"
                      className="w-full bg-black text-white py-2 px-4 rounded text-center hover:bg-gray-900"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Till kassan
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
