import { getClient } from "@faustwp/experimental-app-router";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GET_PRODUCTS, GET_PRODUCT_COUNT } from "@/lib/graphql/queries";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopPagination from "@/components/shop/ShopPagination";

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

  // Get page from URL params or default to 1
  const currentPage = Number.parseInt(finalSearchParams?.page) || 1;

  // Debug the current page
  console.log(`Current page: ${currentPage}`);

  // Calculate cursor based on page number - fixed implementation
  const calculateCursor = (page: number, pageSize: number) => {
    if (page <= 1) return "";

    // Use the endCursor from the previous page if available
    // This is more reliable than generating our own cursor
    if (page > 1 && pageInfo?.endCursor) {
      return pageInfo.endCursor;
    }

    // Fallback to offset-based cursor generation
    const skipCount = (page - 1) * pageSize;
    try {
      // Format the cursor according to your GraphQL API's expectations
      // The format might need adjustment based on your specific API
      const cursor = btoa(`arrayconnection:${skipCount - 1}`);
      console.log(`Generated cursor for page ${page}: ${cursor}`);
      return cursor;
    } catch (error) {
      console.error("Error calculating pagination cursor:", error);
      return "";
    }
  };

  // Store cursors in a global object (only for server-side debugging)
  if (typeof global.pageCursors === "undefined") {
    global.pageCursors = {};
  }

  let after = "";
  const client = await getClient();

  // For first page, no cursor needed
  if (currentPage === 1) {
    after = "";
  }
  // For subsequent pages, we need to fetch all previous pages' cursors
  else {
    // First, try to get the cursor for the previous page
    try {
      // Fetch the previous page to get its endCursor
      const prevPage = currentPage - 1;
      const prevPageResult = await client.query({
        query: GET_PRODUCTS,
        variables: {
          first,
          after: calculateCursor(prevPage, first),
          orderby: [{ field: sortField, order: sortOrder }],
          search: searchQuery,
          category,
        },
        fetchPolicy: "network-only",
      });

      // Use the endCursor from the previous page
      after = prevPageResult.data.products.pageInfo.endCursor;
      console.log(`Using endCursor from previous page: ${after}`);

      // Store for debugging
      global.pageCursors[currentPage] = after;
    } catch (error) {
      console.error("Error fetching previous page cursor:", error);
      after = calculateCursor(currentPage, first);
    }
  }

  console.log(`Using cursor for page ${currentPage}: ${after}`);

  // Fetch products with pagination
  const { data } = await client.query({
    query: GET_PRODUCTS,
    variables: {
      first,
      after,
      orderby: [{ field: sortField, order: sortOrder }],
      search: searchQuery,
      category,
    },
    fetchPolicy: "network-only", // Don't use cache for server components
  });

  const products = data.products.nodes;
  const pageInfo = data.products.pageInfo;

  // Store the endCursor for debugging
  if (pageInfo.endCursor) {
    global.pageCursors[currentPage] = pageInfo.endCursor;
    console.log(
      `Stored endCursor for page ${currentPage}: ${pageInfo.endCursor}`
    );
  }

  // Debug pagination info
  console.log(`Page ${currentPage} info:`, {
    hasNextPage: pageInfo.hasNextPage,
    hasPreviousPage: pageInfo.hasPreviousPage,
    startCursor: pageInfo.startCursor,
    endCursor: pageInfo.endCursor,
    productsCount: products.length,
  });

  // Calculate total pages more accurately if possible
  let totalPages;

  if (pageInfo.hasNextPage) {
    // If there are more pages, we need to determine how many
    try {
      // Try to get a count of total products to calculate total pages
      // This is optional and depends on your GraphQL schema supporting it
      const countResponse = await client.query({
        query: GET_PRODUCT_COUNT,
        variables: {
          search: searchQuery,
          category,
        },
        fetchPolicy: "network-only",
      });

      const totalProducts = countResponse.data.products.pageInfo.total || 0;
      totalPages = Math.ceil(totalProducts / first);
    } catch (error) {
      // Fallback if count query fails or isn't available
      totalPages = currentPage + 1; // At least one more page
    }
  } else {
    // If there are no more pages, we know the total
    totalPages = currentPage;
  }

  return (
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

      <ShopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={pageInfo.hasNextPage}
        hasPreviousPage={currentPage > 1}
      />
    </div>
  );
}
