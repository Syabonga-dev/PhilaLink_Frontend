import {
  api,
} from "./client.js";

import {
  translateKnownNotificationMessage,
} from "../../i18n/patientText.js";

import {
  translateWeatherUpdateMessage,
} from "../../i18n/weatherNotificationText.js";

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

  const originalMessage =
    notification.message;

  /*
   * First handle the newer dynamic weather format:
   *
   * Weather update: Gqeberha is currently ...
   *
   * This keeps locations, temperatures and forecast times
   * unchanged while translating the sentence, weather
   * conditions and health advice.
   */
  const weatherMessage =
    translateWeatherUpdateMessage(
      originalMessage
    );

  /*
   * If it was not a new weather update, pass it through the
   * existing translator for medication, appointment and older
   * weather-health-tip notifications.
   */
  const translatedMessage =
    weatherMessage !==
    originalMessage
      ? weatherMessage
      : translateKnownNotificationMessage(
          originalMessage
        );

  return {
    ...notification,

    message:
      translatedMessage,
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
