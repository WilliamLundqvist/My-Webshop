export interface Product {
    products: {
        nodes: {
            id: string;
            name: string;
            description?: string;
            databaseId: number;
            slug: string;
            sku?: string;
            price?: string;
            stockStatus?: string;
            image?: {
                sourceUrl: string;
            };
            rating?: number;
            reviews?: number;
            attributes?: {
                nodes: {
                    name: string;
                    options: string[];
                }[];
            };
            variations?: {
                nodes: {
                    id: string;
                    databaseId: string;
                    name: string;
                    price: string;
                    stockStatus: string;
                    attributes: {
                        nodes: {
                            name: string;
                            value: string;
                        }[];
                    };
                    image: {
                        sourceUrl: string;
                    };
                }[];
            };
            galleryImages?: {
                nodes: {
                    sourceUrl: string;
                }[];
            };
            featuredImage?: {
                node: {
                    sourceUrl: string;
                };
            };
        }[];
    };
}


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

