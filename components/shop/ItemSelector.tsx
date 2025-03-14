import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { hasVariations, getVariations } from "@/lib/utils/productUtils";
import { Loader2 } from "lucide-react";

interface ItemSelectorProps {
  product: Product;
  onColorSelect: (color: string) => void;
  onAddToCart: (color: string, size: string) => void;
  isLoading?: boolean;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  product,
  onColorSelect,
  onAddToCart,
  isLoading = false
}) => {
  // Kontrollera om produkten har variationer och hämta dem säkert
  const hasProductVariations = hasVariations(product);
  const variations = hasProductVariations ? getVariations(product) : [];

  // Extrahera tillgängliga färger och storlekar från produktattribut
  const attributes = product.__typename === "VariableProduct" ? product.attributes?.nodes || [] : [];

  const colorAttribute = attributes.find(
    (attr) => attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "färg"
  );

  const sizeAttribute = attributes.find(
    (attr) => attr.name.toLowerCase() === "size" || attr.name.toLowerCase() === "storlek"
  );

  const colors = colorAttribute?.options || [];
  const sizes = sizeAttribute?.options || [];

  // State för vald färg och storlek
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Hämta tillgängliga storlekar för en färg
  const getAvailableSizesForColor = useCallback(
    (color: string) => {
      if (!color || !hasProductVariations) return [];

      // Filtrera variationer efter vald färg
      const matchingVariations = variations.filter((variation) => {
        const variationAttrs = variation.attributes?.nodes || [];
        return variationAttrs.some(
          (attr) =>
            (attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "färg") &&
            attr.value === color
        );
      });

      // Extrahera storleksvärden från matchande variationer
      const availableSizes = matchingVariations
        .map((variation) => {
          const sizeAttr = variation.attributes?.nodes?.find(
            (attr) => attr.name.toLowerCase() === "size" || attr.name.toLowerCase() === "storlek"
          );
          return sizeAttr?.value || "";
        })
        .filter(Boolean);

      return Array.from(new Set(availableSizes)); // Ta bort dubbletter
    },
    [variations, hasProductVariations]
  );

  // Memoize tillgängliga storlekar för aktuell färg
  const memoizedAvailableSizes = useMemo(
    () => getAvailableSizesForColor(selectedColor),
    [selectedColor, getAvailableSizesForColor]
  );

  // Initiera vald färg och storlek
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
      onColorSelect(colors[0]);
    }
  }, [colors, selectedColor, onColorSelect]);

  // Uppdatera storlek när färg ändras
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

  // Händelsehanterare
  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
    onColorSelect(color);
  }, [onColorSelect]);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  // Logga för felsökning
  console.log("Product:", product.__typename);
  console.log("Has variations:", hasProductVariations);
  console.log("Variations:", variations);
  console.log("Colors:", colors);
  console.log("Sizes:", sizes);
  console.log("Selected color:", selectedColor);
  console.log("Available sizes for color:", memoizedAvailableSizes);

  return (
    <div className="space-y-6">
      {/* Färgval */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <span className="font-medium">Välj färg: {selectedColor}</span>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-full border-2 ${selectedColor === color
                  ? "border-black"
                  : "border-transparent"
                  }`}
                style={{
                  backgroundColor: color.toLowerCase(),
                  boxShadow:
                    selectedColor === color ? "0 0 0 2px white inset" : "none",
                }}
                aria-label={`Välj färg ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Storleksval */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Välj storlek: {selectedSize}</span>
            <button className="text-sm underline">Storleksguide</button>
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
                  className={`py-2 border-2 ${selectedSize === size
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

      {/* Lägg till i kundvagn-knapp */}
      <button
        onClick={() => onAddToCart(selectedColor, selectedSize)}
        disabled={isLoading || (!selectedColor && colors.length > 0) || (!selectedSize && sizes.length > 0)}
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isLoading ? <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Lägger till...
        </div> : 'Lägg till i varukorg'}
      </button>
    </div>
  );
};

export default ItemSelector;
