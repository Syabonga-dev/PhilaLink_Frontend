import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileBarChart,
  PackageCheck,
  RefreshCw,
  TrendingUp,
  UserPlus,
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
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

/* ========================================================= */
/* COLORS                                                    */
/* ========================================================= */

const COLORS = {
  teal:
    "#0f766e",

  tealLight:
    "#5eead4",

  violet:
    "#6d28d9",

  violetLight:
    "#c4b5fd",

  blue:
    "#2563eb",

  blueLight:
    "#93c5fd",

  amber:
    "#f59e0b",

  rose:
    "#e11d48",

  emerald:
    "#059669",

  slate:
    "#64748b",
};

const PIE_COLORS = [
  COLORS.violet,
  COLORS.teal,
  COLORS.blue,
  COLORS.amber,
  COLORS.rose,
  COLORS.emerald,
  COLORS.slate,
];

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function safeArray(
  value
) {
  return Array.isArray(
    value
  )
    ? value
    : [];
}

function number(
  value
) {
  return Number(
    value || 0
  ).toLocaleString(
    "en-ZA"
  );
}

function firstName(
  value
) {
  return String(
    value || "Administrator"
  )
    .trim()
    .split(
      /\s+/
    )[0];
}

function getGreeting() {
  const hour =
    new Date()
      .getHours();

  if (
    hour < 12
  ) {
    return "Good morning";
  }

  if (
    hour < 18
  ) {
    return "Good afternoon";
  }

  return "Good evening";
}

function formatDateTime(
  value
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString(
    "en-ZA",
    {
      day:
        "2-digit",

      month:
        "short",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  );
}

function monthName(
  year,
  month
) {
  return new Date(
    year,
    month,
    1
  ).toLocaleDateString(
    "en-ZA",
    {
      month:
        "long",

      year:
        "numeric",
    }
  );
}

/* ========================================================= */
/* TOOLTIP                                                   */
/* ========================================================= */

function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  return (
    <div className="min-w-[170px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur">

      {label && (
        <p className="mb-2 text-xs font-bold text-slate-900">
          {label}
        </p>
      )}

      <div className="space-y-1.5">

        {payload.map(
          (
            entry,
            index
          ) => (
            <div
              key={`${entry.dataKey}-${index}`}
              className="flex items-center justify-between gap-5 text-xs"
            >

              <div className="flex items-center gap-2">

                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      entry.color ||
                      entry.fill ||
                      entry.payload?.fill,
                  }}
                />

                <span className="text-slate-500">
                  {
                    entry.name
                  }
                </span>

              </div>

              <span className="font-bold text-slate-900">
                {number(
                  entry.value
                )}
              </span>

            </div>
          )
        )}

      </div>

    </div>
  );
}

/* ========================================================= */
/* MINI KPI                                                  */
/* ========================================================= */

