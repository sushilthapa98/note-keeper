import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createUser, verifyCredentials } from "./app/lib/actions";
import { fetchUserByEmail } from "./app/lib/data";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
    };
    // & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Use your custom logic to verify credentials (eg. external api call, db query)
        const user = await verifyCredentials(
          email as string,
          password as string,
        );

        if (user) {
          return user; // Return user object
        }
        return null; // Return null if auth fails
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await fetchUserByEmail(user.email! as string);

          if (!existingUser) {
            const result = await createUser(
              user.email! as string,
              user.name! as string,
            );
            if (!result) {
              return false;
            }
            console.log("New user created:", user.email);
          } else {
            console.log("Existing user logged in:", user.email);
          }

          return true; // Allow sign in
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Deny sign in
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
