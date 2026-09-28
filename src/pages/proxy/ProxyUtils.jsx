/* ========================================================= */
/* DATE HELPERS                                              */
/* ========================================================= */

export function parseDate(
  value
) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date
      ? new Date(
          value.getTime()
        )
      : new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}

export function startOfDay(
  value = new Date()
) {
  const date =
    parseDate(value);

  if (!date) {
    return null;
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

export function addDays(
  value,
  amount
) {
  const date =
    startOfDay(value);

  if (!date) {
    return null;
  }

  date.setDate(
    date.getDate() +
      amount
  );

  return date;
}

export function isSameDay(
  left,
  right
) {
  const leftDate =
    startOfDay(left);

  const rightDate =
    startOfDay(right);

  if (
    !leftDate ||
    !rightDate
  ) {
    return false;
  }

  return (
    leftDate.getFullYear() ===
      rightDate.getFullYear() &&
    leftDate.getMonth() ===
      rightDate.getMonth() &&
    leftDate.getDate() ===
      rightDate.getDate()
  );
}

/*
 * Compare calendar days rather than raw milliseconds.
 *
 * Using Date.UTC for the calculation prevents daylight-saving
 * transitions from producing incorrect day differences.
 */
export function differenceInCalendarDays(
  left,
  right
) {
  const leftDate =
    parseDate(left);

  const rightDate =
    parseDate(right);

  if (
    !leftDate ||
    !rightDate
  ) {
    return null;
  }

  const leftUtc =
    Date.UTC(
      leftDate.getFullYear(),
      leftDate.getMonth(),
      leftDate.getDate()
    );

  const rightUtc =
    Date.UTC(
      rightDate.getFullYear(),
      rightDate.getMonth(),
      rightDate.getDate()
    );

  return Math.round(
    (
      leftUtc -
      rightUtc
    ) /
      86400000
  );
}

/*
 * Produces YYYY-MM-DD using the user's calendar date.
 *
 * This is what the Proxy collection API expects for:
 *
 * ?from=YYYY-MM-DD
 * ?to=YYYY-MM-DD
 */
export function toApiDate(
  value
) {
  const date =
    parseDate(value);

  if (!date) {
    return "";
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

/* ========================================================= */
/* DATE FORMATTING                                           */
/* ========================================================= */

export function formatDate(
  value
) {
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

export function formatShortDate(
  value
) {
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
    }
  );
}

export function formatLongDate(
  value
) {
  const date =
    parseDate(value);

  if (!date) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-ZA",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

/* ========================================================= */
/* NEXT WEEK                                                 */
/* ========================================================= */

/*
 * Always returns the NEXT calendar week.
 *
 * Monday -> Sunday
 *
 * Example:
 * Current Monday 28 Sep
 * returns:
 * 5 Oct -> 11 Oct
 */
export function getNextWeekRange(
  referenceDate = new Date()
) {
  const today =
    startOfDay(
      referenceDate
    );

  if (!today) {
    return {
      start: null,
      end: null,
    };
  }

  /*
   * JavaScript:
   * Sunday = 0
   * Monday = 1
   * ...
   * Saturday = 6
   */
  const day =
    today.getDay();

  const daysUntilNextMonday =
    day === 0
      ? 1
      : 8 - day;

  const start =
    addDays(
      today,
      daysUntilNextMonday
    );

  const end =
    addDays(
      start,
      6
    );

  return {
    start,
    end,
  };
}

export function formatDateRange(
  startValue,
  endValue
) {
  const start =
    parseDate(
      startValue
    );

  const end =
    parseDate(
      endValue
    );

  if (
    !start ||
    !end
  ) {
    return "—";
  }

  if (
    start.getFullYear() ===
      end.getFullYear() &&
    start.getMonth() ===
      end.getMonth()
  ) {
    const month =
      end.toLocaleDateString(
        "en-ZA",
        {
          month:
            "short",
        }
      );

    return `${start.getDate()}–${end.getDate()} ${month}`;
  }

  return `${formatShortDate(
    start
  )} – ${formatShortDate(
    end
  )}`;
}

/* ========================================================= */
/* STATUS NORMALIZATION                                      */
/* ========================================================= */

export function normalizeCollectionStatus(
  status
) {
  const normalized =
    String(
      status || ""
    )
      .trim()
      .toLowerCase();

  /*
   * Keep this only as defensive support for any old
   * frontend/database response still using "completed".
   *
   * The current backend canonical value is "Collected".
   */
  if (
    normalized ===
    "completed"
  ) {
    return "collected";
  }

  return normalized;
}

/* ========================================================= */
/* COLLECTION STATUS KEY                                     */
/* ========================================================= */

export function getCollectionStatusKey(
  collection
) {
  if (!collection) {
    return "none";
  }

  const status =
    normalizeCollectionStatus(
      collection.status
    );

  if (
    status ===
    "collected"
  ) {
    return "collected";
  }

  if (
    status ===
    "cancelled"
  ) {
    return "cancelled";
  }

  if (
    status ===
    "overdue"
  ) {
    return "overdue";
  }

  const date =
    parseDate(
      collection
        .scheduledCollectionDate
    );

  if (!date) {
    return "none";
  }

  const difference =
    differenceInCalendarDays(
      date,
      new Date()
    );

  if (
    difference === null
  ) {
    return "none";
  }

  if (
    difference <
    0
  ) {
    return "overdue";
  }

  if (
    difference ===
    0
  ) {
    return "today";
  }

  if (
    difference ===
    1
  ) {
    return "tomorrow";
  }

  return "upcoming";
}

/* ========================================================= */
/* PATIENT STATUS KEY                                        */
/* ========================================================= */

export function getPatientStatusKey(
  patient
) {
  if (
    !patient ||
    !patient
      .nextCollectionDate
  ) {
    return "none";
  }

  const status =
    normalizeCollectionStatus(
      patient.collectionStatus
    );

  if (
    status ===
    "overdue"
  ) {
    return "overdue";
  }

  if (
    status ===
      "cancelled" ||
    status ===
      "collected"
  ) {
    return status;
  }

  const difference =
    differenceInCalendarDays(
      patient
        .nextCollectionDate,
      new Date()
    );

  if (
    difference === null
  ) {
    return "none";
  }

  if (
    difference <
    0
  ) {
    return "overdue";
  }

  if (
    difference ===
    0
  ) {
    return "today";
  }

  if (
    difference ===
    1
  ) {
    return "tomorrow";
  }

  return "upcoming";
}

/* ========================================================= */
/* STATUS PRESENTATION                                       */
/* ========================================================= */

const COLLECTION_STATES = {
  collected: {
    label:
      "Collected",

    dotClassName:
      "bg-[#16a34a]",

    className:
      "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
  },

  cancelled: {
    label:
      "Cancelled",

    dotClassName:
      "bg-[#64748b]",

    className:
      "border-[#e2e8f0] bg-[#f8fafc] text-[#475569]",
  },

  overdue: {
    label:
      "Overdue",

    dotClassName:
      "bg-[#dc2626]",

    className:
      "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]",
  },

  today: {
    label:
      "Due today",

    dotClassName:
      "bg-[#d97706]",

    className:
      "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  },

  tomorrow: {
    label:
      "Tomorrow",

    dotClassName:
      "bg-[#0f766e]",

    className:
      "border-[#99f6e4] bg-[#f0fdfa] text-[#115e59]",
  },

  upcoming: {
    label:
      "Upcoming",

    dotClassName:
      "bg-[#0f766e]",

    className:
      "border-[#ccfbf1] bg-[#f0fdfa] text-[#115e59]",
  },

  none: {
    label:
      "No collection",

    dotClassName:
      "bg-[#94a3b8]",

    className:
      "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]",
  },
};

export function getCollectionState(
  status,
  dateValue
) {
  const key =
    getCollectionStatusKey({
      status,
      scheduledCollectionDate:
        dateValue,
    });

  return (
    COLLECTION_STATES[
      key
    ] ||
    COLLECTION_STATES.none
  );
}

/* ========================================================= */
/* STATUS COMPONENT                                          */
/* ========================================================= */

export function CollectionStatus({
  status,
  date,
  className = "",
}) {
  const state =
    getCollectionState(
      status,
      date
    );

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        state.className,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${state.dotClassName}`}
      />

      {state.label}
    </span>
  );
}