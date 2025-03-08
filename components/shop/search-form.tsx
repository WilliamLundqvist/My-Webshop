"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarInput } from "@/components/ui/sidebar";

export function SearchForm({ defaultValue = "" }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <SidebarInput
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-8"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-8 w-8"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
