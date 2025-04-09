import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Products } from '@/types/product';
import * as productUtils from '@/lib/utils/productUtils';
import { formatPrice } from '@/lib/utils/formatters';
import Image from 'next/image';

export interface ProductCardProps {
  product: Products['products']['nodes'][number];
  searchParams: URLSearchParams | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, searchParams }) => {
  // Handle image which could be a string or an object with sourceUrl
  const baseImage = product.image?.sourceUrl || 'https://placehold.co/400x400';

  // Använd hjälpfunktionen för att säkert hämta första galleryImage
  const galleryImage = productUtils.getFirstGalleryImage(product, baseImage);

  // Create product URL with preserved search parameters
  const createProductUrl = () => {
    const baseUrl = `/shop/product/${product.slug}`;

    // Om inga sökparametrar finns, returnera bara bas-URL:en
    if (!searchParams || Object.keys(searchParams).length === 0) {
      return baseUrl;
    }

    // Skapa nya parametrar för produkt-URL:en
    const params = new URLSearchParams();

    // Mappa om sökparametrarna till ref_-parametrar
    const paramMapping = {
      search: 'ref_search',
      sort: 'ref_sort',
      order: 'ref_order',
      page: 'ref_page',
      category: 'ref_category',
    };

    // Gå igenom mappningen och sätt nya parametrar
    Object.entries(paramMapping).forEach(([originalKey, newKey]) => {
      if (searchParams[originalKey]) {
        params.set(newKey, searchParams[originalKey]);
      }
    });

    // Om vi har parametrar att bevara, lägg till dem i URL:en
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  // Säkert hämta price
  const productPrice = productUtils.getPrice(product);

  // Kontrollera om rating och reviews finns (dessa finns inte i GetProductsQuery som standard)

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow rounded-l-full">
        <Link href={createProductUrl()}>
          <Card className="gap-2 md:gap-4 pt-0 px-0 h-full border-[1px]">
            <div className="aspect-square group overflow-hidden relative">
              {/* Base image */}
              <Image
                src={baseImage}
                alt={product.name || 'Product'}
                width={400}
                height={400}
                className="h-full w-full object-contain  transition-opacity duration-300 group-hover:opacity-0"
                loading="lazy"
              />
              {/* Hover image - positioned absolute on top */}
              {galleryImage && (
                <Image
                  src={galleryImage}
                  alt={`${product.name || 'Product'} alternate view`}
                  width={400}
                  height={400}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex flex-col flex-grow">
              <CardContent className="px-4">
                <h2 className="line-clamp-2 font-medium text-primary text-md">{product.name}</h2>

                {/* Display price if available */}
                {productPrice &&
                  (product.__typename === 'SimpleProduct' ||
                    product.__typename === 'VariableProduct') &&
                  !product.onSale && (
                    <p className="text-sm font-semibold mt-2" data-price={productPrice}>
                      {formatPrice(productPrice)}
                    </p>
                  )}
                {/* Display sale price and regular price if on sale */}
                {product.__typename === 'SimpleProduct' || product.__typename === 'VariableProduct'
                  ? product.onSale && (
                      <div className="flex gap-2">
                        <p className="text-sm font-medium mt-2">
                          {formatPrice(product.price || '')}
                        </p>
                        <p className="text-sm line-through text-destructive mt-2">
                          {formatPrice(product.regularPrice || '')}
                        </p>
                      </div>
                    )
                  : null}
              </CardContent>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
