import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  homePathForRole,
} from "../../routes/ProtectedRoute.jsx";

import {
  acknowledgePrivacyPolicy,
  acceptTermsOfUse,
  getLegalStatus,
} from "../../services/legalDocumentService.js";

// =====================================================
// LEGAL DOCUMENT DATA
// =====================================================

const LAST_UPDATED =
  "21 September 2026";

const PRIVACY_SECTIONS = [
  {
    number: "1",
    title: "Introduction",
    paragraphs: [
      `PhilaLink is a digital healthcare support platform designed to help patients, healthcare workers and authorised proxies manage healthcare-related information, medication collections, appointments and related services.`,
      `PhilaLink respects the privacy of its users and aims to process personal information responsibly and in accordance with applicable South African data protection law, including the Protection of Personal Information Act 4 of 2013 ("POPIA").`,
      `This Privacy Policy should be read together with the PhilaLink Terms of Use and the cookie information made available through the platform.`,
    ],
  },
  {
    number: "2",
    title: "Personal information we may collect",
    paragraphs: [
      `Depending on how PhilaLink is used, the platform may process the following categories of information:`,
    ],
    bullets: [
      `identity information, including name, identity number, date of birth and gender;`,
      `contact information, including email address, telephone number and address information;`,
      `account information, including account role, verification status and security-related account information;`,
      `clinic and healthcare-provider information associated with the user's care;`,
      `medication information, medication schedules, medication logs and medication collection information;`,
      `appointment information;`,
      `health-related information voluntarily provided or recorded through PhilaLink;`,
      `symptom-assessment information submitted through PhilaLink features;`,
      `information about authorised proxy relationships;`,
      `emergency-contact information;`,
      `location information when the user chooses to allow location access for location-based features such as finding nearby healthcare facilities;`,
      `notification and communication preferences;`,
      `technical information required for security, authentication and operation of the platform; and`,
      `cookie choices and other permitted browser preferences.`,
    ],
  },
  {
    number: "3",
    title: "Health information",
    paragraphs: [
      `Some information processed through PhilaLink concerns a person's health and healthcare. Health information is sensitive and is treated as special personal information under POPIA.`,
      `PhilaLink is designed so that access to healthcare information is restricted according to the user's authorised role and relationship with the relevant patient.`,
    ],
  },
  {
    number: "4",
    title: "Why we process personal information",
    paragraphs: [
      `Personal information may be processed where necessary to provide and operate PhilaLink features, including:`,
    ],
    bullets: [
      `creating, verifying and securing user accounts;`,
      `authenticating users and controlling access according to user roles;`,
      `displaying medication and treatment-related information;`,
      `managing medication schedules, logs and collection information;`,
      `managing healthcare appointments;`,
      `connecting patients with authorised proxies;`,
      `providing reminders and notifications;`,
      `providing nearby healthcare facility information where the user enables location access;`,
      `providing chatbot and symptom-assessment functionality;`,
      `maintaining security, audit records and system integrity;`,
      `responding to user requests and providing support; and`,
      `complying with applicable legal obligations.`,
    ],
  },
  {
    number: "5",
    title: "How information is collected",
    paragraphs: [
      `Information may be collected directly from users when they register, update their profile, submit information, use PhilaLink services or communicate through the platform.`,
      `Information may also be added or updated by authorised healthcare staff or other authorised users where their role permits them to perform the relevant action.`,
      `Certain technical information may be generated automatically when a person uses the platform.`,
    ],
  },
  {
    number: "6",
    title: "Who may access personal information",
    paragraphs: [
      `Access to information within PhilaLink is role-based. Depending on the circumstances, information may be accessible to:`,
    ],
    bullets: [
      `the patient to whom the information relates;`,
      `an authorised proxy where the proxy has been formally linked to the patient;`,
      `authorised healthcare workers;`,
      `authorised clinic administrators;`,
      `authorised system administrators where required for system administration and security; and`,
      `service providers that support the technical operation of the platform, subject to appropriate access restrictions.`,
    ],
    trailingParagraphs: [
      `Users must not attempt to access information that they are not authorised to view.`,
    ],
  },
  {
    number: "7",
    title: "Third-party service providers",
    paragraphs: [
      `PhilaLink may use third-party technology providers for services such as hosting, database infrastructure, authentication, email delivery, weather information and artificial intelligence functionality.`,
      `Only information reasonably necessary for the relevant service should be shared with such providers.`,
      `Some external providers may process information using infrastructure located outside South Africa. Where applicable, cross-border processing should be handled in accordance with applicable data protection requirements.`,
    ],
  },
  {
    number: "8",
    title: "Google sign-in",
    paragraphs: [
      `If a user chooses to use Google sign-in, information required to authenticate that user may be exchanged with Google as part of the authentication process.`,
      `Google's own processing of information is subject to Google's policies and services. PhilaLink does not control cookies or information processing performed directly on Google's systems.`,
    ],
  },
  {
    number: "9",
    title: "Artificial intelligence features",
    paragraphs: [
      `PhilaLink may provide AI-assisted features, including chatbot functionality.`,
      `Users should avoid submitting information that is not reasonably necessary for the question or feature they are using.`,
      `AI-generated responses may contain errors and must not be treated as a substitute for diagnosis, treatment or advice from a qualified healthcare professional.`,
    ],
  },
  {
    number: "10",
    title: "Location information",
    paragraphs: [
      `Some features may request access to a device's location, for example to identify nearby clinics or healthcare facilities.`,
      `Location access depends on the user's browser or device permission. A user may refuse or withdraw location permission using the settings of their browser or device.`,
    ],
  },
  {
    number: "11",
    title: "Cookies",
    paragraphs: [
      `PhilaLink uses a cookie to remember the user's cookie preference. Essential cookies may also be used where required for security and core website functionality.`,
      `Optional preference cookies are used only where the user permits them.`,
      `PhilaLink's cookie-consent file does not store medication records, health records, passwords or API credentials.`,
    ],
  },
  {
    number: "12",
    title: "Information security",
    paragraphs: [
      `PhilaLink uses technical and organisational safeguards intended to protect personal information against unauthorised access, disclosure, alteration, loss or misuse.`,
      `These safeguards may include authenticated access, role-based authorisation, password controls, encrypted network communication, audit logging, request-rate controls and restricted access to system credentials.`,
      `No internet-connected system can guarantee absolute security. Users are responsible for keeping their own login credentials secure and for reporting suspected unauthorised access.`,
    ],
  },
  {
    number: "13",
    title: "Retention of information",
    paragraphs: [
      `Personal information should be retained only for as long as it is reasonably required for the purpose for which it was collected, for legitimate operational needs, or where retention is required or permitted by applicable law.`,
      `When information is no longer required and there is no lawful reason to retain it, appropriate deletion, destruction or de-identification measures should be applied.`,
    ],
  },
  {
    number: "14",
    title: "Your rights",
    paragraphs: [
      `Subject to applicable law, a person may have rights concerning their personal information, including the right to:`,
    ],
    bullets: [
      `ask whether PhilaLink holds personal information about them;`,
      `request access to their personal information;`,
      `request correction of inaccurate, incomplete or outdated information;`,
      `request deletion or destruction where the information is no longer lawfully required;`,
      `object to certain processing where permitted by law;`,
      `withdraw consent where a particular processing activity relies on consent; and`,
      `lodge a complaint with the Information Regulator of South Africa where appropriate.`,
    ],
  },
  {
    number: "15",
    title: "Privacy requests",
    paragraphs: [
      `Privacy, access or correction requests should be submitted through the contact or support channels made available by PhilaLink or through the relevant clinic where appropriate.`,
      `PhilaLink may need to verify the identity of the person making a request before disclosing or modifying personal information.`,
    ],
  },
  {
    number: "16",
    title: "Children",
    paragraphs: [
      `Where personal information relating to a child is processed, additional legal requirements may apply. PhilaLink should not be used to create or manage a child's account unless the required authority or legal basis for processing that information exists.`,
    ],
  },
  {
    number: "17",
    title: "Changes to this Privacy Policy",
    paragraphs: [
      `This Privacy Policy may be updated when PhilaLink features, technologies or legal requirements change.`,
      `The latest version will be made available through the platform and will show its most recent update date.`,
    ],
  },
  {
    number: "18",
    title: "Applicable law",
    paragraphs: [
      `This Privacy Policy is intended to operate within the framework of applicable South African law, including POPIA.`,
    ],
  },
];

