# PhilaLink

PhilaLink is a healthcare management platform designed to connect patients, nurses, proxies, and administrators through a single digital platform.

The system provides patients with access to their healthcare information and tools, while allowing healthcare staff and administrators to manage patient-related activities securely.

---

## Overview

PhilaLink is built around four main user roles:

* **Patient** — manages their own healthcare information and accesses patient-focused tools.
* **Nurse** — manages patients, collections, and audit-related activities.
* **Proxy** — manages patients who are under their care.
* **Admin** — manages staff accounts and monitors the system.

The platform uses role-based authentication so that users are directed to the appropriate dashboard after logging in.

---

## Main Features

### Patient

Patients can:

* Create their own PhilaLink account.
* Register using their South African ID number and cellphone number.
* Verify their cellphone number.
* Log in securely.
* View their patient dashboard.
* Manage medications.
* Use the symptom checker.
* Find healthcare facilities.
* Receive medication/reminder notifications.

### Nurse

Nurses have access to:

* Nurse dashboard.
* Patient management.
* Patient collections.
* Audit logs.

### Proxy

Proxies can:

* Access their proxy dashboard.
* View and manage patients under their care.

### Administrator

Administrators can:

* View system overview statistics.
* Register nurses and proxies.
* Manage staff accounts.
* View system analytics.

The administrator dashboard includes system statistics such as:

* Total patients
* Active nurses
* Active proxies
* Pending verifications

---

## Authentication

PhilaLink uses authenticated user accounts with role-based access.

Patients can self-register through the public registration flow.

Nurse and Proxy accounts are created by an administrator rather than through the public patient registration page.

After successful authentication, users are redirected to the dashboard associated with their role.

---

## Registration Flow

The patient registration process follows these steps:

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

The registration form validates:

* Full name
* 13-digit South African ID number
* South African cellphone number
* Optional email address
* Password
* Password confirmation

---

## User Navigation

### Patient

```text
Dashboard
Medications
Symptom Checker
Clinic Finder
Reminders
```

### Nurse

```text
Dashboard
Patients
Collections
Audit Log
```

### Proxy

```text
Dashboard
Patients Under Care
```

### Admin

```text
Overview
Register Staff
Manage Staff
View Analytics
```

---

## Technology Stack

### Frontend

The frontend is built using:

* React
* Vite
* React Router
* JavaScript
* CSS
* Tailwind CSS utility classes
* Material Symbols

### Backend

The backend is built using:

* ASP.NET Core
* Entity Framework Core
* SQL Server
* JWT authentication

The backend exposes the API used by the React frontend.

---

## Project Structure

### Frontend

The React application is organised into areas such as:

```text
src/
├── assets/
├── components/
│   ├── layout/
│   └── ui/
├── context/
├── lib/
├── routes/
├── services/
│   └── api/
└── pages/
```

The application separates reusable UI components, authentication state, API services, routing, and individual pages.

### Backend

The backend follows an ASP.NET Core structure with areas including:

```text
Data/
Services/
Controllers/
Models/
```

Entity Framework Core is used to communicate with the SQL Server database.

---

## Database

The PhilaLink backend uses SQL Server with Entity Framework Core.

The system includes entities supporting the main user roles, including:

* Users
* Patients
* Nurses
* Proxies
* Admins

User authentication information is associated with the relevant role-specific records.

---

## API Authentication

PhilaLink uses JWT-based authentication.

Authenticated requests include a JWT access token, allowing the backend to identify the logged-in user and enforce role-based access.

The backend authentication configuration supports roles such as:

```text
Patient
Nurse
Proxy
Admin
```

---

## UI Design

The PhilaLink interface uses a healthcare-focused visual style built around clean layouts, accessible forms, cards, navigation components, and responsive pages.

The authentication pages include:

* Login
* Patient registration
* Phone verification

The login and registration pages use a blurred healthcare-themed background image with a focused foreground form.

---

## Responsive Design

PhilaLink is designed to work across:

* Desktop
* Tablet
* Mobile

Navigation and form layouts adapt to smaller screens so that the main functionality remains accessible on mobile devices.

---

## Getting Started

Clone the project and open the frontend and backend projects in your development environment.

### Frontend

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

### Backend

Open the ASP.NET Core backend project and configure the required SQL Server connection and authentication settings.

Then run the backend using the normal ASP.NET Core development workflow.

> Make sure the frontend API configuration points to the running PhilaLink backend.

---

## Development

When developing new features, keep the application separated into:

* UI components
* Pages
* API services
* Authentication/context logic
* Backend services
* Database entities

Existing reusable components should be preferred over creating duplicate UI components.

---

## Security

PhilaLink handles healthcare-related information, so authentication and authorization are important parts of the system.

The application uses:

* JWT authentication
* Role-based authorization
* Password hashing on the backend
* Authenticated API requests
* Server-side validation

Sensitive configuration values such as database credentials and JWT secrets should not be committed to source control.

---

## Current Application Areas

The current application includes:

| Area                            | Status      |
| ------------------------------- | ----------- |
| Patient registration            | Implemented |
| Patient phone verification flow | Implemented |
| Login                           | Implemented |
| JWT authentication              | Implemented |
| Patient dashboard navigation    | Implemented |
| Nurse navigation                | Implemented |
| Proxy navigation                | Implemented |
| Admin navigation                | Implemented |
| Admin staff registration        | Implemented |
| Admin staff management          | Implemented |
| Admin analytics navigation      | Added       |
| Responsive authentication pages | Implemented |

---

## Project Goal

The goal of PhilaLink is to provide a central healthcare platform where patients and healthcare-related users can securely access the information and functionality relevant to them.

The platform is designed around **secure access, role-based functionality, and simple healthcare management**.

---

## PhilaLink

**Connecting patients, caregivers, nurses, and healthcare management in one platform.**
