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
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Hash,
  MapPin,
  PackageCheck,
  Pill,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";

import {
  proxiesApi,
} from "../../services/api/proxies.js";

import {
  CollectionStatus,
  formatDate,
  parseDate,
} from "./proxyUtils.jsx";

const PAGE_SIZE = 20;

/* ========================================= */
/* STATUS */
/* ========================================= */

function getCollectionStatusKey(
  collection
) {
  const status =
    String(
      collection?.status ||
        ""
    )
      .trim()
      .toLowerCase();

  if (
    status ===
    "collected"
  ) {
    return "collected";
  }

  if (
    status ===
    "cancelled"
  ) {
    return "cancelled";
  }

  if (
    status ===
    "overdue"
  ) {
    return "overdue";
  }

  const date =
    parseDate(
      collection
        ?.scheduledCollectionDate
    );

  if (!date) {
    return "pending";
  }

  const now =
    new Date();

  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const scheduled =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  if (
    scheduled <
    today
  ) {
    return "overdue";
  }

  if (
    scheduled.getTime() ===
    today.getTime()
  ) {
    return "today";
  }

  return "upcoming";
}

function getInitials(name) {
  if (!name) {
    return "PT";
  }

  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase()
    )
    .join("");
}

/* ========================================= */
/* PAGE */
/* ========================================= */

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
  ] = useState(
    searchParams.get(
      "status"
    ) || "all"
  );

  const [
    sort,
    setSort,
  ] = useState(
    "scheduled-asc"
  );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  /* ===================================== */
  /* LOAD */
  /* ===================================== */

  const loadCollections =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await proxiesApi
              .getCollections();

          setCollections(
            Array.isArray(result)
              ? result
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load proxy collections:",
            err
          );

          setCollections([]);

          setError(
            err?.message ||
              "We could not load collection records."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadCollections();
  }, [
    loadCollections,
  ]);

  /* ===================================== */
  /* SIDEBAR / QUERY SYNC */
  /* ===================================== */

  useEffect(() => {
    setPatientId(
      searchParams.get(
        "patientId"
      ) || ""
    );

    setStatus(
      searchParams.get(
        "status"
      ) || "all"
    );
  }, [
    searchParams,
  ]);

  /* ===================================== */
  /* PATIENT OPTIONS */
  /* ===================================== */

  const patients =
    useMemo(
      () => {
        const map =
          new Map();

        collections.forEach(
          (collection) => {
            if (
              collection.patientId
            ) {
              map.set(
                collection.patientId,
                {
                  id:
                    collection.patientId,

                  name:
                    collection.patientName ||
                    "Patient",

                  number:
                    collection.patientNumber ||
                    "",
                }
              );
            }
          }
        );

        return Array.from(
          map.values()
        ).sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );
      },
      [
        collections,
      ]
    );

  /* ===================================== */
  /* FILTER */
  /* ===================================== */

  const filteredCollections =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        const result =
          collections.filter(
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
                  .some(
                    (value) =>
                      String(value)
                        .toLowerCase()
                        .includes(term)
                  );

              const matchesPatient =
                !patientId ||
                collection.patientId ===
                  patientId;

              const collectionStatus =
                getCollectionStatusKey(
                  collection
                );

              const matchesStatus =
                status ===
                  "all" ||
                collectionStatus ===
                  status;

              return (
                matchesSearch &&
                matchesPatient &&
                matchesStatus
              );
            }
          );

        result.sort(
          (a, b) => {
            if (
              sort ===
              "scheduled-desc"
            ) {
              return (
                (
                  parseDate(
                    b.scheduledCollectionDate
                  )?.getTime() ||
                  0
                ) -
                (
                  parseDate(
                    a.scheduledCollectionDate
                  )?.getTime() ||
                  0
                )
              );
            }

            if (
              sort ===
              "patient"
            ) {
              return String(
                a.patientName ||
                  ""
              ).localeCompare(
                String(
                  b.patientName ||
                    ""
                )
              );
            }

            return (
              (
                parseDate(
                  a.scheduledCollectionDate
                )?.getTime() ||
                0
              ) -
              (
                parseDate(
                  b.scheduledCollectionDate
                )?.getTime() ||
                0
              )
            );
          }
        );

        return result;
      },
      [
        collections,
        search,
        patientId,
        status,
        sort,
      ]
    );

  /* ===================================== */
  /* QUERY CHANGES */
  /* ===================================== */

  function updateQuery(
    key,
    value
  ) {
    const params =
      new URLSearchParams(
        searchParams
      );

    if (
      !value ||
      value === "all"
    ) {
      params.delete(
        key
      );
    } else {
      params.set(
        key,
        value
      );
    }

    setSearchParams(
      params
    );
  }

  function clearFilters() {
    setSearch("");
    setPatientId("");
    setStatus("all");
    setSort(
      "scheduled-asc"
    );

    setSearchParams({});
  }

  /* ===================================== */
  /* PAGINATION */
  /* ===================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    patientId,
    status,
    sort,
  ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredCollections.length /
          PAGE_SIZE
      )
    );

  const startIndex =
    (
      currentPage -
      1
    ) *
    PAGE_SIZE;

  const paginatedCollections =
    filteredCollections.slice(
      startIndex,
      startIndex +
        PAGE_SIZE
    );

  const firstVisible =
    filteredCollections.length
      ? startIndex + 1
      : 0;

  const lastVisible =
    Math.min(
      startIndex +
        PAGE_SIZE,
      filteredCollections.length
    );

  /* ===================================== */
  /* COUNTS */
  /* ===================================== */

  const counts =
    useMemo(
      () => {
        const result = {
          total:
            collections.length,
          today: 0,
          upcoming: 0,
          overdue: 0,
          collected: 0,
        };

        collections.forEach(
          (collection) => {
            const key =
              getCollectionStatusKey(
                collection
              );

            if (
              key in result
            ) {
              result[key] +=
                1;
            }
          }
        );

        return result;
      },
      [
        collections,
      ]
    );

  const hasFilters =
    Boolean(search) ||
    Boolean(patientId) ||
    status !== "all" ||
    sort !==
      "scheduled-asc";

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      {/* HEADER */}

      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-title text-text-primary">
            Collections
          </h1>

          <p className="mt-xs text-label-sm text-text-secondary">
            Medication collection
            records for your linked
            patients
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadCollections
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-medium sm:w-fit"
        >
          <RefreshCw
            size={15}
          />

          Refresh
        </button>
      </div>

      {/* SUMMARY */}

      <div className="mb-lg grid grid-cols-2 gap-md lg:grid-cols-4">
        <Summary
          label="Total"
          value={
            counts.total
          }
          icon={
            PackageCheck
          }
        />

        <Summary
          label="Due today"
          value={
            counts.today
          }
          icon={
            CalendarDays
          }
        />

        <Summary
          label="Upcoming"
          value={
            counts.upcoming
          }
          icon={
            Clock3
          }
        />

        <Summary
          label="Overdue"
          value={
            counts.overdue
          }
          icon={
            AlertCircle
          }
          danger
        />
      </div>

      {/* FILTERS */}

      <section className="mb-lg rounded-corner-lg border border-border-secondary bg-surface-bg p-md sm:p-lg">
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
            />

            <input
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search collections"
              className="h-11 w-full rounded-corner-md border border-border-secondary bg-white pl-10 pr-10 text-label-sm"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
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
            ) =>
              updateQuery(
                "patientId",
                event.target.value
              )
            }
            className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm"
          >
            <option value="">
              All patients
            </option>

            {patients.map(
              (patient) => (
                <option
                  key={
                    patient.id
                  }
                  value={
                    patient.id
                  }
                >
                  {
                    patient.name
                  }
                </option>
              )
            )}
          </select>

          <select
            value={status}
            onChange={(
              event
            ) =>
              updateQuery(
                "status",
                event.target.value
              )
            }
            className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm"
          >
            <option value="all">
              All statuses
            </option>

            <option value="today">
              Due today
            </option>

            <option value="upcoming">
              Upcoming
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

          <select
            value={sort}
            onChange={(
              event
            ) =>
              setSort(
                event.target.value
              )
            }
            className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm"
          >
            <option value="scheduled-asc">
              Collection date
            </option>

            <option value="scheduled-desc">
              Latest first
            </option>

            <option value="patient">
              Patient name
            </option>
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="mt-md flex items-center gap-xs text-label-sm text-brand-primary"
          >
            <X
              size={14}
            />

            Clear filters
          </button>
        )}
      </section>

      {/* COLLECTION RECORDS */}

      <section className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg">
        <div className="border-b border-border-secondary p-md sm:p-lg">
          <h2 className="text-label font-semibold">
            Collection records
          </h2>

          <p className="mt-xs text-video-title text-text-secondary">
            {
              filteredCollections.length
            }{" "}
            records
          </p>
        </div>

        {loading ? (
          <div className="py-2xl text-center">
            Loading collections...
          </div>
        ) : error ? (
          <div className="p-lg text-danger">
            {error}
          </div>
        ) : filteredCollections.length ===
          0 ? (
          <div className="py-2xl text-center text-text-secondary">
            No collections found.
          </div>
        ) : (
          <>
            {/* MOBILE */}

            <div className="divide-y divide-border-secondary md:hidden">
              {paginatedCollections.map(
                (collection) => (
                  <article
                    key={
                      collection.id
                    }
                    className="p-md"
                  >
                    <div className="flex items-start justify-between gap-sm">
                      <div>
                        <h3 className="font-semibold">
                          {
                            collection.patientName
                          }
                        </h3>

                        <div className="mt-xs flex items-center gap-xs text-video-title text-text-secondary">
                          <Hash
                            size={12}
                          />

                          {
                            collection.patientNumber
                          }
                        </div>
                      </div>

                      <CollectionStatus
                        status={
                          collection.status
                        }
                        date={
                          collection.scheduledCollectionDate
                        }
                      />
                    </div>

                    <div className="mt-md rounded-corner-md bg-[#f8fafc] p-md">
                      <div className="flex items-center gap-xs text-text-tertiary">
                        <Pill
                          size={14}
                        />

                        <span className="text-[10px] uppercase">
                          Medication
                        </span>
                      </div>

                      <p className="mt-xs font-medium">
                        {collection.medicationName ||
                          "—"}
                      </p>

                      <div className="mt-md grid grid-cols-2 gap-md">
                        <div>
                          <p className="text-[10px] uppercase text-text-tertiary">
                            Collection date
                          </p>

                          <p className="mt-xs text-label-sm">
                            {formatDate(
                              collection.scheduledCollectionDate
                            )}
                          </p>
                        </div>

                        <div>
                          <div className="flex gap-xs text-text-tertiary">
                            <MapPin
                              size={13}
                            />

                            <span className="text-[10px] uppercase">
                              Clinic
                            </span>
                          </div>

                          <p className="mt-xs text-label-sm">
                            {collection.clinicName ||
                              "—"}
                          </p>
                        </div>

                        <div>
                          <div className="flex gap-xs text-text-tertiary">
                            <UserRound
                              size={13}
                            />

                            <span className="text-[10px] uppercase">
                              Collected by
                            </span>
                          </div>

                          <p className="mt-xs text-label-sm">
                            {collection.proxyName ||
                              "Patient / unassigned"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase text-text-tertiary">
                            Collected
                          </p>

                          <p className="mt-xs text-label-sm">
                            {collection.collectedAt
                              ? formatDate(
                                  collection.collectedAt
                                )
                              : "Not collected"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-[#f8fafc]">
                  <tr>
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

                <tbody>
                  {paginatedCollections.map(
                    (collection) => (
                      <tr
                        key={
                          collection.id
                        }
                        className="border-t border-border-secondary"
                      >
                        <TableCell>
                          {
                            collection.patientName
                          }
                        </TableCell>

                        <TableCell>
                          {
                            collection.medicationName
                          }
                        </TableCell>

                        <TableCell>
                          {
                            collection.clinicName
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
                          {collection.proxyName ||
                            "Patient / unassigned"}
                        </TableCell>

                        <TableCell>
                          {collection.processedByNurseName ||
                            "—"}
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

            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              firstVisible={
                firstVisible
              }
              lastVisible={
                lastVisible
              }
              totalItems={
                filteredCollections.length
              }
              onPrevious={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              onNext={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
            />
          </>
        )}
      </section>
    </div>
  );
}

function Summary({
  label,
  value,
  icon: Icon,
  danger = false,
}) {
  return (
    <div className="rounded-corner-lg border border-border-secondary bg-white p-md sm:p-lg">
      <div className="flex justify-between gap-sm">
        <div>
          <p className="text-video-title text-text-secondary">
            {label}
          </p>

          <p
            className={`mt-sm text-2xl font-semibold ${
              danger
                ? "text-danger"
                : "text-text-primary"
            }`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            danger
              ? "bg-danger/10 text-danger"
              : "bg-brand-primary/10 text-brand-primary"
          }`}
        >
          <Icon
            size={16}
          />
        </div>
      </div>
    </div>
  );
}

function TableHead({
  children,
}) {
  return (
    <th className="px-lg py-md text-left text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
      {children}
    </th>
  );
}

function TableCell({
  children,
}) {
  return (
    <td className="px-lg py-md text-label-sm text-text-secondary">
      {children}
    </td>
  );
}

function Pagination({
  currentPage,
  totalPages,
  firstVisible,
  lastVisible,
  totalItems,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex flex-col gap-md border-t border-border-secondary p-md sm:flex-row sm:items-center sm:justify-between">
      <p className="text-video-title text-text-tertiary">
        Showing{" "}
        {firstVisible}
        –{lastVisible} of{" "}
        {totalItems}
      </p>

      <div className="flex items-center gap-sm">
        <button
          disabled={
            currentPage === 1
          }
          onClick={
            onPrevious
          }
          className="flex h-10 items-center gap-xs rounded-corner-md border border-border-secondary px-3 disabled:opacity-40"
        >
          <ChevronLeft
            size={15}
          />

          Previous
        </button>

        <span className="text-video-title">
          {currentPage} /{" "}
          {totalPages}
        </span>

        <button
          disabled={
            currentPage ===
            totalPages
          }
          onClick={
            onNext
          }
          className="flex h-10 items-center gap-xs rounded-corner-md border border-border-secondary px-3 disabled:opacity-40"
        >
          Next

          <ChevronRight
            size={15}
          />
        </button>
      </div>
    </div>
  );
}