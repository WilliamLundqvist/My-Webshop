"use server";

import { REGISTER_CUSTOMER } from "@/lib/graphql/mutations";
import { getClient } from "@faustwp/experimental-app-router";
import { registerSchema } from "@/lib/validation/registerSchema";

export async function signUpAction(prevData: any, formData: FormData) {
  try {
    // Extract form data
    const rawFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      phone: (formData.get("phone") as string) || "",
      address1: formData.get("address1") as string,
      address2: (formData.get("address2") as string) || "",
      city: formData.get("city") as string,
      postcode: formData.get("postcode") as string,
      country: formData.get("country") as string,
      shippingSameAsBilling: formData.get("shippingSameAsBilling") === "true",
    };

    // Validate form data
    const validationResult = registerSchema.safeParse(rawFormData);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return {
        error: "Validation error. Please check your input.",
        errors,
      };
    }

    // Get GraphQL client
    const client = await getClient();

    // Execute mutation
    const { data, errors } = await client.mutate({
      mutation: REGISTER_CUSTOMER,
      variables: {
        email: rawFormData.email,
        firstName: rawFormData.firstName,
        lastName: rawFormData.lastName,
        password: rawFormData.password,
        address1: rawFormData.address1,
        address2: rawFormData.address2,
        city: rawFormData.city,
        country: rawFormData.country,
        phone: rawFormData.phone,
        postcode: rawFormData.postcode,
        shippingSameAsBilling: rawFormData.shippingSameAsBilling,
      },
    });

    // Kontrollera om det finns data från mutationen
    if (errors) {
      console.error("Registration error:", errors);
      return {
        error: errors?.[0]?.message || "Failed to register. Please try again.",
      };
    }

    // Registration successful
    return {
      success: "Account created successfully! You can now log in.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
