import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../components/ui/Toast.jsx";
import { authApi } from "../../services/api/auth.js";
import { ApiError } from "../../services/api/client.js";
import { homePathForRole } from "../../routes/ProtectedRoute.jsx";

export default function PhoneVerificationPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [skipping, setSkipping] = useState(false);

  const inputsRef = useRef([]);

  const { verifyPhone, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, phone, idNumber, password } = location.state || {};

  const handleChange = (i, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[i] = value;
    setDigits(next);

    if (value && i < 5) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const code = digits.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error("Enter the full 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      await verifyPhone({ userId, code });
      navigate("/register/success");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Verification failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      await authApi.resendCode({ userId });
      toast.success("A new code has been sent.");
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't resend the code."
      );
    } finally {
      setResending(false);
    }
  };

  const handleSkip = async () => {
    if (!idNumber || !password) {
      toast.error(
        "Missing credentials to skip with — try registering again."
      );
      return;
    }

    setSkipping(true);

    try {
      const user = await login({
        idNumber,
        password,
        role: "Patient",
      });

      toast.success("Skipped verification (dev) — logged in.");
      navigate(homePathForRole(user.role), { replace: true });
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't log in."
      );
    } finally {
      setSkipping(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage: "url('/PillShelf.jpg')",
          filter: "blur(5px)",
        }}
      />

      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

      <main className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="mb-5 flex items-center justify-center gap-2.5"
        >
          <img
            src={logo}
            alt="PhilaLink"
            className="h-9 w-9"
          />

          <span className="text-xl font-bold text-white">
            Phila<span className="text-primary">Link</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/20 bg-white/95 p-7 shadow-2xl backdrop-blur-md sm:p-9">
          <div className="text-center">
            <span className="material-symbols-outlined mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container/10 text-3xl text-primary">
              sms
            </span>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Phone verification
            </p>

            <h1 className="mt-2 text-2xl font-bold text-on-surface">
              Verify your number
            </h1>

            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              Enter the 6-digit code we sent to{" "}
              <span className="font-semibold text-on-surface">
                {phone || "your phone"}
              </span>
              .
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7">
            <div className="flex justify-center gap-2 sm:gap-3">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={d}
                  onChange={(e) =>
                    handleChange(i, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Verification digit ${i + 1}`}
                  className="h-14 w-11 rounded-lg border border-outline-variant bg-white text-center text-xl font-bold text-on-surface transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-12"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="mt-6 w-full"
              loading={loading}
            >
              {loading ? "Verifying…" : "Verify & continue"}
            </Button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="mt-4 block w-full text-center text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            {resending
              ? "Sending…"
              : "Didn't get a code? Resend"}
          </button>

          <div className="mt-6 border-t border-dashed border-outline-variant pt-4 text-center">
            <p className="text-[11px] uppercase tracking-wide text-outline">
              Dev only
            </p>

            <button
              type="button"
              onClick={handleSkip}
              disabled={skipping}
              className="mt-1 text-sm font-medium text-outline underline hover:text-primary disabled:opacity-50"
            >
              {skipping
                ? "Skipping…"
                : "Skip verification & log in"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}