import { gql } from "@apollo/client";
import { getClient } from "@faustwp/experimental-app-router";
import Link from "next/link";
import ProductDetail from "../../../components/ProductDetail";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function ProductPage({ params }) {
  const slug = params.slug;

  const GET_PRODUCT_BY_SLUG = gql`
    query GET_PRODUCT_BY_SLUG($slug: [String]) {
      products(where: { slugIn: $slug }) {
        nodes {
          ... on SimpleProduct {
            price(format: RAW)
            stockStatus
          }
          id
          name
          description(format: RAW)
          slug
          sku
          image {
            sourceUrl
          }
        }
      }
    }
  `;

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
          <Link href="/shop">Back to Products</Link>
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
          <BreadcrumbItem>
            <Link href={`/shop/product/${product.slug}`}>{product.name}</Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ProductDetail product={product} />
    </div>
  );
}
