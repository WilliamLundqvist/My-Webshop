export interface Product {
    id: string;
    name: string;
    description?: string;
    slug: string;
    sku?: string;
    price?: string;
    stockStatus?: string;
    image?: {
        sourceUrl: string;
    };
} 