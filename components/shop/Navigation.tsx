"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { GET_HEADER_LINKS } from "@/lib/graphql/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

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

export default function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_HEADER_LINKS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  const title = data.generalSettings.title;
  const description = data.generalSettings.description;
  const menuItems = data.primaryMenuItems.nodes;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Close the search input
      setIsSearchOpen(false);
      // Preserve existing URL params while updating search param
      const params = new URLSearchParams(window.location.search);
      params.set("search", searchQuery.trim());
      router.push(`/shop?${params.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-xl font-bold">
                  POWERFIT
                </Link>
                <Link href="#" className="text-lg">
                  Equipment
                </Link>
                <Link href="#" className="text-lg">
                  Weights
                </Link>
                <Link href="#" className="text-lg">
                  Machines
                </Link>
                <Link href="#" className="text-lg">
                  Accessories
                </Link>
                <Link href="#" className="text-lg">
                  New Arrivals
                </Link>
                <Link href="#" className="text-lg">
                  Sale
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search icon on the left side for mobile only */}
          <div className="md:hidden">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-[200px] pr-8 [&::-webkit-search-cancel-button]:appearance-none [&::-ms-clear]:hidden"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close search</span>
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
        </div>

        <Link href="/" className="md:mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">POWERFIT</span>
        </Link>
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-1">
          {menuItems.map((item) => (
            <Button variant="ghost" className=" h-auto" asChild key={item.id}>
              <Link
                href={item.uri}
                className=" font-bold transition-colors hover:text-primary"
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
              <form
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-[300px] pr-8 [&::-webkit-search-cancel-button]:appearance-none [&::-ms-clear]:hidden"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close search</span>
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
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
