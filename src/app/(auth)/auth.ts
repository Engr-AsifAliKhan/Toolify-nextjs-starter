import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Email({ server: process.env.EMAIL_SERVER, from: process.env.EMAIL_FROM }),
  ],
  session: { strategy: "jwt" },
});