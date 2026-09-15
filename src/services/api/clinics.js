import { api } from "./client.js";

export const clinicsApi = {
  getAll: () =>
    api.get(
      "/api/clinics"
    ),

  getById: (
    clinicId
  ) => {
    if (!clinicId) {
      throw new Error(
        "A clinic ID is required."
      );
    }

    return api.get(
      `/api/clinics/${clinicId}`
    );
  },

  create: (payload) =>
    api.post(
      "/api/clinics",
      payload
    ),

  update: (
    clinicId,
    payload
  ) => {
    if (!clinicId) {
      throw new Error(
        "A clinic ID is required."
      );
    }

    return api.put(
      `/api/clinics/${clinicId}`,
      payload
    );
  },

  deactivate: (
    clinicId
  ) => {
    if (!clinicId) {
      throw new Error(
        "A clinic ID is required."
      );
    }

    return api.patch(
      `/api/clinics/${clinicId}/deactivate`
    );
  },

  activate: (
    clinicId
  ) => {
    if (!clinicId) {
      throw new Error(
        "A clinic ID is required."
      );
    }

    return api.patch(
      `/api/clinics/${clinicId}/activate`
    );
  },
};

export const collectionsApi = {
  list: () =>
    api.get(
      "/api/collections"
    ),

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