"use client";

import { useActionState } from "react";
import { State, updateNote } from "@/app/lib/actions";
import clsx from "clsx";

export default function EditNoteForm({
  note,
}: {
  note: {
    id: string;
    title: string;
    content: string;
  };
}) {
  const initialState: State = { message: null, errors: {} };
  const updateNoteWithId = updateNote.bind(null, note.id);
  const [state, formAction] = useActionState(updateNoteWithId, initialState);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-4">
        <input
          name="title"
          type="text"
          placeholder="Title"
          defaultValue={note.title}
          className={clsx(
            "border border-gray-200 rounded p-2",
            state.errors?.title && "border-red-500",
          )}
        />
        <textarea
          name="content"
          placeholder="Content"
          defaultValue={note.content}
          className={clsx(
            "border border-gray-200 rounded p-2",
            state.errors?.content && "border-red-500",
          )}
        ></textarea>

        {state.message && (
          <p className="text-red-500 text-sm">{state.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Note
        </button>
      </div>
    </form>
  );
}
