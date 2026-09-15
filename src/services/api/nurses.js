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

  recordCollection: (payload) =>
    api.post(
      "/api/collections",
      payload
    ),
};