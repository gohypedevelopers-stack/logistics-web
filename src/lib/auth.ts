import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { Role } from "@prisma/client";
import { normalizeEmail } from "./email-verification";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  logger: {
    error(code, metadata) {
      const metadataMessage = JSON.stringify(metadata ?? "").toLowerCase();

      const isJwtDecryptError =
        code === "JWT_SESSION_ERROR" &&
        metadataMessage.includes("decryption operation failed");

      if (isJwtDecryptError) {
        return;
      }

      console.error(`[NEXTAUTH][${code}]`, metadata ?? "");
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("INVALID_CREDENTIALS");
        }

        const email = normalizeEmail(credentials.email);

        let user;
        try {
          user = await prisma.user.findUnique({
            where: { email },
          });
        } catch (dbError: any) {
          if (dbError.message?.includes("timed out") || dbError.code === "ETIMEDOUT") {
            throw new Error("AUTH_TIMEOUT");
          }

          throw new Error("AUTH_SYSTEM_ERROR");
        }

        if (!user || !user.passwordHash) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("INVALID_CREDENTIALS");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.name = (token.name as string | undefined) ?? session.user.name;
        session.user.email = (token.email as string | undefined) ?? session.user.email;
      }
      return session;
    },
  },
};
