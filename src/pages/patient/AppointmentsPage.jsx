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
  Trash2,
  Video,
  X,
} from "lucide-react";

import {
  appointmentsApi,
} from "../../services/api/appointments.js";

const APPOINTMENT_TYPES = [
  "Routine Checkup",
  "General Consultation",
  "Medication Review",
  "Chronic Care Follow-up",
  "Follow-up Visit",
  "Symptoms / Feeling Unwell",
  "Other",
];

const PROVIDER_TYPES = [
  "Nurse",
  "Doctor",
];

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
      weekday:
        "long",
      day:
        "numeric",
      month:
        "long",
      year:
        "numeric",
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

  const options = {
    hour:
      "2-digit",
    minute:
      "2-digit",
  };

  const startText =
    start.toLocaleTimeString(
      "en-ZA",
      options
    );

  if (!duration) {
    return startText;
  }

  const end =
    new Date(
      start.getTime() +
        duration *
          60 *
          1000
    );

  return `${startText} – ${end.toLocaleTimeString(
    "en-ZA",
    options
  )}`;
}

function toLocalDateTimeInput(
  value = null
) {
  let date =
    value
      ? new Date(value)
      : new Date();

  if (!value) {
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

  return new Date(
    date.getTime() -
      offset *
        60 *
        1000
  )
    .toISOString()
    .slice(
      0,
      16
    );
}

function normaliseStatus(value) {
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
    [
      "completed",
      "cancelled",
      "canceled",
      "missed",
      "noshow",
      "no-show",
    ].includes(
      status
    )
  ) {
    return true;
  }

  const date =
    parseDate(
      appointment
        ?.scheduledAt
    );

  return Boolean(
    date &&
      date.getTime() <
        Date.now()
  );
}

function canChange(
  appointment
) {
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
  ].includes(
    status
  ) &&
    !isPastAppointment(
      appointment
    );
}

function requestedProviderFromNotes(
  notes
) {
  if (!notes) {
    return "";
  }

  const match =
    String(notes).match(
      /^Requested provider:\s*(.+)$/im
    );

  return match?.[1]?.trim() ||
    "";
}

function displayNotes(notes) {
  if (!notes) {
    return "";
  }

  return String(notes)
    .replace(
      /^Requested provider:\s*.+(?:\r?\n){0,2}/i,
      ""
    )
    .trim();
}

function getProviderName(
  appointment
) {
  return (
    appointment
      ?.providerName ||
    appointment
      ?.nurseName ||
    requestedProviderFromNotes(
      appointment?.notes
    ) ||
    "Clinic provider"
  );
}

function StatusBadge({
  value,
}) {
  const status =
    normaliseStatus(
      value
    );

  let classes =
    "bg-slate-100 text-slate-600";

  if (
    status ===
      "confirmed" ||
    status ===
      "completed"
  ) {
    classes =
      "bg-emerald-50 text-emerald-700";
  } else if (
    status ===
      "pending"
  ) {
    classes =
      "bg-amber-50 text-amber-700";
  } else if (
    status ===
      "cancelled" ||
    status ===
      "canceled"
  ) {
    classes =
      "bg-red-50 text-red-700";
  } else if (
    status ===
      "rescheduled"
  ) {
    classes =
      "bg-teal-50 text-teal-700";
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {value ||
        "Scheduled"}
    </span>
  );
}

