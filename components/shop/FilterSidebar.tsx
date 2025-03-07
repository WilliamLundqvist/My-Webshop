"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter } from "lucide-react";
import { useState } from "react";

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
import { useCategoryData } from "@/hooks/useCategoryData";

// Sample price ranges - replace with your actual data
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
  const pathname = usePathname();
  const section = pathname.split("/")[3];

  // Use our custom hook to get category data
  const { categories, loading, error } = useCategoryData(section);

  // Update filters function
  const updateFilters = ({
    sort = currentSort,
    order = currentOrder,
    category = currentCategory,
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination when filters change
    params.delete("page");

    // Update parameters if provided
    if (sort !== undefined) {
      params.set("sort", sort);
    }
    if (order !== undefined) {
      params.set("order", order);
    }
    if (category !== undefined) {
      if (category) {
        params.set("category", category);
      } else {
        params.delete("category");
      }
    }

    // Maintain search query if it exists
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    const option = sortOptions.find(
      (opt) => `${opt.value}-${opt.order}` === value
    );
    if (option) {
      updateFilters({ sort: option.value, order: option.order });
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    updateFilters({ category: category === currentCategory ? "" : category });
  };

  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sort By</SidebarGroupLabel>
          <SidebarGroupContent>
            <RadioGroup
              value={`${currentSort}-${currentOrder}`}
              onValueChange={handleSortChange}
              className="space-y-1"
            >
              {sortOptions.map((option) => (
                <div
                  key={`${option.value}-${option.order}`}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={`${option.value}-${option.order}`}
                    id={`sort-${option.value}-${option.order}`}
                  />
                  <Label htmlFor={`sort-${option.value}-${option.order}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </SidebarGroupContent>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["categories", "price"]}
          >
            <AccordionItem value="categories">
              <AccordionTrigger className="px-4 py-2">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 px-6">
                  {loading ? (
                    <div>Loading categories...</div>
                  ) : error ? (
                    <div>Error loading categories</div>
                  ) : categories.length === 0 ? (
                    <div>No categories found</div>
                  ) : (
                    categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.slug}`}
                            checked={currentCategory === category.slug}
                            onCheckedChange={() =>
                              handleCategoryChange(category.slug)
                            }
                          />
                          <Label htmlFor={`category-${category.slug}`}>
                            {category.name}
                          </Label>
                        </div>

                        {/* Render grandchildren */}
                        {category.children.nodes.length > 0 && (
                          <div className="ml-6 space-y-2">
                            {category.children.nodes.map((grandchild) => (
                              <div
                                key={grandchild.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`category-${grandchild.slug}`}
                                  checked={currentCategory === grandchild.slug}
                                  onCheckedChange={() =>
                                    handleCategoryChange(grandchild.slug)
                                  }
                                />
                                <Label htmlFor={`category-${grandchild.slug}`}>
                                  {grandchild.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem defaultValue="price" value="price">
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
