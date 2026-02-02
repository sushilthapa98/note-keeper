import CreateNoteForm from "./create-form";

export default async function Page() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>
      <CreateNoteForm />
    </div>
  );
}
