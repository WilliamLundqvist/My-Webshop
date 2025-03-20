"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Products } from "@/types/product";
import { getFirstGalleryImage, getPrice } from "@/lib/utils/productUtils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils/formatters";

export interface ProductCardProps {
  product: Products["products"]["nodes"][number];
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use search params hook to get current URL parameters
  const searchParams = useSearchParams();

  const [isHovered, setIsHovered] = useState(false);

  // Handle image which could be a string or an object with sourceUrl
  const baseImage = product.image?.sourceUrl || "https://placehold.co/400x400";

  // Använd hjälpfunktionen för att säkert hämta första galleryImage
  const galleryImage = getFirstGalleryImage(product, baseImage);

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

  // Säkert hämta price
  const productPrice = getPrice(product);

  // Kontrollera om rating och reviews finns (dessa finns inte i GetProductsQuery som standard)
  const hasRatingAndReviews = "rating" in product && "reviews" in product;

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow rounded-l-full">
        <Link href={createProductUrl()}>
          <Card className="gap-2 md:gap-4 h-full border-[3px]">
            <div className="aspect-square overflow-hidden">
              <Image
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                src={isHovered ? galleryImage : baseImage}
                alt={product.name || "Product"}
                width={400}
                height={400}
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col flex-grow">
              <CardContent>
                <h2 className="line-clamp-2 font-medium text-md">{product.name}</h2>
                {hasRatingAndReviews && (
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="ml-1 text-muted-foreground">
                      {(product as any).rating} ({(product as any).reviews})
                    </span>
                  </div>
                )}
                {/* Display price if available */}
                {productPrice &&
                  (product.__typename === "SimpleProduct" ||
                    product.__typename === "VariableProduct") &&
                  !product.onSale && (
                    <p className="text-sm font-medium mt-2" data-price={productPrice}>
                      {formatPrice(productPrice)}
                    </p>
                  )}
                {/* Display sale price and regular price if on sale */}
                {product.__typename === "SimpleProduct" || product.__typename === "VariableProduct"
                  ? product.onSale && (
                      <div className="flex gap-2">
                        <p className="text-sm font-medium mt-2">
                          {formatPrice(product.price || "")}
                        </p>
                        <p className="text-sm line-through text-destructive mt-2">
                          {formatPrice(product.regularPrice || "")}
                        </p>
                      </div>
                    )
                  : null}
              </CardContent>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
