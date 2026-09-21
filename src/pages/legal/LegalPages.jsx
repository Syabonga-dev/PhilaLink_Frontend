import {
  Link,
} from "react-router-dom";

// =====================================================
// SHARED DOCUMENT LAYOUT
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

        {/* ===================================== */}
        {/* TOP ACTIONS */}
        {/* ===================================== */}

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

        {/* ===================================== */}
        {/* DOCUMENT HEADER */}
        {/* ===================================== */}

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
            Last updated:
            {" "}
            21 September 2026
          </p>
        </header>

        {/* ===================================== */}
        {/* DOCUMENT BODY */}
        {/* ===================================== */}

        <main
          className="legal-document-body py-9 font-serif text-[16px] leading-[1.8]"
          style={{
            fontFamily:
              '"Times New Roman", Times, serif',
          }}
        >
          {children}
        </main>

        {/* ===================================== */}
        {/* DOCUMENT FOOTER */}
        {/* ===================================== */}

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
// SECTION COMPONENTS
// =====================================================

function Section({
  number,
  title,
  children,
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
        {number}. {title}
      </h2>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}


function BulletList({
  children,
}) {
  return (
    <ul className="ml-6 list-disc space-y-2">
      {children}
    </ul>
  );
}


// =====================================================
// PRIVACY POLICY
// =====================================================

export function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      subtitle="This Privacy Policy explains how PhilaLink collects, uses, stores, shares and protects personal information when people use the PhilaLink platform."
    >

      <Section
        number="1"
        title="Introduction"
      >
        <p>
          PhilaLink is a digital healthcare
          support platform designed to help
          patients, healthcare workers and
          authorised proxies manage
          healthcare-related information,
          medication collections,
          appointments and related services.
        </p>

        <p>
          PhilaLink respects the privacy of
          its users and aims to process
          personal information responsibly
          and in accordance with applicable
          South African data protection law,
          including the Protection of
          Personal Information Act 4 of 2013
          ("POPIA").
        </p>

        <p>
          This Privacy Policy should be read
          together with the PhilaLink Terms
          of Use and the cookie information
          made available through the
          platform.
        </p>
      </Section>


      <Section
        number="2"
        title="Personal information we may collect"
      >
        <p>
          Depending on how PhilaLink is used,
          the platform may process the
          following categories of
          information:
        </p>

        <BulletList>
          <li>
            identity information, including
            name, identity number, date of
            birth and gender;
          </li>

          <li>
            contact information, including
            email address, telephone number
            and address information;
          </li>

          <li>
            account information, including
            account role, verification
            status and security-related
            account information;
          </li>

          <li>
            clinic and healthcare-provider
            information associated with the
            user's care;
          </li>

          <li>
            medication information,
            medication schedules, medication
            logs and medication collection
            information;
          </li>

          <li>
            appointment information;
          </li>

          <li>
            health-related information
            voluntarily provided or recorded
            through PhilaLink;
          </li>

          <li>
            symptom-assessment information
            submitted through PhilaLink
            features;
          </li>

          <li>
            information about authorised
            proxy relationships;
          </li>

          <li>
            emergency-contact information;
          </li>

          <li>
            location information when the
            user chooses to allow location
            access for location-based
            features such as finding nearby
            healthcare facilities;
          </li>

          <li>
            notification and communication
            preferences;
          </li>

          <li>
            technical information required
            for security, authentication and
            operation of the platform; and
          </li>

          <li>
            cookie choices and other
            permitted browser preferences.
          </li>
        </BulletList>
      </Section>


      <Section
        number="3"
        title="Health information"
      >
        <p>
          Some information processed through
          PhilaLink concerns a person's
          health and healthcare. Health
          information is sensitive and is
          treated as special personal
          information under POPIA.
        </p>

        <p>
          PhilaLink is designed so that
          access to healthcare information is
          restricted according to the user's
          authorised role and relationship
          with the relevant patient.
        </p>
      </Section>


      <Section
        number="4"
        title="Why we process personal information"
      >
        <p>
          Personal information may be
          processed where necessary to
          provide and operate PhilaLink
          features, including:
        </p>

        <BulletList>
          <li>
            creating, verifying and securing
            user accounts;
          </li>

          <li>
            authenticating users and
            controlling access according to
            user roles;
          </li>

          <li>
            displaying medication and
            treatment-related information;
          </li>

          <li>
            managing medication schedules,
            logs and collection information;
          </li>

          <li>
            managing healthcare
            appointments;
          </li>

          <li>
            connecting patients with
            authorised proxies;
          </li>

          <li>
            providing reminders and
            notifications;
          </li>

          <li>
            providing nearby healthcare
            facility information where the
            user enables location access;
          </li>

          <li>
            providing chatbot and
            symptom-assessment functionality;
          </li>

          <li>
            maintaining security, audit
            records and system integrity;
          </li>

          <li>
            responding to user requests and
            providing support; and
          </li>

          <li>
            complying with applicable legal
            obligations.
          </li>
        </BulletList>
      </Section>


      <Section
        number="5"
        title="How information is collected"
      >
        <p>
          Information may be collected
          directly from users when they
          register, update their profile,
          submit information, use PhilaLink
          services or communicate through the
          platform.
        </p>

        <p>
          Information may also be added or
          updated by authorised healthcare
          staff or other authorised users
          where their role permits them to
          perform the relevant action.
        </p>

        <p>
          Certain technical information may
          be generated automatically when a
          person uses the platform.
        </p>
      </Section>


      <Section
        number="6"
        title="Who may access personal information"
      >
        <p>
          Access to information within
          PhilaLink is role-based. Depending
          on the circumstances, information
          may be accessible to:
        </p>

        <BulletList>
          <li>
            the patient to whom the
            information relates;
          </li>

          <li>
            an authorised proxy where the
            proxy has been formally linked to
            the patient;
          </li>

          <li>
            authorised healthcare workers;
          </li>

          <li>
            authorised clinic
            administrators;
          </li>

          <li>
            authorised system
            administrators where required
            for system administration and
            security; and
          </li>

          <li>
            service providers that support
            the technical operation of the
            platform, subject to appropriate
            access restrictions.
          </li>
        </BulletList>

        <p>
          Users must not attempt to access
          information that they are not
          authorised to view.
        </p>
      </Section>


      <Section
        number="7"
        title="Third-party service providers"
      >
        <p>
          PhilaLink may use third-party
          technology providers for services
          such as hosting, database
          infrastructure, authentication,
          email delivery, weather
          information and artificial
          intelligence functionality.
        </p>

        <p>
          Only information reasonably
          necessary for the relevant service
          should be shared with such
          providers.
        </p>

        <p>
          Some external providers may process
          information using infrastructure
          located outside South Africa.
          Where applicable, cross-border
          processing should be handled in
          accordance with applicable data
          protection requirements.
        </p>
      </Section>


      <Section
        number="8"
        title="Google sign-in"
      >
        <p>
          If a user chooses to use Google
          sign-in, information required to
          authenticate that user may be
          exchanged with Google as part of
          the authentication process.
        </p>

        <p>
          Google's own processing of
          information is subject to Google's
          policies and services. PhilaLink
          does not control cookies or
          information processing performed
          directly on Google's systems.
        </p>
      </Section>


      <Section
        number="9"
        title="Artificial intelligence features"
      >
        <p>
          PhilaLink may provide
          AI-assisted features, including
          chatbot functionality.
        </p>

        <p>
          Users should avoid submitting
          information that is not reasonably
          necessary for the question or
          feature they are using.
        </p>

        <p>
          AI-generated responses may contain
          errors and must not be treated as
          a substitute for diagnosis,
          treatment or advice from a
          qualified healthcare professional.
        </p>
      </Section>


      <Section
        number="10"
        title="Location information"
      >
        <p>
          Some features may request access to
          a device's location, for example to
          identify nearby clinics or
          healthcare facilities.
        </p>

        <p>
          Location access depends on the
          user's browser or device
          permission. A user may refuse or
          withdraw location permission using
          the settings of their browser or
          device.
        </p>
      </Section>


      <Section
        number="11"
        title="Cookies"
      >
        <p>
          PhilaLink uses a cookie to remember
          the user's cookie preference.
          Essential cookies may also be used
          where required for security and
          core website functionality.
        </p>

        <p>
          Optional preference cookies are
          used only where the user permits
          them.
        </p>

        <p>
          PhilaLink's cookie-consent file
          does not store medication records,
          health records, passwords or API
          credentials.
        </p>
      </Section>


      <Section
        number="12"
        title="Information security"
      >
        <p>
          PhilaLink uses technical and
          organisational safeguards intended
          to protect personal information
          against unauthorised access,
          disclosure, alteration, loss or
          misuse.
        </p>

        <p>
          These safeguards may include
          authenticated access, role-based
          authorisation, password controls,
          encrypted network communication,
          audit logging, request-rate
          controls and restricted access to
          system credentials.
        </p>

        <p>
          No internet-connected system can
          guarantee absolute security.
          Users are responsible for keeping
          their own login credentials secure
          and for reporting suspected
          unauthorised access.
        </p>
      </Section>


      <Section
        number="13"
        title="Retention of information"
      >
        <p>
          Personal information should be
          retained only for as long as it is
          reasonably required for the purpose
          for which it was collected, for
          legitimate operational needs, or
          where retention is required or
          permitted by applicable law.
        </p>

        <p>
          When information is no longer
          required and there is no lawful
          reason to retain it, appropriate
          deletion, destruction or
          de-identification measures should
          be applied.
        </p>
      </Section>


      <Section
        number="14"
        title="Your rights"
      >
        <p>
          Subject to applicable law, a person
          may have rights concerning their
          personal information, including the
          right to:
        </p>

        <BulletList>
          <li>
            ask whether PhilaLink holds
            personal information about them;
          </li>

          <li>
            request access to their personal
            information;
          </li>

          <li>
            request correction of inaccurate,
            incomplete or outdated
            information;
          </li>

          <li>
            request deletion or destruction
            where the information is no
            longer lawfully required;
          </li>

          <li>
            object to certain processing
            where permitted by law;
          </li>

          <li>
            withdraw consent where a
            particular processing activity
            relies on consent; and
          </li>

          <li>
            lodge a complaint with the
            Information Regulator of South
            Africa where appropriate.
          </li>
        </BulletList>
      </Section>


      <Section
        number="15"
        title="Privacy requests"
      >
        <p>
          Privacy, access or correction
          requests should be submitted
          through the contact or support
          channels made available by
          PhilaLink or through the relevant
          clinic where appropriate.
        </p>

        <p>
          PhilaLink may need to verify the
          identity of the person making a
          request before disclosing or
          modifying personal information.
        </p>
      </Section>


      <Section
        number="16"
        title="Children"
      >
        <p>
          Where personal information relating
          to a child is processed, additional
          legal requirements may apply.
          PhilaLink should not be used to
          create or manage a child's account
          unless the required authority or
          legal basis for processing that
          information exists.
        </p>
      </Section>


      <Section
        number="17"
        title="Changes to this Privacy Policy"
      >
        <p>
          This Privacy Policy may be updated
          when PhilaLink features,
          technologies or legal requirements
          change.
        </p>

        <p>
          The latest version will be made
          available through the platform and
          will show its most recent update
          date.
        </p>
      </Section>


      <Section
        number="18"
        title="Applicable law"
      >
        <p>
          This Privacy Policy is intended to
          operate within the framework of
          applicable South African law,
          including POPIA.
        </p>
      </Section>

    </LegalDocument>
  );
}


