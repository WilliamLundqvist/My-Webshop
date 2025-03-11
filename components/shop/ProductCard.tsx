"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";

import { useSearchParams } from "next/navigation";

export interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use search params hook to get current URL parameters
  const searchParams = useSearchParams();

  // Handle image which could be a string or an object with sourceUrl
  const imageUrl =
    typeof product.image === "string"
      ? product.image
      : product.image?.sourceUrl || "https://placehold.co/400x400";

  // Create product URL with preserved search parameters
  const createProductUrl = () => {
    // Create base product URL
    const baseUrl = `/shop/product/${product.slug}`;

    // If no search params exist, return just the base URL
    if (!searchParams || searchParams.toString() === "") {
      return baseUrl;
    }

    // Create a new URLSearchParams to hold the parameters we want to preserve
    const params = new URLSearchParams();

    // Preserve search query, sorting, and pagination parameters
    if (searchParams.has("search")) {
      params.set("ref_search", searchParams.get("search")!);
    }
    if (searchParams.has("sort")) {
      params.set("ref_sort", searchParams.get("sort")!);
    }
    if (searchParams.has("order")) {
      params.set("ref_order", searchParams.get("order")!);
    }
    if (searchParams.has("page")) {
      params.set("ref_page", searchParams.get("page")!);
    }
    if (searchParams.has("category")) {
      params.set("ref_category", searchParams.get("category")!);
    }

    // If we have parameters to preserve, append them to the URL
    if (params.toString() !== "") {
      return `${baseUrl}?${params.toString()}`;
    }

    return baseUrl;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow">
        <Link href={createProductUrl()} prefetch={true}>
          <Card className="gap-2 md:gap-4 h-full rounded-none">
            <div className="aspect-square overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                width={400}
                height={400}
                className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-col flex-grow">
              <CardContent>
                <h2 className="line-clamp-2 font-medium text-md">
                  {product.name}
                </h2>
                {product.rating !== undefined &&
                  product.reviews !== undefined && (
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="ml-1 text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  )}
                <div
                  className="font-bold"
                  dangerouslySetInnerHTML={{ __html: product.price }}
                ></div>
              </CardContent>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
