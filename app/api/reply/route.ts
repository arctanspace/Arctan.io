import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { gmailClient } from "@/lib/gmail";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return new NextResponse("Not authenticated", { status: 401 });

  const anySess = session as any;
  const tokenAny = anySess.token as any;
  const access = tokenAny?.access_token || (anySess as any).access_token;
  const userEmail = (anySess as any).user_email as string || "";

  if (!access) return new NextResponse("Access token unavailable on server session.", { status: 500 });

  const { threadId, body } = await req.json();
  if (!threadId || !body) return new NextResponse("Missing threadId/body", { status: 400 });

  const gmail = gmailClient({ access_token: access });
  const th = await gmail.users.threads.get({ userId: "me", id: threadId, format: "metadata", metadataHeaders: ["Subject","From","Message-ID"] });
  const msgs = th.data.messages || [];
  if (!msgs.length) return new NextResponse("Thread not found", { status: 404 });
  const last = msgs[msgs.length - 1];
  const headers = last.payload?.headers || [];
  const subject = headers.find(h => h.name?.toLowerCase() === "subject")?.value || "";
  const from = headers.find(h => h.name?.toLowerCase() === "from")?.value || "";
  const msgIdHeader = headers.find(h => h.name?.toLowerCase() === "message-id")?.value || "";
  const toMatch = from.match(/<([^>]+)>/);
  const to = (toMatch && toMatch[1]) || from;

  const lines = [
    `To: ${to}`,
    `Subject: Re: ${subject}`,
    msgIdHeader ? `In-Reply-To: ${msgIdHeader}` : "",
    msgIdHeader ? `References: ${msgIdHeader}` : "",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ].filter(Boolean);
  const raw = Buffer.from(lines.join("\r\n")).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { threadId, raw },
  });

  return NextResponse.json({ ok: true });
}

