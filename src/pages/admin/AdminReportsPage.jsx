import {
  useState,
} from "react";

import {
  BarChart3,
  CheckCircle2,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  LockKeyhole,
  Sheet,
  TableProperties,
} from "lucide-react";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

const RANGES = [
  {
    value:
      7,
    label:
      "7 days",
  },
  {
    value:
      30,
    label:
      "30 days",
  },
  {
    value:
      90,
    label:
      "90 days",
  },
  {
    value:
      180,
    label:
      "6 months",
  },
  {
    value:
      365,
    label:
      "12 months",
  },
];

const FORMATS = [
  {
    id:
      "xlsx",

    title:
      "Excel Management Workbook",

    description:
      "Executive dashboard plus filterable raw-data sheets for appointments, collections, inventory, staff and new patients.",

    helper:
      "Best for analysis, formulas, filtering and further work.",

    icon:
      FileSpreadsheet,

    iconClass:
      "bg-emerald-50 text-emerald-700",

    buttonClass:
      "bg-[#0f766e] hover:bg-[#115e59]",
  },
  {
    id:
      "pdf",

    title:
      "Official PDF Report",

    description:
      "Print-ready clinic operations report with KPI summary, activity visuals, status analysis and paginated detail tables.",

    helper:
      "Best for sharing, printing and official records.",

    icon:
      FileText,

    iconClass:
      "bg-teal-50 text-teal-700",

    buttonClass:
      "bg-[#0f172a] hover:bg-[#1e293b]",
  },
  {
    id:
      "csv",

    title:
      "CSV Data Export",

    description:
      "Portable data-first export for external analysis tools and lightweight spreadsheet work.",

    helper:
      "Best when presentation is not required.",

    icon:
      Sheet,

    iconClass:
      "bg-sky-50 text-sky-700",

    buttonClass:
      "bg-slate-700 hover:bg-slate-800",
  },
];

function ReportPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="bg-[#0f766e] px-5 py-4 text-white">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-teal-100">
          PhilaLink
        </p>

        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-base font-black">
              Clinic Operations Report
            </h3>

            <p className="mt-0.5 text-[10px] text-teal-100">
              Executive management dashboard
            </p>
          </div>

          <div className="text-right text-[8px] leading-4 text-teal-100">
            <p>
              Reporting period
            </p>

            <p className="font-bold text-white">
              Selected range
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 bg-[#f8fafc] p-4">
        <div className="grid grid-cols-5 gap-2">
          {[
            [
              "Patients",
              "—",
            ],
            [
              "Appointments",
              "—",
            ],
            [
              "Collections",
              "—",
            ],
            [
              "Low stock",
              "—",
            ],
            [
              "New patients",
              "—",
            ],
          ].map(
            (
              item
            ) => (
              <div
                key={
                  item[0]
                }
                className="rounded-xl border border-slate-200 bg-white p-2.5"
              >
                <p className="truncate text-[6px] font-black uppercase tracking-wide text-slate-400">
                  {item[0]}
                </p>

                <p className="mt-1 text-lg font-black text-slate-900">
                  {item[1]}
                </p>

                <div className="mt-2 h-1 w-8 rounded-full bg-[#14b8a6]" />
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-[1.6fr_0.8fr] gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black text-slate-800">
                Monthly Activity
              </p>

              <BarChart3
                size={12}
                className="text-[#0f766e]"
              />
            </div>

            <div className="mt-3 flex h-20 items-end gap-2 border-b border-l border-slate-200 pl-2">
              {[
                26,
                44,
                36,
                62,
                48,
                74,
                55,
                82,
              ].map(
                (
                  height,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="flex flex-1 items-end justify-center gap-[2px]"
                  >
                    <div
                      className="w-[28%] rounded-t bg-[#0f766e]"
                      style={{
                        height:
                          `${height}%`,
                      }}
                    />

                    <div
                      className="w-[28%] rounded-t bg-[#14b8a6]"
                      style={{
                        height:
                          `${Math.max(
                            16,
                            height -
                              14
                          )}%`,
                      }}
                    />

                    <div
                      className="w-[28%] rounded-t bg-blue-500"
                      style={{
                        height:
                          `${Math.max(
                            12,
                            height -
                              28
                          )}%`,
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[8px] font-black text-slate-800">
              Status Distribution
            </p>

            <div className="mt-3 space-y-3">
              {[
                [
                  "Pending",
                  "78%",
                ],
                [
                  "Completed",
                  "54%",
                ],
                [
                  "Confirmed",
                  "42%",
                ],
                [
                  "Other",
                  "26%",
                ],
              ].map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item[0]
                    }
                  >
                    <div className="mb-1 flex justify-between text-[6px] font-semibold text-slate-400">
                      <span>
                        {item[0]}
                      </span>

                      <span>
                        {item[1]}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={
                          index % 2 ===
                          0
                            ? "h-full bg-[#0f766e]"
                            : "h-full bg-[#14b8a6]"
                        }
                        style={{
                          width:
                            item[1],
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-6 bg-[#0f766e] px-3 py-2 text-[6px] font-black uppercase tracking-wide text-white">
            <span>
              Patient
            </span>
            <span>
              Service
            </span>
            <span>
              Status
            </span>
            <span>
              Date
            </span>
            <span>
              Provider
            </span>
            <span>
              Clinic data
            </span>
          </div>

          {[1, 2, 3, 4].map(
            row => (
              <div
                key={
                  row
                }
                className={`grid grid-cols-6 px-3 py-2 text-[6px] text-slate-400 ${
                  row % 2 ===
                  0
                    ? "bg-teal-50/50"
                    : "bg-white"
                }`}
              >
                <span>
                  Live data
                </span>
                <span>
                  Report
                </span>
                <span>
                  Dynamic
                </span>
                <span>
                  Range
                </span>
                <span>
                  Staff
                </span>
                <span>
                  PhilaLink
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const [
    rangeDays,
    setRangeDays,
  ] =
    useState(
      30
    );

  const [
    generating,
    setGenerating,
  ] =
    useState(
      ""
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    success,
    setSuccess,
  ] =
    useState(
      ""
    );

  async function generate(
    format
  ) {
    try {
      setGenerating(
        format
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      const fileName =
        await clinicAdminApi
          .downloadReport({
            format,
            rangeDays,
          });

      setSuccess(
        `${fileName} generated successfully.`
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
        "Could not generate the report."
      );
    } finally {
      setGenerating(
        ""
      );
    }
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-white">
        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:p-8">
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0f766e]">
              Reporting Centre
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Professional clinic reports
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Export live PhilaLink clinic data as an executive Excel workbook,
              an official print-ready PDF, or a portable CSV dataset.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-white p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <BarChart3
                    size={16}
                  />
                </div>

                <div>
                  <p className="text-xs font-black text-slate-900">
                    Executive summary
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                    KPIs, activity trends, status analysis and stock alerts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-white p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <TableProperties
                    size={16}
                  />
                </div>

                <div>
                  <p className="text-xs font-black text-slate-900">
                    Detailed data
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                    Appointments, collections, inventory, staff and patients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ReportPreview />
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.035)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Database
                  size={17}
                />
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  Reporting period
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  The selected range is applied to all exported report sections.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {RANGES.map(
                item => (
                  <button
                    key={
                      item.value
                    }
                    type="button"
                    onClick={
                      () =>
                        setRangeDays(
                          item.value
                        )
                    }
                    className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                      rangeDays ===
                      item.value
                        ? "bg-[#0f766e] text-white shadow-md shadow-teal-100"
                        : "border border-slate-200 bg-white text-slate-500 hover:border-teal-200 hover:text-teal-700"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#f8fafc] px-3 py-2 text-[10px] font-semibold text-slate-500">
            <Filter
              size={13}
              className="text-[#0f766e]"
            />

            Current export range:{" "}
            <span className="font-black text-slate-800">
              {
                RANGES.find(
                  item =>
                    item.value ===
                    rangeDays
                )?.label
              }
            </span>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <CheckCircle2
            size={17}
          />

          {success}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {FORMATS.map(
          item => {
            const Icon =
              item.icon;

            const busy =
              generating ===
              item.id;

            return (
              <article
                key={
                  item.id
                }
                className="flex min-h-[300px] flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconClass}`}
                  >
                    <Icon
                      size={21}
                    />
                  </div>

                  {item.id !==
                    "csv" && (
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-teal-700">
                      Enhanced
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  {
                    item.title
                  }
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {
                    item.description
                  }
                </p>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f8fafc] p-3">
                  {item.id ===
                    "pdf" ? (
                    <LockKeyhole
                      size={14}
                      className="mt-0.5 shrink-0 text-[#0f766e]"
                    />
                  ) : (
                    <TableProperties
                      size={14}
                      className="mt-0.5 shrink-0 text-[#0f766e]"
                    />
                  )}

                  <p className="text-[10px] leading-4 text-slate-500">
                    {
                      item.helper
                    }
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    Boolean(
                      generating
                    )
                  }
                  onClick={
                    () =>
                      generate(
                        item.id
                      )
                  }
                  className={`mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black text-white transition disabled:opacity-50 ${item.buttonClass}`}
                >
                  <Download
                    size={15}
                  />

                  {busy
                    ? "Generating…"
                    : "Generate & download"}
                </button>
              </article>
            );
          }
        )}
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <FileSpreadsheet
                size={18}
              />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-950">
                Excel report structure
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Built for continued analysis after export.
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-xs text-slate-500">
            <li>
              • Executive dashboard with branded KPI cards and visual data bars
            </li>
            <li>
              • Separate raw-data worksheets with frozen headings and filters
            </li>
            <li>
              • Numeric values remain numeric for formulas and calculations
            </li>
            <li>
              • Totals and operational summary values are included
            </li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <FileText
                size={18}
              />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-950">
                PDF report structure
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Designed as an official fixed clinic report.
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-xs text-slate-500">
            <li>
              • Branded executive first page with KPIs and visual summaries
            </li>
            <li>
              • Report period, requested-by details and generated timestamp
            </li>
            <li>
              • Paginated detail tables for operational records
            </li>
            <li>
              • Consistent confidential footer with Page X of Y
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
