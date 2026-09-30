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
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  FileBarChart,
  Filter,
  PackageCheck,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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

const COLORS = [
  "#0f766e",
  "#14b8a6",
  "#0f172a",
  "#f59e0b",
  "#059669",
  "#64748b",
  "#dc2626",
];

function safeArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

function number(value) {
  return Number(value || 0)
    .toLocaleString("en-ZA");
}

function percentage(value) {
  return `${Math.max(
    0,
    Math.min(
      100,
      Math.round(
        Number(value || 0)
      )
    )
  )}%`;
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

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
    <div className="min-w-[170px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
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
                      entry.fill,
                  }}
                />

                <span className="text-slate-500">
                  {entry.name}
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

function KpiCard({
  label,
  value,
  helper,
  icon:
    Icon,
  tone =
    "teal",
  progress,
}) {
  const tones = {
    teal:
      "bg-teal-50 text-teal-700",
    emerald:
      "bg-emerald-50 text-emerald-700",
    amber:
      "bg-amber-50 text-amber-700",
    slate:
      "bg-slate-100 text-slate-700",
    red:
      "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-[28px] font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {helper}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            tones[tone] ||
            tones.teal
          }`}
        >
          <Icon
            size={17}
          />
        </div>
      </div>

      {progress != null && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#0f766e]"
            style={{
              width:
                percentage(
                  progress
                ),
            }}
          />
        </div>
      )}
    </div>
  );
}

function ActivityChart({
  rows,
  activity,
}) {
  const showAppointments =
    activity ===
      "All" ||
    activity ===
      "Appointments";

  const showCollections =
    activity ===
      "All" ||
    activity ===
      "Collections";

  return (
    <div className="h-[330px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={
            safeArray(
              rows
            )
          }
          margin={{
            top:
              14,

            right:
              16,

            left:
              -18,

            bottom:
              0,
          }}
          barGap={8}
        >
          <CartesianGrid
            vertical={false}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize:
                10,

              fill:
                "#64748b",
            }}
          />

          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
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
                "#f0fdfa",
            }}
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
                "10px",
            }}
          />

          {showAppointments && (
            <Bar
              dataKey="appointments"
              name="Appointments"
              fill="#0f766e"
              radius={[
                7,
                7,
                2,
                2,
              ]}
              maxBarSize={34}
            />
          )}

          {showCollections && (
            <Bar
              dataKey="collections"
              name="Collections"
              fill="#14b8a6"
              radius={[
                7,
                7,
                2,
                2,
              ]}
              maxBarSize={34}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusDonut({
  title,
  subtitle,
  data,
}) {
  const rows =
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
    rows.reduce(
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

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-black text-slate-950">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {subtitle}
        </p>
      </div>

      {rows.length ===
      0 ? (
        <div className="flex h-[220px] items-center justify-center text-xs text-slate-400">
          No status data yet
        </div>
      ) : (
        <>
          <div className="relative h-[210px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={
                    rows
                  }
                  nameKey="status"
                  dataKey="count"
                  cx="38%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  cornerRadius={6}
                >
                  {rows.map(
                    (
                      item,
                      index
                    ) => (
                      <Cell
                        key={`${item.status}-${index}`}
                        fill={
                          COLORS[
                            index %
                            COLORS.length
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
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Total
              </p>

              <p className="text-2xl font-black text-slate-950">
                {number(
                  total
                )}
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            {rows
              .slice(
                0,
                5
              )
              .map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item.status
                    }
                    className="flex items-center justify-between gap-3 text-[10px]"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[
                              index %
                              COLORS.length
                            ],
                        }}
                      />

                      <span className="truncate font-semibold text-slate-600">
                        {item.status}
                      </span>
                    </div>

                    <span className="font-black text-slate-900">
                      {number(
                        item.count
                      )}
                    </span>
                  </div>
                )
              )}
          </div>
        </>
      )}
    </section>
  );
}

function CompletionPanel({
  rate,
  completed,
  total,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-950">
            Service Completion
          </h3>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Current completion rate for clinic activity
          </p>
        </div>

        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
          {percentage(
            rate
          )}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              `conic-gradient(#0f766e ${Math.max(
                0,
                Math.min(
                  100,
                  rate
                )
              )}%, #e2e8f0 0)`,
          }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">
            {percentage(
              rate
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2 text-[10px]">
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">
              Completed
            </span>

            <span className="font-black text-slate-900">
              {number(
                completed
              )}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-slate-500">
              Remaining
            </span>

            <span className="font-black text-slate-900">
              {number(
                Math.max(
                  total -
                    completed,
                  0
                )
              )}
            </span>
          </div>

          <div className="flex justify-between gap-3 border-t border-slate-100 pt-2">
            <span className="text-slate-500">
              Total activity
            </span>

            <span className="font-black text-slate-900">
              {number(
                total
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentActivity({
  data,
}) {
  const rows =
    safeArray(
      data
    );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-slate-950">
            Recent Activity
          </h3>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Latest clinic administration events
          </p>
        </div>

        <Link
          to="/admin/audit"
          className="text-[10px] font-black text-[#0f766e] hover:underline"
        >
          View audit
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {rows.length ? (
          rows
            .slice(
              0,
              6
            )
            .map(
              item => (
                <div
                  key={
                    item.id
                  }
                  className="flex gap-3 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <ClipboardList
                      size={14}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {item.action}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {item.performedBy ||
                        "System"}{" "}
                      ·{" "}
                      {formatDateTime(
                        item.timestamp
                      )}
                    </p>
                  </div>
                </div>
              )
            )
        ) : (
          <p className="py-8 text-center text-xs text-slate-400">
            No recent activity
          </p>
        )}
      </div>
    </section>
  );
}

function StockAlerts({
  data,
}) {
  const rows =
    safeArray(
      data
    );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-slate-950">
            Stock Alerts
          </h3>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Medication items at or below reorder level
          </p>
        </div>

        <Link
          to="/admin/inventory"
          className="text-[10px] font-black text-[#0f766e] hover:underline"
        >
          Inventory
        </Link>
      </div>

      <div className="space-y-2.5 pt-3">
        {rows.length ? (
          rows
            .slice(
              0,
              6
            )
            .map(
              item => (
                <div
                  key={
                    item.id
                  }
                  className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {item.medicationName}{" "}
                      {item.strength}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Reorder at{" "}
                      {item.reorderLevel}{" "}
                      {item.unit}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-black text-amber-700">
                    {item.quantityOnHand}{" "}
                    left
                  </span>
                </div>
              )
            )
        ) : (
          <div className="rounded-xl bg-emerald-50 p-5 text-center">
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

function QuickAction({
  to,
  icon:
    Icon,
  title,
  detail,
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-teal-200 hover:bg-teal-50/50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 group-hover:bg-white">
          <Icon
            size={16}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-black text-slate-900">
            {title}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-slate-400">
            {detail}
          </p>
        </div>
      </div>

      <ArrowUpRight
        size={14}
        className="shrink-0 text-slate-400 group-hover:text-teal-700"
      />
    </Link>
  );
}

function LoadingPanel() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map(
          item => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          )
        )}
      </div>

      <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <AlertTriangle
        size={24}
        className="mx-auto text-red-600"
      />

      <p className="mt-3 text-sm font-semibold text-red-800">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      )}
    </div>
  );
}

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
            if (active) {
              setData(
                result
              );
            }
          }
        )
        .catch(
          err => {
            if (active) {
              setError(
                err?.message ||
                "Unable to load administration analytics."
              );
            }
          }
        )
        .finally(
          () => {
            if (active) {
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
        message={error}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-white p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f766e]">
          PhilaLink Administration
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          System Overview
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          National account and service administration.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Patients"
          value={
            number(
              data?.totalPatients
            )
          }
          helper={`${number(
            data?.activePatients
          )} active`}
          icon={Users}
        />

        <KpiCard
          label="Nurses"
          value={
            number(
              data?.totalNurses
            )
          }
          helper={`${number(
            data?.activeNurses
          )} active`}
          icon={UserPlus}
          tone="emerald"
        />

        <KpiCard
          label="Proxies"
          value={
            number(
              data?.totalProxies
            )
          }
          helper={`${number(
            data?.activeProxies
          )} active`}
          icon={Users}
          tone="slate"
        />

        <KpiCard
          label="Proxy links"
          value={
            number(
              data?.totalProxyLinks
            )
          }
          helper="Active links"
          icon={BarChart3}
          tone="amber"
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const {
    role,
  } =
    useAuth();

  const [
    months,
    setMonths,
  ] =
    useState(6);

  const [
    activity,
    setActivity,
  ] =
    useState("All");

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
          setLoading(
            false
          );

          return;
        }

        try {
          setLoading(
            true
          );

          setError("");

          const result =
            await clinicAdminApi
              .getAnalytics(
                months
              );

          setData(
            result
          );
        } catch (
          loadError
        ) {
          setError(
            loadError?.message ||
            "Unable to load clinic analytics."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        months,
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

  const performance =
    useMemo(
      () => {
        const rows =
          safeArray(
            data?.monthlyActivity
          );

        const totals =
          rows.reduce(
            (
              result,
              item
            ) => {
              result.total +=
                Number(
                  item.appointments ||
                  0
                ) +
                Number(
                  item.collections ||
                  0
                );

              result.completed +=
                Number(
                  item.completedAppointments ||
                  0
                ) +
                Number(
                  item.completedCollections ||
                  0
                );

              return result;
            },
            {
              total:
                0,

              completed:
                0,
            }
          );

        return {
          ...totals,

          rate:
            totals.total > 0
              ? Math.round(
                  totals.completed /
                    totals.total *
                    100
                )
              : 0,
        };
      },
      [
        data,
      ]
    );

  const topDrivers =
    useMemo(
      () =>
        [
          ...safeArray(
            data?.appointmentStatuses
          ).map(
            item => ({
              label:
                `Appointments · ${item.status}`,

              value:
                Number(
                  item.count ||
                  0
                ),
            })
          ),

          ...safeArray(
            data?.collectionStatuses
          ).map(
            item => ({
              label:
                `Collections · ${item.status}`,

              value:
                Number(
                  item.count ||
                  0
                ),
            })
          ),
        ]
          .sort(
            (
              a,
              b
            ) =>
              b.value -
              a.value
          )
          .slice(
            0,
            3
          ),
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
        message={error}
        onRetry={load}
      />
    );
  }

  const kpis =
    data?.kpis || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f766e]">
            Admin / Analytics
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Analytics Overview
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Clinic service performance, patient activity and medication operations.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-[#0f172a] px-4 text-xs font-black text-white transition hover:bg-[#1e293b] sm:self-auto"
        >
          <RefreshCw
            size={14}
          />

          Refresh
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,0.7fr)_minmax(260px,1fr)_auto] lg:items-end">
          <label>
            <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
              Time Range
            </span>

            <select
              value={months}
              onChange={
                event =>
                  setMonths(
                    Number(
                      event.target
                        .value
                    )
                  )
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#0f766e]"
            >
              <option value="3">
                Last 3 months
              </option>

              <option value="6">
                Last 6 months
              </option>

              <option value="12">
                Last 12 months
              </option>
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
              Activity
            </span>

            <select
              value={
                activity
              }
              onChange={
                event =>
                  setActivity(
                    event.target
                      .value
                  )
              }
              className="h-10 w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#0f766e]"
            >
              <option value="All">
                All activity
              </option>

              <option value="Appointments">
                Appointments
              </option>

              <option value="Collections">
                Medication collections
              </option>
            </select>
          </label>

          <button
            type="button"
            onClick={load}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 text-xs font-black text-white transition hover:bg-[#115e59]"
          >
            <Filter
              size={14}
            />

            Apply
          </button>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Completion Rate"
          value={
            percentage(
              performance.rate
            )
          }
          helper="Completed clinic activity"
          icon={CheckCircle2}
          tone="emerald"
          progress={
            performance.rate
          }
        />

        <KpiCard
          label="Appointments Today"
          value={
            number(
              kpis.appointmentsToday
            )
          }
          helper="Scheduled for today"
          icon={CalendarCheck2}
        />

        <KpiCard
          label="Collections Due"
          value={
            number(
              kpis.collectionsDueToday
            )
          }
          helper="Medication collections today"
          icon={PackageCheck}
          tone="slate"
        />

        <KpiCard
          label="Active Patients"
          value={
            number(
              kpis.activePatients
            )
          }
          helper="Patients linked to clinic"
          icon={Users}
        />

        <KpiCard
          label="Low Stock"
          value={
            number(
              kpis.lowStockItems
            )
          }
          helper="Items needing attention"
          icon={Boxes}
          tone={
            Number(
              kpis.lowStockItems ||
              0
            ) > 0
              ? "amber"
              : "emerald"
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(310px,0.9fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-950">
                Clinic Activity
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Appointments and medication collection volume
              </p>
            </div>

            <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-[10px] font-black text-teal-700">
              {activity}
            </span>
          </div>

          <div className="pt-2">
            <ActivityChart
              rows={
                data?.monthlyActivity
              }
              activity={
                activity
              }
            />
          </div>

          {topDrivers.length >
            0 && (
            <div className="grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-3">
              {topDrivers.map(
                item => (
                  <div
                    key={
                      item.label
                    }
                    className="rounded-xl border border-slate-200 bg-[#f8fafc] px-3 py-2"
                  >
                    <p className="truncate text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-950">
                      {number(
                        item.value
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <div className="grid gap-4">
          <StatusDonut
            title="Appointment Status Share"
            subtitle="Current appointment distribution"
            data={
              data?.appointmentStatuses
            }
          />

          <CompletionPanel
            rate={
              performance.rate
            }
            completed={
              performance.completed
            }
            total={
              performance.total
            }
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(280px,0.8fr)]">
        <StatusDonut
          title="Collection Status Share"
          subtitle="Medication collection workflow"
          data={
            data?.collectionStatuses
          }
        />

        <RecentActivity
          data={
            data?.recentActivity
          }
        />

        <StockAlerts
          data={
            data?.lowStockItems
          }
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-950">
            Administration Shortcuts
          </h3>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Common Clinic Administrator actions
          </p>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <QuickAction
            to="/admin/register-staff"
            icon={UserPlus}
            title="Register Staff"
            detail="Create Nurse or Proxy accounts for this clinic"
          />

          <QuickAction
            to="/admin/inventory"
            icon={Boxes}
            title="Manage Inventory"
            detail="Receive, issue and review medication stock"
          />

          <QuickAction
            to="/admin/reports"
            icon={FileBarChart}
            title="Clinic Reports"
            detail="Generate operational reports"
          />
        </div>
      </section>
    </div>
  );
}
