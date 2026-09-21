import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  Check,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

// =====================================================
// COOKIE CONFIGURATION
// =====================================================

const COOKIE_NAME =
  "philalink_cookie_consent";

const COOKIE_VERSION =
  1;

const COOKIE_MAX_AGE =
  60 * 60 * 24 * 180;

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/register/verify",
  "/register/success",
  "/forgot-password",
  "/auth/google/callback",
];

// =====================================================
// COOKIE HELPERS
// =====================================================

function readConsentCookie() {
  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  const prefix =
    `${COOKIE_NAME}=`;

  const rawCookie =
    document.cookie
      .split(";")
      .map(
        (item) =>
          item.trim()
      )
      .find(
        (item) =>
          item.startsWith(
            prefix
          )
      );

  if (!rawCookie) {
    return null;
  }

  try {
    const encoded =
      rawCookie.substring(
        prefix.length
      );

    const parsed =
      JSON.parse(
        decodeURIComponent(
          encoded
        )
      );

    if (
      parsed?.version !==
      COOKIE_VERSION
    ) {
      return null;
    }

    return {
      preferences:
        parsed.preferences ===
        true,
    };
  } catch {
    return null;
  }
}


function writeConsentCookie({
  preferences,
}) {
  const consent = {
    version:
      COOKIE_VERSION,

    preferences:
      Boolean(
        preferences
      ),
  };

  const secure =
    window.location.protocol ===
    "https:"
      ? "; Secure"
      : "";

  document.cookie =
    `${COOKIE_NAME}=` +
    `${encodeURIComponent(
      JSON.stringify(
        consent
      )
    )}; ` +
    `Path=/; ` +
    `Max-Age=${COOKIE_MAX_AGE}; ` +
    `SameSite=Lax` +
    secure;
}

// =====================================================
// TOGGLE
// =====================================================

function PreferenceToggle({
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={
        checked
      }
      onClick={() =>
        onChange(
          !checked
        )
      }
      className={[
        "relative",
        "h-7",
        "w-12",
        "shrink-0",
        "rounded-full",
        "border-0",
        "transition-colors",
        "duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#0f766e]",
        "focus-visible:ring-offset-2",
        checked
          ? "bg-[#0f766e]"
          : "bg-slate-300",
      ].join(" ")}
    >
      <span
        className={[
          "absolute",
          "top-1",
          "flex",
          "h-5",
          "w-5",
          "items-center",
          "justify-center",
          "rounded-full",
          "bg-white",
          "shadow-sm",
          "transition-transform",
          "duration-200",
          checked
            ? "translate-x-6"
            : "translate-x-1",
        ].join(" ")}
      >
        {checked && (
          <Check
            size={
              12
            }
            strokeWidth={
              3
            }
            className="text-[#0f766e]"
          />
        )}
      </span>
    </button>
  );
}

// =====================================================
// COOKIE SETTINGS
// =====================================================

