import { gql } from '@apollo/client';
import { getAuthClient } from '@faustwp/experimental-app-router';
import { redirect } from 'next/navigation';
import { logout } from './actions';

export default async function Page() {
  const client = await getAuthClient();

  if (!client) {
    redirect('/login');
  }

  const { data } = await client.query({
    query: gql`
      query GetViewer {
        viewer {
          name
          email
          posts {
            nodes {
              id
              title
            }
          }
        }
      }
    `,
  });

  return (
    <div className="container mx-auto py-xl px-md">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface p-lg rounded-lg mb-xl">
          <h1 className="text-2xl font-bold mb-md">My Account</h1>
          <div className="flex items-center justify-between mb-lg pb-md border-b border-border">
            <div>
              <h2 className="text-xl font-semibold mb-xs">Welcome, {data.viewer.name}</h2>
              {data.viewer.email && <p className="text-text-secondary">{data.viewer.email}</p>}
            </div>
            <form action={logout}>
              <button 
                type="submit"
                className="btn btn-secondary"
              >
                Logout
              </button>
            </form>
          </div>

          <div className="mb-xl">
            <h3 className="text-lg font-semibold mb-md">My Posts</h3>
            {data.viewer.posts.nodes.length > 0 ? (
              <ul className="divide-y divide-border">
                {data.viewer.posts.nodes.map((post) => (
                  <li key={post.id} className="py-sm">
                    {post.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-secondary">You haven't created any posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
