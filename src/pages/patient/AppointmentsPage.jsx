import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Stethoscope,
  Video,
  X,
} from "lucide-react";

import {
  Badge,
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";

import {
  appointmentsApi,
} from "../../services/api/appointments.js";

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}

function formatDate(value) {
  const date =
    parseDate(value);

  if (!date) {
    return "Date not available";
  }

  return date.toLocaleDateString(
    "en-ZA",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function formatTimeRange(
  scheduledAt,
  durationMinutes
) {
  const start =
    parseDate(
      scheduledAt
    );

  if (!start) {
    return "—";
  }

  const duration =
    Number(
      durationMinutes
    ) > 0
      ? Number(
          durationMinutes
        )
      : 0;

  const end =
    new Date(
      start.getTime() +
        duration *
          60 *
          1000
    );

  const startText =
    start.toLocaleTimeString(
      "en-ZA",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  if (!duration) {
    return startText;
  }

  const endText =
    end.toLocaleTimeString(
      "en-ZA",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  return `${startText} – ${endText}`;
}

function normaliseStatus(
  value
) {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase();
}

function isPastAppointment(
  appointment
) {
  const status =
    normaliseStatus(
      appointment?.status
    );

  if (
    status === "completed" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "missed" ||
    status === "noshow" ||
    status === "no-show"
  ) {
    return true;
  }

  const date =
    parseDate(
      appointment
        ?.scheduledAt
    );

  if (!date) {
    return false;
  }

  return (
    date.getTime() <
    Date.now()
  );
}

function canReschedule(
  appointment
) {
  if (
    isPastAppointment(
      appointment
    )
  ) {
    return false;
  }

  const status =
    normaliseStatus(
      appointment?.status
    );

  return ![
    "completed",
    "cancelled",
    "canceled",
    "missed",
    "noshow",
    "no-show",
  ].includes(status);
}

function getStatusDetails(
  statusValue
) {
  const status =
    normaliseStatus(
      statusValue
    );

  switch (status) {
    case "confirmed":
      return {
        label:
          "Confirmed",
        variant:
          "success",
      };

    case "completed":
      return {
        label:
          "Completed",
        variant:
          "success",
      };

    case "cancelled":
    case "canceled":
      return {
        label:
          "Cancelled",
        variant:
          "default",
      };

    case "pending":
      return {
        label:
          "Pending",
        variant:
          "warning",
      };

    case "rescheduled":
      return {
        label:
          "Rescheduled",
        variant:
          "default",
      };

    case "missed":
    case "noshow":
    case "no-show":
      return {
        label:
          "Missed",
        variant:
          "warning",
      };

    case "scheduled":
      return {
        label:
          "Scheduled",
        variant:
          "default",
      };

    default:
      return {
        label:
          statusValue ||
          "Scheduled",

        variant:
          "default",
      };
  }
}

function getProviderName(
  appointment
) {
  return (
    appointment
      ?.providerName ||
    appointment
      ?.nurseName ||
    "Clinic provider"
  );
}

function isTelehealth(
  mode
) {
  return (
    String(
      mode ?? ""
    )
      .trim()
      .toLowerCase() ===
    "telehealth"
  );
}

function toLocalDateTimeInput(
  value = null
) {
  let date;

  if (value) {
    date =
      new Date(value);
  } else {
    date =
      new Date();

    date.setMinutes(
      date.getMinutes() +
        60
    );
  }

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  const local =
    new Date(
      date.getTime() -
        offset *
          60 *
          1000
    );

  return local
    .toISOString()
    .slice(0, 16);
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-md">
      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl"
          >
            <div className="mb-md h-4 w-44 rounded bg-border-secondary" />
            <div className="mb-sm h-3 w-56 rounded bg-border-secondary" />
            <div className="h-3 w-40 rounded bg-border-secondary" />
          </div>
        )
      )}
    </div>
  );
}

