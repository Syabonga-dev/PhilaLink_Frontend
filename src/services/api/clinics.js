import { api } from "./client.js";

export const clinicsApi = {
  getAll: () =>
    api.get("/api/clinics"),

  getById: (clinicId) => {
    if (!clinicId) {
      throw new Error(
        "A clinic ID is required."
      );
    }

    return api.get(
      `/api/clinics/${clinicId}`
    );
  },
};

export const symptomCheckerApi = {
  assess: (payload) =>
    api.post(
      "/api/symptom-checker/assess",
      payload
    ),
};

export const collectionsApi = {
  list: () =>
    api.get("/api/collections"),

  getSummary: () =>
    api.get(
      "/api/collections/summary"
    ),

  markCollected: (
    collectionId,
    payload = {
      proxyId: null,
      notes: null,
    }
  ) => {
    if (!collectionId) {
      throw new Error(
        "A collection ID is required."
      );
    }

    return api.patch(
      `/api/collections/${collectionId}/collect`,
      payload
    );
  },
};