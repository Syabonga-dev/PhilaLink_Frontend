import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  LoaderCircle,
  Search,
  TableProperties,
} from "lucide-react";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

const REPORT_TYPES = [
  {
    value:
      "Patients",

    label:
      "Patients",

    description:
      "Patient registrations and account status.",
  },
  {
    value:
      "Appointments",

    label:
      "Appointments",

    description:
      "Appointments by type, provider, mode and status.",
  },
  {
    value:
      "Collections",

    label:
      "Collections",

    description:
      "Medication collection activity, including collected and missed collections.",
  },
  {
    value:
      "Medication Adherence",

    label:
      "Medication Adherence",

    description:
      "Medication doses recorded as taken or missed.",
  },
  {
    value:
      "Inventory",

    label:
      "Inventory",

    description:
      "Current clinic medication stock and low-stock items.",
  },
  {
    value:
      "Staff",

    label:
      "Staff",

    description:
      "Nurses and proxies registered at the clinic.",
  },
];

const DEFAULT_FILTERS = {
  reportType:
    "Appointments",

  dateFrom:
    dateInput(
      -29
    ),

  dateTo:
    dateInput(
      0
    ),

  search:
    "",

  status:
    "All",

  role:
    "All",

  provider:
    "All",

  appointmentType:
    "All",

  mode:
    "All",

  medication:
    "All",
};

function dateInput(
  offsetDays
) {
  const date =
    new Date();

  date.setDate(
    date.getDate() +
      offsetDays
  );

  return date
    .toISOString()
    .slice(
      0,
      10
    );
}

function formatCell(
  value,
  type
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (
    type === "date" ||
    type === "datetime"
  ) {
    const date =
      new Date(value);

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return type ===
        "date"
        ? date
            .toLocaleDateString(
              "en-ZA",
              {
                year:
                  "numeric",

                month:
                  "short",

                day:
                  "2-digit",
              }
            )
        : date
            .toLocaleString(
              "en-ZA",
              {
                year:
                  "numeric",

                month:
                  "short",

                day:
                  "2-digit",

                hour:
                  "2-digit",

                minute:
                  "2-digit",
              }
            );
    }
  }

  if (
    type === "number"
  ) {
    const numeric =
      Number(value);

    if (
      Number.isFinite(
        numeric
      )
    ) {
      return numeric
        .toLocaleString(
          "en-ZA"
        );
    }
  }

  return String(value);
}

function statusClass(
  value
) {
  const status =
    String(
      value || ""
    ).toLowerCase();

  if (
    status.includes(
      "completed"
    ) ||
    status.includes(
      "collected"
    ) ||
    status.includes(
      "confirmed"
    ) ||
    status.includes(
      "healthy"
    ) ||
    status.includes(
      "taken"
    ) ||
    status ===
      "active"
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (
    status.includes(
      "pending"
    ) ||
    status.includes(
      "scheduled"
    ) ||
    status.includes(
      "low stock"
    )
  ) {
    return "bg-amber-100 text-amber-800";
  }

  if (
    status.includes(
      "cancel"
    ) ||
    status.includes(
      "missed"
    ) ||
    status.includes(
      "inactive"
    ) ||
    status.includes(
      "overdue"
    )
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
}

function OptionSelect({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>

      <select
        value={
          value
        }
        onChange={
          event =>
            onChange(
              event.target
                .value
            )
        }
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
      >
        {(options?.length
          ? options
          : ["All"]
        ).map(
          option => (
            <option
              key={
                option
              }
              value={
                option
              }
            >
              {option}
            </option>
          )
        )}
      </select>
    </label>
  );
}

function SummaryCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.035)]">
      <p className="text-[9px] font-black uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>

      <div className="mt-3 h-1 w-10 rounded-full bg-[#14b8a6]" />
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
      <TableProperties
        size={32}
        className="mx-auto text-slate-300"
      />

      <p className="mt-3 text-sm font-black text-slate-800">
        No rows matched these filters
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Change the filters and apply them again.
      </p>
    </div>
  );
}

