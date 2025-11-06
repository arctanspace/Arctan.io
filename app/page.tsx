"use client";

import { useEffect, useState } from "react";
import LeadQueue from "@/components/LeadQueue";

type ThreadSummary = {
  id: string;
  subject: string;
  lastSnippet: string;
  lastFrom: string;
  lastDate: string;
  ourTurn: boolean;
  priority: number;
};

export default function Page() {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const go = async () => {
      try {
        const res = await fetch("/api/threads");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setThreads(data.threads);
      } catch (e:any) {
        setError(e.message || "Failed to load threads");
      } finally {
        setLoading(false);
      }
    };
    go();
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-red-600">{error}</div>
        <div className="text-sm">
          If this is <b>Error 401</b>, please <a className="underline" href="/api/auth/signin">sign in</a>.
        </div>
      </div>
    );
  }

  const ours = threads.filter(t => t.ourTurn);
  const theirs = threads.filter(t => !t.ourTurn);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">Your turn</h2>
        <LeadQueue threads={ours} emptyLabel="No leads waiting on you 🎉" />
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Their turn</h2>
        <LeadQueue threads={theirs} emptyLabel="All caught up here" />
      </section>
    </div>
  );
}

