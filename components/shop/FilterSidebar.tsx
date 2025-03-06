"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Sample categories and price ranges - replace with your actual data
const categories = [
  { id: "tops", name: "Tops" },
  { id: "bottoms", name: "Bottoms" },
  { id: "accessories", name: "Accessories" },
  { id: "shoes", name: "Shoes" },
];

const priceRanges = [
  { id: "0-25", name: "Under $25" },
  { id: "25-50", name: "$25 - $50" },
  { id: "50-100", name: "$50 - $100" },
  { id: "100+", name: "Over $100" },
];

const sortOptions = [
  { value: "DATE", order: "DESC", label: "Newest" },
  { value: "PRICE", order: "ASC", label: "Price: Low to High" },
  { value: "PRICE", order: "DESC", label: "Price: High to Low" },
  { value: "TITLE", order: "ASC", label: "Name: A to Z" },
  { value: "TITLE", order: "DESC", label: "Name: Z to A" },
];

export function FilterSidebar({
  currentSort = "DATE",
  currentOrder = "DESC",
  currentCategory = "",
  searchQuery = "",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create a function to update URL with new parameters
  const updateFilters = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update or add new parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Ensure we keep the search query if it exists
    if (searchQuery && !newParams.has("search")) {
      newParams.set("search", searchQuery);
    }

    // Reset to page 1 when filters change
    newParams.set("page", "1");

    router.push(`/shop?${newParams.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const [sort, order] = value.split("-");
    updateFilters({ sort, order });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    updateFilters({ category: category === currentCategory ? "" : category });
  };

  // Clear all filters
  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set("search", searchQuery);
    }
    newParams.set("page", "1");
    router.push(`/shop?${newParams.toString()}`);
  };

  // Combine current sort and order for radio group
  const currentSortValue = `${currentSort}-${currentOrder}`;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sort By</SidebarGroupLabel>
          <SidebarGroupContent>
            <RadioGroup
              value={currentSortValue}
              onValueChange={handleSortChange}
              className="space-y-2 px-2"
            >
              {sortOptions.map((option) => (
                <div
                  key={`${option.value}-${option.order}`}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={`${option.value}-${option.order}`}
                    id={`${option.value}-${option.order}`}
                  />
                  <Label htmlFor={`${option.value}-${option.order}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Accordion type="multiple" defaultValue={["categories", "price"]}>
            <AccordionItem value="categories">
              <AccordionTrigger className="px-4 py-2">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 px-6">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={currentCategory === category.id}
                        onCheckedChange={() =>
                          handleCategoryChange(category.id)
                        }
                      />
                      <Label htmlFor={`category-${category.id}`}>
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger className="px-4 py-2">
                Price Range
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 px-6">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center space-x-2">
                      <Checkbox id={`price-${range.id}`} />
                      <Label htmlFor={`price-${range.id}`}>{range.name}</Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
