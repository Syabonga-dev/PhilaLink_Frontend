import { api } from "./client.js";

export const symptomAssessmentsApi = {
  create: (symptoms) => {
    const cleanSymptoms =
      String(
        symptoms || ""
      ).trim();

    if (!cleanSymptoms) {
      throw new Error(
        "Symptoms are required."
      );
    }

    return api.post(
      "/api/symptom-assessments",
      {
        symptoms:
          cleanSymptoms,
      }
    );
  },

  getMine: () =>
    api.get(
      "/api/symptom-assessments/me"
    ),
};