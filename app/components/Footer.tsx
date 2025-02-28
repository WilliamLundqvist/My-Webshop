import { MenuItem, MenuItemChildItemsArgs, MenuItemLinkableConnectionEdge, MenuItemToMenuItemConnectionWhereArgs, MenuMenuItemsArgs, MenuToMenuItemConnection, MenuToMenuItemConnectionEdge, RootQueryToMenuItemConnection } from '@/src/__generated__/graphql';
import { gql } from '@apollo/client';
import { getClient } from '@faustwp/experimental-app-router';
import Link from 'next/link';

interface FooterProps {
  siteName: string;
  menuItems: {
    id: string;
    label: string;
    uri: string;
  }[];
}

export default async function Footer() {
  const client = await getClient();
 
  const { data } = await client.query({
    query: gql`
      query GetLayout {
        footerMenuItems: menuItems(where: { location: FOOTER }) {
          nodes {
            id
            label
            uri
          }
        }
      }
    `,
  });

  const menuItems = data.nodes || [];

  return (
    <footer className="py-xl border-t border-border bg-surface mt-xxl">
      <div className="container mx-auto px-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          <div className="footer-section">
            <h3 className="text-lg mb-md text-text-primary">About Us</h3>
            <p className="text-text-secondary">
              A modern e-commerce platform built with Next.js and Tailwind CSS.
            </p>
          </div>
          <div className="footer-section">
            <h3 className="text-lg mb-md text-text-primary">Quick Links</h3>
            <ul className="list-none">
              {menuItems.map((item) => (
                <li key={item.id} className="mb-sm">
                  <Link href={item.uri} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="text-lg mb-md text-text-primary">Contact</h3>
            <p className="text-sm text-text-secondary">
              Email: info@example.com<br />
              Phone: +1 (123) 456-7890
            </p>
          </div>
        </div>
        <div className="mt-xl pt-md border-t border-border text-center text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
} 