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

import {
  getLanguageLocale,
} from "../../i18n/languages.js";

const APPOINTMENT_TYPES = [
  {
    value:
      "Routine Checkup",
    labelKey:
      "appointments.routineCheckup",
  },
  {
    value:
      "General Consultation",
    labelKey:
      "appointments.generalConsultation",
  },
  {
    value:
      "Medication Review",
    labelKey:
      "appointments.medicationReview",
  },
  {
    value:
      "Chronic Care Follow-up",
    labelKey:
      "appointments.chronicFollowup",
  },
  {
    value:
      "Follow-up Visit",
    labelKey:
      "appointments.followupVisit",
  },
  {
    value:
      "Symptoms / Feeling Unwell",
    labelKey:
      "appointments.symptoms",
  },
  {
    value:
      "Other",
    labelKey:
      "appointments.other",
  },
];

const PROVIDER_TYPES = [
  {
    value: "Nurse",
    labelKey:
      "appointments.nurse",
  },
  {
    value: "Doctor",
    labelKey:
      "appointments.doctor",
  },
];

function parseDate(
  value
) {
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

function formatDate(
  value,
  locale,
  t
) {
  const date =
    parseDate(
      value
    );

  if (!date) {
    return t(
      "appointments.dateUnavailable"
    );
  }

  try {
    return date
      .toLocaleDateString(
        locale,
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
  } catch {
    return date
      .toLocaleDateString(
        "en-ZA",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
  }
}

function formatTimeRange(
  scheduledAt,
  durationMinutes,
  locale
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
    ) >
    0
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

  let startText;

  try {
    startText =
      start
        .toLocaleTimeString(
          locale,
          options
        );
  } catch {
    startText =
      start
        .toLocaleTimeString(
          "en-ZA",
          options
        );
  }

  if (
    !duration
  ) {
    return startText;
  }

  const end =
    new Date(
      start.getTime() +
        duration *
          60 *
          1000
    );

  let endText;

  try {
    endText =
      end
        .toLocaleTimeString(
          locale,
          options
        );
  } catch {
    endText =
      end
        .toLocaleTimeString(
          "en-ZA",
          options
        );
  }

  return `${startText} – ${endText}`;
}

function toLocalDateTimeInput(
  value = null
) {
  const date =
    value
      ? new Date(
          value
        )
      : new Date();

  if (
    !value
  ) {
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
    date
      .getTimezoneOffset();

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

  return (
    ![
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
    )
  );
}

function requestedProviderFromNotes(
  notes
) {
  if (!notes) {
    return "";
  }

  const match =
    String(
      notes
    ).match(
      /^Requested provider:\s*(.+)$/im
    );

  return (
    match?.[1]
      ?.trim() ||
    ""
  );
}

function displayNotes(
  notes
) {
  if (!notes) {
    return "";
  }

  return String(
    notes
  )
    .replace(
      /^Requested provider:\s*.+(?:\r?\n){0,2}/i,
      ""
    )
    .trim();
}

function statusLabel(
  value,
  t
) {
  switch (
    normaliseStatus(
      value
    )
  ) {
    case "confirmed":
      return t(
        "appointments.confirmed"
      );

    case "pending":
      return t(
        "appointments.pending"
      );

    case "completed":
      return t(
        "appointments.completed"
      );

    case "cancelled":
    case "canceled":
      return t(
        "appointments.cancelled"
      );

    case "rescheduled":
      return t(
        "appointments.rescheduled"
      );

    case "missed":
    case "noshow":
    case "no-show":
      return t(
        "appointments.missed"
      );

    default:
      return (
        value ||
        t(
          "appointments.scheduled"
        )
      );
  }
}

function StatusBadge({
  value,
}) {
  const {
    t,
  } =
    useTranslation();

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
      {statusLabel(
        value,
        t
      )}
    </span>
  );
}

function AppointmentCard({
  appointment,
  locale,
  past = false,
  onReschedule,
  onCancel,
}) {
  const {
    t,
  } =
    useTranslation();

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

  const providerName =
    appointment
      ?.providerName ||
    appointment
      ?.nurseName ||
    requestedProviderFromNotes(
      appointment?.notes
    ) ||
    t(
      "appointments.clinicProvider"
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
                  t(
                    "appointments.appointment"
                  )}
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
                  appointment.scheduledAt,
                  locale,
                  t
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
                  appointment.durationMinutes,
                  locale
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
                  ? t(
                      "appointments.telehealth"
                    )
                  : appointment.clinicName ||
                    t(
                      "dashboard.myClinic"
                    )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Stethoscope
                size={15}
                className="text-[#0f766e]"
              />

              <span>
                {
                  providerName
                }
              </span>
            </div>
          </div>

          {notes && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t(
                  "appointments.notes"
                )}
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

                  {t(
                    "appointments.reschedule"
                  )}
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

                  {t(
                    "appointments.cancel"
                  )}
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
  const {
    t,
  } =
    useTranslation();

  const [
    scheduledAt,
    setScheduledAt,
  ] =
    useState(
      toLocalDateTimeInput()
    );

  const [
    durationMinutes,
    setDurationMinutes,
  ] =
    useState("30");

  const [
    type,
    setType,
  ] =
    useState(
      "Routine Checkup"
    );

  const [
    providerType,
    setProviderType,
  ] =
    useState(
      "Nurse"
    );

  const [
    reason,
    setReason,
  ] =
    useState("");

  const [
    mode,
    setMode,
  ] =
    useState(
      "InPerson"
    );

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    submitError,
    setSubmitError,
  ] =
    useState("");

  useEffect(
    () => {
      if (
        !open
      ) {
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
        t(
          "appointments.defaultReason"
        )
      );

      setMode(
        "InPerson"
      );

      setNotes(
        ""
      );

      setSubmitError(
        ""
      );
    },
    [
      open,
      t,
    ]
  );

  if (
    !open
  ) {
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
        t(
          "appointments.futureDateRequired"
        )
      );

      return;
    }

    if (
      !reason.trim()
    ) {
      setSubmitError(
        t(
          "appointments.reasonRequired"
        )
      );

      return;
    }

    const persistedNotes =
      [
        `Requested provider: ${providerType}`,
        notes.trim(),
      ]
        .filter(
          Boolean
        )
        .join(
          "\n\n"
        );

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
            Number(
              durationMinutes
            ),

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
    } catch (
      error
    ) {
      setSubmitError(
        error?.message ||
          t(
            "appointments.bookingError"
          )
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
              {t(
                "appointments.bookingTitle"
              )}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {t(
                "appointments.bookingDescription"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label={t(
              "appointments.close"
            )}
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
            <ErrorBox>
              {
                submitError
              }
            </ErrorBox>
          )}

          <SelectField
            label={t(
              "appointments.appointmentType"
            )}
            value={
              type
            }
            onChange={
              setType
            }
            options={APPOINTMENT_TYPES.map(
              item => ({
                value:
                  item.value,
                label:
                  t(
                    item.labelKey
                  ),
              })
            )}
          />

          <SelectField
            label={t(
              "appointments.providerQuestion"
            )}
            value={
              providerType
            }
            onChange={
              setProviderType
            }
            options={PROVIDER_TYPES.map(
              item => ({
                value:
                  item.value,
                label:
                  t(
                    item.labelKey
                  ),
              })
            )}
          />

          <Field
            label={t(
              "appointments.dateAndTime"
            )}
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
            label={t(
              "appointments.reason"
            )}
            value={
              reason
            }
            onChange={
              setReason
            }
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label={t(
                "appointments.visitMode"
              )}
              value={
                mode
              }
              onChange={
                setMode
              }
              options={[
                {
                  value:
                    "InPerson",
                  label:
                    t(
                      "appointments.inPerson"
                    ),
                },
                {
                  value:
                    "Telehealth",
                  label:
                    t(
                      "appointments.telehealth"
                    ),
                },
              ]}
            />

            <SelectField
              label={t(
                "appointments.duration"
              )}
              value={
                durationMinutes
              }
              onChange={
                setDurationMinutes
              }
              options={[
                15,
                30,
                45,
                60,
              ].map(
                value => ({
                  value:
                    String(
                      value
                    ),

                  label:
                    t(
                      "appointments.minutes",
                      {
                        count:
                          value,
                      }
                    ),
                })
              )}
            />
          </div>

          <TextArea
            label={t(
              "appointments.optionalNotes"
            )}
            value={
              notes
            }
            onChange={
              setNotes
            }
          />

          <ModalActions
            saving={
              submitting
            }
            onCancel={
              onClose
            }
            submitLabel={t(
              "appointments.bookAppointment"
            )}
            savingLabel={t(
              "appointments.booking"
            )}
          />
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
  const {
    t,
  } =
    useTranslation();

  const [
    scheduledAt,
    setScheduledAt,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(
    () => {
      if (
        appointment
      ) {
        setScheduledAt(
          toLocalDateTimeInput(
            appointment.scheduledAt
          )
        );

        setError(
          ""
        );
      }
    },
    [
      appointment,
    ]
  );

  if (
    !appointment
  ) {
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
        t(
          "appointments.futureRescheduleRequired"
        )
      );

      return;
    }

    try {
      setSubmitting(
        true
      );

      setError(
        ""
      );

      await appointmentsApi
        .reschedule(
          appointment.id,
          {
            scheduledAt:
              date
                .toISOString(),
          }
        );

      await onRescheduled();

      onClose();
    } catch (
      saveError
    ) {
      setError(
        saveError?.message ||
          t(
            "appointments.rescheduleError"
          )
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <SimpleModal
      title={t(
        "appointments.rescheduleTitle"
      )}
      onClose={
        onClose
      }
    >
      <form
        onSubmit={
          submit
        }
        className="space-y-4"
      >
        {error && (
          <ErrorBox>
            {error}
          </ErrorBox>
        )}

        <Field
          label={t(
            "appointments.newDateTime"
          )}
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
          onCancel={
            onClose
          }
          submitLabel={t(
            "appointments.confirmReschedule"
          )}
          savingLabel={t(
            "appointments.saving"
          )}
        />
      </form>
    </SimpleModal>
  );
}

function CancelModal({
  appointment,
  locale,
  onClose,
  onCancelled,
}) {
  const {
    t,
  } =
    useTranslation();

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  if (
    !appointment
  ) {
    return null;
  }

  async function cancel() {
    try {
      setSubmitting(
        true
      );

      setError(
        ""
      );

      await appointmentsApi
        .cancel(
          appointment.id
        );

      await onCancelled();

      onClose();
    } catch (
      saveError
    ) {
      setError(
        saveError?.message ||
          t(
            "appointments.cancellationError"
          )
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <SimpleModal
      title={t(
        "appointments.cancelTitle"
      )}
      onClose={
        onClose
      }
    >
      <div className="space-y-4">
        {error && (
          <ErrorBox>
            {error}
          </ErrorBox>
        )}

        <p className="text-sm text-slate-600">
          {t(
            "appointments.cancelQuestion",
            {
              type:
                appointment.type ||
                t(
                  "appointments.appointment"
                ),

              date:
                formatDate(
                  appointment.scheduledAt,
                  locale,
                  t
                ),
            }
          )}
        </p>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            {t(
              "appointments.keepAppointment"
            )}
          </button>

          <button
            type="button"
            onClick={
              cancel
            }
            disabled={
              submitting
            }
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting
              ? t(
                  "appointments.cancelling"
                )
              : t(
                  "appointments.cancelAppointment"
                )}
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}

export default function AppointmentsPage() {
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
    appointments,
    setAppointments,
  ] =
    useState([]);

  const [
    tab,
    setTab,
  ] =
    useState(
      "upcoming"
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
    bookingOpen,
    setBookingOpen,
  ] =
    useState(false);

  const [
    rescheduleAppointment,
    setRescheduleAppointment,
  ] =
    useState(null);

  const [
    cancelAppointment,
    setCancelAppointment,
  ] =
    useState(null);

  const loadAppointments =
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
            await appointmentsApi
              .getMine();

          setAppointments(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (
          loadError
        ) {
          setError(
            loadError?.message ||
              i18n.t(
                "appointments.loadError"
              )
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
      [
        i18n,
      ]
    );

  useEffect(
    () => {
      void loadAppointments();
    },
    [
      loadAppointments,
    ]
  );

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
            (
              a,
              b
            ) =>
              (
                parseDate(
                  a.scheduledAt
                )
                  ?.getTime() ||
                0
              ) -
              (
                parseDate(
                  b.scheduledAt
                )
                  ?.getTime() ||
                0
              )
          ),
      [
        appointments,
      ]
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
            (
              a,
              b
            ) =>
              (
                parseDate(
                  b.scheduledAt
                )
                  ?.getTime() ||
                0
              ) -
              (
                parseDate(
                  a.scheduledAt
                )
                  ?.getTime() ||
                0
              )
          ),
      [
        appointments,
      ]
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
              {t(
                "appointments.title"
              )}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {t(
                "appointments.subtitle"
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={
                loadAppointments
              }
              disabled={
                loading
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw
                size={15}
              />

              {t(
                "appointments.refresh"
              )}
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

              {t(
                "appointments.bookAppointment"
              )}
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
            {t(
              "appointments.upcomingCount",
              {
                count:
                  upcoming.length,
              }
            )}
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
            {t(
              "appointments.pastCount",
              {
                count:
                  past.length,
              }
            )}
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
                  locale={
                    locale
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
                ? t(
                    "appointments.noUpcoming"
                  )
                : t(
                    "appointments.noPrevious"
                  )}
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
                {t(
                  "appointments.bookAnAppointment"
                )}
              </button>
            )}
          </div>
        )}
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
          refreshed
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
          refreshed
        }
      />

      <CancelModal
        appointment={
          cancelAppointment
        }
        locale={
          locale
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
      onClick={
        onClick
      }
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
  const {
    t,
  } =
    useTranslation();

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="w-full rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            {title}
          </h2>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label={t(
              "appointments.close"
            )}
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
        type={
          type
        }
        value={
          value
        }
        required={
          required
        }
        onChange={
          event =>
            onChange(
              event.target
                .value
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
        value={
          value
        }
        required={
          required
        }
        onChange={
          event =>
            onChange(
              event.target
                .value
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
        value={
          value
        }
        onChange={
          event =>
            onChange(
              event.target
                .value
            )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
      >
        {options.map(
          option => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          )
        )}
      </select>
    </label>
  );
}

function ModalActions({
  saving,
  onCancel,
  submitLabel,
  savingLabel,
}) {
  const {
    t,
  } =
    useTranslation();

  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={
          onCancel
        }
        disabled={
          saving
        }
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
      >
        {t(
          "appointments.cancel"
        )}
      </button>

      <button
        type="submit"
        disabled={
          saving
        }
        className="rounded-xl bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving
          ? savingLabel
          : submitLabel}
      </button>
    </div>
  );
}
