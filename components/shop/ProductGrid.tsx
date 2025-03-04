import React from "react";
import { Product } from "@/types/product";
<<<<<<< HEAD
import ProductCard from "@/components/shop/ProductCard";
=======
import ProductCard from "../../app/components/ProductCard";
>>>>>>> e2c7074427215365a2b9c287da389bc2f6744418

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 w-full my-6">
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
