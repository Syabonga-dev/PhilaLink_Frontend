import {
  useEffect,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
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

import heroImage from "../assets/Screenshot_20260918-165155_Chrome.jpg";

import "./LandingPage.css";


const services = [
  {
    icon: Pill,
    title: "Medication Management",
    description:
      "Keep track of medication, treatment details and upcoming collection dates from one place.",
  },

  {
    icon: CalendarDays,
    title: "Appointments & Collections",
    description:
      "Stay aware of important appointments and know when your next medication collection is due.",
  },

  {
    icon: Bell,
    title: "Healthcare Reminders",
    description:
      "Receive helpful reminders about medication, appointments, collections and healthcare updates.",
  },

  {
    icon: Users,
    title: "Proxy Support",
    description:
      "Connect trusted people who can support medication collection when a patient needs assistance.",
  },

  {
    icon: MessageCircle,
    title: "Phila Chat",
    description:
      "Access the built-in PhilaLink assistant for helpful healthcare information and guidance.",
  },

  {
    icon: ShieldCheck,
    title: "Connected Records",
    description:
      "Keep healthcare activity organised with secure access, verification and role-based information.",
  },
];


const healthTips = [
  {
    icon: Pill,
    title: "Take medication as prescribed",
    description:
      "Follow your healthcare professional's instructions and keep track of when your medication needs to be collected.",
  },

  {
    icon: CalendarDays,
    title: "Keep your appointments",
    description:
      "Regular healthcare visits can help keep your treatment on track and identify problems early.",
  },

  {
    icon: Droplets,
    title: "Stay hydrated",
    description:
      "Drink enough water throughout the day, especially when you are active or when the weather is hot.",
  },
];


const heroHighlights = [
  {
    icon: Pill,
    title: "Medication",
    text: "Track your treatment and supply.",
  },

  {
    icon: CalendarDays,
    title: "Collections",
    text: "Know when medication is due.",
  },

  {
    icon: Users,
    title: "Support",
    text: "Stay connected to people helping you.",
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
        <div
          className="landing-hero-background"
          style={{
            backgroundImage:
              `url(${heroImage})`,
          }}
          aria-hidden="true"
        />

        <div
          className="landing-hero-overlay"
          aria-hidden="true"
        />


        <div className="section-container hero-layout">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <HeartPulse
                size={17}
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
              stay informed about medication,
              collections, appointments and
              the people supporting their
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


          <div className="hero-highlight-grid">
            {heroHighlights.map(
              ({
                icon: Icon,
                title,
                text,
              }) => (
                <article
                  key={title}
                  className="hero-highlight-card"
                >
                  <div className="hero-highlight-icon">
                    <Icon
                      size={21}
                    />
                  </div>

                  <div className="hero-highlight-copy">
                    <strong>
                      {title}
                    </strong>

                    <span>
                      {text}
                    </span>
                  </div>
                </article>
              )
            )}
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
        <div className="section-container intro-layout">
          <div className="intro-heading">
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
          </div>


          <div className="intro-copy">
            <p>
              PhilaLink brings patients,
              healthcare workers and trusted
              medication proxies together
              through one connected digital
              platform.
            </p>

            <p>
              The platform helps patients
              understand what medication they
              have, when their next collection
              is due and the healthcare activity
              around their treatment.
            </p>
          </div>
        </div>


        <div className="section-container">
          <div className="care-summary-grid">
            <CareSummaryCard
              number="01"
              icon={Pill}
              title="Know your medication"
              text="Keep medication details and treatment information organised and easy to access."
            />

            <CareSummaryCard
              number="02"
              icon={CalendarDays}
              title="Know what is next"
              text="See upcoming collections and appointments before they become easy to miss."
            />

            <CareSummaryCard
              number="03"
              icon={Users}
              title="Stay supported"
              text="Connect patients with trusted proxies and healthcare workers involved in their care."
            />
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
          <div className="section-heading section-heading-centered">
            <span className="section-label">
              OUR SERVICES
            </span>

            <h2>
              One place for the parts of
              healthcare that
              <span>
                {" "}
                matter every day.
              </span>
            </h2>

            <p>
              PhilaLink keeps important
              healthcare information together
              so patients and the people
              supporting them can stay informed.
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
                  <div className="service-card-top">
                    <div className="service-icon">
                      <Icon
                        size={23}
                      />
                    </div>

                    <ArrowRight
                      className="service-arrow"
                      size={18}
                    />
                  </div>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {description}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>


      {/* ===================================== */}
      {/* CARE BANNER */}
      {/* ===================================== */}

      <section className="care-banner-section">
        <div className="section-container">
          <div className="care-banner">
            <div className="care-banner-icon">
              <HeartPulse
                size={30}
              />
            </div>


            <div className="care-banner-copy">
              <span>
                BUILT AROUND THE PATIENT
              </span>

              <h2>
                Your treatment information
                should move with you.
              </h2>

              <p>
                PhilaLink connects medication,
                collection information,
                appointments and healthcare
                support around one patient
                journey.
              </p>
            </div>


            <Link
              to="/register"
              className="care-banner-button"
            >
              Get started

              <ArrowRight
                size={18}
              />
            </Link>
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
              Small habits can support
              <span>
                {" "}
                better healthcare.
              </span>
            </h2>

            <p>
              Simple reminders to help support
              everyday treatment and healthcare
              routines.
            </p>
          </div>


          <div className="health-tips-grid">
            {healthTips.map(
              ({
                icon: Icon,
                title,
                description,
              }, index) => (
                <article
                  key={title}
                  className="health-tip-card"
                >
                  <div className="health-tip-number">
                    0{index + 1}
                  </div>

                  <div className="health-tip-icon">
                    <Icon
                      size={22}
                    />
                  </div>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {description}
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
          <div className="footer-cta">
            <div>
              <span className="footer-label">
                GET STARTED
              </span>

              <h2>
                Your healthcare journey,
                <span>
                  {" "}
                  connected in one place.
                </span>
              </h2>

              <p>
                Create your PhilaLink account
                and keep medication,
                collections, appointments and
                care support easier to follow.
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
                simpler digital healthcare.
              </p>
            </div>


            <div className="footer-links-grid">
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


              <div>
                <h4>
                  Healthcare Support
                </h4>

                <div className="support-list">
                  <SupportItem
                    icon={PhoneCall}
                    label="Emergency"
                    value="10177"
                  />

                  <SupportItem
                    icon={Building2}
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


function CareSummaryCard({
  number,
  icon: Icon,
  title,
  text,
}) {
  return (
    <article className="care-summary-card">
      <div className="care-summary-header">
        <div className="care-summary-icon">
          <Icon
            size={22}
          />
        </div>

        <span>
          {number}
        </span>
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>
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
