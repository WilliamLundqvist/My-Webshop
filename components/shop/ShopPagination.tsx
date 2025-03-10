"use client";

import React, { useEffect, useRef, useMemo, useCallback } from "react";
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
  
  // Store whether we've handled the invalid page already
  const hasHandledInvalidPage = useRef(false);
  // Store the latest valid page values
  const latestProps = useRef({ currentPage, totalPages });
  
  // Update the latest props
  useEffect(() => {
    latestProps.current = { currentPage, totalPages };
  }, [currentPage, totalPages]);
  
  // Memoize URL creation to avoid recreating during render
  const createPageUrl = useCallback((pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  // Handle navigation outside of render
  const handlePageChange = useCallback((pageNum: number) => {
    // Defer navigation to avoid state updates during render
    setTimeout(() => {
      const url = createPageUrl(pageNum);
      router.push(url);
    }, 0);
  }, [createPageUrl, router]);

  // Handle invalid page checks completely outside of render
  useEffect(() => {
    if (
      !hasHandledInvalidPage.current && 
      currentPage > totalPages && 
      totalPages > 0
    ) {
      hasHandledInvalidPage.current = true;
      
      // Use setTimeout to further separate from render cycle
      setTimeout(() => {
        const url = createPageUrl(totalPages);
        router.push(url);
      }, 0);
    }
    
    return () => {
      // Only reset on dependency changes - not on every render
      if (latestProps.current.currentPage !== currentPage || 
          latestProps.current.totalPages !== totalPages) {
        hasHandledInvalidPage.current = false;
      }
    };
  }, [currentPage, totalPages, createPageUrl, router]);

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Safely calculate current page - never exceeds total pages
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  // Generate pagination items based on current page and total pages
  const paginationItems = (() => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(1);

    // Calculate range of visible pages
    let startPage = Math.max(2, validCurrentPage - Math.floor(maxVisiblePages / 2));
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
  })();

  return (
    <Pagination className="my-8">
      <PaginationContent>
        {/* Previous page button */}
        <PaginationItem>
          <PaginationPrevious
            href={createPageUrl(validCurrentPage - 1)}
            className={
              !hasPreviousPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={!hasPreviousPage}
            onClick={(e) => {
              if (hasPreviousPage) {
                e.preventDefault();
                handlePageChange(validCurrentPage - 1);
              }
            }}
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
                href={createPageUrl(pageNum)}
                isActive={validCurrentPage === pageNum}
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (validCurrentPage !== pageNum) {
                    handlePageChange(pageNum);
                  }
                }}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            href={createPageUrl(validCurrentPage + 1)}
            className={
              !hasNextPage || validCurrentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={!hasNextPage || validCurrentPage >= totalPages}
            onClick={(e) => {
              if (hasNextPage && validCurrentPage < totalPages) {
                e.preventDefault();
                handlePageChange(validCurrentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
