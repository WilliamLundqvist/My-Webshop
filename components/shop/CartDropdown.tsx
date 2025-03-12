"use client";
import { useCart } from "@/lib/context/CartContext";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";


export default function CartDropdown() {
  const { cart, loading, refreshCart } = useCart();
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
        
        {/* Badge med antal produkter */}
        {!loading && cart && cart.contentsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cart.contentsCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Din kundvagn</h2>
          </div>

          {loading ? (
            <div className="p-4 text-center">Laddar...</div>
          ) : !cart || cart.isEmpty ? (
            <div className="p-4 text-center">
              <p>Din kundvagn är tom</p>
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto p-2">
                {cart.contents.nodes.map((item: any) => {
                  const product = item.product.node;
                  const variation = item.variation?.node;
                  
                  // Hitta attribut (färg, storlek, etc) om det finns
                  const attributes = variation?.attributes?.nodes || [];
                  const color = attributes.find((attr: any) => 
                    attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "färg"
                  )?.value;
                  const size = attributes.find((attr: any) => 
                    attr.name.toLowerCase() === "size" || attr.name.toLowerCase() === "storlek"
                  )?.value;
                  
                  return (
                    <div key={item.key} className="flex py-2 border-b">
                      {/* Produktbild */}
                      {product.image?.sourceUrl && (
                        <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={product.image.sourceUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Produktinfo */}
                      <div className="flex-1 min-w-0">
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
                        <div className="flex justify-between mt-1">
                          <span className="text-xs">
                            Antal: {item.quantity}
                          </span>
                          <span 
                            className="text-sm font-medium" 
                            dangerouslySetInnerHTML={{ __html: item.total }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
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
