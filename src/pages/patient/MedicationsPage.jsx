import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  History,
  Package,
  Pill,
  RefreshCw,
} from "lucide-react";

import {
  Badge,
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";

import {
  medicationsApi,
} from "../../services/api/medications.js";

/* =========================================================
   DATE / TIME HELPERS
========================================================= */

function formatTime(value) {
  if (!value) {
    return "—";
  }

  const text =
    String(value);

  if (
    /^\d{2}:\d{2}/.test(
      text
    )
  ) {
    return text.slice(
      0,
      5
    );
  }

  return text;
}

function formatDate(value) {
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
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(
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

  return date.toLocaleString(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

/* =========================================================
   MEDICATION STATE HELPERS
========================================================= */

function hasMedicationStarted(
  medication
) {
  if (
    !medication?.startDate
  ) {
    return true;
  }

  const startDate =
    new Date(
      medication.startDate
    );

  if (
    Number.isNaN(
      startDate.getTime()
    )
  ) {
    return true;
  }

  return (
    startDate.getTime() <=
    Date.now()
  );
}

function hasMedicationEnded(
  medication
) {
  if (
    !medication?.endDate
  ) {
    return false;
  }

  const endDate =
    new Date(
      medication.endDate
    );

  if (
    Number.isNaN(
      endDate.getTime()
    )
  ) {
    return false;
  }

  return (
    endDate.getTime() <
    Date.now()
  );
}

function isMedicationActive(
  medication
) {
  return (
    medication?.isActive !==
      false &&
    !hasMedicationEnded(
      medication
    )
  );
}

function getMedicationStatus(
  medication
) {
  if (
    medication?.isActive ===
    false
  ) {
    return {
      label:
        "Inactive",

      variant:
        "default",
    };
  }

  if (
    hasMedicationEnded(
      medication
    )
  ) {
    return {
      label:
        "Ended",

      variant:
        "default",
    };
  }

  if (
    !hasMedicationStarted(
      medication
    )
  ) {
    return {
      label:
        "Upcoming",

      variant:
        "default",
    };
  }

  return {
    label:
      "Active",

    variant:
      "success",
  };
}

/* =========================================================
   SCHEDULE HELPERS
========================================================= */

function getActiveSchedules(
  medication
) {
  if (
    !Array.isArray(
      medication?.schedules
    )
  ) {
    return [];
  }

  return [
    ...medication.schedules,
  ]
    .filter(
      (schedule) =>
        schedule?.isActive !==
        false
    )
    .sort(
      (a, b) =>
        String(
          a?.timeOfDay ??
            ""
        ).localeCompare(
          String(
            b?.timeOfDay ??
              ""
          )
        )
    );
}

/* =========================================================
   TODAY LOG HELPERS
========================================================= */

function isSameLocalDay(
  first,
  second
) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}

function getTodayLogs(
  medication
) {
  if (
    !Array.isArray(
      medication?.logs
    )
  ) {
    return [];
  }

  const now =
    new Date();

  return medication.logs.filter(
    (log) => {
      if (
        !log?.takenAt
      ) {
        return false;
      }

      const date =
        new Date(
          log.takenAt
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return false;
      }

      return isSameLocalDay(
        date,
        now
      );
    }
  );
}

function getDoseProgress(
  medication
) {
  const schedules =
    getActiveSchedules(
      medication
    );

  const todayLogs =
    getTodayLogs(
      medication
    );

  const takenToday =
    todayLogs.filter(
      (log) =>
        log?.taken ===
        true
    ).length;

  const skippedToday =
    todayLogs.filter(
      (log) =>
        log?.taken ===
        false
    ).length;

  const scheduledDoses =
    schedules.length;

  const remainingTakenDoses =
    Math.max(
      scheduledDoses -
        takenToday,
      0
    );

  const takenLimitReached =
    scheduledDoses >
      0 &&
    takenToday >=
      scheduledDoses;

  return {
    schedules,
    todayLogs,
    takenToday,
    skippedToday,
    scheduledDoses,
    remainingTakenDoses,
    takenLimitReached,
  };
}

/* =========================================================
   SUPPLY HELPERS
========================================================= */

function formatQuantity(
  value
) {
  if (
    value == null ||
    Number.isNaN(
      Number(value)
    )
  ) {
    return "—";
  }

  const number =
    Number(value);

  return Number.isInteger(
    number
  )
    ? String(number)
    : number.toFixed(
        1
      );
}

function getSupplyMessage(
  supply
) {
  if (!supply) {
    return {
      label:
        "Supply unavailable",

      variant:
        "default",

      text:
        "Supply information is not available yet.",
    };
  }

  switch (
    supply.calculationStatus
  ) {
    case "Available":
      return {
        label:
          supply.daysRemaining ===
          0
            ? "Supply depleted"
            : `${supply.daysRemaining} ${
                supply.daysRemaining ===
                1
                  ? "day"
                  : "days"
              } remaining`,

        variant:
          supply.daysRemaining <=
          3
            ? "warning"
            : "success",

        text:
          "Estimated from your latest completed collection, active dosing schedule and doses you have marked as taken.",
      };

    case "MissingUnitsPerDose":
      return {
        label:
          "Dose amount needed",

        variant:
          "warning",

        text:
          "Your dispensed quantity is recorded, but units per dose have not been captured yet.",
      };

    case "MissingSchedule":
      return {
        label:
          "Schedule needed",

        variant:
          "warning",

        text:
          "Your dispensed quantity is recorded, but no active dosing schedule is available.",
      };

    case "NoCompletedCollection":
      return {
        label:
          "No collected supply",

        variant:
          "default",

        text:
          "No completed medication collection has been recorded for this medication.",
      };

    default:
      return {
        label:
          "Supply unavailable",

        variant:
          "default",

        text:
          "Supply information could not be calculated.",
      };
  }
}

/* =========================================================
   LOADING STATE
========================================================= */

function LoadingState() {
  return (
    <div className="flex flex-col gap-md">
      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl"
          >
            <div className="flex gap-md">
              <div className="h-9 w-9 rounded-corner-full bg-border-secondary" />

              <div className="flex-1">
                <div className="mb-sm h-4 w-40 rounded bg-border-secondary" />

                <div className="h-3 w-56 rounded bg-border-secondary" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl text-center lg:p-2xl">
      <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-corner-full bg-brand-tertiary">
        <Pill
          size={20}
          className="text-brand-primary"
        />
      </div>

      <h2 className="text-label font-semibold text-text-primary">
        No medications on record
      </h2>

      <p className="mx-auto mt-xs max-w-md text-label-sm text-text-secondary">
        There are currently no medications linked to your patient profile.
      </p>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function MedicationsPage() {
  const [
    medications,
    setMedications,
  ] =
    useState([]);

  const [
    supply,
    setSupply,
  ] =
    useState([]);

  const [
    selected,
    setSelected,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    supplyLoading,
    setSupplyLoading,
  ] =
    useState(true);

  const [
    actionMedicationId,
    setActionMedicationId,
  ] =
    useState(null);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    supplyError,
    setSupplyError,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  /* =======================================================
     LOAD SUPPLY
  ======================================================= */

  const loadSupply =
    useCallback(
      async () => {
        try {
          setSupplyLoading(
            true
          );

          setSupplyError(
            ""
          );

          const result =
            await medicationsApi
              .getSupply();

          setSupply(
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
            "Failed to load medication supply:",
            err
          );

          setSupply(
            []
          );

          setSupplyError(
            err?.message ||
              "Medication supply information is temporarily unavailable."
          );
        } finally {
          setSupplyLoading(
            false
          );
        }
      },
      []
    );

  /* =======================================================
     LOAD MEDICATIONS
  ======================================================= */

  const loadMedications =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const result =
            await medicationsApi
              .getMine();

          setMedications(
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
            "Failed to load medications:",
            err
          );

          setError(
            err?.message ||
              "We could not load your medications."
          );

          setMedications(
            []
          );
        } finally {
          setLoading(
            false
          );
        }

        await loadSupply();
      },
      [
        loadSupply,
      ]
    );

  useEffect(
    () => {
      void loadMedications();
    },
    [
      loadMedications,
    ]
  );

  /* =======================================================
     SUPPLY MAP
  ======================================================= */

  const supplyByMedication =
    useMemo(
      () =>
        new Map(
          supply.map(
            (item) => [
              item.medicationId,
              item,
            ]
          )
        ),
      [
        supply,
      ]
    );

  /* =======================================================
     ACTIVE / PREVIOUS
  ======================================================= */

  const activeMedications =
    useMemo(
      () =>
        medications.filter(
          (
            medication
          ) =>
            isMedicationActive(
              medication
            )
        ),
      [
        medications,
      ]
    );

  const inactiveMedications =
    useMemo(
      () =>
        medications.filter(
          (
            medication
          ) =>
            !isMedicationActive(
              medication
            )
        ),
      [
        medications,
      ]
    );

  /* =======================================================
     TODAY'S SCHEDULE
  ======================================================= */

  const todaySchedule =
    useMemo(
      () =>
        activeMedications
          .filter(
            (
              medication
            ) =>
              hasMedicationStarted(
                medication
              )
          )
          .flatMap(
            (
              medication
            ) => {
              const progress =
                getDoseProgress(
                  medication
                );

              return progress.schedules.map(
                (
                  schedule
                ) => ({
                  medicationId:
                    medication.id,

                  medicationName:
                    medication.name,

                  dosage:
                    medication.dosage,

                  time:
                    schedule.timeOfDay,

                  takenToday:
                    progress.takenToday,

                  scheduledDoses:
                    progress.scheduledDoses,

                  complete:
                    progress.takenLimitReached,
                })
              );
            }
          )
          .sort(
            (
              a,
              b
            ) =>
              String(
                a.time
              ).localeCompare(
                String(
                  b.time
                )
              )
          ),
      [
        activeMedications,
      ]
    );

  /* =======================================================
     LOG TAKEN / SKIPPED
  ======================================================= */

  async function handleLogDose(
    medicationId,
    taken
  ) {
    try {
      setActionMedicationId(
        medicationId
      );

      setError(
        ""
      );

      setMessage(
        ""
      );

      await medicationsApi
        .logDose(
          medicationId,
          {
            taken,

            notes:
              null,
          }
        );

      setMessage(
        taken
          ? "Medication marked as taken. Your remaining supply has been recalculated."
          : "Medication marked as skipped."
      );

      /*
       * Reload both medication logs and medication supply.
       * loadMedications() already calls loadSupply().
       */
      await loadMedications();
    } catch (
      err
    ) {
      console.error(
        "Failed to log medication:",
        err
      );

      /*
       * The backend now returns readable HTTP 400 messages
       * for medication safety rules, including the daily
       * dose limit.
       */
      setError(
        err?.message ||
          "We could not update this medication."
      );

      /*
       * Refresh after a rejected action as well. This keeps
       * the frontend synchronized if another tab/device
       * recorded a dose.
       */
      await loadMedications();
    } finally {
      setActionMedicationId(
        null
      );
    }
  }

  /* =======================================================
     MEDICATION CARD
  ======================================================= */

  function renderMedicationCard(
    medication
  ) {
    const isSelected =
      selected ===
      medication.id;

    const currentlyActive =
      isMedicationActive(
        medication
      );

    const started =
      hasMedicationStarted(
        medication
      );

    const status =
      getMedicationStatus(
        medication
      );

    const {
      schedules,
      todayLogs,
      takenToday,
      skippedToday,
      scheduledDoses,
      remainingTakenDoses,
      takenLimitReached,
    } =
      getDoseProgress(
        medication
      );

    const hasSchedule =
      scheduledDoses >
      0;

    const medicationSupply =
      supplyByMedication.get(
        medication.id
      );

    const supplyDetails =
      getSupplyMessage(
        medicationSupply
      );

    const mostRecentLog =
      Array.isArray(
        medication.logs
      )
        ? [
            ...medication.logs,
          ]
            .filter(
              (log) =>
                log?.takenAt
            )
            .sort(
              (
                a,
                b
              ) =>
                new Date(
                  b.takenAt
                ) -
                new Date(
                  a.takenAt
                )
            )[0]
        : null;

    const isUpdating =
      actionMedicationId ===
      medication.id;

    /*
     * Frontend safety mirrors the backend.
     */
    const canLog =
      currentlyActive &&
      started &&
      hasSchedule;

    const canMarkTaken =
      canLog &&
      !takenLimitReached;

    return (
      <div
        key={
          medication.id
        }
        className={`w-full rounded-corner-lg border bg-surface-bg transition-colors ${
          isSelected
            ? "border-brand-primary"
            : "border-border-secondary"
        }`}
      >
        {/* ================================================= */}
        {/* COLLAPSED HEADER */}
        {/* ================================================= */}

        <button
          type="button"
          onClick={() =>
            setSelected(
              isSelected
                ? null
                : medication.id
            )
          }
          className="w-full p-lg text-left lg:p-xl"
        >
          <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-md">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-corner-full bg-brand-tertiary">
                <Pill
                  size={16}
                  className="text-brand-primary"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-sm">
                  <p className="text-label-sm font-semibold text-text-primary">
                    {medication.name ||
                      "Medication"}
                  </p>

                  {medication.dosage && (
                    <span className="text-label-sm text-text-secondary">
                      {
                        medication.dosage
                      }
                    </span>
                  )}
                </div>

                <p className="mt-xs text-video-title text-text-secondary">
                  {medication.instructions ||
                    medication.form ||
                    "No instructions recorded"}
                </p>

                {currentlyActive &&
                  started &&
                  hasSchedule && (
                  <p className="mt-xs text-video-title text-text-tertiary">
                    {takenToday} of{" "}
                    {
                      scheduledDoses
                    }{" "}
                    scheduled{" "}
                    {scheduledDoses ===
                    1
                      ? "dose"
                      : "doses"}{" "}
                    marked as taken today
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-sm">
              {currentlyActive && (
                <Badge
                  label={
                    supplyLoading
                      ? "Loading supply"
                      : supplyDetails.label
                  }
                  variant={
                    supplyLoading
                      ? "default"
                      : supplyDetails.variant
                  }
                />
              )}

              {takenLimitReached &&
                started && (
                <Badge
                  label="Today's doses complete"
                  variant="success"
                />
              )}

              <Badge
                label={
                  status.label
                }
                variant={
                  status.variant
                }
              />

              <ChevronRight
                size={16}
                className={`text-text-tertiary transition-transform ${
                  isSelected
                    ? "rotate-90"
                    : ""
                }`}
              />
            </div>
          </div>
        </button>

        {/* ================================================= */}
        {/* EXPANDED CONTENT */}
        {/* ================================================= */}

        {isSelected && (
          <div className="px-lg pb-lg lg:px-xl lg:pb-xl">
            <div className="border-t border-border-secondary pt-lg">

              {/* =========================================== */}
              {/* MEDICATION SUPPLY */}
              {/* =========================================== */}

              {currentlyActive && (
                <div className="mb-lg rounded-corner-md bg-bg-faint p-lg">
                  <div className="mb-md flex items-start gap-sm">
                    <Package
                      size={16}
                      className="mt-[2px] shrink-0 text-brand-primary"
                    />

                    <div>
                      <p className="text-label-sm font-semibold text-text-primary">
                        Medication supply
                      </p>

                      <p className="mt-xs text-video-title text-text-secondary">
                        {supplyLoading
                          ? "Loading medication supply information..."
                          : supplyDetails.text}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
                    <div>
                      <p className="text-video-title text-text-tertiary">
                        Dispensed
                      </p>

                      <p className="mt-xs text-label-sm font-medium text-text-primary">
                        {formatQuantity(
                          medicationSupply
                            ?.dispensedQuantity
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-video-title text-text-tertiary">
                        Remaining
                      </p>

                      <p className="mt-xs text-label-sm font-medium text-text-primary">
                        {formatQuantity(
                          medicationSupply
                            ?.estimatedRemainingQuantity
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-video-title text-text-tertiary">
                        Days left
                      </p>

                      <p className="mt-xs text-label-sm font-medium text-text-primary">
                        {medicationSupply
                          ?.daysRemaining ??
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-video-title text-text-tertiary">
                        Doses/day
                      </p>

                      <p className="mt-xs text-label-sm font-medium text-text-primary">
                        {medicationSupply?.dosesPerDay ??
                        (scheduledDoses > 0
                          ? scheduledDoses
                          : "—")}
                      </p>
                    </div>
                  </div>

                  {medicationSupply
                    ?.lastCollectedAt && (
                    <p className="mt-md text-video-title text-text-tertiary">
                      Last collected{" "}
                      {formatDate(
                        medicationSupply
                          .lastCollectedAt
                      )}
                    </p>
                  )}

                  {medicationSupply
                    ?.unitsPerDose !=
                    null && (
                    <p className="mt-xs text-video-title text-text-tertiary">
                      {
                        medicationSupply.unitsPerDose
                      }{" "}
                      unit
                      {Number(
                        medicationSupply.unitsPerDose
                      ) ===
                      1
                        ? ""
                        : "s"}{" "}
                      per dose
                    </p>
                  )}

                  {supplyError && (
                    <div className="mt-md flex items-start gap-sm rounded-corner-md border border-warning/20 bg-warning/10 p-md">
                      <AlertCircle
                        size={14}
                        className="mt-[2px] shrink-0 text-warning"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-video-title text-text-secondary">
                          {
                            supplyError
                          }
                        </p>

                        <button
                          type="button"
                          onClick={
                            loadSupply
                          }
                          className="mt-xs text-video-title font-medium text-brand-primary hover:opacity-70"
                        >
                          Try supply again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================== */}
              {/* MEDICATION INFORMATION */}
              {/* =========================================== */}

              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
                <div>
                  <p className="mb-xs text-video-title text-text-tertiary">
                    Form
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {medication.form ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="mb-xs text-video-title text-text-tertiary">
                    Condition
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {medication.conditionName ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="mb-xs text-video-title text-text-tertiary">
                    Prescribed by
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {medication.prescribedBy ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="mb-xs text-video-title text-text-tertiary">
                    Schedule
                  </p>

                  {schedules.length >
                  0 ? (
                    <div className="flex flex-wrap gap-xs">
                      {schedules.map(
                        (
                          schedule
                        ) => (
                          <span
                            key={
                              schedule.id ||
                              schedule.timeOfDay
                            }
                            className="inline-flex items-center gap-xs text-label-sm text-text-primary"
                          >
                            <Clock
                              size={12}
                              className="text-text-secondary"
                            />

                            {formatTime(
                              schedule.timeOfDay
                            )}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-label-sm text-text-secondary">
                      No schedule recorded
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-xs text-video-title text-text-tertiary">
                    Start date
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {formatDate(
                      medication.startDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="mb-xs text-video-title text-text-tertiary">
                    End date
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {medication.endDate
                      ? formatDate(
                          medication.endDate
                        )
                      : "Not recorded"}
                  </p>
                </div>
              </div>

              {/* =========================================== */}
              {/* LATEST ADHERENCE */}
              {/* =========================================== */}

              {mostRecentLog && (
                <div className="mt-lg rounded-corner-md bg-surface-secondary p-md">
                  <div className="flex items-start gap-md">
                    <History
                      size={15}
                      className="mt-0.5 flex-shrink-0 text-text-secondary"
                    />

                    <div>
                      <p className="text-label-sm font-medium text-text-primary">
                        Latest adherence entry
                      </p>

                      <p className="mt-xs text-video-title text-text-secondary">
                        {mostRecentLog.taken
                          ? "Taken"
                          : "Skipped"}{" "}
                        ·{" "}
                        {formatDateTime(
                          mostRecentLog.takenAt
                        )}
                      </p>

                      {mostRecentLog.notes && (
                        <p className="mt-xs text-video-title text-text-secondary">
                          {
                            mostRecentLog.notes
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================== */}
              {/* DAILY DOSE SAFETY */}
              {/* =========================================== */}

              {currentlyActive && (
                <div className="mt-lg">
                  {!started && (
                    <div className="mb-md flex items-start gap-sm rounded-corner-md border border-warning/20 bg-warning/10 p-md">
                      <Clock
                        size={15}
                        className="mt-[2px] shrink-0 text-warning"
                      />

                      <p className="text-label-sm text-text-primary">
                        This medication starts on{" "}
                        {formatDate(
                          medication.startDate
                        )}
                        . Dose logging will become available once the medication has started.
                      </p>
                    </div>
                  )}

                  {started &&
                    !hasSchedule && (
                    <div className="mb-md flex items-start gap-sm rounded-corner-md border border-warning/20 bg-warning/10 p-md">
                      <AlertCircle
                        size={15}
                        className="mt-[2px] shrink-0 text-warning"
                      />

                      <p className="text-label-sm text-text-primary">
                        No active dosing schedule has been recorded for this medication. Contact your clinic before logging a dose.
                      </p>
                    </div>
                  )}

                  {started &&
                    hasSchedule &&
                    takenLimitReached && (
                    <div className="mb-md flex items-start gap-sm rounded-corner-md border border-success/20 bg-success/10 p-md">
                      <CheckCircle
                        size={16}
                        className="mt-[2px] shrink-0 text-success"
                      />

                      <div>
                        <p className="text-label-sm font-medium text-text-primary">
                          Today&apos;s scheduled doses are complete
                        </p>

                        <p className="mt-xs text-video-title text-text-secondary">
                          You have marked all{" "}
                          {
                            scheduledDoses
                          }{" "}
                          scheduled{" "}
                          {scheduledDoses ===
                          1
                            ? "dose"
                            : "doses"}{" "}
                          as taken today. Another Taken entry cannot be recorded until the next day.
                        </p>
                      </div>
                    </div>
                  )}

                  {started &&
                    hasSchedule &&
                    !takenLimitReached && (
                    <div className="mb-md rounded-corner-md bg-bg-faint p-md">
                      <div className="flex items-start justify-between gap-md">
                        <div>
                          <p className="text-label-sm font-medium text-text-primary">
                            Today&apos;s dose progress
                          </p>

                          <p className="mt-xs text-video-title text-text-secondary">
                            {takenToday} of{" "}
                            {
                              scheduledDoses
                            }{" "}
                            scheduled{" "}
                            {scheduledDoses ===
                            1
                              ? "dose"
                              : "doses"}{" "}
                            marked as taken.
                          </p>
                        </div>

                        <Badge
                          label={`${remainingTakenDoses} ${
                            remainingTakenDoses ===
                            1
                              ? "dose"
                              : "doses"
                          } left`}
                          variant="default"
                        />
                      </div>
                    </div>
                  )}

                  {todayLogs.length >
                    0 && (
                    <div className="mb-md flex flex-wrap items-center gap-md">
                      <div className="flex items-center gap-xs">
                        <CheckCircle
                          size={14}
                          className="text-success"
                        />

                        <p className="text-label-sm text-text-secondary">
                          {takenToday}{" "}
                          {takenToday ===
                          1
                            ? "dose"
                            : "doses"}{" "}
                          taken today
                        </p>
                      </div>

                      {skippedToday >
                        0 && (
                        <p className="text-label-sm text-text-secondary">
                          {skippedToday}{" "}
                          {skippedToday ===
                          1
                            ? "dose"
                            : "doses"}{" "}
                          skipped
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-md sm:flex-row">
                    <Button
                      variant="neutral"
                      className="flex-1"
                      disabled={
                        isUpdating ||
                        !canMarkTaken
                      }
                      onClick={() =>
                        handleLogDose(
                          medication.id,
                          true
                        )
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : !started
                          ? "Not started yet"
                          : !hasSchedule
                            ? "No active schedule"
                            : takenLimitReached
                              ? "Today's doses complete"
                              : "Mark as taken"}
                    </Button>

                    <Button
                      variant="subtle"
                      className="flex-1"
                      disabled={
                        isUpdating ||
                        !canLog ||
                        takenLimitReached
                      }
                      onClick={() =>
                        handleLogDose(
                          medication.id,
                          false
                        )
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Skip dose"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     PAGE UI
  ========================================================= */

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            My Medications
          </h1>

          <p className="mt-xs text-label-sm text-text-secondary">
            {loading
              ? "Loading your prescriptions..."
              : `${activeMedications.length} active ${
                  activeMedications.length ===
                  1
                    ? "prescription"
                    : "prescriptions"
                }`}
          </p>
        </div>

        <Button
          variant="subtle"
          iconStart={
            <RefreshCw
              size={15}
            />
          }
          onClick={
            loadMedications
          }
          disabled={
            loading
          }
        >
          Refresh
        </Button>
      </div>

      {/* =================================================== */}
      {/* SUCCESS MESSAGE */}
      {/* =================================================== */}

      {message && (
        <div className="mb-lg flex items-start gap-md rounded-corner-lg border border-success/20 bg-success/10 p-md">
          <CheckCircle
            size={17}
            className="mt-0.5 flex-shrink-0 text-success"
          />

          <p className="text-label-sm text-text-primary">
            {message}
          </p>
        </div>
      )}

      {/* =================================================== */}
      {/* ERROR MESSAGE */}
      {/* =================================================== */}

      {error && (
        <div className="mb-lg flex items-start gap-md rounded-corner-lg border border-danger/20 bg-danger/10 p-md">
          <AlertCircle
            size={17}
            className="mt-0.5 flex-shrink-0 text-danger"
          />

          <div className="flex-1">
            <p className="text-label-sm text-text-primary">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadMedications
              }
              className="mt-xs text-label-sm text-brand-primary hover:opacity-70"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* CONTENT */}
      {/* =================================================== */}

      {loading ? (
        <LoadingState />
      ) : medications.length ===
        0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-xl">

          {/* =============================================== */}
          {/* TODAY'S SCHEDULE */}
          {/* =============================================== */}

          {todaySchedule.length >
            0 && (
            <section>
              <div className="mb-md flex items-center gap-sm">
                <Clock
                  size={16}
                  className="text-brand-primary"
                />

                <h2 className="text-label font-semibold text-text-primary">
                  Today&apos;s schedule
                </h2>
              </div>

              <div className="rounded-corner-lg border border-border-secondary bg-surface-bg">
                {todaySchedule.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`${item.medicationId}-${item.time}`}
                      className={`flex items-center justify-between gap-md p-md ${
                        index <
                        todaySchedule.length -
                          1
                          ? "border-b border-border-secondary"
                          : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-sm">
                          <p className="truncate text-label-sm font-medium text-text-primary">
                            {
                              item.medicationName
                            }
                          </p>

                          {item.complete && (
                            <Badge
                              label="Complete"
                              variant="success"
                            />
                          )}
                        </div>

                        <p className="mt-xs text-video-title text-text-secondary">
                          {
                            item.dosage
                          }
                        </p>

                        <p className="mt-xs text-video-title text-text-tertiary">
                          {
                            item.takenToday
                          }{" "}
                          of{" "}
                          {
                            item.scheduledDoses
                          }{" "}
                          taken today
                        </p>
                      </div>

                      <span className="shrink-0 text-label-sm font-medium text-brand-primary">
                        {formatTime(
                          item.time
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* =============================================== */}
          {/* ACTIVE MEDICATIONS */}
          {/* =============================================== */}

          <section>
            <h2 className="mb-md text-label font-semibold text-text-primary">
              Active medications
            </h2>

            {activeMedications.length >
            0 ? (
              <div className="flex flex-col gap-md">
                {activeMedications.map(
                  renderMedicationCard
                )}
              </div>
            ) : (
              <p className="text-label-sm text-text-secondary">
                No active medications.
              </p>
            )}
          </section>

          {/* =============================================== */}
          {/* PREVIOUS MEDICATIONS */}
          {/* =============================================== */}

          {inactiveMedications.length >
            0 && (
            <section>
              <h2 className="mb-md text-label font-semibold text-text-primary">
                Previous medications
              </h2>

              <div className="flex flex-col gap-md">
                {inactiveMedications.map(
                  renderMedicationCard
                )}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="h-20 lg:hidden" />
    </div>
  );
}