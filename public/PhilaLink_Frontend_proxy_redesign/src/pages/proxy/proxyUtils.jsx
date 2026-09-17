export function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}

export function formatDate(value) {
  const date =
    parseDate(value);

  if (!date) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export function getCollectionTone(status) {
  switch (
    String(status || "")
      .trim()
      .toLowerCase()
  ) {
    case "overdue":
      return "bg-red-50 text-red-700 ring-red-200";

    case "collected":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "pending":
    case "scheduled":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "cancelled":
      return "bg-slate-100 text-slate-600 ring-slate-200";

    default:
      return "bg-slate-50 text-slate-500 ring-slate-200";
  }
}

export function CollectionStatus({
  status,
}) {
  const label =
    status || "None";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getCollectionTone(
        label
      )}`}
    >
      {label}
    </span>
  );
}
