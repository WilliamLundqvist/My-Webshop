import { gql } from "@apollo/client";
import { getAuthClient } from "@faustwp/experimental-app-router";
import { redirect } from "next/navigation";
import { logout } from "./actions";
import Link from "next/link";
import { GET_CART, GET_VIEWER } from "@/lib/graphql/queries";

export default async function Page() {
  const client = await getAuthClient();

  if (!client) {
    return redirect("/login");
  }

  const [cartData, viewerData] = await Promise.all([
    client.query({
      query: GET_CART,
      fetchPolicy: "network-only",
    }),
    client.query({
      query: GET_VIEWER,
      fetchPolicy: "network-only",
    }),
  ]);

  return (
    <>
      <div className="container mx-auto px-4 py-8 h-full">
        <h2 className="text-2xl font-bold mb-6">Välkommen {viewerData.data.viewer.name}</h2>

        {/* Kundvagnssektionen */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Min kundvagn</h3>
          {cartData.data.cart.isEmpty ? (
            <p>Din kundvagn är tom</p>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produkt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pris
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Antal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totalt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartData.data.cart.contents.nodes.map((item) => {
                      const product = item.product.node;
                      const variation = item.variation?.node;

                      // Hitta attribut (färg, storlek, etc) om det finns
                      const attributes = variation?.attributes?.nodes || [];
                      const color = attributes.find(
                        (attr) =>
                          attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "färg"
                      )?.value;
                      const size = attributes.find(
                        (attr) =>
                          attr.name.toLowerCase() === "size" ||
                          attr.name.toLowerCase() === "storlek"
                      )?.value;

                      return (
                        <tr key={item.key}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.image?.sourceUrl && (
                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                  <img
                                    className="h-10 w-10 object-cover"
                                    src={product.image.sourceUrl}
                                    alt={product.name}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                {(color || size) && (
                                  <div className="text-sm text-gray-500">
                                    {color && <span>Färg: {color}</span>}
                                    {color && size && <span> | </span>}
                                    {size && <span>Storlek: {size}</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div dangerouslySetInnerHTML={{ __html: item.total }} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div dangerouslySetInnerHTML={{ __html: item.total }} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">
                        Totalsumma:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div dangerouslySetInnerHTML={{ __html: cartData.data.cart.total }} />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mt-4">
                <Link
                  href="/checkout"
                  className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  Gå till kassan
                </Link>
              </div>
            </>
          )}
        </div>

        <form action={logout} className="mt-8">
          <button
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
          >
            Logga ut
          </button>
        </form>
      </div>
    </>
  );
}
