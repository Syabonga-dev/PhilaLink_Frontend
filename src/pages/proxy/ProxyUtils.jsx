export function parseDate(value) {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

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
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export function getCollectionState(
  status,
  dateValue
) {
  const date =
    parseDate(
      dateValue
    );

  const normalized =
    String(
      status || ""
    )
      .trim()
      .toLowerCase();

  if (
    normalized ===
    "collected"
  ) {
    return {
      label:
        "Collected",
      className:
        "bg-[#dcfce7] text-[#166534]",
    };
  }

  if (
    normalized ===
    "cancelled"
  ) {
    return {
      label:
        "Cancelled",
      className:
        "bg-[#f1f5f9] text-[#475569]",
    };
  }

  if (
    normalized ===
    "overdue"
  ) {
    return {
      label:
        "Overdue",
      className:
        "bg-[#fee2e2] text-[#b91c1c]",
    };
  }

  if (
    normalized ===
      "none" ||
    !date
  ) {
    return {
      label:
        "No collection",
      className:
        "bg-[#f1f5f9] text-[#64748b]",
    };
  }

  const now =
    new Date();

  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const scheduled =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  const differenceDays =
    Math.round(
      (
        scheduled.getTime() -
        today.getTime()
      ) /
        (
          1000 *
          60 *
          60 *
          24
        )
    );

  if (
    differenceDays <
    0
  ) {
    return {
      label:
        "Overdue",
      className:
        "bg-[#fee2e2] text-[#b91c1c]",
    };
  }

  if (
    differenceDays ===
    0
  ) {
    return {
      label:
        "Due today",
      className:
        "bg-[#dcfce7] text-[#166534]",
    };
  }

  if (
    differenceDays ===
    1
  ) {
    return {
      label:
        "Tomorrow",
      className:
        "bg-[#fef3c7] text-[#92400e]",
    };
  }

  return {
    label:
      `${differenceDays} days`,
    className:
      "bg-[#ccfbf1] text-[#115e59]",
  };
}

export function CollectionStatus({
  status,
  date,
}) {
  const state =
    getCollectionState(
      status,
      date
    );

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${state.className}`}
    >
      {state.label}
    </span>
  );
}