function MiniKpi({
  label,
  value,
  detail,
  icon:
    Icon,
  accent =
    "violet",
}) {
  const accents = {
    violet:
      "bg-violet-50 text-violet-700",

    teal:
      "bg-teal-50 text-teal-700",

    blue:
      "bg-blue-50 text-blue-700",

    amber:
      "bg-amber-50 text-amber-700",

    rose:
      "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-[26px] font-bold tracking-tight text-slate-950">
            {number(
              value
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {
              detail
            }
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            accents[accent] ||
            accents.violet
          }`}
        >
          <Icon
            size={18}
          />
        </div>

      </div>

    </div>
  );
}

/* ========================================================= */
/* PERFORMANCE BAR CHART                                     */
/* ========================================================= */

function PerformanceBarChart({
  data,
}) {
  const chartData =
    safeArray(
      data
    );

  return (
    <div className="h-[205px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={
            chartData
          }
          margin={{
            top:
              10,

            left:
              -20,

            right:
              5,

            bottom:
              0,
          }}
          barGap={
            5
          }
        >

          <CartesianGrid
            vertical={
              false
            }
            stroke="#e9e7f1"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="period"
            axisLine={
              false
            }
            tickLine={
              false
            }
            tick={{
              fontSize:
                10,

              fill:
                "#94a3b8",
            }}
          />

          <YAxis
            allowDecimals={
              false
            }
            axisLine={
              false
            }
            tickLine={
              false
            }
            tick={{
              fontSize:
                10,

              fill:
                "#94a3b8",
            }}
          />

          <Tooltip
            cursor={{
              fill:
                "#f4f0ff",

              radius:
                12,
            }}
            content={
              <ChartTooltip />
            }
          />

          <Bar
            dataKey="appointments"
            name="Appointments"
            fill={
              COLORS.violet
            }
            radius={[
              8,
              8,
              3,
              3,
            ]}
            maxBarSize={
              24
            }
          />

          <Bar
            dataKey="collections"
            name="Collections"
            fill={
              COLORS.tealLight
            }
            radius={[
              8,
              8,
              3,
              3,
            ]}
            maxBarSize={
              24
            }
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

/* ========================================================= */
/* TREND LINE CHART                                          */
/* ========================================================= */

function TrendLineChart({
  data,
}) {
  return (
    <div className="h-[310px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
          data={
            safeArray(
              data
            )
          }
          margin={{
            top:
              10,

            right:
              20,

            left:
              -15,

            bottom:
              5,
          }}
        >

          <CartesianGrid
            vertical={
              false
            }
            stroke="#edf0f5"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="period"
            axisLine={
              false
            }
            tickLine={
              false
            }
            tick={{
              fontSize:
                10,

              fill:
                "#94a3b8",
            }}
          />

          <YAxis
            allowDecimals={
              false
            }
            axisLine={
              false
            }
            tickLine={
              false
            }
            tick={{
              fontSize:
                10,

              fill:
                "#94a3b8",
            }}
          />

          <Tooltip
            content={
              <ChartTooltip />
            }
          />

          <Legend
            iconType="circle"
            wrapperStyle={{
              fontSize:
                "11px",

              paddingTop:
                "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="appointments"
            name="Appointments"
            stroke={
              COLORS.violet
            }
            strokeWidth={
              3
            }
            dot={{
              r:
                3,

              fill:
                COLORS.violet,

              strokeWidth:
                0,
            }}
            activeDot={{
              r:
                6,
            }}
          />

          <Line
            type="monotone"
            dataKey="collections"
            name="Collections"
            stroke={
              COLORS.teal
            }
            strokeWidth={
              3
            }
            dot={{
              r:
                3,

              fill:
                COLORS.teal,

              strokeWidth:
                0,
            }}
            activeDot={{
              r:
                6,
            }}
          />

          <Line
            type="monotone"
            dataKey="newPatients"
            name="New patients"
            stroke={
              COLORS.amber
            }
            strokeWidth={
              2.5
            }
            dot={{
              r:
                3,

              fill:
                COLORS.amber,

              strokeWidth:
                0,
            }}
            activeDot={{
              r:
                6,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

/* ========================================================= */
/* STACKED BAR CHART                                         */
/* ========================================================= */

function CompletionChart({
  data,
}) {
  const chartData =
    useMemo(
      () =>
        safeArray(
          data
        ).map(
          item => {
            const appointments =
              Number(
                item.appointments ||
                0
              );

            const completedAppointments =
              Number(
                item.completedAppointments ||
                0
              );

            const collections =
              Number(
                item.collections ||
                0
              );

            const completedCollections =
              Number(
                item.completedCollections ||
                0
              );

            return {
              period:
                item.period,

              completedAppointments,

              openAppointments:
                Math.max(
                  appointments -
                    completedAppointments,
                  0
                ),

              completedCollections,

              openCollections:
                Math.max(
                  collections -
                    completedCollections,
                  0
                ),
            };
          }
        ),
      [
        data,
      ]
    );

  return (
    <div className="h-[310px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={
            chartData
          }
          margin={{
            top:
              10,

            right:
              10,

            left:
              -15,

            bottom:
              0,
          }}
        >

          <CartesianGrid
            vertical={
              false
            }
            stroke="#edf0f5"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="period"
            axisLine={
              false
            }
            tickLine={
              false
            }
            tick={{
              fontSize:
                10,

              fill:
                "#94a3b8",
            }}
          />

          <YAxis
            allowDecimals={
              false
            }
            axisLine={
              false
            }
            tickLine={
              false
            }
            tick={{
              fontSize:
                10,

              fill:
                "#94a3b8",
            }}
          />

          <Tooltip
            content={
              <ChartTooltip />
            }
          />

          <Legend
            iconType="circle"
            wrapperStyle={{
              fontSize:
                "10px",

              paddingTop:
                "12px",
            }}
          />

          <Bar
            dataKey="completedAppointments"
            name="Appointments completed"
            stackId="appointments"
            fill={
              COLORS.violet
            }
            maxBarSize={
              24
            }
          />

          <Bar
            dataKey="openAppointments"
            name="Appointments open"
            stackId="appointments"
            fill={
              COLORS.violetLight
            }
            radius={[
              6,
              6,
              0,
              0,
            ]}
            maxBarSize={
              24
            }
          />

          <Bar
            dataKey="completedCollections"
            name="Collections completed"
            stackId="collections"
            fill={
              COLORS.teal
            }
            maxBarSize={
              24
            }
          />

          <Bar
            dataKey="openCollections"
            name="Collections open"
            stackId="collections"
            fill={
              COLORS.tealLight
            }
            radius={[
              6,
              6,
              0,
              0,
            ]}
            maxBarSize={
              24
            }
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

/* ========================================================= */
/* DONUT                                                     */
/* ========================================================= */

function DonutChart({
  data,
  centerLabel,
}) {
  const values =
    safeArray(
      data
    ).filter(
      item =>
        Number(
          item.count ||
          0
        ) >
        0
    );

  const total =
    values.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.count ||
          0
        ),
      0
    );

  if (
    values.length ===
    0
  ) {
    return (
      <div className="flex h-[265px] items-center justify-center text-sm text-slate-400">
        No activity yet
      </div>
    );
  }

  return (
    <div className="relative h-[285px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={
              values
            }
            nameKey="status"
            dataKey="count"
            cx="50%"
            cy="44%"
            innerRadius={
              60
            }
            outerRadius={
              88
            }
            paddingAngle={
              4
            }
            cornerRadius={
              8
            }
          >

            {values.map(
              (
                item,
                index
              ) => (
                <Cell
                  key={`${item.status}-${index}`}
                  fill={
                    PIE_COLORS[
                      index %
                      PIE_COLORS.length
                    ]
                  }
                />
              )
            )}

          </Pie>

          <Tooltip
            content={
              <ChartTooltip />
            }
          />

          <Legend
            iconType="circle"
            verticalAlign="bottom"
            wrapperStyle={{
              fontSize:
                "10px",
            }}
          />

        </PieChart>

      </ResponsiveContainer>

      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 text-center">

        <p className="text-2xl font-bold text-slate-950">
          {
            number(
              total
            )
          }
        </p>

        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {
            centerLabel
          }
        </p>

      </div>

    </div>
  );
}

/* ========================================================= */
/* CALENDAR                                                  */
/* ========================================================= */

function CalendarCard({
  kpis,
}) {
  const now =
    new Date();

  const [
    cursor,
    setCursor,
  ] =
    useState(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );

  const year =
    cursor.getFullYear();

  const month =
    cursor.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  /*
   * Calendar starts Monday.
   * JS Sunday = 0.
   */
  const leadingDays =
    firstDay ===
    0
      ? 6
      : firstDay - 1;

  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const cells = [
    ...Array(
      leadingDays
    ).fill(
      null
    ),

    ...Array.from(
      {
        length:
          days,
      },
      (
        _,
        index
      ) =>
        index + 1
    ),
  ];

  while (
    cells.length %
      7 !==
    0
  ) {
    cells.push(
      null
    );
  }

  const isCurrentMonth =
    year ===
      now.getFullYear() &&
    month ===
      now.getMonth();

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Clinic calendar
          </p>

          <h3 className="mt-1 text-base font-bold text-slate-950">
            {
              monthName(
                year,
                month
              )
            }
          </h3>

        </div>

        <div className="flex gap-1">

          <button
            type="button"
            onClick={() =>
              setCursor(
                new Date(
                  year,
                  month - 1,
                  1
                )
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft
              size={17}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              setCursor(
                new Date(
                  year,
                  month + 1,
                  1
                )
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <ChevronRight
              size={17}
            />
          </button>

        </div>

      </div>

      <div className="mt-5 grid grid-cols-7 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">

        {[
          "M",
          "T",
          "W",
          "T",
          "F",
          "S",
          "S",
        ].map(
          (
            day,
            index
          ) => (
            <div
              key={`${day}-${index}`}
              className="py-2"
            >
              {day}
            </div>
          )
        )}

      </div>

      <div className="grid grid-cols-7 gap-1">

        {cells.map(
          (
            day,
            index
          ) => {
            const today =
              Boolean(
                day
              ) &&
              isCurrentMonth &&
              day ===
                now.getDate();

            return (
              <div
                key={
                  index
                }
                className={`relative flex aspect-square items-center justify-center rounded-xl text-[11px] font-semibold ${
                  day
                    ? today
                      ? "bg-[#6d28d9] text-white shadow-lg shadow-violet-200"
                      : "text-slate-600 hover:bg-violet-50"
                    : ""
                }`}
              >
                {day}

                {today &&
                  Number(
                    kpis?.appointmentsToday ||
                    0
                  ) >
                    0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-white bg-[#5eead4]" />
                )}

              </div>
            );
          }
        )}

      </div>

      {/* TODAY SUMMARY */}

      <div className="mt-5 rounded-[20px] bg-[#f7f5ff] p-4">

        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-500">
          Today
        </p>

        <div className="mt-3 space-y-3">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-violet-700">
                <CalendarDays
                  size={15}
                />
              </div>

              <div>

                <p className="text-xs font-bold text-slate-900">
                  Appointments
                </p>

                <p className="text-[10px] text-slate-400">
                  Clinic schedule
                </p>

              </div>

            </div>

            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-violet-700">
              {
                kpis?.appointmentsToday ||
                0
              }
            </span>

          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-teal-700">
                <PackageCheck
                  size={15}
                />
              </div>

              <div>

                <p className="text-xs font-bold text-slate-900">
                  Collections
                </p>

                <p className="text-[10px] text-slate-400">
                  Due today
                </p>

              </div>

            </div>

            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-teal-700">
              {
                kpis?.collectionsDueToday ||
                0
              }
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}

/* ========================================================= */
/* RECENT ACTIVITY                                           */
/* ========================================================= */

function RecentActivity({
  data,
}) {
  const rows =
    safeArray(
      data
    );

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Governance
          </p>

          <h3 className="mt-1 text-base font-bold text-slate-950">
            Recent activity
          </h3>

        </div>

        <Link
          to="/admin/audit"
          className="text-[11px] font-bold text-violet-700 hover:underline"
        >
          View all
        </Link>

      </div>

      <div className="mt-4 divide-y divide-slate-100">

        {rows.length >
        0 ? (
          rows
            .slice(
              0,
              5
            )
            .map(
              item => (
                <div
                  key={
                    item.id
                  }
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">

                    <Clock3
                      size={14}
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-xs font-bold text-slate-900">
                      {
                        item.action
                      }
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {
                        item.performedBy
                      }{" "}
                      ·{" "}
                      {
                        formatDateTime(
                          item.timestamp
                        )
                      }
                    </p>

                    {item.details && (
                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                        {
                          item.details
                        }
                      </p>
                    )}

                  </div>

                </div>
              )
            )
        ) : (
          <p className="py-7 text-center text-xs text-slate-400">
            No recent activity
          </p>
        )}

      </div>

    </section>
  );
}

/* ========================================================= */
/* LOW STOCK                                                 */
/* ========================================================= */

function LowStock({
  data,
}) {
  const items =
    safeArray(
      data
    );

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Inventory
          </p>

          <h3 className="mt-1 text-base font-bold text-slate-950">
            Stock alerts
          </h3>

        </div>

        <Link
          to="/admin/inventory"
          className="text-[11px] font-bold text-violet-700 hover:underline"
        >
          Manage
        </Link>

      </div>

      <div className="mt-4 space-y-2.5">

        {items.length >
        0 ? (
          items
            .slice(
              0,
              5
            )
            .map(
              item => (
                <div
                  key={
                    item.id
                  }
                  className="flex items-center justify-between gap-3 rounded-2xl bg-rose-50/70 px-3 py-2.5"
                >

                  <div className="min-w-0">

                    <p className="truncate text-xs font-bold text-slate-900">
                      {
                        item.medicationName
                      }{" "}
                      {
                        item.strength
                      }
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Reorder at {
                        item.reorderLevel
                      }{" "}
                      {
                        item.unit
                      }
                    </p>

                  </div>

                  <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-rose-700">
                    {
                      item.quantityOnHand
                    }{" "}
                    left
                  </span>

                </div>
              )
            )
        ) : (
          <div className="rounded-2xl bg-emerald-50 p-5 text-center">

            <CheckCircle2
              size={20}
              className="mx-auto text-emerald-600"
            />

            <p className="mt-2 text-xs font-bold text-emerald-800">
              Inventory healthy
            </p>

          </div>
        )}

      </div>

    </section>
  );
}

/* ========================================================= */
/* SUPER ADMIN                                               */
/* ========================================================= */

function SuperAdminDashboard() {
  const [
    data,
    setData,
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

  useEffect(
    () => {
      let active =
        true;

      adminApi
        .getDashboard()
        .then(
          result => {
            if (
              active
            ) {
              setData(
                result
              );
            }
          }
        )
        .catch(
          err => {
            if (
              active
            ) {
              setError(
                err?.message ||
                "Unable to load administration analytics."
              );
            }
          }
        )
        .finally(
          () => {
            if (
              active
            ) {
              setLoading(
                false
              );
            }
          }
        );

      return () => {
        active =
          false;
      };
    },
    []
  );

  if (loading) {
    return (
      <LoadingPanel />
    );
  }

  if (error) {
    return (
      <ErrorPanel
        message={
          error
        }
      />
    );
  }

  return (
    <div className="space-y-5">

      <section className="rounded-[30px] bg-gradient-to-br from-violet-100 via-[#f5f2ff] to-white p-7">

        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">
          PhilaLink
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          System overview
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          National user and service administration.
        </p>

      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MiniKpi
          label="Patients"
          value={
            data?.totalPatients
          }
          detail={`${data?.activePatients || 0} active`}
          icon={
            Users
          }
        />

        <MiniKpi
          label="Nurses"
          value={
            data?.totalNurses
          }
          detail={`${data?.activeNurses || 0} active`}
          icon={
            BarChart3
          }
          accent="teal"
        />

        <MiniKpi
          label="Proxies"
          value={
            data?.totalProxies
          }
          detail={`${data?.activeProxies || 0} active`}
          icon={
            Users
          }
          accent="blue"
        />

        <MiniKpi
          label="Proxy links"
          value={
            data?.totalProxyLinks
          }
          detail="Active links"
          icon={
            TrendingUp
          }
          accent="amber"
        />

      </div>

    </div>
  );
}

/* ========================================================= */
/* STATES                                                    */
/* ========================================================= */

function LoadingPanel() {
  return (
    <div className="flex min-h-[460px] items-center justify-center rounded-[30px] border border-slate-200 bg-white">

      <div className="text-center">

        <RefreshCw
          size={25}
          className="mx-auto animate-spin text-violet-600"
        />

        <p className="mt-3 text-sm font-medium text-slate-500">
          Loading clinic analytics…
        </p>

      </div>

    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}) {
  return (
    <div className="rounded-[24px] border border-red-200 bg-red-50 p-6">

      <div className="flex items-start gap-3">

        <AlertTriangle
          size={20}
          className="mt-0.5 shrink-0 text-red-600"
        />

        <div>

          <p className="font-bold text-red-900">
            Analytics unavailable
          </p>

          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={
                onRetry
              }
              className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-xs font-bold text-white"
            >
              Try again
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

/* ========================================================= */
/* DASHBOARD                                                 */
/* ========================================================= */

export default function AdminDashboard() {
  const {
    role,
    user,
  } =
    useAuth();

  const [
    data,
    setData,
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

  const load =
    useCallback(
      async () => {
        if (
          role !==
          "ClinicAdmin"
        ) {
          return;
        }

        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const result =
            await clinicAdminApi
              .getAnalytics(
                6
              );

          setData(
            result
          );
        } catch (
          err
        ) {
          setError(
            err?.message ||
            "Unable to load clinic analytics."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        role,
      ]
    );

  useEffect(
    () => {
      void load();
    },
    [
      load,
    ]
  );

  const completionRate =
    useMemo(
      () => {
        const rows =
          safeArray(
            data?.monthlyActivity
          );

        if (
          rows.length ===
          0
        ) {
          return 0;
        }

        const current =
          rows[
            rows.length - 1
          ];

        const total =
          Number(
            current.appointments ||
            0
          ) +
          Number(
            current.collections ||
            0
          );

        const completed =
          Number(
            current.completedAppointments ||
            0
          ) +
          Number(
            current.completedCollections ||
            0
          );

        if (
          total <= 0
        ) {
          return 0;
        }

        return Math.min(
          100,
          Math.round(
            completed /
              total *
              100
          )
        );
      },
      [
        data,
      ]
    );

  if (
    role ===
    "SuperAdmin"
  ) {
    return (
      <SuperAdminDashboard />
    );
  }

  if (loading) {
    return (
      <LoadingPanel />
    );
  }

  if (error) {
    return (
      <ErrorPanel
        message={
          error
        }
        onRetry={
          load
        }
      />
    );
  }

  const kpis =
    data?.kpis || {};

  const displayName =
    data?.adminName ||
    user?.fullName ||
    "Administrator";

  return (
    <div className="space-y-5">

      {/* =================================================== */}
      {/* TOP GRID                                            */}
      {/* =================================================== */}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_360px]">

        {/* PERFORMANCE CARD */}

        <section className="overflow-hidden rounded-[30px] border border-violet-100 bg-gradient-to-br from-[#f0ebff] via-[#f7f4ff] to-white p-5 shadow-[0_18px_55px_rgba(109,40,217,0.08)] sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-[11px] font-medium text-slate-500">
                {getGreeting()},{" "}
                <span className="font-bold text-slate-950">
                  {
                    firstName(
                      displayName
                    )
                  }
                </span>
              </p>

              <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Your clinic is running at{" "}
                <span className="text-[#6d28d9]">
                  {
                    completionRate
                  }%
                </span>{" "}
                service completion
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                  {
                    kpis.collectedThisMonth ||
                    0
                  }{" "}
                  collections completed
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-violet-700 shadow-sm">
                  {
                    kpis.newPatientsThisMonth ||
                    0
                  }{" "}
                  new patients
                </span>

              </div>

            </div>

            <Link
              to="/admin/reports"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl bg-[#6d28d9] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
            >

              <FileBarChart
                size={15}
              />

              Reports

            </Link>

          </div>

          <div className="mt-5 rounded-[24px] bg-white/65 p-3 backdrop-blur">

            <PerformanceBarChart
              data={
                data?.monthlyActivity
              }
            />

          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">

            <span>
              Monthly appointments and medication collections
            </span>

            <button
              type="button"
              onClick={
                load
              }
              className="inline-flex items-center gap-1 font-bold text-violet-700"
            >
              <RefreshCw
                size={12}
              />
              Refresh
            </button>

          </div>

        </section>

        {/* CALENDAR */}

        <CalendarCard
          kpis={
            kpis
          }
        />

      </div>

      {/* =================================================== */}
      {/* KPIS                                                */}
      {/* =================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <MiniKpi
          label="Active patients"
          value={
            kpis.activePatients
          }
          detail={`${kpis.newPatientsThisMonth || 0} added this month`}
          icon={
            Users
          }
        />

        <MiniKpi
          label="Appointments"
          value={
            kpis.appointmentsToday
          }
          detail={`${kpis.pendingAppointments || 0} awaiting action`}
          icon={
            CalendarDays
          }
          accent="blue"
        />

        <MiniKpi
          label="Collections due"
          value={
            kpis.collectionsDueToday
          }
          detail={`${kpis.overdueCollections || 0} overdue`}
          icon={
            PackageCheck
          }
          accent={
            kpis.overdueCollections >
            0
              ? "rose"
              : "teal"
          }
        />

        <MiniKpi
          label="Low stock"
          value={
            kpis.lowStockItems
          }
          detail="At or below reorder level"
          icon={
            Boxes
          }
          accent={
            kpis.lowStockItems >
            0
              ? "amber"
              : "teal"
          }
        />

      </div>

      {/* =================================================== */}
      {/* LINE + DONUT                                        */}
      {/* =================================================== */}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">
                Analytics
              </p>

              <h3 className="mt-1 text-base font-bold text-slate-950">
                Clinic activity trend
              </h3>

              <p className="mt-1 text-[11px] text-slate-400">
                Hover over the chart to inspect exact values
              </p>

            </div>

            <TrendingUp
              size={19}
              className="text-violet-600"
            />

          </div>

          <div className="mt-3">

            <TrendLineChart
              data={
                data?.monthlyActivity
              }
            />

          </div>

        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">
            Appointment flow
          </p>

          <h3 className="mt-1 text-base font-bold text-slate-950">
            Status distribution
          </h3>

          <DonutChart
            data={
              data?.appointmentStatuses
            }
            centerLabel="Appointments"
          />

        </section>

      </div>

      {/* =================================================== */}
      {/* STACKED + COLLECTION DONUT                          */}
      {/* =================================================== */}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-600">
              Completion performance
            </p>

            <h3 className="mt-1 text-base font-bold text-slate-950">
              Completed vs outstanding work
            </h3>

            <p className="mt-1 text-[11px] text-slate-400">
              Appointments and medication collections by month
            </p>

          </div>

          <div className="mt-3">

            <CompletionChart
              data={
                data?.monthlyActivity
              }
            />

          </div>

        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-600">
            Medication operations
          </p>

          <h3 className="mt-1 text-base font-bold text-slate-950">
            Collection status
          </h3>

          <DonutChart
            data={
              data?.collectionStatuses
            }
            centerLabel="Collections"
          />

        </section>

      </div>

      {/* =================================================== */}
      {/* ACTIVITY / STOCK / QUICK                            */}
      {/* =================================================== */}

      <div className="grid gap-5 lg:grid-cols-3">

        <RecentActivity
          data={
            data?.recentActivity
          }
        />

        <LowStock
          data={
            data?.lowStockItems
          }
        />

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Workforce
          </p>

          <h3 className="mt-1 text-base font-bold text-slate-950">
            Clinic team
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3">

            <div className="rounded-[20px] bg-violet-50 p-4">

              <p className="text-2xl font-bold text-violet-800">
                {
                  kpis.activeNurses ||
                  0
                }
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-violet-500">
                Nurses
              </p>

            </div>

            <div className="rounded-[20px] bg-teal-50 p-4">

              <p className="text-2xl font-bold text-teal-800">
                {
                  kpis.activeProxies ||
                  0
                }
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-teal-500">
                Proxies
              </p>

            </div>

          </div>

          <div className="mt-4 space-y-2">

            <Link
              to="/admin/register-staff"
              className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
            >

              <span className="flex items-center gap-2">
                <UserPlus
                  size={15}
                />
                Register staff
              </span>

              <ArrowUpRight
                size={14}
              />

            </Link>

            <Link
              to="/admin/staff"
              className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
            >

              <span className="flex items-center gap-2">
                <Users
                  size={15}
                />
                Manage staff
              </span>

              <ArrowUpRight
                size={14}
              />

            </Link>

            <Link
              to="/admin/reports"
              className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
            >

              <span className="flex items-center gap-2">
                <FileBarChart
                  size={15}
                />
                Generate report
              </span>

              <ArrowUpRight
                size={14}
              />

            </Link>

          </div>

        </section>

      </div>

    </div>
  );
}