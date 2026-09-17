import { api } from "./client.js";

export const proxiesApi = {
  getMyAssignedWorker: () =>
    api.get(
      "/api/proxies/me"
    ),

  getManagedPatients: () =>
    api.get(
      "/api/proxies/me/patients"
    ),

  getMyPatients: () =>
    api.get(
      "/api/proxies/me/patients"
    ),

  getCare: () =>
    api.get(
      "/api/proxies/me/care"
    ),

  getCollections: () =>
    api.get(
      "/api/proxies/me/collections"
    ),
};
