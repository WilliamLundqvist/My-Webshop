import { ProductNode, SimpleProductNode, VariableProductNode } from '@/types/product';

// Typskyddsfunktioner för att kontrollera produkttyper
export function isSimpleProduct(product: ProductNode): product is SimpleProductNode {
  return product.__typename === 'SimpleProduct';
}

export function isVariableProduct(product: ProductNode): product is VariableProductNode {
  return product.__typename === 'VariableProduct';
}

export function isGroupProduct(product: ProductNode): product is any {
  return product.__typename === 'GroupProduct';
}

export function isExternalProduct(product: ProductNode): product is any {
  return product.__typename === 'ExternalProduct';
}

// Typskydd för att kontrollera om produkten har galleryImages
export function hasGalleryImages(
  product: ProductNode
): product is SimpleProductNode | VariableProductNode {
  return (
    (product.__typename === 'SimpleProduct' || product.__typename === 'VariableProduct') &&
    product.galleryImages !== null &&
    product.galleryImages !== undefined
  );
}

// Typskydd för att kontrollera om produkten har price
export function hasPrice(product: ProductNode): product is SimpleProductNode | VariableProductNode {
  return (
    (product.__typename === 'SimpleProduct' || product.__typename === 'VariableProduct') &&
    product.price !== null &&
    product.price !== undefined
  );
}

// Typskydd för att kontrollera om produkten har featuredImage
export function hasFeaturedImage(product: any): boolean {
  return (
    product.featuredImage && product.featuredImage.node && product.featuredImage.node.sourceUrl
  );
}

// Typskydd för att kontrollera om produkten har variations
export function hasVariations(product: any): boolean {
  return product.variations && product.variations.nodes && Array.isArray(product.variations.nodes);
}

// Typskydd för att kontrollera om produkten har databaseId
export function hasDatabaseId(product: any): boolean {
  return product.databaseId !== undefined && product.databaseId !== null;
}

// Hjälpfunktion för att säkert hämta galleryImages
export function getGalleryImages(product: ProductNode) {
  if (hasGalleryImages(product)) {
    return product.galleryImages?.nodes || [];
  }
  return [];
}

// Hjälpfunktion för att säkert hämta första galleryImage eller fallback till huvudbild
export function getFirstGalleryImage(product: ProductNode, fallbackImage?: string) {
  if (hasGalleryImages(product) && product.galleryImages?.nodes.length > 0) {
    return product.galleryImages.nodes[0].sourceUrl || fallbackImage || '';
  }
  return fallbackImage || product.image?.sourceUrl || '';
}

// Hjälpfunktion för att säkert hämta price
export function getPrice(product: ProductNode) {
  if (hasPrice(product)) {
    return product.price;
  }
  return '';
}

// Hjälpfunktion för att säkert hämta featuredImage
export function getFeaturedImageUrl(product: any): string | null {
  if (hasFeaturedImage(product)) {
    return product.featuredImage.node.sourceUrl;
  }
  return null;
}

// Hjälpfunktion för att säkert hämta variations
export function getVariations(product: any): any[] {
  if (hasVariations(product)) {
    return product.variations.nodes;
  }
  return [];
}

// Hjälpfunktion för att säkert hämta databaseId
export function getDatabaseId(product: any): number | null {
  if (hasDatabaseId(product)) {
    return product.databaseId;
  }
  return null;
}

// Hjälpfunktion för att samla alla bilder från en produkt
export function getAllProductImages(product: any): { sourceUrl: string }[] {
  const imageSet = new Set<string>();

  // Add product main image
  if (product?.image?.sourceUrl) {
    imageSet.add(product.image.sourceUrl);
  }

  // Add featured image if available
  if (hasFeaturedImage(product)) {
    imageSet.add(product.featuredImage.node.sourceUrl);
  }

  // Add gallery images if available
  if (hasGalleryImages(product)) {
    product.galleryImages.nodes.forEach((img: any) => {
      if (img.sourceUrl) imageSet.add(img.sourceUrl);
    });
  }

  // Convert Set to array of image objects
  return Array.from(imageSet).map((sourceUrl) => ({
    sourceUrl,
  }));
}

// Hjälpfunktion för att hämta färgspecifika bilder från variationer
export function getColorImages(product: any): Record<string, string> {
  const colorImagesMap: Record<string, string> = {};

  if (hasVariations(product)) {
    product.variations.nodes.forEach((variation: any) => {
      // Assuming each variation has attributes like color and an image
      const colorAttribute = variation.attributes?.nodes?.find(
        (attr: any) => attr.name.toLowerCase() === 'color' || attr.name.toLowerCase() === 'färg'
      );

      if (colorAttribute?.value && variation.image?.sourceUrl) {
        colorImagesMap[colorAttribute.value] = variation.image.sourceUrl;
      }
    });
  }

  return colorImagesMap;
}
