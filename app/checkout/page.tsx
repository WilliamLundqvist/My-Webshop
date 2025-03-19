import { Metadata } from "next";
import { getAuthClient } from "@faustwp/experimental-app-router";
import { redirect } from "next/navigation";
import { GET_CUSTOMER, GET_PAYMENT_METHODS } from "@/lib/graphql/queries";
import CheckoutForm from "../../components/shop/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Genomför din beställning",
};

export default async function CheckoutPage() {
  // Hämta autentiserad klient
  const client = await getAuthClient();

  // Redirecta till login om användaren inte är autentiserad
  if (!client) {
    return redirect("/login");
  }

  // Hämta kundinformation och betalningsmetoder
  const [customerResponse, paymentMethodsResponse] = await Promise.all([
    client.query({
      query: GET_CUSTOMER,
      fetchPolicy: "network-only",
    }),
    client.query({
      query: GET_PAYMENT_METHODS,
      fetchPolicy: "network-only",
    }),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <CheckoutForm
        initialCustomerData={customerResponse.data}
        paymentMethods={paymentMethodsResponse.data?.paymentGateways?.nodes || []}
      />
    </main>
  );
}
