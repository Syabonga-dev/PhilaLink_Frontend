import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const NAV_ITEMS = [
  {
    label: "Map",
    sectionId: "map",
  },
  {
    label: "About",
    sectionId: "about",
  },
  {
    label: "Services",
    sectionId: "services",
  },
  {
    label: "Contacts",
    sectionId: "contacts",
  },
  {
    label: "Health Tips",
    sectionId: "health-tips",
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

  const scrollToSection = (
    sectionId
  ) => {
    setMobileMenuOpen(false);

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
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    navigate("/", {
      state: {
        scrollTo: sectionId,
      },
    });
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const handleEscape = (
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
  }, [mobileMenuOpen]);

  return (
    <header className="fixed left-0 right-0 top-0 z-[1000] border-b border-outline-variant/60 bg-surface-container-lowest/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-12">
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
            className="h-9 w-9"
          />

          <span className="text-xl font-bold text-on-surface">
            Phila
            <span className="text-primary">
              Link
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(
            (item) => (
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
                className="rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-primary-container/10 hover:text-primary"
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-md px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-container/10"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-card transition-colors hover:bg-[#005555]"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (previous) =>
                !previous
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface transition-colors hover:bg-primary-container/10 lg:hidden"
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
          <span className="material-symbols-outlined text-[28px]">
            {mobileMenuOpen
              ? "close"
              : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
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
            className="fixed inset-0 top-16 z-[-1] bg-black/20 lg:hidden"
          />

          <div
            id="mobile-navigation"
            className="border-t border-outline-variant/60 bg-surface-container-lowest px-4 py-4 shadow-lg sm:px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map(
                (item) => (
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
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-on-surface-variant transition-colors hover:bg-primary-container/10 hover:text-primary"
                  >
                    <span>
                      {item.label}
                    </span>

                    <span className="material-symbols-outlined text-[19px] text-outline">
                      arrow_forward
                    </span>
                  </button>
                )
              )}
            </nav>

            <div className="my-3 border-t border-outline-variant/60" />

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="flex min-h-11 items-center justify-center rounded-md border border-primary/30 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-container/10"
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
                className="flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-on-primary shadow-card transition-colors hover:bg-[#005555]"
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