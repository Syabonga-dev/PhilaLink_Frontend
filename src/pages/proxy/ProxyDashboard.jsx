import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AlertCircle,
  CalendarClock,
  ChevronRight,
  Clock3,
  Hash,
  MapPin,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  proxiesApi,
} from "../../services/api/proxies.js";

import {
  CollectionStatus,
  formatDate,
  parseDate,
} from "./proxyUtils.jsx";

function getInitials(name) {
  if (!name) {
    return "PT";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`
    .toUpperCase();
}

function LoadingDashboard() {
  return (
    <div className="animate-pulse p-lg md:p-xl lg:p-2xl">
      <div className="mb-xl">
        <div className="mb-sm h-7 w-64 rounded bg-border-secondary" />
        <div className="h-4 w-72 rounded bg-border-secondary" />
      </div>

      <div className="grid grid-cols-1 gap-lg sm:grid-cols-3 lg:gap-xl">
        <div className="h-28 rounded-corner-lg bg-surface-bg" />
        <div className="h-28 rounded-corner-lg bg-surface-bg" />
        <div className="h-28 rounded-corner-lg bg-surface-bg" />
      </div>

      <div className="mt-xl h-80 rounded-corner-lg bg-surface-bg" />
    </div>
  );
}

export default function ProxyDashboard() {
  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  const [
    care,
    setCare,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const loadCare =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await proxiesApi
              .getCare();

          setCare(
            result || null
          );
        } catch (err) {
          console.error(
            "Failed to load proxy dashboard:",
            err
          );

          setCare(null);

          setError(
            err?.message ||
              "We could not load your proxy dashboard."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadCare();
  }, [
    loadCare,
  ]);

  const patients =
    Array.isArray(
      care?.patients
    )
      ? care.patients
      : [];

  const sortedPatients =
    useMemo(
      () =>
        [...patients]
          .sort(
            (a, b) => {
              const aDate =
                parseDate(
                  a.nextCollectionDate
                );

              const bDate =
                parseDate(
                  b.nextCollectionDate
                );

              if (
                !aDate &&
                !bDate
              ) {
                return String(
                  a.patientName ||
                    ""
                ).localeCompare(
                  String(
                    b.patientName ||
                      ""
                  )
                );
              }

              if (!aDate) {
                return 1;
              }

              if (!bDate) {
                return -1;
              }

              return (
                aDate.getTime() -
                bDate.getTime()
              );
            }
          )
          .slice(0, 6),
      [
        patients,
      ]
    );

  if (loading) {
    return (
      <LoadingDashboard />
    );
  }

  if (
    error ||
    !care
  ) {
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
                We could not load
                your dashboard
              </h1>

              <p className="mt-xs text-label-sm text-text-secondary">
                {error ||
                  "Your proxy dashboard data is currently unavailable."}
              </p>

              <button
                type="button"
                onClick={
                  loadCare
                }
                className="mt-lg inline-flex items-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-[#f8fafc]"
              >
                <RefreshCw
                  size={15}
                />

                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fullName =
    user?.fullName ||
    user?.name ||
    "Proxy";

  const firstName =
    fullName
      .split(" ")
      .filter(Boolean)[0] ||
    "Proxy";

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            Welcome,{" "}
            {firstName}
          </h1>

          <p className="mt-xs text-label-sm text-text-secondary">
            PhilaLink Proxy Portal
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadCare
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-[#f8fafc] sm:w-fit"
        >
          <RefreshCw
            size={15}
          />

          Refresh
        </button>
      </div>

      {/* ============================== */}
      {/* SUMMARY */}
      {/* ============================== */}

      <div className="mb-xl grid grid-cols-1 gap-lg sm:grid-cols-3 lg:gap-xl">
        <SummaryCard
          icon={Users}
          label="Linked Patients"
          value={
            care.totalPatients ??
            patients.length
          }
          helper="Patients currently under your care"
        />

        <SummaryCard
          icon={
            CalendarClock
          }
          label="Due Soon"
          value={
            care.dueSoon ??
            0
          }
          helper="Collections due within the next two days"
        />

        <SummaryCard
          icon={Clock3}
          label="Overdue"
          value={
            care.overdue ??
            0
          }
          helper="Collections that require attention"
          warning={
            Number(
              care.overdue ??
                0
            ) > 0
          }
        />
      </div>

      {/* ============================== */}
      {/* PATIENTS */}
      {/* ============================== */}

      <section className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg">
        <div className="flex flex-col gap-sm border-b border-border-secondary p-md sm:flex-row sm:items-center sm:justify-between sm:p-lg lg:px-xl">
          <div className="flex items-center gap-sm">
            <Users
              size={16}
              className="text-brand-primary"
            />

            <div>
              <h2 className="text-label font-semibold text-text-primary">
                Patients under
                your care
              </h2>

              <p className="mt-xs text-video-title text-text-secondary">
                Track each patient's
                next medication
                collection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/proxy/patients"
              )
            }
            className="flex w-fit items-center gap-xs text-label-sm font-medium text-brand-primary transition-opacity hover:opacity-70"
          >
            View all

            <ChevronRight
              size={14}
            />
          </button>
        </div>

        {sortedPatients.length ===
        0 ? (
          <div className="px-lg py-2xl text-center lg:px-xl">
            <Users
              size={28}
              className="mx-auto text-text-tertiary"
            />

            <p className="mt-md text-label-sm font-medium text-text-primary">
              No linked patients
            </p>

            <p className="mt-xs text-video-title text-text-secondary">
              Patients linked to your
              proxy account will
              appear here.
            </p>
          </div>
        ) : (
          <>
            {/* ========================== */}
            {/* MOBILE CARDS */}
            {/* ========================== */}

            <div className="divide-y divide-border-secondary md:hidden">
              {sortedPatients.map(
                (patient) => (
                  <DashboardPatientCard
                    key={
                      patient.proxyLinkId ||
                      patient.patientId
                    }
                    patient={
                      patient
                    }
                    onView={() =>
                      navigate(
                        `/proxy/collections?patientId=${patient.patientId}`
                      )
                    }
                  />
                )
              )}
            </div>

            {/* ========================== */}
            {/* DESKTOP TABLE */}
            {/* ========================== */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[840px]">
                <thead className="bg-[#f8fafc]">
                  <tr className="border-b border-border-secondary">
                    <TableHead>
                      Patient
                    </TableHead>

                    <TableHead>
                      Patient no.
                    </TableHead>

                    <TableHead>
                      Clinic
                    </TableHead>

                    <TableHead>
                      Next collection
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead align="right">
                      Action
                    </TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-secondary">
                  {sortedPatients.map(
                    (patient) => (
                      <tr
                        key={
                          patient.proxyLinkId ||
                          patient.patientId
                        }
                        className="transition hover:bg-[#f8fafc]"
                      >
                        <td className="px-lg py-md lg:px-xl">
                          <div className="flex items-center gap-sm">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-xs font-semibold text-[#115e59]">
                              {getInitials(
                                patient.patientName
                              )}
                            </div>

                            <span className="whitespace-nowrap text-label-sm font-medium text-text-primary">
                              {patient.patientName ||
                                "Patient"}
                            </span>
                          </div>
                        </td>

                        <TableCell>
                          {patient.patientNumber ||
                            "—"}
                        </TableCell>

                        <TableCell>
                          {patient.clinicName ||
                            "Not assigned"}
                        </TableCell>

                        <TableCell>
                          {formatDate(
                            patient.nextCollectionDate
                          )}
                        </TableCell>

                        <TableCell>
                          <CollectionStatus
                            status={
                              patient.collectionStatus
                            }
                            date={
                              patient.nextCollectionDate
                            }
                          />
                        </TableCell>

                        <TableCell align="right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/proxy/collections?patientId=${patient.patientId}`
                              )
                            }
                            className="text-label-sm font-medium text-brand-primary transition-opacity hover:opacity-70"
                          >
                            View
                          </button>
                        </TableCell>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ========================================= */
