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
    number: "01",
    icon: Pill,
    title: "Medication",
    description:
      "Keep medication, schedules and treatment information together instead of relying on memory or separate notes.",
    details: [
      "View medications recorded against the patient profile together with dosage and treatment information.",
      "See active medication schedules and the expected times for recorded doses.",
      "Record medication activity and use completed collection information to support supply estimates.",
    ],
  },

  {
    number: "02",
    icon: CalendarDays,
    title: "Collections",
    description:
      "Know when medication collection is due, what has already been collected and where the next collection fits into care.",
    details: [
      "Patients can review collection history and the next scheduled medication collection linked to their account.",
      "Collection records connect the patient, clinic, scheduled date, current status and medication being collected.",
      "Nurses manage medication collection activity through the clinic workflow.",
    ],
  },

  {
    number: "03",
    icon: Bell,
    title: "Reminders",
    description:
      "Bring medication, appointment and collection updates into one notification flow.",
    details: [
      "Medication reminders are generated from active medication schedules.",
      "Appointment changes can surface through the patient's notification experience.",
      "Notification records support unread and read states so important healthcare activity remains visible.",
    ],
  },

  {
    number: "04",
    icon: Users,
    title: "Proxy support",
    description:
      "Give a trusted caregiver the information they need without opening unrelated patient information.",
    details: [
      "Proxy access depends on an active patient-proxy relationship rather than general access to patient records.",
      "Linked patients and their collection information are limited to the proxy's authorised scope.",
      "The proxy experience helps caregivers keep track of upcoming and overdue collection activity.",
    ],
  },

  {
    number: "05",
    icon: MessageCircle,
    title: "Phila Chat",
    description:
      "Ask for healthcare information while keeping patient context and privacy choices inside the PhilaLink experience.",
    details: [
      "Patients can return to an active conversation and previously stored conversation messages.",
      "Urgent symptom wording is intercepted before ordinary assistant responses and directs the patient toward appropriate care.",
      "Patients control whether stored PhilaLink profile information may be used as assistant context.",
    ],
  },

  {
    number: "06",
    icon: ShieldCheck,
    title: "Secure access",
    description:
      "Keep patient, proxy, nurse and administrative responsibilities separated by authenticated role.",
    details: [
      "PhilaLink separates access across Patient, Proxy, Nurse, ClinicAdmin and SuperAdmin roles.",
      "Patient self-service resolves records from the authenticated account rather than accepting arbitrary patient identifiers.",
      "Clinic and relationship scope continues to be enforced by backend authorisation.",
    ],
  },
];


const careRoles = [
  {
    role: "Patient",
    description:
      "Medication, appointments, records, collection information, reminders and personal healthcare activity.",
  },

  {
    role: "Proxy",
    description:
      "Purpose-specific access to linked patients and the collection information needed to support them.",
  },

  {
    role: "Nurse",
    description:
      "Clinic patients, appointments, medication collections and day-to-day care workflows.",
  },

  {
    role: "Clinic administrator",
    description:
      "Clinic staff, inventory, reports, analytics and audit information within an assigned facility.",
  },

  {
    role: "System administrator",
    description:
      "Cross-clinic oversight, accounts, facilities, analytics, reports and platform governance.",
  },
];


