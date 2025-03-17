"use client";
import { useCart } from "@/lib/context/CartContext";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Custom hook för att lyssna på ändringar i kundvagnen


export default function CartDropdown() {
  const { cart, loading, processingItems, removeCartItem, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);


  // Stäng dropdown när man klickar utanför
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Kontrollera om vi har data att visa, även om loading är true
  const hasCartData = cart && cart.contents && cart.contents.nodes;
  const isCartEmpty = !hasCartData || cart.isEmpty || cart.contents.itemCount === 0;

  // State to track item quantities for optimistic updates
  const [itemQuantities, setItemQuantities] = useState(() => {
    const quantities = {};
    if (cart && cart.contents && cart.contents.nodes) {
      cart.contents.nodes.forEach((item) => {
        quantities[item.key] = item.quantity;
      });
    }
    return quantities;
  });

  // Uppdatera itemQuantities när cart ändras
  useEffect(() => {
    if (cart && cart.contents && cart.contents.nodes) {
      const newQuantities = {};
      cart.contents.nodes.forEach((item) => {
        newQuantities[item.key] = item.quantity;
      });
      setItemQuantities(newQuantities);
    }
    setIsOpen(true);
  }, [cart]);

  // Function to handle quantity change
  const handleQuantityChange = (key: string, newQuantity: number) => {
    // Förhindra att minska antalet under 1
    if (newQuantity < 1) {
      return;
    }

    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [key]: newQuantity,
    }));
    debouncedUpdateCartItem({ key, quantity: newQuantity });
  };

  // Debounced update cart item function
  const debouncedUpdateCartItem = useCallback(debounce(updateCartItem, 700), []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Icon */}
      <Button
        className="relative"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Visa kundvagn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>

        {/* Badge med antal produkter - visa alltid om vi har data */}
        {hasCartData && cart.contents.itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cart.contents.itemCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
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
                {cart.contents.nodes.map((item: any) => {
                  const product = item.product.node;
                  const variation = item.variation?.node;
                  const isProcessing = processingItems.includes(item.key);

                  // Hitta attribut (färg, storlek, etc) om det finns
                  const attributes = variation?.attributes?.nodes || [];
                  const color = attributes.find((attr: any) =>
                    attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "färg"
                  )?.value;
                  const size = attributes.find((attr: any) =>
                    attr.name.toLowerCase() === "size" || attr.name.toLowerCase() === "storlek"
                  )?.value;

                  return (
                    <div key={item.key} className={`flex gap-2 py-2 border-b ${isProcessing ? 'opacity-70' : ''}`}>
                      {/* Produktbild */}
                      {variation?.image?.sourceUrl && (
                        <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={variation.image.sourceUrl}
                            alt={variation.name || product.name}
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
                          <span className="text-xs">
                            Antal: {itemQuantities[item.key]}
                          </span>
                          <span
                            className="text-sm font-medium"
                            dangerouslySetInnerHTML={{ __html: item.total }}
                          />
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
                          <Button className={`${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isProcessing || processingItems.length > 0} variant="outline" onClick={() => handleQuantityChange(item.key, itemQuantities[item.key] - 1)} size="icon"><Minus className="w-2 h-2" /></Button>
                          <Button className={`${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isProcessing || processingItems.length > 0} variant="outline" onClick={() => handleQuantityChange(item.key, itemQuantities[item.key] + 1)} size="icon"><Plus className="w-2 h-2" /></Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Visa loading-indikator om data uppdateras */}
              {loading && (
                <div className="p-2 flex gap-2     items-center justify-center text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uppdaterar...
                </div>
              )}

              {/* Totalsumma och knappar */}
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Totalt:</span>
                  <span
                    className="font-bold"
                    dangerouslySetInnerHTML={{ __html: cart.total }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/cart"
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Visa kundvagn
                  </Link>
                  <Link
                    href="/checkout"
                    className="w-full bg-black text-white py-2 px-4 rounded text-center hover:bg-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Till kassan
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
