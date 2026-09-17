import {
  useEffect,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Activity,
  ArrowRight,
  ArrowUp,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Droplets,
  HeartPulse,
  MessageCircle,
  PhoneCall,
  Pill,
  ShieldCheck,
  Users,
} from "lucide-react";

import NavigationPage from "../components/layout/NavigationBar.jsx";

import "./LandingPage.css";

const services = [
  {
    icon: Pill,

    title:
      "Medication Management",

    description:
      "Track medication schedules, upcoming collections and treatment information in one place.",
  },

  {
    icon: Building2,

    title:
      "Connected Care",

    description:
      "Keep your healthcare information connected to the clinics and healthcare workers supporting your treatment.",
  },

  {
    icon: Bell,

    title:
      "Smart Reminders",

    description:
      "Stay informed about medication collections, appointments and important healthcare updates.",
  },

  {
    icon: Users,

    title:
      "Proxy Support",

    description:
      "Allow trusted proxies to support medication collections on behalf of linked patients.",
  },

  {
    icon: MessageCircle,

    title:
      "Phila Chat",

    description:
      "Get helpful healthcare information through the built-in PhilaLink assistant.",
  },

  {
    icon: ShieldCheck,

    title:
      "Secure Records",

    description:
      "Keep healthcare activity organised with secure records, verification and activity tracking.",
  },
];

const healthTips = [
  {
    icon: Pill,

    title:
      "Take medication as prescribed",

    description:
      "Follow your healthcare professional's instructions and keep track of when your medication needs to be collected.",
  },

  {
    icon: CalendarDays,

    title:
      "Keep your appointments",

    description:
      "Regular healthcare visits can help keep your treatment on track and identify problems early.",
  },

  {
    icon: Droplets,

    title:
      "Stay hydrated",

    description:
      "Drink enough water throughout the day, especially when you are active or when the weather is hot.",
  },
];

