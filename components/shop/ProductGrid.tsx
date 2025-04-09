import React from 'react';
import ProductCard from './ProductCard';
import { getClient } from '@faustwp/experimental-app-router';
import { GET_PRODUCTS } from '@/lib/graphql/queries';
import { ProductsOrderByEnum, OrderEnum } from '@/lib/graphql/generated/graphql';
interface ProductGridProps {
  searchParams: URLSearchParams;
  section: string;
  category: string;
  searchQuery: string;
  currentPage: number;
  sortOrder: string;
  sortField: string;
}

const ProductGrid: React.FC<ProductGridProps> = async ({
  searchParams,
  section,
  category,
  searchQuery,
  currentPage,
  sortOrder,
  sortField,
}) => {
  const productsPerPage = 20;

  // Calculate offset for pagination
  const offset = (currentPage - 1) * productsPerPage;

  const client = await getClient();

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
    fetchPolicy: 'cache-first',
    context: {
      categorySlug: category || section,
      page: currentPage,
    },
  });

  const products = productsResponse.data.products.nodes;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div className="flex flex-col w-full h-full" key={product.id}>
            <ProductCard product={product} searchParams={searchParams} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
