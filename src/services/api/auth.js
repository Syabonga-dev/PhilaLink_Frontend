import { api } from "./client.js";

// Endpoints assumed on the ASP.NET Core side. Adjust the paths here if your
// controllers use different routes — this is the only file that needs to
// change since every screen calls through these functions.

export const authApi = {
  /** POST /api/auth/login  { idNumber, password, role } -> { token, refreshToken, user } */
  login: (payload) => api.post("/api/auth/login", payload, { auth: false }),

  /** POST /api/auth/register — the only public self-registration route.
   *  Nurse and Proxy accounts are created by an Admin via adminApi.createStaff. */
  registerPatient: (payload) =>
    api.post("/api/auth/register", payload, { auth: false }),

  /** POST /api/auth/otp/verify  { userId, code } */
  verifyPhone: (payload) => api.post("/api/auth/otp/verify", payload, { auth: false }),

  /** POST /api/auth/otp/generate  { userId } */
  resendCode: (payload) => api.post("/api/auth/otp/generate", payload, { auth: false }),

  // No `me` or `logout` action exists on the Auth controller yet.
  // Session hydration and logout are handled purely client-side in
  // AuthContext (trusting the locally stored user/token) until those
  // backend routes exist.
};