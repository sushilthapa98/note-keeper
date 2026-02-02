import Link from "next/link";
import { logout } from "./lib/actions";

export default function Home() {
  return (
    <div className="flex gap-4">
      <Link href="/login">Login</Link>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
      <Link href="/notes">Notes</Link>
      <Link href="/notes/create">Create Note</Link>
    </div>
  );
}
