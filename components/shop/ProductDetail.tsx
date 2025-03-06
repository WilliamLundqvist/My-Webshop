"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@/types/product";
import ItemCarousel from "./ItemCarousel";
import ItemSelector from "./ItemSelector";

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  // State for gallery images
  const [galleryImages, setGalleryImages] = useState<{ sourceUrl: string }[]>(
    []
  );

  // Process gallery images for the carousel
  useEffect(() => {
    const imageSet = new Set<string>();

    // Add product main image
    if (product?.image?.sourceUrl) {
      imageSet.add(product.image.sourceUrl);
    }

    // Add featured image if available
    if (product?.featuredImage?.node?.sourceUrl) {
      imageSet.add(product.featuredImage.node.sourceUrl);
    }

    // Add gallery images if available
    if (product?.galleryImages?.nodes) {
      product.galleryImages.nodes.forEach((img) => {
        if (img.sourceUrl) imageSet.add(img.sourceUrl);
      });
    }

    // Convert Set to array of image objects
    const uniqueImages = Array.from(imageSet).map((sourceUrl) => ({
      sourceUrl,
    }));
    setGalleryImages(uniqueImages);
  }, [product]);

  // Handle add to cart action
  const handleAddToCart = useCallback(
    (color: string, size: string) => {
      console.log(
        `Adding to cart: ${product.name}, Color: ${color}, Size: ${size}`
      );
      // Implement your cart logic here
      // e.g., dispatch action to add item to cart
    },
    [product]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <ItemCarousel galleryImages={galleryImages} product={product} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p
              className="text-xl font-medium mt-2"
              dangerouslySetInnerHTML={{ __html: product.price }}
            />
          </div>
          <div
            className="prose prose-sm"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />

          {/* ItemSelector with internal state management and Add to Cart button */}
          <ItemSelector product={product} onAddToCart={handleAddToCart} />

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
