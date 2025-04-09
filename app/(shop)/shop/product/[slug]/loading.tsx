import { Button } from '@/components/ui/button';
import { ProductSkeleton } from '../../section/loading.jsx';

export default function ItemLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button className="w-20 animate-pulse bg-gray-200 mb-4"></Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className=" w-32 h-8   bg-gray-200 rounded animate-pulse"></h1>
            <p className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-full h-60 bg-gray-200 rounded animate-pulse" />

          {/* ItemSelector with internal state management and Add to Cart button */}
          <div className="space-y-6">
            {/* Color Selection */}

            <div className="space-y-3">
              <span className="font-medium w-20 h-4 bg-gray-200 rounded animate-pulse"></span>
              <div className="flex space-x-2">
                {[1, 2, 3].map((index) => (
                  <Button
                    variant="outline"
                    key={index}
                    className="bg-gray-200 animate-pulse"
                    disabled={true}
                  >
                    &nbsp;
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Selection */}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium w-20 h-4 bg-gray-200 rounded animate-pulse"></span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <Button
                    variant="outline"
                    key={index}
                    className="bg-gray-200 animate-pulse"
                    disabled={true}
                  >
                    &nbsp;
                  </Button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full py-6 text-lg font-medium bg-gray-200 animate-pulse"></Button>
          </div>

          {/* Product Details Accordion */}
          <div className="pt-6 border-t">
            <div className="flex justify-between py-4 cursor-pointer hover:text-gray-700">
              <h3 className="font-medium w-20 h-4 bg-gray-200 rounded animate-pulse"></h3>
            </div>
            <div className="flex justify-between py-4 cursor-pointer hover:text-gray-700 border-t">
              <h3 className="font-medium w-20 h-4 bg-gray-200 rounded animate-pulse"></h3>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <h2 className="text-2xl my-4 font-bold">Relaterade produkter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`skeleton-${index}`}>
              <ProductSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
