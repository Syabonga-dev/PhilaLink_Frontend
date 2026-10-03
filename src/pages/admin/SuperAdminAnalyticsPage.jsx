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
  Legend,
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

    setAppliedFilters({
      ...filters,
    });
  }

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
