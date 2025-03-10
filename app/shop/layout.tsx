import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { StickyFilterButton } from "@/components/shop/StickyFilterButton";

export default function ShopSectionLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
     {children}
    </SidebarProvider>
  );
}
