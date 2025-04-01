'use client';

import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/utils';
import CartDropdown from './CartDropdown';

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

export default function Navigation({ generalSettings, primaryMenuItems }: NavigationProps) {
  const pathname = usePathname();

  // Extract menu items directly from props - memoize to prevent unnecessary processing
  const menuItems = useMemo(() => primaryMenuItems?.nodes || [], [primaryMenuItems]);

  // Function to check if a menu item is a category link
  const isCategoryLink = useCallback((uri: string) => {
    return uri.includes('/shop/section/') || uri.includes('/shop/section/%3D');
  }, []);

  // Non-category menu items - memoize to prevent recalculation on every render
  const nonCategoryMenuItems = useMemo(
    () => menuItems.filter((item) => !isCategoryLink(item.uri)),
    [menuItems, isCategoryLink]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-[1400px] mx-auto px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetTitle>Menu</SheetTitle>
              <div className="flex flex-col space-y-4 py-6">
                <nav className="flex flex-col space-y-2">
                  {nonCategoryMenuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={pathname === item.uri ? 'secondary' : 'ghost'}
                      className={cn('justify-start', pathname === item.uri && 'font-semibold')}
                      asChild
                    >
                      <Link href={item.uri}>{item.label}</Link>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="md:mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">{generalSettings?.title || 'Store'}</span>
        </Link>

        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-1">
          {/* Main menu items */}
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={pathname === item.uri ? 'secondary' : 'ghost'}
              className={cn('h-auto', pathname === item.uri && 'font-semibold')}
              asChild
            >
              <Link
                href={item.uri}
                className={cn(pathname === item.uri ? 'text-foreground' : 'text-muted-foreground')}
              >
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/my-account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>

          <CartDropdown />
        </div>
      </div>
    </header>
  );
}
