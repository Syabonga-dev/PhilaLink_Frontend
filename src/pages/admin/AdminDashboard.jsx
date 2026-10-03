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
  ArrowRight,
  BarChart3,
  Boxes,
  FileBarChart,
  Filter,
  RefreshCw,
  TableProperties,
  UserPlus,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

const REPORT_TYPES = [
  {
    value:
      "Collections",
    label:
      "Medication collections",
  },
  {
    value:
      "Appointments",
    label:
      "Appointments",
  },
  {
    value:
      "Patients",
    label:
      "Patients",
  },
  {
    value:
      "Medication Adherence",
    label:
      "Medication adherence",
  },
  {
    value:
      "Inventory",
    label:
      "Inventory",
  },
  {
    value:
      "Staff",
    label:
      "Staff",
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

function defaultFilters(
  reportType =
    "Collections"
) {
  return {
    reportType,

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
}

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
          {label}
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
          data={data}
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
            name={label}
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
              data={data}
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
          data={rows}
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
            width={105}
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

          setData(
            await adminApi
              .getDashboard()
          );
        } catch (
          err
        ) {
          setError(
            err?.message ||
            "Unable to load administration analytics."
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

  if (
    loading
  ) {
    return (
      <LoadingBlock
        label="Loading administration overview…"
        minHeight={
          320
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="PhilaLink administration"
        title="System overview"
        description="National account and service administration."
        actions={
          <SecondaryButton
            onClick={
              load
            }
          >
            <RefreshCw
              size={15}
            />
            Refresh
          </SecondaryButton>
        }
      />

      {error ? (
        <Notice type="error">
          {error}
        </Notice>
      ) : null}

      <MetricStrip
        metrics={[
          {
            label:
              "Patients",

            value:
              number(
                data?.totalPatients
              ),

            helper:
              `${number(
                data?.activePatients
              )} active`,

            icon:
              Users,
          },
          {
            label:
              "Nurses",

            value:
              number(
                data?.totalNurses
              ),

            helper:
              `${number(
                data?.activeNurses
              )} active`,

            icon:
              UserPlus,
          },
          {
            label:
              "Proxies",

            value:
              number(
                data?.totalProxies
              ),

            helper:
              `${number(
                data?.activeProxies
              )} active`,

            icon:
              Users,
          },
          {
            label:
              "Proxy links",

            value:
              number(
                data?.totalProxyLinks
              ),

            helper:
              "Active relationships",

            icon:
              BarChart3,
          },
        ]}
      />
    </div>
  );
}

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
      async (
        query
      ) => {
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

  const activeFilterItems = [
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

  const showStatus =
    true;

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
                size={15}
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
                size={15}
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
        <Notice type="error">
          {error}
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
                      `${dateInput(
                        -6
                      )}|${dateInput(
                        0
                      )}`,

                    label:
                      "Last 7 days",
                  },
                  {
                    value:
                      `${dateInput(
                        -29
                      )}|${dateInput(
                        0
                      )}`,

                    label:
                      "Last 30 days",
                  },
                  {
                    value:
                      `${dateInput(
                        -89
                      )}|${dateInput(
                        0
                      )}`,

                    label:
                      "Last 90 days",
                  },
                  {
                    value:
                      `${dateInput(
                        -179
                      )}|${dateInput(
                        0
                      )}`,

                    label:
                      "Last 6 months",
                  },
                  {
                    value:
                      `${dateInput(
                        -364
                      )}|${dateInput(
                        0
                      )}`,

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

          {showStatus ? (
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
          ) : null}

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
                size={15}
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
                  size={14}
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
                size={16}
              />
            </Link>

            <Link
              to="/admin/inventory"
              className="flex items-center justify-between border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 hover:border-slate-300"
            >
              Manage medication inventory

              <Boxes
                size={16}
              />
            </Link>

            <Link
              to="/admin/staff"
              className="flex items-center justify-between border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 hover:border-slate-300"
            >
              Review clinic staff

              <Users
                size={16}
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
