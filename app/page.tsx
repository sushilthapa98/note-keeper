import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-4">
      <Link href="/notes">Notes</Link>
      <Link href="/notes/create">Create Note</Link>
    </div>
  );
}
