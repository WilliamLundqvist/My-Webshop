'use client';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { WordPressBlocksViewer } from '@faustwp/blocks';
import { flatListToHierarchical } from '@faustwp/core';
import blocks from '@/wp-blocks';
import { LoaderCircle } from 'lucide-react';
import '../styles/wordpress-blocks.css';

// Definiera query med nödvändiga fragment
const GET_CONTENT_NODE = gql`
  ${blocks.CoreParagraph?.fragments.entry || ''}
  ${blocks.CoreHeading?.fragments.entry || ''}
  ${blocks.CoreImage?.fragments.entry || ''}
  ${blocks.CoreSeparator?.fragments.entry || ''}
  ${blocks.CoreList?.fragments.entry || ''}
  ${blocks.CoreListItem?.fragments.entry || ''}
  ${blocks.CoreButton?.fragments.entry || ''}
  ${blocks.CoreButtons?.fragments.entry || ''}
  ${blocks.CoreCode?.fragments.entry || ''}
  ${blocks.CoreQuote?.fragments.entry || ''}
  ${blocks.CoreColumns?.fragments.entry || ''}
  ${blocks.CoreColumn?.fragments.entry || ''}
  query GetContentNode($id: ID!) {
    contentNode(id: $id, idType: URI) {
      ... on Post {
        title
        content
        editorBlocks {
          name
          __typename
          renderedHtml
          id: clientId
          parentId: parentClientId
          ${blocks.CoreParagraph?.fragments.key ? `...${blocks.CoreParagraph.fragments.key}` : ''}
          ${blocks.CoreHeading?.fragments.key ? `...${blocks.CoreHeading.fragments.key}` : ''}
          ${blocks.CoreImage?.fragments.key ? `...${blocks.CoreImage.fragments.key}` : ''}
          ${blocks.CoreSeparator?.fragments.key ? `...${blocks.CoreSeparator.fragments.key}` : ''}
          ${blocks.CoreList?.fragments.key ? `...${blocks.CoreList.fragments.key}` : ''}
          ${blocks.CoreListItem?.fragments.key ? `...${blocks.CoreListItem.fragments.key}` : ''}
          ${blocks.CoreButton?.fragments.key ? `...${blocks.CoreButton.fragments.key}` : ''}
          ${blocks.CoreButtons?.fragments.key ? `...${blocks.CoreButtons.fragments.key}` : ''}
          ${blocks.CoreCode?.fragments.key ? `...${blocks.CoreCode.fragments.key}` : ''}
          ${blocks.CoreQuote?.fragments.key ? `...${blocks.CoreQuote.fragments.key}` : ''}
          ${blocks.CoreColumns?.fragments.key ? `...${blocks.CoreColumns.fragments.key}` : ''}
          ${blocks.CoreColumn?.fragments.key ? `...${blocks.CoreColumn.fragments.key}` : ''}
        }
      }
      ... on Page {
        title
        content
        editorBlocks {
          name
          __typename
          renderedHtml
          id: clientId
          parentId: parentClientId
          ${blocks.CoreParagraph?.fragments.key ? `...${blocks.CoreParagraph.fragments.key}` : ''}
          ${blocks.CoreHeading?.fragments.key ? `...${blocks.CoreHeading.fragments.key}` : ''}
          ${blocks.CoreImage?.fragments.key ? `...${blocks.CoreImage.fragments.key}` : ''}
          ${blocks.CoreSeparator?.fragments.key ? `...${blocks.CoreSeparator.fragments.key}` : ''}
          ${blocks.CoreList?.fragments.key ? `...${blocks.CoreList.fragments.key}` : ''}
          ${blocks.CoreListItem?.fragments.key ? `...${blocks.CoreListItem.fragments.key}` : ''}
          ${blocks.CoreButton?.fragments.key ? `...${blocks.CoreButton.fragments.key}` : ''}
          ${blocks.CoreButtons?.fragments.key ? `...${blocks.CoreButtons.fragments.key}` : ''}
          ${blocks.CoreCode?.fragments.key ? `...${blocks.CoreCode.fragments.key}` : ''}
          ${blocks.CoreQuote?.fragments.key ? `...${blocks.CoreQuote.fragments.key}` : ''}
          ${blocks.CoreColumns?.fragments.key ? `...${blocks.CoreColumns.fragments.key}` : ''}
          ${blocks.CoreColumn?.fragments.key ? `...${blocks.CoreColumn.fragments.key}` : ''}
        }
      }
      date
    }
  }
`;

export default function Page() {
  const params = useParams();
  const slug = params.slug;

  const { loading, error, data } = useQuery(GET_CONTENT_NODE, {
    variables: {
      id: slug,
    },
    skip: !slug,
  });

  // Om vi inte är klient än, visa enbart laddningssidan
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin  " size={64} />
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;
  if (!data?.contentNode) return <div>Innehållet kunde inte hittas</div>;

  // Konvertera platt lista till hierarkisk struktur
  const blockList = data?.contentNode?.editorBlocks
    ? flatListToHierarchical(data.contentNode.editorBlocks, {
        childrenKey: 'innerBlocks',
      })
    : [];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">{data?.contentNode?.title}</h2>

      {blockList.length > 0 ? (
        <div className="prose prose-lg max-w-none wordpress-blocks-container">
          <WordPressBlocksViewer blocks={blockList} />
        </div>
      ) : (
        <div
          className="prose prose-sm max-w-none wordpress-blocks-container"
          dangerouslySetInnerHTML={{ __html: data?.contentNode?.content ?? '' }}
        />
      )}
    </main>
  );
}
