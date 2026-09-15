import { api } from "./client.js";

export const proxiesApi = {
  getManagedPatients: () =>
    api.get("/api/proxies/me/patients"),
};