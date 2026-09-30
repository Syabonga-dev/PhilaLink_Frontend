import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
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
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

const COLORS = {
  teal:
    "#0f766e",
  tealDark:
    "#115e59",
  tealLight:
    "#5eead4",
  emerald:
    "#059669",
  emeraldLight:
    "#a7f3d0",
  cyan:
    "#0891b2",
  amber:
    "#f59e0b",
  rose:
    "#e11d48",
  slate:
    "#64748b",
};

const CHART_COLORS = [
  COLORS.teal,
  COLORS.emerald,
  COLORS.cyan,
  COLORS.amber,
  COLORS.rose,
  COLORS.slate,
];

function safeArray(value) {
  return Array.isArray(
    value
  )
    ? value
    : [];
}

function number(value) {
  return Number(
    value || 0
  ).toLocaleString(
    "en-ZA"
  );
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
              <span className="text-slate-500">
                {entry.name}
              </span>
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
  detail,
  icon:
    Icon,
  tone =
    "teal",
}) {
  const tones = {
    teal:
      "bg-teal-50 text-teal-700",
    emerald:
      "bg-emerald-50 text-emerald-700",
    amber:
      "bg-amber-50 text-amber-700",
    rose:
      "bg-rose-50 text-rose-700",
    cyan:
      "bg-cyan-50 text-cyan-700",
  };

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
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
            {detail}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            tones[tone] ||
            tones.teal
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

function MonthlyBarChart({
  data,
}) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={
            safeArray(
              data
            )
          }
          margin={{
            top:
              15,
            right:
              10,
            left:
              -20,
            bottom:
              0,
          }}
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
                "#94a3b8",
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
            content={
              <ChartTooltip />
            }
          />
          <Legend
            iconType="circle"
            wrapperStyle={{
              fontSize:
                "11px",
            }}
          />
          <Bar
            dataKey="appointments"
            name="Appointments"
            fill={
              COLORS.teal
            }
            radius={[
              8,
              8,
              2,
              2,
            ]}
            maxBarSize={30}
          />
          <Bar
            dataKey="collections"
            name="Collections"
            fill={
              COLORS.emeraldLight
            }
            radius={[
              8,
              8,
              2,
              2,
            ]}
            maxBarSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CompletionLineChart({
  data,
}) {
  const rows =
    useMemo(
      () =>
        safeArray(
          data
        ).map(
          item => ({
            ...item,
            completed:
              Number(
                item.completedAppointments ||
                0
              ) +
              Number(
                item.completedCollections ||
                0
              ),
            outstanding:
              Math.max(
                Number(
                  item.appointments ||
                  0
                ) +
                  Number(
                    item.collections ||
                    0
                  ) -
                  Number(
                    item.completedAppointments ||
                    0
                  ) -
                  Number(
                    item.completedCollections ||
                    0
                  ),
                0
              ),
          })),
      [data]
    );

  return (
    <div className="h-[265px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={rows}
          margin={{
            top:
              10,
            right:
              15,
            left:
              -20,
            bottom:
              5,
          }}
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
                "#94a3b8",
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
            content={
              <ChartTooltip />
            }
          />
          <Legend
            iconType="circle"
            wrapperStyle={{
              fontSize:
                "10px",
            }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke={
              COLORS.emerald
            }
            strokeWidth={3}
            dot={{
              r:
                3,
              fill:
                COLORS.emerald,
              strokeWidth:
                0,
            }}
          />
          <Line
            type="monotone"
            dataKey="outstanding"
            name="Outstanding"
            stroke={
              COLORS.amber
            }
            strokeWidth={2.5}
            dot={{
              r:
                3,
              fill:
                COLORS.amber,
              strokeWidth:
                0,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DonutChart({
  data,
  label,
}) {
  const values =
    safeArray(
      data
    ).filter(
      item =>
        Number(
          item.count ||
          0
        ) > 0
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

  if (!values.length) {
    return (
      <div className="flex h-[270px] items-center justify-center text-sm text-slate-400">
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
            data={values}
            nameKey="status"
            dataKey="count"
            cx="50%"
            cy="44%"
            innerRadius={58}
            outerRadius={86}
            paddingAngle={4}
            cornerRadius={8}
          >
            {values.map(
              (
                item,
                index
              ) => (
                <Cell
                  key={`${item.status}-${index}`}
                  fill={
                    CHART_COLORS[
                      index %
                        CHART_COLORS.length
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
          {number(
            total
          )}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="space-y-5">
      <div className="h-28 animate-pulse rounded-[28px] bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(
          item => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-[22px] bg-slate-100"
            />
          )
        )}
      </div>
      <div className="h-80 animate-pulse rounded-[28px] bg-slate-100" />
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}) {
  return (
    <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center">
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

function RecentActivity({
  data,
}) {
  const rows =
    safeArray(
      data
    );

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
            Governance
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-950">
            Recent activity
          </h3>
        </div>
        <Link
          to="/admin/audit"
          className="text-[11px] font-bold text-[#0f766e] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {rows.length ? (
          rows
            .slice(
              0,
              5
            )
            .map(
              item => (
                <div
                  key={item.id}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Clock3
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
                    {item.details && (
                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                        {item.details}
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

function LowStock({
  data,
}) {
  const items =
    safeArray(
      data
    );

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
            Inventory
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-950">
            Stock alerts
          </h3>
        </div>
        <Link
          to="/admin/inventory"
          className="text-[11px] font-bold text-[#0f766e] hover:underline"
        >
          Manage
        </Link>
      </div>

      <div className="mt-4 space-y-2.5">
        {items.length ? (
          items
            .slice(
              0,
              5
            )
            .map(
              item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {item.medicationName}{" "}
                      {item.strength}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Reorder at {item.reorderLevel}{" "}
                      {item.unit}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-amber-700">
                    {item.quantityOnHand}{" "}
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

function SuperAdminDashboard() {
  const [
    data,
    setData,
  ] = useState(null);
  const [
    loading,
    setLoading,
  ] = useState(true);
  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let active =
      true;

    adminApi
      .getDashboard()
      .then(result => {
        if (active) {
          setData(
            result
          );
        }
      })
      .catch(err => {
        if (active) {
          setError(
            err?.message ||
              "Unable to load administration analytics."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(
            false
          );
        }
      });

    return () => {
      active =
        false;
    };
  }, []);

  if (loading) {
    return <LoadingPanel />;
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
      <section className="rounded-[30px] border border-teal-100 bg-gradient-to-br from-teal-100 via-[#f0fdfa] to-white p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
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
        <KpiCard
          label="Patients"
          value={
            data?.totalPatients
          }
          detail={`${data?.activePatients || 0} active`}
          icon={Users}
        />
        <KpiCard
          label="Nurses"
          value={
            data?.totalNurses
          }
          detail={`${data?.activeNurses || 0} active`}
          icon={BarChart3}
          tone="emerald"
        />
        <KpiCard
          label="Proxies"
          value={
            data?.totalProxies
          }
          detail={`${data?.activeProxies || 0} active`}
          icon={Users}
          tone="cyan"
        />
        <KpiCard
          label="Proxy links"
          value={
            data?.totalProxyLinks
          }
          detail="Active links"
          icon={TrendingUp}
          tone="amber"
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const {
    role,
    user,
  } =
    useAuth();

  const [
    data,
    setData,
  ] = useState(null);
  const [
    months,
    setMonths,
  ] = useState(6);
  const [
    loading,
    setLoading,
  ] = useState(true);
  const [
    error,
    setError,
  ] = useState("");

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
          setError("");

          const result =
            await clinicAdminApi
              .getAnalytics(
                months
              );

          setData(
            result
          );
        } catch (loadError) {
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
        role,
        months,
      ]
    );

  useEffect(() => {
    void load();
  }, [load]);

  const completionRate =
    useMemo(
      () => {
        const rows =
          safeArray(
            data?.monthlyActivity
          );

        if (!rows.length) {
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

        return total > 0
          ? Math.min(
              100,
              Math.round(
                completed /
                  total *
                  100
              )
            )
          : 0;
      },
      [data]
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
    return <LoadingPanel />;
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

  const displayName =
    data?.adminName ||
    user?.fullName ||
    "Administrator";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">
            Clinic administration
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Analytics Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Service activity, appointments, collections and stock performance for your clinic.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <label className="block">
            <span className="mb-1 block px-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
              Period
            </span>
            <select
              value={months}
              onChange={event =>
                setMonths(
                  Number(
                    event.target.value
                  )
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#0f766e]"
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

          <button
            type="button"
            onClick={load}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f766e] px-4 text-xs font-bold text-white hover:bg-[#115e59]"
          >
            <RefreshCw
              size={14}
            />
            Refresh
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-[30px] border border-teal-100 bg-gradient-to-br from-[#ccfbf1] via-[#f0fdfa] to-white p-5 shadow-[0_18px_55px_rgba(15,118,110,0.08)] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">
              {displayName}
            </p>
            <h3 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Clinic service completion is{" "}
              <span className="text-[#0f766e]">
                {completionRate}%
              </span>
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                {kpis.collectedThisMonth || 0}{" "}
                collections completed
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-teal-700 shadow-sm">
                {kpis.newPatientsThisMonth || 0}{" "}
                new patients
              </span>
            </div>
          </div>

          <Link
            to="/admin/reports"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#0f766e] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-100 hover:bg-[#115e59]"
          >
            <FileBarChart
              size={15}
            />
            Reports
          </Link>
        </div>

        <div className="mt-5 rounded-[24px] bg-white/75 p-3 backdrop-blur">
          <MonthlyBarChart
            data={
              data?.monthlyActivity
            }
          />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Active patients"
          value={
            kpis.activePatients
          }
          detail="Registered at clinic"
          icon={Users}
        />
        <KpiCard
          label="Pending appointments"
          value={
            kpis.pendingAppointments
          }
          detail="Awaiting action"
          icon={CalendarDays}
          tone="cyan"
        />
        <KpiCard
          label="Collections due today"
          value={
            kpis.collectionsDueToday
          }
          detail="Medication collections"
          icon={PackageCheck}
          tone="emerald"
        />
        <KpiCard
          label="Overdue collections"
          value={
            kpis.overdueCollections
          }
          detail="Requires follow-up"
          icon={AlertTriangle}
          tone="rose"
        />
        <KpiCard
          label="Low stock"
          value={
            kpis.lowStockItems
          }
          detail="Below reorder level"
          icon={AlertTriangle}
          tone="amber"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f766e]">
            Service activity
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-950">
            Completed vs outstanding work
          </h3>
          <p className="mt-1 text-[11px] text-slate-400">
            Appointments and medication collections over time
          </p>
          <div className="mt-3">
            <CompletionLineChart
              data={
                data?.monthlyActivity
              }
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f766e]">
            Appointment flow
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-950">
            Status distribution
          </h3>
          <DonutChart
            data={
              data?.appointmentStatuses
            }
            label="Appointments"
          />
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f766e]">
            Medication operations
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-950">
            Collection status
          </h3>
          <DonutChart
            data={
              data?.collectionStatuses
            }
            label="Collections"
          />
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f766e]">
            Clinic team
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-950">
            Workforce
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[20px] bg-teal-50 p-4">
              <p className="text-2xl font-bold text-teal-800">
                {kpis.activeNurses || 0}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-teal-600">
                Nurses
              </p>
            </div>
            <div className="rounded-[20px] bg-emerald-50 p-4">
              <p className="text-2xl font-bold text-emerald-800">
                {kpis.activeProxies || 0}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                Proxies
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <QuickLink
              to="/admin/register-staff"
              icon={UserPlus}
              label="Register staff"
            />
            <QuickLink
              to="/admin/staff"
              icon={Users}
              label="Manage staff"
            />
            <QuickLink
              to="/admin/reports"
              icon={FileBarChart}
              label="Generate report"
            />
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
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
      </div>
    </div>
  );
}

function QuickLink({
  to,
  icon:
    Icon,
  label,
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
    >
      <span className="flex items-center gap-2">
        <Icon
          size={15}
        />
        {label}
      </span>
      <ArrowUpRight
        size={14}
      />
    </Link>
  );
}
