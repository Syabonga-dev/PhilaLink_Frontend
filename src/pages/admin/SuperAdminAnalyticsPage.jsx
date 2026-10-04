import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  BarChart3,
  Building2,
  CalendarCheck2,
  PackageCheck,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  DataTable,
  LoadingBlock,
  MetricStrip,
  Notice,
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
  SelectField,
  StatusBadge,
} from "../../components/admin/AdminPrimitives.jsx";

import {
  superAdminApi,
} from "../../services/api/superAdmin.js";

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

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

function number(
  value
) {
  return Number(
    value ||
      0
  )
    .toLocaleString(
      "en-ZA"
    );
}

function percent(
  value
) {
  const numeric =
    Number(
      value ||
        0
    );

  return `${numeric.toLocaleString(
    "en-ZA",
    {
      maximumFractionDigits:
        1,
    }
  )}%`;
}

function safeNumber(
  value
) {
  const numeric =
    Number(
      value
    );

  return Number.isFinite(
    numeric
  )
    ? Math.max(
        0,
        numeric
      )
    : 0;
}

function totalOf(
  rows
) {
  return rows.reduce(
    (
      total,
      row
    ) =>
      total +
      safeNumber(
        row.value
      ),
    0
  );
}

const DEFAULT_FILTERS = {
  clinicId:
    "",

  dateFrom:
    dateInput(
      -29
    ),

  dateTo:
    dateInput(
      0
    ),
};

const POPULATION_COLORS = [
  "#0f766e",
  "#0f172a",
  "#d97706",
];

const MEDICATION_COLORS = [
  "#0f766e",
  "#b45309",
];

/* ========================================================= */
/* PIE LEGEND                                                */
/* ========================================================= */

function PieLegend({
  rows,
}) {
  const total =
    totalOf(
      rows
    );

  return (
    <div className="space-y-2">

      {rows.map(
        (
          row,
          index
        ) => {
          const share =
            total >
            0
              ? (
                  safeNumber(
                    row.value
                  ) /
                  total
                ) *
                100
              : 0;

          return (
            <div
              key={
                row.name
              }
              className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0"
            >

              <div className="flex min-w-0 items-center gap-2">

                <span
                  className="h-2.5 w-2.5 shrink-0"
                  style={{
                    background:
                      row.color ||
                      "#64748b",
                  }}
                />

                <span className="truncate text-xs text-slate-600">
                  {row.name}
                </span>

              </div>

              <div className="shrink-0 text-right">

                <span className="text-xs font-semibold text-slate-900">
                  {number(
                    row.value
                  )}
                </span>

                <span className="ml-2 text-[10px] text-slate-400">
                  {percent(
                    share
                  )}
                </span>

              </div>

            </div>
          );
        }
      )}

    </div>
  );
}

/* ========================================================= */
/* PIE CARD                                                  */
/* ========================================================= */

function AnalyticsPie({
  title,
  description,
  data,
  colors,
  centerValue,
  centerLabel,
}) {
  const hasData =
    totalOf(
      data
    ) >
    0;

  const rows =
    data.map(
      (
        row,
        index
      ) => ({
        ...row,

        color:
          colors[
            index %
            colors.length
          ],
      })
    );

  return (
    <div className="border border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-5 py-4">

        <h3 className="text-sm font-semibold text-slate-950">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      <div className="p-5">

        {hasData ? (
          <>

            <div className="relative h-[205px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={
                      rows
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={
                      58
                    }
                    outerRadius={
                      82
                    }
                    paddingAngle={
                      2
                    }
                    stroke="none"
                  >

                    {rows.map(
                      (
                        row,
                        index
                      ) => (
                        <Cell
                          key={`${row.name}-${index}`}
                          fill={
                            row.color
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      number(
                        value
                      ),
                      "Count",
                    ]}
                  />

                </PieChart>

              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {number(
                    centerValue
                  )}
                </span>

                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                  {centerLabel}
                </span>

              </div>

            </div>

            <PieLegend
              rows={
                rows
              }
            />

          </>
        ) : (
          <div className="flex h-[270px] items-center justify-center text-center">

            <div>

              <p className="text-sm font-medium text-slate-700">
                No data available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Change the clinic or reporting period.
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

/* ========================================================= */
/* SMALL LINE CHART                                          */
/* ========================================================= */

function CollectionTrendCard({
  trend,
  collections,
}) {
  return (
    <div className="border border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-5 py-4">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="text-sm font-semibold text-slate-950">
              Collection trend
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Scheduled medication collection activity across the applied period.
            </p>

          </div>

          <div className="shrink-0 text-right">

            <p className="text-lg font-semibold tracking-[-0.03em]
