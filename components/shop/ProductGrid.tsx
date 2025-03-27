import React from 'react';
import { Products } from '@/types/product';
import ProductCard from './ProductCard';
interface ProductGridProps {
  products: Products['products']['nodes'];
  searchParams: URLSearchParams;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, searchParams }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div className="flex flex-col w-full h-full" key={product.id}>
            <ProductCard product={product} searchParams={searchParams} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
