import {
  useEffect,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
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
    title: "Medication",
    description:
      "View active medication, dosage information and treatment details linked to your care.",
  },

  {
    icon: CalendarDays,
    title: "Collections",
    description:
      "See when medication collection is due and keep upcoming collection information easy to find.",
  },

  {
    icon: Bell,
    title: "Reminders",
    description:
      "Stay informed about appointments, medication collections and important healthcare activity.",
  },

  {
    icon: Users,
    title: "Proxy support",
    description:
      "Connect trusted people who can support medication collection for linked patients.",
  },

  {
    icon: MessageCircle,
    title: "Phila Chat",
    description:
      "Access the PhilaLink assistant for simple healthcare information and support.",
  },

  {
    icon: ShieldCheck,
    title: "Secure access",
    description:
      "Healthcare information stays organised around verified users and role-based access.",
  },
];


const journeyItems = [
  {
    number: "01",
    title: "Know your medication",
    description:
      "See your medication and treatment information in one clear place.",
  },

  {
    number: "02",
    title: "Know what is next",
    description:
      "Keep track of your next medication collection and upcoming appointments.",
  },

  {
    number: "03",
    title: "Stay supported",
    description:
      "Stay connected to clinics, healthcare workers and trusted medication proxies.",
  },
];


const healthTips = [
  {
    number: "01",
    title: "Take medication as directed",
    description:
      "Follow the dosage and timing provided by your healthcare professional, and ask for guidance whenever instructions are unclear.",
  },

  {
    number: "02",
    title: "Plan ahead for collections",
    description:
      "Keep track of your next collection date so you have enough time to arrange transport or proxy support when needed.",
  },

  {
    number: "03",
    title: "Keep your care information current",
    description:
      "Make sure important treatment, appointment and contact information stays up to date so your healthcare journey is easier to follow.",
  },
];


