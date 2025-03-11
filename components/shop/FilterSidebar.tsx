"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, ChevronRight, Search } from "lucide-react";
import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import debounce from "lodash/debounce";
import { Input } from "@/components/ui/input";

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

// Sample price ranges - replace with your actual data (for fallback)
const priceRanges = [
  { id: "0-25", name: "Under $25" },
  { id: "25-50", name: "$25 - $50" },
  { id: "50-100", name: "$50 - $100" },
  { id: "100+", name: "Over $100" },
];

// Define min/max price constants
const MIN_PRICE = 0;
const MAX_PRICE = 500;

const sortOptions = [
  { value: "DATE", order: "DESC", label: "Newest" },
  { value: "PRICE", order: "ASC", label: "Price: Low to High" },
  { value: "PRICE", order: "DESC", label: "Price: High to Low" },
  { value: "NAME", order: "ASC", label: "Name: A to Z" },
  { value: "NAME", order: "DESC", label: "Name: Z to A" },
];

function FilterSidebarComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const section = useMemo(() => pathname.split("/")[3], [pathname]);

  // Memoize URL params to prevent unnecessary renders
  const currentSort = useMemo(
    () => searchParams.get("sort") || "DATE",
    [searchParams]
  );
  const currentOrder = useMemo(
    () => searchParams.get("order") || "DESC",
    [searchParams]
  );
  const currentCategory = useMemo(
    () => searchParams.get("category") || "",
    [searchParams]
  );
  const searchQuery = useMemo(
    () => searchParams.get("search") || "",
    [searchParams]
  );

  const currentPriceMin = useMemo(
    () => Number(searchParams.get("min_price") || MIN_PRICE),
    [searchParams]
  );
  const currentPriceMax = useMemo(
    () => Number(searchParams.get("max_price") || MAX_PRICE),
    [searchParams]
  );

  const updateFilters = useCallback(
    ({
      sort = currentSort,
      order = currentOrder,
      category = currentCategory,
      min_price = currentPriceMin,
      max_price = currentPriceMax,
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

      // Update price ranges if provided
      if (min_price !== undefined && min_price > MIN_PRICE) {
        params.set("min_price", min_price.toString());
      } else {
        params.delete("min_price");
      }

      if (max_price !== undefined && max_price < MAX_PRICE) {
        params.set("max_price", max_price.toString());
      } else {
        params.delete("max_price");
      }

      // Maintain search query if it exists
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      // Navigate to the new URL
      router.push(`${pathname}?${params.toString()}`);
    },
    [
      currentSort,
      currentOrder,
      currentCategory,
      currentPriceMin,
      currentPriceMax,
      searchQuery,
      pathname,
      router,
      searchParams,
    ]
  );

  // Local state to track selected values
  const [selectedSort, setSelectedSort] = useState(
    `${currentSort}-${currentOrder}`
  );
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [priceRange, setPriceRange] = useState([
    currentPriceMin,
    currentPriceMax,
  ]);

  const [searchTerm, setSearchTerm] = useState(searchQuery || "");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      router.push(`${pathname}?${params.toString()}`);
    }, 500),
    [searchParams, pathname, router]
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Use our custom hook to get category data
  const { categories, loading, error } = useCategoryData(section);

  // Create debounced function for updating price
  const debouncedUpdatePrice = useCallback(
    debounce((minPrice, maxPrice) => {
      const params = new URLSearchParams(searchParams.toString());

      if (minPrice > MIN_PRICE) {
        params.set("min_price", minPrice.toString());
      } else {
        params.delete("min_price");
      }

      if (maxPrice < MAX_PRICE) {
        params.set("max_price", maxPrice.toString());
      } else {
        params.delete("max_price");
      }

      router.push(`${pathname}?${params.toString()}`);
    }, 800),
    [searchParams, pathname, router]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (value) => {
      setSelectedSort(value);
      const option = sortOptions.find(
        (opt) => `${opt.value}-${opt.order}` === value
      );
      if (option) {
        updateFilters({ sort: option.value, order: option.order });
      }
    },
    [updateFilters]
  );

  // Handle category change
  const handleCategoryChange = useCallback(
    (category) => {
      setSelectedCategory(category);
      updateFilters({ category: category });
    },
    [updateFilters]
  );

  // Handle price range change
  const handlePriceRangeChange = useCallback(
    (values) => {
      setPriceRange(values);
      debouncedUpdatePrice(values[0], values[1]);
    },
    [debouncedUpdatePrice]
  );

  // Update filters function - memoize to prevent recreation on each render

  // Clear all filters (updated to also clear search)
  const clearFilters = useCallback(() => {
    setSelectedSort(`DATE-DESC`);
    setSelectedCategory("");
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSearchTerm("");

    const params = new URLSearchParams();
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4 bp-6 pt-26">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Search</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 text-sm w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarHeader className=" p-4 pt-6 bp-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Accordion type="multiple">
            <AccordionItem value="sort">
              <AccordionTrigger className="text-base font-semibold flex items-center justify-between">
                Sort By
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedSort}
                  onValueChange={handleSortChange}
                  className="space-y-1"
                >
                  {sortOptions.map((option) => {
                    const optionValue = `${option.value}-${option.order}`;
                    return (
                      <div
                        key={optionValue}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <RadioGroupItem
                          className="w-6 h-6"
                          value={optionValue}
                          id={`sort-${optionValue}`}
                          checked={selectedSort === optionValue}
                        />
                        <Label
                          htmlFor={`sort-${optionValue}`}
                          className="cursor-pointer w-full"
                        >
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="categories">
              <AccordionTrigger className="text-base font-semibold flex items-center justify-between">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {loading ? (
                    <div>Loading categories...</div>
                  ) : error ? (
                    <div>Error loading categories</div>
                  ) : categories.length === 0 ? (
                    <div>No categories found</div>
                  ) : (
                    categories.map((category) => (
                      <div key={category.id} className="space-y-1">
                        <div
                          className={`px-4 py-1.5 rounded-md cursor-pointer hover:bg-slate-100 ${
                            selectedCategory === category.slug
                              ? "bg-slate-100 font-medium"
                              : ""
                          }`}
                          onClick={() => handleCategoryChange(category.slug)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{category.name}</span>
                            {category.children.nodes.length > 0 && (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Render subcategories */}
                        {category.children.nodes.length > 0 && (
                          <div className="ml-4 pl-2 border-l border-slate-200 space-y-1">
                            {category.children.nodes.map((grandchild) => (
                              <div
                                key={grandchild.id}
                                className={`px-3 py-1.5 rounded-md cursor-pointer hover:bg-slate-100 ${
                                  selectedCategory === grandchild.slug
                                    ? "bg-slate-100 font-medium"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleCategoryChange(grandchild.slug)
                                }
                              >
                                {grandchild.name}
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
              <AccordionTrigger className="text-base font-semibold flex items-center justify-between">
                Price Range
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 py-4">
                  <Slider
                    defaultValue={[currentPriceMin, currentPriceMax]}
                    value={priceRange}
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={5}
                    onValueChange={handlePriceRangeChange}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <div className="border rounded-md px-2 py-1">
                      ${priceRange[0]}
                    </div>
                    <div>to</div>
                    <div className="border rounded-md px-2 py-1">
                      $
                      {priceRange[1] === MAX_PRICE
                        ? `${MAX_PRICE}+`
                        : priceRange[1]}
                    </div>
                  </div>
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

// Export a memoized version of the component
export const FilterSidebar = memo(FilterSidebarComponent);
