import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CalendarRange,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  TableProperties,
} from "lucide-react";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

import {
  AdminModal,
  DataTable,
  EmptyBlock,
  FilterSummary,
  InputField,
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

    description:
      "Collected, missed and scheduled medication collections.",
  },
  {
    value:
      "Patients",

    label:
      "Patients",

    description:
      "Patient registrations and account status.",
  },
  {
    value:
      "Appointments",

    label:
      "Appointments",

    description:
      "Appointments by type, provider, mode and status.",
  },
  {
    value:
      "Medication Adherence",

    label:
      "Medication adherence",

    description:
      "Medication dose records marked taken or missed.",
  },
  {
    value:
      "Inventory",

    label:
      "Inventory",

    description:
      "Current medication stock and low-stock items.",
  },
  {
    value:
      "Staff",

    label:
      "Staff",

    description:
      "Nurses and proxies registered at the clinic.",
  },
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

    if (
      Number.isFinite(
        numeric
      )
    ) {
      return numeric
        .toLocaleString(
          "en-ZA"
        );
    }
  }

  return String(
    value
  );
}

function PasswordModal({
  open,
  onClose,
  onExport,
  pending,
}) {
  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirm,
    setConfirm,
  ] =
    useState("");

  const [
    localError,
    setLocalError,
  ] =
    useState("");

  useEffect(
    () => {
      if (
        open
      ) {
        setPassword(
          ""
        );

        setConfirm(
          ""
        );

        setLocalError(
          ""
        );
      }
    },
    [
      open,
    ]
  );

  if (!open) {
    return null;
  }

  function submit(
    event
  ) {
    event.preventDefault();

    if (
      password.length <
      8
    ) {
      setLocalError(
        "Use at least 8 characters for the PDF password."
      );

      return;
    }

    if (
      password !==
      confirm
    ) {
      setLocalError(
        "The two passwords do not match."
      );

      return;
    }

    setLocalError(
      ""
    );

    onExport(
      password
    );
  }

  return (
    <AdminModal
      title="Secure PDF export"
      description="The PDF will require this password when opened. The password is used only for this export and is not stored by PhilaLink."
      onClose={
        onClose
      }
    >
      <form
        onSubmit={
          submit
        }
        className="space-y-5 p-5"
      >
        <div className="border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-[#0f766e]"
            />

            <div>
              <p className="text-sm font-medium text-slate-900">
                Confidential clinic report
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Copying and modification permissions are restricted. Printing remains available to authorised recipients.
              </p>
            </div>
          </div>
        </div>

        <InputField
          label="PDF password"
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
          placeholder="At least 8 characters"
          required
        />

        <InputField
          label="Confirm password"
          type="password"
          value={
            confirm
          }
          onChange={
            event =>
              setConfirm(
                event.target
                  .value
              )
          }
          placeholder="Repeat the password"
          required
        />

        {localError ? (
          <Notice type="error">
            {localError}
          </Notice>
        ) : null}

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
          <SecondaryButton
            type="button"
            onClick={
              onClose
            }
            disabled={
              pending
            }
          >
            Cancel
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            disabled={
              pending
            }
          >
            {pending ? (
              <LoaderCircle
                size={15}
                className="animate-spin"
              />
            ) : (
              <LockKeyhole
                size={15}
              />
            )}

            Generate encrypted PDF
          </PrimaryButton>
        </div>
      </form>
    </AdminModal>
  );
}

