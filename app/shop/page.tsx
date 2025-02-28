import { getClient } from "@faustwp/experimental-app-router";
import { gql } from "@apollo/client";
import ProductGrid from "../components/ProductGrid";

export default async function Home() {
  let client = await getClient();

  const { data } = await client.query({
    query: gql`
      query {
        products(first: 100) {
          nodes {
            id
            name
            description
            slug
            sku
            image {
              sourceUrl
            }
          }
        }
      }
    `,
  });

  return (
    <div className="container mx-auto px-md">
      <div className="flex items-center my-md text-sm text-secondary">
        <div className="flex items-center">
          <span className="font-medium text-text-primary">Home</span>
        </div>
      </div>
      
      <h1 className="my-xl text-4xl font-semibold text-text-primary">Products</h1>
      
      <ProductGrid products={data.products.nodes} />
    </div>
  );
}
