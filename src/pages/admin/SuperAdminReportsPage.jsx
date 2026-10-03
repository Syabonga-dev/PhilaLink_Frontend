import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Download,
  FileKey2,
  RefreshCw,
  TableProperties,
} from "lucide-react";

import {
  AdminModal,
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

import {
  superAdminApi,
} from "../../services/api/superAdmin.js";

const REPORT_TYPES = [
  "Patients",
  "Appointments",
  "Collections",
  "Medication Adherence",
  "Inventory",
  "Staff",
  "Clinics",
  "Audit Activity",
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
          value
        );
  }

  return String(
    value
  );
}

export default function SuperAdminReportsPage() {
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
    clinics,
    setClinics,
  ] =
    useState([]);

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
    exporting,
    setExporting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    pdfOpen,
    setPdfOpen,
  ] =
    useState(false);

  const [
    password,
    setPassword,
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

  const loadPreview =
    useCallback(
      async query => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          setSuccess(
            ""
          );

          setPreview(
            await superAdminApi
              .previewReport(
                query
              )
          );
        } catch (
          err
        ) {
          setPreview(
            null
          );

          setError(
            err?.message ||
              "Could not build the system report preview."
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
      void loadPreview(
        appliedFilters
      );
    },
    [
      appliedFilters,
      loadPreview,
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
    const next = {
      ...defaultFilters(
        value
      ),

      clinicId:
        filters.clinicId,
    };

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
    event.preventDefault();

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

  async function exportExcel() {
    try {
      setExporting(
        true
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      const name =
        await superAdminApi
          .downloadExcel(
            appliedFilters
          );

      setSuccess(
        `Excel report generated: ${name}`
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
          "Could not generate the Excel report."
      );
    } finally {
      setExporting(
        false
      );
    }
  }

  async function exportPdf(
    event
  ) {
    event.preventDefault();

    if (
      password.length <
      8
    ) {
      setError(
        "The PDF password must contain at least 8 characters."
      );

      return;
    }

    try {
      setExporting(
        true
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      const name =
        await superAdminApi
          .downloadSecurePdf(
            appliedFilters,
            password
          );

      setPdfOpen(
        false
      );

      setPassword(
        ""
      );

      setSuccess(
        `Secure PDF generated: ${name}`
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
          "Could not generate the secure PDF report."
      );
    } finally {
      setExporting(
        false
      );
    }
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

  const options =
    preview?.filterOptions ||
    {};

  const rows =
    safeArray(
      preview?.rows
    );

  const dataColumns =
    safeArray(
      preview?.columns
    )
      .map(
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

  const selectedClinic =
    clinics.find(
      clinic =>
        clinic.id ===
        appliedFilters
          .clinicId
    );

  const filterSummary = [
    {
      label:
        "Report",

      value:
        appliedFilters
          .reportType,
    },

    {
      label:
        "Clinic",

      value:
        selectedClinic
          ?.name ||
        "All clinics",
    },

    {
      label:
        "From",

      value:
        appliedFilters
          .reportType ===
        "Inventory"
          ? ""
          : appliedFilters
              .dateFrom,
    },

    {
      label:
        "To",

      value:
        appliedFilters
          .reportType ===
        "Inventory"
          ? ""
          : appliedFilters
              .dateTo,
    },

    {
      label:
        "Status",

      value:
        appliedFilters
          .status,
    },

    {
      label:
        "Role",

      value:
        appliedFilters
          .role,
    },

    {
      label:
        "Medication",

      value:
        appliedFilters
          .medication,
    },
  ];

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow="System administration"
        title="Reports"
        description="Build system-wide or clinic-specific reports from live PhilaLink records and export them to Excel or a password-protected PDF."
        meta={
          <>
            <span>
              {preview
                ?.clinicName ||
                "All clinics"}
            </span>

            <span>
              {rows.length.toLocaleString(
                "en-ZA"
              )}{" "}
              matching rows
            </span>
          </>
        }
        actions={
          <>
            <SecondaryButton
              type="button"
              onClick={
                exportExcel
              }
              disabled={
                loading ||
                exporting ||
                !preview
              }
            >
              <Download
                size={15}
              />

              Excel
            </SecondaryButton>

            <PrimaryButton
              type="button"
              onClick={() => {
                setError(
                  ""
                );

                setPdfOpen(
                  true
                );
              }}
              disabled={
                loading ||
                exporting ||
                !preview
              }
            >
              <FileKey2
                size={15}
              />

              Secure PDF
            </PrimaryButton>
          </>
        }
      />

      {error ? (
        <Notice type="error">
          {error}
        </Notice>
      ) : null}

      {success ? (
        <Notice type="success">
          {success}
        </Notice>
      ) : null}

      <Panel
        title="Report parameters"
        description="Choose the report area, system scope and filters. Apply the parameters before exporting."
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

          {filters.reportType !==
          "Inventory" ? (
            <>
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
                  className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0f766e]"
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
              placeholder="Patient, clinic, medication, staff or action…"
            />
          </div>

          {safeArray(
            options.status
          ).length ? (
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
                options.status
              }
            />
          ) : null}

          {safeArray(
            options.role
          ).length ? (
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
                options.role
              }
            />
          ) : null}

          {safeArray(
            options.medication
          ).length ? (
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
                options.medication
              }
            />
          ) : null}

          {safeArray(
            options.provider
          ).length ? (
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
                options.provider
              }
            />
          ) : null}

          {safeArray(
            options.appointmentType
          ).length ? (
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
                options.appointmentType
              }
            />
          ) : null}

          {safeArray(
            options.mode
          ).length ? (
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
                options.mode
              }
            />
          ) : null}

          <div className="flex items-end gap-2">

            <PrimaryButton
              type="submit"
              className="flex-1"
            >
              Apply filters
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() =>
                loadPreview(
                  appliedFilters
                )
              }
              disabled={
                loading
              }
              title="Refresh current report"
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </SecondaryButton>

          </div>

        </form>

        <FilterSummary
          items={
            filterSummary
          }
          onClear={
            clearFilters
          }
        />

      </Panel>

      {loading ? (
        <LoadingBlock
          label="Building system report…"
          minHeight={
            360
          }
        />
      ) : preview ? (
        <>

          <MetricStrip
            metrics={
              summaryMetrics
            }
          />

          <Panel
            title={
              preview.title ||
              appliedFilters
                .reportType
            }
            description={`${rows.length.toLocaleString(
              "en-ZA"
            )} row${
              rows.length ===
              1
                ? ""
                : "s"
            } match the applied parameters.`}
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
                  index
                }
                maxHeight={
                  680
                }
              />
            ) : (
              <div className="p-5">
                <EmptyBlock
                  icon={
                    TableProperties
                  }
                  title="No matching records"
                  description="Change the report parameters and apply the filters again."
                />
              </div>
            )}

          </Panel>

        </>
      ) : null}

      {pdfOpen ? (
        <AdminModal
          title="Protect PDF report"
          description="Set a password for this export. The password is used only for this generated file and is not stored."
          onClose={() => {
            if (
              !exporting
            ) {
              setPdfOpen(
                false
              );

              setPassword(
                ""
              );
            }
          }}
        >

          <form
            onSubmit={
              exportPdf
            }
            className="space-y-4 p-5"
          >

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
                PDF password
              </span>

              <input
                type="password"
                value={
                  password
                }
                onChange={
                  event =>
                    setPassword(
                      event.target
                        .value
                    )
                }
                minLength={
                  8
                }
                maxLength={
                  128
                }
                autoComplete="new-password"
                data-1p-ignore="true"
                className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0f766e]"
                placeholder="At least 8 characters"
                autoFocus
              />
            </label>

            <Notice type="warning">
              Share the password separately from the PDF. If the password is lost, PhilaLink cannot recover it from the exported file.
            </Notice>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">

              <SecondaryButton
                type="button"
                onClick={() => {
                  setPdfOpen(
                    false
                  );

                  setPassword(
                    ""
                  );
                }}
                disabled={
                  exporting
                }
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                disabled={
                  exporting ||
                  password.length <
                    8
                }
              >
                <FileKey2
                  size={15}
                />

                {exporting
                  ? "Generating…"
                  : "Generate PDF"}
              </PrimaryButton>

            </div>

          </form>

        </AdminModal>
      ) : null}

    </div>
  );
}
