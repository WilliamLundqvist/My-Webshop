import React from 'react'

import { getClient } from '@faustwp/experimental-app-router';
import { gql } from '@apollo/client';
import Image from 'next/image';


const page = async () => {
  const client = await getClient();

  const { data } = await client.query({
    query: gql`query GET_HOMEPAGEDATA2 {
      page(id: "home", idType: URI) {
        hero {
          title
          __typename
          description
          heroImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `,
  });

  const hero = data.page.hero;
  

  return (
    <div>
      <h1>{hero.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: hero.description }} />
      <Image src={hero.heroImage.node.sourceUrl} alt={hero.title} width={1000} height={1000} />
    </div>
  )
}

export default page