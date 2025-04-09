import { getClient } from '@faustwp/experimental-app-router';
import Link from 'next/link';
import { ProductDetail } from '@/components/shop/ProductDetail';
import { Button } from '@/components/ui/button';

import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql/queries';
import { Product } from '@/types/product';
import BackButton from '@/components/shop/BackButton';
import { RelatedProducts } from '@/components/shop/Related-Products';

export default async function ProductPage({ params }) {
  // Await params först
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const section = awaitedParams.section;

  const backUrl = `/shop/section/${section}`;
  const hasSearchContext = false; // Eftersom vi inte längre kollar ref-parametrar

  const client = await getClient();

  const { data } = await client.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug },
    fetchPolicy: 'cache-first',
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
