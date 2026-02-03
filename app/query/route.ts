import postgres from "postgres";
import { verifySession } from "../lib/dal";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function listNotes() {
  const session = await verifySession();
  if (!session) {
    return null;
  }

  const data = await sql`
    SELECT * FROM notes WHERE user_id = ${session.userId};
  `;

  return data;
}

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return Response.json(await listNotes());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
