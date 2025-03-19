/**
 * Typer för kundvagnsdata
 */
import { GetCartQuery } from "@/lib/graphql/generated/graphql";

// Basera typer på GraphQL-genererade typer, precis som för produkter
export type CartData = GetCartQuery;
export type CartType = NonNullable<CartData["cart"]>;
export type CartItemType = CartType["contents"]["nodes"][number];

// Extrahera specifika typer med Extract
export type SimpleCartItemType = Extract<CartItemType, { __typename?: "SimpleCartItem" }>;

// Typer för produkt- och variationsdata från cart items
export type ProductAttribute = {
  name: string;
  value: string;
};

export type ProductImage = {
  sourceUrl: string;
  altText?: string;
};

// Type guards och hjälpfunktioner kan flyttas till en utils-fil
// precis som med produkter i productUtils.ts

export interface ProductVariation {
  node: {
    name?: string;
    databaseId?: number;
    price?: string;
    regularPrice?: string;
    salePrice?: string;
    image?: ProductImage;
    attributes?: {
      nodes: ProductAttribute[];
    };
  };
}

export interface ProductNode {
  name: string;
  databaseId: number;
  description?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  featuredImage?: {
    node: ProductImage;
  };
}

export interface CartItem {
  key: string;
  quantity: number;
  total: string;
  subtotal?: string;
  product: {
    node: ProductNode;
  };
  variation?: ProductVariation;
}

export interface Cart {
  isEmpty?: boolean;
  total?: string;
  subtotal?: string;
  contents?: {
    itemCount: number;
    nodes: CartItem[];
  };
}

export interface CartContextType {
  cart: CartType | null;
  loading: boolean;
  processingItems: string[];
  addToCart: (input: any) => Promise<boolean>;
  updateCartItem: (input: { key: string; quantity: number }) => Promise<boolean>;
  removeCartItem: (keys: string[], clearAll?: boolean) => Promise<boolean>;
}
