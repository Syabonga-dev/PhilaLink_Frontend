import {
  useState,
} from "react";
import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import {
  EmptyState,
  ErrorState,
} from "../../components/ui/EmptyState.jsx";
import { useApi } from "../../lib/useApi.js";
import { adminApi } from "../../services/api/admin.js";

function formatDate(
  value
) {
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
    return value;
  }

  return date.toLocaleString(
    "en-ZA"
  );
}

export default function AdminAuditLogPage() {
  const [
    search,
    setSearch,
  ] = useState("");

  const {
    data,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      adminApi.getAuditLog(),
    []
  );

  const logs =
    Array.isArray(data)
      ? data
      : [];

  const term =
    search
      .trim()
      .toLowerCase();

  const filtered =
    logs.filter((log) =>
      !term
        ? true
        : [
            log.action,
            log.performedBy,
            log.details,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  term
                )
            )
    );

  return (
    <Card>
      <CardHeader
        title="Audit log"
        subtitle={`${filtered.length} visible log${
          filtered.length ===
          1
            ? ""
            : "s"
        }`}
      />

      <CardBody className="pt-0">
        <div className="mb-4">
          <Input
            placeholder="Search action, user or details…"
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
          />
        </div>

        {loading ? (
          <div className="py-10">
            <Spinner label="Loading audit log…" />
          </div>
        ) : error ? (
          <ErrorState
            description={
              error.message
            }
            onRetry={
              refetch
            }
          />
        ) : filtered.length ===
          0 ? (
          <EmptyState
            icon="history"
            title="No audit entries found"
            description={
              search
                ? "Try a different search."
                : "There are no visible audit records."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">
                  <th className="py-2 pr-4 font-medium">
                    Date
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Action
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Performed by
                  </th>

                  <th className="py-2 font-medium">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-outline-variant/50">
                {filtered.map(
                  (log) => (
                    <tr
                      key={
                        log.id
                      }
                    >
                      <td className="whitespace-nowrap py-3 pr-4 text-on-surface-variant">
                        {formatDate(
                          log.timestamp
                        )}
                      </td>

                      <td className="py-3 pr-4 font-semibold text-on-surface">
                        {log.action ||
                          "—"}
                      </td>

                      <td className="py-3 pr-4 text-on-surface-variant">
                        {log.performedBy ||
                          "—"}
                      </td>

                      <td className="py-3 text-on-surface-variant">
                        {log.details ||
                          "—"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}