import React, { Suspense } from 'react';
import { Products } from '@/types/product';
import ProductCard from './ProductCard';
interface ProductGridProps {
  products: Products['products']['nodes'];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Suspense fallback={<div>Loading...</div>} key={product.id}>
            <div className="flex flex-col w-full h-full">
              <ProductCard product={product} />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
