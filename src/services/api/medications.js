import i18n from "../../i18n/index.js";

import {
  api,
} from "./client.js";

import {
  localizeMedications,
} from "../../i18n/patientText.js";

export const medicationsApi = {
  getMine:
    async () => {
      const result =
        await api.get(
          "/api/medications/me"
        );

      return localizeMedications(
        result
      );
    },

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
    if (
      !medicationId
    ) {
      throw new Error(
        i18n.t(
          "api.medicationIdRequired"
        )
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
