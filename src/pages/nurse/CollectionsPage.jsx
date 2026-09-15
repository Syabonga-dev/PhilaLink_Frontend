import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import {
  ErrorState,
  EmptyState,
} from "../../components/ui/EmptyState.jsx";
import StatusChip from "../../components/ui/StatusChip.jsx";
import { useApi } from "../../lib/useApi.js";
import { collectionsApi } from "../../services/api/clinics.js";
import { useToast } from "../../components/ui/Toast.jsx";

function statusTone(status) {
  switch (status) {
    case "Collected":
      return "success-soft";

    case "Overdue":
      return "error-soft";

    case "Pending":
      return "warning-soft";

    case "Cancelled":
      return "neutral";

    default:
      return "neutral";
  }
}

export default function CollectionsPage() {
  const {
    data: summary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useApi(
    () => collectionsApi.getSummary(),
    []
  );

  const {
    data: collections,
    loading,
    error,
    refetch,
    setData,
  } = useApi(
    () => collectionsApi.list(),
    []
  );

  const toast = useToast();

  const SUMMARY_CARDS = [
    {
      key: "dueToday",
      label: "Due today",
      icon: "today",
    },
    {
      key: "overdue",
      label: "Overdue",
      icon: "warning",
    },
    {
      key: "collectedThisWeek",
      label: "Collected this week",
      icon: "task_alt",
    },
    {
      key: "totalActive",
      label: "Total active scripts",
      icon: "medication",
    },
  ];

  const collectionList =
    Array.isArray(collections)
      ? collections
      : [];

  const markCollected = async (id) => {
    try {
      const updated =
        await collectionsApi.markCollected(
          id,
          {
            proxyId: null,
            notes: null,
          }
        );

      setData((current) =>
        current.map((collection) =>
          collection.id === id
            ? updated
            : collection
        )
      );

      await refetchSummary();

      toast.success(
        "Collection marked as completed."
      );
    } catch (error) {
      console.error(
        "Failed to complete collection:",
        error
      );

      toast.error(
        "Couldn't update this collection."
      );

      refetch();
      refetchSummary();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryLoading ? (
          <div className="col-span-full py-6">
            <Spinner label="Loading collection summary…" />
          </div>
        ) : summaryError ? (
          <div className="col-span-full">
            <ErrorState
              description={
                summaryError.message
              }
              onRetry={
                refetchSummary
              }
            />
          </div>
        ) : (
          SUMMARY_CARDS.map(
            (item) => (
              <Card
                key={item.key}
                className="p-5"
              >
                <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-md bg-primary-container/10 text-primary">
                  {item.icon}
                </span>

                <p className="mt-3 text-2xl font-bold text-on-surface">
                  {summary?.[
                    item.key
                  ] ?? 0}
                </p>

                <p className="text-xs text-on-surface-variant">
                  {item.label}
                </p>
              </Card>
            )
          )
        )}
      </div>

      <Card>
        <CardHeader
          title="Medication collections"
          subtitle="All scheduled and past collections"
        />

        <CardBody className="pt-0">
          {loading ? (
            <div className="py-10">
              <Spinner label="Loading collections…" />
            </div>
          ) : error ? (
            <ErrorState
              description={
                error.message
              }
              onRetry={refetch}
            />
          ) : collectionList.length ===
            0 ? (
            <EmptyState
              icon="inventory_2"
              title="No collections scheduled"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">
                    <th className="py-2 pr-4 font-medium">
                      Patient
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Medication
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Date
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Status
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Processed by
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-outline-variant/50">
                  {collectionList.map(
                    (collection) => (
                      <tr
                        key={
                          collection.id
                        }
                      >
                        <td className="py-3 pr-4 font-semibold text-on-surface">
                          {
                            collection.patientName
                          }
                        </td>

                        <td className="py-3 pr-4 text-on-surface-variant">
                          {collection.medicationName ||
                            "—"}
                        </td>

                        <td className="py-3 pr-4 text-on-surface-variant">
                          {collection.date ||
                            "—"}
                        </td>

                        <td className="py-3 pr-4">
                          <StatusChip
                            tone={statusTone(
                              collection.status
                            )}
                          >
                            {
                              collection.status
                            }
                          </StatusChip>
                        </td>

                        <td className="py-3 pr-4 text-on-surface-variant">
                          {collection.processedByNurseName ||
                            "—"}
                        </td>

                        <td className="py-3 pr-4">
                          {collection.status ===
                            "Pending" ||
                          collection.status ===
                            "Overdue" ? (
                            <button
                              type="button"
                              onClick={() =>
                                markCollected(
                                  collection.id
                                )
                              }
                              className="text-xs font-semibold text-primary hover:underline"
                            >
                              Mark collected
                            </button>
                          ) : (
                            <span className="text-xs text-on-surface-variant">
                              —
                            </span>
                          )}
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
    </div>
  );
}