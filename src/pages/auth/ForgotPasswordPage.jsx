import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import logo2 from "../../assets/logo2.png";

import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

import {
  useToast,
} from "../../components/ui/Toast.jsx";

import {
  ApiError,
} from "../../services/api/client.js";

import {
  authApi,
} from "../../services/api/auth.js";

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
  const requirements =
    getPasswordRequirements(
      password
    );

  return Object.values(
    requirements
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

export default function ForgotPasswordPage() {
  const [
    step,
    setStep,
  ] = useState(
    "request"
  );

  const [
    identifier,
    setIdentifier,
  ] = useState("");

  const [
    code,
    setCode,
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
    showPassword,
    setShowPassword,
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
    resendLoading,
    setResendLoading,
  ] = useState(false);

  const [
    resendSeconds,
    setResendSeconds,
  ] = useState(0);

  const toast =
    useToast();

  const navigate =
    useNavigate();

  const requirements =
    getPasswordRequirements(
      newPassword
    );

  // =====================================================
  // RESEND TIMER
  // =====================================================

  useEffect(() => {
    if (
      resendSeconds <=
      0
    ) {
      return undefined;
    }

    const timer =
      window.setInterval(
        () => {
          setResendSeconds(
            (current) =>
              Math.max(
                0,
                current - 1
              )
          );
        },
        1000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    resendSeconds,
  ]);

  // =====================================================
  // IDENTIFIER VALIDATION
  // =====================================================

  const validateIdentifier =
    () => {
      const value =
        identifier.trim();

      if (!value) {
        return
          "Enter your email address or SA ID number.";
      }

      const isIdNumber =
        /^\d{13}$/.test(
          value
        );

      const isEmail =
        /^\S+@\S+\.\S+$/.test(
          value
        );

      if (
        !isIdNumber &&
        !isEmail
      ) {
        return
          "Enter a valid email address or 13-digit SA ID number.";
      }

      return null;
    };

  // =====================================================
  // REQUEST RESET CODE
  // =====================================================

  const handleRequest =
    async (
      event
    ) => {
      event.preventDefault();

      const identifierError =
        validateIdentifier();

      if (
        identifierError
      ) {
        setErrors({
          identifier:
            identifierError,
        });

        return;
      }

      setErrors({});

      setLoading(
        true
      );

      try {
        await authApi
          .requestPasswordReset(
            identifier.trim()
          );

        setStep(
          "reset"
        );

        setResendSeconds(
          60
        );

        toast.success(
          "If an account matches those details, a verification code has been sent."
        );
      } catch (
        error
      ) {
        if (
          error instanceof
          ApiError
        ) {
          toast.error(
            error.message
          );
        } else {
          toast.error(
            "We couldn't start the password reset. Please try again."
          );
        }
      } finally {
        setLoading(
          false
        );
      }
    };

  // =====================================================
  // RESET PASSWORD VALIDATION
  // =====================================================

  const validateReset =
    () => {
      const next = {};

      if (
        !/^\d{6}$/.test(
          code
        )
      ) {
        next.code =
          "Enter the 6-digit verification code.";
      }

      if (
        !passwordIsValid(
          newPassword
        )
      ) {
        next.newPassword =
          "Password must meet all the requirements below.";
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

      setErrors(
        next
      );

      return (
        Object.keys(
          next
        ).length ===
        0
      );
    };

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleReset =
    async (
      event
    ) => {
      event.preventDefault();

      if (
        !validateReset()
      ) {
        return;
      }

      setLoading(
        true
      );

      try {
        await authApi
          .resetPassword({
            identifier:
              identifier.trim(),

            code,

            newPassword,

            confirmNewPassword,
          });

        toast.success(
          "Your password has been reset. You can now log in with your new password."
        );

        navigate(
          "/login",
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
          toast.error(
            error.message
          );
        } else {
          toast.error(
            "We couldn't reset your password. Please try again."
          );
        }
      } finally {
        setLoading(
          false
        );
      }
    };

  // =====================================================
  // RESEND CODE
  // =====================================================

  const handleResend =
    async () => {
      if (
        resendLoading ||
        resendSeconds >
          0
      ) {
        return;
      }

      setResendLoading(
        true
      );

      try {
        await authApi
          .requestPasswordReset(
            identifier.trim()
          );

        setResendSeconds(
          60
        );

        toast.success(
          "If an account matches those details, a new verification code has been sent."
        );
      } catch (
        error
      ) {
        if (
          error instanceof
          ApiError
        ) {
          toast.error(
            error.message
          );
        } else {
          toast.error(
            "We couldn't resend the verification code. Please try again."
          );
        }
      } finally {
        setResendLoading(
          false
        );
      }
    };

  // =====================================================
  // CHANGE IDENTIFIER
  // =====================================================

  const handleChangeIdentifier =
    () => {
      setStep(
        "request"
      );

      setCode("");

      setNewPassword("");

      setConfirmNewPassword("");

      setErrors({});

      setResendSeconds(
        0
      );
    };

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
            {/* REQUEST STEP */}
            {/* ============================= */}

            {step ===
              "request" && (
              <>
                <div className="login-heading">
                  <p className="login-eyebrow">
                    PASSWORD RECOVERY
                  </p>

                  <h1>
                    Forgot your password?
                  </h1>

                  <p>
                    Enter the email
                    address or SA ID
                    number linked to
                    your PhilaLink
                    account. We'll send
                    a 6-digit
                    verification code
                    to your registered
                    email address.
                  </p>
                </div>

                <form
                  onSubmit={
                    handleRequest
                  }
                  className="login-form"
                  noValidate
                >
                  <Input
                    label="Email or SA ID number"
                    name="identifier"
                    value={
                      identifier
                    }
                    onChange={(
                      event
                    ) => {
                      setIdentifier(
                        event.target
                          .value
                      );

                      setErrors(
                        (current) => ({
                          ...current,

                          identifier:
                            undefined,
                        })
                      );
                    }}
                    error={
                      errors.identifier
                    }
                    placeholder="Email address or 13-digit ID"
                    autoComplete="username"
                  />

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
                      ? "Sending code…"
                      : "Send verification code"}
                  </Button>
                </form>

                <div className="login-register">
                  <span>
                    Remembered your
                    password?
                  </span>

                  <Link to="/login">
                    Log in
                  </Link>
                </div>
              </>
            )}

            {/* ============================= */}
            {/* RESET STEP */}
            {/* ============================= */}

            {step ===
              "reset" && (
              <>
                <div className="login-heading">
                  <p className="login-eyebrow">
                    PASSWORD RESET
                  </p>

                  <h1>
                    Create a new password.
                  </h1>

                  <p>
                    Enter the 6-digit
                    verification code
                    sent to your
                    registered email,
                    then choose your new
                    password.
                  </p>
                </div>

                <form
                  onSubmit={
                    handleReset
                  }
                  className="login-form"
                  noValidate
                >
                  <Input
                    label="Verification code"
                    name="code"
                    value={
                      code
                    }
                    onChange={(
                      event
                    ) => {
                      const value =
                        event.target
                          .value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            6
                          );

                      setCode(
                        value
                      );

                      setErrors(
                        (current) => ({
                          ...current,

                          code:
                            undefined,
                        })
                      );
                    }}
                    error={
                      errors.code
                    }
                    placeholder="000000"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={
                      6
                    }
                  />

                  <div className="login-options">
                    <button
                      type="button"
                      className="forgot-password"
                      onClick={
                        handleChangeIdentifier
                      }
                    >
                      Use different details
                    </button>

                    <button
                      type="button"
                      className="forgot-password"
                      onClick={
                        handleResend
                      }
                      disabled={
                        resendLoading ||
                        resendSeconds >
                          0
                      }
                    >
                      {resendLoading
                        ? "Sending…"
                        : resendSeconds >
                            0
                          ? `Resend in ${resendSeconds}s`
                          : "Resend code"}
                    </button>
                  </div>

                  <Input
                    label="New password"
                    name="newPassword"
                    type={
                      showPassword
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
                        (current) => ({
                          ...current,

                          newPassword:
                            undefined,
                        })
                      );
                    }}
                    error={
                      errors.newPassword
                    }
                    placeholder="••••••••••••"
                    autoComplete="new-password"
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
                        (current) => ({
                          ...current,

                          confirmNewPassword:
                            undefined,
                        })
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
                            ? "Hide password"
                            : "Show password"
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
                          requirements.length
                        }
                      >
                        At least 12 characters
                      </PasswordRequirement>

                      <PasswordRequirement
                        met={
                          requirements.uppercase
                        }
                      >
                        1 uppercase letter
                      </PasswordRequirement>

                      <PasswordRequirement
                        met={
                          requirements.lowercase
                        }
                      >
                        1 lowercase letter
                      </PasswordRequirement>

                      <PasswordRequirement
                        met={
                          requirements.number
                        }
                      >
                        1 number
                      </PasswordRequirement>

                      <PasswordRequirement
                        met={
                          requirements.special
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
                      ? "Resetting password…"
                      : "Reset password"}
                  </Button>
                </form>

                <div className="login-register">
                  <Link to="/login">
                    Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
