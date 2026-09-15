import {
  useMemo,
} from "react";
import {
  Link,
} from "react-router-dom";
import {
  ArrowRight,
  Building2,
  RefreshCw,
  Users,
} from "lucide-react";

import Spinner from "../../components/ui/Spinner.jsx";
import {
  ErrorState,
  EmptyState,
} from "../../components/ui/EmptyState.jsx";
import {
  useApi,
} from "../../lib/useApi.js";
import {
  useAuth,
} from "../../context/AuthContext.jsx";
import {
  proxiesApi,
} from "../../services/api/proxies.js";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
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

export default function ProxyDashboard() {
  const {
    user,
  } = useAuth();

  const {
    data: patients,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      proxiesApi
        .getManagedPatients(),
    []
  );

  const patientList =
    Array.isArray(patients)
      ? patients
      : [];

  const displayName =
    user?.fullName ||
    user?.name ||
    "Proxy";

  const clinics =
    useMemo(() => {
      const map =
        new Map();

      patientList.forEach(
        (patient) => {
          if (
            !patient?.clinicId
          ) {
            return;
          }

          const current =
            map.get(
              patient.clinicId
            ) || {
              id:
                patient.clinicId,
              name:
                patient.clinicName ||
                "Unnamed clinic",
              count: 0,
            };

          current.count += 1;

          map.set(
            patient.clinicId,
            current
          );
        }
      );

      return Array.from(
        map.values()
      ).sort(
        (a, b) =>
          b.count -
          a.count
      );
    }, [patientList]);

  const unassignedCount =
    patientList.filter(
      (patient) =>
        !patient?.clinicId
    ).length;

  const recentPatients =
    useMemo(
      () =>
        [...patientList]
          .sort(
            (a, b) =>
              new Date(
                b?.assignedAt || 0
              ) -
              new Date(
                a?.assignedAt || 0
              )
          )
          .slice(0, 5),
      [patientList]
    );

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner label="Loading proxy dashboard..." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-5 bg-[#006a6a] px-6 py-7 text-white lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium text-white/75">
              Proxy dashboard
            </p>

            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Welcome back,{" "}
              {displayName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              View the patients
              currently linked to
              your proxy account and
              the clinics responsible
              for their care.
            </p>
          </div>

          <Link
            to="/proxy/patients"
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 text-sm font-semibold text-[#006a6a] transition hover:bg-slate-100 lg:self-auto"
          >
            View all patients

            <ArrowRight
              size={16}
            />
          </Link>
        </div>
      </section>

      {error && (
        <section className="rounded-2xl border border-red-200 bg-white p-5">
          <ErrorState
            description={
              error.message
            }
            onRetry={
              refetch
            }
          />
        </section>
      )}

      {!error && (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              label="Patients under your care"
              value={
                patientList.length
              }
              icon={
                <Users
                  size={20}
                />
              }
            />

            <SummaryCard
              label="Clinics represented"
              value={
                clinics.length
              }
              icon={
                <Building2
                  size={20}
                />
              }
            />

            <SummaryCard
              label="Patients without a clinic"
              value={
                unassignedCount
              }
              icon={
                <Building2
                  size={20}
                />
              }
            />
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Patients under your care
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your most recently
                    linked patients.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    refetch
                  }
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <RefreshCw
                    size={15}
                  />

                  Refresh
                </button>
              </div>

              {recentPatients.length ===
              0 ? (
                <div className="p-6">
                  <EmptyState
                    icon="family_restroom"
                    title="No patients linked to your account"
                    description="A clinic administrator or nurse must link a patient to your proxy profile."
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {recentPatients.map(
                    (
                      patient
                    ) => (
                      <PatientRow
                        key={
                          patient.proxyLinkId
                        }
                        patient={
                          patient
                        }
                      />
                    )
                  )}
                </div>
              )}

              {patientList.length >
                5 && (
                <div className="border-t border-slate-200 px-5 py-4 sm:px-6">
                  <Link
                    to="/proxy/patients"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#006a6a] hover:underline"
                  >
                    View all{" "}
                    {
                      patientList.length
                    }{" "}
                    patients

                    <ArrowRight
                      size={15}
                    />
                  </Link>
                </div>
              )}
            </section>

            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006a6a]/10 text-[#006a6a]">
                    <Building2
                      size={19}
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Clinic overview
                    </h2>

                    <p className="text-sm text-slate-500">
                      Where your
                      linked patients
                      receive care.
                    </p>
                  </div>
                </div>

                {clinics.length >
                0 ? (
                  <div className="mt-5 divide-y divide-slate-200">
                    {clinics.map(
                      (
                        clinic
                      ) => (
                        <div
                          key={
                            clinic.id
                          }
                          className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <p className="min-w-0 truncate text-sm font-medium text-slate-800">
                            {
                              clinic.name
                            }
                          </p>

                          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {
                              clinic.count
                            }{" "}
                            patient
                            {
                              clinic.count ===
                              1
                                ? ""
                                : "s"
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    No clinic
                    assignments are
                    available yet.
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-900">
                  Proxy access
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This dashboard
                  currently shows
                  patients that have
                  been actively linked
                  to your proxy
                  profile.
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Patient links are
                  managed by
                  authorized clinic
                  staff.
                </p>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#006a6a]/10 text-[#006a6a]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function PatientRow({
  patient,
}) {
  const initials =
    getInitials(
      patient?.patientName
    );

  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#006a6a] text-sm font-semibold text-white">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {patient?.patientName ||
              "Patient"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {patient?.patientNumber ||
              "No patient number"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:min-w-[300px]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Clinic
          </p>

          <p className="mt-1 truncate text-sm text-slate-700">
            {patient?.clinicName ||
              "Not assigned"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Linked since
          </p>

          <p className="mt-1 text-sm text-slate-700">
            {formatDate(
              patient?.assignedAt
            )}
          </p>
        </div>
      </div>
    </div>
  );
}