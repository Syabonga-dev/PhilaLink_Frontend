import { api } from "./client.js";

export const notificationsApi = {
  create: (payload) =>
    api.post(
      "/api/notifications",
      payload
    ),
};