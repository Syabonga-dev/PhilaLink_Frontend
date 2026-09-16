import { api } from "./client.js";

export const appointmentsApi = {
  getMine: () =>
    api.get(
      "/api/appointments/me"
    ),

  book: (payload) =>
    api.post(
      "/api/patients/me/appointments",
      payload
    ),

  reschedule: (
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
};