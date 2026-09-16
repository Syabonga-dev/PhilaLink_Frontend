import { api } from "./client.js";

export const medicationsApi = {
  getMine: () =>
    api.get(
      "/api/medications/me"
    ),

  getSupply: () =>
    api.get(
      "/api/medications/me/supply"
    ),

  logDose: (
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
      `/api/medications/${medicationId}/log`,
      {
        taken,
        notes,
      }
    );
  },
};