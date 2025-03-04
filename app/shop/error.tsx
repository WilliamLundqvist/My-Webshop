'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ShopError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Shop page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-md py-xl">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-md text-text-primary">Something went wrong</h1>
        
        <div className="p-lg bg-error/10 text-error rounded border border-error/30 mb-lg text-left">
          <p className="mb-md font-medium">Error loading products:</p>
          <p className="font-mono text-sm overflow-auto p-md bg-error/5 rounded">
            {error.message || 'An unknown error occurred'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <button
            onClick={() => reset()}
            className="py-md px-lg bg-primary text-white border-none rounded text-base font-medium cursor-pointer transition-colors hover:bg-accent"
          >
            Try again
          </button>
          
          <Link
            href="/debug-env"
            className="py-md px-lg bg-transparent text-primary border border-border rounded text-base font-medium no-underline inline-flex items-center justify-center transition-colors hover:bg-surface"
          >
            Check Connection
          </Link>
        </div>
      </div>
    </div>
  );
} 