import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  AlertCircle,
  Calendar,
  ChevronRight,
  FileText,
  Filter,
  Pill,
  RefreshCw,
  Search,
  Stethoscope,
} from "lucide-react";
import { Badge, Button } from "../../components/patient/chatbot/AstraCompat.jsx";
import { patientsApi } from "../../services/api/patients.js";

const filters = [
  {
    value: "all",
    label: "All records",
  },
  {
    value: "consultation",
    label: "Consultations",
  },
  {
    value: "laboratory",
    label: "Laboratory",
  },
  {
    value: "medication",
    label: "Medication",
  },
  {
    value: "observation",
    label: "Observations",
  },
];

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function iconForCategory(category) {
  const value = normalize(category);

  if (
    value.includes("consult") ||
    value.includes("clinical")
  ) {
    return Stethoscope;
  }

  if (
    value.includes("lab") ||
    value.includes("test")
  ) {
    return FileText;
  }

  if (value.includes("med")) {
    return Pill;
  }

  if (
    value.includes("observation") ||
    value.includes("vital")
  ) {
    return Activity;
  }

  return FileText;
}

function categoryForFilter(record) {
  const category = normalize(
    record?.category
  );

  const type = normalize(record?.type);

  const combined = `${category} ${type}`;

  if (combined.includes("consult")) {
    return "consultation";
  }

  if (
    combined.includes("lab") ||
    combined.includes("test")
  ) {
    return "laboratory";
  }

  if (combined.includes("med")) {
    return "medication";
  }

  if (
    combined.includes("observation") ||
    combined.includes("vital")
  ) {
    return "observation";
  }

  return category || type || "other";
}

function statusDetails(statusValue) {
  const status = normalize(statusValue);

  switch (status) {
    case "available":
    case "completed":
    case "final":
      return {
        label:
          statusValue || "Available",
        variant: "success",
      };

    case "pending":
    case "draft":
      return {
        label:
          statusValue || "Pending",
        variant: "warning",
      };

    default:
      return {
        label:
          statusValue || "Record",
        variant: "default",
      };
  }
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-md">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl animate-pulse"
        >
          <div className="flex gap-md">
            <div className="h-10 w-10 rounded-corner-full bg-border-secondary" />

            <div className="flex-1">
              <div className="mb-sm h-4 w-44 rounded bg-border-secondary" />
              <div className="mb-sm h-3 w-32 rounded bg-border-secondary" />
              <div className="h-3 w-56 rounded bg-border-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasSearch,
}) {
  return (
    <div className="rounded-corner-lg border border-border-secondary bg-surface-bg p-2xl text-center">
      <FileText
        size={28}
        className="mx-auto text-text-tertiary"
      />

      <h3 className="mt-md text-label font-semibold text-text-primary">
        {hasSearch
          ? "No records found"
          : "No health records yet"}
      </h3>

      <p className="mt-xs text-label-sm text-text-secondary">
        {hasSearch
          ? "Try changing your search or filter."
          : "Your clinical records will appear here when they are added by your healthcare team."}
      </p>
    </div>
  );
}

