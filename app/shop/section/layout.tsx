import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FilterSidebar } from "@/components/shop/FilterSidebar";

// This is a server component
export default function ShopLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row w-full">
        {/* The FilterSidebar will always be in the DOM, but we'll control its visibility at the page level */}
        <FilterSidebar />

        {/* Always render the children (the main content) */}
        <div className="flex-1 sm:pl-4">{children}</div>
      </div>
    </SidebarProvider>
  );
}
