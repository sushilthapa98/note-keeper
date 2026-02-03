import postgres from "postgres";
import { Note, User } from "./definition";
import { verifySession } from "./dal";
import { auth } from "@/auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchNotes() {
  // const session = await verifySession();
  // if (!session) {
  //   return null;
  // }
  const session = await auth();
  if (!session) {
    return null;
  }

  try {
    const data = await sql<Note[]>`
    SELECT id, title, content, user_id 
    FROM notes 
    WHERE user_id = ${session.user?.id}
    ORDER BY id ASC
    `;
    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch notes");
  }
}

export async function fetchNote(id: string) {
  // const session = await verifySession();
  // if (!session) {
  //   return null;
  // }
  const session = await auth();
  if (!session) {
    return null;
  }

  try {
    const data = await sql<Note[]>`
    SELECT id, title, content, user_id 
    FROM notes 
    WHERE id = ${id} AND user_id = ${session.user?.id}
    `;
    return data[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch note");
  }
}

export async function fetchUserByEmail(email: string) {
  try {
    const data = await sql<User[]>`
    SELECT id, name, email, password 
    FROM users 
    WHERE email = ${email}
    `;
    return data[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user");
  }
}
