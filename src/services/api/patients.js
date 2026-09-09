import { api } from "./client.js";

export const patientsApi = {
  // Matches GET /api/Patient/user/{userId} — there's no /me convenience
  // route on the backend, so this needs the logged-in user's id (from
  // AuthContext's `user.id`, i.e. tokenStore.getUser().id).
  getByUserId: (userId) => api.get(`/api/patient/user/${userId}`),

  // Matches PUT /api/Patient/{id} — NOTE: this is the Patient record's own
  // id, not the User id. If you only have the userId, call getByUserId()
  // first to get the patient record (and its .id) before updating.
  update: (patientId, payload) => api.put(`/api/patient/${patientId}`, payload),

  getById: (patientId) => api.get(`/api/patient/${patientId}`),
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/api/patient${qs ? `?${qs}` : ""}`);
  },

  // --- Not yet backed by any Patient-controller endpoint ---
  // These map to Medication/Collections concepts and are handled in
  // their own passes, left untouched here for now.
  getMedications: () => api.get("/api/patients/me/medications"),
  getUpcomingCollection: () => api.get("/api/patients/me/collections/next"),
  getCollectionHistory: () => api.get("/api/patients/me/collections"),
};