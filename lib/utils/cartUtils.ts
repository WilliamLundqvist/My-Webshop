"use client";

import { CartType, CartItemType, SimpleCartItemType } from "@/types/cart";

/**
 * Typskydd för att kontrollera typen av kundvagnsobjekt
 */
export function isSimpleCartItem(item: CartItemType): item is SimpleCartItemType {
  return item.__typename === "SimpleCartItem";
}

/**
 * Säker åtkomst till kundvagnsinnehåll med typskydd
 */
export function getCartItems(cart: CartType | null): CartItemType[] {
  return cart?.contents?.nodes || [];
}

/**
 * Säker åtkomst till kundvagnens totalsumma
 */
export function getCartTotal(cart: CartType | null): string {
  return cart?.total || "0";
}

/**
 * Säker åtkomst till kundvagnens antal produkter
 */
export function getCartItemCount(cart: CartType | null): number {
  return cart?.contents?.itemCount || 0;
}

/**
 * Kontrollera om kundvagnen är tom
 */
export function isCartEmpty(cart: CartType | null): boolean {
  return (
    !cart || cart.isEmpty === true || !cart.contents?.nodes?.length || cart.contents.itemCount === 0
  );
}

/**
 * Hjälpfunktion för att hämta attribut för en produkt i kundvagnen
 */
export function getCartItemAttribute(
  item: CartItemType,
  attributeName: string
): string | undefined {
  const variation = item.variation?.node;

  if (!variation?.attributes?.nodes) {
    return undefined;
  }

  return variation.attributes.nodes.find(
    (attr) => attr.name?.toLowerCase() === attributeName.toLowerCase()
  )?.value;
}

/**
 * Hämta färg för en produkt i kundvagnen
 */
export function getCartItemColor(item: CartItemType): string | undefined {
  return getCartItemAttribute(item, "color") || getCartItemAttribute(item, "färg");
}

/**
 * Hämta storlek för en produkt i kundvagnen
 */
export function getCartItemSize(item: CartItemType): string | undefined {
  return getCartItemAttribute(item, "size") || getCartItemAttribute(item, "storlek");
}

/**
 * Säker åtkomst till produkt för ett kundvagnsobjekt
 */
export function getCartItemProduct(item: CartItemType): any {
  return item.product?.node;
}
