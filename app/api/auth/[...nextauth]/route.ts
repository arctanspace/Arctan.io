import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const googleId = process.env.GOOGLE_CLIENT_ID || "";
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || "";

export const authOptions: NextAuthOptions = {
  providers: (googleId && googleSecret) ? [
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ] : [],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = Date.now() + (account.expires_in ? account.expires_in * 1000 : 0);
      }
      if (profile?.email) token.user_email = profile.email as string;
      return token;
    },
    async session({ session, token }) {
      // Do NOT expose access_token to client in production
      (session as any).user_email = token.user_email as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "local-dev-secret",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

