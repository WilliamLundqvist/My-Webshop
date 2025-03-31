'use client';

import React, { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from '@/components/ui/pagination';

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  baseUrl: string;
  searchParams: { [key: string]: string };
}

export default function ShopPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  baseUrl,
  searchParams,
}: ShopPaginationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    Object.keys(searchParams || {}).forEach((key) => {
      if (key !== 'page' && key !== 'after' && key !== 'before') {
        params.set(key, searchParams[key]);
      }
    });
    params.set('page', String(pageNum));
    return `${baseUrl}?${params.toString()}`;
  };

  // Prefetch adjacent pages for faster navigation
  useEffect(() => {
    // Prefetch next page
    if (hasNextPage) {
      router.prefetch(createPageUrl(currentPage + 1));
    }

    // Prefetch previous page
    if (hasPreviousPage) {
      router.prefetch(createPageUrl(currentPage - 1));
    }

    // For pages shown in pagination, prefetch them too
    const pagesToPrefetch = [];

    if (totalPages <= 5) {
      // Prefetch all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        if (i !== currentPage) pagesToPrefetch.push(i);
      }
    } else {
      // Prefetch pages around current page
      if (currentPage <= 3) {
        // First pages
        for (let i = 1; i <= 5; i++) {
          if (i !== currentPage) pagesToPrefetch.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Last pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          if (i !== currentPage) pagesToPrefetch.push(i);
        }
      } else {
        // Middle pages
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          if (i !== currentPage) pagesToPrefetch.push(i);
        }
      }
    }

    // Actually prefetch the calculated pages
    pagesToPrefetch.forEach((pageNum) => {
      router.prefetch(createPageUrl(pageNum));
    });
  }, [currentPage, totalPages, hasNextPage, hasPreviousPage]);

  const handlePageChange = (pageNum: number) => {
    // Use startTransition to mark this update as non-urgent
    // This helps keep the UI responsive during navigation
    startTransition(() => {
      router.push(createPageUrl(pageNum));
    });
  };

  if (totalPages <= 1 && !hasNextPage && !hasPreviousPage) {
    return null;
  }

  return (
    <div className={`my-8 ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
      <Pagination>
        <PaginationContent className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (hasPreviousPage) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={!hasPreviousPage ? 'pointer-events-none opacity-50' : ''}
                aria-disabled={!hasPreviousPage}
                href="#"
              />
            </PaginationItem>

            {/* Current page indicator - for mobile */}
            <span className="text-sm sm:hidden">
              {currentPage}/{totalPages > 0 ? totalPages : '?'}
            </span>

            {/* Page numbers for larger screens */}
            <div className="hidden sm:flex gap-2 items-center">
              {Array.from({ length: Math.min(5, totalPages || 5) }).map((_, i) => {
                let pageNum = currentPage;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                      href="#"
                      isActive={currentPage === pageNum}
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
                onClick={(e) => {
                  e.preventDefault();
                  if (hasNextPage) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
                aria-disabled={!hasNextPage}
                href="#"
              />
            </PaginationItem>
          </div>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
