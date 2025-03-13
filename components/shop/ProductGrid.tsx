import React from "react";
import { Products } from "@/types/product";
import ProductCard from "./ProductCard";
interface ProductGridProps {
  products: Products["products"]["nodes"];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="w-full px-4 mx-auto">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <div className="flex flex-col w-full h-full">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
