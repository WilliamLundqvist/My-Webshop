import { getClient } from '@faustwp/experimental-app-router';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface WordPressInfo {
  url: string;
  title?: string;
}

export default async function DebugEnvPage() {
  let wpInfo: WordPressInfo = { url: 'Could not connect' };
  let error = null;

  try {
    const client = await getClient();

    const { data } = await client.query({
      query: gql`
        query {
          generalSettings {
            title
            url
          }
        }
      `,
      fetchPolicy: 'network-only',
    });

    wpInfo = {
      url: data.generalSettings.url,
      title: data.generalSettings.title,
    };
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>

      <div className="bg-surface p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">WordPress Connection</h2>
        <ul className="list-disc pl-5">
          <li className="mb-2">
            <strong>WORDPRESS_URL (env):</strong>{' '}
            {process.env.NEXT_PUBLIC_WORDPRESS_URL || 'Not set'}
          </li>
          <li className="mb-2">
            <strong>FAUST_SECRET_KEY:</strong>{' '}
            {process.env.FAUST_SECRET_KEY ? '✓ Set (hidden for security)' : '✗ Not set'}
          </li>
          <li className="mb-2">
            <strong>WordPress Site URL (actual):</strong> {wpInfo.url}
          </li>
          {wpInfo.title && (
            <li className="mb-2">
              <strong>WordPress Site Title:</strong> {wpInfo.title}
            </li>
          )}
        </ul>

        {error && (
          <div className="mt-4 p-3 bg-error/10 text-error rounded border border-error/30">
            <strong>Error connecting to WordPress:</strong> {error}
          </div>
        )}
      </div>

      <div className="bg-surface p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">Cache Information</h2>
        <p>Next.js caches API responses by default. If you&apos;re seeing stale data:</p>
        <ol className="list-decimal pl-5 mt-2">
          <li className="mb-1">Make sure your WordPress URL is correct</li>
          <li className="mb-1">Clear the Next.js cache using the clear-cache.js script</li>
          <li className="mb-1">
            Use fetchPolicy: &apos;network-only&apos; in your GraphQL queries
          </li>
          <li className="mb-1">Check that your WordPress instance is properly configured</li>
        </ol>

        <div className="mt-4 flex gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Return to Home</Link>
          </Button>

          <Button asChild size="sm">
            <Link href="/shop">Go to Shop</Link>
          </Button>
        </div>
      </div>

      <div className="alert alert-info p-4 bg-info/10 text-info rounded border border-info/30">
        <p>If you&apos;ve recently changed these values, you may need to:</p>
        <ol className="list-decimal pl-5 mt-2">
          <li className="mb-1">Stop your Next.js server</li>
          <li className="mb-1">Clear your browser cache</li>
          <li className="mb-1">
            Run <code className="bg-surface px-1 py-0.5 rounded">node clear-cache.js</code>
          </li>
          <li className="mb-1">Restart your Next.js server</li>
        </ol>
      </div>
    </div>
  );
}
