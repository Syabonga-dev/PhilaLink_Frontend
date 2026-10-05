import i18n from "../../i18n/index.js";

import {
  api,
} from "./client.js";

import {
  localizeAppointment,
  localizeAppointments,
} from "../../i18n/patientText.js";

export const appointmentsApi = {
  getMine: async () => {
    const result =
      await api.get(
        "/api/appointments/me"
      );

    return localizeAppointments(
      result
    );
  },

  book: async payload => {
    const result =
      await api.post(
        "/api/patients/me/appointments",
        payload
      );

    return localizeAppointment(
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

    return localizeAppointment(
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
