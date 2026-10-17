import i18n from "../../i18n/index.js";

import {
  api,
} from "./client.js";

import {
  localizeAppointment,
  localizeAppointments,
} from "../../i18n/patientText.js";

const CANONICAL_DEFAULT_REASON =
  "Routine patient checkup";

const SYSTEM_DEFAULT_REASONS = [
  "Routine patient checkup",

  "Ukuhlolwa okujwayelekile kwesiguli",

  "Uvavanyo oluqhelekileyo lwesigulana",

  "Roetine-pasiëntondersoek",

  "Tlhahlobo ya ka mehla ya molwetši",

  "Tlhahlobo ya ka gale ya molwetse",

  "Tlhahlobo e tloaelehileng ea mokuli",

  "Ku kamberiwa ka ntolovelo ka muvabyi",

  "Kuhlolwa lokuvamile kwesiguli",

  "U ṱolwa ha mulwadze ha tshifhinga tsho ḓoweleaho",

  "Ukuhlolwa okuvamileko kwesiguli",
];

const DEFAULT_PAGE_SIZE =
  20;

const COMPATIBILITY_PAGE_SIZE =
  100;

function normalizeReason(
  value
) {
  return String(
    value ?? ""
  )
    .normalize(
      "NFKC"
    )
    .trim()
    .replace(
      /\s+/g,
      " "
    )
    .toLocaleLowerCase();
}

const SYSTEM_DEFAULT_REASON_SET =
  new Set(
    SYSTEM_DEFAULT_REASONS.map(
      normalizeReason
    )
  );

function isSystemDefaultReason(
  value
) {
  const normalized =
    normalizeReason(
      value
    );

  return (
    normalized.length >
      0 &&
    SYSTEM_DEFAULT_REASON_SET
      .has(
        normalized
      )
  );
}

function localizeSystemReason(
  appointment
) {
  if (
    !appointment ||
    typeof appointment !==
      "object"
  ) {
    return appointment;
  }

  if (
    !isSystemDefaultReason(
      appointment.reason
    )
  ) {
    return appointment;
  }

  return {
    ...appointment,

    reason:
      i18n.t(
        "appointments.defaultReason"
      ),
  };
}

function localizeAppointmentResult(
  appointment
) {
  return localizeSystemReason(
    localizeAppointment(
      appointment
    )
  );
}

function localizeAppointmentList(
  value
) {
  const appointments =
    localizeAppointments(
      value
    );

  return Array.isArray(
    appointments
  )
    ? appointments.map(
        localizeSystemReason
      )
    : [];
}

function normalizePositiveInteger(
  value,
  fallback
) {
  const parsed =
    Number.parseInt(
      value,
      10
    );

  return Number.isFinite(
    parsed
  ) &&
    parsed > 0
    ? parsed
    : fallback;
}

function normalizeView(
  value
) {
  const normalized =
    String(
      value ?? "all"
    )
      .trim()
      .toLowerCase();

  return [
    "all",
    "upcoming",
    "past",
  ].includes(
    normalized
  )
    ? normalized
    : "all";
}

function normalizePagedResult(
  result,
  fallbackPage,
  fallbackPageSize
) {
  const items =
    localizeAppointmentList(
      result?.items
    );

  const page =
    normalizePositiveInteger(
      result?.page,
      fallbackPage
    );

  const pageSize =
    normalizePositiveInteger(
      result?.pageSize,
      fallbackPageSize
    );

  const totalItems =
    Math.max(
      0,
      Number(
        result?.totalItems ??
          0
      ) ||
        0
    );

  const calculatedPages =
    pageSize > 0
      ? Math.ceil(
          totalItems /
            pageSize
        )
      : 0;

  const totalPages =
    Math.max(
      0,
      Number(
        result?.totalPages ??
          calculatedPages
      ) ||
        0
    );

  return {
    items,

    page,

    pageSize,

    totalItems,

    totalPages,

    hasPreviousPage:
      Boolean(
        result?.hasPreviousPage ??
          page > 1
      ),

    hasNextPage:
      Boolean(
        result?.hasNextPage ??
          page <
            totalPages
      ),
  };
}

function normalizeBookingPayload(
  payload
) {
  const next = {
    ...(
      payload ??
      {}
    ),
  };

  if (
    isSystemDefaultReason(
      next.reason
    )
  ) {
    next.reason =
      CANONICAL_DEFAULT_REASON;
  }

  return next;
}

async function fetchMinePage({
  view = "all",
  page = 1,
  pageSize =
    DEFAULT_PAGE_SIZE,
} = {}) {
  const normalizedPage =
    normalizePositiveInteger(
      page,
      1
    );

  const normalizedPageSize =
    normalizePositiveInteger(
      pageSize,
      DEFAULT_PAGE_SIZE
    );

  const params =
    new URLSearchParams({
      view:
        normalizeView(
          view
        ),

      page:
        String(
          normalizedPage
        ),

      pageSize:
        String(
          normalizedPageSize
        ),
    });

  const result =
    await api.get(
      `/api/appointments/me?${params.toString()}`
    );

  return normalizePagedResult(
    result,
    normalizedPage,
    normalizedPageSize
  );
}

export const appointmentsApi = {
  /*
   * Backwards-compatible method used by the current
   * AppointmentsPage.
   *
   * It is deliberately capped at the backend maximum rather
   * than downloading an unbounded appointment history.
   *
   * AppointmentsPage will switch to getMinePage() when the
   * pagination controls are added.
   */
  getMine: async () => {
    const result =
      await fetchMinePage({
        view:
          "all",

        page:
          1,

        pageSize:
          COMPATIBILITY_PAGE_SIZE,
      });

    return result.items;
  },

  getMinePage:
    fetchMinePage,

  book: async payload => {
    const result =
      await api.post(
        "/api/patients/me/appointments",
        normalizeBookingPayload(
          payload
        )
      );

    return localizeAppointmentResult(
      result
    );
  },

  reschedule: async (
    appointmentId,
    payload
  ) => {
    if (!appointmentId) {
      throw new Error(
        i18n.t(
          "api.appointmentIdRequired"
        )
      );
    }

    const result =
      await api.patch(
        `/api/patients/me/appointments/${appointmentId}/reschedule`,
        payload
      );

    return localizeAppointmentResult(
      result
    );
  },

  cancel: (
    appointmentId
  ) => {
    if (!appointmentId) {
      throw new Error(
        i18n.t(
          "api.appointmentIdRequired"
        )
      );
    }

    return api.patch(
      `/api/patients/me/appointments/${appointmentId}/cancel`
    );
  },
};
