import {
  useMemo,
  useState,
} from "react";
import {
  Building2,
  Search,
  Users,
  X,
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

export default function ProxyPatientsPage() {
  const [
    search,
    setSearch,
  ] = useState("");

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

  const searchTerm =
    search
      .trim()
      .toLowerCase();

  const filteredPatients =
    useMemo(() => {
      if (!searchTerm) {
        return patientList;
      }

      return patientList.filter(
        (patient) =>
          [
            patient
              ?.patientName,
            patient
              ?.patientNumber,
            patient
              ?.clinicName,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  searchTerm
                )
            )
      );
    }, [
      patientList,
      searchTerm,
    ]);

  const clinicCount =
    useMemo(
      () =>
        new Set(
          patientList
            .map(
              (patient) =>
                patient
                  ?.clinicId
            )
            .filter(Boolean)
        ).size,
      [patientList]
    );

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Patients under your
              care
            </h1>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              View all patients
              currently linked to
              your proxy account.
            </p>
          </div>

          <div className="relative w-full lg:w-[360px]">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              placeholder="Search by patient, number or clinic"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#006a6a] focus:ring-2 focus:ring-[#006a6a]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X
                  size={15}
                />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Summary
          label="Linked patients"
          value={
            patientList.length
          }
        />

        <Summary
          label="Clinics represented"
          value={
            clinicCount
          }
        />

        <Summary
          label="Search results"
          value={
            filteredPatients.length
          }
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006a6a]/10 text-[#006a6a]">
              <Users
                size={19}
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Managed patients
              </h2>

              <p className="text-sm text-slate-500">
                {
                  filteredPatients.length
                }{" "}
                patient
                {
                  filteredPatients.length ===
                  1
                    ? ""
                    : "s"
                }
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-14">
            <Spinner label="Loading patients..." />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState
              description={
                error.message
              }
              onRetry={
                refetch
              }
            />
          </div>
        ) : filteredPatients.length ===
          0 ? (
          <div className="p-6">
            <EmptyState
              icon="family_restroom"
              title={
                search
                  ? "No patients found"
                  : "No patients linked to your account"
              }
              description={
                search
                  ? "Try another patient name, patient number or clinic."
                  : "A clinic administrator or nurse must link a patient to your proxy account."
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3 sm:p-6">
            {filteredPatients.map(
              (patient) => (
                <PatientCard
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
      </section>
    </div>
  );
}

function Summary({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function PatientCard({
  patient,
}) {
  const initials =
    getInitials(
      patient?.patientName
    );

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-center gap-4 border-b border-slate-100 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#006a6a] text-sm font-semibold text-white">
          {initials}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {patient?.patientName ||
              "Patient"}
          </h3>

          <p className="mt-1 truncate text-sm text-slate-500">
            {patient?.patientNumber ||
              "No patient number"}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <Detail
          label="Clinic"
          value={
            patient?.clinicName ||
            "Not assigned"
          }
          icon={
            <Building2
              size={16}
            />
          }
        />

        <Detail
          label="Linked since"
          value={
            formatDate(
              patient?.assignedAt
            )
          }
        />

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs leading-5 text-slate-500">
            This patient is
            actively linked to
            your proxy account.
            Patient access is
            controlled by
            authorized clinic
            staff.
          </p>
        </div>
      </div>
    </article>
  );
}

function Detail({
  label,
  value,
  icon,
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="mt-0.5 text-slate-400">
          {icon}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}