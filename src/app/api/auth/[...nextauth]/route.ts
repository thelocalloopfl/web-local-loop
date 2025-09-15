// api/auth/[...nextauth]
export const dynamic = "force-dynamic"; // 👈 disables caching
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sanityClient } from "../../../../lib/sanity";
import bcrypt from "bcrypt";

// Keep authOptions internal — do NOT export it
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Fetch user from Sanity
        const user = await sanityClient.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        );

        if (!user) return null;

        // Compare hashed password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || null,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/", // custom sign-in page
  },

  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string | undefined;
      }
      console.log("API Session callback:", { session, token });
      return session;
    },

  },
};

// NextAuth handler
const handler = NextAuth(authOptions);

// Export only route handlers for App Router
export { handler as GET, handler as POST };
