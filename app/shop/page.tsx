import { getClient } from "@faustwp/experimental-app-router";
import { gql } from "@apollo/client";
import ProductGrid from "../components/ProductGrid";
import dynamic from "next/dynamic";
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
} from "@/components/ui/breadcrumb";

// Dynamically import the ShopControls component with no SSR and force client-side rendering
const ShopControls = dynamic(() => import("./components/ShopControls"), {
  ssr: false,
  loading: () => (
    <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
      <div className="flex items-center gap-md">
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
      <div className="text-sm text-text-secondary">
        <span>Loading products...</span>
      </div>
    </div>
  ),
});

// Define the query with pagination and sorting parameters
const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int
    $after: String
    $orderby: [ProductsOrderbyInput]
  ) {
    products(first: $first, after: $after, where: { orderby: $orderby }) {
      nodes {
        id
        name
        description
        slug
        ... on SimpleProduct {
          price(format: RAW)
          stockStatus
        }
        image {
          sourceUrl
        }
        ... on VariableProduct {
          stockStatus
          price(format: FORMATTED)
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Define a simple cache for cursor values
// In a real app, consider using a more robust caching solution
// This helps to map between page numbers and GraphQL cursor pagination
const CURSOR_CACHE = {
  cursors: {} as Record<number, string>,
  totalPages: 0,
};

export default async function ShopPage({ searchParams }) {
  const first = 12; // Number of products per page
  const sortField = searchParams?.sort || "DATE"; // Default sort by date
  const sortOrder = searchParams?.order || "DESC"; // Default sort direction

  // Get page from URL params or default to 1
  const currentPage = parseInt(searchParams?.page) || 1;

  // Determine which cursor to use based on the page number
  let after = "";
  if (currentPage > 1) {
    // If we have a cursor for the previous page, use it
    after = CURSOR_CACHE.cursors[currentPage - 1] || "";
  }

  let client = await getClient();

  const { data } = await client.query({
    query: GET_PRODUCTS,
    variables: {
      first,
      after,
      orderby: [{ field: sortField, order: sortOrder }],
    },
    fetchPolicy: "network-only",
  });

  const products = data.products.nodes;
  const pageInfo = data.products.pageInfo;

  // Store the current endCursor for pagination
  if (pageInfo.hasNextPage) {
    CURSOR_CACHE.cursors[currentPage] = pageInfo.endCursor;
    CURSOR_CACHE.totalPages = Math.max(
      CURSOR_CACHE.totalPages,
      currentPage + 1
    );
  } else {
    // If we're on the last page, update the total page count
    CURSOR_CACHE.totalPages = currentPage;
  }

  // Function to create pagination URL with current sort params
  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set("page", pageNum.toString());
    if (sortField !== "DATE") params.set("sort", sortField);
    if (sortOrder !== "DESC") params.set("order", sortOrder);
    return `/shop?${params.toString()}`;
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
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

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
    <div className="container mx-auto px-2 md:px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/shop">Shop</Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="my-xl text-4xl font-semibold text-text-primary">
        Products
      </h1>

      <div id="shop-controls-container">
        <ShopControls
          currentSort={sortField}
          currentOrder={sortOrder}
          productCount={products.length}
        />
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
                !pageInfo.hasNextPage ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
