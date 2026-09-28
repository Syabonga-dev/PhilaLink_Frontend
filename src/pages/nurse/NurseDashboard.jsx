import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  PackageCheck,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react";

import {
  nursesApi,
} from "../../services/api/nurses.js";

const statsConfig = [
  {
    key:
      "clinicPatients",

    label:
      "Clinic patients",

    icon:
      Users,

    path:
      "/nurse/patients",
  },

  {
    key:
      "appointmentsToday",

    label:
      "Appointments today",

    icon:
      CalendarCheck2,

    path:
      "/nurse/appointments",
  },

  {
    key:
      "pendingAppointments",

    label:
      "Pending appointments",

    icon:
      CalendarClock,

    path:
      "/nurse/appointments",
  },

  {
    key:
      "collectionsDueToday",

    label:
      "Collections due",

    icon:
      PackageCheck,

    path:
      "/nurse/collections",
  },

  {
    key:
      "overdueCollections",

    label:
      "Overdue collections",

    icon:
      AlertCircle,

    path:
      "/nurse/collections",
  },
];

export default function NurseDashboard() {
  const [
    stats,
    setStats,
  ] =
    useState(null);

  const [
    patients,
    setPatients,
  ] =
    useState([]);

  const [
    alerts,
    setAlerts,
  ] =
    useState([]);

  const [
    profile,
    setProfile,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const [
            dashboard,
            patientList,
            alertList,
            nurseProfile,
          ] =
            await Promise.all([
              nursesApi
                .getDashboardStats(),

              nursesApi
                .getAssignedPatients(),

              nursesApi
                .getUrgentAlerts(),

              nursesApi
                .getMe(),
            ]);

          setStats(
            dashboard
          );

          setPatients(
            Array.isArray(
              patientList
            )
              ? patientList
              : []
          );

          setAlerts(
            Array.isArray(
              alertList
            )
              ? alertList
              : []
          );

          setProfile(
            nurseProfile
          );
        } catch (loadError) {
          console.error(
            loadError
          );

          setError(
            loadError?.message ||
              "Could not load the Nurse dashboard."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(
    () => {
      load();
    },
    [
      load,
    ]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1500px]">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold tracking-tight text-[#0f172a]">
              Nurse dashboard
            </h2>

            <p className="mt-1 text-sm text-[#64748b]">
              {profile?.clinicName ||
                "Your assigned clinic"}
            </p>

          </div>

          <button
            type="button"
            onClick={
              load
            }
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 text-sm font-semibold text-[#475569] hover:bg-[#f8fafc]"
          >
            <RefreshCw
              size={16}
            />

            Refresh
          </button>

        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-12 text-center text-sm text-[#64748b]">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

              {statsConfig.map(
                (
                  item
                ) => {
                  const Icon =
                    item.icon;

                  return (
                    <Link
                      key={
                        item.key
                      }
                      to={
                        item.path
                      }
                      className="rounded-2xl border border-[#e2e8f0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccfbf1] text-[#0f766e]">
                          <Icon
                            size={19}
                          />
                        </div>

                        <ArrowRight
                          size={15}
                          className="text-[#94a3b8]"
                        />

                      </div>

                      <p className="mt-4 text-2xl font-bold">
                        {stats?.[
                          item.key
                        ] ??
                          0}
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#64748b]">
                        {item.label}
                      </p>

                    </Link>
                  );
                }
              )}

            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">

              {/* PATIENTS */}

              <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white xl:col-span-2">

                <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-5">

                  <div>

                    <h3 className="font-semibold">
                      Clinic patients
                    </h3>

                    <p className="mt-1 text-sm text-[#64748b]">
                      Quick access to patient care records.
                    </p>

                  </div>

                  <Link
                    to="/nurse/patients"
                    className="text-sm font-semibold text-[#0f766e]"
                  >
                    View all
                  </Link>

                </div>

                <div className="divide-y divide-[#e2e8f0]">

                  {patients.length ===
                  0 ? (
                    <div className="p-8 text-center text-sm text-[#64748b]">
                      No clinic patients.
                    </div>
                  ) : (
                    patients
                      .slice(
                        0,
                        6
                      )
                      .map(
                        (
                          patient
                        ) => (
                          <Link
                            key={
                              patient.patientId
                            }
                            to={`/nurse/patients/${patient.patientId}`}
                            className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#f8fafc]"
                          >

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0fdfa] text-[#0f766e]">
                                <Users
                                  size={17}
                                />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-semibold">
                                  {patient.fullName}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-[#64748b]">
                                  {patient.patientNumber ||
                                    "No patient number"}
                                </p>

                              </div>

                            </div>

                            <div className="hidden shrink-0 text-right sm:block">

                              <p className="text-xs text-[#64748b]">
                                {
                                  patient.activeMedicationCount ??
                                  0
                                }{" "}
                                active medication(s)
                              </p>

                              {patient.overdueCollectionCount >
                                0 && (
                                <p className="mt-1 text-xs font-semibold text-[#dc2626]">
                                  {
                                    patient.overdueCollectionCount
                                  }{" "}
                                  overdue
                                </p>
                              )}

                            </div>

                          </Link>
                        )
                      )
                  )}

                </div>

              </section>

              {/* ALERTS */}

              <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">

                <div className="border-b border-[#e2e8f0] px-5 py-5">

                  <h3 className="font-semibold">
                    Care alerts
                  </h3>

                  <p className="mt-1 text-sm text-[#64748b]">
                    Work requiring attention.
                  </p>

                </div>

                <div className="space-y-3 p-5">

                  {alerts.length ===
                  0 ? (
                    <div className="rounded-xl bg-[#f0fdfa] p-4 text-sm text-[#115e59]">
                      No urgent care alerts.
                    </div>
                  ) : (
                    alerts.map(
                      (
                        alert
                      ) => (
                        <div
                          key={
                            alert.code
                          }
                          className={[
                            "rounded-xl border p-4",
                            String(
                              alert.severity
                            ).toLowerCase() ===
                            "high"
                              ? "border-[#fecaca] bg-[#fef2f2]"
                              : "border-[#fde68a] bg-[#fffbeb]",
                          ].join(
                            " "
                          )}
                        >

                          <div className="flex items-start gap-3">

                            <AlertCircle
                              size={18}
                              className={
                                String(
                                  alert.severity
                                ).toLowerCase() ===
                                "high"
                                  ? "mt-0.5 text-[#dc2626]"
                                  : "mt-0.5 text-[#d97706]"
                              }
                            />

                            <div>

                              <p className="text-sm font-semibold">
                                {alert.message}
                              </p>

                              <p className="mt-1 text-xs text-[#64748b]">
                                {alert.count} item(s)
                              </p>

                            </div>

                          </div>

                        </div>
                      )
                    )
                  )}

                </div>

              </section>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <QuickAction
                icon={
                  Stethoscope
                }
                title="Patient care"
                description="Manage allergies, conditions, medication and Proxy assignments."
                path="/nurse/patients"
              />

              <QuickAction
                icon={
                  CalendarCheck2
                }
                title="Appointments"
                description="Review pending appointments and manage clinic bookings."
                path="/nurse/appointments"
              />

              <QuickAction
                icon={
                  PackageCheck
                }
                title="Collections"
                description="Process scheduled medication collections."
                path="/nurse/collections"
              />

            </div>
          </>
        )}

      </div>

    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  path,
}) {
  return (
    <Link
      to={
        path
      }
      className="rounded-2xl border border-[#e2e8f0] bg-white p-5 hover:shadow-md"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccfbf1] text-[#0f766e]">
        <Icon
          size={18}
        />
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#64748b]">
        {description}
      </p>

    </Link>
  );
}
