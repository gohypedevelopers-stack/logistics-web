import { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    role: Role
    name?: string | null
    email?: string | null
  }

  interface Session {
    user: User & {
      id: string
      role: Role
      name?: string | null
      email?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    name?: string | null
    email?: string | null
  }
}
