import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AlertCircle,
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
} from "./proxyUtils.jsx";

export default function ProxyPatientsPage() {
  const navigate =
    useNavigate();

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
  ] = useState("all");

  const [
    sort,
    setSort,
  ] = useState(
    "collection"
  );

  const loadCare =
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
              .getCare();

          setCare(
            result || {
              patients:
                [],
            }
          );
        } catch (err) {
          console.error(
            "Failed to load proxy patients:",
            err
          );

          setError(
            err?.message ||
              "We could not load your linked patients."
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
    loadCare();
  }, [
    loadCare,
  ]);

  const patients =
    Array.isArray(
      care?.patients
    )
      ? care.patients
      : [];

  const clinics =
    useMemo(
      () =>
        Array.from(
          new Set(
            patients
              .map(
                (
                  patient
                ) =>
                  patient.clinicName
              )
              .filter(
                Boolean
              )
          )
        ).sort(),
      [
        patients,
      ]
    );

  const filteredPatients =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        const result =
          patients.filter(
            (
              patient
            ) => {
              const matchesSearch =
                !term ||
                [
                  patient.patientName,
                  patient.patientNumber,
                  patient.clinicName,
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

              const matchesClinic =
                clinic ===
                  "all" ||
                patient.clinicName ===
                  clinic;

              const normalizedStatus =
                String(
                  patient.collectionStatus ||
                    "none"
                ).toLowerCase();

              const matchesStatus =
                status ===
                  "all" ||
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
          (
            a,
            b
          ) => {
            if (
              sort ===
              "name"
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
              sort ===
              "linked"
            ) {
              return (
                (parseDate(
                  b.assignedAt
                )?.getTime() ||
                  0) -
                (parseDate(
                  a.assignedAt
                )?.getTime() ||
                  0)
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
      },
      [
        patients,
        search,
        clinic,
        status,
        sort,
      ]
    );

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            Patients
          </h1>

          <p className="mt-xs text-label-sm text-text-secondary">
            Patients currently linked to your proxy account
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadCare
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
        <div className="grid grid-cols-1 gap-md xl:grid-cols-[minmax(260px,1fr)_210px_180px_180px]">
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
              placeholder="Search patient, number or clinic"
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

          <FilterSelect
            value={
              clinic
            }
            onChange={
              setClinic
            }
          >
            <option value="all">
              All clinics
            </option>

            {clinics.map(
              (
                name
              ) => (
                <option
                  key={
                    name
                  }
                  value={
                    name
                  }
                >
                  {name}
                </option>
              )
            )}
          </FilterSelect>

          <FilterSelect
            value={
              status
            }
            onChange={
              setStatus
            }
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
          </FilterSelect>

          <FilterSelect
            value={
              sort
            }
            onChange={
              setSort
            }
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
          </FilterSelect>
        </div>
      </section>

      <section className="rounded-corner-lg border border-border-secondary bg-surface-bg">
        <div className="flex items-center justify-between gap-md border-b border-border-secondary p-lg lg:px-xl">
          <div className="flex items-center gap-sm">
            <Users
              size={
                16
              }
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
        </div>

        {loading ? (
          <div className="px-lg py-2xl text-center">
            <p className="text-label-sm text-text-secondary">
              Loading patients...
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
                    loadCare
                  }
                  className="mt-xs text-label-sm text-brand-primary"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : filteredPatients.length ===
          0 ? (
          <div className="px-lg py-2xl text-center">
            <Users
              size={
                28
              }
              className="mx-auto text-text-tertiary"
            />

            <p className="mt-md text-label-sm font-medium text-text-primary">
              No patients found
            </p>

            <p className="mt-xs text-video-title text-text-secondary">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1060px] w-full">
              <thead className="bg-[#f8fafc]">
                <tr className="border-b border-border-secondary">
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
                  <TableHead align="right">
                    Action
                  </TableHead>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-secondary">
                {filteredPatients.map(
                  (
                    patient
                  ) => (
                    <tr
                      key={
                        patient.proxyLinkId ||
                        patient.patientId
                      }
                      className="transition hover:bg-[#f8fafc]"
                    >
                      <TableCell strong>
                        {patient.patientName ||
                          "Patient"}
                      </TableCell>

                      <TableCell>
                        {
                          patient.patientNumber ||
                          "—"
                        }
                      </TableCell>

                      <TableCell>
                        {
                          patient.clinicName ||
                          "Not assigned"
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

                      <TableCell align="right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/proxy/collections?patientId=${patient.patientId}`
                            )
                          }
                          className="text-label-sm font-medium text-brand-primary transition-opacity hover:opacity-70"
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
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}) {
  return (
    <select
      value={
        value
      }
      onChange={(
        event
      ) =>
        onChange(
          event.target.value
        )
      }
      className="h-11 rounded-corner-md border border-border-secondary bg-white px-3 text-label-sm text-text-secondary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
    >
      {children}
    </select>
  );
}

function TableHead({
  children,
  align = "left",
}) {
  return (
    <th
      className={`px-lg py-md text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary lg:px-xl ${
        align ===
        "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  align = "left",
  strong = false,
}) {
  return (
    <td
      className={`whitespace-nowrap px-lg py-md text-label-sm lg:px-xl ${
        strong
          ? "font-medium text-text-primary"
          : "text-text-secondary"
      } ${
        align ===
        "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </td>
  );
}
