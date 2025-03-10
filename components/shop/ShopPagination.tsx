"use client";

import React, { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
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
  // Keep pageInfo in the interface for backward compatibility
  pageInfo?: {
    startCursor?: string;
    endCursor?: string;
  };
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

  // Simple page URL generator
  const createPageUrl = useCallback((pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNum));
    
    // Remove any cursor parameters if they exist
    params.delete("after");
    params.delete("before");
    
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  // Handle page navigation
  const handlePageChange = useCallback((pageNum: number) => {
    // Ensure page number is valid
    const validPage = Math.max(1, Math.min(pageNum, totalPages || Number.MAX_SAFE_INTEGER));
    
    if (validPage === currentPage) return;
    
    // Use setTimeout to avoid React state updates during render
    setTimeout(() => {
      router.push(createPageUrl(validPage));
    }, 0);
  }, [createPageUrl, router, currentPage, totalPages]);

  // Don't show pagination if there's only one page
  if (totalPages <= 1 && !hasNextPage && !hasPreviousPage) {
    return null;
  }

  return (
    <div className="mt-8 mb-12">
      <Pagination>
        <PaginationContent className="flex justify-between items-center">
          
          
          <div className="flex items-center space-x-2">
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                href={hasPreviousPage ? createPageUrl(currentPage - 1) : '#'}
                className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                onClick={(e) => {
                  if (hasPreviousPage) {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }
                }}
                aria-disabled={!hasPreviousPage}
              />
            </PaginationItem>
            
            {/* Current page indicator - for mobile */}
            <span className="text-sm sm:hidden">
              {currentPage}/{totalPages > 0 ? totalPages : '?'}
            </span>
            
            {/* Page numbers for larger screens */}
            <div className="hidden sm:flex items-center">
              {/* Generate simplified page numbers */}
              {Array.from({ length: Math.min(5, totalPages || 5) }).map((_, i) => {
                let pageNum = currentPage;
                
                // Simple pagination logic for small number of pages
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } 
                // More complex logic for many pages
                else {
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href={createPageUrl(pageNum)}
                      isActive={currentPage === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage !== pageNum) {
                          handlePageChange(pageNum);
                        }
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </div>
            
            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                href={hasNextPage ? createPageUrl(currentPage + 1) : '#'}
                className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                onClick={(e) => {
                  if (hasNextPage) {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }
                }}
                aria-disabled={!hasNextPage}
              />
            </PaginationItem>
          </div>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
