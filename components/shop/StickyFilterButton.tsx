'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export function StickyFilterButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="md:hidden my-2">
      <Button onClick={toggleSidebar} className="w-1/2 rounded-full" variant="secondary">
        <span>Filter & Sort</span>
        <span className="sr-only">Toggle Filters</span>
      </Button>
    </div>
  );
}