const TERMS_SECTIONS = [
  {
    number: "1",
    title: "Acceptance of these Terms",
    paragraphs: [
      `By creating an account or using PhilaLink, you agree to comply with these Terms of Use.`,
      `If you do not agree with these Terms, you should not create an account or continue using the platform.`,
    ],
  },
  {
    number: "2",
    title: "Purpose of PhilaLink",
    paragraphs: [
      `PhilaLink is intended to support healthcare administration and communication by connecting patients, healthcare workers, clinics and authorised proxies.`,
      `Features may include medication information, medication logging, medication collections, appointments, notifications, nearby-clinic information, symptom-assessment tools and healthcare information provided through digital assistance features.`,
    ],
  },
  {
    number: "3",
    title: "PhilaLink is not an emergency service",
    paragraphs: [
      `PhilaLink is not an emergency medical service.`,
      `If you believe that you or another person is experiencing a medical emergency, contact the appropriate emergency service immediately. In South Africa, the general emergency number from a mobile phone is 112.`,
      `Do not delay emergency medical care while waiting for information from PhilaLink.`,
    ],
  },
  {
    number: "4",
    title: "No substitute for professional medical advice",
    paragraphs: [
      `Information provided through PhilaLink is intended to support healthcare management and general information.`,
      `PhilaLink does not replace a qualified doctor, nurse, pharmacist or other healthcare professional.`,
      `Users should follow the treatment instructions provided by their healthcare professionals and should seek professional medical advice when they have questions about symptoms, medication, diagnosis or treatment.`,
    ],
  },
  {
    number: "5",
    title: "Accounts",
    paragraphs: [
      `Users must provide accurate information when registering for or using PhilaLink.`,
      `Users are responsible for maintaining the confidentiality of their login credentials and must not knowingly allow an unauthorised person to use their account.`,
      `A user must notify the appropriate PhilaLink support or clinic contact if they believe their account has been compromised.`,
    ],
  },
  {
    number: "6",
    title: "Role-based access",
    paragraphs: [
      `PhilaLink provides different permissions to different user roles, including patients, proxies, nurses and administrators.`,
      `Users may access only the information and functions that their authorised role permits.`,
      `Attempting to bypass access controls, obtain another person's healthcare information without authority, or misuse another person's account is prohibited.`,
    ],
  },
  {
    number: "7",
    title: "Patient responsibilities",
    paragraphs: [
      `Patients should keep their profile and relevant healthcare information reasonably accurate and current.`,
      `Medication logging and reminders are intended to assist the patient but do not replace the patient's responsibility to follow advice given by healthcare professionals.`,
    ],
  },
  {
    number: "8",
    title: "Proxy access",
    paragraphs: [
      `A proxy may access only information made available through an active, authorised relationship with a patient.`,
      `Proxy access must be used solely for legitimate healthcare-support activities associated with the linked patient.`,
      `A proxy must not disclose or misuse patient information obtained through PhilaLink.`,
    ],
  },
  {
    number: "9",
    title: "Healthcare staff and administrators",
    paragraphs: [
      `Healthcare workers and administrators must use PhilaLink only within the authority granted by their role and organisation.`,
      `Clinic-specific users must not attempt to view or modify information belonging to another clinic unless their authorised role expressly permits such access.`,
    ],
  },
  {
    number: "10",
    title: "Artificial intelligence and chatbot features",
    paragraphs: [
      `PhilaLink may include AI-generated information. Artificial intelligence can make mistakes, misunderstand questions or provide incomplete information.`,
      `AI-generated content must not be relied upon as a diagnosis, prescription, emergency assessment or substitute for professional healthcare advice.`,
      `Users should seek appropriate professional assistance where healthcare decisions are required.`,
    ],
  },
  {
    number: "11",
    title: "Medication information",
    paragraphs: [
      `Medication information displayed through PhilaLink is intended to reflect information available to the platform.`,
      `Users should not change, start or stop medication solely because of information displayed by PhilaLink. Treatment changes should be discussed with an appropriate healthcare professional.`,
    ],
  },
  {
    number: "12",
    title: "Location and third-party information",
    paragraphs: [
      `Features such as nearby clinic searches, maps, weather information or external directions may depend on third-party services.`,
      `PhilaLink cannot guarantee that third-party location, mapping, weather or facility information is always complete, current or accurate.`,
    ],
  },
  {
    number: "13",
    title: "Acceptable use",
    paragraphs: [
      `Users must not:`,
    ],
    bullets: [
      `use PhilaLink for unlawful purposes;`,
      `attempt to gain unauthorised access to another account, patient record, clinic or system;`,
      `impersonate another person;`,
      `submit intentionally false or harmful information;`,
      `interfere with or attempt to disable platform security;`,
      `attempt to obtain passwords, access tokens, API credentials or other protected credentials;`,
      `automate excessive requests or otherwise abuse platform resources;`,
      `attempt to exploit chatbot, weather or other third-party integrations; or`,
      `use information obtained through PhilaLink in a way that violates another person's privacy or applicable law.`,
    ],
  },
  {
    number: "14",
    title: "Security controls",
    paragraphs: [
      `PhilaLink may apply authentication, authorisation, request-rate limits, audit logging, account verification and other security measures.`,
      `Attempts to circumvent these controls may result in access being restricted or suspended.`,
    ],
  },
  {
    number: "15",
    title: "Availability of the platform",
    paragraphs: [
      `PhilaLink may occasionally be unavailable because of maintenance, hosting-provider interruptions, internet connectivity, technical failures or third-party service outages.`,
      `Continuous or uninterrupted availability cannot be guaranteed.`,
    ],
  },
  {
    number: "16",
    title: "Privacy",
    paragraphs: [
      `Personal information processed through PhilaLink is governed by the PhilaLink Privacy Policy and applicable data protection law.`,
      `Users should review the Privacy Policy before submitting personal or healthcare information through the platform.`,
    ],
    link: {
      to: "/privacy-policy",
      label: "Read the PhilaLink Privacy Policy",
    },
  },
  {
    number: "17",
    title: "Intellectual property",
    paragraphs: [
      `Unless otherwise stated, PhilaLink's original software, branding, interface design and platform content remain subject to applicable intellectual-property rights.`,
      `Third-party names, services, libraries and content remain the property of their respective owners.`,
    ],
  },
  {
    number: "18",
    title: "Account restriction or suspension",
    paragraphs: [
      `Access may be restricted, suspended or deactivated where reasonably necessary to protect patients, users, healthcare information, system security or platform integrity.`,
      `Access may also be restricted when an account is inactive, unauthorised or used in breach of these Terms.`,
    ],
  },
  {
    number: "19",
    title: "Limitation of responsibility",
    paragraphs: [
      `PhilaLink is intended to support, rather than replace, healthcare services and professional judgement.`,
      `To the extent permitted by applicable law, PhilaLink is not responsible for decisions made solely on the basis of inaccurate, incomplete or unavailable third-party information, AI-generated content or information entered incorrectly by users.`,
      `Nothing in these Terms is intended to exclude rights or protections that cannot lawfully be excluded.`,
    ],
  },
  {
    number: "20",
    title: "Changes to these Terms",
    paragraphs: [
      `These Terms may be updated when PhilaLink functionality, technology, security requirements or applicable law changes.`,
      `The most recent version will be made available through the platform.`,
    ],
  },
  {
    number: "21",
    title: "Governing law",
    paragraphs: [
      `These Terms are intended to be interpreted in accordance with applicable law in the Republic of South Africa.`,
    ],
  },
];

