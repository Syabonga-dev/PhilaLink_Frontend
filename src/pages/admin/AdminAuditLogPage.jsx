import {
  useMemo,
  useState,
} from "react";

import {
  History,
  RefreshCw,
} from "lucide-react";

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

  return date
    .toLocaleString(
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

export default function AdminAuditLogPage() {
  const [
    search,
    setSearch,
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

  const filtered =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        if (!term) {
          return logs;
        }

        return logs.filter(
          log =>
            [
              log.action,
              log.performedBy,
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
              )
        );
      },
      [
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

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Governance"
        title="Audit log"
        description="Review recorded administrative activity for accountability and operational traceability."
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
        title="Recorded activity"
        description={`${filtered.length.toLocaleString(
          "en-ZA"
        )} visible entr${
          filtered.length ===
          1
            ? "y"
            : "ies"
        }`}
        noPadding
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="max-w-xl">
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
              placeholder="Action, user or details…"
            />
          </div>
        </div>

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
              description={
                search
                  ? "Try a different search term."
                  : "There are no visible audit records."
              }
            />
          </div>
        )}
      </Panel>
    </div>
  );
}
