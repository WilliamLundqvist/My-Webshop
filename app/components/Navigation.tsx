"use client"

import { gql } from '@apollo/client';
import { getClient } from '@faustwp/experimental-app-router';
import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface NavigationProps {
  title: string;
  description: string;
  menuItems: {
    id: string;
    label: string;
    uri: string;
  }[];
}

export default function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  // const client = await getClient();
  
  // Log the WordPress URL to verify which server we're connecting to


  // const { data } = await client.query<{
  //   generalSettings: {
  //     title: string;
  //     description: string;
  //   };
  //   primaryMenuItems: {
  //     nodes: {
  //       id: string;
  //       label: string;
  //       uri: string;
  //       databaseId: number;
  //     }[];
  //   };
  // }>({
  //   query: gql`
  //     query GetLayout {
  //       generalSettings {
  //         title
  //         description
      
  //       }
  //       primaryMenuItems: menuItems(where: {location: PRIMARY}) {
  //         nodes {
  //           id
  //           label
  //           uri
  //           databaseId
  //         }
  //       }
  //     }
  //   `,
  //   fetchPolicy: 'network-only',
  // });


  // const title = data.generalSettings.title;
  // const description = data.generalSettings.description;
  // const menuItems = data.primaryMenuItems.nodes;

  return (
    // <header className="py-md border-b border-border bg-background">
    //   <div className="container mx-auto px-md">
    //     <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-md">
    //       <div className="flex flex-col">
    //         <h1 className="text-2xl font-bold text-primary m-0">
    //           <Link href="/">{title}</Link>
    //         </h1>
    //         <h5 className="text-sm text-secondary m-0">{description}</h5>
           
    //       </div>
    //       <nav className="flex items-center">
    //         <ul className="flex list-none gap-md">
    //           {menuItems.map((item) => (
    //             <li key={item.id} className="text-base text-text-primary hover:text-accent transition-colors">
    //               <Link href={item.uri}>{item.label}</Link>
    //             </li>
    //           ))}
    //         </ul>
    //       </nav>
    //     </div>
    //   </div>
    // </header>



    <header className="sticky top-0 z-50 w-full border-b bg-background">
    <div className="container mx-auto flex h-16 items-center">
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
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="text-xl font-bold">POWERFIT</span>
      </Link>
      <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-6">
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
          Equipment
        </Link>
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
          Weights
        </Link>
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
          Machines
        </Link>
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
          Accessories
        </Link>
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
          New Arrivals
        </Link>
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
          Sale
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        {isSearchOpen ? (
          <div className="relative flex items-center">
            <Input type="search" placeholder="Search..." className="w-[200px] pr-8 md:w-[300px]" autoFocus />
            <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}
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