# PhilaLink

PhilaLink is a healthcare management platform designed to connect patients, nurses, proxies, clinic administrators, and system administrators through a single digital platform.

This repository contains the **PhilaLink frontend application**, which provides the user interface for accessing the platform's healthcare management features.

---

## Overview

The PhilaLink frontend provides role-based dashboards and features for different types of users.

The main user areas include:

* **Patient** — accesses personal healthcare information, medication tools, reminders, healthcare facilities, and patient-focused services.
* **Nurse** — manages assigned patients, medication collections, and related healthcare activities.
* **Proxy** — manages patients who are under their care.
* **Clinic Administrator** — manages clinic-related staff, patients, activity, analytics, and reports.
* **Administrator** — monitors and manages higher-level platform activities.

Users are automatically directed to the appropriate application area after authentication.

---

## Main Features

### Patient

Patients can:

* Create a PhilaLink account.
* Complete the patient registration process.
* Verify their cellphone number.
* Log in securely.
* View their personal dashboard.
* View medication information.
* Track medication supply.
* Track upcoming medication collection dates.
* View medication collection information.
* Use medication reminder features.
* Access the symptom checker.
* Find nearby healthcare facilities.
* View healthcare-related notifications.
* Manage supported account settings.
* Access the Philani healthcare assistant.

---

### Nurse

Nurses can access features including:

* Nurse dashboard.
* Patient management.
* Patient healthcare information.
* Medication collection management.
* Collection-related activities.
* Patient searching and filtering.
* Audit-related information.
* Clinic-related workflow features.

The nurse interface is designed around day-to-day patient and medication collection activities.

---

### Proxy

Proxies can:

* Access their proxy dashboard.
* View patients assigned to their care.
* View relevant patient information.
* Assist with supported medication and collection-related activities.

Proxy access is limited to information and functionality relevant to patients under their care.

---

### Clinic Administrator

Clinic administrators can access clinic-level management features including:

* Clinic dashboard.
* Clinic statistics.
* Patient information.
* Nurse information.
* Proxy information.
* Medication collection information.
* Clinic activity monitoring.
* Analytics.
* Report generation.

The Clinic Administrator area provides a centralized interface for monitoring and managing activity within a clinic.

---

### Reporting

The frontend includes a reporting interface that allows supported administrative users to generate reports based on selected criteria.

Available reporting areas can include:

* Patients
* Nurses
* Proxies
* Medication collections
* Medication activity
* Collection activity
* Clinic-related statistics

Reports can be filtered using relevant report options and date ranges.

Before generating a report, users can preview the report data in a structured table.

Supported export formats include:

* PDF
* Excel

The exported reports are designed to provide structured and readable healthcare management information.

---

### Analytics

Administrative dashboards include visual summaries and statistics for supported healthcare activities.

Analytics areas can include information relating to:

* Patients
* Staff
* Collections
* Medication activity
* Clinic performance
* Operational trends

The frontend presents this information using cards, tables, charts, filters, and summary components.

---

## Authentication

PhilaLink uses authenticated user accounts with role-based access.

Patients can register through the public patient registration flow.

Staff accounts such as nurses, proxies, and administrative users are managed through authorized administrative workflows.

After successful authentication, the frontend identifies the user's role and directs them to the appropriate dashboard.

---

## Registration Flow

The patient registration process follows a guided multi-step flow.

```text
Create Patient Account
        ↓
Enter Personal Details
        ↓
Verify Cellphone Number
        ↓
Complete Registration
        ↓
Patient Dashboard
```

The registration interface validates required patient information before registration can continue.

---

## User Navigation

### Patient

```text
Dashboard
Medications
Symptom Checker
Clinic Finder
Reminders
Notifications
```

Additional patient features may be available depending on the current application configuration.

---

### Nurse

```text
Dashboard
Patients
Collections
Audit Log
```

---

### Proxy

```text
Dashboard
Patients Under Care
```

---

### Clinic Administrator

```text
Dashboard
Patients
Nurses
Proxies
Collections
Analytics
Reports
```

---

### Administrator

```text
Overview
Staff Management
Analytics
System Management
```

Navigation options may vary depending on the permissions assigned to the authenticated user.

---

## Technology Stack

The PhilaLink frontend is built using:

* React
* Vite
* React Router
* JavaScript
* CSS
* Tailwind CSS utility classes
* Material Symbols

The application communicates with the PhilaLink backend through its API integration layer.

---

## Project Structure

The frontend is organized into reusable application areas.

```text
src/
├── assets/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── chatbot/
│   └── other reusable components/
├── context/
├── lib/
├── pages/
├── routes/
├── services/
│   └── api/
└── application files
```

The application separates:

* Reusable UI components
* Page components
* Authentication state
* API communication
* Navigation
* Dashboard layouts
* Shared application utilities

This structure helps keep the application maintainable as additional healthcare features are introduced.

---

## API Integration

The frontend communicates with the PhilaLink backend using dedicated API service modules.

API-related logic is kept separate from page and component code wherever possible.

This separation helps maintain a clear distinction between:

```text
User Interface
        ↓
Frontend Services
        ↓
Backend API
```

Authenticated requests use the currently authenticated user's session information.

Sensitive authentication configuration and credentials are not stored directly in the frontend source code.

---

## Dashboard Design

