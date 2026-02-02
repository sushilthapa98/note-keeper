import { fetchNote } from "@/app/lib/data";
import { notFound } from "next/navigation";
import EditNoteForm from "./edit-form";

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

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Update Note</h1>
      <EditNoteForm note={note} />
    </div>
  );
}
