import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Phone,
  Pill,
  RefreshCw,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";
import { patientsApi } from "../../services/api/patients.js";

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
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
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

function formatTimeOnly(value) {
  if (!value) return "—";

  const text = String(value);

  if (/^\d{2}:\d{2}/.test(text)) {
    return text.slice(0, 5);
  }

  return text;
}

function formatNextDose(value) {
  const date = parseDate(value);

  if (!date) {
    return "No next dose";
  }

  const now = new Date();

  const sameDay =
    date.getFullYear() ===
      now.getFullYear() &&
    date.getMonth() ===
      now.getMonth() &&
    date.getDate() ===
      now.getDate();

  if (sameDay) {
    return `Today, ${formatTime(value)}`;
  }

  return `${formatDate(value)}, ${formatTime(
    value
  )}`;
}

function getInitials(name) {
  if (!name) {
    return "P";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}

function getStatusDetails(statusValue) {
  const status = String(
    statusValue ?? ""
  )
    .trim()
    .toLowerCase();

  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        variant: "success",
      };

    case "pending":
      return {
        label: "Pending",
        variant: "warning",
      };

    case "rescheduled":
      return {
        label: "Rescheduled",
        variant: "default",
      };

    case "scheduled":
      return {
        label: "Scheduled",
        variant: "default",
      };

    default:
      return {
        label:
          statusValue || "Scheduled",
        variant: "default",
      };
  }
}

function isClinicOpen(clinic) {
  if (
    !clinic?.openingTime ||
    !clinic?.closingTime
  ) {
    return null;
  }

  const opening =
    formatTimeOnly(
      clinic.openingTime
    );

  const closing =
    formatTimeOnly(
      clinic.closingTime
    );

  const [openHour, openMinute] =
    opening.split(":").map(Number);

  const [closeHour, closeMinute] =
    closing.split(":").map(Number);

  if (
    Number.isNaN(openHour) ||
    Number.isNaN(openMinute) ||
    Number.isNaN(closeHour) ||
    Number.isNaN(closeMinute)
  ) {
    return null;
  }

  const now = new Date();

  const current =
    now.getHours() * 60 +
    now.getMinutes();

  const open =
    openHour * 60 +
    openMinute;

  const close =
    closeHour * 60 +
    closeMinute;

  return (
    current >= open &&
    current < close
  );
}

