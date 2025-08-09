import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      uCode: string
      uName: string
      uFirstName?: string
      uLastName?: string
      rCode?: string
      role?: {
        rCode: string
        rName: string
        rDescription?: string
      }
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    uCode: string
    uName: string
    uEmail: string
    uFirstName?: string
    uLastName?: string
    rCode?: string
    role?: {
      rCode: string
      rName: string
      rDescription?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    uCode: string
    uName: string
    uEmail: string
    uFirstName?: string
    uLastName?: string
    rCode?: string
    role?: {
      rCode: string
      rName: string
      rDescription?: string
    }
  }
}