export default function AdminReportsPage() {
  const [
    filters,
    setFilters,
  ] =
    useState(
      DEFAULT_FILTERS
    );

  const [
    appliedFilters,
    setAppliedFilters,
  ] =
    useState(
      DEFAULT_FILTERS
    );

  const [
    preview,
    setPreview,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    downloading,
    setDownloading,
  ] =
    useState("");

  const reportDefinition =
    useMemo(
      () =>
        REPORT_TYPES.find(
          item =>
            item.value ===
            filters.reportType
        ) ||
        REPORT_TYPES[0],
      [
        filters.reportType,
      ]
    );

  const isInventory =
    filters.reportType ===
    "Inventory";

  const options =
    preview?.filterOptions ||
    {};

  function update(
    key,
    value
  ) {
    setFilters(
      current => ({
        ...current,
        [key]:
          value,
      })
    );
  }

  function resetContextFilters(
    reportType
  ) {
    setFilters(
      current => ({
        ...current,

        reportType,

        search:
          "",

        status:
          "All",

        role:
          "All",

        provider:
          "All",

        appointmentType:
          "All",

        mode:
          "All",

        medication:
          "All",
      })
    );
  }

  const loadPreview =
    useCallback(
      async (
        query
      ) => {
        try {
          setLoading(
            true
          );

          setError("");

          const data =
            await clinicAdminApi
              .previewReport(
                query
              );

          setPreview(
            data
          );
        } catch (
          loadError
        ) {
          setError(
            loadError?.message ||
            "Could not generate the report preview."
          );

          setPreview(
            null
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(
    () => {
      void loadPreview(
        appliedFilters
      );
    },
    [
      appliedFilters,
      loadPreview,
    ]
  );

  function applyFilters(
    event
  ) {
    event?.preventDefault();

    if (
      !isInventory &&
      filters.dateFrom &&
      filters.dateTo &&
      filters.dateFrom >
        filters.dateTo
    ) {
      setError(
        "The From date cannot be after the To date."
      );

      return;
    }

    setSuccess(
      ""
    );

    setAppliedFilters({
      ...filters,
    });
  }

  async function exportReport(
    format
  ) {
    try {
      setDownloading(
        format
      );

      setError("");

      setSuccess("");

      const fileName =
        await clinicAdminApi
          .downloadDynamicReport(
            appliedFilters,
            format
          );

      setSuccess(
        `${fileName} generated from the current filtered report.`
      );
    } catch (
      exportError
    ) {
      setError(
        exportError?.message ||
        "Could not export the report."
      );
    } finally {
      setDownloading(
        ""
      );
    }
  }

  const showStatus =
    [
      "Patients",
      "Appointments",
      "Collections",
      "Medication Adherence",
      "Inventory",
      "Staff",
    ].includes(
      filters.reportType
    );

  const showMedication =
    [
      "Collections",
      "Medication Adherence",
      "Inventory",
    ].includes(
      filters.reportType
    );

  const showAppointmentFilters =
    filters.reportType ===
    "Appointments";

  const showRole =
    filters.reportType ===
    "Staff";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f766e]">
            Admin / Reports
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Dynamic Report Builder
          </h1>

          <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
            Choose exactly what you want to report on, filter the live clinic data,
            preview the results in a table, then export that same filtered dataset to
            Excel or PDF.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={
              () =>
                exportReport(
                  "xlsx"
                )
            }
            disabled={
              downloading !==
                "" ||
              loading
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f766e] px-4 text-xs font-black text-white transition hover:bg-[#115e59] disabled:opacity-50"
          >
            {downloading ===
            "xlsx" ? (
              <LoaderCircle
                size={14}
                className="animate-spin"
              />
            ) : (
              <FileSpreadsheet
                size={14}
              />
            )}

            Export Excel
          </button>

          <button
            type="button"
            onClick={
              () =>
                exportReport(
                  "pdf"
                )
            }
            disabled={
              downloading !==
                "" ||
              loading
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f172a] px-4 text-xs font-black text-white transition hover:bg-[#1e293b] disabled:opacity-50"
          >
            {downloading ===
            "pdf" ? (
              <LoaderCircle
                size={14}
                className="animate-spin"
              />
            ) : (
              <FileText
                size={14}
              />
            )}

            Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle
            size={17}
            className="mt-0.5 shrink-0"
          />

          <span>
            {error}
          </span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2
            size={17}
            className="mt-0.5 shrink-0"
          />

          <span>
            {success}
          </span>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
        <div className="border-b border-slate-200 bg-[#f8fafc] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Filter
                size={16}
              />
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-950">
                Report filters
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                The table and exported files use the same applied filters.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={
            applyFilters
          }
          className="p-5"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                Report Type
              </span>

              <select
                value={
                  filters.reportType
                }
                onChange={
                  event =>
                    resetContextFilters(
                      event.target
                        .value
                    )
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#0f766e]"
              >
                {REPORT_TYPES.map(
                  item => (
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
            </label>

            {!isInventory && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    From
                  </span>

                  <input
                    type="date"
                    value={
                      filters.dateFrom
                    }
                    onChange={
                      event =>
                        update(
                          "dateFrom",
                          event.target
                            .value
                        )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#0f766e]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    To
                  </span>

                  <input
                    type="date"
                    value={
                      filters.dateTo
                    }
                    onChange={
                      event =>
                        update(
                          "dateTo",
                          event.target
                            .value
                        )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#0f766e]"
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                Search
              </span>

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={
                    filters.search
                  }
                  onChange={
                    event =>
                      update(
                        "search",
                        event.target
                          .value
                      )
                  }
                  placeholder="Patient, medication, staff..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-[#0f766e]"
                />
              </div>
            </label>

            {showStatus && (
              <OptionSelect
                label="Status"
                value={
                  filters.status
                }
                options={
                  options.status
                }
                onChange={
                  value =>
                    update(
                      "status",
                      value
                    )
                }
              />
            )}

            {showAppointmentFilters && (
              <>
                <OptionSelect
                  label="Appointment Type"
                  value={
                    filters.appointmentType
                  }
                  options={
                    options.appointmentType
                  }
                  onChange={
                    value =>
                      update(
                        "appointmentType",
                        value
                      )
                  }
                />

                <OptionSelect
                  label="Provider"
                  value={
                    filters.provider
                  }
                  options={
                    options.provider
                  }
                  onChange={
                    value =>
                      update(
                        "provider",
                        value
                      )
                  }
                />

                <OptionSelect
                  label="Mode"
                  value={
                    filters.mode
                  }
                  options={
                    options.mode
                  }
                  onChange={
                    value =>
                      update(
                        "mode",
                        value
                      )
                  }
                />
              </>
            )}

            {showMedication && (
              <OptionSelect
                label="Medication"
                value={
                  filters.medication
                }
                options={
                  options.medication
                }
                onChange={
                  value =>
                    update(
                      "medication",
                      value
                    )
                }
              />
            )}

            {showRole && (
              <OptionSelect
                label="Role"
                value={
                  filters.role
                }
                options={
                  options.role
                }
                onChange={
                  value =>
                    update(
                      "role",
                      value
                    )
                }
              />
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black text-slate-900">
                {reportDefinition.label}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {reportDefinition.description}
              </p>
            </div>

            <button
              type="submit"
              disabled={
                loading
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 text-xs font-black text-white transition hover:bg-[#115e59] disabled:opacity-50"
            >
              {loading ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Filter
                  size={14}
                />
              )}

              Apply filters
            </button>
          </div>
        </form>
      </section>

      {preview && (
        <>
          <section className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0f766e]">
                  Live preview
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  {preview.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {preview.clinicName} · Requested by{" "}
                  {preview.requestedBy}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-teal-100 bg-white px-3 py-2 text-[10px] font-bold text-slate-500">
                <CalendarRange
                  size={13}
                  className="text-[#0f766e]"
                />

                {preview.dateFrom &&
                preview.dateTo
                  ? `${new Date(
                      preview.dateFrom
                    ).toLocaleDateString(
                      "en-ZA"
                    )} – ${new Date(
                      preview.dateTo
                    ).toLocaleDateString(
                      "en-ZA"
                    )}`
                  : "Current-state report"}
              </div>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(preview.summary ||
              []).map(
              item => (
                <SummaryCard
                  key={
                    item.key
                  }
                  label={
                    item.label
                  }
                  value={
                    item.value
                  }
                />
              )
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <LoaderCircle
                size={28}
                className="animate-spin text-[#0f766e]"
              />
            </div>
          ) : (preview.rows ||
              []).length ===
            0 ? (
            <EmptyPreview />
          ) : (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
              <div className="flex flex-col gap-2 border-b border-slate-200 bg-[#fbfcfd] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-950">
                    Report contents
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Columns and rows change according to the selected report and filters.
                  </p>
                </div>

                <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-black text-teal-700">
                  {(preview.rows ||
                    []).length.toLocaleString(
                    "en-ZA"
                  )}{" "}
                  rows
                </span>
              </div>

              <div className="max-h-[620px] overflow-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-[#0f766e] text-white">
                    <tr>
                      {(preview.columns ||
                        []).map(
                        column => (
                          <th
                            key={
                              column.key
                            }
                            className="whitespace-nowrap px-4 py-3 text-[9px] font-black uppercase tracking-[0.1em]"
                          >
                            {column.label}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(preview.rows ||
                      []).map(
                      (
                        row,
                        rowIndex
                      ) => (
                        <tr
                          key={
                            `${preview.reportType}-${rowIndex}`
                          }
                          className={`transition hover:bg-teal-50/40 ${
                            rowIndex %
                              2 ===
                            0
                              ? "bg-white"
                              : "bg-[#f8fafc]"
                          }`}
                        >
                          {(preview.columns ||
                            []).map(
                            column => {
                              const value =
                                row[
                                  column
                                    .key
                                ];

                              return (
                                <td
                                  key={
                                    column.key
                                  }
                                  className="max-w-[320px] px-4 py-3 text-xs text-slate-600"
                                >
                                  {column.dataType ===
                                  "status" ? (
                                    <span
                                      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                                        value
                                      )}`}
                                    >
                                      {formatCell(
                                        value,
                                        column.dataType
                                      )}
                                    </span>
                                  ) : (
                                    <span
                                      className={
                                        column.dataType ===
                                        "number"
                                          ? "font-black text-slate-900"
                                          : "break-words"
                                      }
                                    >
                                      {formatCell(
                                        value,
                                        column.dataType
                                      )}
                                    </span>
                                  )}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={
                () =>
                  exportReport(
                    "xlsx"
                  )
              }
              disabled={
                downloading !==
                  "" ||
                loading
              }
              className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left transition hover:border-emerald-300 disabled:opacity-50"
            >
              <div>
                <p className="text-sm font-black text-emerald-900">
                  Export filtered Excel workbook
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Dashboard sheet + complete filterable data sheet with the current report contents.
                </p>
              </div>

              <Download
                size={20}
                className="shrink-0 text-emerald-700"
              />
            </button>

            <button
              type="button"
              onClick={
                () =>
                  exportReport(
                    "pdf"
                  )
              }
              disabled={
                downloading !==
                  "" ||
                loading
              }
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 disabled:opacity-50"
            >
              <div>
                <p className="text-sm font-black text-slate-900">
                  Export filtered official PDF
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Branded printable report with summary cards, table data and page numbering.
                </p>
              </div>

              <Download
                size={20}
                className="shrink-0 text-slate-700"
              />
            </button>
          </section>
        </>
      )}
    </div>
  );
}
