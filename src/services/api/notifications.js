import {
  api,
} from "./client.js";

import {
  translateKnownNotificationMessage,
} from "../../i18n/patientText.js";

import {
  translateWeatherUpdateMessage,
} from "../../i18n/weatherNotificationText.js";

/*
 * Historical duplicate weather notifications may already exist
 * in the database because older versions allowed two concurrent
 * weather-tip requests to pass the duplicate check.
 *
 * Do not delete those rows from the database automatically.
 *
 * Instead, collapse identical weather updates created within a
 * short period when displaying notifications.
 *
 * Legitimate hourly updates remain because they fall outside
 * this window.
 */
const WEATHER_DUPLICATE_WINDOW_MS =
  5 * 60 * 1000;

function normalizeWeatherMessage(
  message
) {
  return String(
    message ?? ""
  )
    .trim()
    .replace(
      /\s+/g,
      " "
    )
    .toLowerCase();
}

function isDynamicWeatherNotification(
  notification
) {
  return String(
    notification?.message ??
      ""
  )
    .trim()
    .toLowerCase()
    .startsWith(
      "weather update:"
    );
}

function parseNotificationTime(
  notification
) {
  const value =
    notification
      ?.createdAt;

  if (!value) {
    return null;
  }

  const date =
    new Date(
      value
    );

  const timestamp =
    date.getTime();

  return Number.isFinite(
    timestamp
  )
    ? timestamp
    : null;
}

function collapseWeatherDuplicates(
  notifications
) {
  if (
    !Array.isArray(
      notifications
    )
  ) {
    return [];
  }

  const lastSeenByMessage =
    new Map();

  return notifications.filter(
    notification => {
      if (
        !isDynamicWeatherNotification(
          notification
        )
      ) {
        return true;
      }

      const normalizedMessage =
        normalizeWeatherMessage(
          notification.message
        );

      const timestamp =
        parseNotificationTime(
          notification
        );

      /*
       * If either field cannot be trusted, keep the row.
       * It is safer to display something than accidentally
       * remove a legitimate notification.
       */
      if (
        !normalizedMessage ||
        timestamp ===
          null
      ) {
        return true;
      }

      const previousTimestamp =
        lastSeenByMessage.get(
          normalizedMessage
        );

      /*
       * Update the timestamp even when this row is hidden.
       *
       * This collapses a burst such as:
       * 22:59
       * 23:00
       * 23:01
       *
       * into one displayed notification.
       */
      lastSeenByMessage.set(
        normalizedMessage,
        timestamp
      );

      if (
        previousTimestamp ===
        undefined
      ) {
        return true;
      }

      const difference =
        Math.abs(
          previousTimestamp -
            timestamp
        );

      return (
        difference >
        WEATHER_DUPLICATE_WINDOW_MS
      );
    }
  );
}

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

  const weatherMessage =
    translateWeatherUpdateMessage(
      originalMessage
    );

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

    const notifications =
      Array.isArray(
        result
      )
        ? result
        : [];

    /*
     * Important:
     * deduplicate BEFORE translation.
     *
     * This ensures we compare the canonical backend messages,
     * rather than translated strings which vary by language.
     */
    return collapseWeatherDuplicates(
      notifications
    ).map(
      localizeNotification
    );
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
