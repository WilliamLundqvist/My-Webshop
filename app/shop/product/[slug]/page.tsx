import { getClient } from "@faustwp/experimental-app-router";
import Link from "next/link";
import ProductDetail from "../../../../components/shop/ProductDetail";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GET_PRODUCT_BY_SLUG } from "@/lib/graphql/queries";

export default async function ProductPage({ params, searchParams }) {
  const slug = params.slug;

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
      return `/shop?${params.toString()}`;
    }

    return "/shop";
  };

  const backUrl = buildBackToResultsUrl();
  const hasSearchContext = refSearch || refSort || refPage || refCategory;

  const client = await getClient();

  const { data } = await client.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug },
  });

  const product = data?.products?.nodes[0];

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/shop">Shop</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {refCategory && (
            <>
              <BreadcrumbItem>
                <Link href={backUrl}>{refCategory}</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <Link href={`/shop/product/${product.slug}`}>{product.name}</Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-4">
        <Button asChild variant="outline" className="mb-6">
          <Link href={backUrl}>
            {hasSearchContext ? "← Back to Results" : "← Back to Products"}
          </Link>
        </Button>
      </div>

      <ProductDetail product={product} />
    </div>
  );
}
