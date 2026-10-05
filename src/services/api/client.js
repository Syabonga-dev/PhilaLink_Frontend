import i18n from "../../i18n/index.js";

import {
  getStoredLanguage,
} from "../../i18n/languages.js";

export const API_BASE_URL =
  import.meta.env
    .VITE_API_BASE_URL ||
  "https://philalink-api.onrender.com";

const TOKEN_KEY =
  "philalink_token";

const USER_KEY =
  "philalink_user";

export const tokenStore = {
  getToken: () =>
    localStorage.getItem(
      TOKEN_KEY
    ),

  getUser: () => {
    try {
      const raw =
        localStorage.getItem(
          USER_KEY
        );

      return raw
        ? JSON.parse(raw)
        : null;
    } catch {
      return null;
    }
  },

  setSession: ({
    token,
    user,
  }) => {
    if (token) {
      localStorage.setItem(
        TOKEN_KEY,
        token
      );
    }

    if (user) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(
          user
        )
      );
    }
  },

  setUser: user => {
    if (!user) {
      localStorage.removeItem(
        USER_KEY
      );

      return;
    }

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(
        user
      )
    );
  },

  clear: () => {
    localStorage.removeItem(
      TOKEN_KEY
    );

    localStorage.removeItem(
      USER_KEY
    );
  },
};

export class ApiError extends Error {
  constructor(
    message,
    {
      status,
      errors,
      isNetworkError = false,
    } = {}
  ) {
    super(
      message
    );

    this.name =
      "ApiError";

    this.status =
      status;

    this.errors =
      errors ||
      null;

    this.isNetworkError =
      isNetworkError;
  }
}

let onUnauthorized =
  null;

export function registerUnauthorizedHandler(
  handler
) {
  onUnauthorized =
    handler;
}

function isPatientUser() {
  const user =
    tokenStore.getUser();

  const role =
    String(
      user?.role ??
      user?.Role ??
      ""
    )
      .trim()
      .toLowerCase();

  return (
    role ===
    "patient"
  );
}

function getPatientLanguage() {
  return isPatientUser()
    ? getStoredLanguage()
    : "en";
}

function translatedHttpError(
  status
) {
  if (
    status === 400 ||
    status === 422
  ) {
    return i18n.t(
      "api.badRequest"
    );
  }

  if (status === 404) {
    return i18n.t(
      "api.notFound"
    );
  }

  if (status === 409) {
    return i18n.t(
      "api.conflict"
    );
  }

  if (status >= 500) {
    return i18n.t(
      "api.serverError"
    );
  }

  return i18n.t(
    "api.requestFailed"
  );
}

export async function apiFetch(
  path,
  {
    method = "GET",
    body,
    auth = true,
    signal,
    headers = {},
  } = {}
) {
  const isFormData =
    typeof FormData !==
      "undefined" &&
    body instanceof
      FormData;

  const finalHeaders = {
    Accept:
      "application/json",

    "Accept-Language":
      getPatientLanguage(),

    ...headers,
  };

  if (
    !isFormData &&
    body !== undefined
  ) {
    finalHeaders[
      "Content-Type"
    ] =
      "application/json";
  }

  if (auth) {
    const token =
      tokenStore
        .getToken();

    if (token) {
      finalHeaders
        .Authorization =
        `Bearer ${token}`;
    }
  }

  let response;

  try {
    response =
      await fetch(
        `${API_BASE_URL}${path}`,
        {
          method,

          headers:
            finalHeaders,

          body:
            body ===
            undefined
              ? undefined
              : isFormData
              ? body
              : JSON.stringify(
                  body
                ),

          signal,
        }
      );
  } catch (
    error
  ) {
    if (
      error.name ===
      "AbortError"
    ) {
      throw error;
    }

    throw new ApiError(
      i18n.t(
        "api.network"
      ),
      {
        isNetworkError:
          true,
      }
    );
  }

  if (
    response.status ===
      401 &&
    auth
  ) {
    tokenStore.clear();

    onUnauthorized?.();

    throw new ApiError(
      i18n.t(
        "api.sessionExpired"
      ),
      {
        status: 401,
      }
    );
  }

  if (
    response.status ===
    204
  ) {
    return null;
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  const data =
    contentType.includes(
      "application/json"
    )
      ? await response
          .json()
          .catch(
            () => null
          )
      : await response
          .text()
          .catch(
            () => null
          );

  if (!response.ok) {
    /*
     * English keeps detailed backend text.
     *
     * For a non-English patient UI, use a translated
     * transport-level error so raw backend English does
     * not leak into otherwise translated pages.
     */
    const patientLanguage =
      getPatientLanguage();

    const backendMessage =
      data?.title ||
      data?.message ||
      data?.error ||
      null;

    const message =
      patientLanguage ===
      "en"
        ? backendMessage ||
          `Request failed (${response.status})`
        : translatedHttpError(
            response.status
          );

    throw new ApiError(
      message,
      {
        status:
          response.status,

        errors:
          data?.errors,
      }
    );
  }

  return data;
}

export const api = {
  get: (
    path,
    opts
  ) =>
    apiFetch(
      path,
      {
        ...opts,
        method: "GET",
      }
    ),

  post: (
    path,
    body,
    opts
  ) =>
    apiFetch(
      path,
      {
        ...opts,
        method: "POST",
        body,
      }
    ),

  put: (
    path,
    body,
    opts
  ) =>
    apiFetch(
      path,
      {
        ...opts,
        method: "PUT",
        body,
      }
    ),

  patch: (
    path,
    body,
    opts
  ) =>
    apiFetch(
      path,
      {
        ...opts,
        method: "PATCH",
        body,
      }
    ),

  delete: (
    path,
    opts
  ) =>
    apiFetch(
      path,
      {
        ...opts,
        method: "DELETE",
      }
    ),
};
