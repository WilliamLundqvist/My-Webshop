import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import ShopLoading from "./loading";
import ShopClientWrapper from "@/components/shop/ShopClientWrapper";

// This is a server component
export default function ShopLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row w-full">
        <FilterSidebar />
        <div className="flex-1 sm:pl-4">
          <Suspense fallback={<ShopLoading />}>
            <ShopClientWrapper>
              {children}
            </ShopClientWrapper>
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  );
}
