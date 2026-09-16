import { api } from "./client.js";

export const patientsApi = {
  getMe: () =>
    api.get(
      "/api/patients/me"
    ),

  updateMe: (payload) =>
    api.put(
      "/api/patients/me",
      payload
    ),

  getDashboard: async () => {
    const [
      dashboard,
      supply,
    ] =
      await Promise.all([
        api.get(
          "/api/patients/me/dashboard"
        ),
        api.get(
          "/api/medications/me/supply"
        ),
      ]);

    const supplyByMedication =
      new Map(
        (
          Array.isArray(
            supply
          )
            ? supply
            : []
        ).map(
          (item) => [
            item.medicationId,
            item,
          ]
        )
      );

    const medications =
      Array.isArray(
        dashboard?.medications
      )
        ? dashboard.medications.map(
            (
              medication
            ) => {
              const medicationSupply =
                supplyByMedication.get(
                  medication.id
                );

              return {
                ...medication,

                daysRemaining:
                  medicationSupply
                    ?.daysRemaining ??
                  null,

                dispensedQuantity:
                  medicationSupply
                    ?.dispensedQuantity ??
                  null,

                estimatedRemainingQuantity:
                  medicationSupply
                    ?.estimatedRemainingQuantity ??
                  null,

                unitsPerDose:
                  medicationSupply
                    ?.unitsPerDose ??
                  null,

                dosesPerDay:
                  medicationSupply
                    ?.dosesPerDay ??
                  null,

                supplyCalculationStatus:
                  medicationSupply
                    ?.calculationStatus ??
                  null,

                lastCollectedAt:
                  medicationSupply
                    ?.lastCollectedAt ??
                  null,
              };
            }
          )
        : [];

    return {
      ...dashboard,
      medications,
    };
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
        "A medication ID is required."
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

  getAppointments: () =>
    api.get(
      "/api/patients/me/appointments"
    ),

  bookAppointment: (
    payload
  ) =>
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
        "An appointment ID is required."
      );
    }

    return api.patch(
      `/api/patients/me/appointments/${appointmentId}/reschedule`,
      payload
    );
  },

  cancelAppointment: (
    appointmentId
  ) => {
    if (!appointmentId) {
      throw new Error(
        "An appointment ID is required."
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

  markNotificationRead: (
    notificationId
  ) => {
    if (!notificationId) {
      throw new Error(
        "A notification ID is required."
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

  updatePreferences: (
    payload
  ) =>
    api.put(
      "/api/patients/me/preferences",
      payload
    ),
};