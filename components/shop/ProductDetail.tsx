'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllProductImages, getColorImages, getPrice } from '@/lib/utils/productUtils';
import ItemCarousel from './ItemCarousel';
import ItemSelector from './ItemSelector';
import { formatPrice } from '@/lib/utils/formatters';

export const ProductDetail = ({ product }) => {
  console.log(product);
  const [galleryImages, setGalleryImages] = useState<{ sourceUrl: string }[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [colorImages, setColorImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const uniqueImages = getAllProductImages(product);

    const colorImagesMap = getColorImages(product);

    setGalleryImages(uniqueImages);
    setColorImages(colorImagesMap);
  }, [product]);

  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const getOrderedImages = useCallback(() => {
    if (!selectedColor || !colorImages[selectedColor]) {
      return galleryImages;
    }

    const colorImageUrl = colorImages[selectedColor];
    const isColorImageInGallery = galleryImages.some((img) => img.sourceUrl === colorImageUrl);

    if (isColorImageInGallery) {
      return [
        { sourceUrl: colorImageUrl },
        ...galleryImages.filter((img) => img.sourceUrl !== colorImageUrl),
      ];
    } else {
      return [{ sourceUrl: colorImageUrl }, ...galleryImages];
    }
  }, [selectedColor, colorImages, galleryImages]);

  const productPrice = getPrice(product);

  return (
    <div className="container mx-auto px-0 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <ItemCarousel galleryImages={getOrderedImages()} product={product} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {productPrice &&
              (product.__typename == 'SimpleProduct' || product.__typename == 'VariableProduct') &&
              !product.onSale && (
                <p className="text-xl font-medium mt-2">{formatPrice(productPrice)}</p>
              )}
            {productPrice &&
              (product.__typename == 'SimpleProduct' || product.__typename == 'VariableProduct') &&
              product.onSale && (
                <div className="flex items-center gap-2">
                  <p className="text-xl font-medium mt-2">{formatPrice(productPrice)}</p>
                  <p className="text-xl font-medium mt-2 line-through text-destructive">
                    {formatPrice(product.regularPrice)}
                  </p>
                </div>
              )}
          </div>
          <div
            className="prose prose-md"
            dangerouslySetInnerHTML={{ __html: product.description || '' }}
          />

          {/* ItemSelector with color selection callback */}
          <ItemSelector product={product} onColorSelect={handleColorSelect} />

          {/* Product Details Accordion */}
          <div className="pt-6 border-t">
            <div className="flex justify-between py-4 cursor-pointer hover:text-gray-700">
              <h3 className="font-medium">Product Details</h3>
              <span>+</span>
            </div>
            <div className="flex justify-between py-4 cursor-pointer hover:text-gray-700 border-t">
              <h3 className="font-medium">Shipping & Returns</h3>
              <span>+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
