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

// This is the server component that fetches data
export default async function ShopPage({ searchParams, params }) {
  const client = await getClient();

  // Await params och searchParams innan du använder deras egenskaper
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const section = awaitedParams.section;

  const finalSearchParams = { ...awaitedSearchParams };
  if (awaitedSearchParams.ref_search) {
    finalSearchParams.search = awaitedSearchParams.ref_search;
    delete finalSearchParams.ref_search;
  }
  if (awaitedSearchParams.ref_sort) {
    finalSearchParams.sort = awaitedSearchParams.ref_sort;
    delete finalSearchParams.ref_sort;
  }
  if (awaitedSearchParams.ref_order) {
    finalSearchParams.order = awaitedSearchParams.ref_order;
    delete finalSearchParams.ref_order;
  }
  if (awaitedSearchParams.ref_page) {
    finalSearchParams.page = awaitedSearchParams.ref_page;
    delete finalSearchParams.ref_page;
  }
  if (awaitedSearchParams.ref_category) {
    finalSearchParams.category = awaitedSearchParams.ref_category;
    delete finalSearchParams.ref_category;
  }

  const productsPerPage = 20; // Number of products per page
  const sortField = finalSearchParams?.sort || 'DATE'; // Default sort by date
  const sortOrder = finalSearchParams?.order || 'DESC'; // Default sort direction
  const searchQuery = finalSearchParams?.search || ''; // Get search query from URL
  const category = finalSearchParams?.category || ''; // Get category from URL

  // Get page from URL params or default to 1
  const currentPage = Number.parseInt(finalSearchParams?.page) || 1;

  // Calculate offset for pagination
  const offset = (currentPage - 1) * productsPerPage;

  // Get total count of products for pagination

  const [countResponse, productsResponse] = await Promise.all([
    client.query({
      query: GET_PRODUCT_COUNT,
      variables: {
        search: searchQuery,
        category: category ? category : section,
      },
    }),
    client.query({
      query: GET_PRODUCTS,
      variables: {
        first: productsPerPage,
        after: null,
        orderby: [{ field: sortField, order: sortOrder }],
        search: searchQuery,
        category: category ? category : section,
        offset: offset,
      },
      fetchPolicy: 'cache-first',
    }),
  ]);

  const products = productsResponse.data.products.nodes;
  const totalProducts = countResponse.data.products.found;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Determine if there are more pages
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className="mx-auto px-2 md:px-4 flex flex-col gap-4">
      <SidebarInset>
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
                <BreadcrumbItem>x </BreadcrumbItem>
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
        <StickyFilterButton />

        {products.length > 0 ? (
          <ProductGrid products={products} searchParams={finalSearchParams} />
        ) : (
          <div className="py-xl text-center">
            <p className="text-lg text-text-secondary">No products found.</p>
          </div>
        )}

        <ShopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          baseUrl={`/shop/section/${section}`}
          searchParams={finalSearchParams}
        />
      </SidebarInset>
    </div>
  );
}
