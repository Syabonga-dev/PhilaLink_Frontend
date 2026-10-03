import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  AlertCircle,
  CalendarCheck2,
  PackageCheck,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  DataTable,
  LoadingBlock,
  MetricStrip,
  Notice,
  PageHeader,
  Panel,
  SecondaryButton,
  StatusBadge,
} from "../../components/admin/AdminPrimitives.jsx";

import {
  nursesApi,
} from "../../services/api/nurses.js";

function workloadStatus(
  patient
) {
  if (
    Number(
      patient?.overdueCollectionCount ||
        0
    ) >
    0
  ) {
    return "Overdue";
  }

  if (
    Number(
      patient?.activeMedicationCount ||
        0
    ) >
    0
  ) {
    return "Active";
  }

  return "No active medication";
}

function queueRow({
  label,
  value,
  helper,
  path,
  status,
}) {
  return {
    label,
    value,
    helper,
    path,
    status,
  };
}

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
            dashboard ||
              null
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
            nurseProfile ||
              null
          );
        } catch (
          loadError
        ) {
          console.error(
            loadError
          );

          setError(
            loadError
              ?.message ||
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

  const metrics =
    useMemo(
      () => [
        {
          label:
            "Clinic patients",

          value:
            stats
              ?.clinicPatients ??
            patients.length,

          helper:
            "Visible in your clinic scope",

          icon:
            Users,
        },

        {
          label:
            "Appointments today",

          value:
            stats
              ?.appointmentsToday ??
            0,

          helper:
            `${
              stats
                ?.pendingAppointments ??
              0
            } pending`,

          icon:
            CalendarCheck2,
        },

        {
          label:
            "Collections due",

          value:
            stats
              ?.collectionsDueToday ??
            0,

          helper:
            "Scheduled for today",

          icon:
            PackageCheck,
        },

        {
          label:
            "Overdue collections",

          value:
            stats
              ?.overdueCollections ??
            0,

          helper:
            "Requires follow-up",

          icon:
            AlertCircle,
        },
      ],
      [
        stats,
        patients.length,
      ]
    );

  const queue =
    useMemo(
      () => [
        queueRow({
          label:
            "Pending appointments",

          value:
            stats
              ?.pendingAppointments ??
            0,

          helper:
            "Review bookings waiting for action",

          path:
            "/nurse/appointments",

          status:
            (
              stats
                ?.pendingAppointments ??
              0
            ) >
            0
              ? "Pending"
              : "Clear",
        }),

        queueRow({
          label:
            "Collections due today",

          value:
            stats
              ?.collectionsDueToday ??
            0,

          helper:
            "Medication collections scheduled today",

          path:
            "/nurse/collections",

          status:
            (
              stats
                ?.collectionsDueToday ??
              0
            ) >
            0
              ? "Due"
              : "Clear",
        }),

        queueRow({
          label:
            "Overdue collections",

          value:
            stats
              ?.overdueCollections ??
            0,

          helper:
            "Patients requiring collection follow-up",

          path:
            "/nurse/collections",

          status:
            (
              stats
                ?.overdueCollections ??
              0
            ) >
            0
              ? "Overdue"
              : "Clear",
        }),
      ],
      [
        stats,
      ]
    );

  const patientColumns = [
    {
      key:
        "fullName",

      label:
        "Patient",
    },

    {
      key:
        "patientNumber",

      label:
        "Patient no.",
    },

    {
      key:
        "activeMedicationCount",

      label:
        "Active medication",

      render:
        value =>
          value ??
          0,
    },

    {
      key:
        "overdueCollectionCount",

      label:
        "Overdue",

      render:
        value =>
          value ??
          0,
    },

    {
      key:
        "status",

      label:
        "Care status",

      render:
        (
          _,
          patient
        ) => (
          <StatusBadge
            value={
              workloadStatus(
                patient
              )
            }
          />
        ),
    },

    {
      key:
        "action",

      label:
        "Action",

      render:
        (
          _,
          patient
        ) => (
          <Link
            to={`/nurse/patients/${patient.patientId}`}
            className="font-medium text-[#0f766e] hover:underline"
          >
            Open care record
          </Link>
        ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1500px] space-y-6">

        <PageHeader
          eyebrow="Nurse operations"
          title="Clinic workload"
          description="Review patient workload, appointments, medication collections and care alerts within your assigned clinic."
          meta={
            <>
              <span>
                Clinic:{" "}
                {profile
                  ?.clinicName ||
                  "Assigned clinic"}
              </span>

              <span>
                Patient records:{" "}
                {patients.length}
              </span>
            </>
          }
          actions={
            <SecondaryButton
              type="button"
              onClick={
                load
              }
              disabled={
                loading
              }
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </SecondaryButton>
          }
        />

        {error ? (
          <Notice type="error">
            {error}
          </Notice>
        ) : null}

        {loading &&
        !stats ? (
          <LoadingBlock
            label="Loading clinic workload…"
            minHeight={
              300
            }
          />
        ) : (
          <>

            <MetricStrip
              metrics={
                metrics
              }
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

              <Panel
                title="Patient workload"
                description="Patients currently available in your clinic scope."
                noPadding
                actions={
                  <Link
                    to="/nurse/patients"
                    className="text-xs font-medium text-[#0f766e] hover:underline"
                  >
                    View all patients
                  </Link>
                }
              >

                {patients.length ? (
                  <DataTable
                    columns={
                      patientColumns
                    }
                    rows={
                      patients.slice(
                        0,
                        10
                      )
                    }
                    rowKey={
                      patient =>
                        patient.patientId
                    }
                    maxHeight={
                      520
                    }
                  />
                ) : (
                  <div className="px-5 py-10 text-center text-sm text-slate-500">
                    No patients are currently available in this clinic scope.
                  </div>
                )}

              </Panel>

              <div className="space-y-6">

                <Panel
                  title="Operational queue"
                  description="Items that may require action during the current shift."
                  noPadding
                >

                  <div className="divide-y divide-slate-200">

                    {queue.map(
                      item => (
                        <Link
                          key={
                            item.label
                          }
                          to={
                            item.path
                          }
                          className="flex items-center gap-4 bg-white px-5 py-4 transition hover:bg-slate-50"
                        >

                          <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-3">

                              <p className="truncate text-sm font-semibold text-slate-900">
                                {
                                  item.label
                                }
                              </p>

                              <span className="text-lg font-semibold text-slate-950">
                                {
                                  item.value
                                }
                              </span>

                            </div>

                            <div className="mt-1 flex items-center justify-between gap-3">

                              <p className="text-xs text-slate-500">
                                {
                                  item.helper
                                }
                              </p>

                              <StatusBadge
                                value={
                                  item.status
                                }
                              />

                            </div>

                          </div>

                        </Link>
                      )
                    )}

                  </div>

                </Panel>

                <Panel
                  title="Care alerts"
                  description="Clinical and operational alerts generated for your current clinic scope."
                  noPadding
                >

                  {!alerts.length ? (
                    <div className="border-l-[3px] border-emerald-500 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                      No urgent care alerts.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">

                      {alerts.map(
                        alert => {
                          const high =
                            String(
                              alert.severity ||
                                ""
                            )
                              .toLowerCase() ===
                            "high";

                          return (
                            <div
                              key={
                                alert.code ||
                                alert.message
                              }
                              className="px-5 py-4"
                            >

                              <div className="flex items-start gap-3">

                                <AlertCircle
                                  size={
                                    16
                                  }
                                  className={
                                    high
                                      ? "mt-0.5 shrink-0 text-red-600"
                                      : "mt-0.5 shrink-0 text-amber-600"
                                  }
                                />

                                <div className="min-w-0 flex-1">

                                  <div className="flex items-start justify-between gap-3">

                                    <p className="text-sm font-semibold text-slate-900">
                                      {
                                        alert.message
                                      }
                                    </p>

                                    <StatusBadge
                                      value={
                                        high
                                          ? "Overdue"
                                          : "Due"
                                      }
                                    />

                                  </div>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {
                                      alert.count ??
                                      0
                                    }{" "}
                                    item(s)
                                  </p>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </Panel>

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  );
}
