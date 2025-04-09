// 1. Skapa en ny fil: components/shop/PaginationContainer.tsx
import { GET_PRODUCT_COUNT } from '@/lib/graphql/queries';
import ShopPagination from '@/components/shop/ShopPagination';
import { getClient } from '@faustwp/experimental-app-router';

interface PaginationContainerProps {
  section: string;
  category?: string;
  searchQuery?: string;
  productsPerPage: number;
  currentPage: number;
  searchParams: Record<string, string>;
}

export default async function PaginationContainer({
  section,
  category,
  searchQuery,
  productsPerPage,
  currentPage,
  searchParams,
}: PaginationContainerProps) {
  // Flyttar hit produkträkning från huvudsidan
  const client = await getClient();
  const countResponse = await client.query({
    query: GET_PRODUCT_COUNT,
    variables: {
      search: searchQuery || '',
      category: category || section,
    },
    fetchPolicy: 'cache-first',
  });

  const totalProducts = countResponse.data.products.found;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Determine if there are more pages
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return (
    <ShopPagination
      currentPage={currentPage}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      baseUrl={`/shop/section/${section}`}
      searchParams={searchParams}
    />
  );
}
