import {
  useState,
} from "react";

import {
  CheckCircle2,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Sheet,
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
      "pdf",

    title:
      "PDF Report",

    description:
      "Printable management and governance report.",

    icon:
      FileText,

    className:
      "bg-rose-50 text-rose-700",
  },

  {
    id:
      "xlsx",

    title:
      "Excel Workbook",

    description:
      "Multi-sheet workbook for deeper operational analysis.",

    icon:
      FileSpreadsheet,

    className:
      "bg-emerald-50 text-emerald-700",
  },

  {
    id:
      "csv",

    title:
      "CSV Dataset",

    description:
      "Portable clinic data for spreadsheets and analytics tools.",

    icon:
      Sheet,

    className:
      "bg-blue-50 text-blue-700",
  },
];

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

      <section className="rounded-[30px] bg-gradient-to-br from-[#ede9fe] via-[#f7f5ff] to-white p-6 sm:p-8">

        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">
          Reporting centre
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Export clinic analytics
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Generate operational reports from live clinic data in PDF, Excel or CSV format.
        </p>

      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Database
              size={18}
            />
          </div>

          <div>

            <p className="text-sm font-bold text-slate-950">
              Reporting period
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Choose how much clinic history should be included.
            </p>

          </div>

        </div>

        <div className="mt-5 flex flex-wrap gap-2">

          {RANGES.map(
            item => (
              <button
                key={
                  item.value
                }
                type="button"
                onClick={() =>
                  setRangeDays(
                    item.value
                  )
                }
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  rangeDays ===
                  item.value
                    ? "bg-[#6d28d9] text-white shadow-md shadow-violet-100"
                    : "border border-slate-200 bg-white text-slate-500 hover:border-violet-200"
                }`}
              >
                {
                  item.label
                }
              </button>
            )
          )}

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

      <div className="grid gap-5 md:grid-cols-3">

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
                className="flex min-h-[260px] flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.04)]"
              >

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.className}`}
                >
                  <Icon
                    size={21}
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {
                    item.title
                  }
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                  {
                    item.description
                  }
                </p>

                <button
                  type="button"
                  disabled={
                    Boolean(
                      generating
                    )
                  }
                  onClick={() =>
                    generate(
                      item.id
                    )
                  }
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6d28d9] px-4 py-3 text-xs font-bold text-white transition hover:bg-violet-800 disabled:opacity-50"
                >

                  <Download
                    size={15}
                  />

                  {busy
                    ? "Generating…"
                    : "Download"}

                </button>

              </article>
            );
          }
        )}

      </div>

    </div>
  );
}