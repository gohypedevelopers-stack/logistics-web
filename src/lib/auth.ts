import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(`[AUTH] Starting authorization for: ${credentials?.email}`);
        
        if (!credentials?.email || !credentials?.password) {
          console.error("[AUTH] Missing email or password in credentials");
          throw new Error("Invalid credentials");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
             console.error(`[AUTH] User not found for email: ${credentials.email}`);
             throw new Error("User not found");
          }
          
          if (!user.passwordHash) {
             console.error(`[AUTH] User has no password hash set: ${user.id}`);
             throw new Error("Invalid account data. Please contact support.");
          }

          console.log(`[AUTH] Comparing password for user: ${user.email}`);
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.error(`[AUTH] Invalid password attempt for: ${user.email}`);
            throw new Error("Invalid password");
          }

          console.log(`[AUTH] Successful sign-in for: ${user.email} (Role: ${user.role})`);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (dbError: any) {
          console.error("[AUTH] CRITICAL ERROR during authorize flow:", dbError);
          // Only throw generic message to front-end for security
          throw new Error("Authentication failed due to a server error. Please check database connection.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};
