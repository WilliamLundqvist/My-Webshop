import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Product } from "@/types/product";

const ItemCarousel = ({
  galleryImages,
  product,
}: {
  galleryImages: { sourceUrl: string }[];
  product: Product;
}) => {
  return (
    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
      {galleryImages.length > 0 ? (
        <Carousel className="w-full h-full">
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={`gallery-image-${index}`}>
                <div className="h-full w-full flex items-center justify-center p-0">
                  <img
                    src={image.sourceUrl}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {galleryImages.length > 1 && (
            <>
              <CarouselPrevious className="bg-black text-white border-none left-2" />
              <CarouselNext className="bg-black text-white border-none right-2" />
            </>
          )}
        </Carousel>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          No images available
        </div>
      )}
    </div>
  );
};

export default ItemCarousel;
