import { SidebarProvider } from '@/components/ui/sidebar';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import ShopClientWrapper from '@/components/shop/ShopClientWrapper';
import { Suspense } from 'react';
import ShopLoading from './loading';

export default function ShopLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row w-full max-w-[1400px] mx-auto relative ">
        <FilterSidebar />
        <Suspense fallback={<ShopLoading />}>
          <ShopClientWrapper>{children}</ShopClientWrapper>
        </Suspense>
      </div>
    </SidebarProvider>
  );
}
