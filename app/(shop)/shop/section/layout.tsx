import { Suspense } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import ShopLoading from './loading';
import ShopClientWrapper from '@/components/shop/ShopClientWrapper';
import { FilterSidebar } from '@/components/shop/FilterSidebar';

export default function ShopLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row w-full max-w-[1400px] mx-auto relative ">
        <Suspense fallback={<ShopLoading />}>
          <FilterSidebar />
        </Suspense>
        <div className="w-full">
          <Suspense fallback={<ShopLoading />}>
            <ShopClientWrapper>{children}</ShopClientWrapper>
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  );
}
