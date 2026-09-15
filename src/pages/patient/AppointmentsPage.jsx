import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  Stethoscope,
  Video,
} from "lucide-react";
import {
  Badge,
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";
import { appointmentsApi } from "../../services/api/appointments.js";

function parseDate(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value) {
  const date = parseDate(value);

  if (!date) {
    return "—";
  }

  return date.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeRange(
  scheduledAt,
  durationMinutes
) {
  const start = parseDate(scheduledAt);

  if (!start) {
    return "—";
  }

  const duration =
    Number(durationMinutes) > 0
      ? Number(durationMinutes)
      : 0;

  const end = new Date(
    start.getTime() +
      duration * 60 * 1000
  );

  const startText =
    start.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!duration) {
    return startText;
  }

  const endText =
    end.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return `${startText} – ${endText}`;
}

function normaliseStatus(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function isPastAppointment(appointment) {
  const status = normaliseStatus(
    appointment?.status
  );

  if (
    status === "completed" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "missed" ||
    status === "noshow" ||
    status === "no-show"
  ) {
    return true;
  }

  const date = parseDate(
    appointment?.scheduledAt
  );

  if (!date) {
    return false;
  }

  return date.getTime() < Date.now();
}

function getStatusDetails(statusValue) {
  const status =
    normaliseStatus(statusValue);

  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        variant: "success",
      };

    case "completed":
      return {
        label: "Completed",
        variant: "success",
      };

    case "cancelled":
    case "canceled":
      return {
        label: "Cancelled",
        variant: "default",
      };

    case "pending":
      return {
        label: "Pending",
        variant: "warning",
      };

    case "missed":
    case "noshow":
    case "no-show":
      return {
        label: "Missed",
        variant: "warning",
      };

    case "scheduled":
      return {
        label: "Scheduled",
        variant: "default",
      };

    default:
      return {
        label: statusValue || "Scheduled",
        variant: "default",
      };
  }
}

function getProviderName(appointment) {
  return (
    appointment?.providerName ||
    appointment?.nurseName ||
    "Clinic provider"
  );
}

