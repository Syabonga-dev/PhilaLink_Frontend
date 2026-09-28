import {
  api,
} from "./client.js";

export const identityApi = {
  updateDateOfBirth: (
    payload
  ) =>
    api.put(
      "/api/account/identity/date-of-birth",
      payload
    ),

  updateIdNumber: (
    payload
  ) =>
    api.put(
      "/api/account/identity/id-number",
      payload
    ),
};
