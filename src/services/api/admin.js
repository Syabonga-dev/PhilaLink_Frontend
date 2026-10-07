import {
  api,
} from "./client.js";

function normalizeEmploymentDate(
  value
) {
  if (!value) {
    return value;
  }

  if (
    value instanceof
    Date
  ) {
    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return value;
    }

    return value.toISOString();
  }

  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  const trimmed =
    value.trim();

  if (!trimmed) {
    return trimmed;
  }

  /*
   * HTML <input type="date"> produces YYYY-MM-DD.
   *
   * The backend Nurse EmploymentDate is currently a DateTime
   * stored in PostgreSQL as timestamp with time zone.
   *
   * Send an explicit UTC timestamp rather than allowing
   * ASP.NET to deserialize a timezone-less DateTime.
   */
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      trimmed
    )
  ) {
    return `${trimmed}T00:00:00.000Z`;
  }

  const parsed =
    new Date(
      trimmed
    );

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return trimmed;
  }

  return parsed.toISOString();
}

function normalizeNursePayload(
  payload = {}
) {
  return {
    ...payload,

    employmentDate:
      normalizeEmploymentDate(
        payload.employmentDate
      ),
  };
}

export const adminApi = {
  getMe: () =>
    api.get(
      "/api/admin/me"
    ),

  getDashboard: () =>
    api.get(
      "/api/admin/dashboard"
    ),

  getClinicOverview: () =>
    api.get(
      "/api/admin/clinic-overview"
    ),

  getAuditLog: () =>
    api.get(
      "/api/audit"
    ),

  registerNurse: (
    payload
  ) =>
    api.post(
      "/api/admin/nurses",
      normalizeNursePayload(
        payload
      )
    ),

  registerProxy: (
    payload
  ) =>
    api.post(
      "/api/admin/proxies",
      payload
    ),

  registerClinicAdmin: (
    payload
  ) =>
    api.post(
      "/api/admin/clinic-admins",
      payload
    ),

  resendInvitation: (
    userId
  ) => {
    if (!userId) {
      throw new Error(
        "A user ID is required."
      );
    }

    return api.post(
      `/api/admin/accounts/${userId}/resend-invitation`
    );
  },

  listAccounts: (
    role
  ) => {
    const qs =
      role &&
      role !==
        "All"
        ? `?role=${encodeURIComponent(
            role
          )}`
        : "";

    return api.get(
      `/api/admin/accounts${qs}`
    );
  },

  deactivateAccount: (
    userId
  ) => {
    if (!userId) {
      throw new Error(
        "A user ID is required."
      );
    }

    return api.patch(
      `/api/admin/accounts/${userId}/deactivate`
    );
  },

  activateAccount: (
    userId
  ) => {
    if (!userId) {
      throw new Error(
        "A user ID is required."
      );
    }

    return api.patch(
      `/api/admin/accounts/${userId}/activate`
    );
  },

  assignProxy: (
    patientId,
    proxyId
  ) => {
    if (
      !patientId ||
      !proxyId
    ) {
      throw new Error(
        "A patient ID and proxy ID are required."
      );
    }

    const qs =
      new URLSearchParams({
        patientId,
        proxyId,
      }).toString();

    return api.post(
      `/api/admin/proxy-links?${qs}`
    );
  },
};