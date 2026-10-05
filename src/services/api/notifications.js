import {
  api,
} from "./client.js";

import {
  translateKnownNotificationMessage,
} from "../../i18n/patientText.js";

function localizeNotification(
  notification
) {
  if (
    !notification ||
    typeof notification !==
      "object"
  ) {
    return notification;
  }

  return {
    ...notification,

    message:
      translateKnownNotificationMessage(
        notification
          .message
      ),
  };
}

export const notificationsApi = {
  create: payload =>
    api.post(
      "/api/notifications",
      payload
    ),

  getMine: async () => {
    const result =
      await api.get(
        "/api/notifications/me"
      );

    return Array.isArray(
      result
    )
      ? result.map(
          localizeNotification
        )
      : [];
  },

  markRead: id =>
    api.patch(
      `/api/notifications/me/${id}/read`
    ),

  markAllRead: () =>
    api.patch(
      "/api/notifications/me/read-all"
    ),
};
