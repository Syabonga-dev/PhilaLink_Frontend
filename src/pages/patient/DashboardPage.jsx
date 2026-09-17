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
  Mail,
  MapPin,
  Package,
  Phone,
  Pill,
  RefreshCw,
  UserRound,
} from "lucide-react";

import {
  Avatar,
  Badge,
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";

import { patientsApi } from "../../services/api/patients.js";
import { proxiesApi } from "../../services/api/proxies.js";
import { medicationsApi } from "../../services/api/medications.js";

function parseDate(value) {
  if (!value) {
    return null;
  }

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

  return date.toLocaleDateString(
    "en-ZA",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );
}

function formatAssignedDate(value) {
  const date = parseDate(value);

  if (!date) {
    return "Assignment date unavailable";
  }

  return date.toLocaleDateString(
    "en-ZA",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function formatTime(value) {
  const date = parseDate(value);

  if (!date) {
    return "—";
  }

  return date.toLocaleTimeString(
    "en-ZA",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatTimeOnly(value) {
  if (!value) {
    return "—";
  }

  const text = String(value);

  if (/^\d{2}:\d{2}/.test(text)) {
    return text.slice(0, 5);
  }

  return text;
}

function formatQuantity(value) {
  if (value == null) {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return Number.isInteger(number)
    ? String(number)
    : number.toFixed(1);
}

function getCollectionState(collection) {
  if (!collection) {
    return {
      type: "none",
      label: "No upcoming collection",
      message:
        "There is no medication collection currently scheduled.",
    };
  }

  const scheduledDate = parseDate(
    collection.scheduledCollectionDate
  );

  if (!scheduledDate) {
    return {
      type: "unknown",
      label:
        collection.status ||
        "Collection scheduled",
      message:
        "Collection date unavailable.",
    };
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const scheduled = new Date(
    scheduledDate.getFullYear(),
    scheduledDate.getMonth(),
    scheduledDate.getDate()
  );

  const differenceMs =
    scheduled.getTime() -
    today.getTime();

  const differenceDays = Math.round(
    differenceMs /
      (1000 * 60 * 60 * 24)
  );

  const status = String(
    collection.status ?? ""
  )
    .trim()
    .toLowerCase();

  if (
    status === "overdue" ||
    differenceDays < 0
  ) {
    const daysOverdue = Math.abs(
      differenceDays
    );

    return {
      type: "overdue",
      label: "Overdue",
      message:
        daysOverdue === 1
          ? "Collection was due yesterday."
          : `Collection is ${daysOverdue} days overdue.`,
    };
  }

  if (differenceDays === 0) {
    return {
      type: "today",
      label: "Due today",
      message:
        "Your medication collection is due today.",
    };
  }

  if (differenceDays === 1) {
    return {
      type: "upcoming",
      label: "Tomorrow",
      message:
        "Your medication collection is tomorrow.",
    };
  }

  return {
    type: "upcoming",
    label: `${differenceDays} days`,
    message:
      `Your medication collection is in ${differenceDays} days.`,
  };
}

function getCollectionBadgeVariant(type) {
  switch (type) {
    case "overdue":
      return "warning";

    case "today":
      return "success";

    default:
      return "default";
  }
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

  return `${formatDate(value)}, ${formatTime(value)}`;
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
      part
        .charAt(0)
        .toUpperCase()
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
          statusValue ||
          "Scheduled",
        variant: "default",
      };
  }
}

function getSupplyStatusDetails(supply) {
  const status = String(
    supply?.calculationStatus ?? ""
  )
    .trim()
    .toLowerCase();

  switch (status) {
    case "available":
      if (
        supply?.daysRemaining != null
      ) {
        const days =
          Number(supply.daysRemaining);

        if (days <= 3) {
          return {
            label:
              days === 1
                ? "1 day remaining"
                : `${days} days remaining`,
            variant: "warning",
            message:
              "Your estimated medication supply is running low.",
          };
        }

        return {
          label:
            `${days} days remaining`,
          variant: "success",
          message:
            `${formatQuantity(
              supply.estimatedRemainingQuantity
            )} units estimated remaining`,
        };
      }

      return {
        label: "Supply available",
        variant: "success",
        message:
          `${formatQuantity(
            supply?.estimatedRemainingQuantity
          )} units estimated remaining`,
      };

    case "nocompletedcollection":
      return {
        label: "Supply unavailable",
        variant: "default",
        message:
          "No completed collection is available for this medication yet.",
      };

    case "missingunitsperdose":
      return {
        label: "Needs dose information",
        variant: "warning",
        message:
          "Supply cannot be calculated until units per dose are recorded.",
      };

    case "missingschedule":
      return {
        label: "Needs schedule",
        variant: "warning",
        message:
          "Supply cannot be calculated until an active medication schedule exists.",
      };

    default:
      return {
        label: "Supply unavailable",
        variant: "default",
        message:
          "Medication supply information is currently unavailable.",
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

  const opening = formatTimeOnly(
    clinic.openingTime
  );

  const closing = formatTimeOnly(
    clinic.closingTime
  );

  const [
    openHour,
    openMinute,
  ] =
    opening
      .split(":")
      .map(Number);

  const [
    closeHour,
    closeMinute,
  ] =
    closing
      .split(":")
      .map(Number);

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
    <div className="animate-pulse p-lg md:p-xl lg:p-2xl">
      <div className="mb-xl">
        <div className="mb-sm h-7 w-64 rounded bg-border-secondary" />
        <div className="h-4 w-72 rounded bg-border-secondary" />
      </div>

      <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3 lg:gap-xl">
        <div className="flex flex-col gap-lg md:col-span-2">
          <div className="h-72 rounded-corner-lg bg-surface-bg" />
          <div className="h-48 rounded-corner-lg bg-surface-bg" />
          <div className="h-48 rounded-corner-lg bg-surface-bg" />
        </div>

        <div className="flex flex-col gap-lg">
          <div className="h-64 rounded-corner-lg bg-surface-bg" />
          <div className="h-48 rounded-corner-lg bg-surface-bg" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate =
    useNavigate();

  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  const [
    assignedWorker,
    setAssignedWorker,
  ] = useState(null);

  const [
    medicationSupply,
    setMedicationSupply,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    workerLoading,
    setWorkerLoading,
  ] = useState(true);

  const [
    workerError,
    setWorkerError,
  ] = useState("");

  const [
    supplyLoading,
    setSupplyLoading,
  ] = useState(true);

  const [
    supplyError,
    setSupplyError,
  ] = useState("");

  const loadDashboard =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await patientsApi
              .getDashboard();

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
      },
      []
    );

  const loadAssignedWorker =
    useCallback(
      async () => {
        try {
          setWorkerLoading(true);
          setWorkerError("");

          const result =
            await proxiesApi
              .getMyAssignedWorker();

          setAssignedWorker(
            result || null
          );
        } catch (err) {
          console.error(
            "Failed to load assigned primary health care worker:",
            err
          );

          setAssignedWorker(null);

          setWorkerError(
            err?.message ||
              "Could not load your assigned health care worker."
          );
        } finally {
          setWorkerLoading(false);
        }
      },
      []
    );

  const loadMedicationSupply =
    useCallback(
      async () => {
        try {
          setSupplyLoading(true);
          setSupplyError("");

          const result =
            await medicationsApi
              .getSupply();

          setMedicationSupply(
            Array.isArray(result)
              ? result
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load medication supply:",
            err
          );

          setMedicationSupply([]);

          setSupplyError(
            err?.message ||
              "Could not load medication supply information."
          );
        } finally {
          setSupplyLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadDashboard();
    loadAssignedWorker();
    loadMedicationSupply();
  }, [
    loadDashboard,
    loadAssignedWorker,
    loadMedicationSupply,
  ]);

  const medicationSupplyById =
    useMemo(() => {
      const map =
        new Map();

      medicationSupply.forEach(
        (item) => {
          if (
            item?.medicationId
          ) {
            map.set(
              String(
                item.medicationId
              ).toLowerCase(),
              item
            );
          }
        }
      );

      return map;
    }, [medicationSupply]);

  const medications =
    useMemo(
      () =>
        Array.isArray(
          dashboard?.medications
        )
          ? dashboard.medications.map(
              (medication) => {
                const supply =
                  medicationSupplyById.get(
                    String(
                      medication?.id ?? ""
                    ).toLowerCase()
                  ) || null;

                return {
                  ...medication,
                  supply,
                };
              }
            )
          : [],
      [
        dashboard,
        medicationSupplyById,
      ]
    );

  const appointments =
    useMemo(
      () =>
        Array.isArray(
          dashboard
            ?.upcomingAppointments
        )
          ? dashboard
              .upcomingAppointments
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
    return (
      <LoadingDashboard />
    );
  }

  if (error || !dashboard) {
    return (
      <div className="p-lg md:p-xl lg:p-2xl">
        <div className="mx-auto max-w-2xl rounded-corner-lg border border-danger/20 bg-surface-bg p-xl">
          <div className="flex items-start gap-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-full bg-danger/10">
              <AlertCircle
                size={18}
                className="text-danger"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-label font-semibold text-text-primary">
                We could not load your dashboard
              </h1>

              <p className="mt-xs text-label-sm text-text-secondary">
                {error ||
                  "Your dashboard data is currently unavailable."}
              </p>

              <Button
                variant="subtle"
                iconStart={
                  <RefreshCw
                    size={15}
                  />
                }
                onClick={
                  loadDashboard
                }
                className="mt-lg"
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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

  const collectionState =
    getCollectionState(
      dashboard
        ?.nextCollection
    );

  const refreshAll =
    () => {
      loadDashboard();
      loadAssignedWorker();
      loadMedicationSupply();
    };

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            Welcome,{" "}
            {firstName}
          </h1>

          <p className="mt-xs text-label-sm text-text-secondary">
            PhilaLink Patient Portal
          </p>
        </div>

        <div className="flex items-center gap-sm">
          {dashboard
            ?.unreadNotifications >
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
            onClick={
              refreshAll
            }
          >
            Refresh
          </Button>
        </div>
      </div>

      {!dashboard.isProfileComplete && (
        <div className="mb-lg flex items-start gap-md rounded-corner-lg border border-warning/20 bg-warning/10 p-md">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-warning"
          />

          <div className="flex-1">
            <p className="text-label-sm font-medium text-text-primary">
              Complete your patient profile
            </p>

            <p className="mt-xs text-video-title text-text-secondary">
              Some PhilaLink features may require your profile information to be complete.
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

      <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3 lg:gap-xl">
        <div className="col-span-1 flex flex-col gap-lg md:col-span-2 lg:gap-xl">
          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Pill
                  size={16}
                  className="text-brand-primary"
                />

                <h2 className="text-label font-semibold text-text-primary">
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
                className="flex items-center gap-xs text-label-sm text-brand-primary transition-opacity hover:opacity-70"
              >
                View all

                <ChevronRight
                  size={14}
                />
              </button>
            </div>

            {supplyError && (
              <div className="mb-md flex items-start gap-sm rounded-corner-md border border-warning/20 bg-warning/10 p-md">
                <AlertCircle
                  size={15}
                  className="mt-[2px] shrink-0 text-warning"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-label-sm text-text-primary">
                    {supplyError}
                  </p>

                  <button
                    type="button"
                    onClick={
                      loadMedicationSupply
                    }
                    className="mt-xs text-label-sm text-brand-primary hover:opacity-70"
                  >
                    Try supply again
                  </button>
                </div>
              </div>
            )}

            {medications.length >
            0 ? (
              <div className="flex flex-col">
                {medications.map(
                  (
                    medication,
                    index
                  ) => {
                    const supplyDetails =
                      getSupplyStatusDetails(
                        medication.supply
                      );

                    return (
                      <div
                        key={
                          medication.id
                        }
                        className={`flex flex-col gap-md py-lg sm:flex-row sm:items-start sm:justify-between ${
                          index <
                          medications.length -
                            1
                            ? "border-b border-border-secondary"
                            : ""
                        }`}
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-md">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-corner-full bg-brand-primary" />

                          <div className="min-w-0">
                            <p className="truncate text-label-sm font-medium text-text-primary">
                              {
                                medication.name
                              }{" "}
                              {
                                medication.dosage
                              }
                            </p>

                            <p className="mt-xs text-video-title text-text-secondary">
                              {medication.instructions ||
                                medication.form ||
                                "No instructions recorded"}
                            </p>

                            {Array.isArray(
                              medication
                                .scheduleTimes
                            ) &&
                              medication
                                .scheduleTimes
                                .length >
                                0 && (
                                <p className="mt-xs text-video-title text-text-tertiary">
                                  {medication.scheduleTimes.join(
                                    " · "
                                  )}
                                </p>
                              )}

                            {!supplyLoading && (
                              <div className="mt-sm flex flex-wrap items-center gap-sm">
                                <Badge
                                  label={
                                    supplyDetails.label
                                  }
                                  variant={
                                    supplyDetails.variant
                                  }
                                />

                                <span className="text-video-title text-text-tertiary">
                                  {
                                    supplyDetails.message
                                  }
                                </span>
                              </div>
                            )}

                            {medication
                              .supply
                              ?.lastCollectedAt && (
                              <p className="mt-xs text-video-title text-text-tertiary">
                                Last collected:{" "}
                                {formatDate(
                                  medication
                                    .supply
                                    .lastCollectedAt
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-shrink-0 flex-col items-start gap-xs sm:items-end">
                          <div className="flex items-center gap-xs">
                            <Clock
                              size={12}
                              className="text-text-tertiary"
                            />

                            <span className="whitespace-nowrap text-video-title text-text-secondary">
                              {formatNextDose(
                                medication
                                  .nextDoseAt
                              )}
                            </span>
                          </div>

                          {supplyLoading ? (
                            <span className="text-video-title text-text-tertiary">
                              Loading supply…
                            </span>
                          ) : medication
                              .supply
                              ?.estimatedRemainingQuantity !=
                            null ? (
                            <span className="text-video-title text-text-tertiary">
                              {formatQuantity(
                                medication
                                  .supply
                                  .estimatedRemainingQuantity
                              )}{" "}
                              units left
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="py-xl text-center">
                <Pill
                  size={25}
                  className="mx-auto text-text-tertiary"
                />

                <p className="mt-md text-label-sm text-text-secondary">
                  No active medications on record.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Activity
                  size={16}
                  className="text-brand-primary"
                />

                <h2 className="text-label font-semibold text-text-primary">
                  Health Metrics
                </h2>
              </div>
            </div>

            {metrics.length >
            0 ? (
              <div className="flex flex-col gap-md sm:grid sm:grid-cols-3">
                {metrics.map(
                  (metric) => (
                    <div
                      key={
                        metric.id
                      }
                      className="rounded-corner-md bg-bg-faint p-md"
                    >
                      <p className="mb-xs text-video-title text-text-secondary">
                        {
                          metric.metricType
                        }
                      </p>

                      <p className="text-label-sm font-semibold text-text-primary">
                        {
                          metric.value
                        }

                        {metric.unit && (
                          <span className="ml-xs text-video-title font-normal text-text-secondary">
                            {
                              metric.unit
                            }
                          </span>
                        )}
                      </p>

                      {(metric.status ||
                        metric.note) && (
                        <div className="mt-sm flex items-start gap-xs">
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
                              size={11}
                              className="mt-[2px] text-success"
                            />
                          ) : (
                            <AlertCircle
                              size={11}
                              className="mt-[2px] text-warning"
                            />
                          )}

                          <span className="text-video-title text-text-secondary">
                            {metric.note ||
                              metric.status}
                          </span>
                        </div>
                      )}

                      <p className="mt-sm text-video-title text-text-tertiary">
                        {formatDate(
                          metric
                            .recordedAt
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
                  No health metrics recorded yet.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
            <div className="flex items-start gap-md">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-full ${
                  collectionState.type ===
                  "overdue"
                    ? "bg-warning/10"
                    : "bg-brand-tertiary"
                }`}
              >
                {collectionState.type ===
                "overdue" ? (
                  <AlertCircle
                    size={17}
                    className="text-warning"
                  />
                ) : (
                  <Package
                    size={17}
                    className="text-brand-primary"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-label font-semibold text-text-primary">
                      Next medication collection
                    </h2>

                    <p className="mt-xs text-label-sm text-text-secondary">
                      {
                        collectionState.message
                      }
                    </p>
                  </div>

                  {dashboard
                    ?.nextCollection && (
                    <Badge
                      label={
                        collectionState.label
                      }
                      variant={getCollectionBadgeVariant(
                        collectionState.type
                      )}
                    />
                  )}
                </div>

                {dashboard
                  ?.nextCollection ? (
                  <div className="mt-lg flex flex-col gap-sm">
                    <div className="flex items-center gap-xs">
                      <Calendar
                        size={13}
                        className={
                          collectionState.type ===
                          "overdue"
                            ? "shrink-0 text-warning"
                            : "shrink-0 text-text-tertiary"
                        }
                      />

                      <span className="text-label-sm font-medium text-text-primary">
                        {formatDate(
                          dashboard
                            .nextCollection
                            .scheduledCollectionDate
                        )}
                      </span>
                    </div>

                    {dashboard
                      .nextCollection
                      .clinicName && (
                      <div className="flex items-start gap-xs">
                        <MapPin
                          size={13}
                          className="mt-[2px] shrink-0 text-text-tertiary"
                        />

                        <span className="text-label-sm text-text-secondary">
                          {
                            dashboard
                              .nextCollection
                              .clinicName
                          }
                        </span>
                      </div>
                    )}

                    {dashboard
                      .nextCollection
                      .medicationName && (
                      <div className="flex items-start gap-xs">
                        <Pill
                          size={13}
                          className="mt-[2px] shrink-0 text-text-tertiary"
                        />

                        <span className="text-label-sm text-text-secondary">
                          {
                            dashboard
                              .nextCollection
                              .medicationName
                          }
                        </span>
                      </div>
                    )}

                    {Array.isArray(
                      dashboard
                        .nextCollection
                        .items
                    ) &&
                      dashboard
                        .nextCollection
                        .items.length >
                        0 && (
                        <div className="mt-sm border-t border-border-secondary pt-md">
                          <p className="mb-sm text-video-title text-text-tertiary">
                            Medication collection
                          </p>

                          <div className="flex flex-col gap-xs">
                            {dashboard
                              .nextCollection
                              .items.map(
                                (
                                  item
                                ) => (
                                  <div
                                    key={
                                      item.id
                                    }
                                    className="flex items-start justify-between gap-md"
                                  >
                                    <span className="min-w-0 text-label-sm text-text-secondary">
                                      {
                                        item.medicationName
                                      }

                                      {item.dosage
                                        ? ` ${item.dosage}`
                                        : ""}
                                    </span>

                                    <span className="shrink-0 text-video-title text-text-tertiary">
                                      Qty{" "}
                                      {
                                        item.quantity
                                      }
                                    </span>
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      )}

                    {dashboard
                      .nextCollection
                      .notes && (
                      <div className="mt-sm rounded-corner-md bg-bg-faint p-md">
                        <p className="text-video-title text-text-tertiary">
                          Collection note
                        </p>

                        <p className="mt-xs text-label-sm text-text-secondary">
                          {
                            dashboard
                              .nextCollection
                              .notes
                          }
                        </p>
                      </div>
                    )}

                    {collectionState.type ===
                      "overdue" && (
                      <div className="mt-sm rounded-corner-md border border-warning/20 bg-warning/10 p-md">
                        <div className="flex items-start gap-sm">
                          <AlertCircle
                            size={15}
                            className="mt-[2px] shrink-0 text-warning"
                          />

                          <p className="text-label-sm text-text-secondary">
                            Please contact your clinic if you are unable to collect your medication as scheduled.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-lg rounded-corner-md bg-bg-faint p-lg text-center">
                    <Package
                      size={24}
                      className="mx-auto text-text-tertiary"
                    />

                    <p className="mt-md text-label-sm font-medium text-text-primary">
                      Nothing scheduled
                    </p>

                    <p className="mt-xs text-video-title text-text-secondary">
                      When your clinic schedules your next medication collection, it will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-lg lg:gap-xl">
          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Calendar
                  size={16}
                  className="text-brand-primary"
                />

                <h2 className="text-label font-semibold text-text-primary">
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
                className="text-label-sm text-brand-primary transition-opacity hover:opacity-70"
              >
                View all
              </button>
            </div>

            {appointments.length >
            0 ? (
              <div className="flex flex-col gap-lg">
                {appointments.map(
                  (
                    appointment
                  ) => {
                    const status =
                      getStatusDetails(
                        appointment.status
                      );

                    return (
                      <div
                        key={
                          appointment.id
                        }
                        className="rounded-corner-md bg-bg-faint p-lg"
                      >
                        <div className="flex items-start justify-between gap-md">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-label-sm font-medium text-text-primary">
                              {appointment.type ||
                                "Appointment"}
                            </p>

                            <p className="mt-xs text-video-title text-text-secondary">
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

                        <div className="mt-md flex items-center gap-xs">
                          <Calendar
                            size={11}
                            className="text-text-tertiary"
                          />

                          <span className="text-video-title text-text-secondary">
                            {formatDate(
                              appointment
                                .scheduledAt
                            )}{" "}
                            ·{" "}
                            {formatTime(
                              appointment
                                .scheduledAt
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
                  No upcoming appointments.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
            <h2 className="mb-lg text-label font-semibold text-text-primary">
              My Clinic
            </h2>

            {clinic ? (
              <div className="flex flex-col gap-md">
                <p className="text-label-sm font-medium text-text-primary">
                  {
                    clinic.name
                  }
                </p>

                {clinic.address && (
                  <div className="flex items-start gap-xs">
                    <MapPin
                      size={12}
                      className="mt-[2px] shrink-0 text-text-tertiary"
                    />

                    <p className="text-label-sm text-text-secondary">
                      {
                        clinic.address
                      }
                    </p>
                  </div>
                )}

                {clinic
                  .contactNumber && (
                  <div className="flex items-center gap-xs">
                    <Phone
                      size={12}
                      className="shrink-0 text-text-tertiary"
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

                {clinic
                  .openingTime &&
                  clinic
                    .closingTime && (
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
                          clinic
                            .openingTime
                        )}{" "}
                        –{" "}
                        {formatTimeOnly(
                          clinic
                            .closingTime
                        )}
                      </span>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-label-sm text-text-secondary">
                No clinic has been assigned to your profile.
              </p>
            )}
          </section>

          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center gap-sm">
              <UserRound
                size={16}
                className="text-brand-primary"
              />

              <h2 className="text-label font-semibold text-text-primary">
                Assigned Primary Health Care Worker
              </h2>
            </div>

            {workerLoading ? (
              <div className="animate-pulse">
                <div className="mb-md flex items-center gap-md">
                  <div className="h-11 w-11 shrink-0 rounded-corner-full bg-border-secondary" />

                  <div className="flex-1">
                    <div className="mb-xs h-4 w-32 rounded bg-border-secondary" />
                    <div className="h-3 w-24 rounded bg-border-secondary" />
                  </div>
                </div>

                <div className="flex flex-col gap-sm">
                  <div className="h-3 w-full rounded bg-border-secondary" />
                  <div className="h-3 w-3/4 rounded bg-border-secondary" />
                </div>
              </div>
            ) : workerError ? (
              <div className="rounded-corner-md border border-danger/20 bg-danger/10 p-md">
                <div className="flex items-start gap-sm">
                  <AlertCircle
                    size={16}
                    className="mt-[2px] shrink-0 text-danger"
                  />

                  <div>
                    <p className="text-label-sm text-text-primary">
                      {
                        workerError
                      }
                    </p>

                    <button
                      type="button"
                      onClick={
                        loadAssignedWorker
                      }
                      className="mt-sm text-label-sm text-brand-primary hover:opacity-70"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : assignedWorker ? (
              <div className="flex flex-col gap-md">
                <div className="flex min-w-0 items-center gap-md">
                  <Avatar
                    type="initial"
                    initials={getInitials(
                      assignedWorker.fullName
                    )}
                    size="large"
                    shape="square"
                    className="!rounded-[10px]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label-sm font-medium text-text-primary">
                      {
                        assignedWorker.fullName
                      }
                    </p>

                    <div className="mt-xs flex items-center gap-xs">
                      <span className="h-2 w-2 rounded-corner-full bg-success" />

                      <span className="text-video-title text-text-secondary">
                        Active assignment
                      </span>
                    </div>
                  </div>
                </div>

                {assignedWorker
                  .phoneNumber && (
                  <div className="flex items-center gap-sm">
                    <Phone
                      size={13}
                      className="shrink-0 text-text-tertiary"
                    />

                    <a
                      href={`tel:${assignedWorker.phoneNumber}`}
                      className="min-w-0 break-all text-label-sm text-text-secondary hover:text-brand-primary"
                    >
                      {
                        assignedWorker.phoneNumber
                      }
                    </a>
                  </div>
                )}

                {assignedWorker
                  .email && (
                  <div className="flex items-start gap-sm">
                    <Mail
                      size={13}
                      className="mt-[2px] shrink-0 text-text-tertiary"
                    />

                    <a
                      href={`mailto:${assignedWorker.email}`}
                      className="min-w-0 break-all text-label-sm text-text-secondary hover:text-brand-primary"
                    >
                      {
                        assignedWorker.email
                      }
                    </a>
                  </div>
                )}

                <div className="border-t border-border-secondary pt-md">
                  <p className="text-video-title text-text-tertiary">
                    Assigned
                  </p>

                  <p className="mt-xs text-label-sm text-text-secondary">
                    {formatAssignedDate(
                      assignedWorker
                        .assignedAt
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-corner-md bg-bg-faint p-lg text-center">
                <UserRound
                  size={24}
                  className="mx-auto text-text-tertiary"
                />

                <p className="mt-md text-label-sm font-medium text-text-primary">
                  No Primary Health Care Worker assigned
                </p>

                <p className="mt-xs text-video-title text-text-secondary">
                  Your clinic has not assigned an active health care worker to your profile yet.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center gap-md">
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
                <p className="truncate text-label-sm font-medium text-text-primary">
                  {
                    fullName
                  }
                </p>

                <p className="text-video-title text-text-secondary">
                  ID:{" "}
                  {dashboard
                    ?.patientNumber ||
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
                  {dashboard
                    ?.isProfileComplete
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
                    {dashboard
                      ?.unreadNotifications ??
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
              className="mt-lg flex items-center gap-xs text-label-sm text-brand-primary hover:opacity-70"
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
