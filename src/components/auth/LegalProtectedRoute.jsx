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
    legalState,
    setLegalState,
  ] = useState({
    status: "checking",
    error: "",
  });

  // =====================================================
  // CHECK LEGAL STATUS
  // =====================================================

  useEffect(() => {
    let cancelled =
      false;

    const checkLegalStatus =
      async () => {
        // -----------------------------------------------
        // WAIT FOR AUTH CONTEXT
        // -----------------------------------------------

        if (
          isLoading
        ) {
          return;
        }

        // -----------------------------------------------
        // NOT AUTHENTICATED
        // -----------------------------------------------

        if (
          !isAuthenticated
        ) {
          if (
            !cancelled
          ) {
            setLegalState({
              status:
                "unauthenticated",

              error: "",
            });
          }

          return;
        }

        // -----------------------------------------------
        // PASSWORD CHANGE HAS PRIORITY
        // -----------------------------------------------

        if (
          mustChangePassword
        ) {
          if (
            !cancelled
          ) {
            setLegalState({
              status:
                "password-change",

              error: "",
            });
          }

          return;
        }

        // -----------------------------------------------
        // CHECK BACKEND
        // -----------------------------------------------

        if (
          !cancelled
        ) {
          setLegalState({
            status:
              "checking",

            error: "",
          });
        }

        try {
          /*
           * No token parameter is required.
           *
           * api/client.js automatically reads
           * philalink_token and attaches:
           *
           * Authorization: Bearer <token>
           */
          const result =
            await getLegalStatus();

          if (
            cancelled
          ) {
            return;
          }

          if (
            result
              ?.requiresAction ===
            true
          ) {
            setLegalState({
              status:
                "legal-required",

              error: "",
            });

            return;
          }

          setLegalState({
            status:
              "allowed",

            error: "",
          });
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }

          /*
           * A 401 is already handled by
           * api/client.js and AuthContext.
           *
           * Keep this branch as an additional
           * safeguard.
           */
          if (
            error?.status ===
            401
          ) {
            setLegalState({
              status:
                "unauthenticated",

              error: "",
            });

            return;
          }

          console.error(
            "Unable to verify legal status:",
            error
          );

          /*
           * Fail closed.
           *
           * If PhilaLink cannot confirm whether
           * the required documents were accepted,
           * protected areas are not opened.
           */
          setLegalState({
            status:
              "error",

            error:
              error?.message ||
              "PhilaLink could not verify your legal document status.",
          });
        }
      };

    checkLegalStatus();

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
  // AUTH CONTEXT LOADING
  // =====================================================

  if (
    isLoading
  ) {
    return (
      <LegalRouteLoader
        label="Checking your session…"
      />
    );
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (
    !isAuthenticated ||
    legalState.status ===
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
  // REQUIRED PASSWORD CHANGE
  // =====================================================

  if (
    mustChangePassword ||
    legalState.status ===
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
  // CHECKING LEGAL STATUS
  // =====================================================

  if (
    legalState.status ===
    "checking"
  ) {
    return (
      <LegalRouteLoader
        label="Checking legal requirements…"
      />
    );
  }

  // =====================================================
  // LEGAL ACCEPTANCE REQUIRED
  // =====================================================

  if (
    legalState.status ===
    "legal-required"
  ) {
    const returnTo =
      `${location.pathname}${location.search}${location.hash}`;

    const query =
      new URLSearchParams({
        returnTo,
      });

    return (
      <Navigate
        to={`/legal-acceptance?${query.toString()}`}
        replace
        state={{
          from:
            location,
        }}
      />
    );
  }

  // =====================================================
  // STATUS CHECK FAILED
  // =====================================================

  if (
    legalState.status ===
    "error"
  ) {
    return (
      <LegalRouteError
        message={
          legalState.error
        }
      />
    );
  }

  // =====================================================
  // ACCESS ALLOWED
  // =====================================================

  return (
    <Outlet />
  );
}

// =====================================================
// LOADING
// =====================================================

function LegalRouteLoader({
  label,
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <Spinner
        label={
          label
        }
      />
    </div>
  );
}

// =====================================================
// ERROR
// =====================================================

function LegalRouteError({
  message,
}) {
  return (
    <main
      style={{
        minHeight:
          "100vh",

        padding:
          "24px",

        display:
          "grid",

        placeItems:
          "center",

        background:
          "#f4f4f2",

        color:
          "#111111",

        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      <section
        style={{
          width:
            "min(100%, 520px)",

          padding:
            "32px",

          border:
            "1px solid #ccccca",

          background:
            "#ffffff",
        }}
      >
        <div
          style={{
            marginBottom:
              "24px",

            fontSize:
              "20px",

            fontWeight:
              "800",

            letterSpacing:
              "-0.04em",
          }}
        >
          PhilaLink
        </div>

        <h1
          style={{
            margin:
              "0 0 14px",

            fontFamily:
              'Georgia, "Times New Roman", serif',

            fontSize:
              "30px",

            fontWeight:
              "500",

            lineHeight:
              "1.15",
          }}
        >
          We couldn't verify your account
        </h1>

        <p
          style={{
            margin:
              "0",

            color:
              "#666666",

            fontSize:
              "13px",

            lineHeight:
              "1.7",
          }}
        >
          {
            message
          }
        </p>

        <p
          style={{
            margin:
              "12px 0 0",

            color:
              "#666666",

            fontSize:
              "13px",

            lineHeight:
              "1.7",
          }}
        >
          Protected account access remains unavailable until
          PhilaLink can confirm your current legal document
          status.
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          style={{
            minHeight:
              "44px",

            marginTop:
              "24px",

            padding:
              "0 20px",

            border:
              "1px solid #111111",

            cursor:
              "pointer",

            background:
              "#111111",

            color:
              "#ffffff",

            font:
              "inherit",

            fontSize:
              "13px",

            fontWeight:
              "700",
          }}
        >
          Try again
        </button>
      </section>
    </main>
  );
}