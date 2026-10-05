import i18n from "../../i18n/index.js";

import {
  api,
} from "./client.js";

import {
  localizeAppointment,
  localizeAppointments,
} from "../../i18n/patientText.js";

/*
 * Keep one canonical value in the database for the system's
 * default appointment reason.
 *
 * The patient sees the translated value, but future bookings
 * using the untouched default are stored in English internally.
 * This means changing the interface language later does not
 * permanently lock that system-generated reason to the language
 * selected when the appointment was created.
 */
const CANONICAL_DEFAULT_REASON =
  "Routine patient checkup";

/*
 * These are system-generated equivalents of the same default
 * reason.
 *
 * They are recognised so that appointments created before the
 * canonical-storage change can still switch language correctly.
 *
 * Anything outside this list is treated as genuine free text and
 * is never translated automatically.
 */
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

/*
 * Converts only the PhilaLink-generated default reason.
 *
 * Custom reasons written by patients or staff are returned
 * unchanged.
 */
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

/*
 * When the booking form still contains the translated system
 * default, convert it to the canonical database value before
 * sending it to the backend.
 *
 * If the patient edited the reason, their text is preserved.
 */
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

export const appointmentsApi = {
  getMine: async () => {
    const result =
      await api.get(
        "/api/appointments/me"
      );

    return localizeAppointmentList(
      result
    );
  },

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