function LoadingDashboard() {
  return (
    <div className="p-lg md:p-xl lg:p-2xl animate-pulse">
      <div className="mb-xl">
        <div className="h-7 w-64 bg-border-secondary rounded mb-sm" />
        <div className="h-4 w-72 bg-border-secondary rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg lg:gap-xl">
        <div className="md:col-span-2 flex flex-col gap-lg">
          <div className="h-72 bg-surface-bg rounded-corner-lg" />
          <div className="h-48 bg-surface-bg rounded-corner-lg" />
        </div>

        <div className="flex flex-col gap-lg">
          <div className="h-64 bg-surface-bg rounded-corner-lg" />
          <div className="h-48 bg-surface-bg rounded-corner-lg" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await patientsApi.getDashboard();

        setDashboard(result);
      } catch (err) {
        console.error(
          "Failed to load patient dashboard:",
          err
        );

        setDashboard(null);

        setError(
          err?.message ||
            "We could not load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const medications =
    useMemo(
      () =>
        Array.isArray(
          dashboard?.medications
        )
          ? dashboard.medications
          : [],
      [dashboard]
    );

  const appointments =
    useMemo(
      () =>
        Array.isArray(
          dashboard?.upcomingAppointments
        )
          ? dashboard.upcomingAppointments
          : [],
      [dashboard]
    );

  const metrics =
    useMemo(
      () =>
        Array.isArray(
          dashboard?.healthMetrics
        )
          ? dashboard.healthMetrics
          : [],
      [dashboard]
    );

  if (loading) {
    return <LoadingDashboard />;
  }

  const fullName =
    dashboard?.fullName ||
    "Patient";

  const firstName =
    fullName
      .split(" ")
      .filter(Boolean)[0] ||
    "Patient";

  const clinic =
    dashboard?.clinic;

  const clinicOpen =
    clinic
      ? isClinicOpen(clinic)
      : null;

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-lg lg:mb-xl gap-md">
        <div>
          <h1 className="text-title text-text-primary">
            Welcome, {firstName}
          </h1>

          <p className="text-label-sm text-text-secondary mt-xs">
            PhilaLink Patient Portal
          </p>
        </div>

        <div className="flex items-center gap-sm">
          {dashboard?.unreadNotifications >
            0 && (
            <Badge
              label={`${dashboard.unreadNotifications} unread ${
                dashboard.unreadNotifications ===
                1
                  ? "notification"
                  : "notifications"
              }`}
              variant="warning"
            />
          )}

          <Button
            variant="subtle"
            iconStart={
              <RefreshCw
                size={15}
              />
            }
            onClick={loadDashboard}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-lg flex items-start gap-md rounded-corner-lg border border-danger/20 bg-danger/10 p-md">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-danger"
          />

          <div className="flex-1">
            <p className="text-label-sm text-text-primary">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadDashboard
              }
              className="mt-xs text-label-sm text-brand-primary hover:opacity-70"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {!dashboard?.isProfileComplete && (
        <div className="mb-lg rounded-corner-lg border border-warning/20 bg-warning/10 p-md flex items-start gap-md">
          <AlertCircle
            size={17}
            className="text-warning shrink-0 mt-0.5"
          />

          <div className="flex-1">
            <p className="text-label-sm font-medium text-text-primary">
              Complete your patient
              profile
            </p>

            <p className="mt-xs text-video-title text-text-secondary">
              Some PhilaLink features
              may require your profile
              information to be
              complete.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/patient/settings"
              )
            }
            className="text-label-sm text-brand-primary"
          >
            Update
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg lg:gap-xl">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-lg lg:gap-xl">
          <section className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <Pill
                  size={16}
                  className="text-brand-primary"
                />

                <h2 className="text-label text-text-primary font-semibold">
                  My Medications
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/patient/medications"
                  )
                }
                className="text-label-sm text-brand-primary flex items-center gap-xs hover:opacity-70 transition-opacity"
              >
                View all
                <ChevronRight
                  size={14}
                />
              </button>
            </div>

            {medications.length >
            0 ? (
              <div className="flex flex-col">
                {medications.map(
                  (
                    medication,
                    index
                  ) => (
                    <div
                      key={
                        medication.id
                      }
                      className={`flex items-start sm:items-center justify-between py-lg gap-md ${
                        index <
                        medications.length -
                          1
                          ? "border-b border-border-secondary"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-md flex-1 min-w-0">
                        <div className="w-2 h-2 rounded-corner-full bg-brand-primary flex-shrink-0" />

                        <div className="min-w-0">
                          <p className="text-label-sm text-text-primary font-medium truncate">
                            {
                              medication.name
                            }{" "}
                            {
                              medication.dosage
                            }
                          </p>

                          <p className="text-video-title text-text-secondary mt-xs">
                            {medication.instructions ||
                              medication.form ||
                              "No instructions recorded"}
                          </p>

                          {Array.isArray(
                            medication.scheduleTimes
                          ) &&
                            medication
                              .scheduleTimes
                              .length >
                              0 && (
                              <p className="text-video-title text-text-tertiary mt-xs">
                                {medication.scheduleTimes.join(
                                  " · "
                                )}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-xs flex-shrink-0">
                        <div className="flex items-center gap-xs">
                          <Clock
                            size={12}
                            className="text-text-tertiary"
                          />

                          <span className="text-video-title text-text-secondary whitespace-nowrap">
                            {formatNextDose(
                              medication.nextDoseAt
                            )}
                          </span>
                        </div>

                        {medication.daysRemaining !=
                          null && (
                          <span className="text-video-title text-text-tertiary">
                            {
                              medication.daysRemaining
                            }{" "}
                            days remaining
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="py-xl text-center">
                <Pill
                  size={25}
                  className="mx-auto text-text-tertiary"
                />

                <p className="mt-md text-label-sm text-text-secondary">
                  No active
                  medications on
                  record.
                </p>
              </div>
            )}
          </section>

          <section className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <Activity
                  size={16}
                  className="text-brand-primary"
                />

                <h2 className="text-label text-text-primary font-semibold">
                  Health Metrics
                </h2>
              </div>
            </div>

            {metrics.length > 0 ? (
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-md">
                {metrics.map(
                  (metric) => (
                    <div
                      key={metric.id}
                      className="bg-bg-faint rounded-corner-md p-md"
                    >
                      <p className="text-video-title text-text-secondary mb-xs">
                        {
                          metric.metricType
                        }
                      </p>

                      <p className="text-label-sm text-text-primary font-semibold">
                        {
                          metric.value
                        }

                        {metric.unit && (
                          <span className="text-video-title text-text-secondary font-normal ml-xs">
                            {
                              metric.unit
                            }
                          </span>
                        )}
                      </p>

                      {(metric.status ||
                        metric.note) && (
                        <div className="flex items-start gap-xs mt-sm">
                          {String(
                            metric.status ??
                              ""
                          )
                            .toLowerCase()
                            .includes(
                              "normal"
                            ) ||
                          String(
                            metric.status ??
                              ""
                          )
                            .toLowerCase()
                            .includes(
                              "good"
                            ) ? (
                            <CheckCircle
                              size={
                                11
                              }
                              className="text-success mt-[2px]"
                            />
                          ) : (
                            <AlertCircle
                              size={
                                11
                              }
                              className="text-warning mt-[2px]"
                            />
                          )}

                          <span className="text-video-title text-text-secondary">
                            {metric.note ||
                              metric.status}
                          </span>
                        </div>
                      )}

                      <p className="text-video-title text-text-tertiary mt-sm">
                        {formatDate(
                          metric.recordedAt
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="py-xl text-center">
                <Activity
                  size={25}
                  className="mx-auto text-text-tertiary"
                />

                <p className="mt-md text-label-sm text-text-secondary">
                  No health metrics
                  recorded yet.
                </p>
              </div>
            )}
          </section>

          {dashboard?.nextCollection && (
            <section className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl">
              <div className="flex items-start gap-md">
                <div className="w-10 h-10 rounded-corner-full bg-brand-tertiary flex items-center justify-center shrink-0">
                  <Package
                    size={17}
                    className="text-brand-primary"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-label text-text-primary font-semibold">
                    Next medication
                    collection
                  </h2>

                  <p className="mt-xs text-label-sm text-text-secondary">
                    {formatDate(
                      dashboard
                        .nextCollection
                        .scheduledCollectionDate
                    )}
                  </p>

                  {dashboard
                    .nextCollection
                    .clinicName && (
                    <p className="mt-xs text-video-title text-text-secondary">
                      {
                        dashboard
                          .nextCollection
                          .clinicName
                      }
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-lg lg:gap-xl">
          <section className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <Calendar
                  size={16}
                  className="text-brand-primary"
                />

                <h2 className="text-label text-text-primary font-semibold">
                  Appointments
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/patient/appointments"
                  )
                }
                className="text-label-sm text-brand-primary hover:opacity-70 transition-opacity"
              >
                View all
              </button>
            </div>

            {appointments.length >
            0 ? (
              <div className="flex flex-col gap-lg">
                {appointments.map(
                  (appointment) => {
                    const status =
                      getStatusDetails(
                        appointment.status
                      );

                    return (
                      <div
                        key={
                          appointment.id
                        }
                        className="bg-bg-faint rounded-corner-md p-lg"
                      >
                        <div className="flex items-start justify-between gap-md">
                          <div className="flex-1 min-w-0">
                            <p className="text-label-sm text-text-primary font-medium truncate">
                              {appointment.type ||
                                "Appointment"}
                            </p>

                            <p className="text-video-title text-text-secondary mt-xs">
                              {appointment.providerName ||
                                appointment.nurseName ||
                                appointment.clinicName ||
                                "Clinic provider"}
                            </p>
                          </div>

                          <Badge
                            label={
                              status.label
                            }
                            variant={
                              status.variant
                            }
                          />
                        </div>

                        <div className="flex items-center gap-xs mt-md">
                          <Calendar
                            size={11}
                            className="text-text-tertiary"
                          />

                          <span className="text-video-title text-text-secondary">
                            {formatDate(
                              appointment.scheduledAt
                            )}{" "}
                            ·{" "}
                            {formatTime(
                              appointment.scheduledAt
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="py-lg text-center">
                <Calendar
                  size={24}
                  className="mx-auto text-text-tertiary"
                />

                <p className="mt-md text-label-sm text-text-secondary">
                  No upcoming
                  appointments.
                </p>
              </div>
            )}
          </section>

          <section className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl">
            <h2 className="text-label text-text-primary font-semibold mb-lg">
              My Clinic
            </h2>

            {clinic ? (
              <div className="flex flex-col gap-md">
                <p className="text-label-sm text-text-primary font-medium">
                  {clinic.name}
                </p>

                {clinic.address && (
                  <div className="flex items-start gap-xs">
                    <MapPin
                      size={12}
                      className="mt-[2px] text-text-tertiary shrink-0"
                    />

                    <p className="text-label-sm text-text-secondary">
                      {
                        clinic.address
                      }
                    </p>
                  </div>
                )}

                {clinic.contactNumber && (
                  <div className="flex items-center gap-xs">
                    <Phone
                      size={12}
                      className="text-text-tertiary shrink-0"
                    />

                    <a
                      href={`tel:${clinic.contactNumber}`}
                      className="text-label-sm text-text-secondary hover:text-brand-primary"
                    >
                      {
                        clinic.contactNumber
                      }
                    </a>
                  </div>
                )}

                {clinic.openingTime &&
                  clinic.closingTime && (
                    <div className="flex items-center gap-xs">
                      <Activity
                        size={11}
                        className={
                          clinicOpen
                            ? "text-success"
                            : "text-text-tertiary"
                        }
                      />

                      <span className="text-video-title text-text-secondary">
                        {clinicOpen ===
                        null
                          ? ""
                          : clinicOpen
                          ? "Open"
                          : "Closed"}{" "}
                        ·{" "}
                        {formatTimeOnly(
                          clinic.openingTime
                        )}{" "}
                        –{" "}
                        {formatTimeOnly(
                          clinic.closingTime
                        )}
                      </span>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-label-sm text-text-secondary">
                No clinic has been
                assigned to your
                profile.
              </p>
            )}
          </section>

          <section className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl">
            <div className="flex items-center gap-md mb-lg">
              <Avatar
                type="initial"
                initials={getInitials(
                  fullName
                )}
                size="large"
                shape="square"
                className="!rounded-[10px]"
              />

              <div className="min-w-0">
                <p className="text-label-sm text-text-primary font-medium truncate">
                  {fullName}
                </p>

                <p className="text-video-title text-text-secondary">
                  ID:{" "}
                  {dashboard?.patientNumber ||
                    "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <div className="flex justify-between gap-md">
                <span className="text-video-title text-text-secondary">
                  Profile
                </span>

                <span className="text-video-title text-text-primary">
                  {dashboard?.isProfileComplete
                    ? "Complete"
                    : "Incomplete"}
                </span>
              </div>

              <div className="flex justify-between gap-md">
                <span className="text-video-title text-text-secondary">
                  Notifications
                </span>

                <div className="flex items-center gap-xs">
                  <Bell
                    size={11}
                    className="text-text-tertiary"
                  />

                  <span className="text-video-title text-text-primary">
                    {dashboard?.unreadNotifications ??
                      0}{" "}
                    unread
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/patient/settings"
                )
              }
              className="mt-lg text-label-sm text-brand-primary flex items-center gap-xs hover:opacity-70"
            >
              View profile
              <ChevronRight
                size={13}
              />
            </button>
          </section>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}