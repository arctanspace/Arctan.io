import { google } from "googleapis";

export type GmailAuth = {
  access_token: string;
  expires_at?: number;
  refresh_token?: string;
};

export function gmailClient(token: GmailAuth) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  });
  return google.gmail({ version: "v1", auth: oauth2Client });
}

export type ThreadSummary = {
  id: string;
  subject: string;
  lastSnippet: string;
  lastFrom: string;
  lastDate: string;
  ourTurn: boolean;
  priority: number;
};

function parseHeader(headers: any[], name: string): string | null {
  const h = headers?.find((x:any) => x.name?.toLowerCase() === name.toLowerCase());
  return h?.value || null;
}

function extractEmailAddress(s: string | null): string | null {
  if (!s) return null;
  const m = s.match(/<([^>]+)>/);
  return (m && m[1]) || s;
}

function domainOf(addr: string | null): string | null {
  if (!addr) return null;
  const at = addr.indexOf("@");
  if (at === -1) return null;
  return addr.slice(at + 1).toLowerCase();
}

function scorePriority(ourTurn: boolean, lastInboundHasQuestion: boolean, lastDateMs: number, lastFromDomain: string | null): number {
  const ageHours = Math.max(0, (Date.now() - lastDateMs) / 3600000);
  const vipDomains = (process.env.VIP_DOMAINS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const isVip = lastFromDomain ? vipDomains.includes(lastFromDomain) : false;

  let score = 0;
  if (ourTurn) score += 600;
  score += Math.min(400, Math.floor(ageHours * 10));
  if (lastInboundHasQuestion) score += 150;
  if (isVip) score += 200;

  return Math.min(1000, score);
}

export async function listThreadSummaries(token: GmailAuth, myEmail: string): Promise<ThreadSummary[]> {
  const gmail = gmailClient(token);
  const limit = Number(process.env.THREAD_LIMIT || 50);
  const query = 'in:anywhere -category:{promotions social updates forums} newer_than:90d';
  const list = await gmail.users.threads.list({
    userId: "me",
    q: query,
    maxResults: limit,
  });
  const threads = list.data.threads || [];

  const summaries: ThreadSummary[] = [];
  for (const t of threads) {
    if (!t.id) continue;
    const th = await gmail.users.threads.get({
      userId: "me",
      id: t.id,
      format: "full",
    });
    const msgs = th.data.messages || [];
    if (!msgs.length) continue;
    const last = msgs[msgs.length - 1];
    const headers = last.payload?.headers || [];
    const subject = parseHeader(headers, "Subject") || "";
    const fromRaw = parseHeader(headers, "From");
    const from = extractEmailAddress(fromRaw);
    const date = parseHeader(headers, "Date");
    const dateMs = date ? Date.parse(date) : Date.now();
    const snippet = last.snippet || "";
    const lastText = snippet?.toLowerCase() || "";
    const inboundHasQuestion = /\?|what|when|how|why|next steps|follow up/.test(lastText);
    const ourTurn = from ? from.toLowerCase() !== myEmail.toLowerCase() : false;

    const prio = scorePriority(ourTurn, inboundHasQuestion, dateMs, domainOf(from));

    summaries.push({
      id: t.id,
      subject,
      lastSnippet: snippet,
      lastFrom: fromRaw || "(unknown)",
      lastDate: new Date(dateMs).toISOString(),
      ourTurn,
      priority: prio,
    });
  }

  summaries.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime();
  });

  return summaries;
}

