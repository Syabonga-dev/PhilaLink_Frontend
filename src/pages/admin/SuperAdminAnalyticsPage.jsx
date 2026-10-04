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

function dateInput(offsetDays) {
  const date = new Date();

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

function number(value) {
  return Number(
    value || 0
  ).toLocaleString(
    "en-ZA"
  );
}

function percent(value) {
  const numeric =
    Number(
      value || 0
    );

  return `${numeric.toLocaleString(
    "en-ZA",
    {
      maximumFractionDigits:
        1,
    }
  )}%`;
}

function safeNumber(value) {
  const numeric =
    Number(value);

  return Number.isFinite(
    numeric
  )
    ? Math.max(
        0,
        numeric
      )
    : 0;
}

function totalOf(rows) {
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
    dateInput(-29),

  dateTo:
    dateInput(0),
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
    totalOf(rows);

  return (
    <div className="space-y-2">
      {rows.map(row => {
        const share =
          total > 0
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
      })}
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
    totalOf(data) > 0;

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
                    formatter={value => [
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
              Medication collection activity across the applied reporting period.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
              {number(
                collections
              )}
            </p>

            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Collections
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {trend.length ? (
          <div className="h-[220px]">
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
                    8,

                  left:
                    -28,

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
                    22
                  }
                  tick={{
                    fontSize:
                      9,

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
                  width={
                    36
                  }
                  tick={{
                    fontSize:
                      9,

                    fill:
                      "#94a3b8",
                  }}
                />

                <Tooltip
                  formatter={value => [
                    number(
                      value
                    ),
                    "Collections",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="collections"
                  name="Collections"
                  stroke="#0f766e"
                  strokeWidth={
                    2.25
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
        ) : (
          <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">
            No collection activity was recorded for this period.
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function SuperAdminAnalyticsPage() {
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
    clinics,
    setClinics,
  ] =
    useState([]);

  const [
    analytics,
    setAnalytics,
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

  const loadClinics =
    useCallback(
      async () => {
        try {
          const result =
            await superAdminApi
              .getClinics();

          setClinics(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (
          err
        ) {
          console.error(
            err
          );
        }
      },
      []
    );

  const loadAnalytics =
    useCallback(
      async query => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const result =
            await superAdminApi
              .getAnalytics(
                query
              );

          setAnalytics(
            result ||
              null
          );
        } catch (
          err
        ) {
          setAnalytics(
            null
          );

          setError(
            err?.message ||
              "Could not load system analytics."
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
      void loadClinics();
    },
    [
      loadClinics,
    ]
  );

  useEffect(
    () => {
      void loadAnalytics(
        appliedFilters
      );
    },
    [
      appliedFilters,
      loadAnalytics,
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

  function apply(
    event
  ) {
    event.preventDefault();

    if (
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

    setError(
      ""
    );

    setAppliedFilters({
      ...filters,
    });
  }

  /* ======================================================= */
  /* FILTER OPTIONS                                          */
  /* ======================================================= */

  const clinicOptions =
    useMemo(
      () => [
        {
          value:
            "",

          label:
            "All clinics",
        },

        ...clinics.map(
          clinic => ({
            value:
              clinic.id,

            label:
              `${clinic.name}${
                clinic.isActive ===
                false
                  ? " (inactive)"
                  : ""
              }`,
          })
        ),
      ],
      [
        clinics,
      ]
    );

  /* ======================================================= */
  /* ANALYTIC DATA                                           */
  /* ======================================================= */

  const clinicRows =
    Array.isArray(
      analytics?.clinics
    )
      ? analytics.clinics
      : [];

  const trend =
    Array.isArray(
      analytics?.trend
    )
      ? analytics.trend
      : [];

  const populationData =
    useMemo(
      () => [
        {
          name:
            "Patients",

          value:
            safeNumber(
              analytics
                ?.totalPatients
            ),
        },

        {
          name:
            "Nurses",

          value:
            safeNumber(
              analytics
                ?.totalNurses
            ),
        },

        {
          name:
            "Proxies",

          value:
            safeNumber(
              analytics
                ?.totalProxies
            ),
        },
      ],
      [
        analytics,
      ]
    );

  const totalPopulation =
    useMemo(
      () =>
        totalOf(
          populationData
        ),
      [
        populationData,
      ]
    );

  const medicationOutcomeData =
    useMemo(
      () => {
        const total =
          safeNumber(
            analytics
              ?.medicationLogs
          );

        const missed =
          Math.min(
            total,
            safeNumber(
              analytics
                ?.missedMedicationLogs
            )
          );

        const taken =
          Math.max(
            0,
            total -
              missed
          );

        return [
          {
            name:
              "Taken",

            value:
              taken,
          },

          {
            name:
              "Missed",

            value:
              missed,
          },
        ];
      },
      [
        analytics,
      ]
    );

  /* ======================================================= */
  /* CLINIC TABLE                                            */
  /* ======================================================= */

  const clinicColumns = [
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
        "proxies",

      label:
        "Proxies",

      render:
        number,
    },

    {
      key:
        "clinicAdmins",

      label:
        "Clinic admins",

      render:
        number,
    },

    {
      key:
        "appointments",

      label:
        "Appointments",

      render:
        number,
    },

    {
      key:
        "collections",

      label:
        "Collections",

      render:
        number,
    },

    {
      key:
        "missedCollections",

      label:
        "Missed",

      render:
        number,
    },

    {
      key:
        "lowStockItems",

      label:
        "Low stock",

      render:
        number,
    },
  ];

  return (
    <div className="space-y-5">

      {/* =================================================== */}
      {/* HEADER                                              */}
      {/* =================================================== */}

      <PageHeader
        eyebrow="System administration"
        title="Analytics"
        description="Analyse PhilaLink activity across all clinics or narrow the view to one clinic and reporting period."
        meta={
          <>
            <span>
              Scope:{" "}
              {analytics
                ?.clinicName ||
                "All clinics"}
            </span>

            <span>
              {
                appliedFilters
                  .dateFrom
              }{" "}
              to{" "}
              {
                appliedFilters
                  .dateTo
              }
            </span>
          </>
        }
        actions={
          <SecondaryButton
            type="button"
            onClick={() =>
              loadAnalytics(
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
        }
      />

      {error ? (
        <Notice type="error">
          {error}
        </Notice>
      ) : null}

      {/* =================================================== */}
      {/* FILTERS                                             */}
      {/* =================================================== */}

      <Panel
        title="Analysis parameters"
        description="All metrics, charts and clinic rows below use the same applied period and clinic scope."
        noPadding
      >
        <form
          onSubmit={
            apply
          }
          className="grid gap-4 px-5 py-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <SelectField
            label="Clinic"
            value={
              filters.clinicId
            }
            onChange={
              event =>
                update(
                  "clinicId",
                  event.target
                    .value
                )
            }
            options={
              clinicOptions
            }
          />

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
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
              className="h-10 w-full border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#0f766e]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
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
              className="h-10 w-full border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#0f766e]"
            />
          </label>

          <div className="flex items-end">
            <PrimaryButton
              type="submit"
              className="w-full"
            >
              <BarChart3
                size={15}
              />

              Apply filters
            </PrimaryButton>
          </div>
        </form>
      </Panel>

      {/* =================================================== */}
      {/* CONTENT                                             */}
      {/* =================================================== */}

      {loading &&
      !analytics ? (
        <LoadingBlock
          label="Loading system analytics…"
          minHeight={
            360
          }
        />
      ) : (
        <>

          {/* =============================================== */}
          {/* POPULATION METRICS                              */}
          {/* =============================================== */}

          <MetricStrip
            metrics={[
              {
                label:
                  "Patients",

                value:
                  number(
                    analytics
                      ?.totalPatients
                  ),

                helper:
                  `${number(
                    analytics
                      ?.activePatients
                  )} active`,

                icon:
                  Users,
              },

              {
                label:
                  "Nurses",

                value:
                  number(
                    analytics
                      ?.totalNurses
                  ),

                helper:
                  `${number(
                    analytics
                      ?.activeNurses
                  )} active`,

                icon:
                  Users,
              },

              {
                label:
                  "Proxies",

                value:
                  number(
                    analytics
                      ?.totalProxies
                  ),

                helper:
                  `${number(
                    analytics
                      ?.activeProxies
                  )} active`,

                icon:
                  Users,
              },

              {
                label:
                  "Clinics",

                value:
                  number(
                    analytics
                      ?.totalClinics
                  ),

                helper:
                  `${number(
                    analytics
                      ?.activeClinics
                  )} active`,

                icon:
                  Building2,
              },
            ]}
          />

          {/* =============================================== */}
          {/* OPERATIONAL METRICS                             */}
          {/* =============================================== */}

          <MetricStrip
            metrics={[
              {
                label:
                  "Appointments",

                value:
                  number(
                    analytics
                      ?.appointments
                  ),

                helper:
                  "Within the applied period",

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

              {
                label:
                  "Medication adherence",

                value:
                  percent(
                    analytics
                      ?.medicationAdherenceRate
                  ),

                helper:
                  `${number(
                    analytics
                      ?.missedMedicationLogs
                  )} missed logs`,

                icon:
                  BarChart3,
              },

              {
                label:
                  "Low stock items",

                value:
                  number(
                    analytics
                      ?.lowStockItems
                  ),

                helper:
                  "Current inventory state",

                icon:
                  AlertTriangle,
              },
            ]}
          />

          {/* =============================================== */}
          {/* VISUAL SUMMARY                                  */}
          {/* =============================================== */}

          <Panel
            title="System composition"
            description="Population composition, medication outcomes and medication collection movement for the applied scope."
          >
            <div className="grid gap-4 xl:grid-cols-3">
              <AnalyticsPie
                title="Platform population"
                description="Patients, Nurses and Proxies within the current clinic scope."
                data={
                  populationData
                }
                colors={
                  POPULATION_COLORS
                }
                centerValue={
                  totalPopulation
                }
                centerLabel="People"
              />

              <AnalyticsPie
                title="Medication log outcome"
                description="Medication events recorded in the selected reporting period."
                data={
                  medicationOutcomeData
                }
                colors={
                  MEDICATION_COLORS
                }
                centerValue={
                  analytics
                    ?.medicationLogs
                }
                centerLabel="Logs"
              />

              <CollectionTrendCard
                trend={
                  trend
                }
                collections={
                  analytics
                    ?.collections
                }
              />
            </div>
          </Panel>

          {/* =============================================== */}
          {/* MAIN ACTIVITY CHART                              */}
          {/* =============================================== */}

          <Panel
            title="Activity trend"
            description="Patient registrations, appointments and medication collections in the applied period."
          >
            {trend.length ? (
              <div className="h-[330px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={
                      trend
                    }
                    margin={{
                      top:
                        10,

                      right:
                        20,

                      left:
                        -10,

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
                        14
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

                    <Legend />

                    <Bar
                      dataKey="registrations"
                      name="Registrations"
                      fill="#0f766e"
                      maxBarSize={
                        22
                      }
                    />

                    <Bar
                      dataKey="appointments"
                      name="Appointments"
                      fill="#0f172a"
                      maxBarSize={
                        22
                      }
                    />

                    <Bar
                      dataKey="collections"
                      name="Collections"
                      fill="#d97706"
                      maxBarSize={
                        22
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-14 text-center text-sm text-slate-500">
                No activity was recorded for the applied period.
              </div>
            )}
          </Panel>

          {/* =============================================== */}
          {/* CLINIC COMPARISON                               */}
          {/* =============================================== */}

          <Panel
            title="Clinic operational comparison"
            description={`${clinicRows.length.toLocaleString(
              "en-ZA"
            )} clinic record${
              clinicRows.length ===
              1
                ? ""
                : "s"
            } in scope.`}
            noPadding
          >
            <DataTable
              columns={
                clinicColumns
              }
              rows={
                clinicRows
              }
              rowKey={
                row =>
                  row.clinicId
              }
              maxHeight={
                640
              }
            />
          </Panel>

        </>
      )}

    </div>
  );
}
