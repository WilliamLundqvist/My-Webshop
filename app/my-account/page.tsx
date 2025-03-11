import { gql } from "@apollo/client";
import { getAuthClient } from "@faustwp/experimental-app-router";
import { redirect } from "next/navigation";
import { logout } from "./actions";

export default async function Page() {
  const client = await getAuthClient();

  if (!client) {
    return redirect("/login");
  }

  const { data } = await client.query({
    query: gql`
      query GetViewer {
        viewer {
          name
          posts {
            nodes {
              id
              title
            }
          }
        }
      }
    `,
    fetchPolicy: "network-only",
  });

  return (
    <>
      <h2>Welcome {data.viewer.name}</h2>

      <h3>My Posts</h3>
      <ul>
        {data.viewer.posts.nodes.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </>
  );
}
