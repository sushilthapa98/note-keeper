import { updateNote } from "@/app/lib/actions";
import { fetchNote } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await fetchNote(id);

  if (!note) {
    return notFound();
  }

  const updateNoteWithId = updateNote.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>

      <form action={updateNoteWithId}>
        <input
          name="title"
          type="text"
          placeholder="Title"
          defaultValue={note.title}
          className="border border-gray-200 rounded p-2"
        />
        <textarea
          name="content"
          placeholder="Content"
          defaultValue={note.content}
          className="border border-gray-200 rounded p-2"
        ></textarea>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
