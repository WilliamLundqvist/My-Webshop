import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface ItemSelectorProps {
  product: Product;
  onAddToCart?: (color: string, size: string) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  product,
  onAddToCart,
}) => {
  // Extract variations from product
  const variations = product.variations?.nodes || [];

  // Extract available colors and sizes from product attributes
  const colorAttribute = product.attributes?.nodes.find(
    (attr) => attr.name.toLowerCase() === "color" || attr.name === "Color"
  );
  const sizeAttribute = product.attributes?.nodes.find(
    (attr) => attr.name.toLowerCase() === "size" || attr.name === "Size"
  );

  const colors = colorAttribute?.options || [];
  const sizes = sizeAttribute?.options || [];

  // State for selected color and size
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Get available sizes for a color
  const getAvailableSizesForColor = useCallback(
    (color: string) => {
      if (!color) return [];

      // Filter variations by the selected color
      const matchingVariations = variations.filter((variation) => {
        const variationAttrs = variation.attributes?.nodes || [];
        return variationAttrs.some(
          (attr) => attr.name.toLowerCase() === "color" && attr.value === color
        );
      });

      // Extract size values from matching variations
      const availableSizes = matchingVariations
        .map((variation) => {
          const sizeAttr = variation.attributes.nodes.find(
            (attr) => attr.name.toLowerCase() === "size"
          );
          return sizeAttr?.value || "";
        })
        .filter(Boolean);

      return Array.from(new Set(availableSizes)); // Remove duplicates
    },
    [variations]
  );

  // Memoize available sizes for current color
  const memoizedAvailableSizes = useMemo(
    () => getAvailableSizesForColor(selectedColor),
    [selectedColor, getAvailableSizesForColor]
  );

  // Initialize selected color and size
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  // Update size when color changes
  useEffect(() => {
    if (selectedColor) {
      const availableSizes = getAvailableSizesForColor(selectedColor);

      if (
        availableSizes.length > 0 &&
        (!selectedSize || !availableSizes.includes(selectedSize))
      ) {
        setSelectedSize(availableSizes[0]);
      }
    }
  }, [selectedColor, getAvailableSizesForColor, selectedSize]);

  // Event handlers
  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (selectedColor && selectedSize && onAddToCart) {
      onAddToCart(selectedColor, selectedSize);
    }
  }, [selectedColor, selectedSize, onAddToCart]);

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <span className="font-medium">Select a color: {selectedColor}</span>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColor === color
                    ? "border-black"
                    : "border-transparent"
                }`}
                style={{
                  backgroundColor: color.toLowerCase(),
                  boxShadow:
                    selectedColor === color ? "0 0 0 2px white inset" : "none",
                }}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Select a size: {selectedSize}</span>
            <button className="text-sm underline">Size Guide</button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size) => {
              const isAvailable = memoizedAvailableSizes.includes(size);

              return (
                <Button
                  variant="outline"
                  key={size}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`py-2 border-2 ${
                    selectedSize === size
                      ? "bg-black text-white border-black hover:bg-black/90 hover:text-white"
                      : isAvailable
                      ? "border-gray-300 bg-accent hover:border-black"
                      : "border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        className="w-full py-6 text-lg font-medium bg-black text-white hover:bg-black/90 rounded-full"
        disabled={!selectedSize || !selectedColor}
        onClick={handleAddToCart}
      >
        ADD TO BAG
      </Button>
    </div>
  );
};

export default ItemSelector;