const healthTips = [
  {
    title: "Take medication as directed",
    description:
      "Follow the dosage and timing provided by your healthcare professional. Ask a healthcare worker when treatment instructions are unclear.",
  },

  {
    title: "Plan before collection day",
    description:
      "Check your next collection date early enough to arrange transport or authorised proxy support when you need it.",
  },

  {
    title: "Keep your information current",
    description:
      "Accurate contact, treatment and appointment information makes it easier to keep your healthcare activity organised.",
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


      {/* ================================================= */}
      {/* HERO — UNCHANGED                                 */}
      {/* ================================================= */}

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


      <main className="landing-main">

        {/* ================================================= */}
        {/* ABOUT                                             */}
        {/* ================================================= */}

        <section
          id="about"
          className="landing-story"
        >
          <div className="section-container">
            <div className="story-grid">
              <div className="story-heading">
                <span className="section-kicker">
                  Why PhilaLink
                </span>

                <h2>
                  Healthcare is already
                  complicated enough.
                  Keeping track of it
                  should not be.
                </h2>
              </div>

              <div className="story-copy">
                <p className="story-lead">
                  Medication details,
                  collection dates,
                  appointments and caregiver
                  support often belong to the
                  same healthcare journey,
                  even when they are managed
                  in different places.
                </p>

                <p>
                  PhilaLink brings those
                  everyday activities into
                  one role-based system so
                  patients can understand
                  what is happening now,
                  what comes next and who
                  is involved.
                </p>
              </div>
            </div>

            <div className="story-statement">
              <p>
                The goal is not to add
                another healthcare screen.
              </p>

              <strong>
                It is to make the next
                healthcare action easier
                to understand.
              </strong>
            </div>
          </div>
        </section>


        {/* ================================================= */}
        {/* CARE JOURNEY                                      */}
        {/* ================================================= */}

        <section className="journey-editorial">
          <div className="section-container">
            <div className="journey-editorial-grid">
              <div className="journey-editorial-intro">
                <span className="section-kicker">
                  The everyday journey
                </span>

                <h2>
                  From today's medication
                  to the next clinic visit.
                </h2>

                <p>
                  PhilaLink is organised
                  around the sequence of
                  things people actually
                  need to keep track of.
                </p>
              </div>

              <div className="journey-editorial-list">
                <article>
                  <span>
                    Check
                  </span>

                  <div>
                    <h3>
                      See what needs attention.
                    </h3>

                    <p>
                      Review medication,
                      scheduled doses,
                      appointments and upcoming
                      collection information
                      from the same patient
                      experience.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    Act
                  </span>

                  <div>
                    <h3>
                      Record what happened.
                    </h3>

                    <p>
                      Medication activity,
                      appointments and
                      collection workflows
                      remain connected to the
                      healthcare record they
                      belong to.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    Support
                  </span>

                  <div>
                    <h3>
                      Bring in the right person.
                    </h3>

                    <p>
                      A trusted proxy can
                      support a linked patient
                      without being given
                      unrestricted access to
                      unrelated information.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    Follow
                  </span>

                  <div>
                    <h3>
                      Know what comes next.
                    </h3>

                    <p>
                      Notifications,
                      collection dates and
                      appointment information
                      keep upcoming healthcare
                      activity visible.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>


        {/* ================================================= */}
        {/* SERVICES                                          */}
        {/* ================================================= */}

        <section
          id="services"
          className="landing-services"
        >
          <div className="section-container">
            <div className="services-editorial-header">
              <span className="section-kicker">
                What you can do
              </span>

              <div>
                <h2>
                  The useful parts,
                  without the clutter.
                </h2>

                <p>
                  Each capability has a
                  practical place in the
                  healthcare journey.
                  Open any item for more
                  detail.
                </p>
              </div>
            </div>

            <div className="service-index">
              {services.map(
                ({
                  number,
                  icon: Icon,
                  title,
                  description,
                  details,
                }) => {
                  const isOpen =
                    openService ===
                    title;

                  return (
                    <article
                      key={title}
                      className={
                        isOpen
                          ? "service-index-item service-index-item-open"
                          : "service-index-item"
                      }
                    >
                      <button
                        type="button"
                        className="service-index-trigger"
                        aria-expanded={
                          isOpen
                        }
                        onClick={() =>
                          setOpenService(
                            isOpen
                              ? null
                              : title
                          )
                        }
                      >
                        <span className="service-index-number">
                          {number}
                        </span>

                        <span className="service-index-icon">
                          <Icon
                            size={19}
                            strokeWidth={1.7}
                          />
                        </span>

                        <span className="service-index-name">
                          {title}
                        </span>

                        <span className="service-index-summary">
                          {description}
                        </span>

                        <span className="service-index-action">
                          {isOpen
                            ? "Close"
                            : "Explore"}

                          <ArrowUpRight
                            size={16}
                          />
                        </span>
                      </button>

                      {isOpen ? (
                        <div className="service-index-details">
                          <div className="service-index-details-spacer" />

                          <div className="service-index-details-copy">
                            {details.map(
                              detail => (
                                <p
                                  key={
                                    detail
                                  }
                                >
                                  {detail}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                }
              )}
            </div>
          </div>
        </section>


        {/* ================================================= */}
        {/* ROLE-BASED CARE                                   */}
        {/* ================================================= */}

        <section className="care-network">
          <div className="section-container">
            <div className="care-network-heading">
              <span className="section-kicker section-kicker-light">
                One connected platform
              </span>

              <h2>
                Different people need
                different views of care.
              </h2>

              <p>
                PhilaLink does not give
                every user the same
                dashboard. Access follows
                the role and responsibility
                of the person who signed in.
              </p>
            </div>

            <div className="care-role-list">
              {careRoles.map(
                ({
                  role,
                  description,
                }) => (
                  <article
                    key={role}
                    className="care-role-row"
                  >
                    <h3>
                      {role}
                    </h3>

                    <p>
                      {description}
                    </p>

                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.6}
                    />
                  </article>
                )
              )}
            </div>
          </div>
        </section>


        {/* ================================================= */}
        {/* HEALTH TIPS                                       */}
        {/* ================================================= */}

        <section
          id="health-tips"
          className="health-notes"
        >
          <div className="section-container">
            <div className="health-notes-heading">
              <span className="section-kicker">
                Health tips
              </span>

              <h2>
                A few things worth
                keeping in mind.
              </h2>
            </div>

            <div className="health-notes-list">
              {healthTips.map(
                ({
                  title,
                  description,
                }) => (
                  <article
                    key={title}
                    className="health-note"
                  >
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

            <p className="health-note-disclaimer">
              PhilaLink supports healthcare
              organisation and access to
              information. It does not replace
              advice from a qualified doctor,
              nurse, pharmacist or other
              healthcare professional.
            </p>
          </div>
        </section>


        {/* ================================================= */}
        {/* SIMPLE ACCESS                                     */}
        {/* ================================================= */}

        <section className="landing-entry">
          <div className="section-container">
            <div className="landing-entry-row">
              <div>
                <span>
                  Ready to use PhilaLink?
                </span>

                <p>
                  Create a patient account
                  or sign in to continue.
                </p>
              </div>

              <div className="landing-entry-actions">
                <Link
                  to="/register"
                  className="landing-entry-primary"
                >
                  Create account

                  <ArrowUpRight
                    size={15}
                  />
                </Link>

                <Link
                  to="/login"
                  className="landing-entry-secondary"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>


      {/* ================================================= */}
      {/* FOOTER — UNCHANGED                                */}
      {/* ================================================= */}

      <footer
        id="contacts"
        className="landing-footer clean-footer"
      >
        <div className="section-container">
          <div className="clean-footer-main">
            <div className="clean-footer-brand">
              <Link
                to="/"
                onClick={scrollToTop}
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
                healthcare workers and trusted
                proxies through simpler digital
                healthcare.
              </p>
            </div>

            <div className="clean-footer-directory">
              <div>
                <span className="clean-footer-heading">
                  Platform
                </span>

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
              </div>

              <div>
                <span className="clean-footer-heading">
                  Access
                </span>

                <Link to="/register">
                  Create account
                </Link>

                <Link to="/login">
                  Sign in
                </Link>

                <Link to="/forgot-password">
                  Forgot password
                </Link>
              </div>

              <div>
                <span className="clean-footer-heading">
                  Support
                </span>

                <div className="clean-footer-support">
                  <PhoneCall size={16} />

                  <div>
                    <small>
                      Emergency
                    </small>

                    <strong>
                      112
                    </strong>
                  </div>
                </div>

                <div className="clean-footer-support">
                  <Building2 size={16} />

                  <div>
                    <small>
                      Platform
                    </small>

                    <strong>
                      PhilaLink
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="clean-footer-bottom">
            <span>
              © 2026 PhilaLink.
              All rights reserved.
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="back-to-top"
              aria-label="Back to top"
            >
              Back to top

              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
