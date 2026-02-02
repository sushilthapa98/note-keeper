import { createNote } from "@/app/lib/actions";

export default async function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>

      <form action={createNote}>
        <input
          name="title"
          type="text"
          placeholder="Title"
          className="border border-gray-200 rounded p-2"
        />
        <textarea
          name="content"
          placeholder="Content"
          className="border border-gray-200 rounded p-2"
        ></textarea>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