function EmptyState({
  type,
  onBook,
}) {
  const isUpcoming =
    type ===
    "upcoming";

  return (
    <div className="rounded-corner-lg border border-border-secondary bg-surface-bg p-xl text-center lg:p-2xl">
      <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-corner-full bg-brand-tertiary">
        <Calendar
          size={20}
          className="text-brand-primary"
        />
      </div>

      <h2 className="text-label font-semibold text-text-primary">
        {isUpcoming
          ? "No upcoming appointments"
          : "No previous appointments"}
      </h2>

      <p className="mx-auto mt-xs max-w-md text-label-sm text-text-secondary">
        {isUpcoming
          ? "You do not currently have any upcoming appointments on record."
          : "There are no past appointments available in your record."}
      </p>

      {isUpcoming && (
        <button
          type="button"
          onClick={
            onBook
          }
          className="mt-lg inline-flex items-center gap-xs text-label-sm font-medium text-brand-primary hover:opacity-70"
        >
          <Plus
            size={15}
          />

          Book appointment
        </button>
      )}
    </div>
  );
}

function AppointmentCard({
  appointment,
  past = false,
  onReschedule,
}) {
  const status =
    getStatusDetails(
      appointment.status
    );

  const telehealth =
    isTelehealth(
      appointment.mode
    );

  const reschedulable =
    canReschedule(
      appointment
    );

  return (
    <div
      className={`rounded-corner-lg border border-border-secondary bg-surface-bg p-lg lg:p-xl ${
        past
          ? "opacity-80"
          : ""
      }`}
    >
      <div className="flex flex-col gap-md sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="mb-md flex items-start justify-between gap-md">
            <div className="min-w-0">
              <h3 className="text-label-sm font-semibold text-text-primary">
                {appointment.type ||
                  "Appointment"}
              </h3>

              {appointment.reason && (
                <p className="mt-xs text-video-title text-text-secondary">
                  {
                    appointment.reason
                  }
                </p>
              )}
            </div>

            <Badge
              label={
                status.label
              }
              variant={
                status.variant
              }
            />
          </div>

          <div className="flex flex-col gap-sm">
            <div className="flex items-center gap-xs">
              <Calendar
                size={13}
                className="flex-shrink-0 text-text-tertiary"
              />

              <span className="text-label-sm text-text-secondary">
                {formatDate(
                  appointment
                    .scheduledAt
                )}
              </span>
            </div>

            <div className="flex items-center gap-xs">
              <Clock
                size={13}
                className="flex-shrink-0 text-text-tertiary"
              />

              <span className="text-label-sm text-text-secondary">
                {formatTimeRange(
                  appointment
                    .scheduledAt,
                  appointment
                    .durationMinutes
                )}
              </span>
            </div>

            <div className="flex items-center gap-xs">
              {telehealth ? (
                <Video
                  size={13}
                  className="flex-shrink-0 text-brand-primary"
                />
              ) : (
                <MapPin
                  size={13}
                  className="flex-shrink-0 text-text-tertiary"
                />
              )}

              <span className="text-label-sm text-text-secondary">
                {telehealth
                  ? "Telehealth"
                  : appointment
                      .clinicName ||
                    "Clinic"}
              </span>
            </div>

            <div className="flex items-center gap-xs">
              <Stethoscope
                size={13}
                className="flex-shrink-0 text-text-tertiary"
              />

              <span className="text-label-sm text-text-secondary">
                {getProviderName(
                  appointment
                )}
              </span>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-lg border-t border-border-secondary pt-lg">
              <p className="mb-xs text-video-title text-text-tertiary">
                Notes
              </p>

              <p className="text-label-sm text-text-secondary">
                {
                  appointment.notes
                }
              </p>
            </div>
          )}

          {!past &&
            reschedulable && (
            <div className="mt-lg border-t border-border-secondary pt-lg">
              <button
                type="button"
                onClick={() =>
                  onReschedule(
                    appointment
                  )
                }
                className="inline-flex items-center gap-xs rounded-corner-md border border-border-secondary px-md py-sm text-label-sm font-medium text-text-secondary transition hover:bg-bg-faint hover:text-brand-primary"
              >
                <Pencil
                  size={14}
                />

                Reschedule
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingModal({
  open,
  onClose,
  onBooked,
}) {
  const [
    scheduledAt,
    setScheduledAt,
  ] = useState(
    toLocalDateTimeInput()
  );

  const [
    durationMinutes,
    setDurationMinutes,
  ] = useState("30");

  const [
    type,
    setType,
  ] = useState(
    "General Consultation"
  );

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    mode,
    setMode,
  ] = useState(
    "InPerson"
  );

  const [
    notes,
    setNotes,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setScheduledAt(
      toLocalDateTimeInput()
    );

    setDurationMinutes(
      "30"
    );

    setType(
      "General Consultation"
    );

    setReason("");
    setMode(
      "InPerson"
    );
    setNotes("");
    setSubmitError("");
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const parsedDate =
        new Date(
          scheduledAt
        );

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        setSubmitError(
          "Please choose a valid appointment date and time."
        );

        return;
      }

      if (
        parsedDate.getTime() <=
        Date.now()
      ) {
        setSubmitError(
          "Appointment time must be in the future."
        );

        return;
      }

      if (
        !type.trim()
      ) {
        setSubmitError(
          "Please enter an appointment type."
        );

        return;
      }

      if (
        !reason.trim()
      ) {
        setSubmitError(
          "Please enter the reason for your appointment."
        );

        return;
      }

      const duration =
        Number(
          durationMinutes
        );

      if (
        !Number.isFinite(
          duration
        ) ||
        duration <= 0
      ) {
        setSubmitError(
          "Please choose a valid appointment duration."
        );

        return;
      }

      try {
        setSubmitting(
          true
        );

        setSubmitError(
          ""
        );

        await appointmentsApi
          .book({
            scheduledAt:
              parsedDate
                .toISOString(),

            durationMinutes:
              duration,

            type:
              type.trim(),

            reason:
              reason.trim(),

            mode,

            notes:
              notes.trim() ||
              null,
          });

        await onBooked();

        onClose();
      } catch (err) {
        console.error(
          "Failed to book appointment:",
          err
        );

        setSubmitError(
          err?.message ||
            "We could not book your appointment."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-lg">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-corner-lg bg-surface-bg shadow-xl sm:max-w-xl sm:rounded-corner-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-secondary bg-surface-bg px-lg py-md">
          <div>
            <h2 className="text-label font-semibold text-text-primary">
              Book appointment
            </h2>

            <p className="mt-xs text-video-title text-text-secondary">
              Choose your preferred appointment details.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
            className="flex h-9 w-9 items-center justify-center rounded-corner-full text-text-secondary hover:bg-bg-faint"
            aria-label="Close booking form"
          >
            <X
              size={18}
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="flex flex-col gap-lg p-lg"
        >
          {submitError && (
            <div className="flex items-start gap-sm rounded-corner-md border border-danger/20 bg-danger/10 p-md">
              <AlertCircle
                size={16}
                className="mt-[2px] shrink-0 text-danger"
              />

              <p className="text-label-sm text-text-primary">
                {
                  submitError
                }
              </p>
            </div>
          )}

          <label className="flex flex-col gap-xs">
            <span className="text-label-sm font-medium text-text-primary">
              Date and time
            </span>

            <input
              type="datetime-local"
              value={
                scheduledAt
              }
              onChange={(
                event
              ) =>
                setScheduledAt(
                  event.target
                    .value
                )
              }
              required
              className="w-full rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-label-sm font-medium text-text-primary">
              Appointment type
            </span>

            <input
              type="text"
              value={
                type
              }
              onChange={(
                event
              ) =>
                setType(
                  event.target
                    .value
                )
              }
              required
              className="w-full rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-label-sm font-medium text-text-primary">
              Reason
            </span>

            <textarea
              value={
                reason
              }
              onChange={(
                event
              ) =>
                setReason(
                  event.target
                    .value
                )
              }
              required
              rows={3}
              className="w-full resize-none rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </label>

          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            <label className="flex flex-col gap-xs">
              <span className="text-label-sm font-medium text-text-primary">
                Visit mode
              </span>

              <select
                value={
                  mode
                }
                onChange={(
                  event
                ) =>
                  setMode(
                    event.target
                      .value
                  )
                }
                className="w-full rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none focus:border-brand-primary"
              >
                <option value="InPerson">
                  In person
                </option>

                <option value="Telehealth">
                  Telehealth
                </option>
              </select>
            </label>

            <label className="flex flex-col gap-xs">
              <span className="text-label-sm font-medium text-text-primary">
                Duration
              </span>

              <select
                value={
                  durationMinutes
                }
                onChange={(
                  event
                ) =>
                  setDurationMinutes(
                    event.target
                      .value
                  )
                }
                className="w-full rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none focus:border-brand-primary"
              >
                <option value="15">
                  15 minutes
                </option>

                <option value="30">
                  30 minutes
                </option>

                <option value="45">
                  45 minutes
                </option>

                <option value="60">
                  60 minutes
                </option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-xs">
            <span className="text-label-sm font-medium text-text-primary">
              Notes
              <span className="font-normal text-text-tertiary">
                {" "}
                (optional)
              </span>
            </span>

            <textarea
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
              rows={3}
              className="w-full resize-none rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </label>

          <div className="flex flex-col-reverse gap-sm border-t border-border-secondary pt-lg sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                submitting
              }
              className="rounded-corner-md border border-border-secondary px-lg py-sm text-label-sm font-medium text-text-secondary hover:bg-bg-faint disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="rounded-corner-md bg-brand-primary px-lg py-sm text-label-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting
                ? "Booking..."
                : "Book appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RescheduleModal({
  appointment,
  onClose,
  onRescheduled,
}) {
  const [
    scheduledAt,
    setScheduledAt,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  useEffect(() => {
    if (!appointment) {
      return;
    }

    setScheduledAt(
      toLocalDateTimeInput(
        appointment
          .scheduledAt
      )
    );

    setSubmitError("");
  }, [
    appointment,
  ]);

  if (!appointment) {
    return null;
  }

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const parsedDate =
        new Date(
          scheduledAt
        );

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        setSubmitError(
          "Please choose a valid date and time."
        );

        return;
      }

      if (
        parsedDate.getTime() <=
        Date.now()
      ) {
        setSubmitError(
          "The new appointment time must be in the future."
        );

        return;
      }

      const original =
        parseDate(
          appointment
            .scheduledAt
        );

      if (
        original &&
        original.getTime() ===
          parsedDate.getTime()
      ) {
        setSubmitError(
          "Choose a different appointment date or time."
        );

        return;
      }

      try {
        setSubmitting(
          true
        );

        setSubmitError(
          ""
        );

        await appointmentsApi
          .reschedule(
            appointment.id,
            {
              scheduledAt:
                parsedDate
                  .toISOString(),
            }
          );

        await onRescheduled();

        onClose();
      } catch (err) {
        console.error(
          "Failed to reschedule appointment:",
          err
        );

        setSubmitError(
          err?.message ||
            "We could not reschedule this appointment."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-lg">
      <div className="w-full rounded-t-corner-lg bg-surface-bg shadow-xl sm:max-w-lg sm:rounded-corner-lg">
        <div className="flex items-center justify-between border-b border-border-secondary px-lg py-md">
          <div>
            <h2 className="text-label font-semibold text-text-primary">
              Reschedule appointment
            </h2>

            <p className="mt-xs text-video-title text-text-secondary">
              {appointment.type ||
                "Appointment"}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
            className="flex h-9 w-9 items-center justify-center rounded-corner-full text-text-secondary hover:bg-bg-faint"
            aria-label="Close reschedule form"
          >
            <X
              size={18}
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="flex flex-col gap-lg p-lg"
        >
          <div className="rounded-corner-md bg-bg-faint p-md">
            <p className="text-video-title text-text-tertiary">
              Current appointment
            </p>

            <p className="mt-xs text-label-sm font-medium text-text-primary">
              {formatDate(
                appointment
                  .scheduledAt
              )}
            </p>

            <p className="mt-xs text-label-sm text-text-secondary">
              {formatTimeRange(
                appointment
                  .scheduledAt,
                appointment
                  .durationMinutes
              )}
            </p>
          </div>

          {submitError && (
            <div className="flex items-start gap-sm rounded-corner-md border border-danger/20 bg-danger/10 p-md">
              <AlertCircle
                size={16}
                className="mt-[2px] shrink-0 text-danger"
              />

              <p className="text-label-sm text-text-primary">
                {
                  submitError
                }
              </p>
            </div>
          )}

          <label className="flex flex-col gap-xs">
            <span className="text-label-sm font-medium text-text-primary">
              New date and time
            </span>

            <input
              type="datetime-local"
              value={
                scheduledAt
              }
              onChange={(
                event
              ) =>
                setScheduledAt(
                  event.target
                    .value
                )
              }
              required
              className="w-full rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none focus:border-brand-primary"
            />
          </label>

          <p className="text-video-title text-text-secondary">
            The appointment type,
            reason, duration and
            visit mode will stay
            unchanged.
          </p>

          <div className="flex flex-col-reverse gap-sm border-t border-border-secondary pt-lg sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                submitting
              }
              className="rounded-corner-md border border-border-secondary px-lg py-sm text-label-sm font-medium text-text-secondary hover:bg-bg-faint disabled:opacity-50"
            >
              Keep current time
            </button>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="rounded-corner-md bg-brand-primary px-lg py-sm text-label-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitting
                ? "Rescheduling..."
                : "Confirm reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const [
    appointments,
    setAppointments,
  ] = useState([]);

  const [
    tab,
    setTab,
  ] = useState(
    "upcoming"
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    bookingOpen,
    setBookingOpen,
  ] = useState(false);

  const [
    rescheduleAppointment,
    setRescheduleAppointment,
  ] = useState(null);

  const loadAppointments =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError("");

          const result =
            await appointmentsApi
              .getMine();

          setAppointments(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load appointments:",
            err
          );

          setError(
            err?.message ||
              "We could not load your appointments."
          );

          setAppointments(
            []
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    loadAppointments();
  }, [
    loadAppointments,
  ]);

  const upcoming =
    useMemo(() => {
      return appointments
        .filter(
          (
            appointment
          ) =>
            !isPastAppointment(
              appointment
            )
        )
        .sort(
          (a, b) => {
            const aDate =
              parseDate(
                a.scheduledAt
              )?.getTime() ??
              0;

            const bDate =
              parseDate(
                b.scheduledAt
              )?.getTime() ??
              0;

            return (
              aDate -
              bDate
            );
          }
        );
    }, [
      appointments,
    ]);

  const past =
    useMemo(() => {
      return appointments
        .filter(
          (
            appointment
          ) =>
            isPastAppointment(
              appointment
            )
        )
        .sort(
          (a, b) => {
            const aDate =
              parseDate(
                a.scheduledAt
              )?.getTime() ??
              0;

            const bDate =
              parseDate(
                b.scheduledAt
              )?.getTime() ??
              0;

            return (
              bDate -
              aDate
            );
          }
        );
    }, [
      appointments,
    ]);

  const clinicNames =
    useMemo(() => {
      return [
        ...new Set(
          upcoming
            .map(
              (
                appointment
              ) =>
                appointment
                  .clinicName
            )
            .filter(
              Boolean
            )
        ),
      ];
    }, [
      upcoming,
    ]);

  const handleBooked =
    useCallback(
      async () => {
        await loadAppointments();

        setTab(
          "upcoming"
        );
      },
      [
        loadAppointments,
      ]
    );

  const handleRescheduled =
    useCallback(
      async () => {
        await loadAppointments();

        setTab(
          "upcoming"
        );
      },
      [
        loadAppointments,
      ]
    );

  return (
    <>
      <div className="p-lg md:p-xl lg:p-2xl">
        <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between lg:mb-xl">
          <div>
            <h1 className="text-title text-text-primary">
              Appointments
            </h1>

            <p className="mt-xs text-label-sm text-text-secondary">
              {loading
                ? "Loading your appointments..."
                : `${upcoming.length} upcoming${
                    clinicNames.length ===
                    1
                      ? ` · ${clinicNames[0]}`
                      : ""
                  }`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-sm">
            <Button
              variant="subtle"
              iconStart={
                <RefreshCw
                  size={15}
                />
              }
              onClick={
                loadAppointments
              }
              disabled={
                loading
              }
            >
              Refresh
            </Button>

            <button
              type="button"
              onClick={() =>
                setBookingOpen(
                  true
                )
              }
              className="inline-flex items-center justify-center gap-xs rounded-corner-md bg-brand-primary px-md py-sm text-label-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Plus
                size={16}
              />

              Book appointment
            </button>
          </div>
        </div>

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
                  loadAppointments
                }
                className="mt-xs text-label-sm text-brand-primary transition-opacity hover:opacity-70"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="mb-xl flex gap-md border-b border-border-secondary">
          {[
            {
              key:
                "upcoming",
              label:
                `Upcoming (${upcoming.length})`,
            },
            {
              key:
                "past",
              label:
                `Past (${past.length})`,
            },
          ].map(
            (item) => (
              <button
                key={
                  item.key
                }
                type="button"
                onClick={() =>
                  setTab(
                    item.key
                  )
                }
                className={`-mb-px border-b-2 pb-md text-label-sm font-medium transition-colors ${
                  tab ===
                  item.key
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {
                  item.label
                }
              </button>
            )
          )}
        </div>

        {loading ? (
          <LoadingState />
        ) : tab ===
          "upcoming" ? (
          upcoming.length ===
          0 ? (
            <EmptyState
              type="upcoming"
              onBook={() =>
                setBookingOpen(
                  true
                )
              }
            />
          ) : (
            <div className="flex flex-col gap-md">
              {upcoming.map(
                (
                  appointment
                ) => (
                  <AppointmentCard
                    key={
                      appointment.id
                    }
                    appointment={
                      appointment
                    }
                    onReschedule={
                      setRescheduleAppointment
                    }
                  />
                )
              )}
            </div>
          )
        ) : past.length ===
          0 ? (
          <EmptyState
            type="past"
          />
        ) : (
          <div className="flex flex-col gap-md">
            {past.map(
              (
                appointment
              ) => (
                <AppointmentCard
                  key={
                    appointment.id
                  }
                  appointment={
                    appointment
                  }
                  past
                  onReschedule={
                    setRescheduleAppointment
                  }
                />
              )
            )}
          </div>
        )}

        <div className="h-20 lg:hidden" />
      </div>

      <BookingModal
        open={
          bookingOpen
        }
        onClose={() =>
          setBookingOpen(
            false
          )
        }
        onBooked={
          handleBooked
        }
      />

      <RescheduleModal
        appointment={
          rescheduleAppointment
        }
        onClose={() =>
          setRescheduleAppointment(
            null
          )
        }
        onRescheduled={
          handleRescheduled
        }
      />
    </>
  );
}