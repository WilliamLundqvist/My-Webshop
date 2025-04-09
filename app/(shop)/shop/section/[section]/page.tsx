import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ProductGrid from '@/components/shop/ProductGrid';
import { SidebarInset } from '@/components/ui/sidebar';
import { StickyFilterButton } from '@/components/shop/StickyFilterButton';
import { Suspense } from 'react';
import PaginationContainer from '@/components/shop/PaginationContainer';

// Definiera typer för søkeparametrar

type Params = Promise<{ section: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Använd korrekt typning för Next.js i ditt projekt
export default async function ShopPage(props: { params: Params; searchParams: SearchParams }) {
  // Await params för att få ut värden
  const params = await props.params;
  const searchParams = await props.searchParams;
  const section = params.section;

  const productsPerPage = 20;
  const searchQuery = searchParams.search || '';
  const category = searchParams.category || '';
  const pageParam = searchParams.page;
  const sortField = searchParams.sort || 'DATE';
  const sortOrder = searchParams.order || 'DESC';
  const currentPage = Number.parseInt(typeof pageParam === 'string' ? pageParam : '1');

  const searchParamsForProductGrid = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        searchParamsForProductGrid.set(key, value[0]);
      } else {
        searchParamsForProductGrid.set(key, value);
      }
    }
  });

  return (
    <div className="mx-auto px-2 md:px-4 flex flex-col gap-4">
      <SidebarInset>
        <Breadcrumb className="py-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/shop">Shop</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href={`/shop/section/${section}`}>{section}</Link>
            </BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span>{category}</span>
                </BreadcrumbItem>
              </>
            )}
            {searchQuery && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span>Search: {searchQuery}</span>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-text-primary">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : category
                ? `${category}`
                : 'Products'}
          </h1>
          <div className="text-sm text-muted-foreground">{productsPerPage} products</div>
        </div>
        <StickyFilterButton />

        <ProductGrid
          searchParams={searchParamsForProductGrid}
          section={section}
          category={category as string}
          searchQuery={searchQuery as string}
          currentPage={currentPage}
          sortOrder={sortOrder as string}
          sortField={sortField as string}
        />

        {/* Här är det viktiga: vi wrapped PaginationContainer i Suspense */}
        <Suspense fallback={<PaginationSkeleton />}>
          <PaginationContainer
            section={section}
            category={category as string}
            searchQuery={searchQuery as string}
            productsPerPage={productsPerPage}
            currentPage={currentPage}
            searchParams={searchParams as Record<string, string>}
          />
        </Suspense>
      </SidebarInset>
    </div>
  );
}

// Skelettet som visas medan pagineringen laddar
function PaginationSkeleton() {
  return (
    <div className="my-8 animate-pulse">
      <div className="flex justify-center gap-4">
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
