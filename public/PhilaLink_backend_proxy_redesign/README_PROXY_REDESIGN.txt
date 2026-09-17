PhilaLink backend proxy redesign
================================

Copy the Controllers folder in this bundle over the Controllers folder
inside Syabonga-dev/PhilaLink.

Adds:
- GET /api/proxies/me/care
- GET /api/proxies/me/collections
- GET /api/notifications/me
- PATCH /api/notifications/me/{id}/read
- PATCH /api/notifications/me/read-all

The notification endpoint also materializes persistent proxy reminders for
linked patients whose medication collection is overdue or due within 48 hours.

No database migration is required because the implementation uses existing
ProxyLink, MedicationCollection and Notification entities.

Recommended verification:
  dotnet build
  dotnet run
