'use client';
import { WordPressBlocksProvider } from '@faustwp/blocks';
import blocks from '@/wp-blocks';
import ApolloWrapper from '@/components/ApolloWrapper';

export default function RootLayout({ children }) {
  return (
    <ApolloWrapper>
      <WordPressBlocksProvider config={{ blocks }}>{children}</WordPressBlocksProvider>
    </ApolloWrapper>
  );
}
