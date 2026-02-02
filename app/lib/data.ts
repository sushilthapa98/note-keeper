import postgres from "postgres";
import { Note } from "./definition";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchNotes(userId: string) {
  try {
    const data = await sql<
      Note[]
    >`SELECT * FROM notes WHERE user_id = ${userId}`;
    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch notes");
  }
}
