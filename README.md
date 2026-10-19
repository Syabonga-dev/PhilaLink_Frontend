PhilaLink Frontend

PhilaLink is a digital healthcare platform designed to support communication and coordination between patients, healthcare workers, medication proxies, and healthcare administrators. The frontend provides role-specific interfaces for managing healthcare information, appointments, medication-related activities, clinic services, notifications, and administrative operations.

This repository contains the frontend application built with React and Vite.

Table of Contents

- "Overview" (#overview)
- "Key Features" (#key-features)
- "User Roles" (#user-roles)
- "Technology Stack" (#technology-stack)
- "Project Structure" (#project-structure)
- "Prerequisites" (#prerequisites)
- "Getting Started" (#getting-started)
- "Environment Configuration" (#environment-configuration)
- "Running the Application" (#running-the-application)
- "Testing and Code Quality" (#testing-and-code-quality)
- "Application Routes" (#application-routes)
- "API Integration" (#api-integration)
- "Security Considerations" (#security-considerations)
- "Troubleshooting" (#troubleshooting)
- "Contributing" (#contributing)
- "License" (#license)

Overview

PhilaLink provides a role-based healthcare portal with dedicated interfaces for patients, nurses, medication proxies, clinic administrators, and system administrators.

The frontend communicates with a backend API to retrieve and manage application data. The availability and successful operation of individual features depend on the backend services, database, authentication configuration, and the permissions assigned to the current user.

This repository focuses on the frontend and should not be treated as a complete description of the backend architecture.

Key Features

Authentication and Account Management

- User registration and account onboarding.
- Phone verification during registration.
- Login and password recovery interfaces.
- Password-change functionality.
- Google authentication callback handling.
- Clinic registration and registration confirmation pages.
- Legal acceptance, privacy policy, and terms-of-use pages.
- Protected application routes for authenticated users.

Patient Portal

- Patient dashboard with healthcare and appointment information.
- Medication information and medication-related activity.
- Appointment booking, viewing, cancellation, and rescheduling interfaces.
- Access to available healthcare records and summaries.
- Clinic discovery and location-based navigation functionality.
- Account settings and preferences.
- Notifications and unread-notification indicators.
- A healthcare chatbot with a symptom-assessment workflow.

The chatbot and symptom-assessment interfaces are intended to support access to healthcare information. They should not be presented as a replacement for professional medical advice or emergency services.

Nurse Portal

- Nurse dashboard with clinic workload information.
- Patient listing and patient-specific care interfaces.
- Appointment management, including review, status updates, and rescheduling.
- Medication collection management.
- Account settings.
- Access to information available within the nurse's assigned clinic scope.

Medication Proxy Portal

- Proxy dashboard.
- Access to patients assigned to the proxy account.
- Patient-related medication collection information.
- Collection history and related status information.
- Account settings.

Access to patient information depends on the proxy assignments and permissions enforced by the application.

Clinic Administration

- Clinic administration dashboard.
- Staff management.
- Staff registration and account activation or deactivation workflows, where supported.
- Clinic medication inventory management.
- Inventory creation, editing, quantity adjustments, and stock monitoring.
- Clinic audit-log interface.
- Clinic-level reporting.
- Filterable report previews.
- Excel report exports.
- Password-protected PDF report exports.

System Administration

- System-wide administrative dashboard.
- Clinic management.
- Clinic administrator management.
- Clinic administrator registration and assignment workflows.
- System-wide analytics.
- Clinic-specific analytics filtering.
- System-level audit activity.
- System reporting across supported reporting categories.
- Excel and password-protected PDF exports.

Reporting and Analytics

The frontend includes separate reporting interfaces for clinic administrators and system administrators.

Depending on the selected report type and the data returned by the backend, supported reporting areas include:

- Patients.
- Appointments.
- Medication collections.
- Medication adherence.
- Medication inventory.
- Staff.
- Clinics.
- Audit activity.

The clinic and system report builders do not necessarily expose identical report categories. Available filters and report contents depend on the selected report and backend implementation.

Report previews and export requests use the applied report parameters. Successful generation of a report requires the corresponding backend endpoint to be available and authorised.

Notifications and User Experience

- Notification listing and unread-status handling.
- Marking individual notifications as read.
- Marking notifications as read in bulk.
- Notification refresh and error handling.
- Localisation support.
- Theme and language preference handling where implemented.
- Reusable interface components.
- Responsive layout styling.

The precise behaviour of individual notification types depends on the backend and the services that generate them.

User Roles

PhilaLink uses role-restricted frontend routes for different categories of users.

Role| Application area| Main responsibilities
Patient| "/patient"| View healthcare information, manage appointments, discover clinics, and access available patient services.
Proxy| "/proxy"| Access assigned patients and medication collection information.
Nurse| "/nurse"| Review clinic patients, appointments, care information, and medication collections.
Clinic Administrator| "/admin"| Manage clinic operations, staff, inventory, and clinic reports.
System Administrator| "/admin"| Manage clinics and clinic administrators, and access system analytics and reporting.

Clinic administrators and system administrators share the "/admin" application area, but access to administrative features is restricted by role.

The actual permissions for data access and changes must also be enforced by the backend. Frontend route restrictions alone are not sufficient security controls.

Technology Stack

The repository uses the following technologies and libraries.

Technology| Purpose
React| Component-based user interface development.
Vite| Development server and frontend build tooling.
JavaScript and JSX| Application logic and component implementation.
React Router| Client-side navigation and route handling.
Tailwind CSS| Utility-based styling.
CSS| Application and component styling.
Lucide React| Interface icons.
Recharts| Charts and analytics visualisations.
Leaflet and React Leaflet| Map-related functionality where used.
i18next and React i18next| Internationalisation and translation support.
Material Symbols| Additional interface icons.
Vitest| Automated testing.
ESLint| JavaScript and JSX code-quality checks.

The authoritative list of installed dependencies and available npm scripts is maintained in "package.json".

Project Structure

The following is a simplified overview of the source code organisation.

PhilaLink_Frontend/
├── .github/
│   └── workflows/
├── public/
├── src/
│   ├── components/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── nurse/
│   │   ├── operations/
│   │   ├── patient/
│   │   │   └── chatbot/
│   │   ├── privacy/
│   │   ├── proxy/
│   │   └── ui/
│   ├── context/
│   ├── i18n/
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── legal/
│   │   ├── nurse/
│   │   ├── patient/
│   │   └── proxy/
│   ├── routes/
│   ├── services/
│   │   └── api/
│   ├── styles/
│   ├── test/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

This diagram is illustrative rather than exhaustive. Individual files and directories may change as the application develops.

Important Directories

- "src/components/" contains reusable interface components and role-specific layouts.
- "src/components/patient/chatbot/" contains chatbot components and symptom-assessment screens.
- "src/pages/" contains the application pages grouped by role and function.
- "src/routes/" contains route-protection and navigation-related logic where implemented.
- "src/services/api/" contains frontend API clients for backend services.
- "src/i18n/" contains localisation-related code.
- "src/context/" contains application context and shared state.
- "src/styles/" contains styling resources.
- ".github/workflows/" contains automated GitHub Actions workflows.

Prerequisites

Before running the application, ensure that the following are available:

- Node.js, using a version compatible with the Vite version specified in "package.json".
- npm, normally installed with Node.js.
- Git.
- Access to the PhilaLink backend API for features that require server-side data.
- The correct backend base URL and any required authentication configuration.

Check the installed versions:

node --version
npm --version
git --version

If the repository specifies a particular Node.js version in its configuration, use that version.

Getting Started

1. Clone the Repository

git clone https://github.com/Syabonga-dev/PhilaLink_Frontend.git
cd PhilaLink_Frontend

2. Install Dependencies

Install the dependencies defined by the project:

npm install

For reproducible installations in CI or a clean environment, use:

npm ci

Use "npm ci" when the committed lockfile accurately reflects the dependencies in "package.json".

3. Configure Environment Variables

Create a local environment file using the provided example:

cp .env.example .env

On Windows Command Prompt, use:

copy .env.example .env

On Windows PowerShell, use:

Copy-Item .env.example .env

Review the variables in ".env.example" and configure the values required for your environment.

Do not commit personal credentials, access tokens, private keys, or other secrets.

Environment Configuration

The frontend uses the "VITE_API_BASE_URL" environment variable to configure the backend API base URL.

Example:

VITE_API_BASE_URL=http://localhost:5000

The URL above is an example only. Replace it with the actual URL and port used by your backend.

Before starting the application, confirm that:

1. The backend is running.
2. The configured URL points to the correct backend.
3. The backend permits requests from the frontend development origin.
4. The backend authentication mechanism matches the frontend's expectations.
5. Required API endpoints are available.

Vite exposes variables prefixed with "VITE_" to frontend code. Consequently, these variables must not contain secrets.

Running the Application

Start the Development Server

npm run dev

Vite will print the local development URL in the terminal. Open that URL in your browser.

Build for Production

npm run build

The production build is normally generated in the "dist/" directory.

Preview the Production Build

npm run preview

Use the URL printed by Vite to inspect the production build locally.

The preview command is intended for local verification, not as a replacement for a production hosting environment.

Testing and Code Quality

The repository contains automated tests for selected components and pages.

Run the available scripts defined in "package.json".

Run Tests

npm run test

Run the Linter

npm run lint

Run the Production Build

npm run build

A successful production build does not guarantee that every feature works end to end. Where applicable, also test authentication, role-specific navigation, API integration, report exports, and error states against a running backend.

The repository includes a GitHub Actions workflow for automated checks. Consult the workflow files under ".github/workflows/" for the exact checks executed during CI.

Application Routes

The main frontend route groups are organised as follows.

Route| Description
"/"| Public landing page.
"/login"| Login page.
"/register"| User registration.
"/register/verify"| Phone verification.
"/register/clinic"| Clinic registration.
"/register/success"| Registration confirmation.
"/forgot-password"| Password recovery.
"/auth/google/callback"| Google authentication callback.
"/privacy-policy"| Privacy policy.
"/terms-of-use"| Terms of use.
"/change-password"| Password-change flow for eligible authenticated users.
"/legal-acceptance"| Legal acceptance flow.
"/patient"| Patient dashboard and patient services.
"/patient/medications"| Patient medication information.
"/patient/appointments"| Patient appointment management.
"/patient/records"| Patient healthcare records.
"/patient/clinics"| Clinic discovery and navigation.
"/patient/settings"| Patient settings.
"/proxy"| Proxy dashboard.
"/proxy/patients"| Patients assigned to a proxy.
"/proxy/collections"| Proxy medication collections.
"/proxy/settings"| Proxy settings.
"/nurse"| Nurse dashboard.
"/nurse/patients"| Nurse patient list.
"/nurse/patients/:patientId"| Patient-specific nurse care page.
"/nurse/appointments"| Nurse appointment management.
"/nurse/collections"| Medication collection management.
"/nurse/settings"| Nurse settings.
"/admin"| Administrative dashboard.
"/admin/staff"| Staff management.
"/admin/audit"| Administrative audit log.
"/admin/register-staff"| Clinic staff registration.
"/admin/inventory"| Clinic medication inventory.
"/admin/reports"| Clinic reporting.
"/admin/analytics"| System analytics.
"/admin/system-reports"| System-wide reporting.
"/admin/clinics"| Clinic management.
"/admin/clinic-admins"| Clinic administrator management.
"/admin/register-clinic-admin"| Clinic administrator registration.

Nested routes are shown in their full URL form for readability. Actual availability depends on the authenticated user's role and the route protection configured in the application.

This list reflects the routes registered in the frontend and should be updated when routes are added, removed, or renamed. A component file existing in the repository does not automatically make it a reachable application route.

API Integration

The frontend uses dedicated API service modules to communicate with backend endpoints.

Examples include:

- "src/services/api/auth.js" for authentication-related requests.
- "src/services/api/appointments.js" for appointment operations.
- "src/services/api/medications.js" for medication-related requests.
- "src/services/api/clinics.js" for clinic-related functionality.
- "src/services/api/notifications.js" for notifications.
- "src/services/api/clinicAdmin.js" for clinic administration, analytics, inventory, and reporting.
- "src/services/api/superAdmin.js" for system administration, analytics, and reporting.
- "src/services/api/chatbot.js" for chatbot requests.
- "src/services/api/symptomAssessments.js" for symptom-assessment requests.

The precise endpoints and request/response formats are defined in the relevant service modules.

Backend Dependency

The frontend depends on backend services for operations such as:

- Authentication and account management.
- Retrieving and updating healthcare information.
- Appointment management.
- Medication and collection data.
- Clinic and staff management.
- Analytics and reporting.
- Audit activity.
- Notification delivery and status changes.

If an API endpoint is unavailable, misconfigured, or rejects a request, the corresponding frontend feature may fail or display an error.

For complete functionality, run the frontend alongside the compatible backend and any required supporting services.

Security Considerations

PhilaLink handles healthcare-related information, so security and privacy must be considered throughout development and deployment.

The frontend includes protected routes and role-based navigation. These controls improve the user experience and prevent users from navigating directly to interfaces intended for other roles.

However, frontend restrictions are not a substitute for server-side authorisation.

Important considerations include:

- Enforce authentication and permissions on the backend for every protected operation.
- Validate and authorise access to patient records and other sensitive data on the server.
- Protect authentication tokens and review the security implications of browser-side token storage.
- Never include private credentials or secrets in frontend environment variables.
- Use HTTPS in production.
- Configure appropriate cross-origin resource sharing (CORS) policies.
- Avoid logging sensitive patient information or authentication credentials.
- Review dependencies for known vulnerabilities.
- Follow applicable healthcare privacy and data-protection requirements.
- Use synthetic or appropriately de-identified information for development and testing.

The presence of frontend security controls does not, by itself, establish that the complete system has passed a security audit.

Troubleshooting

The frontend cannot connect to the backend

- Check that the backend is running.
- Confirm that "VITE_API_BASE_URL" points to the correct address.
- Inspect browser developer tools for network errors.
- Verify that the backend permits requests from the frontend origin.
- Confirm that the relevant endpoint exists and accepts the request.

The application displays authentication errors

- Confirm that the backend authentication service is available.
- Check whether the session or token has expired.
- Verify that the account has the correct role.
- Inspect the browser console and network responses without exposing credentials or sensitive information.

Dependencies fail to install

- Confirm that the installed Node.js version is compatible with the project.
- Check that "package.json" and "package-lock.json" are present and consistent.
- Try "npm ci" in a clean checkout when appropriate.
- Review the npm error output before deleting or regenerating dependency files.

Tests or builds fail

- Run "npm run lint", "npm run test", and "npm run build" separately.
- Review the first relevant error in the terminal output.
- Check for missing environment configuration and incompatible dependencies.
- Ensure that changes preserve the existing test expectations where those expectations remain valid.

Contributing

Contributions should preserve the existing architecture, security boundaries, and coding conventions.

Suggested workflow:

1. Fork the repository or create a feature branch.
2. Make a focused change.
3. Run the relevant tests and lint checks.
4. Run a production build.
5. Review the changed files for accidental secrets and unrelated modifications.
6. Open a pull request describing the change, its motivation, and the verification performed.

Example branch workflow:

git checkout -b docs/update-readme
git add README.md
git commit -m "docs: update frontend README"
git push -u origin docs/update-readme

Create a pull request from the pushed branch and describe the changes clearly.

License

Refer to the repository's license file, if present, for the applicable licensing terms. If no license has been specified, contact the repository owner before redistributing the project or using it under assumed open-source terms.

Project Status

This README describes the frontend structure and capabilities visible in the repository. Feature availability, production readiness, and end-to-end correctness should be confirmed against the corresponding backend services and a running application.

Update this document whenever application routes, dependencies, environment variables, reporting categories, or supported features change.
