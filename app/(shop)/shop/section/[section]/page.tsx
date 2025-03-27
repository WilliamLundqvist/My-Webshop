import { getClient } from '@faustwp/experimental-app-router';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { GET_PRODUCTS, GET_PRODUCT_COUNT } from '@/lib/graphql/queries';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopPagination from '@/components/shop/ShopPagination';
import { SidebarInset } from '@/components/ui/sidebar';
import { StickyFilterButton } from '@/components/shop/StickyFilterButton';
import { redirect } from 'next/navigation';

// This is the server component that fetches data
export default async function ShopPage({ searchParams, params }) {
  const client = await getClient();
  const section = params.section;

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

  const first = 20; // Number of products per page
  const sortField = finalSearchParams?.sort || 'DATE'; // Default sort by date
  const sortOrder = finalSearchParams?.order || 'DESC'; // Default sort direction
  const searchQuery = finalSearchParams?.search || ''; // Get search query from URL
  const category = finalSearchParams?.category || ''; // Get category from URL

  // Get page from URL params or default to 1
  const currentPage = Number.parseInt(finalSearchParams?.page) || 1;

  // Create a cache for storing page-to-cursor mappings
  // In production, this could be moved to Redis or another persistent cache
  if (typeof global.cursorCache === 'undefined') {
    global.cursorCache = {};
  }

  const cacheKey = `${section || 'all'}-${category || 'none'}-${
    searchQuery || 'none'
  }-${sortField}-${sortOrder}`;

  // Initialize after/cursor value
  let after = '';

  // Check if we can use a cached cursor for this page
  if (currentPage > 1 && global.cursorCache[cacheKey]?.[currentPage - 1]) {
    after = global.cursorCache[cacheKey][currentPage - 1];
    console.log(`Using cached cursor for page ${currentPage}: ${after}`);
  }
  // For pages beyond page 1 without a cached cursor, we need to fetch sequentially
  else if (currentPage > 1) {
    // Create cache entry for this filter combination if it doesn't exist
    if (!global.cursorCache[cacheKey]) {
      global.cursorCache[cacheKey] = {};
    }

    // Start from the beginning and fetch all pages up to the requested one
    let lastCursor = '';

    for (let page = 1; page < currentPage; page++) {
      const prevPageResult = await client.query({
        query: GET_PRODUCTS,
        variables: {
          first,
          after: lastCursor,
          orderby: [{ field: sortField, order: sortOrder }],
          search: searchQuery,
          category: category ? category : section,
        },
        fetchPolicy: 'network-only',
      });

      if (!prevPageResult.data.products.pageInfo.hasNextPage) {
        // We've reached the end but user requested a later page
        console.log(`Page ${currentPage} is beyond the last page (${page})`);
        // Redirect to the last valid page
        return redirect(`/shop/section/${section}?page=${page}`);
      }

      lastCursor = prevPageResult.data.products.pageInfo.endCursor;

      // Cache this cursor for future use
      global.cursorCache[cacheKey][page] = lastCursor;
      console.log(`Cached cursor for page ${page}: ${lastCursor}`);
    }

    after = lastCursor;
  }

  // Now fetch the current page data
  const { data } = await client.query({
    query: GET_PRODUCTS,
    variables: {
      first,
      after,
      orderby: [{ field: sortField, order: sortOrder }],
      search: searchQuery,
      category: category ? category : section,
    },
    fetchPolicy: 'network-only',
  });

  const products = data.products.nodes;
  const pageInfo = data.products.pageInfo;

  // Store this page's endCursor for future requests
  if (pageInfo.hasNextPage) {
    if (!global.cursorCache[cacheKey]) {
      global.cursorCache[cacheKey] = {};
    }
    global.cursorCache[cacheKey][currentPage] = pageInfo.endCursor;
  }

  // Calculate total pages - fallback if the count query fails
  let totalPages = 1;

  if (pageInfo.hasNextPage) {
    totalPages = currentPage + 1; // At least one more page
  } else {
    totalPages = currentPage; // Current page is the last page
  }

  try {
    const countResponse = await client.query({
      query: GET_PRODUCT_COUNT,
      variables: {
        search: searchQuery,
        category: category ? category : section,
      },
    });

    if (countResponse.data.products.found) {
      const totalProducts = countResponse.data.products.found;
      totalPages = Math.ceil(totalProducts / first);
    }
  } catch (error) {
    console.error('Error calculating total pages:', error);
  }

  console.log(`PageInfo: `, pageInfo);

  // Create a helper function for page URL generation

  return (
    <div className="mx-auto px-2 md:px-4 flex flex-col gap-4">
      <SidebarInset>
        <StickyFilterButton />
        <Breadcrumb className="py-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/shop">Shop</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href={`/shop/section/${section}`}>{section}</Link>
            </BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link href={`/shop/section/${section}?category=${category}`}>{category}</Link>
                </BreadcrumbItem>
              </>
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
                : 'Products'}
          </h1>
          <div className="text-sm text-muted-foreground">{products.length} products</div>
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
          pageInfo={{
            startCursor: pageInfo.startCursor,
            endCursor: pageInfo.endCursor,
          }}
        />
      </SidebarInset>
    </div>
  );
}
