import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg w-full">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col h-full">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid; 