import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && account.id_token) {
        if (!profile || !("sub" in profile) || !profile.email || !profile.name) {
          console.error("Profile data is incomplete:", profile);
          return false;
        }

        try {
          const response = await fetch(`${apiUrl}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenId: account.id_token,
              googleId: profile.sub,
              email: profile.email,
              name: profile.name,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from backend:", errorData);
            return false;
          }

          const data = await response.json();
          account.backendToken = data.token;
          account.userId = data.id;
          return true;
        } catch (error) {
          console.error("Error contacting backend:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.backendToken = account.backendToken as string;
        token.id = account.userId as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.backendToken) {
        session.backendToken = token.backendToken as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };