import { Link } from "react-router-dom";
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
import { useApi } from "../../lib/useApi.js";
import { nursesApi } from "../../services/api/nurses.js";

function alertTone(severity) {
  switch (
    String(severity ?? "")
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

function calculateStockPercent(stock) {
  const quantity =
    Number(stock?.quantityOnHand) ||
    0;

  const reorderLevel =
    Number(stock?.reorderLevel) ||
    0;

  if (reorderLevel <= 0) {
    return quantity > 0 ? 100 : 0;
  }

  const healthyLevel =
    reorderLevel * 2;

  return Math.min(
    100,
    Math.round(
      (quantity / healthyLevel) *
        100
    )
  );
}

function formatStockName(stock) {
  return [
    stock?.medicationName,
    stock?.strength,
    stock?.form,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function NurseDashboard() {
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useApi(
    () =>
      nursesApi.getDashboardStats(),
    []
  );

  const {
    data: patients,
    loading: patientsLoading,
    error: patientsError,
  } = useApi(
    () =>
      nursesApi.getAssignedPatients(),
    []
  );

  const {
    data: alerts,
    loading: alertsLoading,
    error: alertsError,
  } = useApi(
    () =>
      nursesApi.getUrgentAlerts(),
    []
  );

  const {
    data: supplies,
    loading: suppliesLoading,
    error: suppliesError,
  } = useApi(
    () =>
      nursesApi.getSupplyLevels(),
    []
  );

  const STAT_CARDS = [
    {
      key: "clinicPatients",
      label: "Clinic patients",
      icon: "groups",
    },
    {
      key: "appointmentsToday",
      label: "Appointments today",
      icon: "calendar_today",
    },
    {
      key: "collectionsDueToday",
      label: "Collections due today",
      icon: "medication",
    },
    {
      key: "overdueCollections",
      label: "Overdue collections",
      icon: "priority_high",
    },
    {
      key: "lowStockItems",
      label: "Low stock items",
      icon: "inventory_2",
    },
  ];

  const visiblePatients =
    Array.isArray(patients)
      ? patients.slice(0, 6)
      : [];

  const visibleAlerts =
    Array.isArray(alerts)
      ? alerts
      : [];

  const visibleSupplies =
    Array.isArray(supplies)
      ? supplies
          .filter(
            (stock) =>
              stock?.isActive !== false
          )
          .slice(0, 6)
      : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statsLoading ? (
          <div className="col-span-full py-6">
            <Spinner label="Loading dashboard…" />
          </div>
        ) : statsError ? (
          <div className="col-span-full">
            <ErrorState
              description={
                statsError.message
              }
              onRetry={refetchStats}
            />
          </div>
        ) : (
          STAT_CARDS.map(
            (stat) => (
              <Card
                key={stat.key}
                className="p-5"
              >
                <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-md bg-primary-container/10 text-primary">
                  {stat.icon}
                </span>

                <p className="mt-3 text-2xl font-bold text-on-surface">
                  {stats?.[
                    stat.key
                  ] ?? 0}
                </p>

                <p className="text-xs text-on-surface-variant">
                  {stat.label}
                </p>
              </Card>
            )
          )
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Clinic patients"
            subtitle="Patients registered at your clinic"
            action={
              <Button
                as={Link}
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
                  patientsError.message
                }
              />
            ) : visiblePatients.length ===
              0 ? (
              <EmptyState
                icon="groups"
                title="No clinic patients yet"
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
                      (patient) => (
                        <tr
                          key={
                            patient.patientId
                          }
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
                            {patient.phoneNumber ||
                              "—"}
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

        <Card>
          <CardHeader title="Urgent alerts" />

          <CardBody className="pt-0">
            {alertsLoading ? (
              <div className="py-8">
                <Spinner label="Loading alerts…" />
              </div>
            ) : alertsError ? (
              <ErrorState
                description={
                  alertsError.message
                }
              />
            ) : visibleAlerts.length ===
              0 ? (
              <EmptyState
                icon="notifications_off"
                title="No urgent alerts"
              />
            ) : (
              <ul className="space-y-3">
                {visibleAlerts.map(
                  (alert) => (
                    <li
                      key={alert.code}
                      className="rounded-md border border-outline-variant/60 bg-surface-container-low p-3 text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-on-surface">
                            {
                              alert.message
                            }
                          </p>

                          <p className="mt-1 text-xs text-on-surface-variant">
                            Code:{" "}
                            {alert.code}
                          </p>
                        </div>

                        <StatusChip
                          tone={alertTone(
                            alert.severity
                          )}
                        >
                          {alert.severity ||
                            "Alert"}
                        </StatusChip>
                      </div>

                      {alert.count >
                        0 && (
                        <p className="mt-2 text-xs text-on-surface-variant">
                          {alert.count}{" "}
                          {alert.count ===
                          1
                            ? "item"
                            : "items"}{" "}
                          affected
                        </p>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Clinic stock"
          subtitle="Medication stock at your assigned clinic"
        />

        <CardBody className="pt-0">
          {suppliesLoading ? (
            <div className="py-8">
              <Spinner label="Loading stock…" />
            </div>
          ) : suppliesError ? (
            <ErrorState
              description={
                suppliesError.message
              }
            />
          ) : visibleSupplies.length ===
            0 ? (
            <EmptyState
              icon="inventory_2"
              title="No stock data yet"
            />
          ) : (
            <ul className="space-y-4">
              {visibleSupplies.map(
                (stock) => {
                  const percent =
                    calculateStockPercent(
                      stock
                    );

                  return (
                    <li key={stock.id}>
                      <div className="mb-1 flex items-start justify-between gap-4 text-xs">
                        <div>
                          <span className="font-medium text-on-surface">
                            {formatStockName(
                              stock
                            )}
                          </span>

                          <p className="mt-1 text-on-surface-variant">
                            {
                              stock.quantityOnHand
                            }{" "}
                            {stock.unit ||
                              "units"}{" "}
                            on hand
                          </p>
                        </div>

                        {stock.isLowStock && (
                          <StatusChip tone="error-soft">
                            Low stock
                          </StatusChip>
                        )}
                      </div>

                      <div className="mt-2 h-2 rounded-full bg-surface-container-highest">
                        <div
                          className={`h-2 rounded-full ${
                            stock.isLowStock
                              ? "bg-error"
                              : percent <
                                60
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                          style={{
                            width: `${percent}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-[11px] text-on-surface-variant">
                        Reorder level:{" "}
                        {
                          stock.reorderLevel
                        }{" "}
                        {stock.unit ||
                          "units"}
                      </p>
                    </li>
                  );
                }
              )}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}