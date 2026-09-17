import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  AlertCircle,
  PackageCheck,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  proxiesApi,
} from "../../services/api/proxies.js";

import {
  CollectionStatus,
  formatDate,
} from "./proxyUtils.jsx";

export default function ProxyCollectionsPage() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    collections,
    setCollections,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    patientId,
    setPatientId,
  ] = useState(
    searchParams.get(
      "patientId"
    ) || ""
  );

  const [
    status,
    setStatus,
  ] = useState("all");

  const loadCollections =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const result =
            await proxiesApi
              .getCollections();

          setCollections(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load proxy collections:",
            err
          );

          setCollections(
            []
          );

          setError(
            err?.message ||
              "We could not load collection records."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    loadCollections();
  }, [
    loadCollections,
  ]);

  const patients =
    useMemo(
      () => {
        const map =
          new Map();

        collections.forEach(
          (
            collection
          ) => {
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
          (
            a,
            b
          ) =>
            a[1].localeCompare(
              b[1]
            )
        );
      },
      [
        collections,
      ]
    );

  const filteredCollections =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        return collections.filter(
          (
            collection
          ) => {
            const matchesSearch =
              !term ||
              [
                collection.patientName,
                collection.patientNumber,
                collection.clinicName,
                collection.medicationName,
              ]
                .filter(
                  Boolean
                )
                .some(
                  (
                    value
                  ) =>
                    String(
                      value
                    )
                      .toLowerCase()
                      .includes(
                        term
                      )
                );

            const matchesPatient =
              !patientId ||
              collection.patientId ===
                patientId;

            const matchesStatus =
              status ===
                "all" ||
              String(
                collection.status ||
                  ""
              ).toLowerCase() ===
                status;

            return (
              matchesSearch &&
              matchesPatient &&
              matchesStatus
            );
          }
        );
      },
      [
        collections,
        search,
        patientId,
        status,
      ]
    );

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            Collections
          </h1>

          <p className="mt-xs text-label-sm text-text-secondary">
            Medication collections for your linked patients
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadCollections
          }
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-[#f8fafc]"
        >
          <RefreshCw
            size={
              15
            }
          />
          Refresh
        </button>
      </div>

      <section className="mb-lg rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl">
        <div className="grid grid-cols-1 gap-md xl:grid-cols-[minmax(280px,1fr)_220px_190px]">
          <div className="relative">
            <Search
              size={
                17
              }
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
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
              className="h-11 w-full rounded-corner-md border border-border-secondary bg-white pl-10 pr-10 text-label-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch(
                    ""
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition hover:text-text-primary"
                aria-label="Clear search"
              >
                <X
                  size={
                    15
                  }
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

              setSearchParams(
                value
                  ? {
                      patientId:
                        value,
                    }
                  : {}
              );
            }}
            className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm text-text-secondary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
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
                  key={
                    id
                  }
                  value={
                    id
                  }
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
            className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm text-text-secondary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
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
            onClick={() => {
              setPatientId(
                ""
              );

              setSearchParams(
                {}
              );
            }}
            className="mt-md inline-flex items-center gap-xs text-label-sm text-brand-primary transition-opacity hover:opacity-70"
          >
            <X
              size={
                14
              }
            />
            Clear patient filter
          </button>
        )}
      </section>

      <section className="rounded-corner-lg border border-border-secondary bg-surface-bg">
        <div className="flex items-center gap-sm border-b border-border-secondary p-lg lg:px-xl">
          <PackageCheck
            size={
              16
            }
            className="text-brand-primary"
          />

          <div>
            <h2 className="text-label font-semibold text-text-primary">
              Collection records
            </h2>

            <p className="mt-xs text-video-title text-text-secondary">
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
        </div>

        {loading ? (
          <div className="px-lg py-2xl text-center">
            <p className="text-label-sm text-text-secondary">
              Loading collections...
            </p>
          </div>
        ) : error ? (
          <div className="p-lg lg:p-xl">
            <div className="flex items-start gap-md rounded-corner-md border border-danger/20 bg-danger/10 p-md">
              <AlertCircle
                size={
                  17
                }
                className="mt-0.5 shrink-0 text-danger"
              />

              <div>
                <p className="text-label-sm text-text-primary">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    loadCollections
                  }
                  className="mt-xs text-label-sm text-brand-primary"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : filteredCollections.length ===
          0 ? (
          <div className="px-lg py-2xl text-center">
            <PackageCheck
              size={
                28
              }
              className="mx-auto text-text-tertiary"
            />

            <p className="mt-md text-label-sm font-medium text-text-primary">
              No collections found
            </p>

            <p className="mt-xs text-video-title text-text-secondary">
              Try changing your patient, status or search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1220px] w-full">
              <thead className="bg-[#f8fafc]">
                <tr className="border-b border-border-secondary">
                  <TableHead>
                    Patient
                  </TableHead>
                  <TableHead>
                    Medication
                  </TableHead>
                  <TableHead>
                    Clinic
                  </TableHead>
                  <TableHead>
                    Collection date
                  </TableHead>
                  <TableHead>
                    Status
                  </TableHead>
                  <TableHead>
                    Collected by
                  </TableHead>
                  <TableHead>
                    Processed by
                  </TableHead>
                  <TableHead>
                    Collected
                  </TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-secondary">
                {filteredCollections.map(
                  (
                    collection
                  ) => (
                    <tr
                      key={
                        collection.id
                      }
                      className="transition hover:bg-[#f8fafc]"
                    >
                      <td className="px-lg py-md lg:px-xl">
                        <p className="whitespace-nowrap text-label-sm font-medium text-text-primary">
                          {collection.patientName ||
                            "Patient"}
                        </p>

                        <p className="mt-xs whitespace-nowrap text-video-title text-text-tertiary">
                          {collection.patientNumber ||
                            "—"}
                        </p>
                      </td>

                      <TableCell>
                        {
                          collection.medicationName ||
                          "—"
                        }
                      </TableCell>

                      <TableCell>
                        {
                          collection.clinicName ||
                          "—"
                        }
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          collection.scheduledCollectionDate
                        )}
                      </TableCell>

                      <TableCell>
                        <CollectionStatus
                          status={
                            collection.status
                          }
                          date={
                            collection.scheduledCollectionDate
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {
                          collection.proxyName ||
                          "Patient / unassigned"
                        }
                      </TableCell>

                      <TableCell>
                        {
                          collection.processedByNurseName ||
                          "—"
                        }
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          collection.collectedAt
                        )}
                      </TableCell>
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

function TableHead({
  children,
}) {
  return (
    <th className="px-lg py-md text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary lg:px-xl">
      {children}
    </th>
  );
}

function TableCell({
  children,
}) {
  return (
    <td className="max-w-[280px] whitespace-nowrap px-lg py-md text-label-sm text-text-secondary lg:px-xl">
      {children}
    </td>
  );
}
