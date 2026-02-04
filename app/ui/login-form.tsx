'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
      // redirect: false,
    });
  };

  return (
    <form action={handleSubmit}>
      <div className="mb-4">
        <input type="email" name="email" className="w-full border border-gray-200 rounded p-2" />
      </div>
      <div className="mb-4">
        <input type="password" name="password" className="w-full border border-gray-200 rounded p-2" />
      </div>
      {error && <p className="text-red-500">{error}</p>}
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
