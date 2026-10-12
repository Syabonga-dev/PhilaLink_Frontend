import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  authApi,
} from "../services/api/auth.js";

import {
  tokenStore,
  registerUnauthorizedHandler,
  ApiError,
} from "../services/api/client.js";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(
      () =>
        tokenStore.getUser()
    );

  const [status, setStatus] =
    useState("idle");

  const navigate =
    useNavigate();

  const hasBootstrapped =
    useRef(false);

  // =====================================================
  // GLOBAL 401 HANDLING
  // =====================================================

  useEffect(() => {
    registerUnauthorizedHandler(
      () => {
        tokenStore.clear();

        setUser(null);

        setStatus(
          "unauthenticated"
        );

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }
    );
  }, [navigate]);

  // =====================================================
  // SESSION BOOTSTRAP
  // =====================================================

  useEffect(() => {
    if (
      hasBootstrapped.current
    ) {
      return;
    }

    hasBootstrapped.current =
      true;

    const bootstrap =
      async () => {
        const token =
          tokenStore.getToken();

        const cachedUser =
          tokenStore.getUser();

        if (!token) {
          tokenStore.clear();

          setUser(null);

          setStatus(
            "unauthenticated"
          );

          return;
        }

        setStatus(
          "loading"
        );

        try {
          /*
           * /api/auth/me is protected by live JWT
           * TokenVersion validation.
           */
          const currentUser =
            await authApi.getMe();

          tokenStore.setUser(
            currentUser
          );

          setUser(
            currentUser
          );

          setStatus(
            "authenticated"
          );
        } catch (error) {
          /*
           * A 401 means the JWT is expired, revoked,
           * invalid, or no longer matches the user's
           * current security state.
           */
          if (
            error instanceof
              ApiError &&
            error.status ===
              401
          ) {
            tokenStore.clear();

            setUser(null);

            setStatus(
              "unauthenticated"
            );

            return;
          }

          /*
           * Do not destroy a valid-looking local session
           * just because Render is waking up or the
           * network/backend temporarily fails.
           *
           * The next successful protected request will
           * still perform live JWT validation.
           */
          if (cachedUser) {
            setUser(
              cachedUser
            );

            setStatus(
              "authenticated"
            );

            return;
          }

          setUser(null);

          setStatus(
            "unauthenticated"
          );
        }
      };

    bootstrap();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login =
    useCallback(
      async ({
        idNumber,
        password,
      }) => {
        const data =
          await authApi.login({
            idNumber,
            password,
          });

        tokenStore.setSession({
          token:
            data.token,

          user:
            data.user,
        });

        setUser(
          data.user
        );

        setStatus(
          "authenticated"
        );

        return data.user;
      },
      []
    );

  // =====================================================
  // GOOGLE OAUTH LOGIN COMPLETION
  // =====================================================

  const completeGoogleLogin =
    useCallback(
      async (
        token
      ) => {
        if (
          !token ||
          typeof token !==
            "string"
        ) {
          throw new Error(
            "Google authentication token was not provided."
          );
        }

        setStatus(
          "loading"
        );

        /*
         * Remove any previous PhilaLink session before
         * accepting the new Google-authenticated JWT.
         */
        tokenStore.clear();

        tokenStore.setSession({
          token,
        });

        try {
          const currentUser =
            await authApi.getMe();

          tokenStore.setUser(
            currentUser
          );

          setUser(
            currentUser
          );

          setStatus(
            "authenticated"
          );

          return currentUser;
        } catch (error) {
          tokenStore.clear();

          setUser(null);

          setStatus(
            "unauthenticated"
          );

          throw error;
        }
      },
      []
    );

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const changePassword =
    useCallback(
      async (payload) => {
        const data =
          await authApi
            .changePassword(
              payload
            );

        /*
         * Password change increments TokenVersion.
         * The backend returns a fresh JWT containing the
         * new TokenVersion.
         */
        tokenStore.setSession({
          token:
            data.token,

          user:
            data.user,
        });

        setUser(
          data.user
        );

        setStatus(
          "authenticated"
        );

        return data.user;
      },
      []
    );

  // =====================================================
  // PATIENT REGISTRATION
  // =====================================================

  const registerPatient =
    useCallback(
      async (payload) =>
        authApi.registerPatient(
          payload
        ),
      []
    );

  // =====================================================
  // PHONE / ACCOUNT VERIFICATION
  // =====================================================

  const verifyPhone =
    useCallback(
      async ({
        userId,
        code,
      }) =>
        authApi.verifyPhone(
          userId,
          code
        ),
      []
    );

  // =====================================================
  // LOGOUT
  // =====================================================

  /*
   * Logout now performs real server-side revocation.
   *
   * The backend increments TokenVersion, meaning every
   * currently issued JWT for this account becomes invalid.
   *
   * Local cleanup still runs if the API cannot be reached
   * or the JWT was already expired/revoked.
   */
  const logout =
    useCallback(
      async () => {
        const token =
          tokenStore.getToken();

        try {
          if (token) {
            await authApi.logout();
          }
        } catch {
          /*
           * Never trap a user in the application simply
           * because the logout request failed.
           */
        } finally {
          tokenStore.clear();

          setUser(null);

          setStatus(
            "unauthenticated"
          );

          navigate(
            "/login",
            {
              replace: true,
            }
          );
        }
      },
      [navigate]
    );

  // =====================================================
  // LOCAL USER UPDATE
  // =====================================================

  const updateUser =
    useCallback(
      (nextUser) => {
        tokenStore.setUser(
          nextUser
        );

        setUser(
          nextUser
        );
      },
      []
    );

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    user,

    role:
      user?.role ??
      null,

    mustChangePassword:
      user?.mustChangePassword ===
      true,

    isAuthenticated:
      status ===
        "authenticated" &&
      !!user,

    isLoading:
      status ===
        "loading" ||
      status ===
        "idle",

    login,

    completeGoogleLogin,

    logout,

    changePassword,

    registerPatient,

    verifyPhone,

    setUser:
      updateUser,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}

export { ApiError };