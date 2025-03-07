import { getClient } from "@faustwp/experimental-app-router";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GET_PRODUCTS } from "@/lib/graphql/queries";
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

      {/* Use our new client-side pagination component */}
      <ShopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={pageInfo.hasNextPage}
        hasPreviousPage={currentPage > 1}
      />
    </div>
  );
}
