"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Products } from "@/types/product";
import ItemCarousel from "./ItemCarousel";
import ItemSelector from "./ItemSelector";
import { useCart } from "@/lib/context/CartContext";

interface ProductDetailProps {
  product: Products["products"]["nodes"][number];
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  // State for gallery images
  const [galleryImages, setGalleryImages] = useState<{ sourceUrl: string }[]>(
    []
  );
  
  // Add state for selected color
  const [selectedColor, setSelectedColor] = useState<string>("");
  
  // State for color-specific images
  const [colorImages, setColorImages] = useState<Record<string, string>>({});

  // Använd cart context
  const { addToCart, loading: cartLoading } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  // Process gallery images for the carousel
  useEffect(() => {
    const imageSet = new Set<string>();
    const colorImagesMap: Record<string, string> = {};

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
    
    // Extract color images from variations if available
    if (product?.variations?.nodes) {
      product.variations.nodes.forEach((variation) => {
        // Assuming each variation has attributes like color and an image
        const colorAttribute = variation.attributes?.nodes?.find(
          (attr) => attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "färg"
        );
        
        if (colorAttribute?.value && variation.image?.sourceUrl) {
          colorImagesMap[colorAttribute.value] = variation.image.sourceUrl;
        }
      });
    }

    // Convert Set to array of image objects
    const uniqueImages = Array.from(imageSet).map((sourceUrl) => ({
      sourceUrl,
    }));
    
    setGalleryImages(uniqueImages);
    setColorImages(colorImagesMap);
  }, [product]);

  // Handle color selection
  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  // Reorder images based on selected color
  const getOrderedImages = useCallback(() => {
    if (!selectedColor || !colorImages[selectedColor]) {
      return galleryImages;
    }
    
    // Find if the color image is already in gallery
    const colorImageUrl = colorImages[selectedColor];
    const isColorImageInGallery = galleryImages.some(
      img => img.sourceUrl === colorImageUrl
    );
    
    if (isColorImageInGallery) {
      // Reorder to put the color image first
      return [
        { sourceUrl: colorImageUrl },
        ...galleryImages.filter(img => img.sourceUrl !== colorImageUrl)
      ];
    } else {
      // Add the color image to the beginning
      return [{ sourceUrl: colorImageUrl }, ...galleryImages];
    }
  }, [selectedColor, colorImages, galleryImages]);

  // Handle add to cart action - nu mycket enklare!
  const handleAddToCart = async (color: string, size: string) => {
    setAddingToCart(true);
    try {
      // Hitta variation ID baserat på färg och storlek
      let variationId = null;
      
      if (product?.variations?.nodes && color && size) {
        const variation = product.variations.nodes.find(v => {
          const colorAttr = v.attributes?.nodes?.find(
            attr => (attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "färg") && attr.value === color
          );
          
          const sizeAttr = v.attributes?.nodes?.find(
            attr => attr.name.toLowerCase() === "size" && attr.value === size
          );
          
          return colorAttr && sizeAttr;
        });
        
        if (variation) {
          variationId = variation.databaseId;
        }
      }
      
      // Använd addToCart från context - den hanterar både API-anrop och state!
      const success = await addToCart(product.databaseId, 1, variationId);
      
      if (success) {
        console.log(`Added to cart: ${product.name}, Color: ${color}, Size: ${size}`);
        // Visa bekräftelse för användaren
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Visa felmeddelande för användaren
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <ItemCarousel 
            galleryImages={getOrderedImages()} 
            product={product}
            selectedColor={selectedColor} 
          />
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

          {/* ItemSelector with color selection callback */}
          <ItemSelector 
            product={product} 
            onColorSelect={handleColorSelect}
            onAddToCart={handleAddToCart}
            isLoading={addingToCart}
          />

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
