import i18n from "../../i18n/index.js";

import {
  api,
} from "./client.js";

import {
  localizeAppointments,
  localizeDashboard,
} from "../../i18n/patientText.js";

export const patientsApi = {
  getMe: () =>
    api.get(
      "/api/patients/me"
    ),

  updateMe: payload =>
    api.put(
      "/api/patients/me",
      payload
    ),

  getDashboard:
    async () => {
      const result =
        await api.get(
          "/api/patients/me/dashboard"
        );

      return localizeDashboard(
        result
      );
    },

  getRecords: () =>
    api.get(
      "/api/patients/me/records"
    ),

  getMedications: () =>
    api.get(
      "/api/patients/me/medications"
    ),

  logMedication: (
    medicationId,
    {
      taken,
      notes = null,
    }
  ) => {
    if (!medicationId) {
      throw new Error(
        i18n.t(
          "api.medicationIdRequired"
        )
      );
    }

    return api.post(
      `/api/patients/me/medications/${medicationId}/log`,
      {
        taken,
        notes,
      }
    );
  },

  getAppointments:
    async () => {
      const result =
        await api.get(
          "/api/patients/me/appointments"
        );

      return localizeAppointments(
        result
      );
    },

  bookAppointment: payload =>
    api.post(
      "/api/patients/me/appointments",
      payload
    ),

  rescheduleAppointment: (
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

    return api.patch(
      `/api/patients/me/appointments/${appointmentId}/reschedule`,
      payload
    );
  },

  cancelAppointment:
    appointmentId => {
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

  getCollections: () =>
    api.get(
      "/api/patients/me/collections"
    ),

  getNextCollection: () =>
    api.get(
      "/api/patients/me/collections/next"
    ),

  getNotifications: () =>
    api.get(
      "/api/patients/me/notifications"
    ),

  markNotificationRead:
    notificationId => {
      if (!notificationId) {
        throw new Error(
          i18n.t(
            "api.notificationIdRequired"
          )
        );
      }

      return api.patch(
        `/api/patients/me/notifications/${notificationId}/read`
      );
    },

  getPreferences: () =>
    api.get(
      "/api/patients/me/preferences"
    ),

  updatePreferences: payload =>
    api.put(
      "/api/patients/me/preferences",
      payload
    ),

  getLanguage: () =>
    api.get(
      "/api/patients/me/language"
    ),

  updateLanguage: language =>
    api.put(
      "/api/patients/me/language",
      {
        language,
      }
    ),
};
