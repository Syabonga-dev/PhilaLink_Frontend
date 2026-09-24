import {
  api,
} from "./client.js";

export const clinicsApi = {
  // =====================================================
  // AUTHENTICATED CLINIC ENDPOINTS
  // =====================================================

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

  create: (
    payload
  ) =>
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

  // =====================================================
  // PUBLIC REGISTRATION CLINIC SEARCH
  // =====================================================

  searchForRegistration: ({
    search = "",
    limit = 30,
    signal,
  } = {}) => {
    const params =
      new URLSearchParams();

    const normalizedSearch =
      search.trim();

    if (
      normalizedSearch
    ) {
      params.set(
        "search",
        normalizedSearch
      );
    }

    params.set(
      "limit",
      String(limit)
    );

    return api.get(
      `/api/registration/clinics?${params.toString()}`,
      {
        auth:
          false,

        signal,
      }
    );
  },

  // =====================================================
  // PUBLIC REGISTRATION CLINIC SELECTION
  // =====================================================

  selectForRegistration: ({
    userId,
    clinicId,
  }) => {
    if (!userId) {
      throw new Error(
        "A registration user ID is required."
      );
    }

    if (!clinicId) {
      throw new Error(
        "Please select a clinic."
      );
    }

    return api.post(
      "/api/registration/clinic-selection",
      {
        userId,
        clinicId,
      },
      {
        auth:
          false,
      }
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
