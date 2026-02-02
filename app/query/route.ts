import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function listNotes() {
  const data = await sql`
    SELECT * FROM notes;
  `;

  return data;
}

export async function GET() {
  try {
    return Response.json(await listNotes());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
