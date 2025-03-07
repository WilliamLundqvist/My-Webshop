import { getClient } from "@faustwp/experimental-app-router";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GET_PRODUCTS } from "@/lib/graphql/queries";
import ProductGrid from "@/components/shop/ProductGrid";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { StickyFilterButton } from "@/components/shop/StickyFilterButton";

// Define a simple cache for cursor values
// In a real app, consider using a more robust caching solution
// This helps to map between page numbers and GraphQL cursor pagination
const CURSOR_CACHE = {
  cursors: {} as Record<number, string>,
  totalPages: 0,
};

export default async function ShopPage({ searchParams }) {
  // First, check if we have reference params from product detail navigation
  // and use them if available (maintaining consistent parameter naming)
  console.log(searchParams);

  const finalSearchParams = { ...searchParams };
  if (searchParams.ref_search) {
    finalSearchParams.search = searchParams.ref_search;
    delete finalSearchParams.ref_search;
  }
  if (searchParams.ref_sort) {
    finalSearchParams.sort = searchParams.ref_sort;
    delete finalSearchParams.ref_sort;
  }
  if (searchParams.ref_order) {
    finalSearchParams.order = searchParams.ref_order;
    delete finalSearchParams.ref_order;
  }
  if (searchParams.ref_page) {
    finalSearchParams.page = searchParams.ref_page;
    delete finalSearchParams.ref_page;
  }
  if (searchParams.ref_category) {
    finalSearchParams.category = searchParams.ref_category;
    delete finalSearchParams.ref_category;
  }

  const first = 12; // Number of products per page
  const sortField = finalSearchParams?.sort || "DATE"; // Default sort by date
  const sortOrder = finalSearchParams?.order || "DESC"; // Default sort direction
  const searchQuery = finalSearchParams?.search || ""; // Get search query from URL
  const category = finalSearchParams?.category || ""; // Get category from URL

  const getSearchAfterCursor = async (page: number, pageSize: number) => {
    if (page <= 1) return "";

    const skipCount = (page - 1) * pageSize;

    try {
      return btoa(`arrayconnection:${skipCount - 1}`); // Simple offset encoding for cursor
    } catch (error) {
      console.error("Error calculating pagination cursor:", error);
      return "";
    }
  };

  // Get page from URL params or default to 1
  const currentPage = Number.parseInt(finalSearchParams?.page) || 1;

  // Get cursor for current page
  const after = await getSearchAfterCursor(currentPage, first);

  const client = await getClient();

  const { data } = await client.query({
    query: GET_PRODUCTS,
    variables: {
      first,
      after,
      orderby: [{ field: sortField, order: sortOrder }],
      category,
    },
    fetchPolicy: "network-only",
  });

  const products = data.products.nodes;
  const pageInfo = data.products.pageInfo;

  // Calculate total pages based on pageInfo
  const totalPages = pageInfo.hasNextPage ? currentPage + 1 : currentPage;

  // Function to create pagination URL with current sort and search params
  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set("page", pageNum.toString());
    if (sortField !== "DATE") params.set("sort", sortField);
    params.set("order", sortOrder); // Always include order parameter for consistency
    if (searchQuery) params.set("search", searchQuery); // Include search parameter if it exists
    if (category) params.set("category", category); // Include category parameter if it exists

    return ` /shop?${params.toString()}`;
  };

  // Generate page numbers to display (current, prev, next, first, last)
  const generatePaginationItems = () => {
    const items = [];
    const totalPages =
      CURSOR_CACHE.totalPages ||
      (pageInfo.hasNextPage ? currentPage + 1 : currentPage);

    // Always show first page
    items.push(1);

    // Calculate range to show around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      items.push("ellipsis-start");
    }

    // Add pages in the middle range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      items.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      items.push("ellipsis-end");
    }

    // Add last page if it's not the same as first
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  const paginationItems = generatePaginationItems();

  return (
    <SidebarProvider defaultOpen={true}>
      <FilterSidebar
        currentSort={sortField}
        currentOrder={sortOrder}
        currentCategory={category}
        // searchQuery={searchQuery}
      />
      <SidebarInset>
        <div className="mx-auto px-2 md:px-4">
          <Breadcrumb className="py-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/shop">Shop</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {category && (
                <BreadcrumbItem>
                  <Link href={`/shop?category=${category}`}>{category}</Link>
                </BreadcrumbItem>
              )}
              {searchQuery && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span>Search: {searchQuery}</span>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-text-primary">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : category
                ? `${category}`
                : "Products"}
            </h1>
            <div className="text-sm text-muted-foreground">
              {products.length} products
            </div>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="py-xl text-center">
              <p className="text-lg text-text-secondary">No products found.</p>
            </div>
          )}

          <Pagination className="my-8">
            <PaginationContent>
              {/* Previous page button */}
              <PaginationItem>
                <PaginationPrevious
                  href={
                    currentPage > 1 ? createPageUrl(currentPage - 1) : undefined
                  }
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
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
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Next page button */}
              <PaginationItem>
                <PaginationNext
                  href={
                    pageInfo.hasNextPage
                      ? createPageUrl(currentPage + 1)
                      : undefined
                  }
                  className={
                    !pageInfo.hasNextPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </SidebarInset>
      <StickyFilterButton />
    </SidebarProvider>
  );
}
