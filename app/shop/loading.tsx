export default function ShopLoading() {
  return (
    <div className="container mx-auto px-md">
      <div className="flex items-center my-md text-sm text-secondary">
        <div className="flex items-center">
          <span className="font-medium text-text-primary">Shop</span>
        </div>
      </div>
      
      <h1 className="my-xl text-4xl font-semibold text-text-primary">Products</h1>
      
      <div className="mb-lg flex justify-between items-center">
        <div className="h-8 w-32 bg-surface animate-pulse rounded"></div>
        <div className="h-6 w-48 bg-surface animate-pulse rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg w-full">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="border border-border rounded overflow-hidden bg-white h-full flex flex-col">
            <div className="relative w-full pt-[100%] bg-surface animate-pulse"></div>
            <div className="p-md flex flex-col gap-sm">
              <div className="h-6 w-3/4 bg-surface animate-pulse rounded"></div>
              <div className="h-4 w-1/2 bg-surface animate-pulse rounded"></div>
              <div className="h-5 w-1/3 bg-surface animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 