export default function LandingPage() {
  const location =
    useLocation();


  // =====================================================
  // HANDLE NAVIGATION FROM ANOTHER PAGE
  // =====================================================

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
            behavior:
              "smooth",

            block:
              "start",
          });
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 120);

    return () =>
      clearTimeout(
        timer
      );
  }, [
    location.state,
  ]);


  // =====================================================
  // SCROLL HELPERS
  // =====================================================

  const scrollToTop =
    () => {
      window.scrollTo({
        top: 0,

        behavior:
          "smooth",
      });
    };


  return (
    <div className="landing-page" style={{display: "none",}}>
      <NavigationPage />


      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}

      <section
        id="home"
        className="landing-hero"
      >
        <div
          className="landing-hero-image"
          style={{
            backgroundImage:
              `url(${heroImage})`,
          }}
          aria-hidden="true"
        />

        <div className="hero-content">
          <h1>
            Your healthcare,

            <span>
              {" "}
              connected.
            </span>
          </h1>

          <p>
            PhilaLink helps patients stay
            informed about medication,
            collections, appointments and
            the people supporting their
            healthcare journey.
          </p>
        </div>
      </section>


      {/* ===================================== */}
      {/* ABOUT */}
      {/* ===================================== */}

      <section
        id="about"
        className="landing-intro"
      >
        <div className="section-container landing-intro-grid">
          <div>
            <span className="section-kicker">
              PHILALINK
            </span>

            <h2>
              Healthcare information
              should be easy to follow.
            </h2>
          </div>

          <div className="landing-intro-copy">
            <p>
              PhilaLink brings patients,
              healthcare workers and trusted
              medication proxies together
              through one connected digital
              platform.
            </p>

            <p>
              The goal is simple: make the
              everyday parts of healthcare
              easier to understand, track
              and act on.
            </p>
          </div>
        </div>
      </section>


      {/* ===================================== */}
      {/* JOURNEY */}
      {/* ===================================== */}

      <section className="journey-section">
        <div className="section-container">
          <div className="journey-grid">
            {journeyItems.map(
              ({
                number,
                title,
                description,
              }) => (
                <article
                  key={
                    number
                  }
                  className="journey-item"
                >
                  <span className="journey-number">
                    {
                      number
                    }
                  </span>

                  <h3>
                    {
                      title
                    }
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
      {/* SERVICES */}
      {/* ===================================== */}

      <section
        id="services"
        className="services-section"
      >
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-kicker">
                WHAT PHILALINK DOES
              </span>

              <h2>
                The important parts of
                care, in one place.
              </h2>
            </div>

            <p>
              PhilaLink keeps essential
              treatment and support
              information connected around
              the patient.
            </p>
          </div>


          <div className="services-list">
            {services.map(
              ({
                icon: Icon,
                title,
                description,
              }) => (
                <article
                  key={
                    title
                  }
                  className="service-row"
                >
                  <div className="service-icon">
                    <Icon
                      size={
                        22
                      }
                    />
                  </div>

                  <div className="service-content">
                    <h3>
                      {
                        title
                      }
                    </h3>

                    <p>
                      {
                        description
                      }
                    </p>
                  </div>

                  <ArrowUpRight
                    className="service-link-icon"
                    size={
                      19
                    }
                  />
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
        className="access-section"
      >
        <div className="section-container">

          <div className="section-header">
            <div>
              <span className="section-kicker">
                HEALTH TIPS
              </span>

              <h2>
                Small habits can make
                healthcare easier to manage.
              </h2>
            </div>

            <p>
              Simple reminders that can help
              you stay organised and more
              informed about your healthcare.
            </p>
          </div>


          <div className="journey-grid">
            {healthTips.map(
              ({
                number,
                title,
                description,
              }) => (
                <article
                  key={
                    number
                  }
                  className="journey-item"
                >
                  <span className="journey-number">
                    {
                      number
                    }
                  </span>

                  <h3>
                    {
                      title
                    }
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
      {/* PATIENT FOCUS */}
      {/* SAME STYLE AS HEALTH TIPS HEADER */}
      {/* ===================================== */}

      <section className="access-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-kicker">
                BUILT AROUND THE PATIENT
              </span>

              <h2>
                One healthcare journey.
                One connected view.
              </h2>
            </div>

            <p>
              Medication, collections,
              appointments and the people
              supporting treatment can all
              be understood through one
              connected platform.
            </p>
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

          <div className="footer-main">

            {/* ============================= */}
            {/* FOOTER BRAND */}
            {/* ============================= */}

            <div className="footer-brand">
              <Link
                to="/"
                onClick={
                  scrollToTop
                }
                className="footer-logo"
                aria-label="Go to PhilaLink home"
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

              <p>
                Connecting patients,
                healthcare workers and
                trusted proxies through
                simpler digital healthcare.
              </p>
            </div>


            <div className="footer-columns">

              {/* ============================= */}
              {/* PLATFORM */}
              {/* ============================= */}

              <div>
                <h4>
                  Platform
                </h4>

                <a href="#home">
                  Home
                </a>

                <a href="#about">
                  About
                </a>

                <a href="#services">
                  Services
                </a>

                <a href="#health-tips">
                  Health Tips
                </a>

                <a href="#contacts">
                  Contacts
                </a>
              </div>


              {/* ============================= */}
              {/* ACCESS */}
              {/* ============================= */}

              <div>
                <h4>
                  Access
                </h4>

                <Link to="/register">
                  Create account
                </Link>

                <Link to="/login">
                  Log in
                </Link>

                <Link to="/forgot-password">
                  Forgot password
                </Link>
              </div>


              {/* ============================= */}
              {/* SUPPORT */}
              {/* ============================= */}

              <div>
                <h4>
                  Support
                </h4>

                <div className="footer-support">
                  <PhoneCall
                    size={
                      17
                    }
                  />

                  <div>
                    <span>
                      Emergency
                    </span>

                    <strong>
                      112
                    </strong>
                  </div>
                </div>

                <div className="footer-support">
                  <Building2
                    size={
                      17
                    }
                  />

                  <div>
                    <span>
                      Platform
                    </span>

                    <strong>
                      PhilaLink
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ============================= */}
          {/* FOOTER BOTTOM */}
          {/* ============================= */}

          <div className="footer-bottom">
            <span>
              © 2026 PhilaLink.
              All rights reserved.
            </span>

            <button
              type="button"
              onClick={
                scrollToTop
              }
              className="back-to-top"
              aria-label="Back to top"
            >
              Back to top

              <ArrowUpRight
                size={
                  15
                }
              />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