function isTelehealth(mode) {
  return (
    String(mode ?? "")
      .trim()
      .toLowerCase() === "telehealth"
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-md">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl animate-pulse"
        >
          <div className="h-4 w-44 bg-border-secondary rounded mb-md" />
          <div className="h-3 w-56 bg-border-secondary rounded mb-sm" />
          <div className="h-3 w-40 bg-border-secondary rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ type }) {
  const isUpcoming =
    type === "upcoming";

  return (
    <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl lg:p-2xl text-center">
      <div className="w-12 h-12 mx-auto mb-md rounded-corner-full bg-brand-tertiary flex items-center justify-center">
        <Calendar
          size={20}
          className="text-brand-primary"
        />
      </div>

      <h2 className="text-label text-text-primary font-semibold">
        {isUpcoming
          ? "No upcoming appointments"
          : "No previous appointments"}
      </h2>

      <p className="text-label-sm text-text-secondary mt-xs max-w-md mx-auto">
        {isUpcoming
          ? "You do not currently have any upcoming appointments on record."
          : "There are no past appointments available in your record."}
      </p>
    </div>
  );
}

function AppointmentCard({
  appointment,
  past = false,
}) {
  const status =
    getStatusDetails(
      appointment.status
    );

  const telehealth =
    isTelehealth(appointment.mode);

  return (
    <div
      className={`bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl ${
        past ? "opacity-80" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-md">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-md mb-md">
            <div>
              <h3 className="text-label-sm text-text-primary font-semibold">
                {appointment.type ||
                  "Appointment"}
              </h3>

              {appointment.reason && (
                <p className="text-video-title text-text-secondary mt-xs">
                  {appointment.reason}
                </p>
              )}
            </div>

            <Badge
              label={status.label}
              variant={status.variant}
            />
          </div>

          <div className="flex flex-col gap-sm">
            <div className="flex items-center gap-xs">
              <Calendar
                size={13}
                className="text-text-tertiary flex-shrink-0"
              />

              <span className="text-label-sm text-text-secondary">
                {formatDate(
                  appointment.scheduledAt
                )}
              </span>
            </div>

            <div className="flex items-center gap-xs">
              <Clock
                size={13}
                className="text-text-tertiary flex-shrink-0"
              />

              <span className="text-label-sm text-text-secondary">
                {formatTimeRange(
                  appointment.scheduledAt,
                  appointment.durationMinutes
                )}
              </span>
            </div>

            <div className="flex items-center gap-xs">
              {telehealth ? (
                <Video
                  size={13}
                  className="text-brand-primary flex-shrink-0"
                />
              ) : (
                <MapPin
                  size={13}
                  className="text-text-tertiary flex-shrink-0"
                />
              )}

              <span className="text-label-sm text-text-secondary">
                {telehealth
                  ? "Telehealth"
                  : appointment.clinicName ||
                    "Clinic"}
              </span>
            </div>

            <div className="flex items-center gap-xs">
              <Stethoscope
                size={13}
                className="text-text-tertiary flex-shrink-0"
              />

              <span className="text-label-sm text-text-secondary">
                {getProviderName(
                  appointment
                )}
              </span>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-lg pt-lg border-t border-border-secondary">
              <p className="text-video-title text-text-tertiary mb-xs">
                Notes
              </p>

              <p className="text-label-sm text-text-secondary">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState([]);
  const [tab, setTab] =
    useState("upcoming");
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  const loadAppointments =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await appointmentsApi.getMine();

        setAppointments(
          Array.isArray(result)
            ? result
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load appointments:",
          err
        );

        setError(
          err?.message ||
            "We could not load your appointments."
        );

        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const upcoming =
    useMemo(() => {
      return appointments
        .filter(
          (appointment) =>
            !isPastAppointment(
              appointment
            )
        )
        .sort((a, b) => {
          const aDate =
            parseDate(
              a.scheduledAt
            )?.getTime() ?? 0;

          const bDate =
            parseDate(
              b.scheduledAt
            )?.getTime() ?? 0;

          return aDate - bDate;
        });
    }, [appointments]);

  const past = useMemo(() => {
    return appointments
      .filter((appointment) =>
        isPastAppointment(
          appointment
        )
      )
      .sort((a, b) => {
        const aDate =
          parseDate(
            a.scheduledAt
          )?.getTime() ?? 0;

        const bDate =
          parseDate(
            b.scheduledAt
          )?.getTime() ?? 0;

        return bDate - aDate;
      });
  }, [appointments]);

  const clinicNames =
    useMemo(() => {
      return [
        ...new Set(
          upcoming
            .map(
              (appointment) =>
                appointment.clinicName
            )
            .filter(Boolean)
        ),
      ];
    }, [upcoming]);

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-lg lg:mb-xl gap-md">
        <div>
          <h1 className="text-title text-text-primary">
            Appointments
          </h1>

          <p className="text-label-sm text-text-secondary mt-xs">
            {loading
              ? "Loading your appointments..."
              : `${upcoming.length} upcoming${
                  clinicNames.length === 1
                    ? ` · ${clinicNames[0]}`
                    : ""
                }`}
          </p>
        </div>

        <Button
          variant="subtle"
          iconStart={
            <RefreshCw size={15} />
          }
          onClick={
            loadAppointments
          }
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-lg flex items-start gap-md bg-danger/10 rounded-corner-lg p-md border border-danger/20">
          <AlertCircle
            size={17}
            className="text-danger flex-shrink-0 mt-0.5"
          />

          <div className="flex-1">
            <p className="text-label-sm text-text-primary">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadAppointments
              }
              className="text-label-sm text-brand-primary mt-xs hover:opacity-70 transition-opacity"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-md mb-xl border-b border-border-secondary">
        {[
          {
            key: "upcoming",
            label: `Upcoming (${upcoming.length})`,
          },
          {
            key: "past",
            label: `Past (${past.length})`,
          },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() =>
              setTab(item.key)
            }
            className={`pb-md text-label-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === item.key
                ? "text-brand-primary border-brand-primary"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : tab === "upcoming" ? (
        upcoming.length === 0 ? (
          <EmptyState type="upcoming" />
        ) : (
          <div className="flex flex-col gap-md">
            {upcoming.map(
              (appointment) => (
                <AppointmentCard
                  key={
                    appointment.id
                  }
                  appointment={
                    appointment
                  }
                />
              )
            )}
          </div>
        )
      ) : past.length === 0 ? (
        <EmptyState type="past" />
      ) : (
        <div className="flex flex-col gap-md">
          {past.map(
            (appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={
                  appointment
                }
                past
              />
            )
          )}
        </div>
      )}

      <div className="h-20 lg:hidden" />
    </div>
  );
}