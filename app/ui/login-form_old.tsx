'use client';

import { useActionState } from 'react';
import { login, LoginState } from '../lib/actions';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginForm() {
  const initialState: LoginState = { message: null, errors: {} };
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction}>
      <div className="mb-4">
        <input type="email" name="email" className="w-full border border-gray-200 rounded p-2" />
      </div>
      <div className="mb-4">
        <input type="password" name="password" className="w-full border border-gray-200 rounded p-2" />
      </div>
      {state.message && <p className="text-red-500">{state.message}</p>}
      <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Login
      </button>
      <button
        className="w-full p-2 border border-gray-200 rounded flex items-center justify-center shadow-sm"
        onClick={() => signIn('google', { redirectTo: '/' })}
      >
        <Image src="/google.svg" alt="Google" width={20} height={20} className="inline-block mr-2" />
        Login with Google
      </button>
    </form>
  );
}
