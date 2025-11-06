"use client";

import LeadCard from "./LeadCard";
import { useState } from "react";

type ThreadSummary = {
  id: string;
  subject: string;
  lastSnippet: string;
  lastFrom: string;
  lastDate: string;
  ourTurn: boolean;
  priority: number;
};

export default function LeadQueue({ threads, emptyLabel } : { threads: ThreadSummary[]; emptyLabel: string; }) {
  const [items, setItems] = useState(threads);

  function markReplied(id: string) {
    setItems(prev => prev.filter(t => t.id !== id));
  }

  if (!items.length) return <div className="text-sm text-gray-500">{emptyLabel}</div>;

  return (
    <div className="flex flex-col gap-3">
      {items.map(t => (
        <LeadCard key={t.id} thread={t} onReplied={markReplied} />
      ))}
    </div>
  );
}

