"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CART } from "../../lib/graphql/queries";
import { validateCheckoutForm, CheckoutFormData } from "../../lib/utils/checkout";
import { CountriesEnum } from "../../lib/graphql/generated/graphql";
import { handleCheckout } from "@/app/checkout/actions";

type PaymentMethod = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

type CheckoutFormProps = {
  initialCustomerData?: any;
  paymentMethods: PaymentMethod[];
};

export default function CheckoutForm({ initialCustomerData, paymentMethods }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: CountriesEnum.Se,
    phone: "",
  });

  // Ta alltid första betalningsmetoden om den finns, annars en default
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethods.length > 0 ? paymentMethods[0].id : "bacs"
  );

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cartData } = useQuery(GET_CART);

  // Fylla i formuläret automatiskt med initialCustomerData från server
  useEffect(() => {
    if (initialCustomerData?.customer) {
      const customer = initialCustomerData.customer;
      const billing = customer.billing;

      setFormData({
        firstName: billing.firstName || customer.firstName || "",
        lastName: billing.lastName || customer.lastName || "",
        email: billing.email || customer.email || "",
        address1: billing.address1 || "",
        address2: billing.address2 || "",
        city: billing.city || "",
        state: billing.state || "",
        postcode: billing.postcode || "",
        country: (billing.country as CountriesEnum) || CountriesEnum.Se,
        phone: billing.phone || "",
      });
    }
  }, [initialCustomerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validera formuläret
    const errors = validateCheckoutForm(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setIsSubmitting(true);

    if (!cartData?.cart) {
      setFormErrors(["Din varukorg är tom"]);
      setIsSubmitting(false);
      return;
    }

    if (!selectedPaymentMethod) {
      setFormErrors(["Välj en betalningsmetod"]);
      setIsSubmitting(false);
      return;
    }

    try {
      // Anropa server action för att hantera checkout
      const result = await handleCheckout({
        ...formData,
        company: "", // Lägg till detta fält som server action förväntar sig
        paymentMethod: selectedPaymentMethod,
      });

      if (result.success && result.order) {
        setOrderCompleted(true);
        setOrderNumber(result.order.orderNumber);
      } else {
        setFormErrors([result.error || "Ett okänt fel inträffade"]);
      }
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setFormErrors(["Ett fel uppstod när ordern skapades. Försök igen."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-green-600">Tack för din beställning!</h2>
        <p className="mb-4">Din order har mottagits.</p>
        <p className="mb-4">
          Ordernummer: <span className="font-bold">{orderNumber}</span>
        </p>
        <p className="text-sm text-gray-500">
          Detta är en demo-order och ingen betalning har skett.
        </p>
      </div>
    );
  }

  // Visa meddelande om inga betalningsmetoder finns
  if (paymentMethods.length === 0) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Inga betalningsmetoder är aktiverade. Vänligen kontakta administratören.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {initialCustomerData?.customer && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Välkommen tillbaka! Dina adressuppgifter har fyllts i automatiskt.</p>
        </div>
      )}

      {formErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <ul className="list-disc pl-5">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Betalningsmetoder */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Betalningsmetod</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-start space-x-3">
                <input
                  type="radio"
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={handlePaymentMethodChange}
                  className="mt-1"
                />
                <div>
                  <label
                    htmlFor={method.id}
                    className="block font-medium text-gray-800 cursor-pointer"
                  >
                    {method.title}
                  </label>
                  {method.description && (
                    <p
                      className="text-sm text-gray-600"
                      dangerouslySetInnerHTML={{ __html: method.description }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Förnamn</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Efternamn</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">E-post</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefon</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adress</label>
          <input
            type="text"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adress (rad 2)</label>
          <input
            type="text"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Postnummer</label>
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Land</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={CountriesEnum.Se}>Sverige</option>
            <option value={CountriesEnum.No}>Norge</option>
            <option value={CountriesEnum.Fi}>Finland</option>
            <option value={CountriesEnum.Dk}>Danmark</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Bearbetar..." : "Slutför beställning"}
          </button>
        </div>
      </form>
    </div>
  );
}
