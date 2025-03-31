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

  // Prefetch adjacent pages for faster navigatio

  if (totalPages <= 1 && !hasNextPage && !hasPreviousPage) {
    return null;
  }

  return (
    <div className={`my-8`}>
      <Pagination>
        <PaginationContent className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                href={hasPreviousPage ? createPageUrl(currentPage - 1) : '#'}
                className={!hasPreviousPage ? 'pointer-events-none opacity-50' : ''}
                aria-disabled={!hasPreviousPage}
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
                      href={createPageUrl(pageNum)}
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
                href={hasNextPage ? createPageUrl(currentPage + 1) : '#'}
                className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
                aria-disabled={!hasNextPage}
              />
            </PaginationItem>
          </div>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
