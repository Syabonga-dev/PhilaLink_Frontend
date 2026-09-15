import { api } from "./client.js";

export const appointmentsApi = {
  getMine: () => api.get("/api/appointments/me"),
};