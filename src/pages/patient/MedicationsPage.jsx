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
  Pill,
  RefreshCw,
} from "lucide-react";
import {
  Badge,
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";
import { medicationsApi } from "../../services/api/medications.js";

function formatTime(value) {
  if (!value) return "—";

  const text = String(value);

  if (/^\d{2}:\d{2}/.test(text)) {
    return text.slice(0, 5);
  }

  return text;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActiveSchedules(medication) {
  if (!Array.isArray(medication?.schedules)) {
    return [];
  }

  return medication.schedules
    .filter((schedule) => schedule?.isActive !== false)
    .sort((a, b) =>
      String(a?.timeOfDay ?? "").localeCompare(
        String(b?.timeOfDay ?? "")
      )
    );
}

function getTodayLogs(medication) {
  if (!Array.isArray(medication?.logs)) {
    return [];
  }

  const now = new Date();

  return medication.logs.filter((log) => {
    if (!log?.takenAt) return false;

    const date = new Date(log.takenAt);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  });
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-md">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl border border-border-secondary animate-pulse"
        >
          <div className="flex gap-md">
            <div className="w-9 h-9 rounded-corner-full bg-border-secondary" />

            <div className="flex-1">
              <div className="h-4 w-40 bg-border-secondary rounded mb-sm" />
              <div className="h-3 w-56 bg-border-secondary rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-bg rounded-corner-lg border border-border-secondary p-xl lg:p-2xl text-center">
      <div className="w-12 h-12 rounded-corner-full bg-brand-tertiary flex items-center justify-center mx-auto mb-md">
        <Pill
          size={20}
          className="text-brand-primary"
        />
      </div>

      <h2 className="text-label text-text-primary font-semibold">
        No medications on record
      </h2>

      <p className="text-label-sm text-text-secondary mt-xs max-w-md mx-auto">
        There are currently no medications linked to your
        patient profile.
      </p>
    </div>
  );
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMedicationId, setActionMedicationId] =
    useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadMedications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await medicationsApi.getMine();

      setMedications(
        Array.isArray(result) ? result : []
      );
    } catch (err) {
      console.error(
        "Failed to load medications:",
        err
      );

      setError(
        err?.message ||
          "We could not load your medications."
      );

      setMedications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  const activeMedications = useMemo(
    () =>
      medications.filter(
        (medication) =>
          medication?.isActive !== false
      ),
    [medications]
  );

  const inactiveMedications = useMemo(
    () =>
      medications.filter(
        (medication) =>
          medication?.isActive === false
      ),
    [medications]
  );

  const todaySchedule = useMemo(() => {
    return activeMedications
      .flatMap((medication) =>
        getActiveSchedules(medication).map(
          (schedule) => ({
            medicationId: medication.id,
            medicationName: medication.name,
            dosage: medication.dosage,
            time: schedule.timeOfDay,
          })
        )
      )
      .sort((a, b) =>
        String(a.time).localeCompare(
          String(b.time)
        )
      );
  }, [activeMedications]);

  async function handleLogDose(
    medicationId,
    taken
  ) {
    try {
      setActionMedicationId(medicationId);
      setError("");
      setMessage("");

      await medicationsApi.logDose(
        medicationId,
        {
          taken,
          notes: null,
        }
      );

      setMessage(
        taken
          ? "Medication marked as taken."
          : "Medication marked as skipped."
      );

      await loadMedications();
    } catch (err) {
      console.error(
        "Failed to log medication:",
        err
      );

      setError(
        err?.message ||
          "We could not update this medication."
      );
    } finally {
      setActionMedicationId(null);
    }
  }

  function renderMedicationCard(medication) {
    const isSelected =
      selected === medication.id;

    const schedules =
      getActiveSchedules(medication);

    const todayLogs =
      getTodayLogs(medication);

    const mostRecentLog = Array.isArray(
      medication.logs
    )
      ? [...medication.logs]
          .filter((log) => log?.takenAt)
          .sort(
            (a, b) =>
              new Date(b.takenAt) -
              new Date(a.takenAt)
          )[0]
      : null;

    const isUpdating =
      actionMedicationId === medication.id;

    return (
      <div
        key={medication.id}
        className={`w-full bg-surface-bg rounded-corner-lg border transition-colors ${
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
          className="w-full text-left p-lg lg:p-xl"
        >
          <div className="flex items-start justify-between gap-md">
            <div className="flex items-center gap-md flex-1 min-w-0">
              <div className="w-9 h-9 rounded-corner-full bg-brand-tertiary flex items-center justify-center flex-shrink-0">
                <Pill
                  size={16}
                  className="text-brand-primary"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-sm">
                  <p className="text-label-sm text-text-primary font-semibold">
                    {medication.name ||
                      "Medication"}
                  </p>

                  {medication.dosage && (
                    <span className="text-label-sm text-text-secondary">
                      {medication.dosage}
                    </span>
                  )}
                </div>

                <p className="text-video-title text-text-secondary mt-xs">
                  {medication.instructions ||
                    medication.form ||
                    "No instructions recorded"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-md flex-shrink-0">
              <Badge
                label={
                  medication.isActive
                    ? "Active"
                    : "Inactive"
                }
                variant={
                  medication.isActive
                    ? "success"
                    : "default"
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
          <div className="px-lg lg:px-xl pb-lg lg:pb-xl">
            <div className="pt-lg border-t border-border-secondary">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div>
                  <p className="text-video-title text-text-tertiary mb-xs">
                    Form
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {medication.form || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-video-title text-text-tertiary mb-xs">
                    Condition
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {medication.conditionName ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-video-title text-text-tertiary mb-xs">
                    Prescribed by
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {medication.prescribedBy ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-video-title text-text-tertiary mb-xs">
                    Schedule
                  </p>

                  {schedules.length > 0 ? (
                    <div className="flex flex-wrap gap-xs">
                      {schedules.map(
                        (schedule) => (
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
                  <p className="text-video-title text-text-tertiary mb-xs">
                    Start date
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {formatDate(
                      medication.startDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-video-title text-text-tertiary mb-xs">
                    End date
                  </p>

                  <p className="text-label-sm text-text-primary">
                    {medication.endDate
                      ? formatDate(
                          medication.endDate
                        )
                      : "Ongoing"}
                  </p>
                </div>
              </div>

              {mostRecentLog && (
                <div className="mt-lg p-md rounded-corner-md bg-surface-secondary">
                  <div className="flex items-start gap-md">
                    <History
                      size={15}
                      className="text-text-secondary mt-0.5 flex-shrink-0"
                    />

                    <div>
                      <p className="text-label-sm text-text-primary font-medium">
                        Latest adherence entry
                      </p>

                      <p className="text-video-title text-text-secondary mt-xs">
                        {mostRecentLog.taken
                          ? "Taken"
                          : "Skipped"}{" "}
                        ·{" "}
                        {formatDateTime(
                          mostRecentLog.takenAt
                        )}
                      </p>

                      {mostRecentLog.notes && (
                        <p className="text-video-title text-text-secondary mt-xs">
                          {
                            mostRecentLog.notes
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {medication.isActive && (
                <div className="mt-lg">
                  {todayLogs.length > 0 && (
                    <div className="flex items-center gap-xs mb-md">
                      <CheckCircle
                        size={14}
                        className="text-success"
                      />

                      <p className="text-label-sm text-text-secondary">
                        {
                          todayLogs.length
                        }{" "}
                        adherence{" "}
                        {todayLogs.length ===
                        1
                          ? "entry"
                          : "entries"}{" "}
                        recorded today
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-md">
                    <Button
                      variant="neutral"
                      className="flex-1"
                      disabled={isUpdating}
                      onClick={() =>
                        handleLogDose(
                          medication.id,
                          true
                        )
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : "Mark as taken"}
                    </Button>

                    <Button
                      variant="subtle"
                      className="flex-1"
                      disabled={isUpdating}
                      onClick={() =>
                        handleLogDose(
                          medication.id,
                          false
                        )
                      }
                    >
                      Skip dose
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-md mb-lg lg:mb-xl">
        <div>
          <h1 className="text-title text-text-primary">
            My Medications
          </h1>

          <p className="text-label-sm text-text-secondary mt-xs">
            {loading
              ? "Loading your prescriptions..."
              : `${activeMedications.length} active ${
                  activeMedications.length === 1
                    ? "prescription"
                    : "prescriptions"
                }`}
          </p>
        </div>

        <Button
          variant="subtle"
          iconStart={
            <RefreshCw size={15} />
          }
          onClick={loadMedications}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {message && (
        <div className="mb-lg flex items-start gap-md bg-success/10 rounded-corner-lg p-md border border-success/20">
          <CheckCircle
            size={17}
            className="text-success flex-shrink-0 mt-0.5"
          />

          <p className="text-label-sm text-text-primary">
            {message}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-lg flex items-start gap-md bg-danger/10 rounded-corner-lg p-md border border-danger/20">
          <AlertCircle
            size={17}
            className="text-danger flex-shrink-0 mt-0.5"
          />

          <div className="flex-1">
            <p className="text-label-sm text-text-primary">
              {error}
            </p>

            <button
              type="button"
              onClick={loadMedications}
              className="text-label-sm text-brand-primary mt-xs hover:opacity-70 transition-opacity"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg lg:gap-xl">
        <div className="lg:col-span-2">
          {loading ? (
            <LoadingState />
          ) : activeMedications.length ===
            0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-md">
              {activeMedications.map(
                renderMedicationCard
              )}
            </div>
          )}

          {!loading &&
            inactiveMedications.length >
              0 && (
              <div className="mt-xl">
                <h2 className="text-label text-text-primary font-semibold mb-md">
                  Previous medications
                </h2>

                <div className="flex flex-col gap-md">
                  {inactiveMedications.map(
                    renderMedicationCard
                  )}
                </div>
              </div>
            )}
        </div>

        <div className="flex flex-col gap-lg">
          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl border border-border-secondary">
            <div className="flex items-center gap-sm mb-lg">
              <Clock
                size={16}
                className="text-brand-primary"
              />

              <h2 className="text-label text-text-primary font-semibold">
                Today's schedule
              </h2>
            </div>

            {loading ? (
              <p className="text-label-sm text-text-secondary">
                Loading schedule...
              </p>
            ) : todaySchedule.length ===
              0 ? (
              <p className="text-label-sm text-text-secondary">
                No medication times are
                scheduled.
              </p>
            ) : (
              <div className="flex flex-col gap-md">
                {todaySchedule.map(
                  (item, index) => (
                    <div
                      key={`${item.medicationId}-${item.time}-${index}`}
                      className="flex items-center gap-md"
                    >
                      <div className="w-12 flex-shrink-0 text-right">
                        <span className="text-video-title text-text-tertiary">
                          {formatTime(
                            item.time
                          )}
                        </span>
                      </div>

                      <div className="w-px h-8 bg-border-secondary flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <p className="text-label-sm text-text-primary truncate">
                          {
                            item.medicationName
                          }
                        </p>

                        {item.dosage && (
                          <p className="text-video-title text-text-secondary truncate">
                            {
                              item.dosage
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl border border-border-secondary">
            <div className="flex items-start gap-md">
              <AlertCircle
                size={16}
                className="text-brand-primary flex-shrink-0 mt-0.5"
              />

              <div>
                <h2 className="text-label text-text-primary font-semibold">
                  Medication safety
                </h2>

                <p className="text-label-sm text-text-secondary mt-xs">
                  Only mark a dose as taken
                  after you have taken it.
                  Contact your clinic if any
                  prescription details appear
                  incorrect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}