import {
  api,
  API_BASE_URL,
} from "./client.js";

export const authApi = {
  // =====================================================
  // LOGIN
  // =====================================================

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

  // =====================================================
  // GOOGLE OAUTH
  // =====================================================

  getGoogleLoginUrl: () =>
    `${API_BASE_URL}/api/auth/google-login`,

  // =====================================================
  // CURRENT USER
  // =====================================================

  getMe: () =>
    api.get(
      "/api/auth/me"
    ),

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  changePassword: (
    payload
  ) =>
    api.post(
      "/api/auth/change-password",
      payload
    ),

  // =====================================================
  // PATIENT REGISTRATION
  // =====================================================

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

  // =====================================================
  // ACCOUNT VERIFICATION OTP
  // =====================================================

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

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  requestPasswordReset: (
    identifier
  ) =>
    api.post(
      "/api/auth/password-reset/request",
      {
        identifier,
      },
      {
        auth: false,
      }
    ),

  resetPassword: ({
    identifier,
    code,
    newPassword,
    confirmNewPassword,
  }) =>
    api.post(
      "/api/auth/password-reset/reset",
      {
        identifier,
        code,
        newPassword,
        confirmNewPassword,
      },
      {
        auth: false,
      }
    ),
};
