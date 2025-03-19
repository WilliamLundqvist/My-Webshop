import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StickyFilterButton } from "@/components/shop/StickyFilterButton";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ProductSkeleton = () => (
  <Card className="gap-2 md:gap-4 h-full">
    <div className="aspect-square overflow-hidden">
      <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
    </div>
    <CardContent className="flex flex-col gap-2">
      <h2 className="line-clamp-2 font-medium text-md w-20 h-4 bg-gray-200 rounded  animate-pulse" />
      <div className="flex items-center gap-2">
        <div className="w-10 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardContent>
    <CardFooter className="mt-auto"></CardFooter>
  </Card>
);

export default function ShopLoading() {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarInset>
        <div className="mx-auto w-full px-2 md:px-4">
          <Breadcrumb className="py-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/shop">Shop</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <div className="bg-gray-200 h-4 w-20 rounded animate-pulse"></div>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-text-primary">
              <div className="bg-gray-200 h-8 w-40 rounded animate-pulse"></div>
            </h1>
            <div className="text-sm text-muted-foreground">
              <div className="bg-gray-200 h-4 w-24 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 w-full my-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={`skeleton-${index}`}>
                <ProductSkeleton />
              </div>
            ))}
          </div>

          <Pagination className="my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive={true}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="pointer-events-none opacity-50" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </SidebarInset>
      <StickyFilterButton />
    </SidebarProvider>
  );
}
