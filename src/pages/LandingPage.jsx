import {
  useEffect,
  useState,
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
    details: [
      "See medications recorded for your patient profile, including whether treatment is active, upcoming, ended or inactive.",
      "Review medication names, dosage information and the treatment details connected to each prescription.",
      "View active medication schedules and the times of day when each recorded dose is expected to be taken.",
      "Track daily medication activity by recording doses as taken or skipped so treatment progress stays visible.",
      "PhilaLink estimates remaining medication supply from completed collections, recorded dose size, active schedules and doses already marked as taken.",
      "Supply information can show estimated days remaining and also explains when a calculation is unavailable because collection, schedule or dose information is missing.",
    ],
  },

  {
    icon: CalendarDays,
    title: "Collections",
    description:
      "See when medication collection is due and keep upcoming collection information easy to find.",
    details: [
      "Patients can view their medication collection history and the next scheduled collection linked to their own account.",
      "Collection records connect the patient, clinic, scheduled collection date, current status and the medication items being prepared or collected.",
      "Upcoming collection information helps patients see what is due next instead of having to track dates separately.",
      "Nurses use the collection workflow to schedule and manage medication collections as part of normal clinic operations.",
      "Trusted proxies can see collection information only for patients who are actively linked to them and within the proxy's authorised clinic scope.",
      "Completed collections also feed into medication-supply calculations, helping PhilaLink estimate how long a patient's collected medication should last.",
    ],
  },

  {
    icon: Bell,
    title: "Reminders",
    description:
      "Stay informed about appointments, medication collections and important healthcare activity.",
    details: [
      "Medication reminders are generated from each active medication schedule when the scheduled dose time is reached.",
      "PhilaLink avoids repeating a medication reminder when the patient has already recorded a taken or skipped dose around that scheduled time.",
      "Patients can receive appointment updates when an appointment is created, rescheduled, confirmed, cancelled or otherwise changed.",
      "Medication and appointment reminder preferences are stored per patient so supported reminder types can be enabled or disabled.",
      "The notification feed keeps healthcare updates together, supports unread and read states, and allows individual or all notifications to be marked as read.",
      "Proxy collection reminders are restricted to valid linked patients, and stale reminders are removed when a proxy relationship or clinic scope is no longer valid.",
    ],
  },

  {
    icon: Users,
    title: "Proxy support",
    description:
      "Connect trusted people who can support medication collection for linked patients.",
    details: [
      "A proxy account supports patients through an explicit active patient-proxy relationship rather than receiving general access to clinic records.",
      "Proxy access is limited to linked patients who are active and belong to the same authorised clinic scope as the proxy.",
      "The proxy dashboard can show linked patients together with their next medication collection date and current collection status.",
      "Collection summaries distinguish activity such as due today, tomorrow, upcoming and overdue so support can be prioritised.",
      "Proxies can search and filter the collection records they are authorised to view, including by linked patient, date range and collection status.",
      "Requests for patients or collections outside the proxy's authorised relationships are intentionally hidden instead of exposing whether those records exist.",
    ],
  },

  {
    icon: MessageCircle,
    title: "Phila Chat",
    description:
      "Access the PhilaLink assistant for simple healthcare information and support.",
    details: [
      "Phila Chat keeps an active patient conversation and stores the messages in that conversation so the patient can return to their chat history.",
      "Emergency and urgent symptom wording is intercepted before the external AI response and directs the patient toward appropriate professional or emergency care.",
      "Patients control whether Phila Chat may use information from their stored PhilaLink profile through the profile-access preference.",
      "When profile access is disabled, stored medications, supply, allergies, conditions, assessments, collection history and old chat history are not sent to the AI provider.",
      "When access is enabled, the assistant can use relevant stored context such as active medications, schedules, taken-dose logs, allergies, medical conditions and the latest symptom assessment.",
      "Medication-supply and completed-collection context can also be included so responses can reflect information already recorded in PhilaLink while remaining subject to the patient's privacy setting.",
    ],
  },

  {
    icon: ShieldCheck,
    title: "Secure access",
    description:
      "Healthcare information stays organised around verified users and role-based access.",
    details: [
      "PhilaLink uses authenticated JWT sessions and separates access across Patient, Proxy, Nurse, ClinicAdmin and SuperAdmin roles.",
      "Patient self-service endpoints resolve the patient from the authenticated identity so a patient cannot simply request another patient's record by supplying an ID.",
      "Proxy access is relationship-scoped, while nurses and clinic administrators are restricted to the clinic and responsibilities assigned to their role.",
      "Administrator-created staff accounts use temporary passwords and must replace them before ordinary protected API access is allowed.",
      "Patient verification and password recovery use OTP-based flows, while password rules require a stronger combination of length, uppercase, lowercase, number and special character.",
      "Sensitive validation and authorisation remain enforced by the backend, with important clinical and administrative activity designed to remain auditable.",
    ],
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

  const [
    openService,
    setOpenService,
  ] = useState(null);


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


  const scrollToTop =
    () => {
      window.scrollTo({
        top: 0,

        behavior:
          "smooth",
      });
    };


  return (
    <div className="landing-page">
      <NavigationPage />


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
                details,
              }) => {
                const isOpen =
                  openService ===
                  title;

                const toggleService =
                  () => {
                    setOpenService(
                      isOpen
                        ? null
                        : title
                    );
                  };

                return (
                  <article
                    key={
                      title
                    }
                    className={
                      `service-row${
                        isOpen
                          ? " service-row-open"
                          : ""
                      }`
                    }
                    role="button"
                    tabIndex={0}
                    aria-expanded={
                      isOpen
                    }
                    onClick={
                      toggleService
                    }
                    onKeyDown={
                      event => {
                        if (
                          event.key ===
                            "Enter" ||
                          event.key ===
                            " "
                        ) {
                          event.preventDefault();
                          toggleService();
                        }
                      }
                    }
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

                      <p className="service-summary">
                        {
                          description
                        }
                      </p>
                    </div>

                    <ArrowUpRight
                      className={
                        `service-link-icon${
                          isOpen
                            ? " service-link-icon-open"
                            : ""
                        }`
                      }
                      size={
                        19
                      }
                    />

                    {isOpen && (
                      <div className="service-details">
                        {details.map(
                          (
                            detail,
                            index
                          ) => (
                            <p
                              key={
                                `${title}-${index}`
                              }
                              className="service-detail-line"
                            >
                              {
                                detail
                              }
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>
        </div>
      </section>


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


      <footer
        id="contacts"
        className="landing-footer"
      >
        <div className="section-container">
          <div className="footer-main">
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
