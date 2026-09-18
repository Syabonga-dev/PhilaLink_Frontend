import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Home,
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
  ] =
    useState(false);


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

        if (section) {
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

      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-12">

        <Link
          to="/"
          onClick={() =>
            setMobileMenuOpen(
              false
            )
          }
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
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
        </Link>


        <nav className="hidden items-center gap-1 lg:flex">

          <button
            type="button"
            onClick={
              goHome
            }
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0f766e]"
          >
            <Home
              size={
                15
              }
            />

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
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0f766e]"
              >
                {
                  item.label
                }
              </button>
            )
          )}
        </nav>


        <div className="hidden items-center gap-2 lg:flex">

          <Link
            to="/login"
            className="rounded-lg px-5 py-2.5 text-sm font-bold text-[#0f766e] transition-colors hover:bg-teal-50"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-[#0f766e] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#115e59]"
          >
            Sign up
          </Link>
        </div>


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
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
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
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0f766e]"
              >
                <span className="flex items-center gap-2">
                  <Home
                    size={
                      17
                    }
                  />

                  Home
                </span>

                <ArrowRight
                  size={
                    17
                  }
                  className="text-slate-400"
                />
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
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0f766e]"
                  >
                    <span>
                      {
                        item.label
                      }
                    </span>

                    <ArrowRight
                      size={
                        17
                      }
                      className="text-slate-400"
                    />
                  </button>
                )
              )}
            </nav>


            <div className="my-3 border-t border-slate-200" />


            <div className="grid grid-cols-2 gap-3">

              <Link
                to="/login"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="flex min-h-11 items-center justify-center rounded-lg border border-[#0f766e]/30 px-4 text-sm font-bold text-[#0f766e]"
              >
                Log in
              </Link>

              <Link
                to="/register"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="flex min-h-11 items-center justify-center rounded-lg bg-[#0f766e] px-4 text-sm font-bold text-white"
              >
                Sign up
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}