/* MOBILE DASHBOARD PATIENT */
/* ========================================= */

function DashboardPatientCard({
  patient,
  onView,
}) {
  return (
    <article className="p-md sm:p-lg">
      <div className="flex items-start gap-md">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-sm font-semibold text-[#115e59]">
          {getInitials(
            patient.patientName
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-sm">
            <div className="min-w-0">
              <h3 className="truncate text-label font-semibold text-text-primary">
                {patient.patientName ||
                  "Patient"}
              </h3>

              <div className="mt-xs flex items-center gap-xs text-video-title text-text-secondary">
                <Hash
                  size={12}
                />

                <span>
                  {patient.patientNumber ||
                    "No patient number"}
                </span>
              </div>
            </div>

            <CollectionStatus
              status={
                patient.collectionStatus
              }
              date={
                patient.nextCollectionDate
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-md grid grid-cols-1 gap-sm rounded-corner-md bg-[#f8fafc] p-md min-[420px]:grid-cols-2">
        <div className="min-[420px]:col-span-2">
          <div className="flex items-center gap-xs text-text-tertiary">
            <MapPin
              size={13}
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">
              Clinic
            </span>
          </div>

          <p className="mt-xs text-label-sm font-medium text-text-primary">
            {patient.clinicName ||
              "Not assigned"}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
            Next collection
          </p>

          <p className="mt-xs text-label-sm font-medium text-text-primary">
            {formatDate(
              patient.nextCollectionDate
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onView}
        className="mt-md flex h-11 w-full items-center justify-center gap-xs rounded-corner-md border border-brand-primary/20 bg-brand-primary/5 text-label-sm font-semibold text-brand-primary transition hover:bg-brand-primary/10"
      >
        View collections

        <ChevronRight
          size={15}
        />
      </button>
    </article>
  );
}

/* ========================================= */
/* SUMMARY */
/* ========================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  helper,
  warning = false,
}) {
  return (
    <section className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
      <div className="flex items-start justify-between gap-md">
        <div>
          <p className="text-label-sm text-text-secondary">
            {label}
          </p>

          <p
            className={`mt-sm text-[30px] font-semibold leading-none ${
              warning
                ? "text-danger"
                : "text-text-primary"
            }`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-full ${
            warning
              ? "bg-danger/10 text-danger"
              : "bg-brand-primary/10 text-brand-primary"
          }`}
        >
          <Icon
            size={18}
          />
        </div>
      </div>

      <p className="mt-md text-video-title text-text-tertiary">
        {helper}
      </p>
    </section>
  );
}

/* ========================================= */
/* TABLE HELPERS */
/* ========================================= */

function TableHead({
  children,
  align = "left",
}) {
  return (
    <th
      className={`px-lg py-md text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary lg:px-xl ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  align = "left",
}) {
  return (
    <td
      className={`whitespace-nowrap px-lg py-md text-label-sm text-text-secondary lg:px-xl ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </td>
  );
}