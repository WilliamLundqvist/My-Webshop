'use client';
import React from 'react';
import { Button } from '../ui/button';
import { logout } from '@/app/(auth)/my-account/actions';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const AuthSidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  return (
    <nav className="w-full bg-muted p-4 rounded-lg">
      <ul className="flex flex-col gap-2">
        <li>
          <Link href="/my-account">
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive('/my-account') ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Dashboard
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/my-account/orders">
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive('/my-account/orders') ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Orders
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/my-account/address">
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive('/my-account/address') ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Addresses
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/my-account/account-details">
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive('/my-account/account-details') ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Account details
            </Button>
          </Link>
        </li>
        <li>
          <form action={logout}>
            <Button variant="destructive" className="w-full">
              Logout
            </Button>
          </form>
        </li>
      </ul>
    </nav>
  );
};

export default AuthSidebar;
