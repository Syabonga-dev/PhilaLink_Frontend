import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import logo2 from "../../assets/logo2.png";

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
  homePathForRole,
} from "../../routes/ProtectedRoute.jsx";

import NavigationBar from "../../components/layout/NavigationBar.jsx";

import "./LoginPage.css";
import "./RegisterPage.css";

// =====================================================
// PASSWORD POLICY
// Must remain consistent with the backend.
// =====================================================

function getPasswordRequirements(
  password
) {
  return {
    length:
      password.length >=
      12,

    uppercase:
      /[A-Z]/.test(
        password
      ),

    lowercase:
      /[a-z]/.test(
        password
      ),

    number:
      /\d/.test(
        password
      ),

    special:
      /[^A-Za-z0-9]/.test(
        password
      ),
  };
}

function passwordIsValid(
  password
) {
  return Object.values(
    getPasswordRequirements(
      password
    )
  ).every(Boolean);
}

function PasswordRequirement({
  met,
  children,
}) {
  return (
    <div
      className={
        met
          ? "password-requirement met"
          : "password-requirement"
      }
    >
      <span
        className="password-requirement-icon"
        aria-hidden="true"
      >
        {met
          ? "✓"
          : "○"}
      </span>

      <span>
        {children}
      </span>
    </div>
  );
}

// =====================================================
// CHANGE PASSWORD PAGE
// =====================================================

export default function ChangePasswordPage() {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmNewPassword,
    setConfirmNewPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
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
    submitError,
    setSubmitError,
  ] = useState("");

  const {
    changePassword,
    logout,
  } =
    useAuth();

  const toast =
    useToast();

  const navigate =
    useNavigate();

  const requirements =
    getPasswordRequirements(
      newPassword
    );

  // =====================================================
  // VALIDATION
  // =====================================================

  function validate() {
    const next = {};

    if (
      !currentPassword
    ) {
      next.currentPassword =
        "Enter your current password.";
    }

    if (
      !newPassword
    ) {
      next.newPassword =
        "Enter your new password.";
    } else if (
      !passwordIsValid(
        newPassword
      )
    ) {
      next.newPassword =
        "Your new password must meet all the requirements below.";
    }

    if (
      !confirmNewPassword
    ) {
      next.confirmNewPassword =
        "Confirm your new password.";
    } else if (
      newPassword !==
        confirmNewPassword
    ) {
      next.confirmNewPassword =
        "Passwords don't match.";
    }

    if (
      currentPassword &&
      newPassword &&
      currentPassword ===
        newPassword
    ) {
      next.newPassword =
        "Your new password must be different from your current password.";
    }

    setErrors(
      next
    );

    return (
      Object.keys(
        next
      ).length ===
      0
    );
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setSubmitError("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(
        true
      );

      const updatedUser =
        await changePassword({
          currentPassword,

          newPassword,

          confirmNewPassword,
        });

      toast.success(
        "Your password has been changed successfully."
      );

      navigate(
        homePathForRole(
          updatedUser?.role
        ),
        {
          replace:
            true,
        }
      );
    } catch (
      error
    ) {
      console.error(
        "Password change failed:",
        error
      );

      if (
        error instanceof
        ApiError
      ) {
        setSubmitError(
          error.message ||
            "We could not change your password."
        );
      } else {
        setSubmitError(
          "We could not change your password. Please try again."
        );
      }
    } finally {
      setLoading(
        false
      );
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {
    logout();
  }

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
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
                  <KeyRound
                    size={
                      22
                    }
                  />
                </div>
              </div>

              <p className="login-eyebrow">
                ACCOUNT SECURITY
              </p>

              <h1>
                Change your password.
              </h1>

              <p>
                Your account requires
                a new password before
                you can continue to
                PhilaLink.
              </p>
            </div>

            {/* ============================= */}
            {/* ERROR */}
            {/* ============================= */}

            {submitError && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">
                  {
                    submitError
                  }
                </p>
              </div>
            )}

            {/* ============================= */}
            {/* FORM */}
            {/* ============================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="login-form"
              noValidate
            >
              <Input
                label="Current password"
                name="currentPassword"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={
                  currentPassword
                }
                onChange={(
                  event
                ) => {
                  setCurrentPassword(
                    event.target
                      .value
                  );

                  setErrors(
                    (
                      current
                    ) => ({
                      ...current,

                      currentPassword:
                        undefined,
                    })
                  );

                  setSubmitError(
                    ""
                  );
                }}
                error={
                  errors
                    .currentPassword
                }
                placeholder="••••••••••••"
                autoComplete="current-password"
                endAdornment={
                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-md text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/30"
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? (
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

              <Input
                label="New password"
                name="newPassword"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={
                  newPassword
                }
                onChange={(
                  event
                ) => {
                  setNewPassword(
                    event.target
                      .value
                  );

                  setErrors(
                    (
                      current
                    ) => ({
                      ...current,

                      newPassword:
                        undefined,
                    })
                  );

                  setSubmitError(
                    ""
                  );
                }}
                error={
                  errors
                    .newPassword
                }
                placeholder="••••••••••••"
                autoComplete="new-password"
                endAdornment={
                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-md text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/30"
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? (
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

              <Input
                label="Confirm new password"
                name="confirmNewPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  confirmNewPassword
                }
                onChange={(
                  event
                ) => {
                  setConfirmNewPassword(
                    event.target
                      .value
                  );

                  setErrors(
                    (
                      current
                    ) => ({
                      ...current,

                      confirmNewPassword:
                        undefined,
                    })
                  );

                  setSubmitError(
                    ""
                  );
                }}
                error={
                  errors
                    .confirmNewPassword
                }
                placeholder="••••••••••••"
                autoComplete="new-password"
                endAdornment={
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-md text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/30"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmed password"
                        : "Show confirmed password"
                    }
                  >
                    {showConfirmPassword ? (
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
              {/* PASSWORD REQUIREMENTS */}
              {/* ============================= */}

              <div
                className="password-requirements"
                aria-live="polite"
              >
                <p className="password-requirements-title">
                  Your password must contain:
                </p>

                <div className="password-requirements-grid">
                  <PasswordRequirement
                    met={
                      requirements
                        .length
                    }
                  >
                    At least 12 characters
                  </PasswordRequirement>

                  <PasswordRequirement
                    met={
                      requirements
                        .uppercase
                    }
                  >
                    1 uppercase letter
                  </PasswordRequirement>

                  <PasswordRequirement
                    met={
                      requirements
                        .lowercase
                    }
                  >
                    1 lowercase letter
                  </PasswordRequirement>

                  <PasswordRequirement
                    met={
                      requirements
                        .number
                    }
                  >
                    1 number
                  </PasswordRequirement>

                  <PasswordRequirement
                    met={
                      requirements
                        .special
                    }
                  >
                    1 special character
                  </PasswordRequirement>
                </div>
              </div>

              <Button
                type="submit"
                className="login-submit"
                loading={
                  loading
                }
                disabled={
                  loading
                }
              >
                {loading
                  ? "Changing password…"
                  : "Change password and continue"}
              </Button>
            </form>

            {/* ============================= */}
            {/* LOGOUT */}
            {/* ============================= */}

            <div className="login-register">
              <span>
                Not your account?
              </span>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="font-medium text-[#0f766e] hover:underline"
              >
                Sign out
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}