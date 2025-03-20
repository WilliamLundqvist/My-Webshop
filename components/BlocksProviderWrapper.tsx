"use client";

import { WordPressBlocksProvider } from "@faustwp/blocks";
import blocks from "@/wp-blocks";
import { ReactNode } from "react";

export default function BlocksProviderWrapper({ children }: { children: ReactNode }) {
  return <WordPressBlocksProvider config={{ blocks }}>{children}</WordPressBlocksProvider>;
}
