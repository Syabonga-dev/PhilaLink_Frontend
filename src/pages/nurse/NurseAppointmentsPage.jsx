import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarCheck2,
  CalendarClock,
  Check,
  Clock3,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  nursesApi,
} from "../../services/api/nurses.js";

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
}

function toLocalInput(
  value
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  const offset =
    date.getTimezoneOffset();

  return new Date(
    date.getTime() -
      offset *
        60000
  )
    .toISOString()
    .slice(
      0,
      16
    );
}

export default function NurseAppointmentsPage() {
  const [
    appointments,
    setAppointments,
  ] =
    useState([]);

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
      "Pending"
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
    rescheduleValue,
    setRescheduleValue,
  ] =
    useState("");

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

          const result =
            await nursesApi
              .getAppointments();

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
              "Could not load appointments."
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

        return appointments.filter(
          (
            appointment
          ) => {
            const matchesStatus =
              status ===
                "All" ||
              String(
                appointment.status
              ).toLowerCase() ===
                status.toLowerCase();

            const matchesSearch =
              !term ||
              [
                appointment.patientName,
                appointment.type,
                appointment.reason,
                appointment.providerName,
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
        appointments,
        search,
        status,
      ]
    );

  function updatePayload(
    appointment,
    nextStatus,
    scheduledAt =
      appointment.scheduledAt
  ) {
    return {
      scheduledAt,

      nurseId:
        appointment.nurseId ??
        null,

      durationMinutes:
        appointment.durationMinutes ||
        30,

      type:
        appointment.type ||
        "Clinic visit",

      reason:
        appointment.reason ||
        "",

      providerName:
        appointment.providerName ??
        null,

      mode:
        appointment.mode ||
        "InPerson",

      status:
        nextStatus,

      notes:
        appointment.notes ??
        null,
    };
  }

  async function changeStatus(
    appointment,
    nextStatus
  ) {
    try {
      setError(
        ""
      );

      setMessage(
        ""
      );

      await nursesApi
        .updateAppointment(
          appointment.id,
          updatePayload(
            appointment,
            nextStatus
          )
        );

      setMessage(
        `Appointment changed to ${nextStatus}.`
      );

      await load();
    } catch (actionError) {
      setError(
        actionError?.message ||
          "Could not update appointment."
      );
    }
  }

  async function reschedule(
    event
  ) {
    event.preventDefault();

    if (
      !selected ||
      !rescheduleValue
    ) {
      return;
    }

    try {
      await nursesApi
        .updateAppointment(
          selected.id,
          updatePayload(
            selected,
            "Rescheduled",
            new Date(
              rescheduleValue
            )
              .toISOString()
          )
        );

      setSelected(
        null
      );

      setMessage(
        "Appointment rescheduled."
      );

      await load();
    } catch (actionError) {
      setError(
        actionError?.message ||
          "Could not reschedule appointment."
      );
    }
  }

  const pendingCount =
    appointments.filter(
      (
        appointment
      ) =>
        String(
          appointment.status
        ).toLowerCase() ===
        "pending"
    ).length;

  const todayCount =
    appointments.filter(
      (
        appointment
      ) => {
        const date =
          new Date(
            appointment.scheduledAt
          );

        const now =
          new Date();

        return (
          date.getFullYear() ===
            now.getFullYear() &&
          date.getMonth() ===
            now.getMonth() &&
          date.getDate() ===
            now.getDate()
        );
      }
    ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1500px]">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Appointments
            </h2>

            <p className="mt-1 text-sm text-[#64748b]">
              Review, approve, reschedule and complete clinic appointments.
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

        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          <Summary
            icon={
              CalendarClock
            }
            label="Pending approval"
            value={
              pendingCount
            }
          />

          <Summary
            icon={
              CalendarCheck2
            }
            label="Appointments today"
            value={
              todayCount
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
                    event.target
                      .value
                  )
                }
                placeholder="Search patient or appointment..."
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
              className="h-11 rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none"
            >
              <option>
                Pending
              </option>

              <option>
                Scheduled
              </option>

              <option>
                Confirmed
              </option>

              <option>
                Rescheduled
              </option>

              <option>
                Completed
              </option>

              <option>
                Cancelled
              </option>

              <option>
                Missed
              </option>

              <option>
                All
              </option>
            </select>

          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#64748b]">
              Loading appointments...
            </div>
          ) : filtered.length ===
            0 ? (
            <div className="p-12 text-center text-sm text-[#64748b]">
              No appointments found.
            </div>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">

              {filtered.map(
                (
                  appointment
                ) => (
                  <div
                    key={
                      appointment.id
                    }
                    className="p-5"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold">
                            {appointment.patientName}
                          </h3>

                          <Status
                            value={
                              appointment.status
                            }
                          />

                        </div>

                        <p className="mt-2 text-sm text-[#475569]">
                          {appointment.type ||
                            "Appointment"}
                          {" · "}
                          {appointment.reason ||
                            "No reason specified"}
                        </p>

                        <p className="mt-2 flex items-center gap-2 text-sm text-[#64748b]">

                          <Clock3
                            size={14}
                          />

                          {formatDateTime(
                            appointment.scheduledAt
                          )}

                        </p>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        {String(
                          appointment.status
                        ).toLowerCase() ===
                          "pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(
                                appointment,
                                "Confirmed"
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f766e] px-3 py-2 text-xs font-semibold text-white"
                          >
                            <Check
                              size={14}
                            />

                            Confirm
                          </button>
                        )}

                        {![
                          "completed",
                          "cancelled",
                        ].includes(
                          String(
                            appointment.status
                          ).toLowerCase()
                        ) && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setSelected(
                                  appointment
                                );

                                setRescheduleValue(
                                  toLocalInput(
                                    appointment.scheduledAt
                                  )
                                );
                              }}
                              className="rounded-xl border border-[#cbd5e1] px-3 py-2 text-xs font-semibold text-[#475569]"
                            >
                              Reschedule
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(
                                  appointment,
                                  "Completed"
                                )
                              }
                              className="rounded-xl border border-[#bbf7d0] px-3 py-2 text-xs font-semibold text-[#166534]"
                            >
                              Complete
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(
                                  appointment,
                                  "Cancelled"
                                )
                              }
                              className="rounded-xl border border-[#fecaca] px-3 py-2 text-xs font-semibold text-[#b91c1c]"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/40 p-4">

          <form
            onSubmit={
              reschedule
            }
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
          >

            <div className="flex items-center justify-between border-b border-[#e2e8f0] p-5">

              <h3 className="font-semibold">
                Reschedule appointment
              </h3>

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

              <label className="mb-2 block text-sm font-medium text-[#334155]">
                New date and time
              </label>

              <input
                type="datetime-local"
                required
                value={
                  rescheduleValue
                }
                onChange={(
                  event
                ) =>
                  setRescheduleValue(
                    event.target
                      .value
                  )
                }
                className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e]"
              />

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
                  className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Reschedule
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
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ccfbf1] text-[#0f766e]">
        <Icon
          size={18}
        />
      </div>

      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#64748b]">
        {label}
      </p>

    </div>
  );
}

function Status({
  value,
}) {
  const key =
    String(
      value ||
        ""
    )
      .toLowerCase();

  let classes =
    "bg-[#f1f5f9] text-[#475569]";

  if (
    key ===
    "confirmed"
  ) {
    classes =
      "bg-[#dcfce7] text-[#166534]";
  }

  if (
    key ===
    "pending"
  ) {
    classes =
      "bg-[#fef3c7] text-[#92400e]";
  }

  if (
    key ===
      "cancelled" ||
    key ===
      "missed"
  ) {
    classes =
      "bg-[#fee2e2] text-[#b91c1c]";
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes}`}
    >
      {value}
    </span>
  );
}
