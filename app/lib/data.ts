import postgres from "postgres";
import { Note } from "./definition";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchNotes(userId: string) {
  try {
    const data = await sql<Note[]>`
    SELECT id, title, content 
    FROM notes 
    WHERE user_id = ${userId}
    ORDER BY id ASC
    `;
    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch notes");
  }
}

export async function fetchNote(id: string) {
  try {
    const data = await sql<Note[]>`
    SELECT id, title, content 
    FROM notes 
    WHERE id = ${id}
    `;
    return data[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch note");
  }
}
