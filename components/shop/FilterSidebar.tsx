'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, ChevronRight, Search } from 'lucide-react';
import { useState, useCallback, useMemo, memo } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/useDebounce';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useCategoryData } from '@/lib/hooks/useCategoryData';

// Memoize sort options to prevent recreating on each render
const sortOptions = [
  { value: 'DATE', order: 'DESC', label: 'Newest' },
  { value: 'PRICE', order: 'ASC', label: 'Price: Low to High' },
  { value: 'PRICE', order: 'DESC', label: 'Price: High to Low' },
  { value: 'NAME', order: 'ASC', label: 'Name: A to Z' },
  { value: 'NAME', order: 'DESC', label: 'Name: Z to A' },
];

function FilterSidebarComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Använd useMemo endast för komplexa operationer
  const section = pathname.split('/')[3];

  // Hämta URL-parametrar direkt utan onödig memoization
  const currentSort = searchParams.get('sort') || 'DATE';
  const currentOrder = searchParams.get('order') || 'DESC';
  const currentCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  // Memoize sortKey för att förenkla hantering av sort+order kombinationen
  const sortKey = useMemo(() => `${currentSort}-${currentOrder}`, [currentSort, currentOrder]);

  // Local state to track selected values - initialize only once
  const [selectedSort, setSelectedSort] = useState(() => sortKey);
  const [selectedCategory, setSelectedCategory] = useState(() => currentCategory);
  const [searchTerm, setSearchTerm] = useState(() => searchQuery || '');

  // Memoize the navigation function to prevent recreating it on each render
  const navigateWithParams = useCallback(
    (params) => {
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );

  // Memoize the update filters function
  const updateFilters = useCallback(
    ({ sort = currentSort, order = currentOrder, category = currentCategory }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset pagination when filters change
      params.delete('page');

      // Update parameters if provided
      if (sort !== undefined) {
        params.set('sort', sort);
      }
      if (order !== undefined) {
        params.set('order', order);
      }
      if (category !== undefined) {
        if (category) {
          params.set('category', category);
        } else {
          params.delete('category');
        }
      }

      // Maintain search query if it exists
      if (searchQuery) {
        params.set('search', searchQuery);
      }

      // Navigate to the new URL
      navigateWithParams(params);
    },
    [currentSort, currentOrder, currentCategory, searchQuery, searchParams, navigateWithParams]
  );

  // Använd vårt nya useDebounce-hook istället för att skapa debound-funktioner med useMemo
  const debouncedSearch = useDebounce(
    (value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      navigateWithParams(params);
    },
    500,
    [searchParams, navigateWithParams]
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

  // Använd vårt nya useDebounce-hook istället

  // Handle sort change
  const handleSortChange = useCallback(
    (value) => {
      setSelectedSort(value);
      const option = sortOptions.find((opt) => `${opt.value}-${opt.order}` === value);
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

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedSort(`DATE-DESC`);
    setSelectedCategory('');
    setSearchTerm('');

    const params = new URLSearchParams();
    navigateWithParams(params);
  }, [navigateWithParams]);

  // Memoize the category list rendering to prevent recreating on each render
  const categoryList = useMemo(() => {
    if (loading) return <div>Loading categories...</div>;
    if (error) return <div>Error loading categories</div>;
    if (categories.length === 0) return <div>No categories found</div>;

    return categories.map((category) => (
      <div key={category.id} className="space-y-1">
        <div
          className={`px-4 py-1.5 rounded-md cursor-pointer hover:bg-slate-100 ${
            selectedCategory === category.slug ? 'bg-slate-100 font-medium' : ''
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
                  selectedCategory === grandchild.slug ? 'bg-slate-100 font-medium' : ''
                }`}
                onClick={() => handleCategoryChange(grandchild.slug)}
              >
                {grandchild.name}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  }, [categories, loading, error, selectedCategory, handleCategoryChange]);

  // Memoize the sort options rendering
  const sortOptionsList = useMemo(() => {
    return sortOptions.map((option) => {
      const optionValue = `${option.value}-${option.order}`;
      return (
        <div key={optionValue} className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem
            className="w-6 h-6"
            value={optionValue}
            id={`sort-${optionValue}`}
            checked={selectedSort === optionValue}
          />
          <Label htmlFor={`sort-${optionValue}`} className="cursor-pointer w-full">
            {option.label}
          </Label>
        </div>
      );
    });
  }, [selectedSort]);

  return (
    <Sidebar
      variant="floating"
      className="sticky top-[70px] max-h-[calc(100vh-75px)] overflow-y-auto"
    >
      <SidebarHeader className="border-b p-4 bp-6 ">
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
          <Accordion
            type="multiple"
            defaultValue={selectedCategory ? ['sort', 'categories'] : ['sort']}
          >
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
                  {sortOptionsList}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="categories">
              <AccordionTrigger className="text-base font-semibold flex items-center justify-between">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">{categoryList}</div>
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
    </Sidebar>
  );
}

// Export a memoized version of the component
export const FilterSidebar = memo(FilterSidebarComponent);
