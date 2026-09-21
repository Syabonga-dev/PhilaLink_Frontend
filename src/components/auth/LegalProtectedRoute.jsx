import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  getLegalStatus,
} from "../../services/legalDocumentService.js";

import Spinner from "../ui/Spinner.jsx";

// =====================================================
// LEGAL PROTECTED ROUTE
// =====================================================

export default function LegalProtectedRoute() {
  const location =
    useLocation();

  const {
    isAuthenticated,
    isLoading,
    mustChangePassword,
  } = useAuth();

  const [
    status,
    setStatus,
  ] = useState(
    "checking"
  );

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let cancelled =
      false;

    const check =
      async () => {
        if (
          isLoading
        ) {
          return;
        }

        if (
          !isAuthenticated
        ) {
          setStatus(
            "unauthenticated"
          );

          return;
        }

        if (
          mustChangePassword
        ) {
          setStatus(
            "password-change"
          );

          return;
        }

        setStatus(
          "checking"
        );

        setError("");

        try {
          const result =
            await getLegalStatus();

          if (
            cancelled
          ) {
            return;
          }

          setStatus(
            result
              ?.requiresAction ===
            true
              ? "legal-required"
              : "allowed"
          );
        } catch (
          requestError
        ) {
          if (
            cancelled
          ) {
            return;
          }

          if (
            requestError
              ?.status ===
            401
          ) {
            setStatus(
              "unauthenticated"
            );

            return;
          }

          setError(
            requestError
              ?.message ||
              "PhilaLink could not verify your legal document status."
          );

          /*
           * Fail closed.
           *
           * Protected pages must not open if
           * PhilaLink cannot verify the user's
           * legal-document status.
           */
          setStatus(
            "error"
          );
        }
      };

    check();

    return () => {
      cancelled =
        true;
    };
  }, [
    isAuthenticated,
    isLoading,
    mustChangePassword,
  ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (
    isLoading ||
    status ===
      "checking"
  ) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Spinner label="Checking legal requirements…" />
      </div>
    );
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (
    !isAuthenticated ||
    status ===
      "unauthenticated"
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location,
        }}
      />
    );
  }

  // =====================================================
  // PASSWORD CHANGE
  // =====================================================

  if (
    mustChangePassword ||
    status ===
      "password-change"
  ) {
    return (
      <Navigate
        to="/change-password"
        replace
      />
    );
  }

  // =====================================================
  // LEGAL ACTION REQUIRED
  // =====================================================

  if (
    status ===
    "legal-required"
  ) {
    const returnTo =
      `${location.pathname}${location.search}${location.hash}`;

    const params =
      new URLSearchParams({
        returnTo,
      });

    return (
      <Navigate
        to={`/legal-acceptance?${params.toString()}`}
        replace
        state={{
          from:
            location,
        }}
      />
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (
    status ===
    "error"
  ) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f5f2] px-5 text-black">
        <section className="w-full max-w-lg border border-black bg-white p-7 sm:p-9">
          <p className="text-sm font-extrabold">
            PhilaLink
          </p>

          <h1 className="mt-6 font-serif text-3xl font-bold">
            We couldn't verify your account
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-600">
            {error}
          </p>

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Protected account access remains unavailable
            until PhilaLink can confirm your current legal
            status.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 border border-black bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  // =====================================================
  // ALLOW ACCESS
  // =====================================================

  return (
    <Outlet />
  );
}