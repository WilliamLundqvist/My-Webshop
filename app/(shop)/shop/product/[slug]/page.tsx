import { getClient } from '@faustwp/experimental-app-router';
import Link from 'next/link';
import { ProductDetail } from '@/components/shop/ProductDetail';
import { Button } from '@/components/ui/button';

import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql/queries';
import { Product } from '@/types/product';
import BackButton from '@/components/shop/BackButton';
import { RelatedProducts } from '@/components/shop/Related-Products';

export default async function ProductPage({ params, searchParams }) {
  // Await params först
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const section = awaitedParams.section;

  // Await searchParams först
  const awaitedSearchParams = await searchParams;

  // Extract reference search parameters
  const refSearch = awaitedSearchParams?.ref_search;
  const refSort = awaitedSearchParams?.ref_sort;
  const refOrder = awaitedSearchParams?.ref_order;
  const refPage = awaitedSearchParams?.ref_page;
  const refCategory = awaitedSearchParams?.ref_category;

  // Build the back link URL with preserved search context
  const buildBackToResultsUrl = () => {
    const params = new URLSearchParams();

    if (refSearch) params.set('search', refSearch);
    if (refSort) params.set('sort', refSort);
    if (refOrder) params.set('order', refOrder);
    if (refPage) params.set('page', refPage);
    if (refCategory) params.set('category', refCategory);

    if (params.toString()) {
      return `/shop/section/${section}?${params.toString()}`;
    }

    return `/shop/section/${section}`;
  };

  const backUrl = buildBackToResultsUrl();
  const hasSearchContext = refSearch || refSort || refPage || refCategory;

  const client = await getClient();

  const { data } = await client.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug },
    fetchPolicy: 'network-only',
  });

  // Fix: Get the first product from the nodes array
  const product: Product = data?.products?.nodes?.[0];

  if (!product) {
    return (
      <div className="container mx-auto px-md">
        <div className="p-md rounded mb-md text-sm bg-error/10 text-error border border-error/30">
          Product not found.
        </div>
        <Button asChild variant="outline">
          <Link href={backUrl}>{hasSearchContext ? 'Back to Results' : 'Back to Products'}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-md">
      <BackButton className="my-4" />
      <ProductDetail product={product} />
      <RelatedProducts products={product} />
    </div>
  );
}
