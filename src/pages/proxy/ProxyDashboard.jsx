import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  History,
  MapPin,
  PackageCheck,
  Pill,
  RefreshCw,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  proxiesApi,
} from "../../services/api/proxies.js";

import {
  CollectionStatus,
  formatDate,
  formatDateRange,
  formatLongDate,
  getCollectionStatusKey,
  getNextWeekRange,
  parseDate,
  toApiDate,
} from "./ProxyUtils.jsx";

/* ========================================================= */
/* CONSTANTS                                                 */
/* ========================================================= */

const VALID_RANGES =
  new Set([
    "today",
    "tomorrow",
    "next-week",
    "custom",
  ]);

const MAX_DASHBOARD_COLLECTIONS =
  6;

const MAX_DASHBOARD_PATIENTS =
  5;

const MAX_ACTIVITY =
  5;

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function getInitials(
  name
) {
  const parts =
    String(
      name || ""
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length ===
    0
  ) {
    return "PT";
  }

  if (
    parts.length ===
    1
  ) {
    return parts[0]
      .slice(
        0,
        2
      )
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`
    .toUpperCase();
}

function getActivityDate(
  collection
) {
  return (
    parseDate(
      collection
        ?.collectedAt
    ) ||
    parseDate(
      collection
        ?.scheduledCollectionDate
    )
  );
}

function getActivityLabel(
  collection
) {
  const key =
    getCollectionStatusKey(
      collection
    );

  if (
    key ===
    "collected"
  ) {
    return collection
      ?.proxyName
      ? `Collected by ${collection.proxyName}`
      : "Collected by patient";
  }

  if (
    key ===
    "cancelled"
  ) {
    return "Collection cancelled";
  }

  return "Collection updated";
}

function formatRefreshTime(
  value
) {
  if (!value) {
    return "Not yet refreshed";
  }

  return `Updated ${value.toLocaleTimeString(
    "en-ZA",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;
}

function dateOnlyForDisplay(
  value
) {
  if (!value) {
    return null;
  }

  return new Date(
    `${value}T12:00:00`
  );
}

function getMedicationSummary(
  collection
) {
  const items =
    Array.isArray(
      collection?.items
    )
      ? collection.items
      : [];

  if (
    items.length ===
    1
  ) {
    const item =
      items[0];

    return [
      item.medicationName,
      item.dosage,
      item.form,
    ]
      .filter(Boolean)
      .join(" · ");
  }

  if (
    items.length >
    1
  ) {
    return (
      collection
        ?.medicationName ||
      `${items.length} medications`
    );
  }

  return (
    collection
      ?.medicationName ||
    "Medication collection"
  );
}

function getEmptyCopy(
  range,
  customFrom,
  customTo
) {
  if (
    range ===
    "today"
  ) {
    return {
      title:
        "Nothing due today",
      description:
        "None of your linked patients has an active medication collection scheduled for today.",
    };
  }

  if (
    range ===
    "tomorrow"
  ) {
    return {
      title:
        "Nothing scheduled for tomorrow",
      description:
        "There are no active patient collections scheduled for tomorrow.",
    };
  }

  if (
    range ===
    "next-week"
  ) {
    return {
      title:
        "No collections next week",
      description:
        "There are no active patient collections scheduled for next calendar week.",
    };
  }

  if (
    range ===
      "custom" &&
    (!customFrom ||
      !customTo)
  ) {
    return {
      title:
        "Choose a date range",
      description:
        "Select a start and end date to view active patient collections for that period.",
    };
  }

  return {
    title:
      "No collections in this range",
    description:
      "There are no active patient collections matching the selected dates and search.",
  };
}

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function ProxyDashboard() {
  const navigate =
    useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const {
    user,
  } = useAuth();

  const urlRange =
    searchParams.get(
      "range"
    );

  const selectedRange =
    VALID_RANGES.has(
      urlRange
    )
      ? urlRange
      : "today";

  const customFrom =
    searchParams.get(
      "from"
    ) || "";

  const customTo =
    searchParams.get(
      "to"
    ) || "";

  const urlSearch =
    searchParams.get(
      "q"
    ) || "";

  const [
    searchInput,
    setSearchInput,
  ] = useState(
    urlSearch
  );

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState(
    urlSearch
  );

  const [
    customFromDraft,
    setCustomFromDraft,
  ] = useState(
    customFrom
  );

  const [
    customToDraft,
    setCustomToDraft,
  ] = useState(
    customTo
  );

  const [
    customError,
    setCustomError,
  ] = useState("");

  const [
    care,
    setCare,
  ] = useState(null);

  const [
    collections,
    setCollections,
  ] = useState([]);

  const [
    recentActivity,
    setRecentActivity,
  ] = useState([]);

  const [
    careLoading,
    setCareLoading,
  ] = useState(true);

  const [
    collectionsLoading,
    setCollectionsLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    careError,
    setCareError,
  ] = useState("");

  const [
    collectionsError,
    setCollectionsError,
  ] = useState("");

  const [
    activityError,
    setActivityError,
  ] = useState("");

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(null);

  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState(null);

  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false);

  const [
    detailError,
    setDetailError,
  ] = useState("");

  /* ===================================================== */
  /* URL / INPUT SYNC                                      */
  /* ===================================================== */

  useEffect(
    () => {
      if (
        urlSearch !==
        searchInput
      ) {
        setSearchInput(
          urlSearch
        );

        setDebouncedSearch(
          urlSearch
        );
      }
    },
    [
      urlSearch,
    ]
  );

  useEffect(
    () => {
      if (
        selectedRange !==
        "custom"
      ) {
        return;
      }

      setCustomFromDraft(
        customFrom
      );

      setCustomToDraft(
        customTo
      );
    },
    [
      selectedRange,
      customFrom,
      customTo,
    ]
  );

  useEffect(
    () => {
      const timer =
        window.setTimeout(
          () => {
            const value =
              searchInput
                .trim();

            setDebouncedSearch(
              value
            );

            setSearchParams(
              (previous) => {
                const next =
                  new URLSearchParams(
                    previous
                  );

                if (value) {
                  next.set(
                    "q",
                    value
                  );
                } else {
                  next.delete(
                    "q"
                  );
                }

                return next;
              },
              {
                replace:
                  true,
              }
            );
          },
          300
        );

      return () =>
        window.clearTimeout(
          timer
        );
    },
    [
      searchInput,
      setSearchParams,
    ]
  );

  /* ===================================================== */
  /* NEXT WEEK                                             */
  /* ===================================================== */

  const nextWeek =
    useMemo(
      () =>
        getNextWeekRange(),
      []
    );

  const nextWeekLabel =
    useMemo(
      () =>
        formatDateRange(
          nextWeek.start,
          nextWeek.end
        ),
      [
        nextWeek,
      ]
    );

  /* ===================================================== */
  /* FILTER QUERY                                          */
  /* ===================================================== */

  const collectionQuery =
    useMemo(
      () => {
        const base = {
          search:
            debouncedSearch ||
            undefined,

          sort:
            "scheduled-asc",
        };

        if (
          selectedRange ===
          "today"
        ) {
          return {
            ...base,
            status:
              "today",
          };
        }

        if (
          selectedRange ===
          "tomorrow"
        ) {
          return {
            ...base,
            status:
              "tomorrow",
          };
        }

        if (
          selectedRange ===
          "next-week"
        ) {
          return {
            ...base,

            status:
              "pending",

            from:
              toApiDate(
                nextWeek.start
              ),

            to:
              toApiDate(
                nextWeek.end
              ),
          };
        }

        if (
          selectedRange ===
          "custom"
        ) {
          if (
            !customFrom ||
            !customTo
          ) {
            return null;
          }

          return {
            ...base,

            status:
              "pending",

            from:
              customFrom,

            to:
              customTo,
          };
        }

        return base;
      },
      [
        selectedRange,
        customFrom,
        customTo,
        debouncedSearch,
        nextWeek,
      ]
    );

  /* ===================================================== */
  /* LOAD CARE + ACTIVITY                                  */
  /* ===================================================== */

  const loadCareAndActivity =
    useCallback(
      async ({
        showLoading =
          true,
      } = {}) => {
        if (
          showLoading
        ) {
          setCareLoading(
            true
          );
        }

        setCareError("");
        setActivityError("");

        const [
          careResult,
          collectedResult,
          cancelledResult,
        ] =
          await Promise.allSettled(
            [
              proxiesApi
                .getCare(),

              proxiesApi
                .getCollections({
                  status:
                    "collected",

                  sort:
                    "scheduled-desc",
                }),

              proxiesApi
                .getCollections({
                  status:
                    "cancelled",

                  sort:
                    "scheduled-desc",
                }),
            ]
          );

        if (
          careResult.status ===
          "fulfilled"
        ) {
          setCare(
            careResult.value || {
              patients:
                [],
            }
          );

          setLastUpdated(
            new Date()
          );
        } else {
          setCareError(
            careResult.reason
              ?.message ||
              "We could not load your Proxy care overview."
          );
        }

        const activity =
          [];

        if (
          collectedResult.status ===
            "fulfilled" &&
          Array.isArray(
            collectedResult.value
          )
        ) {
          activity.push(
            ...collectedResult.value
          );
        }

        if (
          cancelledResult.status ===
            "fulfilled" &&
          Array.isArray(
            cancelledResult.value
          )
        ) {
          activity.push(
            ...cancelledResult.value
          );
        }

        activity.sort(
          (
            left,
            right
          ) =>
            (
              getActivityDate(
                right
              )?.getTime() ||
              0
            ) -
            (
              getActivityDate(
                left
              )?.getTime() ||
              0
            )
        );

        setRecentActivity(
          activity.slice(
            0,
            MAX_ACTIVITY
          )
        );

        if (
          collectedResult.status ===
            "rejected" &&
          cancelledResult.status ===
            "rejected"
        ) {
          setActivityError(
            "Recent collection activity could not be loaded."
          );
        }

        setCareLoading(
          false
        );
      },
      []
    );

  /* ===================================================== */
  /* LOAD FILTERED COLLECTIONS                             */
  /* ===================================================== */

  const loadFilteredCollections =
    useCallback(
      async (
        signal
      ) => {
        if (
          !collectionQuery
        ) {
          setCollections([]);
          setCollectionsError("");
          setCollectionsLoading(
            false
          );

          return;
        }

        try {
          setCollectionsLoading(
            true
          );

          setCollectionsError("");

          const result =
            await proxiesApi
              .getCollections({
                ...collectionQuery,
                signal,
              });

          setCollections(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (err) {
          if (
            err?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "Failed to load Proxy collections:",
            err
          );

          setCollectionsError(
            err?.message ||
              "Collections could not be loaded."
          );
        } finally {
          if (
            !signal?.aborted
          ) {
            setCollectionsLoading(
              false
            );
          }
        }
      },
      [
        collectionQuery,
      ]
    );

  /* ===================================================== */
  /* INITIAL LOAD                                          */
  /* ===================================================== */

  useEffect(
    () => {
      loadCareAndActivity();
    },
    [
      loadCareAndActivity,
    ]
  );

  useEffect(
    () => {
      const controller =
        new AbortController();

      loadFilteredCollections(
        controller.signal
      );

      return () =>
        controller.abort();
    },
    [
      loadFilteredCollections,
    ]
  );

  /* ===================================================== */
  /* REFRESH                                               */
  /* ===================================================== */

  const handleRefresh =
    useCallback(
      async () => {
        try {
          setRefreshing(
            true
          );

          await Promise.all([
            loadCareAndActivity({
              showLoading:
                false,
            }),

            loadFilteredCollections(),
          ]);

          setLastUpdated(
            new Date()
          );
        } finally {
          setRefreshing(
            false
          );
        }
      },
      [
        loadCareAndActivity,
        loadFilteredCollections,
      ]
    );

  /* ===================================================== */
  /* RANGE ACTIONS                                         */
  /* ===================================================== */

  function handleRangeChange(
    range
  ) {
    setCustomError("");

    setSearchParams(
      (previous) => {
        const next =
          new URLSearchParams(
            previous
          );

        next.set(
          "range",
          range
        );

        if (
          range !==
          "custom"
        ) {
          next.delete(
            "from"
          );

          next.delete(
            "to"
          );
        }

        return next;
      }
    );
  }

  function applyCustomRange() {
    if (
      !customFromDraft ||
      !customToDraft
    ) {
      setCustomError(
        "Choose both a start and end date."
      );

      return;
    }

    if (
      customFromDraft >
      customToDraft
    ) {
      setCustomError(
        "The end date cannot be before the start date."
      );

      return;
    }

    setCustomError("");

    setSearchParams(
      (previous) => {
        const next =
          new URLSearchParams(
            previous
          );

        next.set(
          "range",
          "custom"
        );

        next.set(
          "from",
          customFromDraft
        );

        next.set(
          "to",
          customToDraft
        );

        return next;
      }
    );
  }

  /* ===================================================== */
  /* COLLECTION DETAILS                                    */
  /* ===================================================== */

  const openCollection =
    useCallback(
      async (
        collection
      ) => {
        setSelectedCollection(
          collection
        );

        setDetailError("");
        setDetailLoading(
          true
        );

        try {
          const result =
            await proxiesApi
              .getCollectionById(
                collection.id
              );

          if (result) {
            setSelectedCollection(
              result
            );
          }
        } catch (err) {
          console.error(
            "Failed to load collection details:",
            err
          );

          setDetailError(
            err?.message ||
              "Some collection details could not be refreshed."
          );
        } finally {
          setDetailLoading(
            false
          );
        }
      },
      []
    );

  function closeCollection() {
    setSelectedCollection(
      null
    );

    setDetailError("");
    setDetailLoading(
      false
    );
  }

  useEffect(
    () => {
      if (
        !selectedCollection
      ) {
        return undefined;
      }

      const previousOverflow =
        document.body
          .style
          .overflow;

      document.body
        .style
        .overflow =
        "hidden";

      const handleKeyDown =
        (event) => {
          if (
            event.key ===
            "Escape"
          ) {
            closeCollection();
          }
        };

      window.addEventListener(
        "keydown",
        handleKeyDown
      );

      return () => {
        document.body
          .style
          .overflow =
          previousOverflow;

        window.removeEventListener(
          "keydown",
          handleKeyDown
        );
      };
    },
    [
      selectedCollection,
    ]
  );

  /* ===================================================== */
  /* DERIVED DATA                                          */
  /* ===================================================== */

  const patients =
    Array.isArray(
      care?.patients
    )
      ? care.patients
      : [];

  const sortedPatients =
    useMemo(
      () =>
        [...patients]
          .sort(
            (
              left,
              right
            ) => {
              const leftDate =
                parseDate(
                  left
                    .nextCollectionDate
                );

              const rightDate =
                parseDate(
                  right
                    .nextCollectionDate
                );

              if (
                leftDate &&
                rightDate
              ) {
                return (
                  leftDate.getTime() -
                  rightDate.getTime()
                );
              }

              if (leftDate) {
                return -1;
              }

              if (rightDate) {
                return 1;
              }

              return String(
                left
                  .patientName ||
                  ""
              ).localeCompare(
                String(
                  right
                    .patientName ||
                    ""
                )
              );
            }
          )
          .slice(
            0,
            MAX_DASHBOARD_PATIENTS
          ),
      [
        patients,
      ]
    );

  const visibleCollections =
    collections.slice(
      0,
      MAX_DASHBOARD_COLLECTIONS
    );

  const fullName =
    user?.fullName ||
    user?.name ||
    "";

  const firstName =
    String(
      fullName
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean)[0] ||
    "";

  const customRangeLabel =
    customFrom &&
    customTo
      ? formatDateRange(
          dateOnlyForDisplay(
            customFrom
          ),
          dateOnlyForDisplay(
            customTo
          )
        )
      : "Custom range";

  const emptyCopy =
    getEmptyCopy(
      selectedRange,
      customFrom,
      customTo
    );

  /* ===================================================== */
  /* INITIAL PAGE STATE                                    */
  /* ===================================================== */

  if (
    careLoading &&
    !care
  ) {
    return (
      <DashboardSkeleton />
    );
  }

  if (
    !care
  ) {
    return (
      <div className="p-lg md:p-xl lg:p-2xl">
        <div className="mx-auto max-w-2xl rounded-xl border border-[#fecaca] bg-white p-xl shadow-sm">
          <div className="flex items-start gap-md">
            <div className="mt-0.5 text-[#dc2626]">
              <AlertCircle
                size={22}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-base font-semibold text-text-primary">
                Dashboard unavailable
              </h1>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {careError ||
                  "Your Proxy care information could not be loaded."}
              </p>

              <button
                type="button"
                onClick={() =>
                  loadCareAndActivity()
                }
                className="mt-lg inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <RefreshCw
                  size={16}
                />

                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===================================================== */
  /* RENDER                                                */
  /* ===================================================== */

  return (
    <>
      <div className="p-lg md:p-xl lg:p-2xl">

        {/* ================================================= */}
        {/* PAGE HEADER                                       */}
        {/* ================================================= */}

        <header className="mb-xl flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-text-primary sm:text-2xl">
              Care overview
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-secondary">
              {firstName && (
                <>
                  <span>
                    {firstName}
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-text-tertiary"
                  >
                    ·
                  </span>
                </>
              )}

              <span>
                Proxy account
              </span>

              {care.clinicName && (
                <>
                  <span
                    aria-hidden="true"
                    className="text-text-tertiary"
                  >
                    ·
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin
                      size={14}
                    />

                    {
                      care.clinicName
                    }
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-md">
            <span className="hidden text-xs text-text-tertiary sm:block">
              {formatRefreshTime(
                lastUpdated
              )}
            </span>

            <button
              type="button"
              disabled={
                refreshing
              }
              onClick={
                handleRefresh
              }
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing"
                : "Refresh"}
            </button>
          </div>
        </header>

        {careError && (
          <div className="mb-lg flex items-start gap-3 rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
            />

            <span>
              {careError}
            </span>
          </div>
        )}

        {/* ================================================= */}
        {/* SUMMARY                                           */}
        {/* ================================================= */}

        <section
          aria-label="Collection overview"
          className="mb-xl grid grid-cols-2 gap-md lg:grid-cols-5"
        >
          <SummaryMetric
            icon={Users}
            label="Linked patients"
            value={
              care.totalPatients ??
              patients.length
            }
            onClick={() =>
              navigate(
                "/proxy/patients"
              )
            }
          />

          <SummaryMetric
            icon={CalendarCheck2}
            label="Due today"
            value={
              care.dueToday ??
              0
            }
            accent={
              (care.dueToday ||
                0) >
              0
                ? "warning"
                : "default"
            }
            onClick={() =>
              handleRangeChange(
                "today"
              )
            }
          />

          <SummaryMetric
            icon={CalendarClock}
            label="Tomorrow"
            value={
              care.tomorrow ??
              0
            }
            onClick={() =>
              handleRangeChange(
                "tomorrow"
              )
            }
          />

          <SummaryMetric
            icon={CalendarDays}
            label="Upcoming"
            value={
              care.upcoming ??
              0
            }
            onClick={() =>
              navigate(
                "/proxy/collections?status=upcoming"
              )
            }
          />

          <SummaryMetric
            icon={AlertCircle}
            label="Overdue"
            value={
              care.overdue ??
              0
            }
            accent={
              (care.overdue ||
                0) >
              0
                ? "danger"
                : "default"
            }
            onClick={() =>
              navigate(
                "/proxy/collections?status=overdue"
              )
            }
          />
        </section>

        {/* ================================================= */}
        {/* NEXT COLLECTIONS                                  */}
        {/* ================================================= */}

        <section className="overflow-hidden rounded-xl border border-border-secondary bg-white shadow-sm">

          <div className="border-b border-border-secondary px-lg py-lg lg:px-xl">
            <div className="flex flex-col gap-md lg:flex-row lg:items-start lg:justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <PackageCheck
                    size={19}
                    className="text-brand-primary"
                  />

                  <h2 className="text-base font-semibold text-text-primary">
                    Next collections
                  </h2>
                </div>

                <p className="mt-1.5 text-sm text-text-secondary">
                  Review upcoming medication collections for patients linked to your account.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/proxy/collections"
                  )
                }
                className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-primary transition hover:opacity-70"
              >
                View all collections

                <ArrowRight
                  size={15}
                />
              </button>

            </div>

            {/* ============================================= */}
            {/* FILTERS                                       */}
            {/* ============================================= */}

            <div className="mt-lg flex flex-col gap-md xl:flex-row xl:items-center xl:justify-between">

              <div className="overflow-x-auto pb-1">
                <div className="flex min-w-max items-center gap-2">
                  <RangeButton
                    active={
                      selectedRange ===
                      "today"
                    }
                    onClick={() =>
                      handleRangeChange(
                        "today"
                      )
                    }
                  >
                    Today
                  </RangeButton>

                  <RangeButton
                    active={
                      selectedRange ===
                      "tomorrow"
                    }
                    onClick={() =>
                      handleRangeChange(
                        "tomorrow"
                      )
                    }
                  >
                    Tomorrow
                  </RangeButton>

                  <RangeButton
                    active={
                      selectedRange ===
                      "next-week"
                    }
                    onClick={() =>
                      handleRangeChange(
                        "next-week"
                      )
                    }
                  >
                    Next week ·{" "}
                    {
                      nextWeekLabel
                    }
                  </RangeButton>

                  <RangeButton
                    active={
                      selectedRange ===
                      "custom"
                    }
                    onClick={() =>
                      handleRangeChange(
                        "custom"
                      )
                    }
                  >
                    <CalendarRange
                      size={14}
                    />

                    {
                      customRangeLabel
                    }
                  </RangeButton>
                </div>
              </div>

              <div className="relative w-full xl:max-w-sm">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />

                <input
                  type="search"
                  value={
                    searchInput
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchInput(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search patient, number or medication"
                  className="h-10 w-full rounded-lg border border-border-secondary bg-white pl-9 pr-9 text-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                />

                {searchInput && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() =>
                      setSearchInput(
                        ""
                      )
                    }
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-text-tertiary transition hover:bg-[#f1f5f9] hover:text-text-primary"
                  >
                    <X
                      size={14}
                    />
                  </button>
                )}
              </div>

            </div>

            {/* ============================================= */}
            {/* CUSTOM RANGE                                  */}
            {/* ============================================= */}

            {selectedRange ===
              "custom" && (
              <div className="mt-md rounded-lg border border-border-secondary bg-[#f8fafc] p-md">
                <div className="flex flex-col gap-md lg:flex-row lg:items-end">

                  <div className="grid flex-1 grid-cols-1 gap-md sm:grid-cols-2">

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-text-secondary">
                        From
                      </span>

                      <input
                        type="date"
                        value={
                          customFromDraft
                        }
                        onChange={(
                          event
                        ) =>
                          setCustomFromDraft(
                            event.target
                              .value
                          )
                        }
                        className="h-10 w-full rounded-lg border border-border-secondary bg-white px-3 text-sm text-text-primary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-text-secondary">
                        To
                      </span>

                      <input
                        type="date"
                        value={
                          customToDraft
                        }
                        onChange={(
                          event
                        ) =>
                          setCustomToDraft(
                            event.target
                              .value
                          )
                        }
                        className="h-10 w-full rounded-lg border border-border-secondary bg-white px-3 text-sm text-text-primary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                      />
                    </label>

                  </div>

                  <button
                    type="button"
                    onClick={
                      applyCustomRange
                    }
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    Apply range
                  </button>

                </div>

                {customError && (
                  <p className="mt-2 text-xs font-medium text-[#b91c1c]">
                    {customError}
                  </p>
                )}

                <p className="mt-2 text-xs text-text-tertiary">
                  The dashboard shows active collections within the selected dates.
                </p>
              </div>
            )}

          </div>

          {/* =============================================== */}
          {/* TABLE HEADER                                    */}
          {/* =============================================== */}

          <div className="hidden grid-cols-12 gap-md border-b border-border-secondary bg-[#f8fafc] px-xl py-2.5 text-xs font-semibold uppercase tracking-[0.04em] text-text-tertiary lg:grid">
            <span className="col-span-4">
              Patient
            </span>

            <span className="col-span-3">
              Medication
            </span>

            <span className="col-span-2">
              Collection
            </span>

            <span className="col-span-2">
              Status
            </span>

            <span className="col-span-1" />
          </div>

          {/* =============================================== */}
          {/* CONTENT                                         */}
          {/* =============================================== */}

          {collectionsLoading ? (
            <CollectionRowsSkeleton />
          ) : collectionsError ? (
            <InlineError
              message={
                collectionsError
              }
              onRetry={() =>
                loadFilteredCollections()
              }
            />
          ) : visibleCollections.length >
            0 ? (
            <>
              <div className="divide-y divide-border-secondary">
                {visibleCollections.map(
                  (
                    collection
                  ) => (
                    <CollectionRow
                      key={
                        collection.id
                      }
                      collection={
                        collection
                      }
                      onOpen={() =>
                        openCollection(
                          collection
                        )
                      }
                    />
                  )
                )}
              </div>

              {collections.length >
                MAX_DASHBOARD_COLLECTIONS && (
                <div className="border-t border-border-secondary bg-[#f8fafc] px-lg py-3 text-center lg:px-xl">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/proxy/collections"
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary transition hover:opacity-70"
                  >
                    View remaining collections

                    <ArrowRight
                      size={14}
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyCollections
              title={
                emptyCopy.title
              }
              description={
                emptyCopy.description
              }
              hasSearch={
                Boolean(
                  debouncedSearch
                )
              }
              onClearSearch={() =>
                setSearchInput(
                  ""
                )
              }
            />
          )}

        </section>

        {/* ================================================= */}
        {/* PATIENTS + ACTIVITY                                */}
        {/* ================================================= */}

        <div className="mt-xl grid grid-cols-1 gap-xl lg:grid-cols-3">

          {/* =============================================== */}
          {/* MY PATIENTS                                     */}
          {/* =============================================== */}

          <section className="overflow-hidden rounded-xl border border-border-secondary bg-white shadow-sm lg:col-span-2">

            <SectionHeading
              icon={Users}
              title="My patients"
              description="Patients currently linked to your Proxy account."
              action="View all"
              onAction={() =>
                navigate(
                  "/proxy/patients"
                )
              }
            />

            {sortedPatients.length >
            0 ? (
              <div className="divide-y divide-border-secondary">
                {sortedPatients.map(
                  (
                    patient
                  ) => (
                    <PatientRow
                      key={
                        patient.proxyLinkId ||
                        patient.patientId
                      }
                      patient={
                        patient
                      }
                      onOpen={() =>
                        navigate(
                          `/proxy/collections?patientId=${patient.patientId}`
                        )
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="px-lg py-2xl text-center">
                <Users
                  size={25}
                  className="mx-auto text-text-tertiary"
                />

                <h3 className="mt-md text-sm font-semibold text-text-primary">
                  No linked patients
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-text-secondary">
                  Patients assigned to your Proxy account by the clinic will appear here.
                </p>
              </div>
            )}

          </section>

          {/* =============================================== */}
          {/* RECENT ACTIVITY                                  */}
          {/* =============================================== */}

          <section className="overflow-hidden rounded-xl border border-border-secondary bg-white shadow-sm">

            <SectionHeading
              icon={History}
              title="Recent activity"
              description="Latest completed and cancelled collection records."
            />

            {activityError ? (
              <div className="px-lg py-xl">
                <div className="flex items-start gap-2 text-sm text-text-secondary">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-[#d97706]"
                  />

                  {
                    activityError
                  }
                </div>
              </div>
            ) : recentActivity.length >
              0 ? (
              <div className="divide-y divide-border-secondary">
                {recentActivity.map(
                  (
                    collection
                  ) => (
                    <ActivityRow
                      key={
                        collection.id
                      }
                      collection={
                        collection
                      }
                      onOpen={() =>
                        openCollection(
                          collection
                        )
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="px-lg py-2xl text-center">
                <History
                  size={24}
                  className="mx-auto text-text-tertiary"
                />

                <h3 className="mt-md text-sm font-semibold text-text-primary">
                  No recent activity
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Completed and cancelled collection records will appear here.
                </p>
              </div>
            )}

          </section>

        </div>

      </div>

      {/* =================================================== */}
      {/* DETAILS DRAWER                                      */}
      {/* =================================================== */}

      {selectedCollection && (
        <CollectionDrawer
          collection={
            selectedCollection
          }
          loading={
            detailLoading
          }
          error={
            detailError
          }
          onClose={
            closeCollection
          }
          onPatient={() =>
            navigate(
              `/proxy/collections?patientId=${selectedCollection.patientId}`
            )
          }
        />
      )}
    </>
  );
}

/* ========================================================= */
/* SUMMARY METRIC                                            */
/* ========================================================= */

function SummaryMetric({
  icon: Icon,
  label,
  value,
  accent = "default",
  onClick,
}) {
  const accents = {
    default: {
      icon:
        "bg-[#f0fdfa] text-[#0f766e]",
      value:
        "text-text-primary",
    },

    warning: {
      icon:
        "bg-[#fffbeb] text-[#d97706]",
      value:
        "text-[#92400e]",
    },

    danger: {
      icon:
        "bg-[#fef2f2] text-[#dc2626]",
      value:
        "text-[#b91c1c]",
    },
  };

  const style =
    accents[accent] ||
    accents.default;

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="group min-h-[104px] rounded-xl border border-border-secondary bg-white p-md text-left shadow-sm transition hover:border-[#99f6e4] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 sm:p-lg"
    >
      <div className="flex items-center justify-between gap-sm">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.icon}`}
        >
          <Icon
            size={17}
          />
        </div>

        <ArrowRight
          size={14}
          className="text-text-tertiary opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      </div>

      <div className="mt-md">
        <p
          className={`text-2xl font-semibold tracking-[-0.03em] ${style.value}`}
        >
          {value ?? 0}
        </p>

        <p className="mt-1 text-xs font-medium text-text-secondary sm:text-sm">
          {label}
        </p>
      </div>
    </button>
  );
}

/* ========================================================= */
/* RANGE BUTTON                                              */
/* ========================================================= */

function RangeButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      aria-pressed={
        active
      }
      onClick={
        onClick
      }
      className={[
        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
        active
          ? "border-brand-primary bg-brand-primary text-white"
          : "border-border-secondary bg-white text-text-secondary hover:border-[#99f6e4] hover:text-text-primary",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ========================================================= */
/* SECTION HEADING                                           */
/* ========================================================= */

function SectionHeading({
  icon: Icon,
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div className="flex items-start justify-between gap-md border-b border-border-secondary px-lg py-lg lg:px-xl">

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Icon
            size={17}
            className="shrink-0 text-brand-primary"
          />

          <h2 className="text-sm font-semibold text-text-primary sm:text-base">
            {title}
          </h2>
        </div>

        <p className="mt-1.5 text-sm leading-5 text-text-secondary">
          {description}
        </p>
      </div>

      {action &&
        onAction && (
        <button
          type="button"
          onClick={
            onAction
          }
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-primary transition hover:opacity-70"
        >
          <span className="hidden sm:inline">
            {action}
          </span>

          <ArrowRight
            size={14}
          />
        </button>
      )}

    </div>
  );
}

/* ========================================================= */
/* COLLECTION ROW                                            */
/* ========================================================= */

function CollectionRow({
  collection,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="group grid w-full grid-cols-1 gap-md px-lg py-lg text-left transition hover:bg-[#f8fafc] focus:outline-none focus-visible:bg-[#f8fafc] lg:grid-cols-12 lg:items-center lg:px-xl"
    >

      {/* PATIENT */}

      <div className="flex min-w-0 items-center gap-3 lg:col-span-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0fdfa] text-xs font-bold text-[#0f766e]">
          {getInitials(
            collection
              .patientName
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">
            {collection.patientName ||
              "Patient"}
          </p>

          <p className="mt-0.5 truncate text-xs text-text-secondary">
            {collection.patientNumber ||
              "No patient number"}
          </p>
        </div>
      </div>

      {/* MEDICATION */}

      <div className="min-w-0 lg:col-span-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-text-tertiary lg:hidden">
          Medication
        </p>

        <p className="mt-1 truncate text-sm font-medium text-text-primary lg:mt-0">
          {getMedicationSummary(
            collection
          )}
        </p>

        {Array.isArray(
          collection.items
        ) &&
          collection.items
            .length ===
            1 &&
          collection.items[0]
            ?.quantity && (
          <p className="mt-0.5 text-xs text-text-tertiary">
            Qty{" "}
            {
              collection
                .items[0]
                .quantity
            }
          </p>
        )}
      </div>

      {/* DATE */}

      <div className="min-w-0 lg:col-span-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-text-tertiary lg:hidden">
          Collection
        </p>

        <div className="mt-1 flex items-start gap-1.5 lg:mt-0">
          <CalendarClock
            size={14}
            className="mt-0.5 shrink-0 text-text-tertiary"
          />

          <div>
            <p className="text-sm font-medium text-text-primary">
              {formatDate(
                collection
                  .scheduledCollectionDate
              )}
            </p>

            <p className="mt-0.5 truncate text-xs text-text-tertiary">
              {collection.clinicName ||
                "Clinic"}
            </p>
          </div>
        </div>
      </div>

      {/* STATUS */}

      <div className="lg:col-span-2">
        <CollectionStatus
          status={
            collection.status
          }
          date={
            collection
              .scheduledCollectionDate
          }
        />
      </div>

      {/* ARROW */}

      <div className="hidden justify-end lg:col-span-1 lg:flex">
        <ArrowRight
          size={16}
          className="text-text-tertiary transition group-hover:translate-x-0.5 group-hover:text-brand-primary"
        />
      </div>

    </button>
  );
}

/* ========================================================= */
/* EMPTY COLLECTIONS                                         */
/* ========================================================= */

function EmptyCollections({
  title,
  description,
  hasSearch,
  onClearSearch,
}) {
  return (
    <div className="px-lg py-2xl text-center lg:px-xl">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-[#f0fdfa] text-[#0f766e]">
        <CheckCircle2
          size={20}
        />
      </div>

      <h3 className="mt-md text-sm font-semibold text-text-primary">
        {title}
      </h3>

      <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-text-secondary">
        {description}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={
            onClearSearch
          }
          className="mt-md text-sm font-semibold text-brand-primary transition hover:opacity-70"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

/* ========================================================= */
/* PATIENT ROW                                               */
/* ========================================================= */

function PatientRow({
  patient,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="group flex w-full items-center gap-md px-lg py-md text-left transition hover:bg-[#f8fafc] focus:outline-none focus-visible:bg-[#f8fafc] lg:px-xl"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0fdfa] text-xs font-bold text-[#0f766e]">
        {getInitials(
          patient.patientName
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {patient.patientName ||
                "Patient"}
            </p>

            <p className="mt-0.5 truncate text-xs text-text-secondary">
              {patient.patientNumber ||
                "No patient number"}
            </p>
          </div>

          <div className="shrink-0 sm:text-right">
            <CollectionStatus
              status={
                patient.collectionStatus
              }
              date={
                patient.nextCollectionDate
              }
            />

            <p className="mt-1 text-xs text-text-tertiary">
              {patient.nextCollectionDate
                ? formatDate(
                    patient.nextCollectionDate
                  )
                : "No collection scheduled"}
            </p>
          </div>

        </div>
      </div>

      <ArrowRight
        size={15}
        className="shrink-0 text-text-tertiary transition group-hover:translate-x-0.5 group-hover:text-brand-primary"
      />
    </button>
  );
}

/* ========================================================= */
/* ACTIVITY ROW                                              */
/* ========================================================= */

function ActivityRow({
  collection,
  onOpen,
}) {
  const status =
    getCollectionStatusKey(
      collection
    );

  const collected =
    status ===
    "collected";

  const date =
    collection.collectedAt ||
    collection
      .scheduledCollectionDate;

  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="group flex w-full items-start gap-3 px-lg py-md text-left transition hover:bg-[#f8fafc] focus:outline-none focus-visible:bg-[#f8fafc]"
    >
      <div
        className={[
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          collected
            ? "bg-[#f0fdf4] text-[#16a34a]"
            : "bg-[#f8fafc] text-[#64748b]",
        ].join(" ")}
      >
        {collected ? (
          <CheckCircle2
            size={15}
          />
        ) : (
          <History
            size={15}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">
          {collection.patientName ||
            "Patient"}
        </p>

        <p className="mt-1 text-xs leading-5 text-text-secondary">
          {getActivityLabel(
            collection
          )}
        </p>

        <p className="mt-1 text-xs text-text-tertiary">
          {formatDate(
            date
          )}
        </p>
      </div>

      <ArrowRight
        size={14}
        className="mt-1 shrink-0 text-text-tertiary opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
      />
    </button>
  );
}

/* ========================================================= */
/* DETAILS DRAWER                                            */
/* ========================================================= */

function CollectionDrawer({
  collection,
  loading,
  error,
  onClose,
  onPatient,
}) {
  const status =
    getCollectionStatusKey(
      collection
    );

  const collected =
    status ===
    "collected";

  const items =
    Array.isArray(
      collection.items
    )
      ? collection.items
      : [];

  return (
    <div
      className="fixed inset-0 z-[120] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proxy-collection-title"
    >
      <button
        type="button"
        aria-label="Close collection details"
        onClick={
          onClose
        }
        className="absolute inset-0 bg-[#0f172a]/35 backdrop-blur-[1px]"
      />

      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-md border-b border-border-secondary px-lg py-lg sm:px-xl">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-brand-primary">
              Collection details
            </p>

            <h2
              id="proxy-collection-title"
              className="mt-1 truncate text-lg font-semibold text-text-primary"
            >
              {collection.patientName ||
                "Patient"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {collection.patientNumber ||
                "No patient number"}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={
              onClose
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-secondary text-text-secondary transition hover:bg-[#f8fafc] hover:text-text-primary"
          >
            <X
              size={17}
            />
          </button>
        </div>

        {/* BODY */}

        <div className="flex-1 overflow-y-auto px-lg py-lg sm:px-xl">

          {loading && (
            <div className="mb-lg flex items-center gap-2 text-sm text-text-secondary">
              <RefreshCw
                size={15}
                className="animate-spin"
              />

              Refreshing collection details…
            </div>
          )}

          {error && (
            <div className="mb-lg flex items-start gap-2 rounded-lg border border-[#fde68a] bg-[#fffbeb] p-md text-sm text-[#92400e]">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-md">
            <CollectionStatus
              status={
                collection.status
              }
              date={
                collection
                  .scheduledCollectionDate
              }
            />

            <button
              type="button"
              onClick={
                onPatient
              }
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary transition hover:opacity-70"
            >
              Patient collections

              <ArrowRight
                size={14}
              />
            </button>
          </div>

          {/* COLLECTION INFO */}

          <div className="mt-xl grid grid-cols-1 gap-md sm:grid-cols-2">
            <DetailCard
              icon={
                CalendarDays
              }
              label="Scheduled collection"
              value={
                formatLongDate(
                  collection
                    .scheduledCollectionDate
                )
              }
            />

            <DetailCard
              icon={
                MapPin
              }
              label="Clinic"
              value={
                collection.clinicName ||
                "—"
              }
            />
          </div>

          {/* MEDICATIONS */}

          <div className="mt-xl">
            <div className="flex items-center gap-2">
              <Pill
                size={17}
                className="text-brand-primary"
              />

              <h3 className="text-sm font-semibold text-text-primary">
                Medication
              </h3>
            </div>

            {items.length >
            0 ? (
              <div className="mt-md overflow-hidden rounded-xl border border-border-secondary">
                {items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id ||
                        item.medicationId ||
                        index
                      }
                      className={[
                        "px-md py-md",
                        index !==
                        items.length -
                          1
                          ? "border-b border-border-secondary"
                          : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-md">
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary">
                            {item.medicationName ||
                              "Medication"}
                          </p>

                          <p className="mt-1 text-sm text-text-secondary">
                            {[
                              item.dosage,
                              item.form,
                            ]
                              .filter(
                                Boolean
                              )
                              .join(
                                " · "
                              ) ||
                              "Medication details"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-md bg-[#f8fafc] px-2 py-1 text-xs font-semibold text-text-secondary">
                          Qty{" "}
                          {item.quantity ??
                            "—"}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="mt-md rounded-xl border border-border-secondary p-md">
                <p className="text-sm font-medium text-text-primary">
                  {collection.medicationName ||
                    "Medication collection"}
                </p>
              </div>
            )}
          </div>

          {/* PROCESSING */}

          <div className="mt-xl">
            <div className="flex items-center gap-2">
              <PackageCheck
                size={17}
                className="text-brand-primary"
              />

              <h3 className="text-sm font-semibold text-text-primary">
                Collection processing
              </h3>
            </div>

            <div className="mt-md overflow-hidden rounded-xl border border-border-secondary">
              {collected ? (
                <>
                  <DetailRow
                    label="Collected by"
                    value={
                      collection.proxyName ||
                      "Patient"
                    }
                  />

                  <DetailRow
                    label="Processed by"
                    value={
                      collection.processedByNurseName ||
                      "—"
                    }
                  />

                  <DetailRow
                    label="Collected on"
                    value={
                      collection.collectedAt
                        ? formatDate(
                            collection.collectedAt
                          )
                        : "—"
                    }
                    last
                  />
                </>
              ) : (
                <>
                  <DetailRow
                    label="Assigned proxy"
                    value={
                      collection.proxyName ||
                      "Not assigned"
                    }
                  />

                  <DetailRow
                    label="Processed by"
                    value="Not yet processed"
                    last
                  />
                </>
              )}
            </div>
          </div>

          {/* NOTES */}

          {collection.notes && (
            <div className="mt-xl">
              <h3 className="text-sm font-semibold text-text-primary">
                Notes
              </h3>

              <div className="mt-md rounded-xl border border-border-secondary bg-[#f8fafc] p-md">
                <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                  {collection.notes}
                </p>
              </div>
            </div>
          )}

        </div>

      </aside>
    </div>
  );
}

/* ========================================================= */
/* DETAIL CARD                                               */
/* ========================================================= */

function DetailCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-border-secondary p-md">
      <Icon
        size={16}
        className="text-brand-primary"
      />

      <p className="mt-3 text-xs font-semibold text-text-tertiary">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold leading-6 text-text-primary">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* DETAIL ROW                                                */
/* ========================================================= */

function DetailRow({
  label,
  value,
  last = false,
}) {
  return (
    <div
      className={[
        "flex items-start justify-between gap-md px-md py-md",
        !last
          ? "border-b border-border-secondary"
          : "",
      ].join(" ")}
    >
      <span className="text-sm text-text-secondary">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-text-primary">
        {value}
      </span>
    </div>
  );
}

/* ========================================================= */
/* INLINE ERROR                                              */
/* ========================================================= */

function InlineError({
  message,
  onRetry,
}) {
  return (
    <div className="px-lg py-2xl text-center lg:px-xl">
      <AlertCircle
        size={24}
        className="mx-auto text-[#dc2626]"
      />

      <h3 className="mt-md text-sm font-semibold text-text-primary">
        Collections unavailable
      </h3>

      <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-text-secondary">
        {message}
      </p>

      <button
        type="button"
        onClick={
          onRetry
        }
        className="mt-md inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition hover:opacity-70"
      >
        <RefreshCw
          size={14}
        />

        Try again
      </button>
    </div>
  );
}

/* ========================================================= */
/* COLLECTION ROW SKELETON                                   */
/* ========================================================= */

function CollectionRowsSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-border-secondary">
      {[
        1,
        2,
        3,
      ].map(
        (item) => (
          <div
            key={
              item
            }
            className="grid grid-cols-1 gap-md px-lg py-lg lg:grid-cols-12 lg:items-center lg:px-xl"
          >
            <div className="flex items-center gap-3 lg:col-span-4">
              <div className="h-10 w-10 rounded-lg bg-[#e2e8f0]" />

              <div className="flex-1">
                <div className="h-3.5 w-40 rounded bg-[#e2e8f0]" />
                <div className="mt-2 h-3 w-24 rounded bg-[#f1f5f9]" />
              </div>
            </div>

            <div className="h-4 w-40 rounded bg-[#e2e8f0] lg:col-span-3" />

            <div className="h-4 w-28 rounded bg-[#e2e8f0] lg:col-span-2" />

            <div className="h-7 w-20 rounded-full bg-[#f1f5f9] lg:col-span-2" />

            <div className="hidden lg:col-span-1 lg:block" />
          </div>
        )
      )}
    </div>
  );
}

/* ========================================================= */
/* PAGE SKELETON                                             */
/* ========================================================= */

function DashboardSkeleton() {
  return (
    <div className="animate-pulse p-lg md:p-xl lg:p-2xl">
      <div className="mb-xl flex items-start justify-between gap-md">
        <div>
          <div className="h-7 w-44 rounded bg-[#e2e8f0]" />

          <div className="mt-2 h-4 w-64 rounded bg-[#f1f5f9]" />
        </div>

        <div className="h-10 w-24 rounded-lg bg-[#f1f5f9]" />
      </div>

      <div className="mb-xl grid grid-cols-2 gap-md lg:grid-cols-5">
        {[
          1,
          2,
          3,
          4,
          5,
        ].map(
          (item) => (
            <div
              key={
                item
              }
              className="h-[104px] rounded-xl border border-border-secondary bg-white p-md"
            >
              <div className="h-9 w-9 rounded-lg bg-[#f1f5f9]" />

              <div className="mt-md h-6 w-10 rounded bg-[#e2e8f0]" />

              <div className="mt-2 h-3 w-20 rounded bg-[#f1f5f9]" />
            </div>
          )
        )}
      </div>

      <div className="h-[410px] rounded-xl border border-border-secondary bg-white" />

      <div className="mt-xl grid grid-cols-1 gap-xl lg:grid-cols-3">
        <div className="h-80 rounded-xl border border-border-secondary bg-white lg:col-span-2" />

        <div className="h-80 rounded-xl border border-border-secondary bg-white" />
      </div>
    </div>
  );
}