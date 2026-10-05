import i18n from "../../i18n/index.js";

import {
  getLanguageName,
  getStoredLanguage,
} from "../../i18n/languages.js";

import {
  api,
} from "./client.js";

const LANGUAGE_PREFIX =
  "PHILALINK_RESPONSE_LANGUAGE:";

const PATIENT_MESSAGE_PREFIX =
  "PATIENT_MESSAGE:";

function buildWireMessage(
  message
) {
  const language =
    getStoredLanguage();

  const languageName =
    getLanguageName(
      language
    );

  return [
    `${LANGUAGE_PREFIX} ${languageName} (${language})`,
    `Reply entirely in ${languageName} unless the patient explicitly asks you to use another language.`,
    "Keep medicine names, clinic names, IDs, measurements and necessary medical terminology unchanged where translating them would reduce clarity.",
    PATIENT_MESSAGE_PREFIX,
    message,
  ].join(
    "\n"
  );
}

function unwrapUserMessage(
  content
) {
  const text =
    String(
      content ??
      ""
    );

  if (
    !text.startsWith(
      LANGUAGE_PREFIX
    )
  ) {
    return text;
  }

  const marker =
    `${PATIENT_MESSAGE_PREFIX}\n`;

  const index =
    text.indexOf(
      marker
    );

  if (
    index < 0
  ) {
    return text;
  }

  return text
    .slice(
      index +
        marker.length
    )
    .trim();
}

function normalizeHistory(
  history
) {
  if (
    !history ||
    !Array.isArray(
      history.messages
    )
  ) {
    return history;
  }

  return {
    ...history,

    messages:
      history.messages.map(
        message => ({
          ...message,

          content:
            message.role ===
            "user"
              ? unwrapUserMessage(
                  message.content
                )
              : message.content,
        })
      ),
  };
}

export const chatbotApi = {
  sendMessage: (
    message,
    opts = {}
  ) => {
    const cleanMessage =
      String(
        message ||
        ""
      ).trim();

    if (
      !cleanMessage
    ) {
      throw new Error(
        i18n.t(
          "api.messageRequired"
        )
      );
    }

    return api.post(
      "/api/chatbot/message",
      {
        message:
          buildWireMessage(
            cleanMessage
          ),
      },
      {
        signal:
          opts.signal,
      }
    );
  },

  getHistory: async () => {
    const history =
      await api.get(
        "/api/chatbot/history"
      );

    return normalizeHistory(
      history
    );
  },

  clearHistory: () =>
    api.delete(
      "/api/chatbot/history"
    ),
};
