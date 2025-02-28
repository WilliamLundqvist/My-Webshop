import { gql } from '@apollo/client';
import { getClient } from '@faustwp/experimental-app-router';
import Link from 'next/link';

interface NavigationProps {
  title: string;
  description: string;
  menuItems: {
    id: string;
    label: string;
    uri: string;
  }[];
}

export default async function Navigation() {
  const client = await getClient();
  
  // Log the WordPress URL to verify which server we're connecting to
  console.log('WordPress GraphQL URL:', process.env.NEXT_PUBLIC_WORDPRESS_URL);

  const { data } = await client.query<{
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
  }>({
    query: gql`
      query GetLayout {
        generalSettings {
          title
          description
      
        }
        primaryMenuItems: menuItems(where: {location: PRIMARY}) {
          nodes {
            id
            label
            uri
            databaseId
          }
        }
      }
    `,
    fetchPolicy: 'network-only',
  });


  const title = data.generalSettings.title;
  const description = data.generalSettings.description;
  const menuItems = data.primaryMenuItems.nodes;

  return (
    <header className="py-md border-b border-border bg-background">
      <div className="container mx-auto px-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-md">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-primary m-0">
              <Link href="/">{title}</Link>
            </h1>
            <h5 className="text-sm text-secondary m-0">{description}</h5>
           
          </div>
          <nav className="flex items-center">
            <ul className="flex list-none gap-md">
              {menuItems.map((item) => (
                <li key={item.id} className="text-base text-text-primary hover:text-accent transition-colors">
                  <Link href={item.uri}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 