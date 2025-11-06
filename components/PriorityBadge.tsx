export default function PriorityBadge({ score }: { score: number }) {
  let label = "Low";
  if (score >= 800) label = "Critical";
  else if (score >= 500) label = "High";
  else if (score >= 250) label = "Medium";

  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium shadow-sm">
      <span className="mr-1 h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

