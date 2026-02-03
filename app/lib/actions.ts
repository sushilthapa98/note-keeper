"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import z from "zod";
import { fetchUserByEmail } from "./data";
import { createSession, deleteSession } from "./session";
import { auth } from "@/auth";

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
  const session = await auth();
  if (!session) {
    return { message: "Unauthorized" };
  }

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

  try {
    await sql`INSERT INTO notes (title, content, user_id) VALUES (${title}, ${content}, ${session.user?.id})`;
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
  const session = await auth();
  if (!session) {
    return { message: "Unauthorized" };
  }

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
    await sql`UPDATE notes SET title = ${title}, content = ${content} WHERE id = ${id} AND user_id = ${session.user?.id}`;
  } catch (error) {
    console.error("Database error:", error);
    return { message: "Failed to update note" };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function deleteNote(id: string) {
  const session = await auth();
  if (!session) {
    return { message: "Unauthorized" };
  }
  await sql`DELETE FROM notes WHERE id = ${id} AND user_id = ${session.user?.id}`;
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

  redirect("/notes");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

// method to use with nextjs auth
export async function verifyCredentials(email: string, password: string) {
  const user = await fetchUserByEmail(email);
  if (!user) {
    return null;
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return null;
  }

  return user;
}

export async function createUser(
  email: string,
  name: string,
  password?: string,
) {
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
    await sql`INSERT INTO users (email, name, password) VALUES (${email}, ${name}, ${hashedPassword})`;
    return true;
  } catch (error) {
    console.error("Database error:", error);
    return false;
  }
}
