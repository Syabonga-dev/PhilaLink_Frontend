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
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  CalendarCheck2,
  FileBarChart,
  Filter,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  TableProperties,
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

import {
  superAdminApi,
} from "../../services/api/superAdmin.js";

import {
  DataTable,
  EmptyBlock,
  FilterSummary,
  LoadingBlock,
  MetricStrip,
  Notice,
  PageHeader,
  Panel,
  PrimaryButton,
  SearchField,
  SecondaryButton,
  SelectField,
  StatusBadge,
} from "../../components/admin/AdminPrimitives.jsx";

/* ========================================================= */
/* SHARED CONSTANTS                                          */
/* ========================================================= */

const REPORT_TYPES = [
  {
    value: "Collections",
    label: "Medication collections",
  },
  {
    value: "Appointments",
    label: "Appointments",
  },
  {
    value: "Patients",
    label: "Patients",
  },
  {
    value: "Medication Adherence",
    label: "Medication adherence",
  },
  {
    value: "Inventory",
    label: "Inventory",
  },
  {
    value: "Staff",
    label: "Staff",
  },
];

const COLORS = [
  "#0f766e",
  "#0f172a",
  "#d97706",
  "#2563eb",
  "#7c3aed",
  "#dc2626",
];

/* ========================================================= */
/* SHARED HELPERS                                            */
/* ========================================================= */

