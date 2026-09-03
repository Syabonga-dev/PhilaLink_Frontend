# PhilaLink_Frontend
PhilaLink frontend — a React (Vite) web app connecting patients, nurses, and proxies to South African public healthcare: medication collection tracking, an AI symptom checker (Philani AI), and a live clinic finder. Talks to an ASP.NET Core backend via JWT auth.

## Frontend

The PhilaLink frontend is a React application (built with Vite) that gives patients,
nurses, proxies, and administrators role-specific access to South Africa's public
health portal.

**Core features**
-  JWT-based authentication with role-aware routing (Patient / Nurse / Proxy / Admin)
-  Public self-registration for patients only, with phone verification — Nurse and
  Proxy accounts are provisioned by an Admin
-  Chronic medication tracking and collection history
-  **Philani AI** — an AI-assisted symptom checker and chat triage assistant, proxied
  securely through the backend (no API keys ever exposed to the browser)
-  **Clinic Finder** — live Google Maps integration showing nearby clinics with
  capacity indicators
-  Role-specific dashboards: patient care summaries, nurse patient/collection
  management, proxy oversight of managed patients, and admin staff provisioning
-  Accessible, responsive UI built with Tailwind CSS and a consistent PhilaLink
  design system (teal brand palette, Material Symbols iconography)

**Tech stack:** React 18, Vite, React Router, Tailwind CSS, Google Maps JavaScript API

**Backend:** communicates with an ASP.NET Core REST API (JWT auth, `/api/...` routes)
via a centralized API client — see `src/services/api/` and the [setup instructions](#getting-started)
below for connecting it to your own backend.
