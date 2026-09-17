import {
  Link,
} from "react-router-dom";
import {
  CalendarClock,
  CircleAlert,
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
import {
  CollectionStatus,
  formatDate,
  parseDate,
} from "./proxyUtils.jsx";

export default function ProxyDashboard() {
  const {
    user,
  } = useAuth();

  const {
    data: care,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      proxiesApi.getCare(),
    []
  );

  const patients =
    Array.isArray(care?.patients)
      ? care.patients
      : [];

  const sortedPatients =
    [...patients].sort(
      (a, b) => {
        const aDate =
          parseDate(
            a.nextCollectionDate
          );

        const bDate =
          parseDate(
            b.nextCollectionDate
          );

        if (!aDate && !bDate) {
          return String(
            a.patientName || ""
          ).localeCompare(
            String(
              b.patientName || ""
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
    );

  const displayName =
    user?.fullName ||
    user?.name ||
    "Proxy";

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
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
              Keep track of linked patients and their medication collection dates.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/proxy/patients"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-[#006a6a] transition hover:bg-slate-100"
            >
              View patients
            </Link>

            <Link
              to="/proxy/collections"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View collections
            </Link>
          </div>
        </div>
      </section>

      {error ? (
        <section className="rounded-2xl border border-red-200 bg-white p-6">
          <ErrorState
            description={
              error.message
            }
            onRetry={
              refetch
            }
          />
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Linked patients"
              value={
                care?.totalPatients ??
                patients.length
              }
              icon={
                <Users
                  size={20}
                />
              }
            />

            <SummaryCard
              label="Collections due soon"
              value={
                care?.dueSoon ?? 0
              }
              icon={
                <CalendarClock
                  size={20}
                />
              }
            />

            <SummaryCard
              label="Overdue collections"
              value={
                care?.overdue ?? 0
              }
              icon={
                <CircleAlert
                  size={20}
                />
              }
              danger={
                Number(
                  care?.overdue ?? 0
                ) > 0
              }
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Patients under your care
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Collection-focused view of your linked patients.
                </p>
              </div>

              <Link
                to="/proxy/patients"
                className="text-sm font-semibold text-[#006a6a] hover:underline"
              >
                View all patients
              </Link>
            </div>

            {sortedPatients.length ===
            0 ? (
              <div className="p-6">
                <EmptyState
                  icon="family_restroom"
                  title="No linked patients"
                  description="Patients linked to your proxy account will appear here."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-3">
                        Patient
                      </th>
                      <th className="px-6 py-3">
                        Patient no.
                      </th>
                      <th className="px-6 py-3">
                        Clinic
                      </th>
                      <th className="px-6 py-3">
                        Next collection
                      </th>
                      <th className="px-6 py-3">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {sortedPatients
                      .slice(0, 6)
                      .map(
                        (patient) => (
                          <tr
                            key={
                              patient.proxyLinkId ||
                              patient.patientId
                            }
                            className="hover:bg-slate-50/70"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                              {patient.patientName ||
                                "Patient"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                              {patient.patientNumber ||
                                "—"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                              {patient.clinicName ||
                                "Not assigned"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                              {formatDate(
                                patient.nextCollectionDate
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <CollectionStatus
                                status={
                                  patient.collectionStatus
                                }
                              />
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                              <Link
                                to={`/proxy/collections?patientId=${patient.patientId}`}
                                className="font-semibold text-[#006a6a] hover:underline"
                              >
                                View collections
                              </Link>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  danger = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-semibold tracking-tight ${
              danger
                ? "text-red-700"
                : "text-slate-900"
            }`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-50 text-red-700"
              : "bg-[#006a6a]/10 text-[#006a6a]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
