import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  homePathForRole,
} from "../../routes/ProtectedRoute.jsx";

import logo2 from "../../assets/logo2.png";

export default function GoogleCallbackPage() {
  const {
    completeGoogleLogin,
  } = useAuth();

  const navigate =
    useNavigate();

  const hasStarted =
    useRef(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    /*
     * React StrictMode may run effects twice during
     * development. Prevent the OAuth callback from
     * being processed more than once.
     */
    if (
      hasStarted.current
    ) {
      return;
    }

    hasStarted.current =
      true;

    const complete =
      async () => {
        const hash =
          window.location.hash
            .replace(
              /^#/,
              ""
            );

        const params =
          new URLSearchParams(
            hash
          );

        const token =
          params.get(
            "token"
          );

        const oauthError =
          params.get(
            "error"
          );

        /*
         * Remove the token/error from the visible URL
         * and browser history as soon as we have read it.
         */
        window.history.replaceState(
          null,
          document.title,
          window.location.pathname
        );

        if (oauthError) {
          setError(
            oauthError
          );

          return;
        }

        if (!token) {
          setError(
            "Google sign-in could not be completed because no authentication token was returned."
          );

          return;
        }

        try {
          const currentUser =
            await completeGoogleLogin(
              token
            );

          if (
            currentUser
              ?.mustChangePassword ===
            true
          ) {
            navigate(
              "/change-password",
              {
                replace: true,
              }
            );

            return;
          }

          navigate(
            homePathForRole(
              currentUser.role
            ),
            {
              replace: true,
            }
          );
        } catch (err) {
          setError(
            err?.message ||
              "Google sign-in could not be completed."
          );
        }
      };

    complete();
  }, [
    completeGoogleLogin,
    navigate,
  ]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f8f7] px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-[#dce8e5] bg-white p-8 text-center shadow-xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <img
            src={logo2}
            alt="PhilaLink logo"
            className="h-10 w-10 object-contain"
          />

          <div className="text-xl font-extrabold text-[#073b3b]">
            <span className="text-[#006b6b]">
              Phila
            </span>
            Link
          </div>
        </div>

        {!error ? (
          <>
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-[#d6e7e3] border-t-[#006b6b]" />

            <h1 className="text-xl font-bold text-[#102020]">
              Completing sign-in
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#647575]">
              Your Google account has been returned to PhilaLink.
              We are securely preparing your session.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
              !
            </div>

            <h1 className="text-xl font-bold text-[#102020]">
              Sign-in unsuccessful
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#647575]">
              {error}
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#006b6b] px-6 text-sm font-bold text-white transition hover:bg-[#005858]"
            >
              Return to login
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
