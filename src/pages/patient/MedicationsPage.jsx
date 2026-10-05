import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

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

import {
  getLanguageLocale,
} from "../../i18n/languages.js";

function formatTime(
  value
) {
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

function formatDate(
  value,
  locale
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

  try {
    return date
      .toLocaleDateString(
        locale,
        {
          day:
            "2-digit",
          month:
            "short",
          year:
            "numeric",
        }
      );
  } catch {
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
}

function formatDateTime(
  value,
  locale
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

  try {
    return date
      .toLocaleString(
        locale,
        {
          day:
            "2-digit",
          month:
            "short",
          year:
            "numeric",
          hour:
            "2-digit",
          minute:
            "2-digit",
        }
      );
  } catch {
    return date
      .toLocaleString(
        "en-ZA"
      );
  }
}

function hasMedicationStarted(
  medication
) {
  if (
    !medication
      ?.startDate
  ) {
    return true;
  }

  const startDate =
    new Date(
      medication
        .startDate
    );

  if (
    Number.isNaN(
      startDate
        .getTime()
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
    !medication
      ?.endDate
  ) {
    return false;
  }

  const endDate =
    new Date(
      medication
        .endDate
    );

  if (
    Number.isNaN(
      endDate
        .getTime()
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
    medication
      ?.isActive !==
      false &&
    !hasMedicationEnded(
      medication
    )
  );
}

function getMedicationStatus(
  medication,
  t
) {
  if (
    medication
      ?.isActive ===
    false
  ) {
    return {
      label:
        t(
          "medications.inactive"
        ),
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
        t(
          "medications.ended"
        ),
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
        t(
          "medications.upcoming"
        ),
      variant:
        "default",
    };
  }

  return {
    label:
      t(
        "medications.active"
      ),
    variant:
      "success",
  };
}

function getActiveSchedules(
  medication
) {
  if (
    !Array.isArray(
      medication
        ?.schedules
    )
  ) {
    return [];
  }

  return [
    ...medication
      .schedules,
  ]
    .filter(
      schedule =>
        schedule
          ?.isActive !==
        false
    )
    .sort(
      (
        a,
        b
      ) =>
        String(
          a?.timeOfDay ??
            ""
        )
          .localeCompare(
            String(
              b?.timeOfDay ??
                ""
            )
          )
    );
}

const SOUTH_AFRICA_DATE_FORMATTER =
  new Intl.DateTimeFormat(
    "en-ZA",
    {
      timeZone:
        "Africa/Johannesburg",
      year:
        "numeric",
      month:
        "2-digit",
      day:
        "2-digit",
    }
  );

function getSouthAfricaDateKey(
  value
) {
  const date =
    value instanceof Date
      ? value
      : new Date(
          value
        );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  const parts =
    SOUTH_AFRICA_DATE_FORMATTER
      .formatToParts(
        date
      );

  const year =
    parts.find(
      part =>
        part.type ===
        "year"
    )?.value;

  const month =
    parts.find(
      part =>
        part.type ===
        "month"
    )?.value;

  const day =
    parts.find(
      part =>
        part.type ===
        "day"
    )?.value;

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
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

  const todayKey =
    getSouthAfricaDateKey(
      new Date()
    );

  if (
    !todayKey
  ) {
    return [];
  }

  return medication
    .logs
    .filter(
      log =>
        Boolean(
          log?.takenAt
        ) &&
        getSouthAfricaDateKey(
          log.takenAt
        ) ===
          todayKey
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
      log =>
        log?.taken ===
        true
    ).length;

  const skippedToday =
    todayLogs.filter(
      log =>
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
    ? String(
        number
      )
    : number
        .toFixed(
          1
        );
}

function getSupplyMessage(
  supply,
  t
) {
  if (!supply) {
    return {
      label:
        t(
          "medications.supplyUnavailable"
        ),

      variant:
        "default",

      text:
        t(
          "medications.supplyInformationUnavailable"
        ),
    };
  }

  switch (
    supply.calculationStatus
  ) {
    case "Available":
      return {
        label:
          Number(
            supply
              .daysRemaining
          ) ===
          0
            ? t(
                "medications.supplyDepleted"
              )
            : t(
                Number(
                  supply
                    .daysRemaining
                ) ===
                  1
                  ? "medications.dayRemaining"
                  : "medications.daysRemaining",
                {
                  count:
                    Number(
                      supply
                        .daysRemaining
                    ),
                }
              ),

        variant:
          Number(
            supply
              .daysRemaining
          ) <=
          3
            ? "warning"
            : "success",

        text:
          t(
            "medications.estimatedSupplyText"
          ),
      };

    case "MissingUnitsPerDose":
      return {
        label:
          t(
            "medications.doseAmountNeeded"
          ),
        variant:
          "warning",
        text:
          t(
            "medications.missingUnitsText"
          ),
      };

    case "MissingSchedule":
      return {
        label:
          t(
            "medications.scheduleNeeded"
          ),
        variant:
          "warning",
        text:
          t(
            "medications.missingScheduleText"
          ),
      };

    case "NoCompletedCollection":
      return {
        label:
          t(
            "medications.noCollectedSupply"
          ),
        variant:
          "default",
        text:
          t(
            "medications.noCompletedCollectionText"
          ),
      };

    default:
      return {
        label:
          t(
            "medications.supplyUnavailable"
          ),
        variant:
          "default",
        text:
          t(
            "medications.supplyCalculationFailed"
          ),
      };
  }
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-md">
      {[1, 2, 3].map(
        item => (
          <div
            key={
              item
            }
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

function EmptyState() {
  const {
    t,
  } =
    useTranslation();

  return (
    <div className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl text-center lg:p-2xl">
      <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-corner-full bg-brand-tertiary">
        <Pill
          size={20}
          className="text-brand-primary"
        />
      </div>

      <h2 className="text-label font-semibold text-text-primary">
        {t(
          "medications.noMedicationsTitle"
        )}
      </h2>

      <p className="mx-auto mt-xs max-w-md text-label-sm text-text-secondary">
        {t(
          "medications.noMedicationsBody"
        )}
      </p>
    </div>
  );
}

export default function MedicationsPage() {
  const {
    t,
    i18n,
  } =
    useTranslation();

  const locale =
    getLanguageLocale(
      i18n.resolvedLanguage ||
        i18n.language
    );

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
              i18n.t(
                "medications.supplyTemporaryUnavailable"
              )
          );
        } finally {
          setSupplyLoading(
            false
          );
        }
      },
      [
        i18n,
      ]
    );

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
              i18n.t(
                "medications.loadError"
              )
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
        i18n,
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

  const supplyByMedication =
    useMemo(
      () =>
        new Map(
          supply.map(
            item => [
              item.medicationId,
              item,
            ]
          )
        ),
      [
        supply,
      ]
    );

  const activeMedications =
    useMemo(
      () =>
        medications.filter(
          medication =>
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
          medication =>
            !isMedicationActive(
              medication
            )
        ),
      [
        medications,
      ]
    );

  const todaySchedule =
    useMemo(
      () =>
        activeMedications
          .filter(
            medication =>
              hasMedicationStarted(
                medication
              )
          )
          .flatMap(
            medication => {
              const progress =
                getDoseProgress(
                  medication
                );

              return progress
                .schedules
                .map(
                  schedule => ({
                    medicationId:
                      medication.id,

                    medicationName:
                      medication.name,

                    dosage:
                      medication.dosage,

                    time:
                      schedule.timeOfDay,

                    takenToday:
                      progress
                        .takenToday,

                    scheduledDoses:
                      progress
                        .scheduledDoses,

                    complete:
                      progress
                        .takenLimitReached,
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
              )
                .localeCompare(
                  String(
                    b.time
                  )
                )
          ),
      [
        activeMedications,
      ]
    );

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
          ? t(
              "medications.takenMessage"
            )
          : t(
              "medications.skippedMessage"
            )
      );

      await loadMedications();
    } catch (
      err
    ) {
      console.error(
        "Failed to log medication:",
        err
      );

      setError(
        err?.message ||
          t(
            "medications.updateError"
          )
      );

      await loadMedications();
    } finally {
      setActionMedicationId(
        null
      );
    }
  }

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
        medication,
        t
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
      supplyByMedication
        .get(
          medication.id
        );

    const supplyDetails =
      getSupplyMessage(
        medicationSupply,
        t
      );

    const supplyStatus =
      medicationSupply
        ?.calculationStatus;

    const estimatedRemaining =
      Number(
        medicationSupply
          ?.estimatedRemainingQuantity ??
          0
      );

    const unitsPerDose =
      Number(
        medicationSupply
          ?.unitsPerDose ??
          medication
            .unitsPerDose ??
          0
      );

    const hasCompletedCollection =
      Boolean(
        medicationSupply
          ?.lastCollectedAt
      );

    const hasUsableSupply =
      supplyStatus ===
        "Available" &&
      hasCompletedCollection &&
      unitsPerDose >
        0 &&
      estimatedRemaining >=
        unitsPerDose;

    const mostRecentLog =
      Array.isArray(
        medication.logs
      )
        ? [
            ...medication
              .logs,
          ]
            .filter(
              log =>
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

    const canLog =
      currentlyActive &&
      started &&
      hasSchedule;

    const canMarkTaken =
      canLog &&
      !supplyLoading &&
      hasUsableSupply &&
      !takenLimitReached;

    const doseWord =
      scheduledDoses ===
      1
        ? "dose"
        : "doses";

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
                      t(
                        "medications.medication"
                      )}
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
                    t(
                      "medications.noInstructions"
                    )}
                </p>

                {currentlyActive &&
                  started &&
                  hasSchedule && (
                    <p className="mt-xs text-video-title text-text-tertiary">
                      {t(
                        "medications.doseProgressSummary",
                        {
                          taken:
                            takenToday,
                          scheduled:
                            scheduledDoses,
                          doseWord,
                        }
                      )}
                    </p>
                  )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-sm">
              {currentlyActive && (
                <Badge
                  label={
                    supplyLoading
                      ? t(
                          "medications.loadingSupply"
                        )
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
                started &&
                hasUsableSupply && (
                  <Badge
                    label={t(
                      "medications.todaysDosesComplete"
                    )}
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

        {isSelected && (
          <div className="px-lg pb-lg lg:px-xl lg:pb-xl">
            <div className="border-t border-border-secondary pt-lg">
              {currentlyActive && (
                <div className="mb-lg rounded-corner-md bg-bg-faint p-lg">
                  <div className="mb-md flex items-start gap-sm">
                    <Package
                      size={16}
                      className="mt-[2px] shrink-0 text-brand-primary"
                    />

                    <div>
                      <p className="text-label-sm font-semibold text-text-primary">
                        {t(
                          "medications.medicationSupply"
                        )}
                      </p>

                      <p className="mt-xs text-video-title text-text-secondary">
                        {supplyLoading
                          ? t(
                              "medications.loadingSupplyInformation"
                            )
                          : supplyDetails.text}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
                    <SupplyValue
                      label={t(
                        "medications.dispensed"
                      )}
                      value={formatQuantity(
                        medicationSupply
                          ?.dispensedQuantity
                      )}
                    />

                    <SupplyValue
                      label={t(
                        "medications.remaining"
                      )}
                      value={formatQuantity(
                        medicationSupply
                          ?.estimatedRemainingQuantity
                      )}
                    />

                    <SupplyValue
                      label={t(
                        "medications.daysLeft"
                      )}
                      value={
                        medicationSupply
                          ?.daysRemaining ??
                        "—"
                      }
                    />

                    <SupplyValue
                      label={t(
                        "medications.dosesPerDay"
                      )}
                      value={
                        medicationSupply
                          ?.dosesPerDay ??
                        (scheduledDoses >
                        0
                          ? scheduledDoses
                          : "—")
                      }
                    />
                  </div>

                  {medicationSupply
                    ?.lastCollectedAt && (
                    <p className="mt-md text-video-title text-text-tertiary">
                      {t(
                        "medications.lastCollected",
                        {
                          date:
                            formatDate(
                              medicationSupply
                                .lastCollectedAt,
                              locale
                            ),
                        }
                      )}
                    </p>
                  )}

                  {medicationSupply
                    ?.unitsPerDose !=
                    null && (
                    <p className="mt-xs text-video-title text-text-tertiary">
                      {t(
                        "medications.unitsPerDose",
                        {
                          count:
                            Number(
                              medicationSupply
                                .unitsPerDose
                            ),
                        }
                      )}
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
                          {t(
                            "medications.trySupplyAgain"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
                <InfoValue
                  label={t(
                    "medications.form"
                  )}
                  value={
                    medication.form ||
                    "—"
                  }
                />

                <InfoValue
                  label={t(
                    "medications.condition"
                  )}
                  value={
                    medication.conditionName ||
                    "—"
                  }
                />

                <InfoValue
                  label={t(
                    "medications.prescribedBy"
                  )}
                  value={
                    medication.prescribedBy ||
                    "—"
                  }
                />

                <div>
                  <p className="mb-xs text-video-title text-text-tertiary">
                    {t(
                      "medications.schedule"
                    )}
                  </p>

                  {schedules.length >
                  0 ? (
                    <div className="flex flex-wrap gap-xs">
                      {schedules.map(
                        schedule => (
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
                      {t(
                        "medications.noScheduleRecorded"
                      )}
                    </p>
                  )}
                </div>

                <InfoValue
                  label={t(
                    "medications.startDate"
                  )}
                  value={formatDate(
                    medication.startDate,
                    locale
                  )}
                />

                <InfoValue
                  label={t(
                    "medications.endDate"
                  )}
                  value={
                    medication.endDate
                      ? formatDate(
                          medication.endDate,
                          locale
                        )
                      : t(
                          "medications.notRecorded"
                        )
                  }
                />
              </div>

              {mostRecentLog && (
                <div className="mt-lg rounded-corner-md bg-surface-secondary p-md">
                  <div className="flex items-start gap-md">
                    <History
                      size={15}
                      className="mt-0.5 flex-shrink-0 text-text-secondary"
                    />

                    <div>
                      <p className="text-label-sm font-medium text-text-primary">
                        {t(
                          "medications.latestAdherence"
                        )}
                      </p>

                      <p className="mt-xs text-video-title text-text-secondary">
                        {mostRecentLog.taken
                          ? t(
                              "medications.taken"
                            )
                          : t(
                              "medications.skipped"
                            )}{" "}
                        ·{" "}
                        {formatDateTime(
                          mostRecentLog.takenAt,
                          locale
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

              {currentlyActive && (
                <div className="mt-lg">
                  {!started && (
                    <Warning>
                      <Clock
                        size={15}
                        className="mt-[2px] shrink-0 text-warning"
                      />

                      <p className="text-label-sm text-text-primary">
                        {t(
                          "medications.startsOn",
                          {
                            date:
                              formatDate(
                                medication.startDate,
                                locale
                              ),
                          }
                        )}
                      </p>
                    </Warning>
                  )}

                  {started &&
                    !hasSchedule && (
                      <Warning>
                        <AlertCircle
                          size={15}
                          className="mt-[2px] shrink-0 text-warning"
                        />

                        <p className="text-label-sm text-text-primary">
                          {t(
                            "medications.noActiveScheduleMessage"
                          )}
                        </p>
                      </Warning>
                    )}

                  {started &&
                    hasSchedule &&
                    !supplyLoading &&
                    supplyStatus ===
                      "NoCompletedCollection" && (
                      <Warning>
                        <AlertCircle
                          size={15}
                          className="mt-[2px] shrink-0 text-warning"
                        />

                        <div>
                          <p className="text-label-sm font-medium text-text-primary">
                            {t(
                              "medications.notCollectedTitle"
                            )}
                          </p>

                          <p className="mt-xs text-video-title text-text-secondary">
                            {t(
                              "medications.notCollectedBody"
                            )}
                          </p>
                        </div>
                      </Warning>
                    )}

                  {started &&
                    hasSchedule &&
                    !supplyLoading &&
                    supplyStatus ===
                      "MissingUnitsPerDose" && (
                      <Warning>
                        <AlertCircle
                          size={15}
                          className="mt-[2px] shrink-0 text-warning"
                        />

                        <div>
                          <p className="text-label-sm font-medium text-text-primary">
                            {t(
                              "medications.doseAmountConfigurationTitle"
                            )}
                          </p>

                          <p className="mt-xs text-video-title text-text-secondary">
                            {t(
                              "medications.doseAmountConfigurationBody"
                            )}
                          </p>
                        </div>
                      </Warning>
                    )}

                  {started &&
                    hasSchedule &&
                    !supplyLoading &&
                    supplyStatus ===
                      "Available" &&
                    estimatedRemaining <
                      unitsPerDose && (
                      <Warning>
                        <AlertCircle
                          size={15}
                          className="mt-[2px] shrink-0 text-warning"
                        />

                        <div>
                          <p className="text-label-sm font-medium text-text-primary">
                            {t(
                              "medications.supplyDepletedTitle"
                            )}
                          </p>

                          <p className="mt-xs text-video-title text-text-secondary">
                            {t(
                              "medications.supplyDepletedBody"
                            )}
                          </p>
                        </div>
                      </Warning>
                    )}

                  {started &&
                    hasSchedule &&
                    !supplyLoading &&
                    !supplyStatus &&
                    supplyError && (
                      <Warning>
                        <AlertCircle
                          size={15}
                          className="mt-[2px] shrink-0 text-warning"
                        />

                        <p className="text-label-sm text-text-primary">
                          {t(
                            "medications.supplyVerificationUnavailable"
                          )}
                        </p>
                      </Warning>
                    )}

                  {started &&
                    hasSchedule &&
                    hasUsableSupply &&
                    takenLimitReached && (
                      <div className="mb-md flex items-start gap-sm rounded-corner-md border border-success/20 bg-success/10 p-md">
                        <CheckCircle
                          size={16}
                          className="mt-[2px] shrink-0 text-success"
                        />

                        <div>
                          <p className="text-label-sm font-medium text-text-primary">
                            {t(
                              "medications.scheduledDosesCompleteTitle"
                            )}
                          </p>

                          <p className="mt-xs text-video-title text-text-secondary">
                            {t(
                              "medications.scheduledDosesCompleteBody",
                              {
                                count:
                                  scheduledDoses,
                                doseWord,
                              }
                            )}
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
                              {t(
                                "medications.todaysDoseProgress"
                              )}
                            </p>

                            <p className="mt-xs text-video-title text-text-secondary">
                              {t(
                                "medications.doseProgress",
                                {
                                  taken:
                                    takenToday,

                                  scheduled:
                                    scheduledDoses,

                                  doseWord,
                                }
                              )}
                            </p>
                          </div>

                          <Badge
                            label={t(
                              "medications.dosesLeft",
                              {
                                count:
                                  remainingTakenDoses,
                              }
                            )}
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
                          {t(
                            "medications.takenToday",
                            {
                              count:
                                takenToday,
                            }
                          )}
                        </p>
                      </div>

                      {skippedToday >
                        0 && (
                        <p className="text-label-sm text-text-secondary">
                          {t(
                            "medications.skippedToday",
                            {
                              count:
                                skippedToday,
                            }
                          )}
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
                        ? t(
                            "medications.updating"
                          )
                        : !started
                        ? t(
                            "medications.notStartedYet"
                          )
                        : !hasSchedule
                        ? t(
                            "medications.noActiveSchedule"
                          )
                        : supplyLoading
                        ? t(
                            "medications.checkingSupply"
                          )
                        : supplyStatus ===
                          "NoCompletedCollection"
                        ? t(
                            "medications.noCollectedSupply"
                          )
                        : supplyStatus ===
                          "MissingUnitsPerDose"
                        ? t(
                            "medications.doseAmountNeeded"
                          )
                        : supplyStatus ===
                            "Available" &&
                          estimatedRemaining <
                            unitsPerDose
                        ? t(
                            "medications.supplyDepleted"
                          )
                        : supplyStatus !==
                          "Available"
                        ? t(
                            "medications.supplyUnavailable"
                          )
                        : takenLimitReached
                        ? t(
                            "medications.todaysDosesComplete"
                          )
                        : t(
                            "medications.markAsTaken"
                          )}
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
                        ? t(
                            "medications.updating"
                          )
                        : t(
                            "medications.skipDose"
                          )}
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

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            {t(
              "medications.title"
            )}
          </h1>

          <p className="mt-xs text-label-sm text-text-secondary">
            {loading
              ? t(
                  "medications.loadingPrescriptions"
                )
              : t(
                  "medications.activePrescriptionCount",
                  {
                    count:
                      activeMedications.length,
                  }
                )}
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
          {t(
            "medications.refresh"
          )}
        </Button>
      </div>

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
              {t(
                "common.tryAgain"
              )}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : medications.length ===
        0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-xl">
          {todaySchedule.length >
            0 && (
            <section>
              <div className="mb-md flex items-center gap-sm">
                <Clock
                  size={16}
                  className="text-brand-primary"
                />

                <h2 className="text-label font-semibold text-text-primary">
                  {t(
                    "medications.todaysSchedule"
                  )}
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
                              label={t(
                                "medications.complete"
                              )}
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
                          {t(
                            "medications.scheduleTaken",
                            {
                              taken:
                                item.takenToday,
                              scheduled:
                                item.scheduledDoses,
                            }
                          )}
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

          <section>
            <h2 className="mb-md text-label font-semibold text-text-primary">
              {t(
                "medications.activeMedications"
              )}
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
                {t(
                  "medications.noActiveMedications"
                )}
              </p>
            )}
          </section>

          {inactiveMedications.length >
            0 && (
            <section>
              <h2 className="mb-md text-label font-semibold text-text-primary">
                {t(
                  "medications.previousMedications"
                )}
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

function SupplyValue({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-video-title text-text-tertiary">
        {label}
      </p>

      <p className="mt-xs text-label-sm font-medium text-text-primary">
        {value}
      </p>
    </div>
  );
}

function InfoValue({
  label,
  value,
}) {
  return (
    <div>
      <p className="mb-xs text-video-title text-text-tertiary">
        {label}
      </p>

      <p className="text-label-sm text-text-primary">
        {value}
      </p>
    </div>
  );
}

function Warning({
  children,
}) {
  return (
    <div className="mb-md flex items-start gap-sm rounded-corner-md border border-warning/20 bg-warning/10 p-md">
      {children}
    </div>
  );
}
