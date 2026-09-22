import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  History,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck,
  Users,
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
  parseDate,
} from "./ProxyUtils.jsx";

/* ========================================= */
/* HELPERS */
/* ========================================= */

function getInitials(name) {
  if (!name) {
    return "PT";
  }

  const parts =
    String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`
    .toUpperCase();
}

function getCollectionStatusKey(
  collection
) {
  if (!collection) {
    return "none";
  }

  const status =
    String(
      collection.status || ""
    )
      .trim()
      .toLowerCase();

  if (
    status === "collected" ||
    status === "completed"
  ) {
    return "collected";
  }

  if (
    status === "cancelled"
  ) {
    return "cancelled";
  }

  if (
    status === "overdue"
  ) {
    return "overdue";
  }

  const date =
    parseDate(
      collection
        .scheduledCollectionDate
    );

  if (!date) {
    return "none";
  }

  const now =
    new Date();

  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const scheduled =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  if (
    scheduled.getTime() <
    today.getTime()
  ) {
    return "overdue";
  }

  if (
    scheduled.getTime() ===
    today.getTime()
  ) {
    return "today";
  }

  return "upcoming";
}

function getActivityDate(
  collection
) {
  return (
    parseDate(
      collection?.collectedAt
    ) ||
    parseDate(
      collection
        ?.scheduledCollectionDate
    )
  );
}

function formatActivityLabel(
  collection
) {
  const key =
    getCollectionStatusKey(
      collection
    );

  if (
    key === "collected"
  ) {
    if (
      collection.proxyName
    ) {
      return `Collected by ${collection.proxyName}`;
    }

    return "Collected by patient";
  }

  if (
    key === "cancelled"
  ) {
    return "Collection cancelled";
  }

  return "Collection updated";
}

/* ========================================= */
/* LOADING */
/* ========================================= */

function LoadingDashboard() {
  return (
    <div className="animate-pulse p-lg md:p-xl lg:p-2xl">
      <div className="mb-xl">
        <div className="mb-sm h-8 w-56 rounded bg-border-secondary" />

        <div className="h-4 w-72 rounded bg-border-secondary" />
      </div>

      <div className="mb-xl h-44 rounded-corner-lg bg-surface-bg" />

      <div className="grid grid-cols-2 gap-md lg:grid-cols-4 lg:gap-lg">
        <div className="h-28 rounded-corner-lg bg-surface-bg" />
        <div className="h-28 rounded-corner-lg bg-surface-bg" />
        <div className="h-28 rounded-corner-lg bg-surface-bg" />
        <div className="h-28 rounded-corner-lg bg-surface-bg" />
      </div>

      <div className="mt-xl grid grid-cols-1 gap-lg lg:grid-cols-3 lg:gap-xl">
        <div className="h-96 rounded-corner-lg bg-surface-bg lg:col-span-2" />

        <div className="h-96 rounded-corner-lg bg-surface-bg" />
      </div>
    </div>
  );
}

/* ========================================= */
/* PAGE */
/* ========================================= */

export default function ProxyDashboard() {
  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  const [
    care,
    setCare,
  ] = useState(null);

  const [
    collections,
    setCollections,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    collectionsError,
    setCollectionsError,
  ] = useState("");

  /* ===================================== */
  /* LOAD */
  /* ===================================== */

  const loadDashboard =
    useCallback(
      async () => {
        setLoading(true);
        setError("");
        setCollectionsError("");

        const [
          careResult,
          collectionsResult,
        ] =
          await Promise.allSettled([
            proxiesApi.getCare(),
            proxiesApi.getCollections(),
          ]);

        if (
          careResult.status ===
          "fulfilled"
        ) {
          setCare(
            careResult.value ||
              null
          );
        } else {
          console.error(
            "Failed to load proxy care dashboard:",
            careResult.reason
          );

          setCare(null);

          setError(
            careResult.reason
              ?.message ||
              "We could not load your proxy dashboard."
          );
        }

        if (
          collectionsResult.status ===
          "fulfilled"
        ) {
          setCollections(
            Array.isArray(
              collectionsResult.value
            )
              ? collectionsResult.value
              : []
          );
        } else {
          console.error(
            "Failed to load dashboard collections:",
            collectionsResult.reason
          );

          setCollections([]);

          setCollectionsError(
            collectionsResult.reason
              ?.message ||
              "Collection activity could not be loaded."
          );
        }

        setLoading(false);
      },
      []
    );

  useEffect(() => {
    loadDashboard();
  }, [
    loadDashboard,
  ]);

  /* ===================================== */
  /* DATA */
  /* ===================================== */

  const patients =
    Array.isArray(
      care?.patients
    )
      ? care.patients
      : [];

  const fullName =
    user?.fullName ||
    user?.name ||
    "Proxy";

  const firstName =
    fullName
      .split(" ")
      .filter(Boolean)[0] ||
    "Proxy";

  const activeCollections =
    useMemo(
      () =>
        collections.filter(
          (collection) => {
            const status =
              getCollectionStatusKey(
                collection
              );

            return (
              status !==
                "collected" &&
              status !==
                "cancelled"
            );
          }
        ),
      [
        collections,
      ]
    );

  const overdueCollections =
    useMemo(
      () =>
        activeCollections.filter(
          (collection) =>
            getCollectionStatusKey(
              collection
            ) ===
            "overdue"
        ),
      [
        activeCollections,
      ]
    );

  const dueTodayCollections =
    useMemo(
      () =>
        activeCollections.filter(
          (collection) =>
            getCollectionStatusKey(
              collection
            ) ===
            "today"
        ),
      [
        activeCollections,
      ]
    );

  const upcomingCollections =
    useMemo(
      () =>
        activeCollections.filter(
          (collection) =>
            getCollectionStatusKey(
              collection
            ) ===
            "upcoming"
        ),
      [
        activeCollections,
      ]
    );

  const collectedCollections =
    useMemo(
      () =>
        collections.filter(
          (collection) =>
            getCollectionStatusKey(
              collection
            ) ===
            "collected"
        ),
      [
        collections,
      ]
    );

  const priorityCollections =
    useMemo(
      () =>
        [...activeCollections]
          .sort(
            (
              a,
              b
            ) => {
              const priority = {
                overdue: 0,
                today: 1,
                upcoming: 2,
                none: 3,
              };

              const aStatus =
                getCollectionStatusKey(
                  a
                );

              const bStatus =
                getCollectionStatusKey(
                  b
                );

              if (
                priority[aStatus] !==
                priority[bStatus]
              ) {
                return (
                  priority[aStatus] -
                  priority[bStatus]
                );
              }

              const aDate =
                parseDate(
                  a.scheduledCollectionDate
                );

              const bDate =
                parseDate(
                  b.scheduledCollectionDate
                );

              return (
                (aDate?.getTime() ||
                  Number.MAX_SAFE_INTEGER) -
                (bDate?.getTime() ||
                  Number.MAX_SAFE_INTEGER)
              );
            }
          )
          .slice(
            0,
            5
          ),
      [
        activeCollections,
      ]
    );

  const recentActivity =
    useMemo(
      () =>
        collections
          .filter(
            (collection) => {
              const status =
                getCollectionStatusKey(
                  collection
                );

              return (
                status ===
                  "collected" ||
                status ===
                  "cancelled"
              );
            }
          )
          .sort(
            (
              a,
              b
            ) =>
              (
                getActivityDate(
                  b
                )?.getTime() ||
                0
              ) -
              (
                getActivityDate(
                  a
                )?.getTime() ||
                0
              )
          )
          .slice(
            0,
            5
          ),
      [
        collections,
      ]
    );

  const patientsWithActiveCollection =
    useMemo(
      () =>
        new Set(
          activeCollections
            .map(
              (
                collection
              ) =>
                collection.patientId
            )
            .filter(Boolean)
        ).size,
      [
        activeCollections,
      ]
    );

  const patientsWithoutCollection =
    Math.max(
      0,
      patients.length -
        patientsWithActiveCollection
    );

  const sortedPatients =
    useMemo(
      () =>
        [...patients]
          .sort(
            (
              a,
              b
            ) => {
              const aDate =
                parseDate(
                  a.nextCollectionDate
                );

              const bDate =
                parseDate(
                  b.nextCollectionDate
                );

              if (
                aDate &&
                bDate
              ) {
                return (
                  aDate.getTime() -
                  bDate.getTime()
                );
              }

              if (aDate) {
                return -1;
              }

              if (bDate) {
                return 1;
              }

              return String(
                a.patientName ||
                  ""
              ).localeCompare(
                String(
                  b.patientName ||
                    ""
                )
              );
            }
          )
          .slice(
            0,
            6
          ),
      [
        patients,
      ]
    );

  /* ===================================== */
  /* LOADING + ERROR */
  /* ===================================== */

  if (loading) {
    return (
      <LoadingDashboard />
    );
  }

  if (
    error ||
    !care
  ) {
    return (
      <div className="p-lg md:p-xl lg:p-2xl">
        <div className="mx-auto max-w-2xl rounded-corner-lg border border-danger/20 bg-surface-bg p-xl">
          <div className="flex items-start gap-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-full bg-danger/10">
              <AlertCircle
                size={18}
                className="text-danger"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-label font-semibold text-text-primary">
                We could not load
                your dashboard
              </h1>

              <p className="mt-xs text-label-sm text-text-secondary">
                {error ||
                  "Your proxy dashboard data is currently unavailable."}
              </p>

              <button
                type="button"
                onClick={
                  loadDashboard
                }
                className="mt-lg inline-flex items-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-[#f8fafc]"
              >
                <RefreshCw
                  size={15}
                />

                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===================================== */
  /* RENDER */
  /* ===================================== */

  const needsAttention =
    overdueCollections.length +
    dueTodayCollections.length;

  return (
    <div className="p-lg md:p-xl lg:p-2xl">

      {/* ================================= */}
      {/* PAGE HEADER */}
      {/* ================================= */}

      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            Welcome,{" "}
            {firstName}
          </h1>

          <div className="mt-xs flex flex-wrap items-center gap-2 text-label-sm text-text-secondary">
            <span>
              Your proxy care overview
            </span>

            {care.clinicName && (
              <>
                <span className="text-text-tertiary">
                  •
                </span>

                <span className="inline-flex items-center gap-1">
                  <MapPin
                    size={13}
                  />

                  {
                    care.clinicName
                  }
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={
            loadDashboard
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-secondary bg-white px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-[#f8fafc] sm:w-fit"
        >
          <RefreshCw
            size={15}
          />

          Refresh
        </button>
      </div>

      {/* ================================= */}
      {/* TODAY HERO */}
      {/* ================================= */}

      <section className="relative mb-xl overflow-hidden rounded-corner-lg border border-[#99f6e4] bg-gradient-to-br from-[#f0fdfa] via-white to-[#ecfeff] p-lg sm:p-xl lg:p-2xl">

        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#99f6e4]/30 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-xl lg:grid-cols-[1.35fr_0.65fr] lg:items-center">

          <div>
            <div className="mb-md inline-flex items-center gap-2 rounded-full border border-[#99f6e4] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#0f766e]">
              <ShieldCheck
                size={14}
              />

              Today's care overview
            </div>

            {needsAttention >
            0 ? (
              <>
                <h2 className="max-w-2xl text-[24px] font-semibold leading-tight text-[#0f172a] sm:text-[28px]">
                  {needsAttention ===
                  1
                    ? "1 collection needs your attention today."
                    : `${needsAttention} collections need your attention today.`}
                </h2>

                <p className="mt-sm max-w-xl text-sm leading-6 text-[#64748b]">
                  Start with overdue and
                  due-today collections,
                  then review what is
                  coming next.
                </p>
              </>
            ) : (
              <>
                <h2 className="max-w-2xl text-[24px] font-semibold leading-tight text-[#0f172a] sm:text-[28px]">
                  You're up to date
                  for today.
                </h2>

                <p className="mt-sm max-w-xl text-sm leading-6 text-[#64748b]">
                  None of your linked
                  patients currently has
                  an overdue or due-today
                  medication collection.
                </p>
              </>
            )}

            <div className="mt-lg flex flex-col gap-sm sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/proxy/collections"
                  )
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#115e59]"
              >
                View collections

                <ArrowRight
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/proxy/patients"
                  )
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-5 text-sm font-semibold text-[#334155] transition hover:bg-[#f8fafc]"
              >
                <Users
                  size={16}
                />

                View patients
              </button>
            </div>
          </div>

          <div className="rounded-corner-lg border border-white/80 bg-white/85 p-lg shadow-sm backdrop-blur">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94a3b8]">
                  Current clinic
                </p>

                <p className="mt-2 text-base font-semibold text-[#0f172a]">
                  {care.clinicName ||
                    "Clinic unavailable"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
                <MapPin
                  size={19}
                />
              </div>
            </div>

            <div className="mt-lg grid grid-cols-2 gap-md border-t border-[#e2e8f0] pt-lg">
              <div>
                <p className="text-[11px] text-[#94a3b8]">
                  Linked patients
                </p>

                <p className="mt-1 text-xl font-semibold text-[#0f172a]">
                  {care.totalPatients ??
                    patients.length}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[#94a3b8]">
                  Active collections
                </p>

                <p className="mt-1 text-xl font-semibold text-[#0f172a]">
                  {
                    activeCollections.length
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================= */}

      <div className="mb-xl grid grid-cols-2 gap-md lg:grid-cols-4 lg:gap-lg">

        <MetricCard
          icon={Users}
          label="Linked patients"
          value={
            care.totalPatients ??
            patients.length
          }
          helper="Under your care"
          onClick={() =>
            navigate(
              "/proxy/patients"
            )
          }
        />

        <MetricCard
          icon={
            CalendarCheck2
          }
          label="Due today"
          value={
            dueTodayCollections.length
          }
          helper="Collections today"
          accent="success"
          onClick={() =>
            navigate(
              "/proxy/collections?status=today"
            )
          }
        />

        <MetricCard
          icon={
            CalendarClock
          }
          label="Upcoming"
          value={
            upcomingCollections.length
          }
          helper="Future collections"
          onClick={() =>
            navigate(
              "/proxy/collections?status=upcoming"
            )
          }
        />

        <MetricCard
          icon={Clock3}
          label="Overdue"
          value={
            overdueCollections.length
          }
          helper={
            overdueCollections.length >
            0
              ? "Needs attention"
              : "Nothing overdue"
          }
          accent={
            overdueCollections.length >
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

      </div>

      {/* ================================= */}
      {/* COLLECTION API WARNING */}
      {/* ================================= */}

      {collectionsError && (
        <div className="mb-xl flex items-start gap-md rounded-corner-lg border border-warning/20 bg-warning/10 p-md">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-warning"
          />

          <div className="min-w-0 flex-1">
            <p className="text-label-sm font-medium text-text-primary">
              Some collection activity
              could not be loaded.
            </p>

            <p className="mt-xs text-video-title text-text-secondary">
              {collectionsError}
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadDashboard
            }
            className="shrink-0 text-label-sm font-medium text-brand-primary"
          >
            Retry
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* MAIN GRID */}
      {/* ================================= */}

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3 lg:gap-xl">

        {/* ============================= */}
        {/* PRIORITY COLLECTIONS */}
        {/* ============================= */}

        <section className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg lg:col-span-2">

          <SectionHeader
            icon={
              PackageCheck
            }
            title="Collection priorities"
            subtitle="The next collections requiring your attention."
            action="View all"
            onAction={() =>
              navigate(
                "/proxy/collections"
              )
            }
          />

          {priorityCollections.length >
          0 ? (
            <div className="divide-y divide-border-secondary">
              {priorityCollections.map(
                (
                  collection
                ) => (
                  <PriorityCollectionRow
                    key={
                      collection.id
                    }
                    collection={
                      collection
                    }
                    onOpen={() =>
                      navigate(
                        `/proxy/collections?patientId=${collection.patientId}`
                      )
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="px-lg py-2xl text-center lg:px-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#166534]">
                <CheckCircle2
                  size={25}
                />
              </div>

              <h3 className="mt-md text-label font-semibold text-text-primary">
                No active collections
                need attention
              </h3>

              <p className="mx-auto mt-xs max-w-md text-label-sm leading-6 text-text-secondary">
                Your current linked
                patients have no
                overdue, due-today or
                upcoming collections
                requiring action.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/proxy/collections"
                  )
                }
                className="mt-lg inline-flex items-center gap-xs text-label-sm font-semibold text-brand-primary"
              >
                View collection history

                <ArrowRight
                  size={14}
                />
              </button>
            </div>
          )}

        </section>

        {/* ============================= */}
        {/* CARE SNAPSHOT */}
        {/* ============================= */}

        <section className="rounded-corner-lg border border-border-secondary bg-surface-bg">

          <div className="border-b border-border-secondary p-lg">
            <div className="flex items-center gap-sm">
              <UserRoundCheck
                size={17}
                className="text-brand-primary"
              />

              <div>
                <h2 className="text-label font-semibold text-text-primary">
                  Care snapshot
                </h2>

                <p className="mt-xs text-video-title text-text-secondary">
                  Your current patient
                  coverage.
                </p>
              </div>
            </div>
          </div>

          <div className="p-lg">

            <SnapshotRow
              label="Linked patients"
              value={
                patients.length
              }
            />

            <SnapshotRow
              label="With active collection"
              value={
                patientsWithActiveCollection
              }
            />

            <SnapshotRow
              label="No current collection"
              value={
                patientsWithoutCollection
              }
            />

            <SnapshotRow
              label="Collected records"
              value={
                collectedCollections.length
              }
              last
            />

            <div className="mt-lg rounded-corner-md bg-[#f8fafc] p-md">
              <div className="flex items-start gap-sm">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-[#0f766e]"
                />

                <div>
                  <p className="text-label-sm font-semibold text-text-primary">
                    Clinic-restricted care
                  </p>

                  <p className="mt-xs text-video-title leading-5 text-text-secondary">
                    Your Proxy account
                    only displays patients
                    and collections from{" "}
                    <span className="font-medium text-text-primary">
                      {care.clinicName ||
                        "your assigned clinic"}
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>

          </div>

        </section>

      </div>

      {/* ================================= */}
      {/* PATIENTS + ACTIVITY */}
      {/* ================================= */}

      <div className="mt-lg grid grid-cols-1 gap-lg lg:mt-xl lg:grid-cols-3 lg:gap-xl">

        {/* ============================= */}
        {/* PATIENTS */}
        {/* ============================= */}

        <section className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg lg:col-span-2">

          <SectionHeader
            icon={Users}
            title="People under your care"
            subtitle="A quick view of your linked patients and their next collection."
            action="All patients"
            onAction={() =>
              navigate(
                "/proxy/patients"
              )
            }
          />

          {sortedPatients.length ===
          0 ? (
            <div className="px-lg py-2xl text-center">
              <Users
                size={27}
                className="mx-auto text-text-tertiary"
              />

              <p className="mt-md text-label-sm font-semibold text-text-primary">
                No linked patients
              </p>

              <p className="mt-xs text-video-title text-text-secondary">
                Patients assigned to
                your Proxy account will
                appear here.
              </p>
            </div>
          ) : (
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
          )}

        </section>

        {/* ============================= */}
        {/* RECENT ACTIVITY */}
        {/* ============================= */}

        <section className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg">

          <SectionHeader
            icon={
              History
            }
            title="Recent activity"
            subtitle="Latest completed and cancelled collection records."
          />

          {recentActivity.length >
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
                  />
                )
              )}
            </div>
          ) : (
            <div className="px-lg py-2xl text-center">
              <History
                size={26}
                className="mx-auto text-text-tertiary"
              />

              <p className="mt-md text-label-sm font-medium text-text-primary">
                No recent activity
              </p>

              <p className="mt-xs text-video-title text-text-secondary">
                Completed and
                cancelled collections
                will appear here.
              </p>
            </div>
          )}

        </section>

      </div>

      {/* ================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================= */}

      <section className="mt-lg lg:mt-xl">

        <div className="mb-md">
          <h2 className="text-label font-semibold text-text-primary">
            Quick access
          </h2>

          <p className="mt-xs text-video-title text-text-secondary">
            Jump directly to the
            information you use most.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-2">

          <QuickAction
            icon={Users}
            title="Manage patient view"
            description="Search and review all patients currently linked to you."
            onClick={() =>
              navigate(
                "/proxy/patients"
              )
            }
          />

          <QuickAction
            icon={
              PackageCheck
            }
            title="Collection records"
            description="Review upcoming, overdue, collected and cancelled records."
            onClick={() =>
              navigate(
                "/proxy/collections"
              )
            }
          />

        </div>

      </section>

    </div>
  );
}

/* ========================================= */
/* METRIC CARD */
/* ========================================= */

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  accent = "default",
  onClick,
}) {
  const styles = {
    default: {
      icon:
        "bg-[#ccfbf1] text-[#0f766e]",
      value:
        "text-[#0f172a]",
    },

    success: {
      icon:
        "bg-[#dcfce7] text-[#166534]",
      value:
        "text-[#166534]",
    },

    danger: {
      icon:
        "bg-[#fee2e2] text-[#b91c1c]",
      value:
        "text-[#b91c1c]",
    },
  };

  const selected =
    styles[accent] ||
    styles.default;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-corner-lg border border-border-secondary bg-surface-bg p-md text-left transition hover:-translate-y-0.5 hover:border-[#99f6e4] hover:shadow-sm sm:p-lg"
    >
      <div className="flex items-start justify-between gap-sm">
        <div>
          <p className="text-xs text-text-secondary sm:text-label-sm">
            {label}
          </p>

          <p
            className={`mt-sm text-[28px] font-semibold leading-none sm:text-[30px] ${selected.value}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${selected.icon}`}
        >
          <Icon
            size={18}
          />
        </div>
      </div>

      <div className="mt-md flex items-center justify-between gap-sm">
        <p className="truncate text-[11px] text-text-tertiary sm:text-video-title">
          {helper}
        </p>

        <ArrowRight
          size={14}
          className="shrink-0 text-text-tertiary transition group-hover:translate-x-0.5 group-hover:text-brand-primary"
        />
      </div>
    </button>
  );
}

/* ========================================= */
/* SECTION HEADER */
/* ========================================= */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
  onAction,
}) {
  return (
    <div className="flex items-start justify-between gap-md border-b border-border-secondary p-lg lg:px-xl">
      <div className="flex min-w-0 items-start gap-sm">

        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
          <Icon
            size={15}
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-label font-semibold text-text-primary">
            {title}
          </h2>

          <p className="mt-xs text-video-title leading-5 text-text-secondary">
            {subtitle}
          </p>
        </div>

      </div>

      {action &&
        onAction && (
        <button
          type="button"
          onClick={
            onAction
          }
          className="flex shrink-0 items-center gap-1 text-label-sm font-medium text-brand-primary transition-opacity hover:opacity-70"
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

/* ========================================= */
/* PRIORITY COLLECTION */
/* ========================================= */

function PriorityCollectionRow({
  collection,
  onOpen,
}) {
  return (
    <button
      type="button"
      onClick={
        onOpen
      }
      className="group flex w-full items-center gap-md p-md text-left transition hover:bg-[#f8fafc] sm:p-lg lg:px-xl"
    >

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0fdfa] text-sm font-semibold text-[#0f766e]">
        {getInitials(
          collection.patientName
        )}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <p className="truncate text-label-sm font-semibold text-text-primary">
            {collection.patientName ||
              "Patient"}
          </p>

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

        <p className="mt-1 truncate text-video-title text-text-secondary">
          {collection.medicationName ||
            "Medication collection"}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-tertiary">

          <span className="inline-flex items-center gap-1">
            <CalendarClock
              size={12}
            />

            {formatDate(
              collection
                .scheduledCollectionDate
            )}
          </span>

          {collection.patientNumber && (
            <span>
              {
                collection.patientNumber
              }
            </span>
          )}

        </div>

      </div>

      <ArrowRight
        size={16}
        className="shrink-0 text-text-tertiary transition group-hover:translate-x-1 group-hover:text-brand-primary"
      />

    </button>
  );
}

/* ========================================= */
/* PATIENT ROW */
/* ========================================= */

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
      className="group flex w-full items-center gap-md p-md text-left transition hover:bg-[#f8fafc] sm:p-lg lg:px-xl"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-xs font-semibold text-[#115e59]">
        {getInitials(
          patient.patientName
        )}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">
            <p className="truncate text-label-sm font-semibold text-text-primary">
              {patient.patientName ||
                "Patient"}
            </p>

            <p className="mt-0.5 truncate text-video-title text-text-secondary">
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

            <p className="mt-1 text-[11px] text-text-tertiary">
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

/* ========================================= */
/* ACTIVITY ROW */
/* ========================================= */

function ActivityRow({
  collection,
}) {
  const collected =
    getCollectionStatusKey(
      collection
    ) ===
    "collected";

  const activityDate =
    collection.collectedAt ||
    collection
      .scheduledCollectionDate;

  return (
    <div className="flex items-start gap-md p-lg">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          collected
            ? "bg-[#dcfce7] text-[#166534]"
            : "bg-[#f1f5f9] text-[#64748b]"
        }`}
      >
        {collected ? (
          <CheckCircle2
            size={16}
          />
        ) : (
          <History
            size={16}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-label-sm font-medium text-text-primary">
          {collection.patientName ||
            "Patient"}
        </p>

        <p className="mt-1 text-video-title leading-5 text-text-secondary">
          {formatActivityLabel(
            collection
          )}
        </p>

        <p className="mt-1 text-[11px] text-text-tertiary">
          {formatDate(
            activityDate
          )}
        </p>

      </div>

    </div>
  );
}

/* ========================================= */
/* SNAPSHOT ROW */
/* ========================================= */

function SnapshotRow({
  label,
  value,
  last = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-md py-md ${
        last
          ? ""
          : "border-b border-border-secondary"
      }`}
    >
      <span className="text-label-sm text-text-secondary">
        {label}
      </span>

      <span className="text-label font-semibold text-text-primary">
        {value}
      </span>
    </div>
  );
}

/* ========================================= */
/* QUICK ACTION */
/* ========================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="group flex items-center gap-md rounded-corner-lg border border-border-secondary bg-surface-bg p-lg text-left transition hover:-translate-y-0.5 hover:border-[#99f6e4] hover:shadow-sm"
    >

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
        <Icon
          size={19}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-label-sm font-semibold text-text-primary">
          {title}
        </p>

        <p className="mt-xs text-video-title leading-5 text-text-secondary">
          {description}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="shrink-0 text-text-tertiary transition group-hover:translate-x-1 group-hover:text-brand-primary"
      />

    </button>
  );
}
