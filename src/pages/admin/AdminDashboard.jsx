import { Link } from "react-router-dom";
import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import {
  ErrorState,
} from "../../components/ui/EmptyState.jsx";
import { useApi } from "../../lib/useApi.js";
import { adminApi } from "../../services/api/admin.js";

const STAT_CARDS = [
  {
    key: "totalPatients",
    secondaryKey: "activePatients",
    label: "Patients",
    icon: "groups",
  },
  {
    key: "totalNurses",
    secondaryKey: "activeNurses",
    label: "Nurses",
    icon: "medical_services",
  },
  {
    key: "totalProxies",
    secondaryKey: "activeProxies",
    label: "Proxies",
    icon: "family_restroom",
  },
  {
    key: "totalProxyLinks",
    label: "Active proxy links",
    icon: "link",
  },
];

export default function AdminDashboard() {
  const {
    data: stats,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      adminApi.getDashboard(),
    []
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-6">
            <Spinner label="Loading overview…" />
          </div>
        ) : error ? (
          <div className="col-span-full">
            <ErrorState
              description={
                error.message
              }
              onRetry={refetch}
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

                {stat.secondaryKey && (
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {stats?.[
                      stat.secondaryKey
                    ] ?? 0}{" "}
                    active
                  </p>
                )}
              </Card>
            )
          )
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Register staff"
            subtitle="Create Nurse or Proxy accounts"
            action={
              <Button
                as={Link}
                to="/admin/register-staff"
                icon="person_add"
              >
                Register staff
              </Button>
            }
          />

          <CardBody className="pt-0">
            <p className="text-sm text-on-surface-variant">
              Nurse and Proxy
              accounts are created by
              an authorised administrator
              rather than through the
              public patient
              registration flow.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Manage accounts"
            subtitle="Review active and inactive staff accounts"
            action={
              <Button
                as={Link}
                to="/admin/staff"
                variant="outline"
                icon="badge"
              >
                Manage staff
              </Button>
            }
          />

          <CardBody className="pt-0">
            <p className="text-sm text-on-surface-variant">
              View staff accounts,
              filter them by role, and
              activate or deactivate
              access when required.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}