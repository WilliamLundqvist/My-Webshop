"use client";
import { WordPressBlocksProvider } from "@faustwp/blocks";
import blocks from "@/wp-blocks";

export default function RootLayout({ children }) {
  return <WordPressBlocksProvider config={{ blocks }}>{children}</WordPressBlocksProvider>;
}
