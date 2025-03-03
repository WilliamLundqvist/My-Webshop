import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

export interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Handle image which could be a string or an object with sourceUrl
  const imageUrl =
    typeof product.image === "string"
      ? product.image
      : product.image?.sourceUrl || "https://placehold.co/400x400";

  return (
    <Link href={`/shop/product/${product.slug}`}>
      <Card className="gap-2 md:gap-4 h-full">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent>
          <h2 className="line-clamp-2 font-medium text-md">{product.name}</h2>
          {product.rating !== undefined && product.reviews !== undefined && (
            <div className="mt-2 flex items-center text-sm">
              <span className="text-yellow-500">★★★★★</span>
              <span className="ml-1 text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>
          )}
          <div
            className=" font-bold"
            dangerouslySetInnerHTML={{ __html: product.price }}
          ></div>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button size="default" variant="default" className="w-full">
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
