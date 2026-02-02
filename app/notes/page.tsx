import Link from "next/link";
import { fetchNotes } from "../lib/data";

export default async function Page() {
  const userId = "410544b2-4001-4271-9855-fec4b6a6442a";
  const notes = await fetchNotes(userId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <Link href="/notes/create">Create Note</Link>
      <table className="table-auto border-collapse border">
        <thead>
          <tr>
            <th className="border-b p-4">Title</th>
            <th className="border-b p-4">Content</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td className="p-4">{note.title}</td>
              <td className="p-4">{note.content}</td>
              <td className="p-4">
                <Link href={`/notes/${note.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