// =====================================================
// TERMS OF USE
// =====================================================

export function TermsOfUsePage() {
  return (
    <LegalDocument
      title="Terms of Use"
      subtitle="These Terms of Use govern access to and use of the PhilaLink digital healthcare support platform."
    >

      <Section
        number="1"
        title="Acceptance of these Terms"
      >
        <p>
          By creating an account or using
          PhilaLink, you agree to comply with
          these Terms of Use.
        </p>

        <p>
          If you do not agree with these
          Terms, you should not create an
          account or continue using the
          platform.
        </p>
      </Section>


      <Section
        number="2"
        title="Purpose of PhilaLink"
      >
        <p>
          PhilaLink is intended to support
          healthcare administration and
          communication by connecting
          patients, healthcare workers,
          clinics and authorised proxies.
        </p>

        <p>
          Features may include medication
          information, medication logging,
          medication collections,
          appointments, notifications,
          nearby-clinic information,
          symptom-assessment tools and
          healthcare information provided
          through digital assistance
          features.
        </p>
      </Section>


      <Section
        number="3"
        title="PhilaLink is not an emergency service"
      >
        <p>
          PhilaLink is not an emergency
          medical service.
        </p>

        <p>
          If you believe that you or another
          person is experiencing a medical
          emergency, contact the appropriate
          emergency service immediately.
          In South Africa, the general
          emergency number from a mobile
          phone is 112.
        </p>

        <p>
          Do not delay emergency medical care
          while waiting for information from
          PhilaLink.
        </p>
      </Section>


      <Section
        number="4"
        title="No substitute for professional medical advice"
      >
        <p>
          Information provided through
          PhilaLink is intended to support
          healthcare management and general
          information.
        </p>

        <p>
          PhilaLink does not replace a
          qualified doctor, nurse,
          pharmacist or other healthcare
          professional.
        </p>

        <p>
          Users should follow the treatment
          instructions provided by their
          healthcare professionals and should
          seek professional medical advice
          when they have questions about
          symptoms, medication, diagnosis or
          treatment.
        </p>
      </Section>


      <Section
        number="5"
        title="Accounts"
      >
        <p>
          Users must provide accurate
          information when registering for
          or using PhilaLink.
        </p>

        <p>
          Users are responsible for
          maintaining the confidentiality of
          their login credentials and must
          not knowingly allow an unauthorised
          person to use their account.
        </p>

        <p>
          A user must notify the appropriate
          PhilaLink support or clinic contact
          if they believe their account has
          been compromised.
        </p>
      </Section>


      <Section
        number="6"
        title="Role-based access"
      >
        <p>
          PhilaLink provides different
          permissions to different user
          roles, including patients, proxies,
          nurses and administrators.
        </p>

        <p>
          Users may access only the
          information and functions that
          their authorised role permits.
        </p>

        <p>
          Attempting to bypass access
          controls, obtain another person's
          healthcare information without
          authority, or misuse another
          person's account is prohibited.
        </p>
      </Section>


      <Section
        number="7"
        title="Patient responsibilities"
      >
        <p>
          Patients should keep their profile
          and relevant healthcare information
          reasonably accurate and current.
        </p>

        <p>
          Medication logging and reminders
          are intended to assist the patient
          but do not replace the patient's
          responsibility to follow advice
          given by healthcare professionals.
        </p>
      </Section>


      <Section
        number="8"
        title="Proxy access"
      >
        <p>
          A proxy may access only information
          made available through an active,
          authorised relationship with a
          patient.
        </p>

        <p>
          Proxy access must be used solely
          for legitimate healthcare-support
          activities associated with the
          linked patient.
        </p>

        <p>
          A proxy must not disclose or misuse
          patient information obtained
          through PhilaLink.
        </p>
      </Section>


      <Section
        number="9"
        title="Healthcare staff and administrators"
      >
        <p>
          Healthcare workers and
          administrators must use PhilaLink
          only within the authority granted
          by their role and organisation.
        </p>

        <p>
          Clinic-specific users must not
          attempt to view or modify
          information belonging to another
          clinic unless their authorised
          role expressly permits such access.
        </p>
      </Section>


      <Section
        number="10"
        title="Artificial intelligence and chatbot features"
      >
        <p>
          PhilaLink may include
          AI-generated information.
          Artificial intelligence can make
          mistakes, misunderstand questions
          or provide incomplete information.
        </p>

        <p>
          AI-generated content must not be
          relied upon as a diagnosis,
          prescription, emergency assessment
          or substitute for professional
          healthcare advice.
        </p>

        <p>
          Users should seek appropriate
          professional assistance where
          healthcare decisions are required.
        </p>
      </Section>


      <Section
        number="11"
        title="Medication information"
      >
        <p>
          Medication information displayed
          through PhilaLink is intended to
          reflect information available to
          the platform.
        </p>

        <p>
          Users should not change, start or
          stop medication solely because of
          information displayed by PhilaLink.
          Treatment changes should be
          discussed with an appropriate
          healthcare professional.
        </p>
      </Section>


      <Section
        number="12"
        title="Location and third-party information"
      >
        <p>
          Features such as nearby clinic
          searches, maps, weather
          information or external directions
          may depend on third-party services.
        </p>

        <p>
          PhilaLink cannot guarantee that
          third-party location, mapping,
          weather or facility information is
          always complete, current or
          accurate.
        </p>
      </Section>


      <Section
        number="13"
        title="Acceptable use"
      >
        <p>
          Users must not:
        </p>

        <BulletList>
          <li>
            use PhilaLink for unlawful
            purposes;
          </li>

          <li>
            attempt to gain unauthorised
            access to another account,
            patient record, clinic or system;
          </li>

          <li>
            impersonate another person;
          </li>

          <li>
            submit intentionally false or
            harmful information;
          </li>

          <li>
            interfere with or attempt to
            disable platform security;
          </li>

          <li>
            attempt to obtain passwords,
            access tokens, API credentials or
            other protected credentials;
          </li>

          <li>
            automate excessive requests or
            otherwise abuse platform
            resources;
          </li>

          <li>
            attempt to exploit chatbot,
            weather or other third-party
            integrations; or
          </li>

          <li>
            use information obtained through
            PhilaLink in a way that violates
            another person's privacy or
            applicable law.
          </li>
        </BulletList>
      </Section>


      <Section
        number="14"
        title="Security controls"
      >
        <p>
          PhilaLink may apply authentication,
          authorisation, request-rate limits,
          audit logging, account
          verification and other security
          measures.
        </p>

        <p>
          Attempts to circumvent these
          controls may result in access being
          restricted or suspended.
        </p>
      </Section>


      <Section
        number="15"
        title="Availability of the platform"
      >
        <p>
          PhilaLink may occasionally be
          unavailable because of maintenance,
          hosting-provider interruptions,
          internet connectivity, technical
          failures or third-party service
          outages.
        </p>

        <p>
          Continuous or uninterrupted
          availability cannot be guaranteed.
        </p>
      </Section>


      <Section
        number="16"
        title="Privacy"
      >
        <p>
          Personal information processed
          through PhilaLink is governed by
          the PhilaLink Privacy Policy and
          applicable data protection law.
        </p>

        <p>
          Users should review the Privacy
          Policy before submitting personal
          or healthcare information through
          the platform.
        </p>

        <p>
          <Link
            to="/privacy-policy"
            className="text-black underline underline-offset-4"
          >
            Read the PhilaLink Privacy Policy
          </Link>
        </p>
      </Section>


      <Section
        number="17"
        title="Intellectual property"
      >
        <p>
          Unless otherwise stated,
          PhilaLink's original software,
          branding, interface design and
          platform content remain subject to
          applicable intellectual-property
          rights.
        </p>

        <p>
          Third-party names, services,
          libraries and content remain the
          property of their respective
          owners.
        </p>
      </Section>


      <Section
        number="18"
        title="Account restriction or suspension"
      >
        <p>
          Access may be restricted,
          suspended or deactivated where
          reasonably necessary to protect
          patients, users, healthcare
          information, system security or
          platform integrity.
        </p>

        <p>
          Access may also be restricted when
          an account is inactive,
          unauthorised or used in breach of
          these Terms.
        </p>
      </Section>


      <Section
        number="19"
        title="Limitation of responsibility"
      >
        <p>
          PhilaLink is intended to support,
          rather than replace, healthcare
          services and professional
          judgement.
        </p>

        <p>
          To the extent permitted by
          applicable law, PhilaLink is not
          responsible for decisions made
          solely on the basis of inaccurate,
          incomplete or unavailable
          third-party information,
          AI-generated content or information
          entered incorrectly by users.
        </p>

        <p>
          Nothing in these Terms is intended
          to exclude rights or protections
          that cannot lawfully be excluded.
        </p>
      </Section>


      <Section
        number="20"
        title="Changes to these Terms"
      >
        <p>
          These Terms may be updated when
          PhilaLink functionality,
          technology, security requirements
          or applicable law changes.
        </p>

        <p>
          The most recent version will be
          made available through the
          platform.
        </p>
      </Section>


      <Section
        number="21"
        title="Governing law"
      >
        <p>
          These Terms are intended to be
          interpreted in accordance with
          applicable law in the Republic of
          South Africa.
        </p>
      </Section>

    </LegalDocument>
  );
}