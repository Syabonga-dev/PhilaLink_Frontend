import { api } from "./client.js";

export const chatbotApi = {
  sendMessage: (
    message,
    opts = {}
  ) => {
    const cleanMessage =
      String(
        message || ""
      ).trim();

    if (!cleanMessage) {
      throw new Error(
        "A message is required."
      );
    }

    return api.post(
      "/api/chatbot/message",
      {
        message: cleanMessage,
      },
      {
        signal:
          opts.signal,
      }
    );
  },

  getHistory: () =>
    api.get(
      "/api/chatbot/history"
    ),

  clearHistory: () =>
    api.delete(
      "/api/chatbot/history"
    ),
};