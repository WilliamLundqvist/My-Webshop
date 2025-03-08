"use client";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function StickyFilterButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden ">
      <Button
        onClick={toggleSidebar}
        className="rounded-full shadow-lg"
        size="icon"
        variant="secondary"
      >
        <SlidersHorizontal className="h-5 w-5" />
        <span className="sr-only">Toggle Filters</span>
      </Button>
    </div>
  );
}
