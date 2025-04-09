import { SidebarProvider } from '@/components/ui/sidebar';
import { FilterSidebar } from '@/components/shop/FilterSidebar';

export default function ShopLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row w-full max-w-[1400px] mx-auto relative ">
        <FilterSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
