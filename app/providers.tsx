'use client';

import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // Använd createApolloClient från @faustwp/experimental-app-router
  // Detta kommer att skapa en klient vid runtime på klientsidan

  return <>{children}</>;
}