export default function LandingPage() {
  const location =
    useLocation();

  useEffect(() => {
    const sectionId =
      location.state?.scrollTo;

    if (!sectionId) {
      return;
    }

    const timer =
      setTimeout(() => {
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

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 150);

    return () =>
      clearTimeout(timer);
  }, [
    location.state,
  ]);

  const scrollToTop =
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  return (
    <div className="landing-page">
      <NavigationPage />

      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}

      <section className="landing-hero">
        <div className="section-container hero-layout">
          {/* LEFT */}

          <div className="hero-content">
            <div className="hero-eyebrow">
              <HeartPulse
                size={16}
              />

              <span>
                CONNECTED HEALTHCARE
              </span>
            </div>

            <h1>
              Your healthcare,
              <span>
                {" "}
                connected.
              </span>
            </h1>

            <p className="hero-description">
              PhilaLink helps patients
              stay informed about
              medication, collections,
              appointments and the
              people supporting their
              healthcare journey.
            </p>

            <div className="hero-actions">
              <Link
                to="/register"
                className="hero-primary-button"
              >
                Create account

                <ArrowRight
                  size={18}
                />
              </Link>

              <Link
                to="/login"
                className="hero-secondary-button"
              >
                Log in
              </Link>
            </div>

            <div className="hero-trust">
              <div>
                <CheckCircle2
                  size={17}
                />

                <span>
                  Medication tracking
                </span>
              </div>

              <div>
                <CheckCircle2
                  size={17}
                />

                <span>
                  Collection reminders
                </span>
              </div>

              <div>
                <CheckCircle2
                  size={17}
                />

                <span>
                  Proxy support
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="hero-visual">
            <div className="hero-panel">
              <div className="hero-panel-header">
                <div>
                  <span className="hero-panel-label">
                    PHILALINK
                  </span>

                  <h2>
                    Healthcare at a
                    glance
                  </h2>
                </div>

                <div className="hero-health-icon">
                  <Activity
                    size={22}
                  />
                </div>
              </div>

              <div className="hero-feature-list">
                <HeroFeature
                  icon={Pill}
                  title="Medication"
                  description="Keep treatment information organised."
                />

                <HeroFeature
                  icon={
                    CalendarDays
                  }
                  title="Collections"
                  description="Know when medication collection is due."
                />

                <HeroFeature
                  icon={Bell}
                  title="Reminders"
                  description="Stay informed about important healthcare events."
                />

                <HeroFeature
                  icon={Users}
                  title="Proxy care"
                  description="Support linked patients when they need assistance."
                />
              </div>
            </div>

            <div className="hero-floating-card">
              <div className="hero-floating-icon">
                <ShieldCheck
                  size={19}
                />
              </div>

              <div>
                <strong>
                  Secure access
                </strong>

                <span>
                  Role-based healthcare
                  information
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* ABOUT */}
      {/* ===================================== */}

      <section
        id="about"
        className="intro-section"
      >
        <div className="section-container">
          <div className="intro-layout">
            <div className="intro-content">
              <span className="section-label">
                ABOUT PHILALINK
              </span>

              <h2>
                Healthcare should be
                <span>
                  {" "}
                  easier to follow.
                </span>
              </h2>

              <p>
                PhilaLink brings
                patients, healthcare
                workers and medication
                proxies together
                through one connected
                digital platform.
              </p>
            </div>

            <div className="intro-stats">
              <StatCard
                icon={Pill}
                title="Medication"
                text="Keep treatment organised"
              />

              <StatCard
                icon={
                  CalendarDays
                }
                title="Collections"
                text="Track what is due"
              />

              <StatCard
                icon={Bell}
                title="Reminders"
                text="Stay informed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* SERVICES */}
      {/* ===================================== */}

      <section
        id="services"
        className="services-section"
      >
        <div className="section-container">
          <div className="section-heading">
            <span className="section-label">
              OUR SERVICES
            </span>

            <h2>
              Healthcare made
              <span>
                {" "}
                simpler.
              </span>
            </h2>

            <p>
              PhilaLink brings the
              important parts of
              healthcare management
              together in one clear,
              accessible platform.
            </p>
          </div>

          <div className="services-grid">
            {services.map(
              ({
                icon: Icon,
                title,
                description,
              }) => (
                <article
                  key={title}
                  className="service-card"
                >
                  <div className="service-icon">
                    <Icon
                      size={23}
                    />
                  </div>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {
                      description
                    }
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* HEALTH TIPS */}
      {/* ===================================== */}

      <section
        id="health-tips"
        className="health-tips-section"
      >
        <div className="section-container">
          <div className="section-heading">
            <span className="section-label">
              HEALTH TIPS
            </span>

            <h2>
              Simple steps for
              <span>
                {" "}
                better health.
              </span>
            </h2>

            <p>
              Helpful reminders to
              support your everyday
              healthcare routine.
            </p>
          </div>

          <div className="health-tips-grid">
            {healthTips.map(
              ({
                icon: Icon,
                title,
                description,
              }) => (
                <article
                  key={title}
                  className="health-tip-card"
                >
                  <div className="health-tip-icon">
                    <Icon
                      size={22}
                    />
                  </div>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {
                      description
                    }
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* FOOTER */}
      {/* ===================================== */}

      <footer
        id="contacts"
        className="landing-footer"
      >
        <div className="section-container">
          {/* CTA */}

          <div className="footer-cta">
            <div>
              <span className="footer-label">
                GET STARTED
              </span>

              <h2>
                A simpler way to
                stay connected to
                <span>
                  {" "}
                  care.
                </span>
              </h2>

              <p>
                Join PhilaLink and
                bring your healthcare
                journey into one
                connected platform.
              </p>
            </div>

            <div className="footer-cta-actions">
              <Link
                to="/register"
                className="footer-primary-button"
              >
                Create account

                <ArrowRight
                  size={17}
                />
              </Link>

              <Link
                to="/login"
                className="footer-secondary-button"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* MAIN FOOTER */}

          <div className="footer-main">
            <div className="footer-brand">
              <Link
                to="/"
                className="footer-logo"
              >
                <img
                  src="/logo2.png"
                  alt="PhilaLink"
                />

                <span>
                  Phila
                  <strong>
                    Link
                  </strong>
                </span>
              </Link>

              <h3>
                Healthcare connected
                around you.
              </h3>

              <p>
                Connecting patients,
                healthcare workers and
                trusted proxies through
                simpler digital
                healthcare.
              </p>
            </div>

            <div className="footer-links-grid">
              {/* EXPLORE */}

              <div>
                <h4>
                  Explore
                </h4>

                <div className="footer-links">
                  <a href="#about">
                    About
                  </a>

                  <a href="#services">
                    Services
                  </a>

                  <a href="#health-tips">
                    Health Tips
                  </a>
                </div>
              </div>

              {/* ACCESS */}

              <div>
                <h4>
                  Patient Access
                </h4>

                <div className="footer-links">
                  <Link to="/register">
                    Create account
                  </Link>

                  <Link to="/login">
                    Log in
                  </Link>

                  <a href="#services">
                    View services
                  </a>
                </div>
              </div>

              {/* SUPPORT */}

              <div>
                <h4>
                  Healthcare Support
                </h4>

                <div className="support-list">
                  <SupportItem
                    icon={
                      PhoneCall
                    }
                    label="Emergency"
                    value="10177"
                  />

                  <SupportItem
                    icon={
                      Building2
                    }
                    label="Connected care"
                    value="Healthcare support through PhilaLink"
                  />

                  <SupportItem
                    icon={Pill}
                    label="Treatment"
                    value="Medication, collections and reminders"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}

          <div className="footer-bottom">
            <span>
              © 2026 PhilaLink.
              All rights reserved.
            </span>

            <div className="footer-bottom-right">
              <div className="footer-emergency">
                <PhoneCall
                  size={16}
                />

                <span>
                  Emergency:
                </span>

                <strong>
                  10177
                </strong>
              </div>

              <button
                type="button"
                onClick={
                  scrollToTop
                }
                className="back-to-top"
                aria-label="Back to top"
              >
                <ArrowUp
                  size={18}
                />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ========================================= */
/* SMALL COMPONENTS */
/* ========================================= */

function HeroFeature({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="hero-feature">
      <div className="hero-feature-icon">
        <Icon
          size={20}
        />
      </div>

      <div>
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <article className="stat-card">
      <div className="stat-icon">
        <Icon
          size={21}
        />
      </div>

      <strong>
        {title}
      </strong>

      <span>
        {text}
      </span>
    </article>
  );
}

function SupportItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="support-item">
      <Icon
        size={19}
      />

      <div>
        <span>
          {label}
        </span>

        <p>
          {value}
        </p>
      </div>
    </div>
  );
}