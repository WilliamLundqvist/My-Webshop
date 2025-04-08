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
import { OrderEnum } from '@/lib/graphql/generated/graphql';
import { ProductsOrderByEnum } from '@/lib/graphql/generated/graphql';

// Definiera typer för søkeparametrar
interface ShopSearchParams {
  sort?: string;
  order?: string;
  search?: string;
  category?: string;
  page?: string;
  [key: string]: string | undefined;
}

// Använd korrekt typning för Next.js i ditt projekt
export default async function ShopPage({
  searchParams,
  params,
}: {
  searchParams: any; // Eller Promise<Record<string, string>> om det behövs
  params: Promise<{ section: string }>; // Här är nyckeln - params som Promise
}) {
  const client = await getClient();

  // Await params för att få ut värden
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const section = awaitedParams.section;

  // Korrekt typat objekt med explicit typannotering
  const finalSearchParams: ShopSearchParams = {};

  // Generisk hantering av ref_parametrar
  Object.entries(awaitedSearchParams).forEach(([key, value]) => {
    if (key.startsWith('ref_')) {
      const actualKey = key.replace('ref_', '');
      finalSearchParams[actualKey] = value as string;
    } else {
      finalSearchParams[key] = value as string;
    }
  });

  const productsPerPage = 20;
  const sortField = finalSearchParams.sort || 'DATE';
  const sortOrder = finalSearchParams.order || 'DESC';
  const searchQuery = finalSearchParams.search || '';
  const category = finalSearchParams.category || '';

  // Get page from URL params or default to 1
  const currentPage = Number.parseInt(finalSearchParams.page || '1');

  // Calculate offset for pagination
  const offset = (currentPage - 1) * productsPerPage;

  const productsResponse = await client.query({
    query: GET_PRODUCTS,
    variables: {
      first: productsPerPage,
      after: null,
      orderby: [{ field: sortField as ProductsOrderByEnum, order: sortOrder as OrderEnum }],
      search: searchQuery,
      category: category ? category : section,
      offset: offset,
    },
  });

  const countResponse = await client.query({
    query: GET_PRODUCT_COUNT,
    variables: {
      search: searchQuery,
      category: category ? category : section,
    },
  });

  const products = productsResponse.data.products.nodes;
  const totalProducts = countResponse.data.products.found;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Determine if there are more pages
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // För att lösa URLSearchParams-felet till ProductGrid
  const searchParamsForProductGrid = new URLSearchParams();
  Object.entries(finalSearchParams).forEach(([key, value]) => {
    if (value) {
      searchParamsForProductGrid.set(key, value);
    }
  });

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
                <BreadcrumbItem>
                  <span>{category}</span>
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
        <StickyFilterButton />

        {products.length > 0 ? (
          <ProductGrid products={products} searchParams={searchParamsForProductGrid} />
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
