import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    phone?: string;
  }

  interface JWT {
    id: string;
    phone?: string;
  }
}
