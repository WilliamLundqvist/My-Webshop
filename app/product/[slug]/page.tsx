import { gql } from "@apollo/client";
import { getClient } from "@faustwp/experimental-app-router";
import Link from "next/link";
import ProductDetail from "../../components/ProductDetail";

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
        <Link 
          href="/shop" 
          className="inline-flex items-center justify-center py-sm px-md rounded text-base font-medium transition-all bg-transparent text-primary border border-border hover:bg-surface"
        >
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-md">
      <div className="flex items-center my-md text-sm text-secondary">
        <div className="flex items-center">
          <Link href="/shop" className="text-secondary hover:text-text-primary transition-colors">
            Shop
          </Link>
          <span className="mx-xs text-text-tertiary">/</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-text-primary">{product.name}</span>
        </div>
      </div>
      
      <ProductDetail product={product} />
    </div>
  );
}
