import { api } from "./client.js";

export const nursesApi = {
  getMe: () =>
    api.get("/api/nurses/me"),

  getDashboardStats: () =>
    api.get("/api/nurses/me/dashboard"),

  getAssignedPatients: () =>
    api.get("/api/nurses/me/patients"),

  getUrgentAlerts: () =>
    api.get("/api/nurses/me/alerts"),

  getSupplyLevels: () =>
    api.get("/api/clinic-stock"),

  getAuditLog: (params = {}) => {
    const qs =
      new URLSearchParams(
        params
      ).toString();

    return api.get(
      `/api/audit-log${
        qs ? `?${qs}` : ""
      }`
    );
  },

  recordCollection: (payload) =>
    api.post(
      "/api/collections",
      payload
    ),
};