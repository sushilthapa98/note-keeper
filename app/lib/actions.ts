"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import z from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().min(1, "Content is required"),
  userId: z.string(),
});

const CreateNoteSchema = FormSchema.omit({ id: true, userId: true });
const UpdateNoteSchema = FormSchema.omit({ id: true, userId: true });

export async function createNote(formData: FormData) {
  const { title, content } = CreateNoteSchema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  const userId = "410544b2-4001-4271-9855-fec4b6a6442a";

  await sql`INSERT INTO notes (title, content, user_id) VALUES (${title}, ${content}, ${userId})`;

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(id: string, formData: FormData) {
  const { title, content } = UpdateNoteSchema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  await sql`UPDATE notes SET title = ${title}, content = ${content} WHERE id = ${id}`;

  revalidatePath("/notes");
  redirect("/notes");
}

export async function deleteNote(id: string) {
  await sql`DELETE FROM notes WHERE id = ${id}`;
  revalidatePath("/notes");
}
