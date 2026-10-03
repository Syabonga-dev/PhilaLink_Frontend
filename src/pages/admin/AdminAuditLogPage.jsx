import {
  useMemo,
  useState,
} from "react";

import {
  History,
  RefreshCw,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  useApi,
} from "../../lib/useApi.js";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  DataTable,
  EmptyBlock,
  LoadingBlock,
  Notice,
  PageHeader,
  Panel,
  SearchField,
  SecondaryButton,
  SelectField,
} from "../../components/admin/AdminPrimitives.jsx";

function formatDate(
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
    return String(
      value
    );
  }

  return date.toLocaleString(
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

function dateKey(
  value
) {
  if (!value) {
    return "";
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
    return "";
  }

  return date
    .toISOString()
    .slice(
      0,
      10
    );
}

export default function AdminAuditLogPage() {
  const {
    role,
  } =
    useAuth();

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    clinic,
    setClinic,
  ] =
    useState("All");

  const [
    actorRole,
    setActorRole,
  ] =
    useState("All");

  const [
    action,
    setAction,
  ] =
    useState("All");

  const [
    dateFrom,
    setDateFrom,
  ] =
    useState("");

  const [
    dateTo,
    setDateTo,
  ] =
    useState("");

  const {
    data,
    loading,
    error,
    refetch,
  } =
    useApi(
      () =>
        adminApi
          .getAuditLog(),
      []
    );

  const logs =
    Array.isArray(
      data
    )
      ? data
      : [];

  const clinicOptions =
    useMemo(
      () => [
        "All",
        "System-wide",

        ...Array.from(
          new Set(
            logs
              .map(
                item =>
                  item.clinicName
              )
              .filter(
                Boolean
              )
          )
        )
          .sort(),
      ],
      [
        logs,
      ]
    );

  const roleOptions =
    useMemo(
      () => [
        "All",

        ...Array.from(
          new Set(
            logs
              .map(
                item =>
                  item.performedByRole ||
                  "System"
              )
              .filter(
                Boolean
              )
          )
        )
          .sort(),
      ],
      [
        logs,
      ]
    );

  const actionOptions =
    useMemo(
      () => [
        "All",

        ...Array.from(
          new Set(
            logs
              .map(
                item =>
                  item.action
              )
              .filter(
                Boolean
              )
          )
        )
          .sort(),
      ],
      [
        logs,
      ]
    );

  const filtered =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        return logs.filter(
          log => {
            const logDate =
              dateKey(
                log.timestamp
              );

            if (
              dateFrom &&
              logDate &&
              logDate <
                dateFrom
            ) {
              return false;
            }

            if (
              dateTo &&
              logDate &&
              logDate >
                dateTo
            ) {
              return false;
            }

            if (
              clinic !==
                "All" &&
              (
                clinic ===
                "System-wide"
                  ? Boolean(
                      log.clinicId
                    )
                  : log.clinicName !==
                    clinic
              )
            ) {
              return false;
            }

            if (
              actorRole !==
                "All" &&
              (
                log.performedByRole ||
                "System"
              ) !==
                actorRole
            ) {
              return false;
            }

            if (
              action !==
                "All" &&
              log.action !==
                action
            ) {
              return false;
            }

            if (!term) {
              return true;
            }

            return [
              log.action,
              log.performedBy,
              log.performedByRole,
              log.clinicName,
              log.details,
            ]
              .filter(
                Boolean
              )
              .some(
                value =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      term
                    )
              );
          }
        );
      },
      [
        action,
        actorRole,
        clinic,
        dateFrom,
        dateTo,
        logs,
        search,
      ]
    );

  const columns = [
    {
      key:
        "timestamp",

      label:
        "Date / time",

      render:
        value => (
          <span className="whitespace-nowrap text-slate-500">
            {formatDate(
              value
            )}
          </span>
        ),
    },

    {
      key:
        "action",

      label:
        "Action",

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
        "performedBy",

      label:
        "Performed by",

      render:
        (
          value,
          row
        ) => (
          <div>
            <p className="font-medium text-slate-800">
              {value ||
                "System"}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {row.performedByRole ||
                "System"}
            </p>
          </div>
        ),
    },

    {
      key:
        "clinicName",

      label:
        "Clinic",

      render:
        (
          value,
          row
        ) =>
          row.clinicId
            ? value ||
              "Clinic"
            : "System-wide",
    },

    {
      key:
        "details",

      label:
        "Details",

      render:
        value => (
          <span className="block max-w-[560px] whitespace-normal leading-5">
            {value ||
              "—"}
          </span>
        ),
    },
  ];

  function clearFilters() {
    setSearch(
      ""
    );

    setClinic(
      "All"
    );

    setActorRole(
      "All"
    );

    setAction(
      "All"
    );

    setDateFrom(
      ""
    );

    setDateTo(
      ""
    );
  }

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow="Governance"
        title="Audit log"
        description={
          role ===
          "SuperAdmin"
            ? "Review system-wide privileged and clinical activity for accountability and operational traceability."
            : "Review recorded administrative activity within your clinic scope."
        }
        meta={
          <span>
            {filtered.length.toLocaleString(
              "en-ZA"
            )}{" "}
            visible entries
          </span>
        }
        actions={
          <SecondaryButton
            onClick={
              refetch
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
          {error.message ||
            "Could not load the audit log."}
        </Notice>
      ) : null}

      <Panel
        title="Audit filters"
        description="Narrow the audit history by date, clinic, actor role, action or free-text search."
        noPadding
      >

        <div className="grid gap-4 px-5 py-4 md:grid-cols-2 xl:grid-cols-4">

          <div>
            <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
              Search
            </span>

            <SearchField
              value={
                search
              }
              onChange={
                event =>
                  setSearch(
                    event.target
                      .value
                  )
              }
              placeholder="Action, user, clinic or details…"
            />
          </div>

          {role ===
          "SuperAdmin" ? (
            <SelectField
              label="Clinic"
              value={
                clinic
              }
              onChange={
                event =>
                  setClinic(
                    event.target
                      .value
                  )
              }
              options={
                clinicOptions
              }
            />
          ) : null}

          <SelectField
            label="Actor role"
            value={
              actorRole
            }
            onChange={
              event =>
                setActorRole(
                  event.target
                    .value
                )
            }
            options={
              roleOptions
            }
          />

          <SelectField
            label="Action"
            value={
              action
            }
            onChange={
              event =>
                setAction(
                  event.target
                    .value
                )
            }
            options={
              actionOptions
            }
          />

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
              From
            </span>

            <input
              type="date"
              value={
                dateFrom
              }
              onChange={
                event =>
                  setDateFrom(
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
                dateTo
              }
              onChange={
                event =>
                  setDateTo(
                    event.target
                      .value
                  )
              }
              className="h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0f766e]"
            />
          </label>

          <div className="flex items-end">
            <SecondaryButton
              type="button"
              onClick={
                clearFilters
              }
              className="w-full"
            >
              Clear filters
            </SecondaryButton>
          </div>

        </div>

      </Panel>

      <Panel
        title="Recorded activity"
        description={`${filtered.length.toLocaleString(
          "en-ZA"
        )} entr${
          filtered.length ===
          1
            ? "y"
            : "ies"
        } match the current filters.`}
        noPadding
      >

        {loading ? (
          <LoadingBlock
            label="Loading audit log…"
            minHeight={
              320
            }
          />
        ) : filtered.length ? (
          <DataTable
            columns={
              columns
            }
            rows={
              filtered
            }
            rowKey={
              row =>
                row.id
            }
            maxHeight={
              680
            }
          />
        ) : (
          <div className="p-5">
            <EmptyBlock
              icon={
                History
              }
              title="No audit entries found"
              description="Change the filters or refresh the audit history."
            />
          </div>
        )}

      </Panel>

    </div>
  );
}
