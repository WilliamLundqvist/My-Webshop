import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductDetailProps {
  product: Product;
}

  const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="py-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        <div className="relative w-full pt-[100%] bg-surface rounded overflow-hidden">
          {product.image?.sourceUrl ? (
            <Image
              src={product.image.sourceUrl}
              alt={product.name || 'Product image'}
              width={600}
              height={600}
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-secondary text-base">
              <Image
                src="https://placehold.co/600x600"
                alt="No image available"
                width={600}
                height={600}
                className="w-full h-full object-contain opacity-50"
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <h1 className="m-0 mb-md text-4xl font-semibold text-text-primary">{product.name}</h1>
          
          {product.sku && (
            <p className="m-0 mb-md text-sm text-secondary">SKU: {product.sku}</p>
          )}
          
          {product.price && (
            <p className="m-0 mb-md text-2xl font-semibold text-text-primary">{product.price}</p>
          )}
          
          {product.stockStatus && (
            <p className={`m-0 mb-md text-sm py-xs px-sm rounded inline-block ${
              product.stockStatus.toLowerCase() === 'instock' 
                ? 'bg-success/10 text-success' 
                : 'bg-error/10 text-error'
            }`}>
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
            <button className="py-md px-lg bg-primary text-white border-none rounded text-base font-medium cursor-pointer transition-colors hover:bg-accent">
              Add to Cart
            </button>
            <Link 
              href="/" 
              className="py-md px-lg bg-transparent text-primary border border-border rounded text-base font-medium no-underline inline-flex items-center transition-colors hover:bg-surface"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 