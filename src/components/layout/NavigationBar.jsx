import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label:
      "About",

    sectionId:
      "about",
  },

  {
    label:
      "Services",

    sectionId:
      "services",
  },

  {
    label:
      "Health Tips",

    sectionId:
      "health-tips",
  },

  {
    label:
      "Contacts",

    sectionId:
      "contacts",
  },
];

export default function NavigationPage() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  // =====================================================
  // HOME
  // =====================================================

  const goHome =
    () => {
      setMobileMenuOpen(
        false
      );

      if (
        location.pathname ===
        "/"
      ) {
        window.scrollTo({
          top: 0,

          behavior:
            "smooth",
        });

        return;
      }

      navigate(
        "/"
      );
    };

  // =====================================================
  // SECTION NAVIGATION
  // =====================================================

  const scrollToSection =
    (
      sectionId
    ) => {
      setMobileMenuOpen(
        false
      );

      if (
        location.pathname ===
        "/"
      ) {
        const section =
          document.getElementById(
            sectionId
          );

        if (
          section
        ) {
          section.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });
        }

        return;
      }

      navigate(
        "/",
        {
          state: {
            scrollTo:
              sectionId,
          },
        }
      );
    };

  // =====================================================
  // CLOSE MOBILE MENU ON ROUTE CHANGE
  // =====================================================

  useEffect(
    () => {
      setMobileMenuOpen(
        false
      );
    },
    [
      location.pathname,
    ]
  );

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(
    () => {
      if (
        !mobileMenuOpen
      ) {
        return undefined;
      }

      const handleEscape =
        (
          event
        ) => {
          if (
            event.key ===
            "Escape"
          ) {
            setMobileMenuOpen(
              false
            );
          }
        };

      window.addEventListener(
        "keydown",
        handleEscape
      );

      return () => {
        window.removeEventListener(
          "keydown",
          handleEscape
        );
      };
    },
    [
      mobileMenuOpen,
    ]
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-[1000] border-b border-slate-200/80 bg-white/95 backdrop-blur">

      {/* ================================================= */}
      {/* DESKTOP NAVBAR */}
      {/* ================================================= */}

      <div className="mx-auto hidden h-[72px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-6 lg:grid lg:px-12">

        {/* ============================= */}
        {/* LEFT — BRAND */}
        {/* ============================= */}

        <div className="justify-self-start">

          <button
            type="button"
            onClick={
              goHome
            }
            className="flex shrink-0 items-center gap-2.5 border-0 bg-transparent p-0 transition-opacity hover:opacity-90"
            aria-label="Go to PhilaLink home"
          >
            <img
              src="/logo2.png"
              alt="PhilaLink"
              className="h-10 w-10 object-contain"
            />

            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Phila

              <span className="text-[#0f766e]">
                Link
              </span>
            </span>
          </button>
        </div>

        {/* ============================= */}
        {/* CENTER — NAVIGATION */}
        {/* ============================= */}

        <nav className="flex items-center justify-center gap-1">

          <button
            type="button"
            onClick={
              goHome
            }
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0f766e]"
          >
            Home
          </button>

          {NAV_ITEMS.map(
            (
              item
            ) => (
              <button
                key={
                  item.sectionId
                }
                type="button"
                onClick={() =>
                  scrollToSection(
                    item.sectionId
                  )
                }
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0f766e]"
              >
                {
                  item.label
                }
              </button>
            )
          )}
        </nav>

        {/* ============================= */}
        {/* RIGHT — AUTH ACTIONS */}
        {/* ============================= */}

        <div className="flex items-center gap-2 justify-self-end">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/login"
              )
            }
            className="rounded-lg px-5 py-2.5 text-sm font-bold text-[#0f766e] transition-colors hover:bg-teal-50"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/register"
              )
            }
            className="rounded-lg bg-[#0f766e] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#115e59]"
          >
            Sign up
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* MOBILE / TABLET NAVBAR */}
      {/* ================================================= */}

      <div className="mx-auto flex h-[72px] w-full items-center justify-between px-4 sm:px-6 lg:hidden">

        {/* ============================= */}
        {/* BRAND */}
        {/* ============================= */}

        <button
          type="button"
          onClick={
            goHome
          }
          className="flex shrink-0 items-center gap-2.5 border-0 bg-transparent p-0 transition-opacity hover:opacity-90"
          aria-label="Go to PhilaLink home"
        >
          <img
            src="/logo2.png"
            alt="PhilaLink"
            className="h-10 w-10 object-contain"
          />

          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Phila

            <span className="text-[#0f766e]">
              Link
            </span>
          </span>
        </button>

        {/* ============================= */}
        {/* MOBILE MENU BUTTON */}
        {/* ============================= */}

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (
                current
              ) =>
                !current
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            mobileMenuOpen
          }
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? (
            <X
              size={
                23
              }
            />
          ) : (
            <Menu
              size={
                23
              }
            />
          )}
        </button>
      </div>

      {/* ================================================= */}
      {/* MOBILE NAVIGATION */}
      {/* ================================================= */}

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setMobileMenuOpen(
                false
              )
            }
            className="fixed inset-0 top-[72px] z-[-1] bg-black/20 lg:hidden"
          />

          <div
            id="mobile-navigation"
            className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg sm:px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-1">

              <button
                type="button"
                onClick={
                  goHome
                }
                className="w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0f766e]"
              >
                Home
              </button>

              {NAV_ITEMS.map(
                (
                  item
                ) => (
                  <button
                    key={
                      item.sectionId
                    }
                    type="button"
                    onClick={() =>
                      scrollToSection(
                        item.sectionId
                      )
                    }
                    className="w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0f766e]"
                  >
                    {
                      item.label
                    }
                  </button>
                )
              )}
            </nav>

            <div className="my-3 border-t border-slate-200" />

            {/* ============================= */}
            {/* MOBILE AUTH ACTIONS */}
            {/* ============================= */}

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(
                    false
                  );

                  navigate(
                    "/login"
                  );
                }}
                className="flex min-h-11 items-center justify-center rounded-lg border border-[#0f766e]/30 px-4 text-sm font-bold text-[#0f766e] transition-colors hover:bg-teal-50"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(
                    false
                  );

                  navigate(
                    "/register"
                  );
                }}
                className="flex min-h-11 items-center justify-center rounded-lg bg-[#0f766e] px-4 text-sm font-bold text-white transition-colors hover:bg-[#115e59]"
              >
                Sign up
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}