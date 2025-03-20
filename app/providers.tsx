"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { getClient } from "@faustwp/experimental-app-router";

export function Providers({ children }: { children: ReactNode }) {
  // Använd createApolloClient från @faustwp/experimental-app-router
  // Detta kommer att skapa en klient vid runtime på klientsidan

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
