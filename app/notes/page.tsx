import Link from 'next/link';
import { fetchNotes } from '../lib/data';
import { DeleteNote } from '../ui/notes/buttons';

export default async function Page() {
  const notes = await fetchNotes();

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
          {notes?.map(note => (
            <tr key={note.id}>
              <td className="p-4">{note.title}</td>
              <td className="p-4">{note.content}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Link href={`/notes/${note.id}/edit`}>Edit</Link>
                  <DeleteNote id={note.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