export default function RecordsPage() {
  const [records, setRecords] =
    useState([]);

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadRecords =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await patientsApi.getRecords();

        setRecords(
          Array.isArray(result)
            ? result
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load health records:",
          err
        );

        setRecords([]);

        setError(
          err?.message ||
            "We could not load your health records."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const filteredRecords =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return records.filter(
        (record) => {
          const matchesFilter =
            filter === "all" ||
            categoryForFilter(
              record
            ) === filter;

          if (!matchesFilter) {
            return false;
          }

          if (!query) {
            return true;
          }

          const searchable = [
            record.title,
            record.type,
            record.category,
            record.providerName,
            record.facility,
            record.summary,
            record.status,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            query
          );
        }
      );
    }, [
      records,
      filter,
      search,
    ]);

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-lg lg:mb-xl gap-md">
        <div>
          <h1 className="text-title text-text-primary">
            Health Records
          </h1>

          <p className="text-label-sm text-text-secondary mt-xs">
            {loading
              ? "Loading your clinical records..."
              : `${records.length} ${
                  records.length === 1
                    ? "record"
                    : "records"
                } on file`}
          </p>
        </div>

        <Button
          variant="subtle"
          iconStart={
            <RefreshCw size={15} />
          }
          onClick={loadRecords}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-lg flex items-start gap-md rounded-corner-lg border border-danger/20 bg-danger/10 p-md">
          <AlertCircle
            size={17}
            className="mt-0.5 flex-shrink-0 text-danger"
          />

          <div className="flex-1">
            <p className="text-label-sm text-text-primary">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadRecords
              }
              className="mt-xs text-label-sm text-brand-primary transition-opacity hover:opacity-70"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-lg lg:p-xl mb-lg">
        <div className="flex flex-col md:flex-row gap-md">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search health records"
              className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
            />
          </div>

          <div className="flex items-center gap-xs rounded-corner-md border border-border-secondary bg-white px-3">
            <Filter
              size={15}
              className="text-text-tertiary"
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value
                )
              }
              className="bg-transparent py-2.5 text-label-sm text-text-primary outline-none"
            >
              {filters.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : filteredRecords.length >
        0 ? (
        <div className="flex flex-col gap-md">
          {filteredRecords.map(
            (record) => {
              const Icon =
                iconForCategory(
                  record.category ||
                    record.type
                );

              const isSelected =
                selected ===
                record.id;

              const status =
                statusDetails(
                  record.status
                );

              return (
                <div
                  key={
                    record.id
                  }
                  className={`w-full rounded-corner-lg border bg-surface-bg transition ${
                    isSelected
                      ? "border-brand-primary"
                      : "border-border-secondary hover:border-border-primary"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelected(
                        isSelected
                          ? null
                          : record.id
                      )
                    }
                    className="w-full p-lg lg:p-xl text-left"
                  >
                    <div className="flex items-start justify-between gap-md">
                      <div className="flex min-w-0 flex-1 items-start gap-md">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-full bg-brand-tertiary">
                          <Icon
                            size={17}
                            className="text-brand-primary"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-sm">
                            <h3 className="text-label-sm font-semibold text-text-primary">
                              {record.title ||
                                "Health record"}
                            </h3>

                            {record.type && (
                              <Badge
                                label={
                                  record.type
                                }
                                variant="default"
                              />
                            )}

                            <Badge
                              label={
                                status.label
                              }
                              variant={
                                status.variant
                              }
                            />
                          </div>

                          <p className="mt-xs text-video-title text-text-secondary">
                            {record.providerName ||
                              "Healthcare provider"}
                          </p>

                          <div className="mt-sm flex flex-wrap items-center gap-md">
                            <div className="flex items-center gap-xs">
                              <Calendar
                                size={12}
                                className="text-text-tertiary"
                              />

                              <span className="text-video-title text-text-secondary">
                                {formatDate(
                                  record.recordDate
                                )}
                              </span>
                            </div>

                            {record.facility && (
                              <span className="text-video-title text-text-secondary">
                                {
                                  record.facility
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        size={17}
                        className={`shrink-0 text-text-tertiary transition-transform ${
                          isSelected
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isSelected && (
                    <div className="px-lg pb-lg lg:px-xl lg:pb-xl">
                      <div className="border-t border-border-secondary pt-lg">
                        <p className="text-video-title text-text-tertiary">
                          Clinical summary
                        </p>

                        <p className="mt-sm text-label-sm leading-6 text-text-primary">
                          {record.summary ||
                            "No clinical summary was recorded."}
                        </p>

                        {record.category && (
                          <div className="mt-lg">
                            <p className="text-video-title text-text-tertiary">
                              Category
                            </p>

                            <p className="mt-xs text-label-sm text-text-primary">
                              {
                                record.category
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      ) : (
        <EmptyState
          hasSearch={
            Boolean(
              search.trim()
            ) ||
            filter !== "all"
          }
        />
      )}

      <div className="h-20 lg:hidden" />
    </div>
  );
}