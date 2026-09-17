import {
  useMemo,
  useState,
} from "react";
import {
  Link,
  useSearchParams,
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

export default function ProxyCollectionsPage() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const initialPatientId =
    searchParams.get(
      "patientId"
    ) || "";

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("all");

  const [
    patientId,
    setPatientId,
  ] = useState(
    initialPatientId
  );

  const {
    data: collections,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      proxiesApi.getCollections(),
    []
  );

  const collectionList =
    Array.isArray(collections)
      ? collections
      : [];

  const patients =
    useMemo(() => {
      const map =
        new Map();

      collectionList.forEach(
        (collection) => {
          if (
            collection.patientId
          ) {
            map.set(
              collection.patientId,
              collection.patientName ||
                collection.patientNumber ||
                "Patient"
            );
          }
        }
      );

      return Array.from(
        map.entries()
      ).sort(
        (a, b) =>
          a[1].localeCompare(
            b[1]
          )
      );
    }, [collectionList]);

  const filteredCollections =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return collectionList.filter(
        (collection) => {
          const matchesSearch =
            !term ||
            [
              collection.patientName,
              collection.patientNumber,
              collection.clinicName,
              collection.medicationName,
            ]
              .filter(Boolean)
              .some((value) =>
                String(value)
                  .toLowerCase()
                  .includes(term)
              );

          const matchesStatus =
            status === "all" ||
            String(
              collection.status ||
                ""
            ).toLowerCase() ===
              status;

          const matchesPatient =
            !patientId ||
            collection.patientId ===
              patientId;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPatient
          );
        }
      );
    }, [
      collectionList,
      search,
      status,
      patientId,
    ]);

  function clearPatientFilter() {
    setPatientId("");
    setSearchParams({});
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Collections
            </h1>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Track medication collections for patients currently linked to you.
            </p>
          </div>

          <Link
            to="/proxy/patients"
            className="text-sm font-semibold text-[#006a6a] hover:underline"
          >
            Back to patients
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(280px,1fr)_220px_220px]">
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
              placeholder="Search patient, clinic or medication"
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
              patientId
            }
            onChange={(
              event
            ) => {
              const value =
                event.target.value;

              setPatientId(
                value
              );

              if (value) {
                setSearchParams({
                  patientId:
                    value,
                });
              } else {
                setSearchParams(
                  {}
                );
              }
            }}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006a6a] focus:ring-2 focus:ring-[#006a6a]/10"
          >
            <option value="">
              All patients
            </option>

            {patients.map(
              ([
                id,
                name,
              ]) => (
                <option
                  key={id}
                  value={id}
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
            <option value="collected">
              Collected
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {patientId && (
          <button
            type="button"
            onClick={
              clearPatientFilter
            }
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#006a6a] hover:underline"
          >
            <X
              size={14}
            />
            Clear patient filter
          </button>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">
            Collection records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {
              filteredCollections.length
            }{" "}
            record
            {
              filteredCollections.length ===
                1
                ? ""
                : "s"
            }
          </p>
        </div>

        {loading ? (
          <div className="py-14">
            <Spinner label="Loading collections..." />
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
        ) : filteredCollections.length ===
          0 ? (
          <div className="p-6">
            <EmptyState
              icon="inventory_2"
              title="No collections found"
              description="Try changing the patient, status or search filters."
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
                    Medication
                  </th>
                  <th className="px-6 py-3">
                    Clinic
                  </th>
                  <th className="px-6 py-3">
                    Collection date
                  </th>
                  <th className="px-6 py-3">
                    Status
                  </th>
                  <th className="px-6 py-3">
                    Proxy
                  </th>
                  <th className="px-6 py-3">
                    Processed by
                  </th>
                  <th className="px-6 py-3">
                    Collected
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredCollections.map(
                  (collection) => (
                    <tr
                      key={
                        collection.id
                      }
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <p className="whitespace-nowrap font-semibold text-slate-900">
                          {collection.patientName ||
                            "Patient"}
                        </p>
                        <p className="mt-1 whitespace-nowrap text-xs text-slate-500">
                          {collection.patientNumber ||
                            "—"}
                        </p>
                      </td>
                      <td className="max-w-[280px] px-6 py-4 text-slate-700">
                        {collection.medicationName ||
                          "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {collection.clinicName ||
                          "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                        {formatDate(
                          collection.scheduledCollectionDate
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <CollectionStatus
                          status={
                            collection.status
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {collection.proxyName ||
                          "Patient / unassigned"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {collection.processedByNurseName ||
                          "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {formatDate(
                          collection.collectedAt
                        )}
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
