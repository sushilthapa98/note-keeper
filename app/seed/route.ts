import * as bcrypt from "bcrypt";
import postgres from "postgres";

const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Sushil Thapa",
    email: "thapasushil6@gmail.com",
    password: "sushil@123",
  },
];

const notes = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a64424",
    title: "Note 1",
    content: "Content of note 1",
    user_id: "410544b2-4001-4271-9855-fec4b6a6442a",
  },
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442b",
    title: "Note 2",
    content: "Content of note 2",
    user_id: "410544b2-4001-4271-9855-fec4b6a6442a",
  },
];

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedUsers(sql: any) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedNotes(sql: any) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      user_id UUID NOT NULL
    );
  `;

  const insertedNotes = await Promise.all(
    notes.map(
      (note) => sql`
        INSERT INTO notes (id, title, content, user_id)
        VALUES (${note.id}, ${note.title}, ${note.content}, ${note.user_id})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedNotes;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedUsers(sql);
      await seedNotes(sql);
    });
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
