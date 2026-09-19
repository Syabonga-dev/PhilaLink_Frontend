import {
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../../assets/logo.png";

import Button from "../../components/ui/Button.jsx";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  useToast,
} from "../../components/ui/Toast.jsx";

import {
  authApi,
} from "../../services/api/auth.js";

import {
  ApiError,
} from "../../services/api/client.js";

function maskEmail(
  email
) {
  if (
    !email ||
    !email.includes(
      "@"
    )
  ) {
    return "your email address";
  }

  const [
    name,
    domain,
  ] =
    email.split(
      "@"
    );

  if (
    !name ||
    !domain
  ) {
    return email;
  }

  const visibleCharacters =
    name.slice(
      0,
      Math.min(
        2,
        name.length
      )
    );

  const hiddenCharacters =
    "*".repeat(
      Math.max(
        1,
        name.length -
          visibleCharacters.length
      )
    );

  return (
    `${visibleCharacters}` +
    `${hiddenCharacters}` +
    `@${domain}`
  );
}

export default function PhoneVerificationPage() {
  const [
    digits,
    setDigits,
  ] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [
    loading,
    setLoading,
  ] = useState(
    false
  );

  const [
    resending,
    setResending,
  ] = useState(
    false
  );

  const inputsRef =
    useRef([]);

  const {
    verifyPhone,
  } = useAuth();

  const toast =
    useToast();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    userId,
    email,
  } =
    location.state ||
    {};

  const handleChange =
    (
      index,
      value
    ) => {
      if (
        !/^\d?$/.test(
          value
        )
      ) {
        return;
      }

      const next = [
        ...digits,
      ];

      next[index] =
        value;

      setDigits(
        next
      );

      if (
        value &&
        index <
          5
      ) {
        inputsRef
          .current[
            index +
              1
          ]?.focus();
      }
    };

  const handleKeyDown =
    (
      index,
      event
    ) => {
      if (
        event.key ===
          "Backspace" &&
        !digits[index] &&
        index >
          0
      ) {
        inputsRef
          .current[
            index -
              1
          ]?.focus();
      }
    };

  const handlePaste =
    (
      event
    ) => {
      const pasted =
        event
          .clipboardData
          .getData(
            "text"
          )
          .replace(
            /\D/g,
            ""
          )
          .slice(
            0,
            6
          );

      if (
        !pasted
      ) {
        return;
      }

      event.preventDefault();

      const next =
        Array(6)
          .fill("");

      pasted
        .split("")
        .forEach(
          (
            value,
            index
          ) => {
            next[index] =
              value;
          }
        );

      setDigits(
        next
      );

      const focusIndex =
        Math.min(
          pasted.length,
          5
        );

      inputsRef
        .current[
          focusIndex
        ]?.focus();
    };

  const code =
    digits.join("");

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      if (
        !userId
      ) {
        toast.error(
          "Verification details are missing. Please register again."
        );

        navigate(
          "/register",
          {
            replace:
              true,
          }
        );

        return;
      }

      if (
        code.length !==
          6
      ) {
        toast.error(
          "Enter the full 6-digit code."
        );

        return;
      }

      setLoading(
        true
      );

      try {
        await verifyPhone({
          userId,
          code,
        });

        toast.success(
          "Your account has been verified."
        );

        navigate(
          "/register/success",
          {
            replace:
              true,
          }
        );
      } catch (
        error
      ) {
        toast.error(
          error instanceof
            ApiError
            ? error.message
            : "Verification failed. Try again."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  const handleResend =
    async () => {
      if (
        !userId
      ) {
        toast.error(
          "Verification details are missing. Please register again."
        );

        return;
      }

      setResending(
        true
      );

      try {
        await authApi
          .resendCode(
            userId
          );

        setDigits([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        inputsRef
          .current[
            0
          ]?.focus();

        toast.success(
          "A new verification code has been sent to your email."
        );
      } catch (
        error
      ) {
        toast.error(
          error instanceof
            ApiError
            ? error.message
            : "Couldn't resend the verification code."
        );
      } finally {
        setResending(
          false
        );
      }
    };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/PillShelf.jpg')",

          filter:
            "blur(5px)",
        }}
      />

      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

      <main className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="mb-5 flex items-center justify-center gap-2.5"
        >
          <img
            src={
              logo
            }
            alt="PhilaLink"
            className="h-9 w-9"
          />

          <span className="text-xl font-bold text-white">
            Phila
            <span className="text-primary">
              Link
            </span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/20 bg-white/95 p-7 shadow-2xl backdrop-blur-md sm:p-9">
          <div className="text-center">
            <span className="material-symbols-outlined mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container/10 text-3xl text-primary">
              mail
            </span>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Email
              verification
            </p>

            <h1 className="mt-2 text-2xl font-bold text-on-surface">
              Verify your
              account
            </h1>

            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              Enter the
              6-digit code
              sent to{" "}
              <span className="font-semibold text-on-surface">
                {maskEmail(
                  email
                )}
              </span>
              .
            </p>

            <p className="mt-2 text-xs text-on-surface-variant">
              The code
              expires after
              5 minutes.
            </p>
          </div>

          {!userId ? (
            <div className="mt-7 rounded-lg border border-error/30 bg-error/5 p-4 text-center">
              <p className="text-sm font-semibold text-on-surface">
                Verification
                session
                missing
              </p>

              <p className="mt-1 text-xs text-on-surface-variant">
                Return to
                registration
                and start
                again.
              </p>

              <Button
                as={Link}
                to="/register"
                className="mt-4 w-full"
              >
                Back to
                registration
              </Button>
            </div>
          ) : (
            <>
              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-7"
              >
                <div
                  className="flex justify-center gap-2 sm:gap-3"
                  onPaste={
                    handlePaste
                  }
                >
                  {digits.map(
                    (
                      digit,
                      index
                    ) => (
                      <input
                        key={
                          index
                        }
                        ref={(
                          element
                        ) => {
                          inputsRef.current[
                            index
                          ] =
                            element;
                        }}
                        value={
                          digit
                        }
                        onChange={(
                          event
                        ) =>
                          handleChange(
                            index,
                            event
                              .target
                              .value
                          )
                        }
                        onKeyDown={(
                          event
                        ) =>
                          handleKeyDown(
                            index,
                            event
                          )
                        }
                        inputMode="numeric"
                        autoComplete={
                          index ===
                          0
                            ? "one-time-code"
                            : "off"
                        }
                        maxLength={
                          1
                        }
                        aria-label={`Verification digit ${
                          index +
                          1
                        }`}
                        className="h-14 w-11 rounded-lg border border-outline-variant bg-white text-center text-xl font-bold text-on-surface transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-12"
                      />
                    )
                  )}
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full"
                  loading={
                    loading
                  }
                  disabled={
                    code.length !==
                    6
                  }
                >
                  {loading
                    ? "Verifying…"
                    : "Verify & continue"}
                </Button>
              </form>

              <button
                type="button"
                onClick={
                  handleResend
                }
                disabled={
                  resending ||
                  loading
                }
                className="mt-4 block w-full text-center text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resending
                  ? "Sending…"
                  : "Didn't get the email? Resend code"}
              </button>

              <p className="mt-6 text-center text-xs leading-5 text-on-surface-variant">
                For your
                security,
                account
                verification
                must be
                completed
                before
                logging in.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