PhilaLink uses role-specific dashboards so that users only see features relevant to their responsibilities.

Dashboard interfaces can include:

* Summary cards
* Statistics
* Tables
* Charts
* Filters
* Search controls
* Status indicators
* Notifications
* Report previews
* Responsive navigation

Different dashboards use the same overall PhilaLink design system while presenting information appropriate to each role.

---

## Healthcare Assistant

The frontend includes the **Philani healthcare assistant**.

Philani provides a conversational healthcare interface that can assist users with supported health-related questions and platform interactions.

The chatbot is integrated into the PhilaLink interface while remaining separate from the main dashboard navigation.

Healthcare information provided through the assistant should not be treated as a replacement for professional medical care.

---

## Clinic Finder

The Clinic Finder allows patients to discover healthcare facilities through the PhilaLink interface.

The frontend presents facility information through a location-focused interface designed to help patients identify healthcare services that may be available near them.

---

## Medication Management

Medication-related features are an important part of the patient experience.

The frontend can display information such as:

* Current medications
* Medication supply
* Remaining supply information
* Upcoming collection dates
* Collection status
* Medication reminders

The goal is to help patients understand when medication should be collected and how long their current medication supply is expected to last.

---

## Notifications

PhilaLink includes notification-related features for supported healthcare events.

Notifications can be used to present information relating to:

* Medication reminders
* Collection information
* Healthcare alerts
* Application updates
* Relevant patient activity

Notification presentation is designed to remain accessible across supported device sizes.

---

## UI Design

The PhilaLink interface uses a healthcare-focused visual style built around:

* Clean layouts
* Dashboard cards
* Structured tables
* Responsive forms
* Clear navigation
* Accessible controls
* Status indicators
* Charts
* Modal interfaces
* Report previews

Authentication pages use a focused layout designed to keep registration and login simple and easy to understand.

---

## Responsive Design

PhilaLink is designed to work across:

* Desktop
* Tablet
* Mobile

Navigation, cards, tables, forms, dashboards, and other interface elements adapt to smaller screen sizes.

Responsive behaviour is considered throughout the frontend so that core healthcare features remain usable across supported devices.

---

## Getting Started

Clone the frontend repository and open it in your development environment.

Install the project dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Create a production build using:

```bash
npm run build
```

The frontend must be configured to communicate with a valid PhilaLink backend environment.

Environment-specific configuration should be kept outside the committed source code where appropriate.

---

## Development

When developing new frontend features, keep the application separated into:

* UI components
* Pages
* API services
* Authentication and context logic
* Layout components
* Routing
* Shared utilities

Existing reusable components should be preferred over creating duplicate components.

New features should also follow the existing PhilaLink design language and role-based access structure.

---

## Frontend Security

PhilaLink handles healthcare-related information, so the frontend is designed with authenticated and role-based access in mind.

Frontend security practices include:

* Authenticated application areas
* Role-based navigation
* Protected routes
* Secure handling of authentication state
* Server-side validation through the backend
* Avoiding sensitive configuration in source control
* Limiting functionality according to user permissions

The frontend should never be treated as the final security boundary.

Authorization and sensitive validation must remain enforced by the backend.

---

## Current Application Areas

| Area | Status |
| --- | --- |
| Patient registration | Implemented |
| Patient phone verification | Implemented |
| Login | Implemented |
| Role-based navigation | Implemented |
| Patient dashboard | Implemented |
| Patient medication interface | Implemented |
| Medication tracking | Implemented |
| Medication reminders | Implemented |
| Symptom checker | Implemented |
| Clinic finder | Implemented |
| Healthcare notifications | Implemented |
| Philani healthcare assistant | Implemented |
| Nurse dashboard | Implemented |
| Nurse patient management | Implemented |
| Nurse collection management | Implemented |
| Proxy dashboard | Implemented |
| Patients under proxy care | Implemented |
| Clinic Administrator dashboard | Implemented |
| Clinic staff management interface | Implemented |
| Clinic analytics | Implemented |
| Report Builder | Implemented |
| Report preview tables | Implemented |
| PDF report export | Implemented |
| Excel report export | Implemented |
| Responsive authentication pages | Implemented |
| Responsive dashboard layouts | Implemented |

---

## Development Principles

PhilaLink frontend development follows several core principles.

### Role-Based Design

Each user should only see the tools and navigation relevant to their role.

### Reusable Components

Shared application functionality should be implemented using reusable components whenever possible.

### API Separation

Backend communication should remain inside dedicated service modules instead of being duplicated throughout page components.

### Responsive Interfaces

Features should remain usable on desktop, tablet, and mobile devices.

### Consistent Design

New pages and components should follow the existing PhilaLink visual language.

### Secure Configuration

Sensitive values, credentials, secrets, internal system details, and production configuration should never be committed to the frontend repository.

---

## Project Goal

The goal of the PhilaLink frontend is to provide a clear and accessible healthcare management interface for patients, caregivers, healthcare workers, and administrators.

The frontend is designed around:

* Simple healthcare management
* Role-based functionality
* Accessible information
* Medication collection tracking
* Patient support
* Responsive design
* Secure access
* Clear healthcare workflows

---

## PhilaLink

**Connecting patients, caregivers, nurses, clinics, and healthcare management through one digital platform.**
