"use client";

import { useActionState } from "react";
import { login, LoginState } from "../lib/actions";

export default function LoginForm() {
  const initialState: LoginState = { message: null, errors: {} };
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction}>
      <div className="mb-4">
        <input
          type="email"
          name="email"
          className="w-full border border-gray-200 rounded p-2"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          name="password"
          className="w-full border border-gray-200 rounded p-2"
        />
      </div>
      {state.message && <p className="text-red-500">{state.message}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </form>
  );
}
