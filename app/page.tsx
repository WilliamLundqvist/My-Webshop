import { getClient } from "@faustwp/experimental-app-router";
import { gql } from "@apollo/client";
import Link from "next/link";

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
    <main>
      <h2>Products</h2>
      <ul>
        {data.products.nodes.map((product) => (
          <li>
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
