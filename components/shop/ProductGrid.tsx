import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div key={product.id}>
          <div className="flex flex-col w-full h-full">
            <ProductCard product={product} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
