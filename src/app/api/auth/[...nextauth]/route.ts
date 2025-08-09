import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { UserService } from "@/db/services/userService";
import { z } from "zod";

// Simple validation schema for login
const loginSchema = z.object({
  uEmail: z.string().email(),
  uPasswordHash: z.string().min(1),
});

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        uEmail: { label: "Email", type: "email", placeholder: "admin@gmail.com" },
        uPasswordHash: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            console.log("No credentials provided");
            return null;
          }
          
          // Validate input
          const validationResult = loginSchema.safeParse(credentials);
          if (!validationResult.success) {
            console.log("Invalid credentials format:", validationResult.error);
            return null;
          }

          const { uEmail, uPasswordHash } = validationResult.data;
          
          // Get user from database
          // const user = await UserService.getByEmail(uEmail);
          const user = {
            uCode: "123",
            uName: "John Doe",
            uEmail: "amdmin@gmail.com",
            uFirstName: "John",
            uLastName: "Doe",
            rCode: "admin",
            uIsActive: true,
            uPasswordHash: "$2a$12$examplehashedpassword",
          };
          if (!user) {
            console.log("User not found:", uEmail);
            return null;
          }

          // Check if user is active
          if (!user.uIsActive) {
            console.log("User is not active:", uEmail);
            return null;
          }

          // // Verify password
          // const isValidPassword = await UserService.verifyPassword(uPasswordHash, user.uPasswordHash || '');
          // if (!isValidPassword) {
          //   console.log("Invalid password for user:", uEmail);
          //   return null;
          // }

          // // Update last login
          // await UserService.updateLastLogin(user.uCode);

          // // Get user with role information
          // const userWithRole = await UserService.getWithRole(user.uCode);

          return {
            id: user.uCode,
            uCode: user.uCode,
            uName: user.uName || '',
            uEmail: user.uEmail || '',
            uFirstName: user.uFirstName || undefined,
            uLastName: user.uLastName || undefined,
            rCode: user.rCode || undefined,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.uCode;
        token.uCode = user.uCode;
        token.uName = user.uName;
        token.uEmail = user.uEmail;
        token.uFirstName = user.uFirstName;
        token.uLastName = user.uLastName;
        token.rCode = user.rCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.uCode;
        session.user.uCode = token.uCode;
        session.user.uName = token.uName;
        session.user.email = token.uEmail;
        session.user.name = token.uName; // Standard NextAuth field
        session.user.uFirstName = token.uFirstName;
        session.user.uLastName = token.uLastName;
        session.user.rCode = token.rCode;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };