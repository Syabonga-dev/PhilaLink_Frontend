import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  acknowledgePrivacyPolicy,
  acceptTermsOfUse,
  getLegalStatus,
} from "../../services/legalDocumentService";

// =====================================================
// AUTH TOKEN
// =====================================================

const TOKEN_KEYS = [
  "token",
  "authToken",
  "accessToken",
  "philalink_token",
];

const getStoredToken = () => {
  for (const key of TOKEN_KEYS) {
    const localValue =
      localStorage.getItem(key);

    if (localValue) {
      return localValue;
    }

    const sessionValue =
      sessionStorage.getItem(key);

    if (sessionValue) {
      return sessionValue;
    }
  }

  return null;
};

// =====================================================
// LEGAL COPY
// =====================================================

const TERMS_CONTENT = [
  {
    title: "1. About these Terms",
    paragraphs: [
      `These Terms of Use govern your access to and use of PhilaLink. By accepting these Terms, you agree to use PhilaLink in accordance with these conditions and applicable law.`,

      `PhilaLink is a digital healthcare-support platform intended to help patients, nominated proxies, nurses and authorised administrators coordinate healthcare-related activities such as medication management, collections, appointments, notifications and access to health-support features.`,
    ],
  },

  {
    title: "2. Your account",
    paragraphs: [
      `You are responsible for providing accurate information when creating or maintaining your PhilaLink account.`,

      `You must keep your login credentials secure and must not knowingly allow another person to use your account as though they were you.`,

      `Where PhilaLink provides role-based access, you may only use functionality that has been made available to your authorised role.`,
    ],
  },

  {
    title: "3. Healthcare information",
    paragraphs: [
      `Information displayed by PhilaLink is intended to support healthcare access, medication management and communication. It does not replace consultation, diagnosis or treatment by a qualified healthcare professional.`,

      `Medication schedules, collection information, symptom information and other healthcare-related information should be confirmed with an appropriate healthcare professional where necessary.`,
    ],
  },

  {
    title: "4. PhilaChat and automated guidance",
    paragraphs: [
      `PhilaLink may provide automated or AI-assisted health information through features such as PhilaChat.`,

      `Automated guidance is provided for informational and preliminary support purposes. It must not be treated as a definitive medical diagnosis or as a replacement for professional medical care.`,

      `Where symptoms are severe, unusual, worsening or potentially life-threatening, you should seek professional medical assistance rather than relying on automated guidance.`,
    ],
  },

  {
    title: "5. Emergencies",
    paragraphs: [
      `PhilaLink is not an emergency response service.`,

      `If you believe that you or another person is experiencing a medical emergency, contact the appropriate emergency service immediately. In South Africa, emergency assistance can be reached by calling 112 from a mobile phone.`,
    ],
  },

  {
    title: "6. Proxy and caregiver access",
    paragraphs: [
      `Where a patient is linked to a nominated proxy or caregiver, the proxy may receive access to information and functionality necessary to assist that patient with permitted healthcare activities.`,

      `Proxy access must only be used for the patient for whom the access was authorised. A proxy must not misuse patient information or use access for purposes unrelated to the authorised care relationship.`,
    ],
  },

  {
    title: "7. Acceptable use",
    paragraphs: [
      `You must not use PhilaLink to impersonate another person, obtain unauthorised access, interfere with the operation of the service, submit malicious content, manipulate healthcare records, abuse automated features, or attempt to bypass security controls.`,

      `Access may be restricted or suspended where necessary to protect users, healthcare information, the platform or other legitimate interests.`,
    ],
  },

  {
    title: "8. Availability",
    paragraphs: [
      `PhilaLink aims to provide reliable access to its services, but uninterrupted availability cannot be guaranteed.`,

      `Features may temporarily be unavailable because of maintenance, internet connectivity, third-party services, infrastructure failures or other technical circumstances.`,
    ],
  },

  {
    title: "9. Changes to these Terms",
    paragraphs: [
      `PhilaLink may publish a new version of these Terms when the service, legal requirements or relevant operating practices change.`,

      `When a new version requires acceptance, PhilaLink may require you to review and accept that version before continuing to use protected parts of the platform.`,

      `Your previous acceptance records may be retained as part of the platform's legal and audit history.`,
    ],
  },

  {
    title: "10. Acceptance",
    paragraphs: [
      `By selecting the acceptance control after reaching the end of this document, you confirm that you have had an opportunity to read these Terms of Use and agree to the current version presented to you.`,
    ],
  },
];

const PRIVACY_CONTENT = [
  {
    title: "1. About this Privacy Policy",
    paragraphs: [
      `This Privacy Policy explains how PhilaLink handles personal information when you use the platform.`,

      `Because PhilaLink provides healthcare-support functionality, some information processed through the platform may be sensitive or health-related personal information.`,
    ],
  },

  {
    title: "2. Information PhilaLink may process",
    paragraphs: [
      `Depending on your role and the features you use, PhilaLink may process information such as your name, contact details, identification information, account details, assigned clinic, healthcare role and account status.`,

      `For patients, the platform may also process information relating to medications, medication schedules, collection records, appointments, symptoms, allergies, medical conditions, health records and other information required to provide the requested healthcare-support functionality.`,
    ],
  },

  {
    title: "3. Why information is used",
    paragraphs: [
      `Personal information is used to create and secure accounts, provide role-based access, support patient care workflows, coordinate medication collections, provide reminders and notifications, maintain health-related records and operate other PhilaLink functionality.`,

      `Information may also be processed where necessary for security, troubleshooting, auditing, fraud prevention, system integrity and compliance with applicable obligations.`,
    ],
  },

  {
    title: "4. Patient and proxy information",
    paragraphs: [
      `Where a patient authorises or is validly linked to a nominated proxy, information necessary for the authorised care relationship may be made available to that proxy.`,

      `Proxy access is intended to support activities such as medication collection and patient assistance and should not be used for unrelated purposes.`,
    ],
  },

  {
    title: "5. Nurses, clinics and administrators",
    paragraphs: [
      `Authorised healthcare personnel and administrators may access information required to perform the functions associated with their PhilaLink role.`,

      `Role-based access is intended to limit users to information and actions relevant to their responsibilities.`,
    ],
  },

  {
    title: "6. External services",
    paragraphs: [
      `Some PhilaLink features may rely on external infrastructure or services, such as hosting providers, mapping services, weather information providers, email services, authentication providers or AI services.`,

      `Only information reasonably necessary to provide the relevant functionality should be transmitted to such services.`,
    ],
  },

  {
    title: "7. Security",
    paragraphs: [
      `PhilaLink uses technical and organisational measures intended to protect personal information against unauthorised access, loss, misuse, alteration and inappropriate disclosure.`,

      `No internet-based system can guarantee absolute security. Users also have a responsibility to protect their login credentials and devices.`,
    ],
  },

  {
    title: "8. Retention",
    paragraphs: [
      `Information may be retained for as long as reasonably necessary for the purposes for which it is processed, including healthcare-support, operational, security, audit and legal purposes.`,

      `Certain records, including legal acceptance and audit records, may need to be retained even where an account is no longer actively used.`,
    ],
  },

  {
    title: "9. Cookies and similar technologies",
    paragraphs: [
      `PhilaLink may use cookies or similar browser storage technologies where necessary to provide functionality, maintain preferences, improve security and support the operation of the website.`,

      `Where optional cookies are used, the separate cookie controls presented by PhilaLink apply to those cookies.`,
    ],
  },

  {
    title: "10. Your privacy choices",
    paragraphs: [
      `Where applicable, users may request access to or correction of personal information and may raise concerns regarding the handling of their personal information.`,

      `Some information cannot immediately be deleted where continued retention is required for healthcare, security, audit, contractual or legal reasons.`,
    ],
  },

  {
    title: "11. Changes to this Policy",
    paragraphs: [
      `PhilaLink may update this Privacy Policy when its services, information practices or applicable requirements change.`,

      `Where a new version requires acknowledgement, you may be asked to review it before continuing into protected areas of PhilaLink.`,
    ],
  },

  {
    title: "12. Acknowledgement",
    paragraphs: [
      `By selecting the acknowledgement control after reaching the end of this document, you confirm that you have had an opportunity to read the current PhilaLink Privacy Policy.`,
    ],
  },
];

// =====================================================
// HELPERS
// =====================================================

const normalizeType = (value = "") =>
  value
    .replace(/[\s_-]/g, "")
    .toLowerCase();

const isTermsDocument = (document) =>
  normalizeType(document?.type) ===
  "termsofuse";

const isPrivacyDocument = (document) =>
  normalizeType(document?.type) ===
  "privacypolicy";

const getContentForDocument = (
  document
) => {
  if (isTermsDocument(document)) {
    return TERMS_CONTENT;
  }

  if (isPrivacyDocument(document)) {
    return PRIVACY_CONTENT;
  }

  return [
    {
      title: document?.title || "Legal document",

      paragraphs: [
        `Please review this legal document carefully before continuing.`,
      ],
    },
  ];
};

const getActionLabel = (document) => {
  if (isTermsDocument(document)) {
    return "I have read and accept these Terms of Use";
  }

  if (isPrivacyDocument(document)) {
    return "I have read and acknowledge this Privacy Policy";
  }

  return "I have read and acknowledge this document";
};

// =====================================================
// PAGE
// =====================================================

export default function LegalAcceptancePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollContainers =
    useRef({});

  const [legalStatus, setLegalStatus] =
    useState(null);

  const [reachedEnd, setReachedEnd] =
    useState({});

  const [confirmed, setConfirmed] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  // ===================================================
  // TOKEN
  // ===================================================

  const token = useMemo(
    () => getStoredToken(),
    []
  );

  // ===================================================
  // RETURN DESTINATION
  // ===================================================

  const returnTo = useMemo(() => {
    const params =
      new URLSearchParams(
        location.search
      );

    const queryReturnTo =
      params.get("returnTo");

    const stateReturnTo =
      location.state?.from?.pathname;

    const candidate =
      queryReturnTo ||
      stateReturnTo ||
      "/";

    /*
     * Only allow internal paths.
     * This prevents an open redirect.
     */
    if (
      typeof candidate !== "string" ||
      !candidate.startsWith("/") ||
      candidate.startsWith("//") ||
      candidate === location.pathname
    ) {
      return "/";
    }

    return candidate;
  }, [
    location.pathname,
    location.search,
    location.state,
  ]);

  // ===================================================
  // DOCUMENTS
  // ===================================================

  const documents = useMemo(
    () =>
      Array.isArray(
        legalStatus?.documents
      )
        ? legalStatus.documents
        : [],
    [legalStatus]
  );

  const pendingDocuments = useMemo(
    () =>
      documents.filter(
        (document) =>
          !document.hasAccepted
      ),
    [documents]
  );

  const completedDocuments = useMemo(
    () =>
      documents.filter(
        (document) =>
          document.hasAccepted
      ),
    [documents]
  );

  const requiresAction =
    Boolean(
      legalStatus?.requiresAction
    );

  // ===================================================
  // LOAD LEGAL STATUS
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      if (!token) {
        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      try {
        const result =
          await getLegalStatus(
            token
          );

        if (cancelled) {
          return;
        }

        setLegalStatus(result);

        if (
          !result?.requiresAction
        ) {
          navigate(
            returnTo,
            {
              replace: true,
            }
          );
        }
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        if (
          requestError?.status ===
          401
        ) {
          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }

        setError(
          requestError?.message ||
            "We could not load the legal documents. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    navigate,
    returnTo,
    token,
  ]);

  // ===================================================
  // PAGE LEAVE PROTECTION
  // ===================================================

  useEffect(() => {
    if (
      loading ||
      !requiresAction ||
      submitting
    ) {
      return undefined;
    }

    const handleBeforeUnload = (
      event
    ) => {
      event.preventDefault();

      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [
    loading,
    requiresAction,
    submitting,
  ]);

  /*
   * Browsers do not allow a website to absolutely prevent
   * someone from closing a tab or browser.
   *
   * What PhilaLink does instead is prevent the user from
   * entering the protected application until the required
   * legal actions have been completed.
   */

  // ===================================================
  // CHECK WHETHER DOCUMENT REACHED BOTTOM
  // ===================================================

  const checkDocumentScroll = (
    documentId
  ) => {
    const element =
      scrollContainers.current[
        documentId
      ];

    if (!element) {
      return;
    }

    const remaining =
      element.scrollHeight -
      element.scrollTop -
      element.clientHeight;

    if (remaining <= 8) {
      setReachedEnd(
        (current) => ({
          ...current,
          [documentId]: true,
        })
      );
    }
  };

  // ===================================================
  // REGISTER SCROLL CONTAINER
  // ===================================================

  const registerScrollContainer = (
    documentId,
    element
  ) => {
    if (!element) {
      return;
    }

    scrollContainers.current[
      documentId
    ] = element;

    /*
     * If the document happens to fit completely inside the
     * container, there is nothing to scroll and it should
     * count as having reached the end.
     */
    requestAnimationFrame(() => {
      checkDocumentScroll(
        documentId
      );
    });
  };

  // ===================================================
  // CONFIRM DOCUMENT
  // ===================================================

  const handleConfirmation = (
    documentId,
    checked
  ) => {
    if (
      !reachedEnd[documentId]
    ) {
      return;
    }

    setConfirmed(
      (current) => ({
        ...current,
        [documentId]: checked,
      })
    );

    setError("");
  };

  // ===================================================
  // ALL READY
  // ===================================================

  const allPendingReady =
    pendingDocuments.length >
      0 &&
    pendingDocuments.every(
      (document) =>
        reachedEnd[document.id] &&
        confirmed[document.id]
    );

  // ===================================================
  // SUBMIT ACCEPTANCES
  // ===================================================

  const handleContinue =
    async () => {
      if (
        !token ||
        !allPendingReady ||
        submitting
      ) {
        return;
      }

      setSubmitting(true);
      setError("");
      setNotice(
        "Saving your legal acknowledgements..."
      );

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
              token,
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
              token,
              document.id
            );

            continue;
          }

          throw new Error(
            `Unsupported legal document type: ${document.type}`
          );
        }

        /*
         * Do not trust the local UI state alone.
         *
         * Ask the backend again before releasing
         * the user into PhilaLink.
         */
        const refreshedStatus =
          await getLegalStatus(
            token
          );

        setLegalStatus(
          refreshedStatus
        );

        if (
          refreshedStatus
            ?.requiresAction
        ) {
          throw new Error(
            "One or more legal documents still require your attention."
          );
        }

        setNotice(
          "Your preferences have been saved."
        );

        navigate(
          returnTo,
          {
            replace: true,
          }
        );
      } catch (requestError) {
        setNotice("");

        setError(
          requestError?.message ||
            "We could not save your legal acknowledgement. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ===================================================
  // RETRY
  // ===================================================

  const handleRetry = () => {
    window.location.reload();
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <>
        <style>
          {PAGE_STYLES}
        </style>

        <main className="legal-gate legal-gate--center">
          <div className="legal-loading">
            <div className="legal-spinner" />

            <p>
              Loading legal documents...
            </p>
          </div>
        </main>
      </>
    );
  }

  // ===================================================
  // LOAD FAILURE
  // ===================================================

  if (
    error &&
    !legalStatus
  ) {
    return (
      <>
        <style>
          {PAGE_STYLES}
        </style>

        <main className="legal-gate legal-gate--center">
          <section className="legal-error-card">
            <span className="legal-brand">
              PhilaLink
            </span>

            <h1>
              We couldn't load the required documents
            </h1>

            <p>
              PhilaLink needs to confirm
              your current legal status
              before opening your account.
            </p>

            <div
              className="legal-alert"
              role="alert"
            >
              {error}
            </div>

            <button
              type="button"
              className="legal-primary-button"
              onClick={handleRetry}
            >
              Try again
            </button>
          </section>
        </main>
      </>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <>
      <style>
        {PAGE_STYLES}
      </style>

      <main className="legal-gate">
        <header className="legal-header">
          <div className="legal-header-inner">
            <div>
              <span className="legal-brand">
                PhilaLink
              </span>

              <span className="legal-brand-subtitle">
                Legal acknowledgement
              </span>
            </div>

            <span className="legal-secure-label">
              Secure account step
            </span>
          </div>
        </header>

        <div className="legal-page-shell">
          <section className="legal-intro">
            <p className="legal-eyebrow">
              Before you continue
            </p>

            <h1>
              Please review the current
              PhilaLink documents
            </h1>

            <p className="legal-intro-copy">
              We need you to review each
              outstanding document before
              entering your account. Scroll
              to the end of each document
              to unlock its acknowledgement
              control.
            </p>

            <div className="legal-progress-row">
              <span>
                {
                  completedDocuments.length
                }{" "}
                of{" "}
                {
                  documents.length
                }{" "}
                completed
              </span>

              <div
                className="legal-progress-track"
                aria-hidden="true"
              >
                <div
                  className="legal-progress-value"
                  style={{
                    width:
                      documents.length >
                      0
                        ? `${
                            (completedDocuments.length /
                              documents.length) *
                            100
                          }%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </section>

          {completedDocuments.length >
            0 && (
            <section className="legal-completed-panel">
              <strong>
                Already completed
              </strong>

              {completedDocuments.map(
                (document) => (
                  <div
                    className="legal-completed-row"
                    key={
                      document.id
                    }
                  >
                    <span>
                      {
                        document.title
                      }
                    </span>

                    <span>
                      Version{" "}
                      {
                        document.version
                      }{" "}
                      · Complete
                    </span>
                  </div>
                )
              )}
            </section>
          )}

          <div className="legal-document-list">
            {pendingDocuments.map(
              (
                document,
                index
              ) => {
                const content =
                  getContentForDocument(
                    document
                  );

                const read =
                  Boolean(
                    reachedEnd[
                      document.id
                    ]
                  );

                const checked =
                  Boolean(
                    confirmed[
                      document.id
                    ]
                  );

                return (
                  <article
                    className="legal-document-card"
                    key={
                      document.id
                    }
                  >
                    <div className="legal-document-heading">
                      <div>
                        <span className="legal-document-step">
                          Document{" "}
                          {index + 1}{" "}
                          of{" "}
                          {
                            pendingDocuments.length
                          }
                        </span>

                        <h2>
                          {
                            document.title
                          }
                        </h2>

                        <p>
                          Version{" "}
                          {
                            document.version
                          }
                        </p>
                      </div>

                      <div
                        className={
                          read
                            ? "legal-read-badge legal-read-badge--done"
                            : "legal-read-badge"
                        }
                      >
                        {read
                          ? "Read to end"
                          : "Scroll required"}
                      </div>
                    </div>

                    <div
                      className="legal-paper"
                      ref={(
                        element
                      ) =>
                        registerScrollContainer(
                          document.id,
                          element
                        )
                      }
                      onScroll={() =>
                        checkDocumentScroll(
                          document.id
                        )
                      }
                      tabIndex={0}
                      aria-label={`${document.title}, version ${document.version}`}
                    >
                      <div className="legal-paper-header">
                        <strong>
                          PhilaLink
                        </strong>

                        <span>
                          {
                            document.title
                          }
                        </span>

                        <small>
                          Version{" "}
                          {
                            document.version
                          }
                        </small>
                      </div>

                      {content.map(
                        (
                          section
                        ) => (
                          <section
                            className="legal-copy-section"
                            key={
                              section.title
                            }
                          >
                            <h3>
                              {
                                section.title
                              }
                            </h3>

                            {section.paragraphs.map(
                              (
                                paragraph,
                                paragraphIndex
                              ) => (
                                <p
                                  key={`${section.title}-${paragraphIndex}`}
                                >
                                  {
                                    paragraph
                                  }
                                </p>
                              )
                            )}
                          </section>
                        )
                      )}

                      <div className="legal-end-marker">
                        End of{" "}
                        {
                          document.title
                        }
                      </div>
                    </div>

                    {!read && (
                      <p className="legal-scroll-hint">
                        Continue scrolling
                        through the document
                        to enable the control
                        below.
                      </p>
                    )}

                    <label
                      className={
                        read
                          ? "legal-confirmation"
                          : "legal-confirmation legal-confirmation--disabled"
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
                          handleConfirmation(
                            document.id,
                            event
                              .target
                              .checked
                          )
                        }
                      />

                      <span className="legal-custom-checkbox">
                        {checked
                          ? "✓"
                          : ""}
                      </span>

                      <span>
                        {getActionLabel(
                          document
                        )}
                      </span>
                    </label>
                  </article>
                );
              }
            )}
          </div>

          {error && (
            <div
              className="legal-alert"
              role="alert"
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              className="legal-notice"
              role="status"
            >
              {notice}
            </div>
          )}

          <section className="legal-action-panel">
            <div>
              <strong>
                Complete all required
                documents
              </strong>

              <p>
                Your account will remain
                outside the protected
                PhilaLink application until
                the required legal actions
                have been recorded.
              </p>
            </div>

            <button
              type="button"
              className="legal-primary-button"
              disabled={
                !allPendingReady ||
                submitting
              }
              onClick={
                handleContinue
              }
            >
              {submitting
                ? "Saving..."
                : "Accept and continue"}
            </button>
          </section>

          <footer className="legal-footer">
            <span>
              PhilaLink
            </span>

            <span>
              Emergency assistance:
              112
            </span>
          </footer>
        </div>
      </main>
    </>
  );
}

// =====================================================
// STYLES
// =====================================================

const PAGE_STYLES = `
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
    margin: 0;
  }

  body {
    margin: 0;
  }

  .legal-gate {
    min-height: 100vh;
    background: #f4f4f2;
    color: #111111;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .legal-gate--center {
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .legal-header {
    position: sticky;
    top: 0;
    z-index: 30;
    border-bottom: 1px solid #d8d8d4;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(14px);
  }

  .legal-header-inner {
    width: min(100% - 32px, 1100px);
    min-height: 72px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .legal-brand {
    display: block;
    color: #111111;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.04em;
  }

  .legal-brand-subtitle {
    display: block;
    margin-top: 3px;
    color: #737373;
    font-size: 12px;
  }

  .legal-secure-label {
    border: 1px solid #ccccca;
    border-radius: 999px;
    padding: 7px 11px;
    color: #555555;
    background: #ffffff;
    font-size: 11px;
    font-weight: 600;
  }

  .legal-page-shell {
    width: min(100% - 32px, 920px);
    margin: 0 auto;
    padding: 56px 0 32px;
  }

  .legal-intro {
    margin-bottom: 32px;
  }

  .legal-eyebrow {
    margin: 0 0 12px;
    color: #666666;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .legal-intro h1 {
    max-width: 760px;
    margin: 0;
    color: #111111;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(34px, 6vw, 58px);
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.045em;
  }

  .legal-intro-copy {
    max-width: 700px;
    margin: 20px 0 0;
    color: #555555;
    font-size: 15px;
    line-height: 1.75;
  }

  .legal-progress-row {
    margin-top: 28px;
    display: grid;
    grid-template-columns: auto minmax(120px, 260px);
    align-items: center;
    gap: 16px;
    color: #555555;
    font-size: 12px;
  }

  .legal-progress-track {
    height: 4px;
    overflow: hidden;
    border-radius: 999px;
    background: #dededb;
  }

  .legal-progress-value {
    height: 100%;
    border-radius: inherit;
    background: #111111;
    transition: width 0.25s ease;
  }

  .legal-completed-panel {
    margin-bottom: 24px;
    padding: 20px;
    border: 1px solid #d8d8d4;
    background: #ffffff;
  }

  .legal-completed-panel > strong {
    display: block;
    margin-bottom: 14px;
    font-size: 13px;
  }

  .legal-completed-row {
    padding: 10px 0;
    border-top: 1px solid #ececea;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    color: #555555;
    font-size: 12px;
  }

  .legal-document-list {
    display: grid;
    gap: 28px;
  }

  .legal-document-card {
    padding: 28px;
    border: 1px solid #d5d5d2;
    background: #ffffff;
    box-shadow:
      0 14px 35px
      rgba(0, 0, 0, 0.04);
  }

  .legal-document-heading {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  .legal-document-step {
    display: block;
    margin-bottom: 7px;
    color: #777777;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .legal-document-heading h2 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 27px;
    font-weight: 500;
    letter-spacing: -0.025em;
  }

  .legal-document-heading p {
    margin: 6px 0 0;
    color: #777777;
    font-size: 12px;
  }

  .legal-read-badge {
    flex: 0 0 auto;
    border: 1px solid #ccccca;
    border-radius: 999px;
    padding: 7px 10px;
    color: #777777;
    background: #f7f7f5;
    font-size: 10px;
    font-weight: 700;
  }

  .legal-read-badge--done {
    border-color: #111111;
    color: #ffffff;
    background: #111111;
  }

  .legal-paper {
    height: min(58vh, 560px);
    min-height: 360px;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding:
      clamp(28px, 6vw, 58px)
      clamp(24px, 7vw, 72px);
    border: 1px solid #bdbdb9;
    outline: none;
    background: #ffffff;
    color: #111111;
    font-family: Georgia, "Times New Roman", serif;
    scrollbar-width: thin;
    scrollbar-color:
      #777777
      #eeeeeb;
  }

  .legal-paper:focus {
    border-color: #555555;
    box-shadow:
      0 0 0 2px
      rgba(0, 0, 0, 0.05);
  }

  .legal-paper::-webkit-scrollbar {
    width: 10px;
  }

  .legal-paper::-webkit-scrollbar-track {
    background: #eeeeeb;
  }

  .legal-paper::-webkit-scrollbar-thumb {
    border: 2px solid #eeeeeb;
    border-radius: 999px;
    background: #777777;
  }

  .legal-paper-header {
    padding-bottom: 28px;
    border-bottom: 1px solid #222222;
    text-align: center;
  }

  .legal-paper-header strong,
  .legal-paper-header span,
  .legal-paper-header small {
    display: block;
  }

  .legal-paper-header strong {
    margin-bottom: 18px;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      sans-serif;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .legal-paper-header span {
    font-size: clamp(25px, 4vw, 36px);
    line-height: 1.15;
  }

  .legal-paper-header small {
    margin-top: 10px;
    color: #666666;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      sans-serif;
    font-size: 11px;
  }

  .legal-copy-section {
    margin-top: 34px;
  }

  .legal-copy-section h3 {
    margin: 0 0 12px;
    font-size: 18px;
    line-height: 1.4;
  }

  .legal-copy-section p {
    margin: 0 0 13px;
    font-size: 15px;
    line-height: 1.8;
  }

  .legal-end-marker {
    margin-top: 46px;
    padding: 22px 0 6px;
    border-top: 1px solid #222222;
    color: #555555;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-align: center;
    text-transform: uppercase;
  }

  .legal-scroll-hint {
    margin: 12px 0 0;
    color: #777777;
    font-size: 11px;
  }

  .legal-confirmation {
    margin-top: 20px;
    padding: 17px 18px;
    border: 1px solid #bbbbba;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    background: #fafaf8;
    color: #222222;
    font-size: 13px;
    line-height: 1.55;
    transition:
      border-color 0.2s ease,
      background 0.2s ease;
  }

  .legal-confirmation:hover {
    border-color: #777777;
    background: #ffffff;
  }

  .legal-confirmation--disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .legal-confirmation input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .legal-custom-checkbox {
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    border: 1px solid #777777;
    display: grid;
    place-items: center;
    color: #ffffff;
    background: #ffffff;
    font-family:
      Inter,
      sans-serif;
    font-size: 12px;
    font-weight: 800;
  }

  .legal-confirmation
    input:checked
    + .legal-custom-checkbox {
    border-color: #111111;
    background: #111111;
  }

  .legal-alert,
  .legal-notice {
    margin-top: 22px;
    padding: 14px 16px;
    border: 1px solid #111111;
    background: #ffffff;
    font-size: 13px;
    line-height: 1.55;
  }

  .legal-alert {
    border-color: #8a2020;
    color: #721c1c;
  }

  .legal-notice {
    color: #222222;
  }

  .legal-action-panel {
    margin-top: 30px;
    padding: 24px;
    border: 1px solid #ccccca;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    background: #ffffff;
  }

  .legal-action-panel strong {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }

  .legal-action-panel p {
    max-width: 570px;
    margin: 0;
    color: #666666;
    font-size: 12px;
    line-height: 1.6;
  }

  .legal-primary-button {
    min-height: 46px;
    padding: 0 22px;
    border: 1px solid #111111;
    border-radius: 0;
    cursor: pointer;
    white-space: nowrap;
    background: #111111;
    color: #ffffff;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      opacity 0.2s ease;
  }

  .legal-primary-button:hover:not(:disabled) {
    background: #ffffff;
    color: #111111;
  }

  .legal-primary-button:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  .legal-footer {
    padding: 30px 2px 10px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    color: #777777;
    font-size: 10px;
  }

  .legal-loading {
    min-width: 220px;
    text-align: center;
    color: #555555;
    font-size: 13px;
  }

  .legal-spinner {
    width: 28px;
    height: 28px;
    margin: 0 auto 16px;
    border: 2px solid #ddddda;
    border-top-color: #111111;
    border-radius: 50%;
    animation: legal-spin 0.8s linear infinite;
  }

  .legal-error-card {
    width: min(100%, 520px);
    padding: 34px;
    border: 1px solid #ccccca;
    background: #ffffff;
  }

  .legal-error-card h1 {
    margin: 22px 0 12px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 30px;
    font-weight: 500;
  }

  .legal-error-card p {
    color: #666666;
    font-size: 13px;
    line-height: 1.65;
  }

  .legal-error-card
    .legal-primary-button {
    margin-top: 20px;
  }

  @keyframes legal-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 720px) {
    .legal-header-inner,
    .legal-page-shell {
      width: min(100% - 24px, 920px);
    }

    .legal-header-inner {
      min-height: 64px;
    }

    .legal-secure-label {
      display: none;
    }

    .legal-page-shell {
      padding-top: 36px;
    }

    .legal-intro h1 {
      font-size: 38px;
    }

    .legal-progress-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .legal-document-card {
      padding: 16px;
    }

    .legal-document-heading {
      display: grid;
      gap: 14px;
    }

    .legal-read-badge {
      width: max-content;
    }

    .legal-paper {
      height: 56vh;
      min-height: 340px;
      padding: 30px 20px;
    }

    .legal-copy-section p {
      font-size: 14px;
    }

    .legal-action-panel {
      align-items: stretch;
      flex-direction: column;
    }

    .legal-primary-button {
      width: 100%;
    }

    .legal-completed-row,
    .legal-footer {
      flex-direction: column;
      gap: 6px;
    }
  }

  @media (max-width: 420px) {
    .legal-intro h1 {
      font-size: 33px;
    }

    .legal-document-card {
      padding: 12px;
    }

    .legal-paper {
      height: 54vh;
      min-height: 320px;
      padding: 26px 17px;
    }

    .legal-confirmation {
      padding: 14px;
    }
  }
`;