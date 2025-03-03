import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="py-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        <div className="relative w-full pt-[100%] bg-surface rounded overflow-hidden">
          {typeof product.image === "string" ||
            (product.image?.sourceUrl && (
              <Image
                src={product.image.sourceUrl}
                alt={product.name || "Product image"}
                width={600}
                height={600}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
            ))}
        </div>

        <div className="flex flex-col">
          <h1 className="m-0 mb-md text-4xl font-semibold text-text-primary">
            {product.name}
          </h1>

          {product.sku && (
            <p className="m-0 mb-md text-sm text-secondary">
              SKU: {product.sku}
            </p>
          )}

          {product.price && (
            <p className="m-0 mb-md text-2xl font-semibold text-text-primary">
              {product.price}
            </p>
          )}

          {product.stockStatus && (
            <p
              className={`m-0 mb-md text-sm py-xs px-sm rounded inline-block ${
                product.stockStatus.toLowerCase() === "instock"
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              {product.stockStatus}
            </p>
          )}

          {product.description && (
            <div
              className="m-0 mb-lg text-base text-[#424242] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          <div className="flex flex-wrap gap-md mt-auto">
            <Button>Add to Cart</Button>

            <Button asChild variant="outline">
              <Link href="/shop">Back to Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
