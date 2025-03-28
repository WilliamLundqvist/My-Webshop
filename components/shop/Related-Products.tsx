import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';
export function RelatedProducts({ products }: { products: Product }) {
  let relatedProducts;

  if (products.__typename === 'SimpleProduct' || products.__typename === 'VariableProduct') {
    relatedProducts = products.related.nodes;
  }

  return (
    <div>
      <h2>Relaterade produkter</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} searchParams={null} />
        ))}
      </div>
    </div>
  );
}
