import {
  api,
  API_BASE_URL,
} from "./client.js";

export const authApi = {
  login: ({
    idNumber,
    password,
  }) =>
    api.post(
      "/api/auth/login",
      {
        idNumber,
        password,
      },
      {
        auth: false,
      }
    ),

  getGoogleLoginUrl: () =>
    `${API_BASE_URL}/api/auth/google-login`,

  getMe: () =>
    api.get("/api/auth/me"),

  changePassword: (
    payload
  ) =>
    api.post(
      "/api/auth/change-password",
      payload
    ),

  registerPatient: (
    payload
  ) =>
    api.post(
      "/api/auth/register",
      payload,
      {
        auth: false,
      }
    ),

  verifyPhone: (
    userId,
    code
  ) => {
    const qs =
      new URLSearchParams({
        userId,
        code,
      }).toString();

    return api.post(
      `/api/auth/otp/verify?${qs}`,
      undefined,
      {
        auth: false,
      }
    );
  },

  resendCode: (
    userId
  ) => {
    const qs =
      new URLSearchParams({
        userId,
      }).toString();

    return api.post(
      `/api/auth/otp/generate?${qs}`,
      undefined,
      {
        auth: false,
      }
    );
  },
};
