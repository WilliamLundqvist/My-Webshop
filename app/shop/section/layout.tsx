import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarWrapper from "@/components/shop/SidebarWrapper";
import ShopLoading from "./loading";
import ShopClientWrapper from "@/components/shop/ShopClientWrapper";
import { FilterSidebar } from "@/components/shop/FilterSidebar";

export default function ShopLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row w-full max-w-[1400px] mx-auto relative ">
        <FilterSidebar />
        <div className="w-full">
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
