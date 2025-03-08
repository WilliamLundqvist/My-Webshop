"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
<<<<<<< HEAD
import SortDropdown from "./SortDropdown";
=======
>>>>>>> e2c7074427215365a2b9c287da389bc2f6744418

interface ShopControlsProps {
  currentSort: string;
  currentOrder: string;
  productCount?: number;
  searchQuery?: string;
}

const ShopControls: React.FC<ShopControlsProps> = ({
  currentSort,
  currentOrder,
  productCount = 0,
  searchQuery = "",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortChange = (field: string, order: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination when sorting changes
    params.delete("after"); // Remove old cursor-based param if it exists
    params.set("page", "1"); // Reset to page 1

    // Update sort parameters
    params.set("sort", field);
    params.set("order", order);

    // Maintain search query if it exists
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    router.push(`/shop?${params.toString()}`);
    setIsOpen(false);
  };

  // Combined sort options with direction
  const SORT_OPTIONS = [
    { field: "DATE", order: "DESC", label: "Newest first" },
    { field: "DATE", order: "ASC", label: "Oldest first" },
    { field: "PRICE", order: "ASC", label: "Price: Low to high" },
    { field: "PRICE", order: "DESC", label: "Price: High to low" },
    { field: "NAME", order: "ASC", label: "Name: A to Z" },
    { field: "NAME", order: "DESC", label: "Name: Z to A" },
    { field: "RATING", order: "DESC", label: "Highest rated" },
    { field: "RATING", order: "ASC", label: "Lowest rated" },
  ];

  // Get display name for the current sort option
  const getSortDisplayName = () => {
    const sortOption = SORT_OPTIONS.find(
      (option) => option.field === currentSort && option.order === currentOrder
    );
    return sortOption ? sortOption.label : "Sort by";
  };

  // If not mounted yet, show a placeholder
  if (!mounted) {
    return (
      <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div className="flex items-center gap-md">
          <Button variant="outline" className="flex items-center gap-2">
            Loading...
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-text-secondary">
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
      <div className="flex items-center gap-md">
<<<<<<< HEAD
        {/* <SortDropdown
          currentSort={currentSort}
          currentOrder={currentOrder}
          productCount={productCount}
          searchQuery={searchQuery}
        /> */}

=======
>>>>>>> e2c7074427215365a2b9c287da389bc2f6744418
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {getSortDisplayName()}
            <ChevronDown className="h-4 w-4" />
          </Button>

          {isOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-md border border-border bg-background shadow-lg z-50">
              <div className="px-2 py-1.5 text-sm font-medium border-b border-border">
                Sort Products
              </div>
              <div className="py-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={`${option.field}-${option.order}`}
                    className={`flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${
                      option.field === currentSort &&
                      option.order === currentOrder
                        ? "bg-accent/50 text-accent-foreground"
                        : ""
                    }`}
                    onClick={() => handleSortChange(option.field, option.order)}
                  >
                    {option.field === currentSort &&
                      option.order === currentOrder && (
                        <span className="mr-2">•</span>
                      )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-text-secondary">
        {productCount > 0 ? (
          <span>
            Showing {productCount} product{productCount !== 1 ? "s" : ""} sorted
            by{" "}
            <span className="font-medium text-text-primary">
              {getSortDisplayName()}
            </span>
          </span>
        ) : (
          <span>No products found</span>
        )}
      </div>
    </div>
  );
};

export default ShopControls;
