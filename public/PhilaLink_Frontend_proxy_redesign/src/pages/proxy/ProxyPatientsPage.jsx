import {
  useMemo,
  useState,
} from "react";
import {
  Link,
} from "react-router-dom";
import {
  Search,
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
import {
  CollectionStatus,
  formatDate,
  parseDate,
} from "./proxyUtils.jsx";

export default function ProxyPatientsPage() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    clinic,
    setClinic,
  ] = useState("all");

  const [
    status,
    setStatus,
  ] = useState("all");

  const [
    sort,
    setSort,
  ] = useState(
    "collection"
  );

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

  const clinics =
    useMemo(
      () =>
        Array.from(
          new Set(
            patients
              .map(
                (patient) =>
                  patient.clinicName
              )
              .filter(Boolean)
          )
        ).sort(),
      [patients]
    );

  const filteredPatients =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      const result =
        patients.filter(
          (patient) => {
            const matchesSearch =
              !term ||
              [
                patient.patientName,
                patient.patientNumber,
                patient.clinicName,
              ]
                .filter(Boolean)
                .some((value) =>
                  String(value)
                    .toLowerCase()
                    .includes(term)
                );

            const matchesClinic =
              clinic === "all" ||
              patient.clinicName ===
                clinic;

            const normalizedStatus =
              String(
                patient.collectionStatus ||
                  "none"
              ).toLowerCase();

            const matchesStatus =
              status === "all" ||
              normalizedStatus ===
                status;

            return (
              matchesSearch &&
              matchesClinic &&
              matchesStatus
            );
          }
        );

      result.sort(
        (a, b) => {
          if (
            sort === "name"
          ) {
            return String(
              a.patientName || ""
            ).localeCompare(
              String(
                b.patientName || ""
              )
            );
          }

          if (
            sort === "linked"
          ) {
            return (
              (parseDate(
                b.assignedAt
              )?.getTime() || 0) -
              (parseDate(
                a.assignedAt
              )?.getTime() || 0)
            );
          }

          const aDate =
            parseDate(
              a.nextCollectionDate
            );
          const bDate =
            parseDate(
              b.nextCollectionDate
            );

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

      return result;
    }, [
      patients,
      search,
      clinic,
      status,
      sort,
    ]);

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Patients
          </h1>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Search and track the collection status of patients linked to your proxy account.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(280px,1fr)_220px_190px_190px]">
          <div className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search patient, number or clinic"
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

          <select
            value={
              clinic
            }
            onChange={(
              event
            ) =>
              setClinic(
                event.target.value
              )
            }
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006a6a] focus:ring-2 focus:ring-[#006a6a]/10"
          >
            <option value="all">
              All clinics
            </option>

            {clinics.map(
              (name) => (
                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>
              )
            )}
          </select>

          <select
            value={
              status
            }
            onChange={(
              event
            ) =>
              setStatus(
                event.target.value
              )
            }
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006a6a] focus:ring-2 focus:ring-[#006a6a]/10"
          >
            <option value="all">
              All statuses
            </option>
            <option value="pending">
              Pending
            </option>
            <option value="overdue">
              Overdue
            </option>
            <option value="none">
              No collection
            </option>
          </select>

          <select
            value={
              sort
            }
            onChange={(
              event
            ) =>
              setSort(
                event.target.value
              )
            }
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006a6a] focus:ring-2 focus:ring-[#006a6a]/10"
          >
            <option value="collection">
              Next collection
            </option>
            <option value="name">
              Patient name
            </option>
            <option value="linked">
              Recently linked
            </option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Linked patients
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                filteredPatients.length
              }{" "}
              result
              {
                filteredPatients.length ===
                1
                  ? ""
                  : "s"
              }
            </p>
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
              title="No patients found"
              description="Try changing the search or filters."
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
                    Patient number
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
                  <th className="px-6 py-3">
                    Linked since
                  </th>
                  <th className="px-6 py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredPatients.map(
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
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {formatDate(
                          patient.assignedAt
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          to={`/proxy/collections?patientId=${patient.patientId}`}
                          className="font-semibold text-[#006a6a] hover:underline"
                        >
                          Collections
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
    </div>
  );
}
