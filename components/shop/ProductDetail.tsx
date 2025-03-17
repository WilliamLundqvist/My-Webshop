"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  getAllProductImages,
  getColorImages,
  hasVariations,
  getVariations,
  getDatabaseId,
  getPrice
} from "@/lib/utils/productUtils";
import ItemCarousel from "./ItemCarousel";
import ItemSelector from "./ItemSelector";
import { useCart } from "@/lib/context/CartContext";
import { AddToCartMutationVariables } from "@/lib/graphql/generated/graphql";



export const ProductDetail = ({ product }) => {
  console.log(product);
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
    // Använd hjälpfunktionen för att samla alla bilder
    const uniqueImages = getAllProductImages(product);

    // Använd hjälpfunktionen för att hämta färgspecifika bilder
    const colorImagesMap = getColorImages(product);

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

  // Handle add to cart action
  const handleAddToCart = async (color: string, size: string) => {
    setAddingToCart(true);
    try {
      // Hitta variation ID baserat på färg och storlek
      let variationId = null;

      if (hasVariations(product) && color && size) {
        const variations = getVariations(product);
        const variation = variations.find((v: any) => {
          const colorAttr = v.attributes?.nodes?.find(
            (attr: any) => (attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "färg") && attr.value === color
          );

          const sizeAttr = v.attributes?.nodes?.find(
            (attr: any) => attr.name.toLowerCase() === "size" && attr.value === size
          );

          return colorAttr && sizeAttr;
        });

        if (variation) {
          variationId = variation.databaseId;
        }
      }

      // Hämta databaseId säkert
      const productId = getDatabaseId(product);

      console.log('Adding to cart:', { productId, variationId, color, size });

      if (!productId) {
        console.error('Missing productId');
        return;
      }

      const input: AddToCartMutationVariables = {
        input: {
          productId: productId,
          quantity: 1,
          variationId: variationId || undefined,
          extraData: undefined,
          clientMutationId: undefined,
          variation: undefined
        }
      };

      // Använd addToCart från context
      const success = await addToCart(input);

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

  // Säkert hämta price
  const productPrice = getPrice(product);

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
            {productPrice && (product.__typename == "SimpleProduct" || product.__typename == "VariableProduct") && !product.onSale && (
              <p
                className="text-xl font-medium mt-2"
                dangerouslySetInnerHTML={{ __html: productPrice }}
              />
            )}
            {productPrice && (product.__typename == "SimpleProduct" || product.__typename == "VariableProduct") && product.onSale && (
              <div className="flex items-center gap-2">
                <p
                  className="text-xl font-medium mt-2"
                  dangerouslySetInnerHTML={{ __html: productPrice }}
                />
                <p
                  className="text-xl font-medium mt-2 line-through text-destructive"
                  dangerouslySetInnerHTML={{ __html: product.regularPrice }}
                />
              </div>
            )}
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
