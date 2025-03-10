"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationProps {
  generalSettings: {
    title: string;
    description: string;
  };
  primaryMenuItems: {
    nodes: {
      id: string;
      label: string;
      uri: string;
      databaseId: number;
    }[];
  };
}

export default function Navigation({
  generalSettings,
  primaryMenuItems,
}: NavigationProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const isShopPage = pathname === "/shop";
  const section = pathname.split("/")[3];

  // Extract menu items directly from props - memoize to prevent unnecessary processing
  const menuItems = useMemo(
    () => primaryMenuItems?.nodes || [],
    [primaryMenuItems]
  );

  // Function to check if a menu item is a category link
  const isCategoryLink = useCallback((uri: string) => {
    return uri.includes("/shop/section/") || uri.includes("/shop/section/%3D");
  }, []);

  // Non-category menu items - memoize to prevent recalculation on every render
  const nonCategoryMenuItems = useMemo(
    () => menuItems.filter((item) => !isCategoryLink(item.uri)),
    [menuItems, isCategoryLink]
  );

  // Handle search form submission with useCallback
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Close the search input
        setIsSearchOpen(false);
        // Preserve existing URL params while updating search param
        const params = new URLSearchParams(window.location.search);
        params.set("search", searchQuery.trim());
        router.push(
          section
            ? `/shop/section/${section}?${params.toString()}`
            : `/shop?${params.toString()}`
        );
      }
    },
    [searchQuery, router, section]
  );

  // Toggle search open/closed
  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  // Create a reusable search form component to avoid duplication
  const SearchForm = useCallback(
    () => (
      <form onSubmit={handleSearch} className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search..."
          className={cn(
            "pr-8 [&::-webkit-search-cancel-button]:appearance-none [&::-ms-clear]:hidden",
            isSearchOpen ? "w-[200px] md:w-[300px]" : "w-0"
          )}
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0"
          onClick={toggleSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close search</span>
        </Button>
      </form>
    ),
    [handleSearch, isSearchOpen, searchQuery, toggleSearch]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col space-y-4 py-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <span className="font-bold">
                    {generalSettings?.title || "Store"}
                  </span>
                </Link>
                <nav className="flex flex-col space-y-2">
                  {nonCategoryMenuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="justify-start"
                      asChild
                    >
                      <Link href={item.uri}>{item.label}</Link>
                    </Button>
                  ))}
                </nav>

                {/* Only show category buttons on shop page */}
              </div>
            </SheetContent>
          </Sheet>

          {/* Search icon on the left side for mobile only */}
          <div className="md:hidden">
            {isSearchOpen ? (
              <SearchForm />
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSearch}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
        </div>

        <Link href="/" className="md:mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">
            {generalSettings?.title || "Store"}
          </span>
        </Link>

        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-1">
          {/* Main menu items */}
          {menuItems.map((item) => (
            <Button key={item.id} variant="ghost" className="h-auto" asChild>
              <Link
                href={item.uri}
                className={cn(
                  pathname === item.uri
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Search icon on the right side for md screens and above */}
          <div className="hidden md:block">
            {isSearchOpen ? (
              <SearchForm />
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSearch}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
          <Link href="/my-account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
