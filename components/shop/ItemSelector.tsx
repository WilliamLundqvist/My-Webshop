import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { hasVariations, getVariations, getDatabaseId } from '@/lib/utils/productUtils';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { AddToCartMutationVariables } from '@/lib/graphql/generated/graphql';

interface ItemSelectorProps {
  product: Product;
  onColorSelect: (color: string) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ product, onColorSelect }) => {
  // Använd cart context
  const { addToCart, setDropdownOpen } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  // Kontrollera om produkten har variationer och hämta dem säkert
  const hasProductVariations = hasVariations(product);

  // Extrahera tillgängliga färger och storlekar från produktattribut
  const attributes =
    product.__typename === 'VariableProduct' ? product.attributes?.nodes || [] : [];

  const colorAttribute = attributes.find(
    (attr) => attr.name.toLowerCase() === 'color' || attr.name.toLowerCase() === 'färg'
  );

  const sizeAttribute = attributes.find(
    (attr) => attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'storlek'
  );

  const colors = useMemo(() => colorAttribute?.options || [], [colorAttribute]);
  const sizes = sizeAttribute?.options || [];

  // State för vald färg och storlek
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Hämta tillgängliga storlekar för en färg
  const getAvailableSizesForColor = useCallback(
    (color: string) => {
      if (!color || !hasProductVariations) return [];

      // Filtrera variationer efter vald färg
      const variations = hasProductVariations ? getVariations(product) : [];
      const matchingVariations = variations.filter((variation) => {
        const variationAttrs = variation.attributes?.nodes || [];
        return variationAttrs.some(
          (attr) =>
            (attr.name.toLowerCase() === 'color' || attr.name.toLowerCase() === 'färg') &&
            attr.value === color
        );
      });

      // Extrahera storleksvärden från matchande variationer
      const availableSizes = matchingVariations
        .map((variation) => {
          const sizeAttr = variation.attributes?.nodes?.find(
            (attr) => attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'storlek'
          );
          return sizeAttr?.value || '';
        })
        .filter(Boolean);

      return Array.from(new Set(availableSizes)); // Ta bort dubbletter
    },
    [product, hasProductVariations]
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

      if (availableSizes.length > 0 && (!selectedSize || !availableSizes.includes(selectedSize))) {
        setSelectedSize(availableSizes[0]);
      }
    }
  }, [selectedColor, getAvailableSizesForColor, selectedSize]);

  // Händelsehanterare
  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      onColorSelect(color);
    },
    [onColorSelect]
  );

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  const handleSimpleProductAddToCart = useCallback(async () => {
    setAddingToCart(true);
    try {
      const productId = getDatabaseId(product);
      console.log('productId', productId);
      const input: AddToCartMutationVariables = {
        input: {
          productId,
          quantity: 1,
          variationId: undefined,
          extraData: undefined,
          clientMutationId: undefined,
          variation: undefined,
        },
      };

      const success = await addToCart(input);

      if (success) {
        const productInfo = `Added to cart: ${
          product.__typename === 'SimpleProduct' && product.name
        }`;
        console.log(productInfo);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  }, [product, addToCart]);

  const handleVariableProductAddToCart = useCallback(async () => {
    const color = hasProductVariations ? selectedColor : null;
    const size = hasProductVariations ? selectedSize : null;

    setAddingToCart(true);
    try {
      let variationId: number | null = null;

      // Om det är en variabel produkt och både färg och storlek är angivna
      if (hasProductVariations && color && size && product.__typename === 'VariableProduct') {
        const variations = getVariations(product);
        const variation = variations.find((v) => {
          const colorAttr = v.attributes?.nodes?.find(
            (attr) =>
              (attr.name.toLowerCase() === 'color' || attr.name.toLowerCase() === 'färg') &&
              attr.value === color
          );

          const sizeAttr = v.attributes?.nodes?.find(
            (attr) => attr.name.toLowerCase() === 'size' && attr.value === size
          );

          return colorAttr && sizeAttr;
        });

        if (variation?.databaseId) {
          variationId = variation.databaseId;
        }
      }

      // Hämta databaseId säkert
      const productId = getDatabaseId(product);

      console.log('Adding to cart:', {
        productId,
        variationId,
        color,
        size,
        isVariableProduct: hasProductVariations,
      });

      if (!productId) {
        console.error('Missing productId');
        return;
      }

      // Om vi inte kunde hitta en variationId för en variabel produkt, avbryt
      if (hasProductVariations && !variationId && (color || size)) {
        console.error('Could not find matching variation');
        return;
      }

      const input: AddToCartMutationVariables = {
        input: {
          productId: productId,
          quantity: 1,
          variationId: variationId || undefined,
          extraData: undefined,
          clientMutationId: undefined,
          variation: undefined,
        },
      };

      // Använd addToCart från context
      const success = await addToCart(input);

      if (success) {
        let productInfo = `Added to cart: ${
          product.__typename === 'VariableProduct' ? product.name : ''
        }`;
        if (color) productInfo += `, Color: ${color}`;
        if (size) productInfo += `, Size: ${size}`;

        console.log(productInfo);
        // Visa bekräftelse för användaren
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Visa felmeddelande för användaren
    } finally {
      setAddingToCart(false);
    }
  }, [hasProductVariations, product, selectedColor, selectedSize, addToCart]);

  const handleAddToCart = useCallback(async () => {
    if (hasProductVariations) {
      await handleVariableProductAddToCart();
    } else {
      await handleSimpleProductAddToCart();
    }
  }, [hasProductVariations, handleVariableProductAddToCart, handleSimpleProductAddToCart]);

  return (
    <div className="space-y-6">
      {/* Visa färg- och storleksval endast om produkten har variationer */}
      {hasProductVariations && (
        <>
          {/* Färgval */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <span className="font-medium">Välj färg: {selectedColor}</span>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? 'border-black' : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      boxShadow: selectedColor === color ? '0 0 0 2px white inset' : 'none',
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
                      className={`py-2 border-2 ${
                        selectedSize === size
                          ? 'bg-black text-white border-black hover:bg-black/90 hover:text-white'
                          : isAvailable
                            ? 'border-gray-300 bg-accent hover:border-black'
                            : 'border-gray-200 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Lägg till i kundvagn-knapp */}
      <button
        onClick={() => {
          handleAddToCart();
          setDropdownOpen(true);
        }}
        disabled={
          addingToCart ||
          (hasProductVariations &&
            ((!selectedColor && colors.length > 0) || (!selectedSize && sizes.length > 0)))
        }
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
      >
        {addingToCart ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Lägger till...
          </div>
        ) : (
          'Lägg till i varukorg'
        )}
      </button>
    </div>
  );
};

export default ItemSelector;
