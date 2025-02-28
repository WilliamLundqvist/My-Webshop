import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border border-border rounded overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-lg bg-white h-full flex flex-col">
      <Link href={`/product/${product.slug}`}>
        <div className="relative w-full pt-[100%] bg-surface overflow-hidden">
          {product.image?.sourceUrl ? (
            <Image 
              src={product.image.sourceUrl}
              alt={product.name || 'Product image'}
              width={300}
              height={300}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-secondary text-sm">
              <Image
                src="https://placehold.co/300x300"
                alt="No image available"
                width={300}
                height={300}
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          )}
        </div>
        <div className="p-md flex flex-col flex-grow">
          <h3 className="m-0 mb-sm text-base font-semibold text-text-primary">{product.name}</h3>
          {product.sku && <p className="m-0 mb-sm text-xs text-secondary">SKU: {product.sku}</p>}
          {product.price && <p className="m-0 mb-sm text-base font-semibold text-text-primary">{product.price}</p>}
          {product.description && (
            <p className="m-0 text-sm text-[#616161] leading-relaxed">
              {product.description.length > 100
                ? `${product.description.substring(0, 100)}...`
                : product.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 