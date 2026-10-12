import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  useTranslation,
} from "react-i18next";

import {
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

const COOKIE_NAME =
  "philalink_cookie_consent";

const COOKIE_VERSION =
  1;

const COOKIE_MAX_AGE =
  60 *
  60 *
  24 *
  180;

function readConsentCookie() {
  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  const prefix =
    `${COOKIE_NAME}=`;

  const cookie =
    document.cookie
      .split(";")
      .map(
        item =>
          item.trim()
      )
      .find(
        item =>
          item.startsWith(
            prefix
          )
      );

  if (!cookie) {
    return null;
  }

  try {
    const value =
      cookie.substring(
        prefix.length
      );

    const parsed =
      JSON.parse(
        decodeURIComponent(
          value
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

function writeConsentCookie(
  preferences
) {
  const value = {
    version:
      COOKIE_VERSION,

    preferences:
      Boolean(
        preferences
      ),
  };

  const secure =
    window.location
      .protocol ===
    "https:"
      ? "; Secure"
      : "";

  document.cookie =
    `${COOKIE_NAME}=` +
    `${encodeURIComponent(
      JSON.stringify(
        value
      )
    )}; ` +
    `Path=/; ` +
    `Max-Age=${COOKIE_MAX_AGE}; ` +
    "SameSite=Lax" +
    secure;
}

function AccordionItem({
  title,
  children,
  open,
  onToggle,
}) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={
          onToggle
        }
        className="flex w-full items-center justify-between gap-5 bg-white px-5 py-5 text-left transition hover:bg-slate-50 sm:px-6"
      >
        <span className="text-[15px] font-semibold text-slate-900 sm:text-base">
          {title}
        </span>

        {open ? (
          <ChevronUp
            size={18}
            className="shrink-0 text-[#0f766e]"
          />
        ) : (
          <ChevronDown
            size={18}
            className="shrink-0 text-[#0f766e]"
          />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6">
          {children}
        </div>
      )}
    </div>
  );
}

function CookieSettings({
  open,
  preferences,
  setPreferences,
  onClose,
  onSave,
  onEssentialOnly,
  onAcceptAll,
}) {
  const {
    t,
  } =
    useTranslation();

  const [
    activeSection,
    setActiveSection,
  ] =
    useState(
      "what"
    );

  useEffect(
    () => {
      if (!open) {
        return undefined;
      }

      const previousOverflow =
        document.body
          .style
          .overflow;

      document.body
        .style
        .overflow =
        "hidden";

      const handleEscape =
        event => {
          if (
            event.key ===
            "Escape"
          ) {
            onClose();
          }
        };

      window
        .addEventListener(
          "keydown",
          handleEscape
        );

      return () => {
        document.body
          .style
          .overflow =
          previousOverflow;

        window
          .removeEventListener(
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

  const toggleSection =
    name => {
      setActiveSection(
        current =>
          current ===
          name
            ? null
            : name
      );
    };

  return (
    <div className="fixed inset-0 z-[6000] flex items-end justify-center bg-black/35 sm:items-center sm:p-6">
      <button
        type="button"
        onClick={
          onClose
        }
        className="absolute inset-0"
        aria-label={t(
          "cookies.closeSettings"
        )}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-heading"
        className="relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-xl bg-white shadow-2xl sm:max-w-[820px] sm:rounded-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2
              id="cookie-settings-heading"
              className="m-0 text-xl font-semibold text-slate-900"
            >
              {t(
                "cookies.settings"
              )}
            </h2>

            <p className="mb-0 mt-2 max-w-[650px] text-sm leading-6 text-slate-600">
              {t(
                "cookies.intro"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
            aria-label={t(
              "cookies.closeSettings"
            )}
          >
            <X
              size={19}
            />
          </button>
        </div>

        <div className="overflow-y-auto">
          <AccordionItem
            title={t(
              "cookies.whatTitle"
            )}
            open={
              activeSection ===
              "what"
            }
            onToggle={() =>
              toggleSection(
                "what"
              )
            }
          >
            <p className="m-0">
              {t(
                "cookies.whatBody1"
              )}
            </p>

            <p className="mb-0 mt-3">
              {t(
                "cookies.whatBody2"
              )}
            </p>
          </AccordionItem>

          <AccordionItem
            title={t(
              "cookies.preferencesTitle"
            )}
            open={
              activeSection ===
              "preferences"
            }
            onToggle={() =>
              toggleSection(
                "preferences"
              )
            }
          >
            <div className="flex items-start justify-between gap-6 py-1">
              <div>
                <p className="m-0 font-semibold text-slate-900">
                  {t(
                    "cookies.essentialTitle"
                  )}
                </p>

                <p className="mb-0 mt-1">
                  {t(
                    "cookies.essentialBody"
                  )}
                </p>
              </div>

              <span className="shrink-0 text-xs font-semibold text-[#0f766e]">
                {t(
                  "cookies.alwaysOn"
                )}
              </span>
            </div>

            <div className="mt-5 flex items-start justify-between gap-6 border-t border-slate-200 pt-5">
              <div>
                <p className="m-0 font-semibold text-slate-900">
                  {t(
                    "cookies.preferenceTitle"
                  )}
                </p>

                <p className="mb-0 mt-1">
                  {t(
                    "cookies.preferenceBody"
                  )}
                </p>
              </div>

              <label className="relative mt-1 inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={
                    preferences
                  }
                  onChange={
                    event =>
                      setPreferences(
                        event
                          .target
                          .checked
                      )
                  }
                  className="peer sr-only"
                />

                <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-[#0f766e]" />

                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          </AccordionItem>

          <AccordionItem
            title={t(
              "cookies.whyTitle"
            )}
            open={
              activeSection ===
              "why"
            }
            onToggle={() =>
              toggleSection(
                "why"
              )
            }
          >
            <p className="m-0">
              {t(
                "cookies.whyBody1"
              )}
            </p>

            <p className="mb-0 mt-3">
              {t(
                "cookies.whyBody2"
              )}
            </p>
          </AccordionItem>

          <AccordionItem
            title={t(
              "cookies.changeTitle"
            )}
            open={
              activeSection ===
              "change"
            }
            onToggle={() =>
              toggleSection(
                "change"
              )
            }
          >
            <p className="m-0">
              {t(
                "cookies.changeBody1"
              )}
            </p>

            <p className="mb-0 mt-3">
              {t(
                "cookies.changeBody2"
              )}
            </p>
          </AccordionItem>

          <AccordionItem
            title={t(
              "cookies.thirdPartyTitle"
            )}
            open={
              activeSection ===
              "third-party"
            }
            onToggle={() =>
              toggleSection(
                "third-party"
              )
            }
          >
            <p className="m-0">
              {t(
                "cookies.thirdPartyBody1"
              )}
            </p>

            <p className="mb-0 mt-3">
              {t(
                "cookies.thirdPartyBody2"
              )}
            </p>
          </AccordionItem>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={
              onEssentialOnly
            }
            className="min-h-11 rounded-full border border-[#0f766e] bg-white px-6 text-sm font-semibold text-[#0f766e] transition hover:bg-teal-50"
          >
            {t(
              "cookies.essentialOnly"
            )}
          </button>

          <button
            type="button"
            onClick={
              onSave
            }
            className="min-h-11 rounded-full border border-[#0f766e] bg-white px-6 text-sm font-semibold text-[#0f766e] transition hover:bg-teal-50"
          >
            {t(
              "cookies.saveSettings"
            )}
          </button>

          <button
            type="button"
            onClick={
              onAcceptAll
            }
            className="min-h-11 rounded-full bg-[#0f766e] px-6 text-sm font-semibold text-white transition hover:bg-[#115e59]"
          >
            {t(
              "cookies.acceptAll"
            )}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function CookieConsent() {
  const {
    t,
  } =
    useTranslation();

  const location =
    useLocation();

  const [
    initialised,
    setInitialised,
  ] =
    useState(false);

  const [
    showBanner,
    setShowBanner,
  ] =
    useState(false);

  const [
    settingsOpen,
    setSettingsOpen,
  ] =
    useState(false);

  const [
    preferences,
    setPreferences,
  ] =
    useState(false);

  const [
    hasDecision,
    setHasDecision,
  ] =
    useState(false);

  const hideFloatingSettings =
    location.pathname ===
      "/proxy" ||
    location.pathname
      .startsWith(
        "/proxy/"
      );

  useEffect(
    () => {
      const stored =
        readConsentCookie();

      if (stored) {
        setPreferences(
          stored
            .preferences
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

  useEffect(
    () => {
      const handleOpen =
        () => {
          const stored =
            readConsentCookie();

          setPreferences(
            stored
              ?.preferences ??
              false
          );

          setSettingsOpen(
            true
          );
        };

      window
        .addEventListener(
          "philalink:open-cookie-settings",
          handleOpen
        );

      return () => {
        window
          .removeEventListener(
            "philalink:open-cookie-settings",
            handleOpen
          );
      };
    },
    []
  );

  const saveConsent =
    preferenceChoice => {
      writeConsentCookie(
        preferenceChoice
      );

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

  if (!initialised) {
    return null;
  }

  return (
    <>
      {showBanner && (
        <section
          aria-label={t(
            "cookies.consentAria"
          )}
          className="fixed bottom-0 left-0 right-0 z-[5000] border-t border-slate-200 bg-white shadow-[0_-6px_24px_rgba(15,23,42,0.10)]"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10">
            <p className="m-0 max-w-[800px] text-sm leading-6 text-slate-600">
              {t(
                "cookies.banner"
              )}
            </p>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(
                    true
                  )
                }
                className="min-h-11 rounded-full border border-[#0f766e] bg-white px-6 text-sm font-semibold text-[#0f766e] transition hover:bg-teal-50"
              >
                {t(
                  "cookies.settings"
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  saveConsent(
                    true
                  )
                }
                className="min-h-11 rounded-full bg-[#0f766e] px-6 text-sm font-semibold text-white transition hover:bg-[#115e59]"
              >
                {t(
                  "cookies.acceptAll"
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {hasDecision &&
        !showBanner &&
        !settingsOpen &&
        !hideFloatingSettings && (
          <button
            type="button"
            onClick={() => {
              const stored =
                readConsentCookie();

              setPreferences(
                stored
                  ?.preferences ??
                  false
              );

              setSettingsOpen(
                true
              );
            }}
            className="fixed bottom-3 left-3 z-30 border-0 bg-white/90 px-2 py-1 text-xs font-medium text-slate-500 underline underline-offset-2 shadow-sm backdrop-blur transition hover:text-[#0f766e]"
          >
            {t(
              "cookies.settings"
            )}
          </button>
        )}

      <CookieSettings
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
        onSave={() =>
          saveConsent(
            preferences
          )
        }
        onEssentialOnly={() =>
          saveConsent(
            false
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
