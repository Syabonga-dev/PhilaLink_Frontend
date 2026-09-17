PhilaLink frontend proxy redesign — patient visual style
========================================================

This version deliberately follows the existing Patient Portal visual language.

Proxy layout:
- Same 270px white sidebar structure used by the Patient Portal
- Same 78px header structure
- Same teal active navigation treatment
- Same PhilaLink logo/portal label treatment
- Same circular teal user avatar style
- Same mobile drawer behavior
- Same notification dropdown visual treatment
- NO WeatherChip for Proxy

Proxy navigation remains role-specific:
- Dashboard
- Patients
- Collections

Proxy pages remain role-specific:
- Dashboard uses collection/patient summary cards and patient table
- Patients is a searchable/filterable/sortable table
- Collections is a searchable/filterable table

Backend dependency:
Apply PhilaLink_backend_proxy_redesign.zip first.

Recommended verification:
  npm install
  npm run dev