// =====================================================
// SHARED LEGAL CONTENT
// =====================================================

function LegalSection({
  section,
}) {
  return (
    <section className="mb-8">
      <h2
        className="mb-3 mt-0 font-serif text-xl font-bold"
        style={{
          fontFamily:
            '"Times New Roman", Times, serif',
        }}
      >
        {section.number}.{" "}
        {section.title}
      </h2>

      <div className="space-y-3">
        {(section.paragraphs || []).map(
          (
            paragraph,
            index
          ) => (
            <p
              key={`${section.number}-p-${index}`}
            >
              {paragraph}
            </p>
          )
        )}

        {section.bullets?.length >
          0 && (
          <ul className="ml-6 list-disc space-y-2">
            {section.bullets.map(
              (
                bullet,
                index
              ) => (
                <li
                  key={`${section.number}-b-${index}`}
                >
                  {bullet}
                </li>
              )
            )}
          </ul>
        )}

        {(section.trailingParagraphs ||
          []).map(
          (
            paragraph,
            index
          ) => (
            <p
              key={`${section.number}-t-${index}`}
            >
              {paragraph}
            </p>
          )
        )}

        {section.link && (
          <p>
            <Link
              to={
                section.link.to
              }
              className="text-black underline underline-offset-4"
            >
              {
                section.link
                  .label
              }
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

function LegalContent({
  sections,
}) {
  return (
    <>
      {sections.map(
        (section) => (
          <LegalSection
            key={
              section.number
            }
            section={
              section
            }
          />
        )
      )}
    </>
  );
}

// =====================================================
// PUBLIC DOCUMENT LAYOUT
// =====================================================

function LegalDocument({
  title,
  subtitle,
  children,
}) {
  const handlePrint =
    () => {
      window.print();
    };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-[900px] px-5 py-10 sm:px-8 md:py-14 lg:px-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-black pb-4 print:hidden">
          <Link
            to="/"
            className="text-sm font-medium text-black underline underline-offset-4"
          >
            Back to PhilaLink
          </Link>

          <button
            type="button"
            onClick={
              handlePrint
            }
            className="border border-black bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            Print
          </button>
        </div>

        <header className="border-b-2 border-black pb-8 text-center">
          <h1
            className="m-0 font-serif text-3xl font-bold uppercase tracking-wide sm:text-4xl"
            style={{
              fontFamily:
                '"Times New Roman", Times, serif',
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="mx-auto mt-4 max-w-[700px] font-serif text-base leading-7"
              style={{
                fontFamily:
                  '"Times New Roman", Times, serif',
              }}
            >
              {subtitle}
            </p>
          )}

          <p
            className="mt-5 font-serif text-sm"
            style={{
              fontFamily:
                '"Times New Roman", Times, serif',
            }}
          >
            Last updated:{" "}
            {LAST_UPDATED}
          </p>
        </header>

        <main
          className="py-9 font-serif text-[16px] leading-[1.8]"
          style={{
            fontFamily:
              '"Times New Roman", Times, serif',
          }}
        >
          {children}
        </main>

        <footer className="border-t border-black pt-5 text-center">
          <p
            className="m-0 font-serif text-sm"
            style={{
              fontFamily:
                '"Times New Roman", Times, serif',
            }}
          >
            PhilaLink
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 print:hidden">
            <Link
              to="/privacy-policy"
              className="text-sm text-black underline underline-offset-4"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-of-use"
              className="text-sm text-black underline underline-offset-4"
            >
              Terms of Use
            </Link>

            <Link
              to="/"
              className="text-sm text-black underline underline-offset-4"
            >
              Home
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

// =====================================================
// PUBLIC PRIVACY POLICY
// =====================================================

export function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      subtitle="This Privacy Policy explains how PhilaLink collects, uses, stores, shares and protects personal information when people use the PhilaLink platform."
    >
      <LegalContent
        sections={
          PRIVACY_SECTIONS
        }
      />
    </LegalDocument>
  );
}

// =====================================================
// PUBLIC TERMS OF USE
// =====================================================

export function TermsOfUsePage() {
  return (
    <LegalDocument
      title="Terms of Use"
      subtitle="These Terms of Use govern access to and use of the PhilaLink digital healthcare support platform."
    >
      <LegalContent
        sections={
          TERMS_SECTIONS
        }
      />
    </LegalDocument>
  );
}

// =====================================================
// ACCEPTANCE HELPERS
// =====================================================

const normalizeType = (
  value = ""
) =>
  String(value)
    .replace(
      /[\s_-]/g,
      ""
    )
    .toLowerCase();

const isTermsDocument = (
  document
) =>
  normalizeType(
    document?.type
  ) ===
  "termsofuse";

const isPrivacyDocument = (
  document
) =>
  normalizeType(
    document?.type
  ) ===
  "privacypolicy";

const documentOrder = (
  document
) => {
  if (
    isTermsDocument(
      document
    )
  ) {
    return 0;
  }

  if (
    isPrivacyDocument(
      document
    )
  ) {
    return 1;
  }

  return 99;
};

const getSectionsForDocument = (
  document
) => {
  if (
    isTermsDocument(
      document
    )
  ) {
    return TERMS_SECTIONS;
  }

  if (
    isPrivacyDocument(
      document
    )
  ) {
    return PRIVACY_SECTIONS;
  }

  return [];
};

const getConfirmationLabel = (
  document
) => {
  if (
    isTermsDocument(
      document
    )
  ) {
    return "I have read and accept these Terms of Use.";
  }

  if (
    isPrivacyDocument(
      document
    )
  ) {
    return "I have read and acknowledge this Privacy Policy.";
  }

  return "I have reviewed this document.";
};

// =====================================================
// REQUIRED LEGAL ACCEPTANCE PAGE
// =====================================================

export function LegalAcceptancePage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    role,
    isAuthenticated,
    isLoading:
      authLoading,
    mustChangePassword,
  } = useAuth();

  const scrollRefs =
    useRef({});

  const [
    legalStatus,
    setLegalStatus,
  ] = useState(null);

  const [
    reachedEnd,
    setReachedEnd,
  ] = useState({});

  const [
    confirmed,
    setConfirmed,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const defaultHome =
    useMemo(
      () =>
        homePathForRole(
          role
        ),
      [role]
    );

  const returnTo =
    useMemo(() => {
      const params =
        new URLSearchParams(
          location.search
        );

      const fromQuery =
        params.get(
          "returnTo"
        );

      const statePath =
        location.state
          ?.from
          ?.pathname;

      const stateSearch =
        location.state
          ?.from
          ?.search ||
        "";

      const stateHash =
        location.state
          ?.from
          ?.hash ||
        "";

      const fromState =
        statePath
          ? `${statePath}${stateSearch}${stateHash}`
          : null;

      const candidate =
        fromQuery ||
        fromState ||
        defaultHome;

      if (
        typeof candidate !==
          "string" ||
        !candidate.startsWith(
          "/"
        ) ||
        candidate.startsWith(
          "//"
        ) ||
        candidate.startsWith(
          "/legal-acceptance"
        )
      ) {
        return defaultHome;
      }

      return candidate;
    }, [
      defaultHome,
      location.search,
      location.state,
    ]);

  const documents =
    useMemo(
      () => {
        const source =
          Array.isArray(
            legalStatus
              ?.documents
          )
            ? [
                ...legalStatus
                  .documents,
              ]
            : [];

        return source.sort(
          (
            a,
            b
          ) =>
            documentOrder(
              a
            ) -
            documentOrder(
              b
            )
        );
      },
      [legalStatus]
    );

  const pendingDocuments =
    useMemo(
      () =>
        documents.filter(
          (
            document
          ) =>
            document
              ?.hasAccepted !==
            true
        ),
      [documents]
    );

  useEffect(() => {
    let cancelled =
      false;

    const load =
      async () => {
        if (
          authLoading
        ) {
          return;
        }

        if (
          !isAuthenticated ||
          mustChangePassword
        ) {
          setLoading(
            false
          );

          return;
        }

        setLoading(
          true
        );

        setError("");

        try {
          const result =
            await getLegalStatus();

          if (
            cancelled
          ) {
            return;
          }

          setLegalStatus(
            result
          );

          if (
            result
              ?.requiresAction !==
            true
          ) {
            navigate(
              returnTo,
              {
                replace:
                  true,
              }
            );
          }
        } catch (
          requestError
        ) {
          if (
            cancelled
          ) {
            return;
          }

          setError(
            requestError
              ?.message ||
              "We could not load the required legal documents."
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      };

    load();

    return () => {
      cancelled =
        true;
    };
  }, [
    authLoading,
    isAuthenticated,
    mustChangePassword,
    navigate,
    returnTo,
  ]);

  useEffect(() => {
    if (
      loading ||
      legalStatus
        ?.requiresAction !==
        true ||
      submitting
    ) {
      return undefined;
    }

    const warnBeforeLeave =
      (
        event
      ) => {
        event.preventDefault();

        event.returnValue =
          "";
      };

    window.addEventListener(
      "beforeunload",
      warnBeforeLeave
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        warnBeforeLeave
      );
  }, [
    legalStatus,
    loading,
    submitting,
  ]);

  const markReachedEnd =
    (
      documentId
    ) => {
      const element =
        scrollRefs.current[
          documentId
        ];

      if (
        !element
      ) {
        return;
      }

      const remaining =
        element.scrollHeight -
        element.scrollTop -
        element.clientHeight;

      if (
        remaining <= 8
      ) {
        setReachedEnd(
          (
            current
          ) => ({
            ...current,
            [documentId]:
              true,
          })
        );
      }
    };

  const registerScrollRef =
    (
      documentId,
      element
    ) => {
      if (
        !element
      ) {
        return;
      }

      scrollRefs.current[
        documentId
      ] = element;

      requestAnimationFrame(
        () =>
          markReachedEnd(
            documentId
          )
      );
    };

  const allReady =
    pendingDocuments.length >
      0 &&
    pendingDocuments.every(
      (
        document
      ) =>
        reachedEnd[
          document.id
        ] === true &&
        confirmed[
          document.id
        ] === true
    );

  const handleContinue =
    async () => {
      if (
        !allReady ||
        submitting
      ) {
        return;
      }

      setSubmitting(
        true
      );

      setError("");

      try {
        for (
          const document
          of pendingDocuments
        ) {
          if (
            isTermsDocument(
              document
            )
          ) {
            await acceptTermsOfUse(
              document.id
            );

            continue;
          }

          if (
            isPrivacyDocument(
              document
            )
          ) {
            await acknowledgePrivacyPolicy(
              document.id
            );

            continue;
          }

          throw new Error(
            `Unsupported legal document type: ${document.type}`
          );
        }

        const refreshed =
          await getLegalStatus();

        setLegalStatus(
          refreshed
        );

        if (
          refreshed
            ?.requiresAction ===
          true
        ) {
          throw new Error(
            "One or more legal documents still require your attention."
          );
        }

        navigate(
          returnTo,
          {
            replace:
              true,
          }
        );
      } catch (
        requestError
      ) {
        setError(
          requestError
            ?.message ||
            "We could not record your legal acknowledgement. Please try again."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  if (
    authLoading
  ) {
    return (
      <LegalGateLoading
        label="Checking your session..."
      />
    );
  }

  if (
    !isAuthenticated
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location,
        }}
      />
    );
  }

  if (
    mustChangePassword
  ) {
    return (
      <Navigate
        to="/change-password"
        replace
      />
    );
  }

  if (
    loading
  ) {
    return (
      <LegalGateLoading
        label="Loading legal documents..."
      />
    );
  }

  if (
    error &&
    !legalStatus
  ) {
    return (
      <main className="min-h-screen bg-[#f5f5f2] px-5 py-12 text-black">
        <section className="mx-auto max-w-lg border border-black bg-white p-7 sm:p-9">
          <p className="text-sm font-extrabold">
            PhilaLink
          </p>

          <h1 className="mt-6 font-serif text-3xl font-bold">
            We couldn't load the required documents
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-600">
            PhilaLink needs to confirm your current legal status before opening your account.
          </p>

          <div
            className="mt-5 border border-red-700 p-4 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 border border-black bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-black">
      <header className="sticky top-0 z-30 border-b border-neutral-300 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-[1050px] items-center justify-between px-4 sm:px-6">
          <div>
            <p className="m-0 text-lg font-extrabold tracking-tight">
              PhilaLink
            </p>

            <p className="m-0 mt-0.5 text-xs text-neutral-500">
              Required legal acknowledgement
            </p>
          </div>

          <span className="hidden border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 sm:inline">
            Secure account step
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[920px] px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
            Before you continue
          </p>

          <h1
            className="m-0 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl"
            style={{
              fontFamily:
                '"Times New Roman", Times, serif',
            }}
          >
            Review the current PhilaLink legal documents
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
            Scroll to the end of every outstanding document. The acknowledgement control for that document will only become available after you reach the end.
          </p>
        </section>

        <div className="space-y-7">
          {pendingDocuments.map(
            (
              document,
              index
            ) => {
              const sections =
                getSectionsForDocument(
                  document
                );

              const read =
                reachedEnd[
                  document.id
                ] === true;

              const checked =
                confirmed[
                  document.id
                ] === true;

              return (
                <article
                  key={
                    document.id
                  }
                  className="border border-neutral-300 bg-white p-4 shadow-sm sm:p-7"
                >
                  <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                        Document{" "}
                        {index + 1}{" "}
                        of{" "}
                        {
                          pendingDocuments.length
                        }
                      </p>

                      <h2
                        className="mt-2 font-serif text-2xl font-bold"
                        style={{
                          fontFamily:
                            '"Times New Roman", Times, serif',
                        }}
                      >
                        {
                          document.title
                        }
                      </h2>

                      <p className="mt-1 text-xs text-neutral-500">
                        Version{" "}
                        {
                          document.version
                        }
                      </p>
                    </div>

                    <span
                      className={
                        read
                          ? "w-fit border border-black bg-black px-3 py-1.5 text-[11px] font-bold text-white"
                          : "w-fit border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-[11px] font-bold text-neutral-500"
                      }
                    >
                      {read
                        ? "Read to end"
                        : "Scroll required"}
                    </span>
                  </div>

                  <div
                    ref={(
                      element
                    ) =>
                      registerScrollRef(
                        document.id,
                        element
                      )
                    }
                    onScroll={() =>
                      markReachedEnd(
                        document.id
                      )
                    }
                    tabIndex={0}
                    className="h-[56vh] min-h-[340px] overflow-y-auto border border-neutral-400 bg-white px-5 py-8 font-serif leading-[1.8] outline-none focus:ring-2 focus:ring-black/10 sm:h-[560px] sm:px-10 sm:py-10"
                    style={{
                      fontFamily:
                        '"Times New Roman", Times, serif',
                    }}
                  >
                    <header className="mb-8 border-b-2 border-black pb-7 text-center">
                      <p className="m-0 text-xs font-bold uppercase tracking-[0.12em]">
                        PhilaLink
                      </p>

                      <h3 className="mt-4 text-3xl font-bold">
                        {
                          document.title
                        }
                      </h3>

                      <p className="mt-2 text-xs text-neutral-500">
                        Version{" "}
                        {
                          document.version
                        }{" "}
                        · Last updated{" "}
                        {
                          LAST_UPDATED
                        }
                      </p>
                    </header>

                    {sections.length >
                    0 ? (
                      <LegalContent
                        sections={
                          sections
                        }
                      />
                    ) : (
                      <p>
                        This legal document is not supported by the current PhilaLink frontend.
                      </p>
                    )}

                    <div className="mt-10 border-t border-black pt-5 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                      End of{" "}
                      {
                        document.title
                      }
                    </div>
                  </div>

                  {!read && (
                    <p className="mt-3 text-xs text-neutral-500">
                      Continue scrolling through the document to unlock the acknowledgement below.
                    </p>
                  )}

                  <label
                    className={
                      read
                        ? "mt-5 flex cursor-pointer items-start gap-3 border border-neutral-400 bg-neutral-50 p-4 text-sm leading-6"
                        : "mt-5 flex cursor-not-allowed items-start gap-3 border border-neutral-300 bg-neutral-100 p-4 text-sm leading-6 opacity-50"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={
                        checked
                      }
                      disabled={
                        !read ||
                        submitting
                      }
                      onChange={(
                        event
                      ) =>
                        setConfirmed(
                          (
                            current
                          ) => ({
                            ...current,
                            [document.id]:
                              event
                                .target
                                .checked,
                          })
                        )
                      }
                      className="mt-1 h-4 w-4 accent-black"
                    />

                    <span>
                      {
                        getConfirmationLabel(
                          document
                        )
                      }
                    </span>
                  </label>
                </article>
              );
            }
          )}
        </div>

        {error && (
          <div
            className="mt-6 border border-red-700 bg-white p-4 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        )}

        <section className="mt-7 flex flex-col justify-between gap-5 border border-neutral-300 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="m-0 text-sm font-bold">
              Complete all required documents
            </p>

            <p className="m-0 mt-1 max-w-xl text-xs leading-5 text-neutral-500">
              Protected PhilaLink pages remain unavailable until all current legal requirements are recorded by the backend.
            </p>
          </div>

          <button
            type="button"
            disabled={
              !allReady ||
              submitting
            }
            onClick={
              handleContinue
            }
            className="min-h-11 shrink-0 border border-black bg-black px-6 text-sm font-bold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            {submitting
              ? "Saving..."
              : "Accept and continue"}
          </button>
        </section>

        <footer className="flex flex-col justify-between gap-2 py-8 text-xs text-neutral-500 sm:flex-row">
          <span>
            PhilaLink
          </span>

          <span>
            Emergency assistance: 112
          </span>
        </footer>
      </div>
    </main>
  );
}

// =====================================================
// ACCEPTANCE LOADER
// =====================================================

function LegalGateLoading({
  label,
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f5f2] px-5 text-black">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />

        <p className="mt-4 text-sm text-neutral-600">
          {label}
        </p>
      </div>
    </main>
  );
}