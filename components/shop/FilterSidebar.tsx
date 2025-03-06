"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

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
import { GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION } from "@/lib/graphql/queries";
import { useQuery } from "@apollo/client";

// Sample categories and price ranges - replace with your actual data

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

  // Track the current section to detect changes
  const [currentSection, setCurrentSection] = useState(section);
  const [categories, setCategories] = useState<any[]>([]);

  // State to control if we've already loaded the data
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const { data, loading, error, refetch } = useQuery(
    GET_CATEGORIES_AND_UNDER_CATEGORIES_BY_SECTION,
    {
      variables: { section: section },
      onError: (error) => {
        console.error("Error fetching categories:", error);
      },
      // Start with network-only to ensure fresh data on first load
      fetchPolicy: hasLoadedInitialData ? "cache-only" : "network-only",
      // For subsequent renders, always use cache
      nextFetchPolicy: "cache-only",
      // Skip the query altogether if we've loaded data for this section
      skip: hasLoadedInitialData && section === currentSection,
    }
  );

  // Handle section changes and initial data loading
  useEffect(() => {
    if (!hasLoadedInitialData || section !== currentSection) {
      refetch({ section }).then(() => {
        setHasLoadedInitialData(true);
        setCurrentSection(section);
      });
    }
  }, [section, currentSection, hasLoadedInitialData, refetch]);

  // Process the data to filter out categories with pipe characters
  const processCategories = () => {
    if (!data || !data.productCategory || !data.productCategory.children) {
      return [];
    }

    // First process all categories
    const processedCategories = data.productCategory.children.nodes.map(
      (category) => {
        // Clean the parent category name if it contains a pipe
        const cleanParentName = category.name.includes("|")
          ? category.name.split("|")[0].trim()
          : category.name;

        // Create a new object for each category
        const processedCategory = {
          id: category.id,
          name: cleanParentName,
          slug: category.slug,
          children: { nodes: [] },
        };

        // Process grandchildren if they exist
        if (category.children && category.children.nodes.length > 0) {
          // Keep track of names we've already seen to avoid duplicates
          const seenNames = new Set();

          // Filter grandchildren
          processedCategory.children.nodes = category.children.nodes
            .map((grandchild) => {
              // If the name contains a pipe, take only the part before the pipe
              const cleanName = grandchild.name.includes("|")
                ? grandchild.name.split("|")[0].trim()
                : grandchild.name;

              // Create a new object for the processed grandchild
              return {
                id: grandchild.id,
                name: cleanName,
                slug: grandchild.slug,
              };
            })
            .filter((grandchild) => {
              // Check if we've seen this name before
              if (seenNames.has(grandchild.name)) {
                return false; // Skip duplicates
              }

              // Add this name to our set of seen names
              seenNames.add(grandchild.name);
              return true;
            });
        }

        return setCategories(processedCategory);
      }
    );

    // Now filter out categories that have no children after filtering
    return processedCategories.filter(
      (category) => category.children.nodes.length > 0
    );
  };

  const filteredCategories = processCategories();

  console.log(filteredCategories);

  // Create a function to update URL with new parameters
  const updateFilters = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const section = pathname.split("/")[3];
    console.log(section);

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

    router.push(
      section
        ? `/shop/section/${section}?${newParams.toString()}`
        : `/shop?${newParams.toString()}`
    );
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
                  {loading ? (
                    <div>Loading categories...</div>
                  ) : error ? (
                    <div>Error loading categories</div>
                  ) : filteredCategories.length === 0 ? (
                    <div>No categories found</div>
                  ) : (
                    filteredCategories.map((category) => (
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