function CookieSettingsModal({
  open,
  preferences,
  setPreferences,
  onClose,
  onEssentialOnly,
  onSave,
  onAcceptAll,
}) {
  const [
    essentialOpen,
    setEssentialOpen,
  ] = useState(true);

  const [
    preferencesOpen,
    setPreferencesOpen,
  ] = useState(true);

  const [
    thirdPartyOpen,
    setThirdPartyOpen,
  ] = useState(false);

  useEffect(
    () => {
      if (!open) {
        return undefined;
      }

      const previousOverflow =
        document.body.style
          .overflow;

      document.body.style
        .overflow =
          "hidden";

      const handleEscape =
        (
          event
        ) => {
          if (
            event.key ===
            "Escape"
          ) {
            onClose();
          }
        };

      window.addEventListener(
        "keydown",
        handleEscape
      );

      return () => {
        document.body.style
          .overflow =
            previousOverflow;

        window.removeEventListener(
          "keydown",
          handleEscape
        );
      };
    },
    [
      open,
      onClose,
    ]
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[6000] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close cookie settings"
        onClick={
          onClose
        }
        className="absolute inset-0 cursor-default"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-[720px] sm:rounded-2xl"
      >
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div className="flex items-start justify-between gap-6 border-b border-slate-200 px-5 py-5 sm:px-7">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#0f766e]">
              Privacy controls
            </p>

            <h2
              id="cookie-settings-title"
              className="m-0 text-2xl font-extrabold tracking-tight text-slate-900"
            >
              Cookie settings
            </h2>

            <p className="mt-2 max-w-[570px] text-sm leading-6 text-slate-600">
              Choose which optional cookies
              PhilaLink may use on this
              browser. Essential cookies
              cannot be disabled because
              they support security and
              core website operation.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close cookie settings"
          >
            <X
              size={
                20
              }
            />
          </button>
        </div>

        {/* ===================================== */}
        {/* CONTENT */}
        {/* ===================================== */}

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">

          {/* ================================= */}
          {/* ESSENTIAL */}
          {/* ================================= */}

          <div className="overflow-hidden rounded-xl border border-slate-200">

            <button
              type="button"
              onClick={() =>
                setEssentialOpen(
                  (
                    current
                  ) =>
                    !current
                )
              }
              className="flex w-full items-center justify-between gap-4 bg-white px-4 py-4 text-left sm:px-5"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900">
                    Essential cookies
                  </span>

                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-[#0f766e]">
                    Always active
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Required for security and
                  basic site functionality.
                </p>
              </div>

              {essentialOpen ? (
                <ChevronUp
                  size={
                    18
                  }
                  className="shrink-0 text-slate-400"
                />
              ) : (
                <ChevronDown
                  size={
                    18
                  }
                  className="shrink-0 text-slate-400"
                />
              )}
            </button>

            {essentialOpen && (
              <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-5">
                <p className="m-0 text-sm leading-6 text-slate-600">
                  These cookies support
                  security-related flows,
                  remember your cookie
                  consent choice and help
                  PhilaLink operate
                  correctly. They cannot be
                  switched off through this
                  settings panel.
                </p>

                <p className="mb-0 mt-3 text-sm leading-6 text-slate-600">
                  The consent cookie does
                  not contain passwords,
                  healthcare records,
                  medication information,
                  API keys or other
                  clinical data.
                </p>
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* PREFERENCES */}
          {/* ================================= */}

          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">

            <div className="flex items-center justify-between gap-4 bg-white px-4 py-4 sm:px-5">
              <button
                type="button"
                onClick={() =>
                  setPreferencesOpen(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    Preference cookies
                  </span>

                  {preferencesOpen ? (
                    <ChevronUp
                      size={
                        17
                      }
                      className="text-slate-400"
                    />
                  ) : (
                    <ChevronDown
                      size={
                        17
                      }
                      className="text-slate-400"
                    />
                  )}
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Optional browser
                  preferences.
                </p>
              </button>

              <PreferenceToggle
                checked={
                  preferences
                }
                onChange={
                  setPreferences
                }
              />
            </div>

            {preferencesOpen && (
              <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-5">
                <p className="m-0 text-sm leading-6 text-slate-600">
                  These cookies may be used
                  to remember optional
                  browser preferences so
                  your experience feels more
                  consistent on this device.
                </p>

                <p className="mb-0 mt-3 text-sm leading-6 text-slate-600">
                  Your account-level
                  healthcare preferences
                  remain stored securely by
                  PhilaLink and are not
                  placed inside this cookie.
                </p>
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* THIRD PARTY */}
          {/* ================================= */}

          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">

            <button
              type="button"
              onClick={() =>
                setThirdPartyOpen(
                  (
                    current
                  ) =>
                    !current
                )
              }
              className="flex w-full items-center justify-between gap-4 bg-white px-4 py-4 text-left sm:px-5"
            >
              <div>
                <span className="font-bold text-slate-900">
                  Third-party services
                </span>

                <p className="mt-1 text-xs text-slate-500">
                  Information about external
                  sign-in services.
                </p>
              </div>

              {thirdPartyOpen ? (
                <ChevronUp
                  size={
                    18
                  }
                  className="shrink-0 text-slate-400"
                />
              ) : (
                <ChevronDown
                  size={
                    18
                  }
                  className="shrink-0 text-slate-400"
                />
              )}
            </button>

            {thirdPartyOpen && (
              <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-5">
                <p className="m-0 text-sm leading-6 text-slate-600">
                  If you choose Continue
                  with Google, Google may
                  use cookies on its own
                  domains as part of the
                  authentication process.
                  Those cookies are
                  controlled by Google
                  rather than by PhilaLink.
                </p>

                <p className="mb-0 mt-3 text-sm leading-6 text-slate-600">
                  This PhilaLink consent
                  component does not enable
                  advertising or analytics
                  tracking cookies.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===================================== */}
        {/* ACTIONS */}
        {/* ===================================== */}

        <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">

            <button
              type="button"
              onClick={
                onEssentialOnly
              }
              className="min-h-11 rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Use essential only
            </button>

            <button
              type="button"
              onClick={
                onSave
              }
              className="min-h-11 rounded-lg border border-[#0f766e] px-5 text-sm font-bold text-[#0f766e] transition hover:bg-teal-50"
            >
              Save choices
            </button>

            <button
              type="button"
              onClick={
                onAcceptAll
              }
              className="min-h-11 rounded-lg bg-[#0f766e] px-5 text-sm font-bold text-white transition hover:bg-[#115e59]"
            >
              Accept all cookies
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// =====================================================
// COOKIE CONSENT
// =====================================================

export default function CookieConsent() {
  const location =
    useLocation();

  const [
    initialised,
    setInitialised,
  ] = useState(false);

  const [
    showBanner,
    setShowBanner,
  ] = useState(false);

  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false);

  const [
    preferences,
    setPreferences,
  ] = useState(false);

  const [
    hasDecision,
    setHasDecision,
  ] = useState(false);

  // =====================================================
  // READ EXISTING CONSENT
  // =====================================================

  useEffect(
    () => {
      const stored =
        readConsentCookie();

      if (stored) {
        setPreferences(
          stored.preferences
        );

        setHasDecision(
          true
        );

        setShowBanner(
          false
        );
      } else {
        setPreferences(
          false
        );

        setHasDecision(
          false
        );

        setShowBanner(
          true
        );
      }

      setInitialised(
        true
      );
    },
    []
  );

  // =====================================================
  // GLOBAL OPEN EVENT
  // =====================================================

  useEffect(
    () => {
      const handleOpen =
        () => {
          const stored =
            readConsentCookie();

          setPreferences(
            stored?.preferences ??
              false
          );

          setSettingsOpen(
            true
          );
        };

      window.addEventListener(
        "philalink:open-cookie-settings",
        handleOpen
      );

      return () => {
        window.removeEventListener(
          "philalink:open-cookie-settings",
          handleOpen
        );
      };
    },
    []
  );

  // =====================================================
  // SAVE
  // =====================================================

  const saveConsent =
    (
      preferenceChoice
    ) => {
      writeConsentCookie({
        preferences:
          preferenceChoice,
      });

      setPreferences(
        preferenceChoice
      );

      setHasDecision(
        true
      );

      setShowBanner(
        false
      );

      setSettingsOpen(
        false
      );
    };

  // =====================================================
  // PUBLIC COOKIE SETTINGS SHORTCUT
  // =====================================================

  const showSettingsShortcut =
    hasDecision &&
    PUBLIC_PATHS.includes(
      location.pathname
    );

  if (!initialised) {
    return null;
  }

  return (
    <>
      {/* ===================================== */}
      {/* COOKIE BANNER */}
      {/* ===================================== */}

      {showBanner && (
        <section
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-[5000] border-t border-slate-200 bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.12)]"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12">

            <div className="max-w-[790px]">
              <h2 className="m-0 text-base font-bold text-slate-900">
                Your privacy matters
              </h2>

              <p className="mb-0 mt-2 text-sm leading-6 text-slate-600">
                PhilaLink uses essential
                cookies for security-related
                website functions and to
                remember your cookie choices.
                With your permission, optional
                preference cookies may also be
                used to improve your experience.
              </p>

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(
                    true
                  )
                }
                className="mt-2 border-0 bg-transparent p-0 text-sm font-bold text-[#0f766e] underline decoration-[#0f766e]/40 underline-offset-4 transition hover:text-[#115e59]"
              >
                Learn more about our cookie settings
              </button>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(
                    true
                  )
                }
                className="min-h-12 rounded-full border-2 border-[#0f766e] bg-white px-7 text-sm font-bold text-[#0f766e] transition hover:bg-teal-50"
              >
                Cookie settings
              </button>

              <button
                type="button"
                onClick={() =>
                  saveConsent(
                    true
                  )
                }
                className="min-h-12 rounded-full bg-[#0f766e] px-7 text-sm font-bold text-white transition hover:bg-[#115e59]"
              >
                Accept all cookies
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===================================== */}
      {/* SMALL REOPEN CONTROL */}
      {/* ===================================== */}

      {showSettingsShortcut &&
        !showBanner &&
        !settingsOpen && (
          <button
            type="button"
            onClick={() =>
              setSettingsOpen(
                true
              )
            }
            className="fixed bottom-4 left-4 z-[4500] rounded-full border border-slate-300 bg-white/95 px-3.5 py-2 text-xs font-bold text-slate-600 shadow-md backdrop-blur transition hover:border-[#0f766e]/40 hover:text-[#0f766e]"
          >
            Cookie settings
          </button>
        )}

      {/* ===================================== */}
      {/* SETTINGS */}
      {/* ===================================== */}

      <CookieSettingsModal
        open={
          settingsOpen
        }
        preferences={
          preferences
        }
        setPreferences={
          setPreferences
        }
        onClose={() =>
          setSettingsOpen(
            false
          )
        }
        onEssentialOnly={() =>
          saveConsent(
            false
          )
        }
        onSave={() =>
          saveConsent(
            preferences
          )
        }
        onAcceptAll={() =>
          saveConsent(
            true
          )
        }
      />
    </>
  );
}