"use client";

import PriorityBadge from "./PriorityBadge";
import { useState } from "react";

type Props = {
  thread: {
    id: string;
    subject: string;
    lastSnippet: string;
    lastFrom: string;
    lastDate: string;
    ourTurn: boolean;
    priority: number;
  };
  onReplied?: (id: string) => void;
};

export default function LeadCard({ thread, onReplied }: Props) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");

  async function sendReply() {
    const res = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: thread.id, body: reply }),
    });
    if (!res.ok) {
      const err = await res.text();
      alert("Failed to send: " + err);
      return;
    }
    setReply("");
    setOpen(false);
    onReplied?.(thread.id);
  }

  return (
    <div className="rounded-xl bg-white shadow-card border p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold leading-tight">{thread.subject || "(no subject)"}</h3>
          <div className="text-sm text-gray-600">Last from: {thread.lastFrom}</div>
          <div className="text-xs text-gray-500">{new Date(thread.lastDate).toLocaleString()}</div>
        </div>
        <PriorityBadge score={thread.priority} />
      </div>
      <p className="text-sm text-gray-700 line-clamp-3">{thread.lastSnippet}</p>

      <div className="flex items-center gap-2 pt-1">
        <button
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Reply"}
        </button>
        <button
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={() => alert("Snoozed for 24h (placeholder)")}
        >
          Snooze
        </button>
        <button
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={() => alert("Archived (placeholder)")}
        >
          Archive
        </button>
      </div>

      {open && (
        <div className="mt-2">
          <textarea
            className="w-full rounded-lg border p-2 text-sm"
            rows={4}
            placeholder="Write a quick, crisp reply…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              className="rounded-lg bg-black text-white px-4 py-2 text-sm"
              onClick={sendReply}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

