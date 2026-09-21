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
           * A 401 means the token is no longer valid.
           * apiFetch already clears the session and invokes
           * the unauthorized handler, but keep this branch
           * explicit so authentication behaviour remains
           * predictable.
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
           * just because Render is waking up, the network
           * is temporarily unavailable, or the API returns
           * a transient server error.
           *
           * Protected API endpoints still validate the JWT.
           * If the token really is expired, the first 401
           * response will clear the session normally.
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

          /*
           * There is a token but no cached user information.
           * Without a confirmed user we cannot safely build
           * an authenticated UI, but we also avoid deleting
           * the token because the failure may be temporary.
           */
          setUser(null);

          setStatus(
            "unauthenticated"
          );
        }
      };

    bootstrap();
  }, []);

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
         * Remove any previous session before accepting
         * the new token returned by the backend.
         */
        tokenStore.clear();

        tokenStore.setSession({
          token,
        });

        try {
          /*
           * Do not trust user information from the browser
           * redirect. Ask the authenticated backend for the
           * current PhilaLink user instead.
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

  const changePassword =
    useCallback(
      async (payload) => {
        const data =
          await authApi.changePassword(
            payload
          );

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

  const registerPatient =
    useCallback(
      async (payload) =>
        authApi.registerPatient(
          payload
        ),
      []
    );

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

  const logout =
    useCallback(() => {
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
    }, [navigate]);

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