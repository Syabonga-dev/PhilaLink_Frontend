import {
  api,
} from "./client.js";

export const superAdminAccountsApi = {
  getAccounts: (
    role = "All"
  ) => {
    const query =
      role &&
      role !==
        "All"
        ? `?role=${encodeURIComponent(
            role
          )}`
        : "";

    return api.get(
      `/api/super-admin/accounts${query}`
    );
  },
};
