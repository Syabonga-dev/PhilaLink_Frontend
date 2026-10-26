import {
  api,
} from "./client.js";

function normalizeFilters(
  filters = "All",
  options = {}
) {
  if (
    typeof filters === "string"
  ) {
    return {
      ...options,
      role: filters,
    };
  }

  return {
    ...(filters || {}),
    ...(options || {}),
  };
}

export const superAdminAccountsApi = {
  getAccounts: (
    filters = "All",
    options = {}
  ) => {
    const normalized = normalizeFilters(
      filters,
      options
    );

    const params = new URLSearchParams();

    const role = normalized.role || "All";

    const search = String(
      normalized.search || ""
    ).trim();

    const page = Math.max(
      1,
      Number(normalized.page) || 1
    );

    const pageSize = Math.min(
      100,
      Math.max(
        1,
        Number(normalized.pageSize) || 20
      )
    );

    if (
      role &&
      role !== "All"
    ) {
      params.set(
        "role",
        role
      );
    }

    if (search) {
      params.set(
        "search",
        search
      );
    }

    params.set(
      "page",
      String(page)
    );

    params.set(
      "pageSize",
      String(pageSize)
    );

    return api.get(
      `/api/super-admin/accounts-paged?${params.toString()}`,
      {
        signal: normalized.signal,
      }
    );
  },
};
