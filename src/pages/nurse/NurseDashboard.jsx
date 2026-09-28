import {
  Link,
} from "react-router-dom";

import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";

import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import {
  ErrorState,
  EmptyState,
} from "../../components/ui/EmptyState.jsx";

import StatusChip from "../../components/ui/StatusChip.jsx";

import {
  useApi,
} from "../../lib/useApi.js";

import {
  nursesApi,
} from "../../services/api/nurses.js";

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function alertTone(
  severity
) {
  switch (
    String(
      severity ??
        ""
    )
      .trim()
      .toLowerCase()
  ) {
    case "critical":
    case "high":
    case "urgent":
      return "error-soft";

    case "warning":
    case "medium":
      return "warning-soft";

    case "low":
    case "info":
      return "neutral";

    default:
      return "neutral";
  }
}

const STAT_CARDS = [
  {
    key:
      "clinicPatients",

    label:
      "Clinic patients",

    icon:
      "groups",
  },

  {
    key:
      "appointmentsToday",

    label:
      "Appointments today",

    icon:
      "calendar_today",
  },

  {
    key:
      "collectionsDueToday",

    label:
      "Collections due today",

    icon:
      "medication",
  },

  {
    key:
      "overdueCollections",

    label:
      "Overdue collections",

    icon:
      "priority_high",
  },
];

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function NurseDashboard() {
  const {
    data:
      stats,

    loading:
      statsLoading,

    error:
      statsError,

    refetch:
      refetchStats,
  } =
    useApi(
      () =>
        nursesApi
          .getDashboardStats(),
      []
    );

  const {
    data:
      patients,

    loading:
      patientsLoading,

    error:
      patientsError,

    refetch:
      refetchPatients,
  } =
    useApi(
      () =>
        nursesApi
          .getAssignedPatients(),
      []
    );

  const {
    data:
      alerts,

    loading:
      alertsLoading,

    error:
      alertsError,

    refetch:
      refetchAlerts,
  } =
    useApi(
      () =>
        nursesApi
          .getUrgentAlerts(),
      []
    );

  const visiblePatients =
    Array.isArray(
      patients
    )
      ? patients.slice(
          0,
          6
        )
      : [];

  const visibleAlerts =
    Array.isArray(
      alerts
    )
      ? alerts
      : [];

  return (
    <div className="space-y-6">

      {/* =================================================== */}
      {/* STATS                                               */}
      {/* =================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {statsLoading ? (
          <div className="col-span-full py-6">
            <Spinner label="Loading dashboard…" />
          </div>
        ) : statsError ? (
          <div className="col-span-full">
            <ErrorState
              description={
                statsError
                  .message
              }
              onRetry={
                refetchStats
              }
            />
          </div>
        ) : (
          STAT_CARDS.map(
            (
              stat
            ) => (
              <Card
                key={
                  stat.key
                }
                className="p-5"
              >

                <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-md bg-primary-container/10 text-primary">
                  {
                    stat.icon
                  }
                </span>

                <p className="mt-3 text-2xl font-bold text-on-surface">
                  {stats?.[
                    stat.key
                  ] ??
                    0}
                </p>

                <p className="mt-1 text-xs text-on-surface-variant">
                  {
                    stat.label
                  }
                </p>

              </Card>
            )
          )
        )}

      </div>

      {/* =================================================== */}
      {/* PATIENTS + ALERTS                                   */}
      {/* =================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* PATIENTS */}

        <Card className="lg:col-span-2">

          <CardHeader
            title="Clinic patients"
            subtitle="Patients registered at your assigned clinic"
            action={
              <Button
                as={
                  Link
                }
                to="/nurse/patients"
                size="sm"
                variant="ghost"
                icon="arrow_forward"
              >
                View all
              </Button>
            }
          />

          <CardBody className="pt-0">

            {patientsLoading ? (
              <div className="py-10">
                <Spinner label="Loading patients…" />
              </div>
            ) : patientsError ? (
              <ErrorState
                description={
                  patientsError
                    .message
                }
                onRetry={
                  refetchPatients
                }
              />
            ) : visiblePatients.length ===
              0 ? (
              <EmptyState
                icon="groups"
                title="No clinic patients"
                description="There are currently no active patients assigned to your clinic."
              />
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-left text-sm">

                  <thead>

                    <tr className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">

                      <th className="py-2 pr-4 font-medium">
                        Patient
                      </th>

                      <th className="py-2 pr-4 font-medium">
                        Patient number
                      </th>

                      <th className="py-2 pr-4 font-medium">
                        Phone
                      </th>

                      <th className="py-2 pr-4 font-medium">
                        Gender
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-outline-variant/50">

                    {visiblePatients.map(
                      (
                        patient
                      ) => (
                        <tr
                          key={
                            patient.patientId
                          }
                          className="transition-colors hover:bg-surface-container-low"
                        >

                          <td className="py-3 pr-4 font-semibold text-on-surface">
                            {
                              patient.fullName
                            }
                          </td>

                          <td className="py-3 pr-4 text-on-surface-variant">
                            {patient.patientNumber ||
                              "—"}
                          </td>

                          <td className="py-3 pr-4 text-on-surface-variant">

                            {patient.phoneNumber ? (
                              <a
                                href={`tel:${patient.phoneNumber}`}
                                className="hover:text-primary hover:underline"
                              >
                                {
                                  patient.phoneNumber
                                }
                              </a>
                            ) : (
                              "—"
                            )}

                          </td>

                          <td className="py-3 pr-4 text-on-surface-variant">
                            {patient.gender ||
                              "—"}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </CardBody>

        </Card>

        {/* URGENT ALERTS */}

        <Card>

          <CardHeader
            title="Urgent alerts"
            subtitle="Patient-care items that need attention"
          />

          <CardBody className="pt-0">

            {alertsLoading ? (
              <div className="py-8">
                <Spinner label="Loading alerts…" />
              </div>
            ) : alertsError ? (
              <ErrorState
                description={
                  alertsError
                    .message
                }
                onRetry={
                  refetchAlerts
                }
              />
            ) : visibleAlerts.length ===
              0 ? (
              <EmptyState
                icon="notifications_off"
                title="No urgent alerts"
                description="There are no urgent patient-care alerts at the moment."
              />
            ) : (
              <ul className="space-y-3">

                {visibleAlerts.map(
                  (
                    alert
                  ) => (
                    <li
                      key={
                        alert.code
                      }
                      className="rounded-md border border-outline-variant/60 bg-surface-container-low p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-sm font-semibold leading-5 text-on-surface">
                            {
                              alert.message
                            }
                          </p>

                          {alert.count >
                            0 && (
                            <p className="mt-2 text-xs text-on-surface-variant">
                              {
                                alert.count
                              }{" "}
                              {alert.count ===
                              1
                                ? "item needs"
                                : "items need"}{" "}
                              attention
                            </p>
                          )}

                        </div>

                        <StatusChip
                          tone={
                            alertTone(
                              alert.severity
                            )
                          }
                        >
                          {alert.severity ||
                            "Alert"}
                        </StatusChip>

                      </div>

                    </li>
                  )
                )}

              </ul>
            )}

          </CardBody>

        </Card>

      </div>

      {/* =================================================== */}
      {/* QUICK ACCESS                                        */}
      {/* =================================================== */}

      <div className="grid gap-6 md:grid-cols-2">

        <Card>

          <CardHeader
            title="Medication collections"
            subtitle="Review collections due at your clinic"
          />

          <CardBody className="pt-0">

            <p className="text-sm leading-6 text-on-surface-variant">
              Review scheduled medication collections and record a completed collection when medication is handed to the patient or an authorised Proxy.
            </p>

            <div className="mt-4">

              <Button
                as={
                  Link
                }
                to="/nurse/collections"
                size="sm"
                icon="inventory_2"
              >
                Open collections
              </Button>

            </div>

          </CardBody>

        </Card>

        <Card>

          <CardHeader
            title="Patient directory"
            subtitle="View patients registered at your clinic"
          />

          <CardBody className="pt-0">

            <p className="text-sm leading-6 text-on-surface-variant">
              Search the clinic patient list using a patient name, patient number, phone number or gender.
            </p>

            <div className="mt-4">

              <Button
                as={
                  Link
                }
                to="/nurse/patients"
                size="sm"
                variant="outline"
                icon="groups"
              >
                View patients
              </Button>

            </div>

          </CardBody>

        </Card>

      </div>

    </div>
  );
}