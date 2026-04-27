import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userLogIn, getPayloadFromToken, getUserProfile } from "@/libs/authService";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const user = await userLogIn(credentials.email, credentials.password);
        if (user) return user;
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const payload = getPayloadFromToken((user as any).token);
        let name = token.name;
        
        try {
          // Fetch profile once during login to get the name (since it's not in the token)
          const profile = await getUserProfile((user as any).token);
          name = profile.data.name;
        } catch (e) {
          console.error("Failed to fetch profile during login", e);
        }

        return { 
          ...token, 
          ...user,
          _id: payload.id || payload._id,
          role: payload.role === 'admin' ? 'admin' : 'user',
          name: name || (user as any).name || token.name || 'User'
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};