function AppointmentCard({
  appointment,
  past = false,
  onReschedule,
  onCancel,
}) {
  const telehealth =
    String(
      appointment.mode ??
        ""
    )
      .trim()
      .toLowerCase() ===
    "telehealth";

  const notes =
    displayNotes(
      appointment.notes
    );

  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${
        past
          ? "opacity-80"
          : ""
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-950">
                {appointment.type ||
                  "Appointment"}
              </h3>

              {appointment.reason && (
                <p className="mt-1 text-sm text-slate-500">
                  {
                    appointment.reason
                  }
                </p>
              )}
            </div>

            <StatusBadge
              value={
                appointment.status
              }
            />
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar
                size={15}
                className="text-[#0f766e]"
              />
              <span>
                {formatDate(
                  appointment.scheduledAt
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock
                size={15}
                className="text-[#0f766e]"
              />
              <span>
                {formatTimeRange(
                  appointment.scheduledAt,
                  appointment.durationMinutes
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {telehealth ? (
                <Video
                  size={15}
                  className="text-[#0f766e]"
                />
              ) : (
                <MapPin
                  size={15}
                  className="text-[#0f766e]"
                />
              )}

              <span>
                {telehealth
                  ? "Telehealth"
                  : appointment
                      .clinicName ||
                    "Clinic"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Stethoscope
                size={15}
                className="text-[#0f766e]"
              />
              <span>
                {getProviderName(
                  appointment
                )}
              </span>
            </div>
          </div>

          {notes && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Notes
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {notes}
              </p>
            </div>
          )}

          {!past &&
            canChange(
              appointment
            ) && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    onReschedule(
                      appointment
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-teal-200 hover:bg-teal-50"
                >
                  <Pencil
                    size={14}
                  />
                  Reschedule
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onCancel(
                      appointment
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  <Trash2
                    size={14}
                  />
                  Cancel
                </button>
              </div>
            )}
        </div>
      </div>
    </article>
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
    "Routine Checkup"
  );

  const [
    providerType,
    setProviderType,
  ] = useState(
    "Nurse"
  );

  const [
    reason,
    setReason,
  ] = useState(
    "Routine patient checkup"
  );

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
      "Routine Checkup"
    );
    setProviderType(
      "Nurse"
    );
    setReason(
      "Routine patient checkup"
    );
    setMode(
      "InPerson"
    );
    setNotes("");
    setSubmitError("");
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    const parsedDate =
      new Date(
        scheduledAt
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      ) ||
      parsedDate.getTime() <=
        Date.now()
    ) {
      setSubmitError(
        "Please choose a future appointment date and time."
      );
      return;
    }

    if (!reason.trim()) {
      setSubmitError(
        "Please enter the reason for your appointment."
      );
      return;
    }

    const duration =
      Number(
        durationMinutes
      );

    const persistedNotes =
      [
        `Requested provider: ${providerType}`,
        notes.trim(),
      ]
        .filter(Boolean)
        .join(
          "\n\n"
        );

    try {
      setSubmitting(
        true
      );
      setSubmitError("");

      await appointmentsApi
        .book({
          scheduledAt:
            parsedDate
              .toISOString(),
          durationMinutes:
            duration,
          type,
          reason:
            reason.trim(),
          providerName:
            providerType,
          mode,
          notes:
            persistedNotes,
        });

      await onBooked();
      onClose();
    } catch (error) {
      setSubmitError(
        error?.message ||
          "We could not book your appointment."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-950">
              Book appointment
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Choose the service and whether you want to see a Nurse or Doctor.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
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
          className="space-y-4 p-5"
        >
          {submitError && (
            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle
                size={17}
              />
              {submitError}
            </div>
          )}

          <SelectField
            label="Appointment type"
            value={type}
            onChange={setType}
            options={
              APPOINTMENT_TYPES
            }
          />

          <SelectField
            label="Who do you want to see?"
            value={
              providerType
            }
            onChange={
              setProviderType
            }
            options={
              PROVIDER_TYPES
            }
          />

          <Field
            label="Date and time"
            type="datetime-local"
            value={
              scheduledAt
            }
            onChange={
              setScheduledAt
            }
            required
          />

          <TextArea
            label="Reason"
            value={reason}
            onChange={
              setReason
            }
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Visit mode"
              value={mode}
              onChange={setMode}
              options={[
                {
                  value:
                    "InPerson",
                  label:
                    "In person",
                },
                {
                  value:
                    "Telehealth",
                  label:
                    "Telehealth",
                },
              ]}
            />

            <SelectField
              label="Duration"
              value={
                durationMinutes
              }
              onChange={
                setDurationMinutes
              }
              options={[
                {
                  value:
                    "15",
                  label:
                    "15 minutes",
                },
                {
                  value:
                    "30",
                  label:
                    "30 minutes",
                },
                {
                  value:
                    "45",
                  label:
                    "45 minutes",
                },
                {
                  value:
                    "60",
                  label:
                    "60 minutes",
                },
              ]}
            />
          </div>

          <TextArea
            label="Notes (optional)"
            value={notes}
            onChange={setNotes}
          />

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={
                submitting
              }
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="rounded-xl bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
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
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (appointment) {
      setScheduledAt(
        toLocalDateTimeInput(
          appointment.scheduledAt
        )
      );
      setError("");
    }
  }, [appointment]);

  if (!appointment) {
    return null;
  }

  async function submit(
    event
  ) {
    event.preventDefault();

    const date =
      new Date(
        scheduledAt
      );

    if (
      Number.isNaN(
        date.getTime()
      ) ||
      date.getTime() <=
        Date.now()
    ) {
      setError(
        "Choose a future appointment date and time."
      );
      return;
    }

    try {
      setSubmitting(
        true
      );
      setError("");

      await appointmentsApi
        .reschedule(
          appointment.id,
          {
            scheduledAt:
              date.toISOString(),
          }
        );

      await onRescheduled();
      onClose();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "We could not reschedule this appointment."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <SimpleModal
      title="Reschedule appointment"
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-4"
      >
        {error && (
          <ErrorBox>
            {error}
          </ErrorBox>
        )}

        <Field
          label="New date and time"
          type="datetime-local"
          value={
            scheduledAt
          }
          onChange={
            setScheduledAt
          }
          required
        />

        <ModalActions
          saving={
            submitting
          }
          onCancel={onClose}
          submitLabel="Confirm reschedule"
        />
      </form>
    </SimpleModal>
  );
}

function CancelModal({
  appointment,
  onClose,
  onCancelled,
}) {
  const [
    submitting,
    setSubmitting,
  ] = useState(false);
  const [
    error,
    setError,
  ] = useState("");

  if (!appointment) {
    return null;
  }

  async function cancel() {
    try {
      setSubmitting(
        true
      );
      setError("");

      await appointmentsApi
        .cancel(
          appointment.id
        );

      await onCancelled();
      onClose();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "We could not cancel this appointment."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <SimpleModal
      title="Cancel appointment"
      onClose={onClose}
    >
      <div className="space-y-4">
        {error && (
          <ErrorBox>
            {error}
          </ErrorBox>
        )}

        <p className="text-sm text-slate-600">
          Are you sure you want to cancel your {appointment.type ||
            "appointment"} on {formatDate(
            appointment.scheduledAt
          )}?
        </p>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={
              submitting
            }
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Keep appointment
          </button>

          <button
            type="button"
            onClick={cancel}
            disabled={
              submitting
            }
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting
              ? "Cancelling..."
              : "Cancel appointment"}
          </button>
        </div>
      </div>
    </SimpleModal>
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
  const [
    cancelAppointment,
    setCancelAppointment,
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
        } catch (loadError) {
          setError(
            loadError?.message ||
              "We could not load your appointments."
          );
          setAppointments([]);
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const upcoming =
    useMemo(
      () =>
        appointments
          .filter(
            item =>
              !isPastAppointment(
                item
              )
          )
          .sort(
            (a, b) =>
              (parseDate(
                a.scheduledAt
              )?.getTime() ||
                0) -
              (parseDate(
                b.scheduledAt
              )?.getTime() ||
                0)
          ),
      [appointments]
    );

  const past =
    useMemo(
      () =>
        appointments
          .filter(
            item =>
              isPastAppointment(
                item
              )
          )
          .sort(
            (a, b) =>
              (parseDate(
                b.scheduledAt
              )?.getTime() ||
                0) -
              (parseDate(
                a.scheduledAt
              )?.getTime() ||
                0)
          ),
      [appointments]
    );

  const visible =
    tab ===
      "upcoming"
      ? upcoming
      : past;

  async function refreshed() {
    await loadAppointments();
    setTab(
      "upcoming"
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Appointments
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Book a clinic visit and choose whether you want to see a Nurse or Doctor.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={
                loadAppointments
              }
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw
                size={15}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                setBookingOpen(
                  true
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#115e59]"
            >
              <Plus
                size={16}
              />
              Book appointment
            </button>
          </div>
        </div>

        {error && (
          <ErrorBox>
            {error}
          </ErrorBox>
        )}

        <div className="mb-5 flex gap-6 border-b border-slate-200">
          <TabButton
            active={
              tab ===
              "upcoming"
            }
            onClick={() =>
              setTab(
                "upcoming"
              )
            }
          >
            Upcoming ({upcoming.length})
          </TabButton>

          <TabButton
            active={
              tab ===
              "past"
            }
            onClick={() =>
              setTab(
                "past"
              )
            }
          >
            Past ({past.length})
          </TabButton>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(
              item => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              )
            )}
          </div>
        ) : visible.length ? (
          <div className="space-y-4">
            {visible.map(
              appointment => (
                <AppointmentCard
                  key={
                    appointment.id
                  }
                  appointment={
                    appointment
                  }
                  past={
                    tab ===
                    "past"
                  }
                  onReschedule={
                    setRescheduleAppointment
                  }
                  onCancel={
                    setCancelAppointment
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Calendar
              size={28}
              className="mx-auto text-[#0f766e]"
            />
            <h2 className="mt-3 font-semibold text-slate-900">
              {tab ===
              "upcoming"
                ? "No upcoming appointments"
                : "No previous appointments"}
            </h2>
            {tab ===
              "upcoming" && (
              <button
                type="button"
                onClick={() =>
                  setBookingOpen(
                    true
                  )
                }
                className="mt-4 text-sm font-semibold text-[#0f766e]"
              >
                Book an appointment
              </button>
            )}
          </div>
        )}
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() =>
          setBookingOpen(
            false
          )
        }
        onBooked={refreshed}
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
          refreshed
        }
      />

      <CancelModal
        appointment={
          cancelAppointment
        }
        onClose={() =>
          setCancelAppointment(
            null
          )
        }
        onCancelled={
          refreshed
        }
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${
        active
          ? "border-[#0f766e] text-[#0f766e]"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function SimpleModal({
  title,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="w-full rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X
              size={18}
            />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function ErrorBox({
  children,
}) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <AlertCircle
        size={17}
        className="mt-0.5 shrink-0"
      />
      <span>
        {children}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={event =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <textarea
        rows={3}
        value={value}
        required={required}
        onChange={event =>
          onChange(
            event.target.value
          )
        }
        className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <select
        value={value}
        onChange={event =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
      >
        {options.map(
          option => {
            const item =
              typeof option ===
              "string"
                ? {
                    value:
                      option,
                    label:
                      option,
                  }
                : option;

            return (
              <option
                key={
                  item.value
                }
                value={
                  item.value
                }
              >
                {item.label}
              </option>
            );
          }
        )}
      </select>
    </label>
  );
}

function ModalActions({
  saving,
  onCancel,
  submitLabel,
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : submitLabel}
      </button>
    </div>
  );
}
