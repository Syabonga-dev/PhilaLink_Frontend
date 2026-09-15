import { api } from "./client.js";

export const adminApi = {
  getMe: () =>
    api.get(
      "/api/admin/me"
    ),

  getDashboard: () =>
    api.get(
      "/api/admin/dashboard"
    ),

  getClinicOverview: () =>
    api.get(
      "/api/admin/clinic-overview"
    ),

  getAuditLog: () =>
    api.get(
      "/api/audit"
    ),

  registerNurse: (
    payload
  ) =>
    api.post(
      "/api/admin/nurses",
      payload
    ),

  registerProxy: (
    payload
  ) =>
    api.post(
      "/api/admin/proxies",
      payload
    ),

  registerClinicAdmin: (
    payload
  ) =>
    api.post(
      "/api/admin/clinic-admins",
      payload
    ),

  listAccounts: (
    role
  ) => {
    const qs =
      role &&
      role !== "All"
        ? `?role=${encodeURIComponent(
            role
          )}`
        : "";

    return api.get(
      `/api/admin/accounts${qs}`
    );
  },

  deactivateAccount: (
    userId
  ) => {
    if (!userId) {
      throw new Error(
        "A user ID is required."
      );
    }

    return api.patch(
      `/api/admin/accounts/${userId}/deactivate`
    );
  },

  activateAccount: (
    userId
  ) => {
    if (!userId) {
      throw new Error(
        "A user ID is required."
      );
    }

    return api.patch(
      `/api/admin/accounts/${userId}/activate`
    );
  },

  assignProxy: (
    patientId,
    proxyId
  ) => {
    if (
      !patientId ||
      !proxyId
    ) {
      throw new Error(
        "A patient ID and proxy ID are required."
      );
    }

    const qs =
      new URLSearchParams({
        patientId,
        proxyId,
      }).toString();

    return api.post(
      `/api/admin/proxy-links?${qs}`
    );
  },
};