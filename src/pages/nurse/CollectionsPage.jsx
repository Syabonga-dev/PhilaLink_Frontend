import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  nursesApi,
} from "../../services/api/nurses.js";

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
    return "—";
  }

  return date.toLocaleDateString(
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

export default function CollectionsPage() {
  const [
    collections,
    setCollections,
  ] =
    useState([]);

  const [
    summary,
    setSummary,
  ] =
    useState(null);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState(
      "active"
    );

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
    message,
    setMessage,
  ] =
    useState("");

  const [
    selected,
    setSelected,
  ] =
    useState(null);

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    completing,
    setCompleting,
  ] =
    useState(false);

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

          const [
            records,
            totals,
          ] =
            await Promise.all([
              nursesApi
                .getCollections(),

              nursesApi
                .getCollectionSummary(),
            ]);

          setCollections(
            Array.isArray(
              records
            )
              ? records
              : []
          );

          setSummary(
            totals
          );
        } catch (loadError) {
          setError(
            loadError?.message ||
              "Could not load medication collections."
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
      load();
    },
    [
      load,
    ]
  );

  const filtered =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        return collections.filter(
          (
            collection
          ) => {
            const collectionStatus =
              String(
                collection.status ||
                  ""
              ).toLowerCase();

            const active =
              ![
                "collected",
                "cancelled",
              ].includes(
                collectionStatus
              );

            const matchesStatus =
              status ===
                "all" ||
              (
                status ===
                  "active" &&
                active
              ) ||
              collectionStatus ===
                status;

            const matchesSearch =
              !term ||
              [
                collection.patientName,
                collection.medicationName,
                collection.clinicName,
                collection.proxyName,
              ]
                .filter(Boolean)
                .some(
                  (
                    value
                  ) =>
                    String(
                      value
                    )
                      .toLowerCase()
                      .includes(
                        term
                      )
                );

            return (
              matchesStatus &&
              matchesSearch
            );
          }
        );
      },
      [
        collections,
        search,
        status,
      ]
    );

  async function complete(
    event
  ) {
    event.preventDefault();

    if (!selected) {
      return;
    }

    try {
      setCompleting(
        true
      );

      setError(
        ""
      );

      await nursesApi
        .completeCollection(
          selected.id,
          {
            proxyId:
              selected.proxyId ??
              null,

            notes:
              notes ||
              null,
          }
        );

      setSelected(
        null
      );

      setNotes(
        ""
      );

      setMessage(
        "Medication collection completed successfully."
      );

      await load();
    } catch (actionError) {
      setError(
        actionError?.message ||
          "Could not complete collection."
      );
    } finally {
      setCompleting(
        false
      );
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1500px]">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Medication collections
            </h2>

            <p className="mt-1 text-sm text-[#64748b]">
              Process medication handed to patients or authorised Proxies.
            </p>

          </div>

          <button
            type="button"
            onClick={
              load
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569]"
          >
            <RefreshCw
              size={16}
            />

            Refresh
          </button>

        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <Summary
            label="Due today"
            value={
              summary?.dueToday ??
              0
            }
          />

          <Summary
            label="Overdue"
            value={
              summary?.overdue ??
              0
            }
            danger
          />

          <Summary
            label="Collected this week"
            value={
              summary?.collectedThisWeek ??
              0
            }
          />

          <Summary
            label="Active medication"
            value={
              summary?.totalActive ??
              0
            }
          />

        </div>

        {message && (
          <div className="mb-5 rounded-xl bg-[#f0fdf4] p-4 text-sm text-[#166534]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">

          <div className="flex flex-col gap-3 border-b border-[#e2e8f0] p-4 sm:flex-row">

            <div className="relative flex-1">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              />

              <input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search patient or medication..."
                className="h-11 w-full rounded-xl border border-[#cbd5e1] pl-10 pr-4 text-sm outline-none focus:border-[#0f766e]"
              />

            </div>

            <select
              value={
                status
              }
              onChange={(
                event
              ) =>
                setStatus(
                  event.target.value
                )
              }
              className="h-11 rounded-xl border border-[#cbd5e1] px-3 text-sm"
            >
              <option value="active">
                Active
              </option>

              <option value="overdue">
                Overdue
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="collected">
                Collected
              </option>

              <option value="cancelled">
                Cancelled
              </option>

              <option value="all">
                All
              </option>
            </select>

          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#64748b]">
              Loading collections...
            </div>
          ) : filtered.length ===
            0 ? (
            <div className="p-12 text-center text-sm text-[#64748b]">
              No collections found.
            </div>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">

              {filtered.map(
                (
                  collection
                ) => {
                  const complete =
                    String(
                      collection.status
                    ).toLowerCase() ===
                    "collected";

                  const cancelled =
                    String(
                      collection.status
                    ).toLowerCase() ===
                    "cancelled";

                  return (
                    <div
                      key={
                        collection.id
                      }
                      className="p-5"
                    >

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              {collection.patientName}
                            </h3>

                            <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] font-semibold text-[#475569]">
                              {collection.status}
                            </span>

                          </div>

                          <p className="mt-2 text-sm text-[#475569]">
                            {collection.medicationName ||
                              "Medication"}
                          </p>

                          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#64748b]">
                            <Clock3
                              size={13}
                            />

                            Collection date:{" "}
                            {formatDate(
                              collection.scheduledCollectionDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-[#64748b]">
                            Collector:{" "}
                            {collection.proxyName
                              ? `Proxy · ${collection.proxyName}`
                              : "Patient"}
                          </p>

                        </div>

                        {!complete &&
                          !cancelled && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(
                                collection
                              );

                              setNotes(
                                ""
                              );
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#115e59]"
                          >
                            <CheckCircle2
                              size={16}
                            />

                            Mark collected
                          </button>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/40 p-4">

          <form
            onSubmit={
              complete
            }
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
          >

            <div className="flex items-center justify-between border-b border-[#e2e8f0] p-5">

              <div>

                <h3 className="font-semibold">
                  Complete collection
                </h3>

                <p className="mt-1 text-xs text-[#64748b]">
                  {selected.patientName}
                  {" · "}
                  {selected.medicationName}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(
                    null
                  )
                }
              >
                <X
                  size={18}
                />
              </button>

            </div>

            <div className="p-5">

              <div className="rounded-xl bg-[#f8fafc] p-4 text-sm text-[#475569]">

                <p>
                  Collected by:{" "}
                  <strong>
                    {selected.proxyName ||
                      "Patient"}
                  </strong>
                </p>

                <p className="mt-2">
                  Scheduled:{" "}
                  <strong>
                    {formatDate(
                      selected.scheduledCollectionDate
                    )}
                  </strong>
                </p>

              </div>

              <label className="mb-2 mt-5 block text-sm font-medium text-[#334155]">
                Collection notes
              </label>

              <textarea
                rows={3}
                value={
                  notes
                }
                onChange={(
                  event
                ) =>
                  setNotes(
                    event.target
                      .value
                  )
                }
                className="w-full rounded-xl border border-[#cbd5e1] px-3 py-3 text-sm outline-none focus:border-[#0f766e]"
              />

              <p className="mt-3 text-xs leading-5 text-[#64748b]">
                Completing the collection automatically deducts the collected quantity from clinic stock.
              </p>

              <div className="mt-5 flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setSelected(
                      null
                    )
                  }
                  className="rounded-xl border border-[#cbd5e1] px-4 py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    completing
                  }
                  className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {completing
                    ? "Completing..."
                    : "Confirm collection"}
                </button>

              </div>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}

function Summary({
  label,
  value,
  danger = false,
}) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">

      <PackageCheck
        size={18}
        className={
          danger
            ? "text-[#dc2626]"
            : "text-[#0f766e]"
        }
      />

      <p
        className={[
          "mt-4 text-2xl font-bold",
          danger
            ? "text-[#dc2626]"
            : "text-[#0f172a]",
        ].join(
          " "
        )}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-[#64748b]">
        {label}
      </p>

    </div>
  );
}
