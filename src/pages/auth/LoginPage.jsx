import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import Button from "../../components/ui/Button.jsx";

import Input from "../../components/ui/Input.jsx";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  useToast,
} from "../../components/ui/Toast.jsx";

import {
  ApiError,
} from "../../services/api/client.js";

import {
  authApi,
} from "../../services/api/auth.js";

import {
  homePathForRole,
} from "../../routes/ProtectedRoute.jsx";

import NavigationBar from "../../components/layout/NavigationBar.jsx";

import "./LoginPage.css";

import logo2 from "../../assets/logo2.png";

// =====================================================
// GOOGLE ICON
// =====================================================

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.6 0-4.81-1.76-5.6-4.13H3.05v2.61A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.4 13.87A6.02 6.02 0 0 1 6.09 12c0-.65.11-1.28.31-1.87V7.52H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.48l3.35-2.61Z"
      />

      <path
        fill="#EA4335"
        d="M12 6c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.95 5.52l3.35 2.61C7.19 7.76 9.4 6 12 6Z"
      />
    </svg>
  );
}

// =====================================================
// LOGIN PAGE
// =====================================================

export default function LoginPage() {
  const [
    idNumber,
    setIdNumber,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    googleLoading,
    setGoogleLoading,
  ] = useState(false);

  const [
    idError,
    setIdError,
  ] = useState("");

  const {
    login,
  } = useAuth();

  const toast =
    useToast();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate =
    () => {
      const next = {};

      if (
        !idNumber.trim()
      ) {
        next.idNumber =
          "Enter your ID number.";
      }

      if (
        !password
      ) {
        next.password =
          "Enter your password.";
      }

      setErrors(
        next
      );

      return (
        Object.keys(
          next
        ).length === 0
      );
    };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      setIdError("");

      if (
        !/^\d{13}$/.test(
          idNumber.trim()
        )
      ) {
        setIdError(
          "ID must be 13 digits and contain numbers only."
        );

        return;
      }

      if (
        !validate()
      ) {
        return;
      }

      setLoading(
        true
      );

      try {
        const user =
          await login({
            idNumber:
              idNumber.trim(),

            password,
          });

        toast.success(
          `Welcome back, ${
            user.fullName ||
            user.name ||
            "there"
          }.`
        );

        const destination =
          location.state
            ?.from
            ?.pathname ||
          homePathForRole(
            user.role
          );

        navigate(
          destination,
          {
            replace: true,
          }
        );
      } catch (
        error
      ) {
        if (
          error instanceof
          ApiError
        ) {
          if (
            error.status ===
            401
          ) {
            toast.error(
              "Incorrect ID number or password."
            );
          } else {
            toast.error(
              error.message
            );
          }
        } else {
          toast.error(
            "Something went wrong. Please try again."
          );
        }
      } finally {
        setLoading(
          false
        );
      }
    };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin =
    () => {
      setGoogleLoading(
        true
      );

      /*
       * Google OAuth begins at the backend.
       * The Google Client Secret never enters
       * the browser.
       */
      window.location.assign(
        authApi
          .getGoogleLoginUrl()
      );
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <NavigationBar />

      <div className="login-page">
        <div className="login-background" />

        <div className="login-overlay" />

        <main className="login-content">
          <div className="login-card">

            {/* ============================= */}
            {/* BRAND */}
            {/* ============================= */}

            <div className="login-brand">
              <img
                src={
                  logo2
                }
                alt="PhilaLink logo"
              />

              <div>
                <span>
                  Phila
                </span>
                Link
              </div>
            </div>

            {/* ============================= */}
            {/* HEADING */}
            {/* ============================= */}

            <div className="login-heading">
              <h1>
                Welcome back.
              </h1>

              <p>
                Sign in to access your
                PhilaLink healthcare
                dashboard.
              </p>
            </div>

            {/* ============================= */}
            {/* LOGIN FORM */}
            {/* ============================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="login-form"
              noValidate
            >
              <Input
                label="ID number"
                name="idNumber"
                value={
                  idNumber
                }
                onChange={(
                  event
                ) => {
                  const value =
                    event.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        13
                      );

                  setIdNumber(
                    value
                  );

                  setIdError(
                    ""
                  );

                  setErrors(
                    (current) => ({
                      ...current,

                      idNumber:
                        undefined,
                    })
                  );
                }}
                error={
                  errors.idNumber
                }
                placeholder="e.g. 9001015800082"
                autoComplete="username"
                inputMode="numeric"
                maxLength={
                  13
                }
              />

              {idError && (
                <span id="invalid-id">
                  {idError}
                </span>
              )}

              <Input
                label="Password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  password
                }
                onChange={(
                  event
                ) => {
                  setPassword(
                    event.target.value
                  );

                  setErrors(
                    (current) => ({
                      ...current,

                      password:
                        undefined,
                    })
                  );
                }}
                error={
                  errors.password
                }
                placeholder="••••••••"
                autoComplete="current-password"
                endAdornment={
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-md text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/30"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    aria-pressed={
                      showPassword
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={
                          18
                        }
                      />
                    ) : (
                      <Eye
                        size={
                          18
                        }
                      />
                    )}
                  </button>
                }
              />

              {/* ============================= */}
              {/* LOGIN OPTIONS */}
              {/* ============================= */}

              <div className="login-options">
                <label>
                  <input
                    type="checkbox"
                  />

                  <span>
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    navigate(
                      "/forgot-password"
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="login-submit"
                loading={
                  loading
                }
                disabled={
                  loading ||
                  googleLoading
                }
              >
                {loading
                  ? "Signing in…"
                  : "Log in"}
              </Button>
            </form>

            {/* ============================= */}
            {/* GOOGLE */}
            {/* ============================= */}

            <div className="login-divider">
              <span>
                or
              </span>
            </div>

            <button
              type="button"
              className="login-google"
              onClick={
                handleGoogleLogin
              }
              disabled={
                loading ||
                googleLoading
              }
            >
              {googleLoading ? (
                <span className="login-google-spinner" />
              ) : (
                <GoogleIcon />
              )}

              <span>
                {googleLoading
                  ? "Connecting to Google…"
                  : "Continue with Google"}
              </span>
            </button>

            {/* ============================= */}
            {/* REGISTER */}
            {/* ============================= */}

            <div className="login-register">
              <span>
                New patient?
              </span>

              <Link to="/register">
                Create an account
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
