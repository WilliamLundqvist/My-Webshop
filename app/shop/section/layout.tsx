import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarWrapper from "@/components/shop/SidebarWrapper";
import ShopLoading from "./loading";
import ShopClientWrapper from "@/components/shop/ShopClientWrapper";

export default function ShopLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex justify-center w-full">
        <div className="flex flex-row max-w-screen-xl w-full relative px-4">
          <SidebarWrapper />
          <div className="w-full">
            <Suspense fallback={<ShopLoading />}>
              <ShopClientWrapper>
                {children}
              </ShopClientWrapper>
            </Suspense>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
