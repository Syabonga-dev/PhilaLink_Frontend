import { api } from "./client.js";

export const proxiesApi = {
  getMyAssignedWorker: () =>
    api.get(
      "/api/proxies/me"
    ),
};