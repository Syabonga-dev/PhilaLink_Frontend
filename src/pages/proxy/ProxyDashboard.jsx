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
import { useApi } from "../../lib/useApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { proxiesApi } from "../../services/api/proxies.js";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default function ProxyDashboard() {
  const { user } = useAuth();

  const {
    data: patients,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      proxiesApi.getManagedPatients(),
    []
  );

  const patientList =
    Array.isArray(patients)
      ? patients
      : [];

  const visiblePatients =
    patientList.slice(0, 5);

  const displayName =
    user?.fullName ||
    user?.name ||
    "Proxy";

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 bg-primary p-6 text-on-primary sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Welcome back
            </p>

            <p className="mt-1 text-2xl font-bold">
              {displayName}
            </p>

            <p className="mt-1 text-sm text-white/80">
              You&apos;re currently linked
              to{" "}
              {loading
                ? "…"
                : patientList.length}{" "}
              patient
              {patientList.length === 1
                ? ""
                : "s"}.
            </p>
          </div>

          <Button
            as={Link}
            to="/proxy/patients"
            variant="secondary"
            icon="family_restroom"
          >
            View patients
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-md bg-primary-container/10 text-primary">
            family_restroom
          </span>

          <p className="mt-3 text-2xl font-bold text-on-surface">
            {loading
              ? "—"
              : patientList.length}
          </p>

          <p className="text-xs text-on-surface-variant">
            Patients under your care
          </p>
        </Card>

        <Card className="p-5">
          <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-md bg-primary-container/10 text-primary">
            local_hospital
          </span>

          <p className="mt-3 text-2xl font-bold text-on-surface">
            {loading
              ? "—"
              : new Set(
                  patientList
                    .map(
                      (patient) =>
                        patient.clinicId
                    )
                    .filter(Boolean)
                ).size}
          </p>

          <p className="text-xs text-on-surface-variant">
            Clinics represented
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Patients under your care"
          subtitle="Patients currently linked to your proxy profile"
          action={
            <Button
              as={Link}
              to="/proxy/patients"
              size="sm"
              variant="ghost"
              icon="arrow_forward"
            >
              View all
            </Button>
          }
        />

        <CardBody className="pt-0">
          {loading ? (
            <div className="py-10">
              <Spinner label="Loading patients…" />
            </div>
          ) : error ? (
            <ErrorState
              description={
                error.message
              }
              onRetry={refetch}
            />
          ) : visiblePatients.length ===
            0 ? (
            <EmptyState
              icon="family_restroom"
              title="No patients linked to your account"
              description="Ask your clinic to link a patient to your proxy profile."
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
                      Clinic
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Linked since
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-outline-variant/50">
                  {visiblePatients.map(
                    (patient) => (
                      <tr
                        key={
                          patient.proxyLinkId
                        }
                      >
                        <td className="py-3 pr-4 font-semibold text-on-surface">
                          {
                            patient.patientName
                          }
                        </td>

                        <td className="py-3 pr-4 text-on-surface-variant">
                          {patient.patientNumber ||
                            "—"}
                        </td>

                        <td className="py-3 pr-4 text-on-surface-variant">
                          {patient.clinicName ||
                            "Not assigned"}
                        </td>

                        <td className="py-3 pr-4 text-on-surface-variant">
                          {formatDate(
                            patient.assignedAt
                          )}
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
    </div>
  );
}