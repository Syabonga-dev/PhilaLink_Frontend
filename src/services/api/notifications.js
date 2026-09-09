import { api } from "./client.js";

// Maps to the Notification controller. There's no /me convenience route —
// fetching requires the logged-in user's own id explicitly (see
// AuthContext's `user.id`).
export const notificationsApi = {
  /** GET /api/Notification/{userId} */
  getForUser: (userId) => api.get(`/api/notification/${userId}`),

  /** POST /api/Notification  — create a notification (admin/system use). */
  create: (payload) => api.post("/api/notification", payload),

  /** PUT /api/Notification/mark-read/{id} */
  markRead: (notificationId) =>
    api.put(`/api/notification/mark-read/${notificationId}`, {}),
};