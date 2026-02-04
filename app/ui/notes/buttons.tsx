import { deleteNote } from '@/app/lib/actions';

export function DeleteNote({ id }: { id: string }) {
  const deleteNoteWithId = deleteNote.bind(null, id);

  return (
    <form action={deleteNoteWithId}>
      <button className="text-red-500">Delete</button>
    </form>
  );
}
