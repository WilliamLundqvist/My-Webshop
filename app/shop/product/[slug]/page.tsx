import { getClient } from "@faustwp/experimental-app-router";
import Link from "next/link";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { Button } from "@/components/ui/button";

import { GET_PRODUCT_BY_SLUG } from "@/lib/graphql/queries";
import { Product, Products } from "@/types/product";
import BackButton from "@/components/shop/BackButton";
export default async function ProductPage({ params, searchParams }) {
  const slug = params.slug;
  const section = params.section;

  // Extract reference search parameters
  const refSearch = searchParams?.ref_search;
  const refSort = searchParams?.ref_sort;
  const refOrder = searchParams?.ref_order;
  const refPage = searchParams?.ref_page;
  const refCategory = searchParams?.ref_category;

  // Build the back link URL with preserved search context
  const buildBackToResultsUrl = () => {
    const params = new URLSearchParams();

    if (refSearch) params.set("search", refSearch);
    if (refSort) params.set("sort", refSort);
    if (refOrder) params.set("order", refOrder);
    if (refPage) params.set("page", refPage);
    if (refCategory) params.set("category", refCategory);

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
          <Link href={backUrl}>
            {hasSearchContext ? "Back to Results" : "Back to Products"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-md">
      <BackButton className="my-4" />
      <ProductDetail product={product} />
    </div>
  );
}
