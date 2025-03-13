import { GetProductBySlugQuery, GetProductsQuery } from "@/lib/graphql/generated/graphql";

export interface Category {
    id: string;
    name: string;
    slug: string;
    children?: {
        nodes: {
            id: string;
            name: string;
            slug: string;
            children?: {
                nodes: {
                    id: string;
                    name: string;
                    slug: string;
                }[];
            };
        }[];
    };
}

export type Products = GetProductsQuery;

// Typer för att förenkla åtkomst till produktnoder
export type ProductNode = NonNullable<Products['products']>['nodes'][number];
export type SimpleProductNode = Extract<ProductNode, { __typename?: 'SimpleProduct' }>;
export type VariableProductNode = Extract<ProductNode, { __typename?: 'VariableProduct' }>;
export type GroupProductNode = Extract<ProductNode, { __typename?: 'GroupProduct' }>;
export type ExternalProductNode = Extract<ProductNode, { __typename?: 'ExternalProduct' }>;

// Alla hjälpfunktioner har flyttats till lib/utils/productUtils.ts

export type Product = GetProductBySlugQuery['products']['nodes'][number];
