import {
  useState,
} from "react";

import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";

import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import {
  ErrorState,
  EmptyState,
} from "../../components/ui/EmptyState.jsx";

import StatusChip from "../../components/ui/StatusChip.jsx";

import {
  useApi,
} from "../../lib/useApi.js";

import {
  collectionsApi,
} from "../../services/api/clinics.js";

import {
  useToast,
} from "../../components/ui/Toast.jsx";

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function statusTone(
  status
) {
  switch (
    status
  ) {
    case "Collected":
      return "success-soft";

    case "Overdue":
      return "error-soft";

    case "Pending":
      return "warning-soft";

    case "Scheduled":
      return "warning-soft";

    case "Cancelled":
      return "neutral";

    default:
      return "neutral";
  }
}

function formatDate(
  value
) {
  if (
    !value
  ) {
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
    return value;
  }

  return date
    .toLocaleDateString(
      "en-ZA",
      {
        day:
          "2-digit",

        month:
          "short",

        year:
          "numeric",
      }
    );
}

const SUMMARY_CARDS = [
  {
    key:
      "dueToday",

    label:
      "Due today",

    icon:
      "today",
  },

  {
    key:
      "overdue",

    label:
      "Overdue",

    icon:
      "warning",
  },

  {
    key:
      "collectedThisWeek",

    label:
      "Collected this week",

    icon:
      "task_alt",
  },

  {
    key:
      "totalActive",

    label:
      "Active medication scripts",

    icon:
      "medication",
  },
];

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function CollectionsPage() {
  const [
    workingId,
    setWorkingId,
  ] =
    useState(
      null
    );

  const {
    data:
      summary,

    loading:
      summaryLoading,

    error:
      summaryError,

    refetch:
      refetchSummary,
  } =
    useApi(
      () =>
        collectionsApi
          .getSummary(),
      []
    );

  const {
    data:
      collections,

    loading,

    error,

    refetch,

    setData,
  } =
    useApi(
      () =>
        collectionsApi
          .list(),
      []
    );

  const toast =
    useToast();

  const collectionList =
    Array.isArray(
      collections
    )
      ? collections
      : [];

  /* ======================================================= */
  /* COMPLETE COLLECTION                                     */
  /* ======================================================= */

  const markCollected =
    async (
      id
    ) => {
      if (
        !id ||
        workingId
      ) {
        return;
      }

      try {
        setWorkingId(
          id
        );

        const updated =
          await collectionsApi
            .markCollected(
              id,
              {
                proxyId:
                  null,

                notes:
                  null,
              }
            );

        setData(
          (
            current
          ) =>
            Array.isArray(
              current
            )
              ? current.map(
                  (
                    collection
                  ) =>
                    collection.id ===
                    id
                      ? updated
                      : collection
                )
              : []
        );

        await refetchSummary();

        toast.success(
          "Collection marked as completed."
        );
      } catch (
        updateError
      ) {
        console.error(
          "Failed to complete collection:",
          updateError
        );

        toast.error(
          updateError?.message ||
            "Couldn't update this collection."
        );

        await Promise.allSettled(
          [
            refetch(),
            refetchSummary(),
          ]
        );
      } finally {
        setWorkingId(
          null
        );
      }
    };

  return (
    <div className="space-y-6">

      {/* =================================================== */}
      {/* SUMMARY                                             */}
      {/* =================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {summaryLoading ? (
          <div className="col-span-full py-6">

            <Spinner label="Loading collection summary…" />

          </div>
        ) : summaryError ? (
          <div className="col-span-full">

            <ErrorState
              description={
                summaryError
                  .message
              }
              onRetry={
                refetchSummary
              }
            />

          </div>
        ) : (
          SUMMARY_CARDS.map(
            (
              item
            ) => (
              <Card
                key={
                  item.key
                }
                className="p-5"
              >

                <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-md bg-primary-container/10 text-primary">
                  {
                    item.icon
                  }
                </span>

                <p className="mt-3 text-2xl font-bold text-on-surface">
                  {summary?.[
                    item.key
                  ] ??
                    0}
                </p>

                <p className="mt-1 text-xs text-on-surface-variant">
                  {
                    item.label
                  }
                </p>

              </Card>
            )
          )
        )}

      </div>

      {/* =================================================== */}
      {/* COLLECTION LIST                                     */}
      {/* =================================================== */}

      <Card>

        <CardHeader
          title="Medication collections"
          subtitle="Scheduled and completed collections for your clinic"
        />

        <CardBody className="pt-0">

          {loading ? (
            <div className="py-12">

              <Spinner label="Loading collections…" />

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
          ) : collectionList.length ===
            0 ? (
            <EmptyState
              icon="inventory_2"
              title="No collections scheduled"
              description="There are currently no medication collections for your clinic."
            />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead>

                  <tr className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">

                    <th className="py-3 pr-4 font-medium">
                      Patient
                    </th>

                    <th className="py-3 pr-4 font-medium">
                      Medication
                    </th>

                    <th className="py-3 pr-4 font-medium">
                      Collection date
                    </th>

                    <th className="py-3 pr-4 font-medium">
                      Status
                    </th>

                    <th className="py-3 pr-4 font-medium">
                      Processed by
                    </th>

                    <th className="py-3 text-right font-medium">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-outline-variant/50">

                  {collectionList.map(
                    (
                      collection
                    ) => {
                      const canComplete =
                        collection.status ===
                          "Pending" ||
                        collection.status ===
                          "Overdue" ||
                        collection.status ===
                          "Scheduled";

                      return (
                        <tr
                          key={
                            collection.id
                          }
                          className="transition-colors hover:bg-surface-container-low"
                        >

                          <td className="py-4 pr-4">

                            <p className="font-semibold text-on-surface">
                              {
                                collection.patientName
                              }
                            </p>

                          </td>

                          <td className="py-4 pr-4 text-on-surface-variant">
                            {collection.medicationName ||
                              "—"}
                          </td>

                          <td className="py-4 pr-4 text-on-surface-variant">
                            {
                              formatDate(
                                collection.scheduledCollectionDate ||
                                  collection.date
                              )
                            }
                          </td>

                          <td className="py-4 pr-4">

                            <StatusChip
                              tone={
                                statusTone(
                                  collection.status
                                )
                              }
                            >
                              {collection.status ||
                                "Unknown"}
                            </StatusChip>

                          </td>

                          <td className="py-4 pr-4 text-on-surface-variant">
                            {collection.processedByNurseName ||
                              "—"}
                          </td>

                          <td className="py-4 text-right">

                            {canComplete ? (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  markCollected(
                                    collection.id
                                  )
                                }
                                loading={
                                  workingId ===
                                  collection.id
                                }
                                disabled={
                                  workingId !==
                                    null &&
                                  workingId !==
                                    collection.id
                                }
                                icon="task_alt"
                              >
                                Mark collected
                              </Button>
                            ) : (
                              <span className="text-xs text-on-surface-variant">
                                —
                              </span>
                            )}

                          </td>

                        </tr>
                      );
                    }
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