function dateInput(offsetDays) {
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

function defaultFilters(
  reportType =
    "Collections"
) {
  return {
    reportType,
    dateFrom:
      dateInput(-29),
    dateTo:
      dateInput(0),
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
}

function safeArray(value) {
  return Array.isArray(
    value
  )
    ? value
    : [];
}

function safeNumber(value) {
  const numeric =
    Number(
      value
    );

  return Number.isFinite(
    numeric
  )
    ? numeric
    : 0;
}

function number(value) {
  const numeric =
    Number(
      value
    );

  return Number.isFinite(
    numeric
  )
    ? numeric.toLocaleString(
        "en-ZA"
      )
    : String(
        value ??
          "—"
      );
}

function percent(value) {
  const numeric =
    Number(
      value
    );

  return Number.isFinite(
    numeric
  )
    ? `${numeric.toLocaleString(
        "en-ZA",
        {
          maximumFractionDigits:
            1,
        }
      )}%`
    : "—";
}

function formatDateTime(value) {
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
    return String(
      value
    );
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

function formatCell(
  value,
  type
) {
  if (
    value ===
      null ||
    value ===
      undefined ||
    value ===
      ""
  ) {
    return "—";
  }

  if (
    type ===
      "date" ||
    type ===
      "datetime"
  ) {
    const date =
      new Date(
        value
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return type ===
        "date"
        ? date.toLocaleDateString(
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
        : date.toLocaleString(
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
    type ===
    "number"
  ) {
    return number(
      value
    );
  }

  return String(
    value
  );
}

/* ========================================================= */
/* SUPER ADMIN OVERVIEW                                      */
/* ========================================================= */

function SystemTrendChart({
  trend,
}) {
  if (
    !trend.length
  ) {
    return (
      <EmptyBlock
        icon={
          Activity
        }
        title="No activity in this period"
        description="No patient registrations, appointments or medication collections were recorded in the last 30 days."
      />
    );
  }

  return (
    <div className="h-[320px] px-2 pt-4">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={
            trend
          }
          margin={{
            top:
              8,
            right:
              18,
            left:
              -16,
            bottom:
              0,
          }}
        >
          <CartesianGrid
            vertical={
              false
            }
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="period"
            axisLine={
              false
            }
            tickLine={
              false
            }
            minTickGap={
              18
            }
            tick={{
              fontSize:
                10,
              fill:
                "#64748b",
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

          <Tooltip />

          <Legend
            wrapperStyle={{
              fontSize:
                11,
            }}
          />

          <Line
            type="monotone"
            dataKey="registrations"
            name="Patient registrations"
            stroke="#0f766e"
            strokeWidth={
              2.4
            }
            dot={
              false
            }
            activeDot={{
              r:
                4,
            }}
          />

          <Line
            type="monotone"
            dataKey="appointments"
            name="Appointments"
            stroke="#0f172a"
            strokeWidth={
              2
            }
            dot={
              false
            }
            activeDot={{
              r:
                4,
            }}
          />

          <Line
            type="monotone"
            dataKey="collections"
            name="Collections"
            stroke="#d97706"
            strokeWidth={
              2
            }
            dot={
              false
            }
            activeDot={{
              r:
                4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PopulationChart({
  data,
}) {
  const total =
    data.reduce(
      (
        sum,
        item
      ) =>
        sum +
        safeNumber(
          item.value
        ),
      0
    );

  if (
    total ===
    0
  ) {
    return (
      <EmptyBlock
        icon={
          Users
        }
        title="No account data"
        description="Account totals are not available right now."
      />
    );
  }

  return (
    <div>
      <div className="relative h-[220px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={
                data
              }
              dataKey="value"
              nameKey="name"
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
              {data.map(
                (
                  item,
                  index
                ) => (
                  <Cell
                    key={
                      item.name
                    }
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
              formatter={
                value => [
                  number(
                    value
                  ),
                  "Accounts",
                ]
              }
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {number(
              total
            )}
          </span>

          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
            accounts
          </span>
        </div>
      </div>

      <div className="border-t border-slate-200">
        {data.map(
          (
            item,
            index
          ) => {
            const share =
              total > 0
                ? (
                    safeNumber(
                      item.value
                    ) /
                    total
                  ) *
                  100
                : 0;

            return (
              <div
                key={
                  item.name
                }
                className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
                  <span
                    className="h-2.5 w-2.5 shrink-0"
                    style={{
                      backgroundColor:
                        COLORS[
                          index %
                            COLORS.length
                        ],
                    }}
                  />

                  <span>
                    {
                      item.name
                    }
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-semibold text-slate-900">
                    {number(
                      item.value
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
    </div>
  );
}

function AttentionList({
  items,
}) {
  const visible =
    items.filter(
      item =>
        safeNumber(
          item.value
        ) >
        0
    );

  if (
    !visible.length
  ) {
    return (
      <div className="flex min-h-[260px] items-center justify-center px-6 text-center">
        <div>
          <ShieldCheck
            size={
              28
            }
            className="mx-auto text-emerald-700"
          />

          <p className="mt-3 text-sm font-semibold text-slate-900">
            No immediate administrative issues
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
            The current overview has no inactive clinics, uncovered clinics or other flagged operational conditions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {visible
        .slice(
          0,
          7
        )
        .map(
          item => (
            <Link
              key={
                item.label
              }
              to={
                item.to
              }
              className="group flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3.5 last:border-b-0 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  {
                    item.label
                  }
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {
                    item.helper
                  }
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="min-w-8 text-right text-lg font-semibold tracking-[-0.03em] text-amber-700">
                  {number(
                    item.value
                  )}
                </span>

                <ArrowRight
                  size={
                    14
                  }
                  className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                />
              </div>
            </Link>
          )
        )}
    </div>
  );
}

function RecentActivity({
  logs,
}) {
  if (
    !logs.length
  ) {
    return (
      <EmptyBlock
        icon={
          TableProperties
        }
        title="No audit activity"
        description="No recent audit entries were returned."
      />
    );
  }

  return (
    <div>
      {logs.map(
        (
          log,
          index
        ) => (
          <div
            key={
              log.id ||
              `${log.timestamp}-${log.action}-${index}`
            }
            className="grid gap-3 border-b border-slate-100 px-5 py-3.5 last:border-b-0 md:grid-cols-[120px_minmax(0,1fr)_180px]"
          >
            <div className="text-[11px] font-medium text-slate-400">
              {formatDateTime(
                log.timestamp
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {log.action ||
                  "System activity"}
              </p>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                {log.details ||
                  "No additional details were recorded."}
              </p>
            </div>

            <div className="text-xs text-slate-500 md:text-right">
              <p className="font-medium text-slate-700">
                {log.performedBy ||
                  "System"}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                {log.clinicName ||
                  "System-wide"}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function SuperAdminDashboard() {
  const [
    dashboard,
    setDashboard,
  ] =
    useState(null);

  const [
    analytics,
    setAnalytics,
  ] =
    useState(null);

  const [
    clinics,
    setClinics,
  ] =
    useState([]);

  const [
    clinicAdmins,
    setClinicAdmins,
  ] =
    useState([]);

  const [
    auditLogs,
    setAuditLogs,
  ] =
    useState([]);

  const [
    accounts,
    setAccounts,
  ] =
    useState([]);

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
    partialWarning,
    setPartialWarning,
  ] =
    useState("");

  const [
    lastUpdated,
    setLastUpdated,
  ] =
    useState(null);

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          setPartialWarning(
            ""
          );

          const requests = [
            adminApi
              .getDashboard(),
            superAdminApi
              .getAnalytics({
                dateFrom:
                  dateInput(
                    -29
                  ),
                dateTo:
                  dateInput(
                    0
                  ),
              }),
            superAdminApi
              .getClinics(),
            superAdminApi
              .getClinicAdmins(),
            adminApi
              .getAuditLog(),
            adminApi
              .listAccounts(),
          ];

          const results =
            await Promise.allSettled(
              requests
            );

          const [
            dashboardResult,
            analyticsResult,
            clinicsResult,
            adminsResult,
            auditResult,
            accountsResult,
          ] =
            results;

          if (
            dashboardResult.status ===
            "fulfilled"
          ) {
            setDashboard(
              dashboardResult.value ||
                null
            );
          }

          if (
            analyticsResult.status ===
            "fulfilled"
          ) {
            setAnalytics(
              analyticsResult.value ||
                null
            );
          }

          if (
            clinicsResult.status ===
            "fulfilled"
          ) {
            setClinics(
              safeArray(
                clinicsResult.value
              )
            );
          }

          if (
            adminsResult.status ===
            "fulfilled"
          ) {
            setClinicAdmins(
              safeArray(
                adminsResult.value
              )
            );
          }

          if (
            auditResult.status ===
            "fulfilled"
          ) {
            setAuditLogs(
              safeArray(
                auditResult.value
              )
            );
          }

          if (
            accountsResult.status ===
            "fulfilled"
          ) {
            setAccounts(
              safeArray(
                accountsResult.value
              )
            );
          }

          const failures =
            results.filter(
              result =>
                result.status ===
                "rejected"
            );

          if (
            failures.length ===
            results.length
          ) {
            throw new Error(
              "Unable to load the administration overview."
            );
          }

          if (
            failures.length
          ) {
            setPartialWarning(
              "Some overview panels could not be refreshed. The available system data is shown below."
            );
          }

          setLastUpdated(
            new Date()
          );
        } catch (
          err
        ) {
          setError(
            err?.message ||
              "Unable to load the administration overview."
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
      void load();
    },
    [
      load,
    ]
  );

  const clinicRows =
    safeArray(
      analytics?.clinics
    );

  const trend =
    safeArray(
      analytics?.trend
    );

  const activeClinicCount =
    analytics
      ?.activeClinics ??
    clinics.filter(
      clinic =>
        clinic.isActive !==
        false
    ).length;

  const totalClinicCount =
    analytics
      ?.totalClinics ??
    clinics.length;

  const activeAdminCount =
    clinicAdmins.filter(
      admin =>
        admin.isActive !==
        false
    ).length;

  const inactiveClinics =
    clinics.filter(
      clinic =>
        clinic.isActive ===
        false
    ).length;

  const unassignedAdmins =
    clinicAdmins.filter(
      admin =>
        !admin.clinicId
    ).length;

  const inactiveAccounts =
    accounts.filter(
      account =>
        account.isActive ===
        false
    ).length;

  const clinicsWithoutAdmins =
    clinicRows.filter(
      clinic =>
        clinic.isActive !==
          false &&
        safeNumber(
          clinic.clinicAdmins
        ) ===
          0
    ).length;

  const clinicsWithoutNurses =
    clinicRows.filter(
      clinic =>
        clinic.isActive !==
          false &&
        safeNumber(
          clinic.nurses
        ) ===
          0
    ).length;

  const populationData =
    [
      {
        name:
          "Patients",
        value:
          analytics
            ?.totalPatients ??
          dashboard
            ?.totalPatients ??
          0,
      },
      {
        name:
          "Nurses",
        value:
          analytics
            ?.totalNurses ??
          dashboard
            ?.totalNurses ??
          0,
      },
      {
        name:
          "Proxies",
        value:
          analytics
            ?.totalProxies ??
          dashboard
            ?.totalProxies ??
          0,
      },
      {
        name:
          "Clinic admins",
        value:
          clinicAdmins.length,
      },
    ];

  const attentionItems =
    [
      {
        label:
          "Inactive clinics",
        value:
          inactiveClinics,
        helper:
          "Clinics currently unavailable for active operations",
        to:
          "/admin/clinics",
      },
      {
        label:
          "Clinics without a Clinic Administrator",
        value:
          clinicsWithoutAdmins,
        helper:
          "Active clinics with no administrator assignment",
        to:
          "/admin/clinic-admins",
      },
      {
        label:
          "Clinics without nurses",
        value:
          clinicsWithoutNurses,
        helper:
          "Active clinics with no nurse records",
        to:
          "/admin/clinics",
      },
      {
        label:
          "Unassigned Clinic Administrators",
        value:
          unassignedAdmins,
        helper:
          "Administrator accounts with no clinic assignment",
        to:
          "/admin/clinic-admins",
      },
      {
        label:
          "Inactive user accounts",
        value:
          inactiveAccounts,
        helper:
          "Accounts currently disabled across the platform",
        to:
          "/admin/staff",
      },
      {
        label:
          "Missed medication collections",
        value:
          analytics
            ?.missedCollections ??
          0,
        helper:
          "Missed collections within the last 30 days",
        to:
          "/admin/analytics",
      },
      {
        label:
          "Low-stock inventory items",
        value:
          analytics
            ?.lowStockItems ??
          0,
        helper:
          "Active stock records at or below reorder level",
        to:
          "/admin/analytics",
      },
    ];

  const recentLogs =
    useMemo(
      () =>
        [...auditLogs]
          .sort(
            (
              a,
              b
            ) =>
              new Date(
                b?.timestamp ||
                  0
              ) -
              new Date(
                a?.timestamp ||
                  0
              )
          )
          .slice(
            0,
            6
          ),
      [
        auditLogs,
      ]
    );

  const priorityClinics =
    useMemo(
      () =>
        [...clinicRows]
          .sort(
            (
              a,
              b
            ) => {
              const aRisk =
                safeNumber(
                  a.lowStockItems
                ) *
                  3 +
                safeNumber(
                  a.missedCollections
                ) *
                  2 +
                (
                  safeNumber(
                    a.clinicAdmins
                  ) ===
                  0
                    ? 8
                    : 0
                ) +
                (
                  safeNumber(
                    a.nurses
                  ) ===
                  0
                    ? 6
                    : 0
                );

              const bRisk =
                safeNumber(
                  b.lowStockItems
                ) *
                  3 +
                safeNumber(
                  b.missedCollections
                ) *
                  2 +
                (
                  safeNumber(
                    b.clinicAdmins
                  ) ===
                  0
                    ? 8
                    : 0
                ) +
                (
                  safeNumber(
                    b.nurses
                  ) ===
                  0
                    ? 6
                    : 0
                );

              return bRisk -
                aRisk;
            }
          )
          .slice(
            0,
            8
          ),
      [
        clinicRows,
      ]
    );

  const clinicColumns =
    [
      {
        key:
          "clinicName",
        label:
          "Clinic",
        render:
          value => (
            <span className="font-semibold text-slate-900">
              {value ||
                "—"}
            </span>
          ),
      },
      {
        key:
          "isActive",
        label:
          "Status",
        render:
          value => (
            <StatusBadge
              value={
                value
                  ? "Active"
                  : "Inactive"
              }
            />
          ),
      },
      {
        key:
          "patients",
        label:
          "Patients",
        render:
          number,
      },
      {
        key:
          "nurses",
        label:
          "Nurses",
        render:
          number,
      },
      {
        key:
          "clinicAdmins",
        label:
          "Admins",
        render:
          value => (
            <span
              className={
                safeNumber(
                  value
                ) ===
                0
                  ? "font-semibold text-amber-700"
                  : "font-semibold text-slate-900"
              }
            >
              {number(
                value
              )}
            </span>
          ),
      },
      {
        key:
          "missedCollections",
        label:
          "Missed",
        render:
          value => (
            <span
              className={
                safeNumber(
                  value
                ) >
                0
                  ? "font-semibold text-amber-700"
                  : "text-slate-500"
              }
            >
              {number(
                value
              )}
            </span>
          ),
      },
      {
        key:
          "lowStockItems",
        label:
          "Low stock",
        render:
          value => (
            <span
              className={
                safeNumber(
                  value
                ) >
                0
                  ? "font-semibold text-red-700"
                  : "text-slate-500"
              }
            >
              {number(
                value
              )}
            </span>
          ),
      },
    ];

  if (
    loading &&
    !analytics &&
    !dashboard
  ) {
    return (
      <LoadingBlock
        label="Loading administration overview…"
        minHeight={
          420
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="PhilaLink administration"
        title="System overview"
        description="National account, clinic and service administration across the PhilaLink platform."
        meta={
          <>
            <span>
              30-day operational window
            </span>

            <span>
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString(
                    "en-ZA",
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}`
                : "Live system data"}
            </span>
          </>
        }
        actions={
          <>
            <Link
              to="/admin/analytics"
              className="inline-flex h-10 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <BarChart3
                size={
                  15
                }
              />
              Full analytics
            </Link>

            <SecondaryButton
              onClick={
                load
              }
              disabled={
                loading
              }
            >
              <RefreshCw
                size={
                  15
                }
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </SecondaryButton>
          </>
        }
      />

      {error ? (
        <Notice
          type="error"
        >
          {
            error
          }
        </Notice>
      ) : null}

      {partialWarning ? (
        <Notice>
          {
            partialWarning
          }
        </Notice>
      ) : null}

      <MetricStrip
        metrics={[
          {
            label:
              "Patients",
            value:
              number(
                analytics
                  ?.totalPatients ??
                dashboard
                  ?.totalPatients
              ),
            helper:
              `${number(
                analytics
                  ?.activePatients ??
                dashboard
                  ?.activePatients
              )} active`,
            icon:
              Users,
          },
          {
            label:
              "Clinics",
            value:
              number(
                totalClinicCount
              ),
            helper:
              `${number(
                activeClinicCount
              )} active`,
            icon:
              Building2,
          },
          {
            label:
              "Nurses",
            value:
              number(
                analytics
                  ?.totalNurses ??
                dashboard
                  ?.totalNurses
              ),
            helper:
              `${number(
                analytics
                  ?.activeNurses ??
                dashboard
                  ?.activeNurses
              )} active`,
            icon:
              UserPlus,
          },
          {
            label:
              "Proxies",
            value:
              number(
                analytics
                  ?.totalProxies ??
                dashboard
                  ?.totalProxies
              ),
            helper:
              `${number(
                analytics
                  ?.activeProxies ??
                dashboard
                  ?.activeProxies
              )} active`,
            icon:
              Users,
          },
        ]}
      />

      <MetricStrip
        metrics={[
          {
            label:
              "Clinic admins",
            value:
              number(
                clinicAdmins.length
              ),
            helper:
              `${number(
                activeAdminCount
              )} active`,
            icon:
              ShieldCheck,
          },
          {
            label:
              "Proxy links",
            value:
              number(
                dashboard
                  ?.totalProxyLinks
              ),
            helper:
              "Active relationships",
            icon:
              BarChart3,
          },
          {
            label:
              "Appointments",
            value:
              number(
                analytics
                  ?.appointments
              ),
            helper:
              "Last 30 days",
            icon:
              CalendarCheck2,
          },
          {
            label:
              "Collections",
            value:
              number(
                analytics
                  ?.collections
              ),
            helper:
              `${number(
                analytics
                  ?.missedCollections
              )} missed`,
            icon:
              PackageCheck,
          },
        ]}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.75fr)]">
        <Panel
          title="System activity"
          description="Patient registrations, appointments and medication collections recorded across all clinics during the last 30 days."
          actions={
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f766e] hover:underline"
            >
              Analyse
              <ArrowRight
                size={
                  13
                }
              />
            </Link>
          }
          noPadding
        >
          <SystemTrendChart
            trend={
              trend
            }
          />
        </Panel>

        <Panel
          title="Account distribution"
          description="Current registered population by primary PhilaLink role."
        >
          <PopulationChart
            data={
              populationData
            }
          />
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.7fr)]">
        <Panel
          title="Clinic operational watch"
          description="Clinics are prioritised by low stock, missed collections and missing staffing coverage."
          actions={
            <Link
              to="/admin/clinics"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f766e] hover:underline"
            >
              All clinics
              <ArrowRight
                size={
                  13
                }
              />
            </Link>
          }
          noPadding
        >
          {priorityClinics.length ? (
            <DataTable
              columns={
                clinicColumns
              }
              rows={
                priorityClinics
              }
              rowKey={
                row =>
                  row.clinicId
              }
              maxHeight={
                430
              }
            />
          ) : (
            <div className="p-5">
              <EmptyBlock
                icon={
                  Building2
                }
                title="No clinic analytics available"
                description="Clinic operational metrics have not been returned yet."
              />
            </div>
          )}
        </Panel>

        <Panel
          title="Attention required"
          description="Administrative and operational conditions that may need follow-up."
          noPadding
        >
          <AttentionList
            items={
              attentionItems
            }
          />
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.7fr)]">
        <Panel
          title="Recent system activity"
          description="Latest auditable administrative and clinical events across PhilaLink."
          actions={
            <Link
              to="/admin/audit"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f766e] hover:underline"
            >
              Audit log
              <ArrowRight
                size={
                  13
                }
              />
            </Link>
          }
          noPadding
        >
          <RecentActivity
            logs={
              recentLogs
            }
          />
        </Panel>

        <Panel
          title="Operational health"
          description="A compact view of medication and inventory pressure."
        >
          <div className="space-y-4">
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Medication adherence
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {percent(
                      analytics
                        ?.medicationAdherenceRate
                    )}
                  </p>
                </div>

                <BarChart3
                  size={
                    24
                  }
                  className="text-[#0f766e]"
                />
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Based on medication logs recorded during the last 30 days.
              </p>
            </div>

            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Missed collections
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {number(
                      analytics
                        ?.missedCollections
                    )}
                  </p>
                </div>

                <PackageCheck
                  size={
                    24
                  }
                  className="text-amber-700"
                />
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Medication collections marked as missed within the reporting window.
              </p>
            </div>

            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Low-stock items
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {number(
                      analytics
                        ?.lowStockItems
                    )}
                  </p>
                </div>

                <AlertTriangle
                  size={
                    24
                  }
                  className="text-red-700"
                />
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Active clinic stock records at or below their reorder level.
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Quick administration"
        description="Open the most common Super Administrator workflows."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Link
            to="/admin/clinic-admins"
            className="group border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50"
          >
            <ShieldCheck
              size={
                20
              }
              className="text-[#0f766e]"
            />

            <p className="mt-4 text-sm font-semibold text-slate-900">
              Clinic administrators
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Review assignments, active state and clinic coverage.
            </p>

            <ArrowRight
              size={
                15
              }
              className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
            />
          </Link>

          <Link
            to="/admin/clinics"
            className="group border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50"
          >
            <Building2
              size={
                20
              }
              className="text-[#0f766e]"
            />

            <p className="mt-4 text-sm font-semibold text-slate-900">
              Manage clinics
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Review national clinic records, services and active status.
            </p>

            <ArrowRight
              size={
                15
              }
              className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
            />
          </Link>

          <Link
            to="/admin/analytics"
            className="group border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50"
          >
            <BarChart3
              size={
                20
              }
              className="text-[#0f766e]"
            />

            <p className="mt-4 text-sm font-semibold text-slate-900">
              System analytics
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Explore clinic, appointment, collection and adherence metrics.
            </p>

            <ArrowRight
              size={
                15
              }
              className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
            />
          </Link>

          <Link
            to="/admin/system-reports"
            className="group border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50"
          >
            <FileBarChart
              size={
                20
              }
              className="text-[#0f766e]"
            />

            <p className="mt-4 text-sm font-semibold text-slate-900">
              System reports
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Build filtered national Excel and secure PDF reports.
            </p>

            <ArrowRight
              size={
                15
              }
              className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
            />
          </Link>
        </div>
      </Panel>
    </div>
  );
}

/* ========================================================= */
/* CLINIC ADMIN ANALYTICS                                    */
/* ========================================================= */

function chartConfig(
  reportType
) {
  switch (
    reportType
  ) {
    case "Patients":
      return {
        dateKey:
          "registered",
        statusKey:
          "status",
        categoryKey:
          "gender",
        categoryLabel:
          "Gender",
      };

    case "Appointments":
      return {
        dateKey:
          "scheduled",
        statusKey:
          "status",
        categoryKey:
          "type",
        categoryLabel:
          "Appointment type",
      };

    case "Collections":
      return {
        dateKey:
          "scheduled",
        statusKey:
          "status",
        categoryKey:
          "medication",
        categoryLabel:
          "Medication",
      };

    case "Medication Adherence":
      return {
        dateKey:
          "recorded",
        statusKey:
          "result",
        categoryKey:
          "medication",
        categoryLabel:
          "Medication",
      };

    case "Inventory":
      return {
        dateKey:
          null,
        statusKey:
          "status",
        categoryKey:
          "medication",
        categoryLabel:
          "Medication",
      };

    case "Staff":
      return {
        dateKey:
          "registered",
        statusKey:
          "status",
        categoryKey:
          "role",
        categoryLabel:
          "Role",
      };

    default:
      return {
        dateKey:
          null,
        statusKey:
          "status",
        categoryKey:
          null,
        categoryLabel:
          "Category",
      };
  }
}

function groupCounts(
  rows,
  key
) {
  const map =
    new Map();

  safeArray(
    rows
  ).forEach(
    row => {
      const raw =
        row?.[
          key
        ];

      const values =
        typeof raw ===
          "string" &&
        raw.includes(
          ","
        )
          ? raw
              .split(
                ","
              )
              .map(
                part =>
                  part.trim()
              )
              .filter(
                Boolean
              )
          : [
              raw ||
                "Unknown",
            ];

      values.forEach(
        value => {
          const label =
            String(
              value ||
                "Unknown"
            );

          map.set(
            label,
            (
              map.get(
                label
              ) ||
              0
            ) +
              1
          );
        }
      );
    }
  );

  return [
    ...map.entries(),
  ]
    .map(
      ([
        name,
        count,
      ]) => ({
        name,
        count,
      })
    )
    .sort(
      (
        a,
        b
      ) =>
        b.count -
        a.count
    );
}

function buildTrend(
  rows,
  dateKey,
  dateFrom,
  dateTo
) {
  if (!dateKey) {
    return [];
  }

  const from =
    dateFrom
      ? new Date(
          dateFrom
        )
      : null;

  const to =
    dateTo
      ? new Date(
          dateTo
        )
      : null;

  const spanDays =
    from &&
    to
      ? Math.max(
          0,
          Math.round(
            (
              to -
              from
            ) /
              86400000
          )
        )
      : 30;

  const monthly =
    spanDays >
    75;

  const map =
    new Map();

  safeArray(
    rows
  ).forEach(
    row => {
      const date =
        new Date(
          row?.[
            dateKey
          ]
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return;
      }

      const key =
        monthly
          ? `${date.getFullYear()}-${String(
              date.getMonth() +
                1
            ).padStart(
              2,
              "0"
            )}`
          : `${date.getFullYear()}-${String(
              date.getMonth() +
                1
            ).padStart(
              2,
              "0"
            )}-${String(
              date.getDate()
            ).padStart(
              2,
              "0"
            )}`;

      map.set(
        key,
        (
          map.get(
            key
          ) ||
          0
        ) +
          1
      );
    }
  );

  return [
    ...map.entries(),
  ]
    .sort(
      (
        [a],
        [b]
      ) =>
        a.localeCompare(
          b
        )
    )
    .map(
      ([
        key,
        count,
      ]) => {
        const date =
          new Date(
            `${key}${
              monthly
                ? "-01"
                : ""
            }T00:00:00`
          );

        return {
          period:
            monthly
              ? date.toLocaleDateString(
                  "en-ZA",
                  {
                    month:
                      "short",
                    year:
                      "2-digit",
                  }
                )
              : date.toLocaleDateString(
                  "en-ZA",
                  {
                    day:
                      "2-digit",
                    month:
                      "short",
                  }
                ),
          count,
        };
      }
    );
}

function CustomTooltip({
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
    <div className="border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label ? (
        <p className="mb-1 font-semibold text-slate-900">
          {
            label
          }
        </p>
      ) : null}

      {payload.map(
        (
          entry,
          index
        ) => (
          <p
            key={`${entry.dataKey}-${index}`}
            className="text-slate-600"
          >
            {entry.name}:{" "}
            <span className="font-semibold text-slate-900">
              {number(
                entry.value
              )}
            </span>
          </p>
        )
      )}
    </div>
  );
}

function TrendChart({
  data,
  label,
}) {
  if (
    !data.length
  ) {
    return (
      <EmptyBlock
        icon={
          BarChart3
        }
        title="No trend data"
        description="No dated records matched the current filters."
      />
    );
  }

  return (
    <div className="h-[310px] px-2 pt-4">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={
            data
          }
          margin={{
            top:
              8,
            right:
              16,
            left:
              -18,
            bottom:
              4,
          }}
        >
          <CartesianGrid
            vertical={
              false
            }
            stroke="#e2e8f0"
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
                "#64748b",
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
              <CustomTooltip />
            }
            cursor={{
              fill:
                "#f8fafc",
            }}
          />

          <Bar
            dataKey="count"
            name={
              label
            }
            fill="#0f766e"
            maxBarSize={
              36
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusChart({
  data,
}) {
  const total =
    data.reduce(
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
    !data.length
  ) {
    return (
      <EmptyBlock
        title="No status data"
        description="This report does not have status values for the current filters."
      />
    );
  }

  return (
    <div>
      <div className="relative h-[215px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={
                data
              }
              dataKey="count"
              nameKey="name"
              innerRadius={
                54
              }
              outerRadius={
                78
              }
              paddingAngle={
                2
              }
            >
              {data.map(
                (
                  item,
                  index
                ) => (
                  <Cell
                    key={
                      item.name
                    }
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
                <CustomTooltip />
              }
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="text-2xl font-semibold text-slate-950">
              {number(
                total
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        {data
          .slice(
            0,
            6
          )
          .map(
            (
              item,
              index
            ) => (
              <div
                key={
                  item.name
                }
                className="flex items-center justify-between gap-3 border-b border-slate-100 px-1 py-2 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
                  <span
                    className="h-2 w-2 shrink-0"
                    style={{
                      backgroundColor:
                        COLORS[
                          index %
                            COLORS.length
                        ],
                    }}
                  />

                  <span className="truncate">
                    {
                      item.name
                    }
                  </span>
                </div>

                <span className="text-xs font-semibold text-slate-900">
                  {number(
                    item.count
                  )}
                </span>
              </div>
            )
          )}
      </div>
    </div>
  );
}

function CategoryChart({
  data,
  reportType,
}) {
  if (
    !data.length
  ) {
    return (
      <EmptyBlock
        title="No category data"
        description="No category breakdown is available for these records."
      />
    );
  }

  const rows =
    data.slice(
      0,
      8
    );

  if (
    reportType ===
    "Inventory"
  ) {
    return (
      <div className="space-y-3 p-1">
        {rows.map(
          item => (
            <div
              key={
                item.name
              }
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0"
            >
              <span className="truncate text-xs text-slate-600">
                {
                  item.name
                }
              </span>

              <span className="text-xs font-semibold text-slate-900">
                {number(
                  item.count
                )}{" "}
                record(s)
              </span>
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <div className="h-[290px] pt-3">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={
            rows
          }
          layout="vertical"
          margin={{
            left:
              10,
            right:
              20,
            top:
              4,
            bottom:
              4,
          }}
        >
          <CartesianGrid
            horizontal={
              false
            }
            stroke="#e2e8f0"
          />

          <XAxis
            type="number"
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

          <YAxis
            dataKey="name"
            type="category"
            width={
              105
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
                "#64748b",
            }}
          />

          <Tooltip
            content={
              <CustomTooltip />
            }
            cursor={{
              fill:
                "#f8fafc",
            }}
          />

          <Bar
            dataKey="count"
            name="Records"
            fill="#0f172a"
            maxBarSize={
              22
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ========================================================= */
/* MAIN PAGE                                                 */
/* ========================================================= */

export default function AdminDashboard() {
  const {
    role,
  } =
    useAuth();

  const [
    filters,
    setFilters,
  ] =
    useState(
      () =>
        defaultFilters()
    );

  const [
    appliedFilters,
    setAppliedFilters,
  ] =
    useState(
      () =>
        defaultFilters()
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

  const load =
    useCallback(
      async query => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          setPreview(
            await clinicAdminApi
              .previewReport(
                query
              )
          );
        } catch (
          err
        ) {
          setError(
            err?.message ||
              "Unable to load clinic analytics."
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
      if (
        role ===
        "ClinicAdmin"
      ) {
        void load(
          appliedFilters
        );
      }
    },
    [
      appliedFilters,
      load,
      role,
    ]
  );

  const options =
    preview?.filterOptions ||
    {};

  const reportType =
    appliedFilters.reportType;

  const config =
    chartConfig(
      reportType
    );

  const rows =
    safeArray(
      preview?.rows
    );

  const trend =
    useMemo(
      () =>
        buildTrend(
          rows,
          config.dateKey,
          appliedFilters.dateFrom,
          appliedFilters.dateTo
        ),
      [
        rows,
        config.dateKey,
        appliedFilters.dateFrom,
        appliedFilters.dateTo,
      ]
    );

  const statusData =
    useMemo(
      () =>
        groupCounts(
          rows,
          config.statusKey
        ),
      [
        rows,
        config.statusKey,
      ]
    );

  const categoryData =
    useMemo(
      () =>
        config.categoryKey
          ? groupCounts(
              rows,
              config.categoryKey
            )
          : [],
      [
        rows,
        config.categoryKey,
      ]
    );

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

  function changeReportType(
    value
  ) {
    const next =
      defaultFilters(
        value
      );

    setFilters(
      next
    );

    setAppliedFilters(
      next
    );
  }

  function apply(
    event
  ) {
    event?.preventDefault();

    if (
      filters.reportType !==
        "Inventory" &&
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

    setAppliedFilters({
      ...filters,
    });
  }

  function clearFilters() {
    const next =
      defaultFilters(
        filters.reportType
      );

    setFilters(
      next
    );

    setAppliedFilters(
      next
    );
  }

  const summaryMetrics =
    safeArray(
      preview?.summary
    )
      .slice(
        0,
        4
      )
      .map(
        item => ({
          label:
            item.label,
          value:
            item.value,
          helper:
            `${rows.length.toLocaleString(
              "en-ZA"
            )} filtered row${
              rows.length ===
              1
                ? ""
                : "s"
            }`,
        })
      );

  const dataColumns =
    safeArray(
      preview?.columns
    ).map(
      column => ({
        ...column,
        render:
          value =>
            column.dataType ===
            "status" ? (
              <StatusBadge
                value={
                  formatCell(
                    value,
                    column.dataType
                  )
                }
              />
            ) : (
              <span
                className={
                  column.dataType ===
                  "number"
                    ? "font-semibold text-slate-900"
                    : ""
                }
              >
                {formatCell(
                  value,
                  column.dataType
                )}
              </span>
            ),
      })
    );

  const activeFilterItems =
    [
      {
        label:
          "Report",
        value:
          appliedFilters.reportType,
      },
      {
        label:
          "From",
        value:
          appliedFilters.reportType ===
          "Inventory"
            ? ""
            : appliedFilters.dateFrom,
      },
      {
        label:
          "To",
        value:
          appliedFilters.reportType ===
          "Inventory"
            ? ""
            : appliedFilters.dateTo,
      },
      {
        label:
          "Status",
        value:
          appliedFilters.status,
      },
      {
        label:
          "Medication",
        value:
          appliedFilters.medication,
      },
      {
        label:
          "Role",
        value:
          appliedFilters.role,
      },
      {
        label:
          "Provider",
        value:
          appliedFilters.provider,
      },
      {
        label:
          "Type",
        value:
          appliedFilters.appointmentType,
      },
      {
        label:
          "Mode",
        value:
          appliedFilters.mode,
      },
      {
        label:
          "Search",
        value:
          appliedFilters.search,
      },
    ];

  const showMedication =
    [
      "Collections",
      "Medication Adherence",
      "Inventory",
    ].includes(
      filters.reportType
    );

  const showAppointments =
    filters.reportType ===
    "Appointments";

  const showRole =
    filters.reportType ===
    "Staff";

  const isInventory =
    filters.reportType ===
    "Inventory";

  if (
    role ===
    "SuperAdmin"
  ) {
    return (
      <SuperAdminDashboard />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clinic operations"
        title="Analytics"
        description="Analyse live clinic records by date, workflow, status, medication and staff context. Every metric, chart and row below uses the same applied parameters."
        meta={
          <>
            <span>
              {preview?.clinicName ||
                "Clinic"}
            </span>

            <span>
              {preview
                ? `${rows.length.toLocaleString(
                    "en-ZA"
                  )} matching records`
                : "Live clinic data"}
            </span>
          </>
        }
        actions={
          <>
            <Link
              to="/admin/reports"
              className="inline-flex h-10 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <FileBarChart
                size={
                  15
                }
              />
              Reports
            </Link>

            <SecondaryButton
              onClick={
                () =>
                  load(
                    appliedFilters
                  )
              }
              disabled={
                loading
              }
            >
              <RefreshCw
                size={
                  15
                }
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </SecondaryButton>
          </>
        }
      />

      {error ? (
        <Notice
          type="error"
        >
          {
            error
          }
        </Notice>
      ) : null}

      <Panel
        title="Analysis parameters"
        description="Change the report area first, then refine its contextual filters."
        noPadding
      >
        <form
          onSubmit={
            apply
          }
          className="grid gap-4 px-5 py-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <SelectField
            label="Report area"
            value={
              filters.reportType
            }
            onChange={
              event =>
                changeReportType(
                  event.target
                    .value
                )
            }
            options={
              REPORT_TYPES
            }
          />

          {!isInventory ? (
            <>
              <SelectField
                label="Period"
                value={`${filters.dateFrom}|${filters.dateTo}`}
                onChange={
                  event => {
                    const [
                      from,
                      to,
                    ] =
                      event.target
                        .value
                        .split(
                          "|"
                        );

                    setFilters(
                      current => ({
                        ...current,
                        dateFrom:
                          from,
                        dateTo:
                          to,
                      })
                    );
                  }
                }
                options={[
                  {
                    value:
                      `${dateInput(-6)}|${dateInput(0)}`,
                    label:
                      "Last 7 days",
                  },
                  {
                    value:
                      `${dateInput(-29)}|${dateInput(0)}`,
                    label:
                      "Last 30 days",
                  },
                  {
                    value:
                      `${dateInput(-89)}|${dateInput(0)}`,
                    label:
                      "Last 90 days",
                  },
                  {
                    value:
                      `${dateInput(-179)}|${dateInput(0)}`,
                    label:
                      "Last 6 months",
                  },
                  {
                    value:
                      `${dateInput(-364)}|${dateInput(0)}`,
                    label:
                      "Last 12 months",
                  },
                ]}
              />

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
                  Custom from
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
                  className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0f766e]"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
                  Custom to
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
                  className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0f766e]"
                />
              </label>
            </>
          ) : null}

          <div>
            <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
              Search
            </span>

            <SearchField
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
              placeholder="Patient, medication or staff…"
            />
          </div>

          <SelectField
            label="Status"
            value={
              filters.status
            }
            onChange={
              event =>
                update(
                  "status",
                  event.target
                    .value
                )
            }
            options={
              safeArray(
                options.status
              ).length
                ? options.status
                : [
                    "All",
                  ]
            }
          />

          {showMedication ? (
            <SelectField
              label="Medication"
              value={
                filters.medication
              }
              onChange={
                event =>
                  update(
                    "medication",
                    event.target
                      .value
                  )
              }
              options={
                safeArray(
                  options.medication
                ).length
                  ? options.medication
                  : [
                      "All",
                    ]
              }
            />
          ) : null}

          {showAppointments ? (
            <>
              <SelectField
                label="Appointment type"
                value={
                  filters.appointmentType
                }
                onChange={
                  event =>
                    update(
                      "appointmentType",
                      event.target
                        .value
                    )
                }
                options={
                  safeArray(
                    options.appointmentType
                  ).length
                    ? options.appointmentType
                    : [
                        "All",
                      ]
                }
              />

              <SelectField
                label="Provider"
                value={
                  filters.provider
                }
                onChange={
                  event =>
                    update(
                      "provider",
                      event.target
                        .value
                    )
                }
                options={
                  safeArray(
                    options.provider
                  ).length
                    ? options.provider
                    : [
                        "All",
                      ]
                }
              />

              <SelectField
                label="Mode"
                value={
                  filters.mode
                }
                onChange={
                  event =>
                    update(
                      "mode",
                      event.target
                        .value
                    )
                }
                options={
                  safeArray(
                    options.mode
                  ).length
                    ? options.mode
                    : [
                        "All",
                      ]
                }
              />
            </>
          ) : null}

          {showRole ? (
            <SelectField
              label="Role"
              value={
                filters.role
              }
              onChange={
                event =>
                  update(
                    "role",
                    event.target
                      .value
                  )
              }
              options={
                safeArray(
                  options.role
                ).length
                  ? options.role
                  : [
                      "All",
                    ]
              }
            />
          ) : null}

          <div className="flex items-end gap-2 xl:col-span-4">
            <PrimaryButton
              type="submit"
              disabled={
                loading
              }
            >
              <Filter
                size={
                  15
                }
              />
              Apply parameters
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={
                clearFilters
              }
              disabled={
                loading
              }
            >
              Clear
            </SecondaryButton>
          </div>
        </form>

        <FilterSummary
          items={
            activeFilterItems
          }
          onClear={
            clearFilters
          }
        />
      </Panel>

      {loading &&
      !preview ? (
        <LoadingBlock
          label="Building analytics…"
          minHeight={
            360
          }
        />
      ) : null}

      {preview ? (
        <>
          <MetricStrip
            metrics={
              summaryMetrics.length
                ? summaryMetrics
                : [
                    {
                      label:
                        "Records",
                      value:
                        number(
                          rows.length
                        ),
                    },
                  ]
            }
          />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
            <Panel
              title={
                reportType ===
                "Inventory"
                  ? "Inventory activity"
                  : `${preview.title} over time`
              }
              description={
                reportType ===
                "Inventory"
                  ? "Current filtered inventory records."
                  : "Record volume using the same selected reporting period."
              }
              noPadding
            >
              {reportType ===
              "Inventory" ? (
                <CategoryChart
                  data={
                    categoryData
                  }
                  reportType={
                    reportType
                  }
                />
              ) : (
                <TrendChart
                  data={
                    trend
                  }
                  label={
                    preview.reportType
                  }
                />
              )}
            </Panel>

            <Panel
              title="Status distribution"
              description="Share of the filtered records by current outcome or status."
            >
              <StatusChart
                data={
                  statusData
                }
              />
            </Panel>
          </div>

          {reportType !==
          "Inventory" ? (
            <Panel
              title={`Breakdown by ${config.categoryLabel.toLowerCase()}`}
              description="The most common categories within the current filtered result set."
            >
              <CategoryChart
                data={
                  categoryData
                }
                reportType={
                  reportType
                }
              />
            </Panel>
          ) : null}

          <Panel
            title="Filtered records"
            description="The table is the source dataset for the analytics shown above."
            actions={
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <TableProperties
                  size={
                    14
                  }
                />

                {rows.length.toLocaleString(
                  "en-ZA"
                )}{" "}
                rows
              </div>
            }
            noPadding
          >
            {rows.length ? (
              <DataTable
                columns={
                  dataColumns
                }
                rows={
                  rows
                }
                rowKey={(
                  _,
                  index
                ) =>
                  `${preview.reportType}-${index}`
                }
                maxHeight={
                  520
                }
              />
            ) : (
              <div className="p-5">
                <EmptyBlock
                  icon={
                    TableProperties
                  }
                  title="No records matched these parameters"
                  description="Change the date range or filters, then apply them again."
                />
              </div>
            )}
          </Panel>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/admin/reports"
              className="flex items-center justify-between border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 hover:border-slate-300"
            >
              Build a formal report

              <ArrowRight
                size={
                  16
                }
              />
            </Link>

            <Link
              to="/admin/inventory"
              className="flex items-center justify-between border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 hover:border-slate-300"
            >
              Manage medication inventory

              <Boxes
                size={
                  16
                }
              />
            </Link>

            <Link
              to="/admin/staff"
              className="flex items-center justify-between border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 hover:border-slate-300"
            >
              Review clinic staff

              <Users
                size={
                  16
                }
              />
            </Link>
          </div>
        </>
      ) : !loading ? (
        <EmptyBlock
          icon={
            AlertTriangle
          }
          title="Analytics unavailable"
          description="The clinic report service did not return a dataset."
        />
      ) : null}
    </div>
  );
}
