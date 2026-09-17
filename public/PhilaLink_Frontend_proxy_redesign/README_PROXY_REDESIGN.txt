PhilaLink frontend proxy redesign
=================================

Copy the src folder in this bundle over the src folder inside
Syabonga-dev/PhilaLink_Frontend.

What changes:
- Proxy sidebar: Dashboard / Patients / Collections
- Proxy dashboard: summary cards + linked-patient collection table
- Patients: searchable/filterable/sortable table
- Collections: searchable/filterable table with per-patient deep links
- Functional topbar notification dropdown
- Real unread badge
- Mark one / mark all notifications read
- No proxy weather widget

Backend dependency:
Apply the backend bundle first because these pages call:
  GET /api/proxies/me/care
  GET /api/proxies/me/collections
  GET /api/notifications/me

Recommended verification:
  npm install
  npm run dev
