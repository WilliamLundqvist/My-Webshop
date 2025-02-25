import { gql } from "@apollo/client";
import { getClient } from "@faustwp/experimental-app-router";
import React from "react";

const page = async ({ params }) => {
  const slug = (await params).slug;

  console.log(slug);

  const GET_PRODUCT_BY_SLUG = gql`
    query GET_PRODUCT_BY_SLUG($slug: [String]) {
      products(where: { slugIn: $slug }) {
        nodes {
          ... on SimpleProduct {
            price(format: RAW)
            shortDescription(format: RAW)
          }
          id
          name
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
  console.log(product);

  if (!product) {
    return <p>Product not found.</p>;
  }
  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image.sourceUrl} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      <p>SKU: {product.sku}</p>
      <p>Stock Status: {product.stockStatus}</p>
    </div>
  );
};

export default page;
