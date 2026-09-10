import { Link } from "react-router-dom";

export default function NavigationPage() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] border-b border-outline-variant/60 bg-surface-container-lowest/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <img
            src="/logo2.png"
            alt="PhilaLink"
            className="h-9 w-9"
          />

          <span className="text-xl font-bold text-on-surface">
            Phila<span className="text-primary">Link</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onClick={() => scrollToSection("map")}
            className="rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-primary-container/10 hover:text-primary"
          >
            Map
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-primary-container/10 hover:text-primary"
          >
            About
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("services")}
            className="rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-primary-container/10 hover:text-primary"
          >
            Services
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("contacts")}
            className="rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-primary-container/10 hover:text-primary"
          >
            Contacts
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("health-tips")}
            className="rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-primary-container/10 hover:text-primary"
          >
            Health Tips
          </button>
        </nav>

        {/* Authentication */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-md px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-container/10 sm:px-5"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-card transition-colors hover:bg-[#005555] sm:px-5"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
