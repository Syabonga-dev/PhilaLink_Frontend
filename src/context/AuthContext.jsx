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
import { authApi } from "../services/api/auth.js";
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

        if (!token) {
          tokenStore.clear();

          setUser(null);

          setStatus(
            "unauthenticated"
          );

          return;
        }

        setStatus("loading");

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
        } catch {
          tokenStore.clear();

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