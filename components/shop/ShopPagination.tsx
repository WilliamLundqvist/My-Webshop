"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function ShopPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: ShopPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNum: number) => {
    // Create a new URLSearchParams instance
    const params = new URLSearchParams(searchParams.toString());

    // Update or add the page parameter
    params.set("page", pageNum.toString());

    // Return the full URL
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (pageNum: number) => {
    const url = createPageUrl(pageNum);
    router.push(url);
  };

  // Generate pagination items based on current page and total pages
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(1);

    // Calculate range of visible pages
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

    if (endPage - startPage < maxVisiblePages - 3) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3));
    }

    // Add ellipsis if needed
    if (startPage > 2) {
      items.push("ellipsis-start");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      items.push("ellipsis-end");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Ensure currentPage doesn't exceed totalPages
  const validCurrentPage = Math.min(currentPage, totalPages);

  // If the current page in the URL is invalid, redirect to a valid page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const url = createPageUrl(totalPages);
      router.push(url);
    }
  }, [currentPage, totalPages]);

  const paginationItems = generatePaginationItems();

  return (
    <Pagination className="my-8">
      <PaginationContent>
        {/* Previous page button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(validCurrentPage - 1)}
            className={
              !hasPreviousPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={!hasPreviousPage}
          />
        </PaginationItem>

        {/* Page numbers */}
        {paginationItems.map((item, index) => {
          if (item === "ellipsis-start" || item === "ellipsis-end") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const pageNum = item as number;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => handlePageChange(pageNum)}
                isActive={validCurrentPage === pageNum}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(validCurrentPage + 1)}
            className={
              !hasNextPage || validCurrentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={!hasNextPage || validCurrentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
