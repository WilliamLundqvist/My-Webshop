"use client";

import { loginAction } from "./action";
import { useFormState } from "react-dom";

export default function Page() {
  const [state, formAction, isPending] = useFormState(loginAction, {});

  return (
    <>
      <h2>Login</h2>

      <form action={formAction}>
        <fieldset>
          <label htmlFor="usernameEmail">Username or Email</label>
          <input type="name" name="usernameEmail" />
        </fieldset>

        <fieldset>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
        </fieldset>

        <button disabled={isPending}>
          {isPending ? "Loading..." : "Login"}
        </button>

        {state.error && (
          <p dangerouslySetInnerHTML={{ __html: state.error }}></p>
        )}
      </form>
    </>
  );
}
