"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import z from "zod";
import { User } from "./definition";
import { fetchUserByEmail } from "./data";
import { createSession, deleteSession } from "./session";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().min(1, "Content is required"),
  userId: z.string(),
});

const CreateNoteSchema = FormSchema.omit({ id: true, userId: true });
const UpdateNoteSchema = FormSchema.omit({ id: true, userId: true });

export type State = {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string | null;
};

export async function createNote(prevState: State, formData: FormData) {
  const validatedFields = CreateNoteSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create note",
    };
  }

  const { title, content } = validatedFields.data;

  const userId = "410544b2-4001-4271-9855-fec4b6a6442a";

  try {
    await sql`INSERT INTO notes (title, content, user_id) VALUES (${title}, ${content}, ${userId})`;
  } catch (error) {
    console.error("Database error:", error);
    return { message: "Failed to create note" };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateNoteSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to update note",
    };
  }

  const { title, content } = validatedFields.data;

  try {
    await sql`UPDATE notes SET title = ${title}, content = ${content} WHERE id = ${id}`;
  } catch (error) {
    console.error("Database error:", error);
    return { message: "Failed to update note" };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function deleteNote(id: string) {
  try {
    await sql`DELETE FROM notes WHERE id = ${id}`;
  } catch (error) {
    console.error("Database error:", error);
    return { message: "Failed to delete note" };
  }

  revalidatePath("/notes");
}

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function login(prevState: LoginState, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to login",
    };
  }

  const { email, password } = validatedFields.data;

  const user = await fetchUserByEmail(email);
  if (!user) {
    return { message: "User not found" };
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return { message: "Incorrect password" };
  }

  await createSession(user.id);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
