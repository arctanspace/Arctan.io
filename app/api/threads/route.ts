import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { listThreadSummaries } from "@/lib/gmail";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session) return new NextResponse("Not authenticated", { status: 401 });

  // Access token is only on the JWT, not the session object
  // getServerSession doesn't return token, so we re-run the JWT callback via unstable_getServerSession pattern
  // Simpler: call NextAuth internal API is not available here; instead, we use a workaround:
  // We'll throw if provider isn't configured (missing env vars).
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return new NextResponse("OAuth not configured", { status: 500 });
  }

  // NextAuth stores JWT in cookies; in API route, we cannot read it directly.
  // But NextAuth attaches token to session in callbacks.session if we put minimal fields there.
  // For production hardening we avoided exposing access_token to client;
  // so we will fetch token using next-auth's getServerSession -> token isn't surfaced.
  // For simplicity in this MVP, we will temporarily expose access_token JUST to server:
  // We add a separate endpoint /api/token in future, but here we rely on a custom header set by middleware.
  // To keep it working now, we'll fallback to returning 500 with instructions if access token isn't present.

  const anySess = session as any;
  const tokenAny = anySess.token as any;
  const access = tokenAny?.access_token || (anySess as any).access_token; // may be undefined

  if (!access) {
    return new NextResponse("Access token unavailable on server session. Set NEXTAUTH_URL and use NextAuth default session strategy, or expose token server-side only.", { status: 500 });
  }

  const userEmail = (anySess as any).user_email as string || "";
  const threads = await listThreadSummaries({ access_token: access }, userEmail);

  return NextResponse.json({ threads });
}

