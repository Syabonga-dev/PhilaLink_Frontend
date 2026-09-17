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
          setLoading(
            true
          );

          setError(
            ""
          );

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

          setCare(
            null
          );

          setError(
            err?.message ||
              "We could not load your proxy dashboard."
          );
        } finally {
          setLoading(
            false
          );
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
            (
              a,
              b
            ) => {
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
          .slice(
            0,
            6
          ),
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
                size={
                  18
                }
                className="text-danger"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-label font-semibold text-text-primary">
                We could not load your dashboard
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
                  size={
                    15
                  }
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
      .filter(
        Boolean
      )[0] ||
    "Proxy";

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
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
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-[#f8fafc]"
        >
          <RefreshCw
            size={
              15
            }
          />
          Refresh
        </button>
      </div>

      <div className="mb-xl grid grid-cols-1 gap-lg sm:grid-cols-3 lg:gap-xl">
        <SummaryCard
          icon={
            Users
          }
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
          icon={
            Clock3
          }
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

      <section className="rounded-corner-lg border border-border-secondary bg-surface-bg">
        <div className="flex flex-col gap-sm border-b border-border-secondary p-lg sm:flex-row sm:items-center sm:justify-between lg:px-xl">
          <div className="flex items-center gap-sm">
            <Users
              size={
                16
              }
              className="text-brand-primary"
            />

            <div>
              <h2 className="text-label font-semibold text-text-primary">
                Patients under your care
              </h2>

              <p className="mt-xs text-video-title text-text-secondary">
                Track each patient's next medication collection.
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
            className="flex w-fit items-center gap-xs text-label-sm text-brand-primary transition-opacity hover:opacity-70"
          >
            View all
            <ChevronRight
              size={
                14
              }
            />
          </button>
        </div>

        {sortedPatients.length ===
        0 ? (
          <div className="px-lg py-2xl text-center lg:px-xl">
            <Users
              size={
                28
              }
              className="mx-auto text-text-tertiary"
            />

            <p className="mt-md text-label-sm font-medium text-text-primary">
              No linked patients
            </p>

            <p className="mt-xs text-video-title text-text-secondary">
              Patients linked to your proxy account will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[840px] w-full">
              <thead className="bg-[#f8fafc]">
                <tr className="border-b border-border-secondary text-left">
                  <TableHead>
                    Patient
                  </TableHead>
                  <TableHead>
                    Patient number
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
                  (
                    patient
                  ) => (
                    <tr
                      key={
                        patient.proxyLinkId ||
                        patient.patientId
                      }
                      className="transition hover:bg-[#f8fafc]"
                    >
                      <TableCell>
                        <div className="font-medium text-text-primary">
                          {patient.patientName ||
                            "Patient"}
                        </div>
                      </TableCell>

                      <TableCell>
                        {
                          patient.patientNumber ||
                          "—"
                        }
                      </TableCell>

                      <TableCell>
                        {
                          patient.clinicName ||
                          "Not assigned"
                        }
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
        )}
      </section>
    </div>
  );
}

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
            size={
              18
            }
          />
        </div>
      </div>

      <p className="mt-md text-video-title text-text-tertiary">
        {helper}
      </p>
    </section>
  );
}

function TableHead({
  children,
  align = "left",
}) {
  return (
    <th
      className={`px-lg py-md text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary lg:px-xl ${
        align ===
        "right"
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
        align ===
        "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </td>
  );
}
