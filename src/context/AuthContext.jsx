import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api/auth.js";
import { tokenStore, registerUnauthorizedHandler, ApiError } from "../services/api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [status, setStatus] = useState("idle"); // idle | loading | authenticated | unauthenticated
  const navigate = useNavigate();
  const hasBootstrapped = useRef(false);

  // Force a clean logout whenever the API client hits an un-refreshable 401.
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
      setStatus("unauthenticated");
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  // On first load, trust whatever's already in localStorage. There's no
  // GET /api/auth/me on the backend yet to re-hydrate/validate against, so
  // we can't tell a valid stored session from a stale one here — just
  // treat "has a token" as authenticated and let the first real API call
  // (via the 401 handler above) catch a genuinely expired/invalid token.
  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const token = tokenStore.getToken();
    const storedUser = tokenStore.getUser();
    if (!token || !storedUser) {
      tokenStore.clear();
      setUser(null);
      setStatus("unauthenticated");
      return;
    }
    setUser(storedUser);
    setStatus("authenticated");
  }, []);

  const login = useCallback(async ({ idNumber, password, role }) => {
    const data = await authApi.login({ idNumber, password, role });
    tokenStore.setSession({
      token: data.token,
      refreshToken: data.refreshToken,
      user: data.user,
    });
    setUser(data.user);
    setStatus("authenticated");
    return data.user;
  }, []);

  const registerPatient = useCallback(async (payload) => {
    // Returns the created (unverified) user; the caller routes to the
    // phone-verification screen next — no session is established yet.
    return authApi.registerPatient(payload);
  }, []);

  const verifyPhone = useCallback(async (payload) => {
    const data = await authApi.verifyPhone(payload);
    if (data?.token) {
      tokenStore.setSession({
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      setUser(data.user);
      setStatus("authenticated");
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    // No POST /api/auth/logout on the backend yet — clear the local
    // session only. (Note: the refresh token stays valid server-side
    // until it expires on its own, since there's no revoke endpoint.)
    tokenStore.clear();
    setUser(null);
    setStatus("unauthenticated");
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = {
    user,
    role: user?.role ?? null,
    isAuthenticated: status === "authenticated" && !!user,
    isLoading: status === "loading" || status === "idle",
    login,
    registerPatient,
    verifyPhone,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { ApiError };