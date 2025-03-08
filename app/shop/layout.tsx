import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { StickyFilterButton } from "@/components/shop/StickyFilterButton";

export default function ShopSectionLayout({ children, params }) {
  const { section } = params;

  return (
    <SidebarProvider defaultOpen={true}>
      <FilterSidebar />
      <SidebarInset>{children}</SidebarInset>
      <StickyFilterButton />
    </SidebarProvider>
  );
}