export default function AdminReportsPage() {
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

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    downloading,
    setDownloading,
  ] =
    useState("");

  const [
    passwordOpen,
    setPasswordOpen,
  ] =
    useState(false);

  const loadPreview =
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
            "Could not generate the report preview."
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
      void loadPreview(
        appliedFilters
      );
    },
    [
      appliedFilters,
      loadPreview,
    ]
  );

  const options =
    preview?.filterOptions ||
    {};

  const isInventory =
    filters.reportType ===
    "Inventory";

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

  const reportDefinition =
    REPORT_TYPES.find(
      item =>
        item.value ===
        filters.reportType
    ) ||
    REPORT_TYPES[0];

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

    setSuccess(
      ""
    );
  }

  function applyFilters(
    event
  ) {
    event?.preventDefault();

    if (
      !isInventory &&
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

    setSuccess(
      ""
    );

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

    setSuccess(
      ""
    );
  }

  async function exportExcel() {
    try {
      setDownloading(
        "xlsx"
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      const fileName =
        await clinicAdminApi
          .downloadDynamicReport(
            appliedFilters,
            "xlsx"
          );

      setSuccess(
        `${fileName} generated from the currently applied report parameters.`
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
        "Could not export the Excel workbook."
      );
    } finally {
      setDownloading(
        ""
      );
    }
  }

  async function exportSecurePdf(
    password
  ) {
    try {
      setDownloading(
        "pdf"
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      const fileName =
        await clinicAdminApi
          .downloadSecurePdf(
            appliedFilters,
            password
          );

      setPasswordOpen(
        false
      );

      setSuccess(
        `${fileName} generated as a password-protected PDF.`
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
        "Could not export the encrypted PDF."
      );
    } finally {
      setDownloading(
        ""
      );
    }
  }

  const rows =
    safeArray(
      preview?.rows
    );

  const columns =
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

  const metrics =
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
            preview?.reportType ||
            "Filtered report",
        })
      );

  const appliedItems = [
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

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clinic reporting"
        title="Reports"
        description="Build formal clinic reports from live data. The preview, Excel workbook and encrypted PDF all use the same applied parameters."
        meta={
          preview ? (
            <>
              <span>
                {
                  preview.clinicName
                }
              </span>

              <span>
                Requested by{" "}
                {
                  preview.requestedBy
                }
              </span>

              <span>
                {rows.length.toLocaleString(
                  "en-ZA"
                )}{" "}
                rows
              </span>
            </>
          ) : null
        }
        actions={
          <>
            <SecondaryButton
              onClick={
                exportExcel
              }
              disabled={
                loading ||
                downloading !==
                  ""
              }
            >
              {downloading ===
              "xlsx" ? (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <FileSpreadsheet
                  size={15}
                />
              )}

              Export Excel
            </SecondaryButton>

            <PrimaryButton
              onClick={
                () =>
                  setPasswordOpen(
                    true
                  )
              }
              disabled={
                loading ||
                downloading !==
                  ""
              }
            >
              <LockKeyhole
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
        description={
          reportDefinition.description
        }
        noPadding
      >
        <form
          onSubmit={
            applyFilters
          }
          className="grid gap-4 px-5 py-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <SelectField
            label="Report type"
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
              {loading ? (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Filter
                  size={15}
                />
              )}

              Apply filters
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
              Reset
            </SecondaryButton>
          </div>
        </form>

        <FilterSummary
          items={
            appliedItems
          }
          onClear={
            clearFilters
          }
        />
      </Panel>

      {preview ? (
        <div className="border border-slate-200 bg-white px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FileText
                size={18}
                className="mt-0.5 text-[#0f766e]"
              />

              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {
                    preview.title
                  }
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {preview.dateFrom &&
                  preview.dateTo
                    ? `${new Date(
                        preview.dateFrom
                      ).toLocaleDateString(
                        "en-ZA"
                      )} – ${new Date(
                        preview.dateTo
                      ).toLocaleDateString(
                        "en-ZA"
                      )}`
                    : "Current-state report"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CalendarRange
                size={14}
              />

              Generated from live clinic data
            </div>
          </div>
        </div>
      ) : null}

      {preview ? (
        <MetricStrip
          metrics={
            metrics
          }
        />
      ) : null}

      {loading &&
      !preview ? (
        <LoadingBlock
          label="Building report preview…"
          minHeight={
            360
          }
        />
      ) : null}

      {preview ? (
        <Panel
          title="Report contents"
          description="Columns change automatically according to the selected report type."
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
          {loading ? (
            <LoadingBlock
              label="Applying report filters…"
              minHeight={
                280
              }
            />
          ) : rows.length ? (
            <DataTable
              columns={
                columns
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
                640
              }
            />
          ) : (
            <div className="p-5">
              <EmptyBlock
                icon={
                  TableProperties
                }
                title="No rows matched these filters"
                description="Change the date range or filter values and apply them again."
              />
            </div>
          )}
        </Panel>
      ) : null}

      {preview ? (
        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={
              exportExcel
            }
            disabled={
              loading ||
              downloading !==
                ""
            }
            className="flex items-center justify-between border border-slate-200 bg-white p-5 text-left transition hover:border-emerald-300 disabled:opacity-50"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Excel workbook
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Filterable data sheet plus report summary using the applied dataset.
              </p>
            </div>

            <Download
              size={18}
              className="text-emerald-700"
            />
          </button>

          <button
            type="button"
            onClick={
              () =>
                setPasswordOpen(
                  true
                )
            }
            disabled={
              loading ||
              downloading !==
                ""
            }
            className="flex items-center justify-between border border-slate-200 bg-white p-5 text-left transition hover:border-[#0f766e] disabled:opacity-50"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Encrypted official PDF
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                PhilaLink-branded report with the logo, page numbering and password protection.
              </p>
            </div>

            <KeyRound
              size={18}
              className="text-[#0f766e]"
            />
          </button>
        </div>
      ) : null}

      <PasswordModal
        open={
          passwordOpen
        }
        onClose={
          () => {
            if (
              downloading !==
              "pdf"
            ) {
              setPasswordOpen(
                false
              );
            }
          }
        }
        onExport={
          exportSecurePdf
        }
        pending={
          downloading ===
          "pdf"
        }
      />
    </div>
  );
}
