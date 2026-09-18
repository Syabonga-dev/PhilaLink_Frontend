import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Hash,
  MapPin,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";

import {
  proxiesApi,
} from "../../services/api/proxies.js";

import {
  CollectionStatus,
  formatDate,
  parseDate,
} from "./ProxyUtils.jsx";

const PAGE_SIZE = 20;

/* ========================================= */
/* HELPERS */
/* ========================================= */

function getInitials(name) {
  if (!name) {
    return "PT";
  }

  const parts =
    String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`
    .toUpperCase();
}

function getPatientStatusKey(
  patient
) {
  if (
    !patient
      ?.nextCollectionDate
  ) {
    return "none";
  }

  const status =
    String(
      patient
        ?.collectionStatus ||
        ""
    )
      .trim()
      .toLowerCase();

  if (
    status ===
    "overdue"
  ) {
    return "overdue";
  }

  const date =
    parseDate(
      patient
        .nextCollectionDate
    );

  if (!date) {
    return "none";
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
    scheduled.getTime() <
    today.getTime()
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

/* ========================================= */
/* PAGE */
/* ========================================= */

export default function ProxyPatientsPage() {
  const navigate =
    useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    care,
    setCare,
  ] = useState(null);

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
    clinic,
    setClinic,
  ] = useState("all");

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
    "collection"
  );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  /* ===================================== */
  /* LOAD */
  /* ===================================== */

  const loadCare =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await proxiesApi
              .getCare();

          setCare(
            result || {
              patients: [],
            }
          );
        } catch (err) {
          console.error(
            "Failed to load proxy patients:",
            err
          );

          setCare(null);

          setError(
            err?.message ||
              "We could not load your linked patients."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadCare();
  }, [
    loadCare,
  ]);

  /* ===================================== */
  /* SIDEBAR QUERY SYNC */
  /* ===================================== */

  useEffect(() => {
    const urlStatus =
      searchParams.get(
        "status"
      );

    setStatus(
      urlStatus ||
        "all"
    );
  }, [
    searchParams,
  ]);

  const patients =
    Array.isArray(
      care?.patients
    )
      ? care.patients
      : [];

  /* ===================================== */
  /* CLINICS */
  /* ===================================== */

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
      [
        patients,
      ]
    );

  /* ===================================== */
  /* FILTER */
  /* ===================================== */

  const filteredPatients =
    useMemo(
      () => {
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
                  .some(
                    (value) =>
                      String(value)
                        .toLowerCase()
                        .includes(
                          term
                        )
                  );

              const matchesClinic =
                clinic ===
                  "all" ||
                patient.clinicName ===
                  clinic;

              const patientStatus =
                getPatientStatusKey(
                  patient
                );

              const matchesStatus =
                status ===
                  "all" ||
                patientStatus ===
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
                a.patientName ||
                  ""
              ).localeCompare(
                String(
                  b.patientName ||
                    ""
                )
              );
            }

            if (
              sort === "linked"
            ) {
              return (
                (
                  parseDate(
                    b.assignedAt
                  )?.getTime() ||
                  0
                ) -
                (
                  parseDate(
                    a.assignedAt
                  )?.getTime() ||
                  0
                )
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

            if (
              !aDate &&
              !bDate
            ) {
              return 0;
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

        return result;
      },
      [
        patients,
        search,
        clinic,
        status,
        sort,
      ]
    );

  /* ===================================== */
  /* FILTER ACTION */
  /* ===================================== */

  function handleStatusChange(
    value
  ) {
    setStatus(value);

    const params =
      new URLSearchParams(
        searchParams
      );

    if (
      value === "all"
    ) {
      params.delete(
        "status"
      );
    } else {
      params.set(
        "status",
        value
      );
    }

    setSearchParams(
      params
    );
  }

  function clearFilters() {
    setSearch("");
    setClinic("all");
    setSort(
      "collection"
    );
    setStatus("all");
    setSearchParams({});
  }

  /* ===================================== */
  /* PAGINATION */
  /* ===================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    clinic,
    status,
    sort,
  ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredPatients.length /
          PAGE_SIZE
      )
    );

  const startIndex =
    (
      currentPage -
      1
    ) *
    PAGE_SIZE;

  const paginatedPatients =
    filteredPatients.slice(
      startIndex,
      startIndex +
        PAGE_SIZE
    );

  const firstVisible =
    filteredPatients.length
      ? startIndex + 1
      : 0;

  const lastVisible =
    Math.min(
      startIndex +
        PAGE_SIZE,
      filteredPatients.length
    );

  const hasFilters =
    Boolean(search) ||
    clinic !== "all" ||
    status !== "all" ||
    sort !==
      "collection";

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      {/* HEADER */}

      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            Patients
          </h1>

          <p className="mt-xs text-label-sm text-text-secondary">
            Search and filter patients
            linked to your proxy account
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadCare
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-[#f8fafc] sm:w-fit"
        >
          <RefreshCw
            size={15}
          />

          Refresh
        </button>
      </div>

      {/* FILTERS */}

      <section className="mb-lg rounded-corner-lg border border-border-secondary bg-surface-bg p-md sm:p-lg lg:p-xl">
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_220px_190px_190px]">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
            />

            <input
              type="search"
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search patient, number or clinic"
              className="h-11 w-full rounded-corner-md border border-border-secondary bg-white pl-10 pr-10 text-label-sm text-text-primary outline-none"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              >
                <X
                  size={15}
                />
              </button>
            )}
          </div>

          <select
            value={clinic}
            onChange={(
              event
            ) =>
              setClinic(
                event.target.value
              )
            }
            className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm text-text-secondary"
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
            value={status}
            onChange={(
              event
            ) =>
              handleStatusChange(
                event.target.value
              )
            }
            className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm text-text-secondary"
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

            <option value="none">
              No collection
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
            className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm text-text-secondary"
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

        {hasFilters && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="mt-md inline-flex items-center gap-xs text-label-sm font-medium text-brand-primary"
          >
            <X
              size={14}
            />

            Clear filters
          </button>
        )}
      </section>

      {/* RECORDS */}

      <section className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg">
        <div className="flex items-center justify-between border-b border-border-secondary p-md sm:p-lg lg:px-xl">
          <div className="flex items-center gap-sm">
            <Users
              size={16}
              className="text-brand-primary"
            />

            <div>
              <h2 className="text-label font-semibold text-text-primary">
                Linked patients
              </h2>

              <p className="mt-xs text-video-title text-text-secondary">
                {
                  filteredPatients.length
                }{" "}
                patients
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-2xl text-center text-label-sm text-text-secondary">
            Loading patients...
          </div>
        ) : error ? (
          <div className="p-lg">
            <div className="flex gap-md rounded-corner-md bg-danger/10 p-md">
              <AlertCircle
                size={17}
                className="text-danger"
              />

              <p className="text-label-sm">
                {error}
              </p>
            </div>
          </div>
        ) : filteredPatients.length ===
          0 ? (
          <div className="py-2xl text-center text-label-sm text-text-secondary">
            No patients found.
          </div>
        ) : (
          <>
            {/* MOBILE */}

            <div className="divide-y divide-border-secondary md:hidden">
              {paginatedPatients.map(
                (patient) => (
                  <article
                    key={
                      patient.proxyLinkId ||
                      patient.patientId
                    }
                    className="p-md"
                  >
                    <div className="flex items-start justify-between gap-sm">
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {patient.patientName}
                        </h3>

                        <div className="mt-xs flex items-center gap-xs text-video-title text-text-secondary">
                          <Hash
                            size={12}
                          />

                          {
                            patient.patientNumber
                          }
                        </div>
                      </div>

                      <CollectionStatus
                        status={
                          patient.collectionStatus
                        }
                        date={
                          patient.nextCollectionDate
                        }
                      />
                    </div>

                    <div className="mt-md rounded-corner-md bg-[#f8fafc] p-md">
                      <div className="flex gap-xs text-text-tertiary">
                        <MapPin
                          size={14}
                        />

                        <span className="text-[10px] uppercase">
                          Clinic
                        </span>
                      </div>

                      <p className="mt-xs text-label-sm">
                        {patient.clinicName ||
                          "Not assigned"}
                      </p>

                      <div className="mt-md flex gap-xs text-text-tertiary">
                        <CalendarDays
                          size={14}
                        />

                        <span className="text-[10px] uppercase">
                          Next collection
                        </span>
                      </div>

                      <p className="mt-xs text-label-sm">
                        {formatDate(
                          patient.nextCollectionDate
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/proxy/collections?patientId=${patient.patientId}`
                        )
                      }
                      className="mt-md w-full rounded-corner-md bg-brand-primary/10 py-3 text-label-sm font-semibold text-brand-primary"
                    >
                      View Collections
                    </button>
                  </article>
                )
              )}
            </div>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1040px]">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <TableHead>
                      Patient
                    </TableHead>

                    <TableHead>
                      Patient number
                    </TableHead>

                    <TableHead>
                      Clinic
                    </TableHead>

                    <TableHead>
                      Next collection
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead>
                      Linked since
                    </TableHead>

                    <TableHead>
                      Action
                    </TableHead>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPatients.map(
                    (patient) => (
                      <tr
                        key={
                          patient.proxyLinkId ||
                          patient.patientId
                        }
                        className="border-t border-border-secondary"
                      >
                        <TableCell>
                          {
                            patient.patientName
                          }
                        </TableCell>

                        <TableCell>
                          {
                            patient.patientNumber
                          }
                        </TableCell>

                        <TableCell>
                          {
                            patient.clinicName
                          }
                        </TableCell>

                        <TableCell>
                          {formatDate(
                            patient.nextCollectionDate
                          )}
                        </TableCell>

                        <TableCell>
                          <CollectionStatus
                            status={
                              patient.collectionStatus
                            }
                            date={
                              patient.nextCollectionDate
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {formatDate(
                            patient.assignedAt
                          )}
                        </TableCell>

                        <TableCell>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/proxy/collections?patientId=${patient.patientId}`
                              )
                            }
                            className="text-brand-primary"
                          >
                            Collections
                          </button>
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
                filteredPatients.length
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
          type="button"
          disabled={
            currentPage === 1
          }
          onClick={
            onPrevious
          }
          className="flex h-10 items-center gap-xs rounded-corner-md border border-border-secondary px-3 text-label-sm disabled:opacity-40"
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
          type="button"
          disabled={
            currentPage ===
            totalPages
          }
          onClick={
            onNext
          }
          className="flex h-10 items-center gap-xs rounded-corner-md border border-border-secondary px-3 text-label-sm disabled:opacity-40"
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