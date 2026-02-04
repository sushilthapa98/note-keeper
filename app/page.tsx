'use client';

import Link from 'next/link';
import { logout } from './lib/actions';
import { signOut } from 'next-auth/react';

export default function Home() {
  return (
    <div className="flex gap-4">
      <Link href="/login">Login</Link>
      <button type="button" onClick={() => signOut()}>
        Logout2
      </button>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
      <Link href="/notes">Notes</Link>
      <Link href="/notes/create">Create Note</Link>
    </div>
  );
}
