import { api } from "./client.js";

export const notificationsApi = {
  create: (payload) =>
    api.post(
      "/api/notifications",
      payload
    ),

  getMine: () =>
    api.get(
      "/api/notifications/me"
    ),

  markRead: (id) =>
    api.patch(
      `/api/notifications/me/${id}/read`
    ),

  markAllRead: () =>
    api.patch(
      "/api/notifications/me/read-all"
    ),
};
