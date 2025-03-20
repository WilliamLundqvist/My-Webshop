"use client";
import React, { useState, useEffect } from "react";
import {
  getCartItems,
  isCartEmpty as checkCartEmpty,
  getCartItemColor,
  getCartItemSize,
} from "@/lib/utils/cartUtils";
import { useCart } from "@/lib/context/CartContext";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { CartItemType } from "@/types/cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/formatters";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CartPage = () => {
  const { cart, loading, processingItems, removeCartItem, updateCartItem } = useCart();

  const cartItems = getCartItems(cart);
  const isCartEmpty = checkCartEmpty(cart);

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
    <div className="contaner max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {isCartEmpty ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>Pris</TableHead>
                <TableHead>Antal</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item: CartItemType) => {
                const product = item.product.node;
                const variation = item.variation?.node;
                const isProcessing = processingItems.includes(item.key);

                const color = getCartItemColor(item);
                const size = getCartItemSize(item);

                return (
                  <TableRow key={item.key}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {variation?.image?.sourceUrl ? (
                          <Image
                            src={variation.image.sourceUrl}
                            alt={variation.name || product.name}
                            className="w-24 h-24 object-cover rounded"
                            width={96}
                            height={96}
                          />
                        ) : (
                          <Image
                            src={product.image.sourceUrl}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded"
                            width={96}
                            height={96}
                          />
                        )}
                        <div className="ml-2">
                          <div className="font-medium">{product.name}</div>
                          {color && <div className="text-sm text-gray-500">Färg: {color}</div>}
                          {size && <div className="text-sm text-gray-500">Storlek: {size}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatPrice(
                        item.product.node.__typename === "SimpleProduct" ||
                          item.product.node.__typename === "VariableProduct"
                          ? item.product.node.price
                          : "Pris saknas"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item.key, itemQuantities[item.key] - 1)
                          }
                          disabled={isProcessing || processingItems.length > 0}
                          size="icon"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium">{itemQuantities[item.key] || 0}</span>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item.key, itemQuantities[item.key] + 1)
                          }
                          disabled={isProcessing || processingItems.length > 0}
                          size="icon"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(item.total)}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => removeCartItem([item.key], false)}
                        disabled={isProcessing || processingItems.length > 0}
                        size="icon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Visa loading-indikator om data uppdateras */}
          {loading && (
            <div className="p-2 flex gap-2 items-center justify-center text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uppdaterar...
            </div>
          )}

          {/* Totalsumma och knappar */}
          <div className="p-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Totalt:</span>
              <span className="font-bold">{cart?.total ? formatPrice(cart.total) : "0 kr"}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <Link
                href="/cart"
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300"
              >
                Visa kundvagn
              </Link>
              <Link
                href="/checkout"
                className="w-full bg-black text-white py-2 px-4 rounded text-center hover:bg-gray-900"
              >
                Till kassan
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
