import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Clock3,
  Edit3,
  Link2,
  MapPin,
  Pill,
  Plus,
  RefreshCw,
  Stethoscope,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  nursesApi,
} from "../../services/api/nurses.js";

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

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

function todayInput() {
  return new Date()
    .toISOString()
    .slice(
      0,
      10
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

    date.setSeconds(
      0
    );

    date.setMilliseconds(
      0
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

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function NursePatientCarePage() {
  const {
    patientId,
  } =
    useParams();

  const [
    patient,
    setPatient,
  ] =
    useState(null);

  const [
    nurse,
    setNurse,
  ] =
    useState(null);

  const [
    clinicProxies,
    setClinicProxies,
  ] =
    useState([]);

  const [
    clinicStock,
    setClinicStock,
  ] =
    useState([]);

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
    modal,
    setModal,
  ] =
    useState(null);

  const [
    editing,
    setEditing,
  ] =
    useState(null);

  const [
    medicationLogs,
    setMedicationLogs,
  ] =
    useState([]);

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

          const care =
            await nursesApi
              .getPatientCare(
                patientId
              );

          const [
            proxiesResult,
            stockResult,
            nurseResult,
          ] =
            await Promise.allSettled([
              nursesApi
                .getClinicProxies(),

              nursesApi
                .getClinicStock(),

              nursesApi
                .getMe(),
            ]);

          setPatient(
            care
          );

          setClinicProxies(
            proxiesResult.status ===
              "fulfilled" &&
            Array.isArray(
              proxiesResult.value
            )
              ? proxiesResult.value
              : []
          );

          setClinicStock(
            stockResult.status ===
              "fulfilled" &&
            Array.isArray(
              stockResult.value
            )
              ? stockResult.value
              : []
          );

          setNurse(
            nurseResult.status ===
              "fulfilled"
              ? nurseResult.value
              : null
          );
        } catch (loadError) {
          console.error(
            loadError
          );

          setError(
            loadError?.message ||
              "Could not load patient care information."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        patientId,
      ]
    );

  useEffect(
    () => {
      load();
    },
    [
      load,
    ]
  );

  function success(
    text
  ) {
    setMessage(
      text
    );

    setError(
      ""
    );
  }

  async function removeAllergy(
    allergy
  ) {
    if (
      !window.confirm(
        `Remove ${allergy.name} from this patient's allergy record?`
      )
    ) {
      return;
    }

    try {
      await nursesApi
        .deleteAllergy(
          patientId,
          allergy.id
        );

      success(
        "Allergy removed."
      );

      await load();
    } catch (actionError) {
      setError(
        actionError?.message ||
          "Could not remove allergy."
      );
    }
  }

  async function archiveCondition(
    condition
  ) {
    if (
      !window.confirm(
        `Archive ${condition.name}?`
      )
    ) {
      return;
    }

    try {
      await nursesApi
        .archiveCondition(
          patientId,
          condition.id
        );

      success(
        "Condition archived."
      );

      await load();
    } catch (actionError) {
      setError(
        actionError?.message ||
          "Could not archive condition."
      );
    }
  }

  async function removeProxy(
    proxy
  ) {
    if (
      !window.confirm(
        `Remove ${proxy.fullName} from this patient?`
      )
    ) {
      return;
    }

    try {
      await nursesApi
        .removeProxy(
          proxy.proxyLinkId
        );

      success(
        "Proxy assignment removed."
      );

      await load();
    } catch (actionError) {
      setError(
        actionError?.message ||
          "Could not remove Proxy."
      );
    }
  }

  async function viewLogs(
    medication
  ) {
    try {
      setEditing(
        medication
      );

      const logs =
        await nursesApi
          .getMedicationLogs(
            medication.id
          );

      setMedicationLogs(
        Array.isArray(
          logs
        )
          ? logs
          : []
      );

      setModal(
        "logs"
      );
    } catch (actionError) {
      setError(
        actionError?.message ||
          "Could not load medication history."
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="p-8 text-center text-sm text-[#64748b]">
        Loading patient care record...
      </div>
    );
  }

  if (
    !patient
  ) {
    return (
      <div className="p-8">

        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
          {error ||
            "Patient could not be loaded."}
        </div>

      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1500px]">

        <div className="mb-6">

          <Link
            to="/nurse/patients"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e]"
          >
            <ArrowLeft
              size={16}
            />

            Patients
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                {patient.fullName}
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                {patient.patientNumber}
                {" · "}
                {patient.clinicName}
              </p>

            </div>

            <button
              type="button"
              onClick={
                load
              }
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 text-sm font-semibold text-[#475569]"
            >
              <RefreshCw
                size={16}
              />

              Refresh
            </button>

          </div>

        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-sm text-[#166534]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
            {error}
          </div>
        )}

        {/* PATIENT DETAILS */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">

          <div className="border-b border-[#e2e8f0] px-5 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
                <UserRound
                  size={18}
                />
              </div>

              <div>

                <h3 className="font-semibold">
                  Patient information
                </h3>

                <p className="text-sm text-[#64748b]">
                  Clinical identity and contact information.
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">

            <Info
              label="ID number"
              value={
                patient.idNumber
              }
            />

            <Info
              label="Date of birth"
              value={
                formatDate(
                  patient.dateOfBirth
                )
              }
            />

            <Info
              label="Gender"
              value={
                patient.gender ||
                "—"
              }
            />

            <Info
              label="Phone"
              value={
                patient.phoneNumber ||
                "—"
              }
            />

            <Info
              label="Email"
              value={
                patient.email ||
                "—"
              }
            />

            <Info
              label="Suburb"
              value={
                patient.suburb ||
                "—"
              }
            />

            <Info
              label="City"
              value={
                patient.city ||
                "—"
              }
            />

            <Info
              label="Province"
              value={
                patient.province ||
                "—"
              }
            />

            <div className="sm:col-span-2 lg:col-span-4">

              <Info
                label="Address"
                value={[
                  patient.addressLine1,
                  patient.addressLine2,
                  patient.suburb,
                  patient.city,
                  patient.postalCode,
                ]
                  .filter(Boolean)
                  .join(
                    ", "
                  )}
              />

            </div>

          </div>

        </section>

        <div className="grid gap-6 xl:grid-cols-2">

          {/* ALLERGIES */}

          <CareSection
            icon={
              AlertTriangle
            }
            title="Allergies"
            description="Clinical allergy record."
            action={
              <ActionButton
                label="Add allergy"
                onClick={() => {
                  setEditing(
                    null
                  );

                  setModal(
                    "allergy"
                  );
                }}
              />
            }
          >

            {patient.allergies?.length ? (
              <div className="divide-y divide-[#e2e8f0]">

                {patient.allergies.map(
                  (
                    allergy
                  ) => (
                    <div
                      key={
                        allergy.id
                      }
                      className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >

                      <div>

                        <p className="font-semibold">
                          {allergy.name}
                        </p>

                        <p className="mt-1 text-sm text-[#64748b]">
                          Reaction:{" "}
                          {allergy.reaction ||
                            "Not specified"}
                        </p>

                        <p className="mt-1 text-xs text-[#94a3b8]">
                          Severity:{" "}
                          {allergy.severity ||
                            "Not specified"}
                        </p>

                      </div>

                      <div className="flex gap-1">

                        <IconButton
                          icon={
                            Edit3
                          }
                          title="Edit allergy"
                          onClick={() => {
                            setEditing(
                              allergy
                            );

                            setModal(
                              "allergy"
                            );
                          }}
                        />

                        <IconButton
                          icon={
                            Trash2
                          }
                          title="Remove allergy"
                          danger
                          onClick={() =>
                            removeAllergy(
                              allergy
                            )
                          }
                        />

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <EmptyText>
                No allergies recorded.
              </EmptyText>
            )}

          </CareSection>

          {/* CONDITIONS */}

          <CareSection
            icon={
              Stethoscope
            }
            title="Medical conditions"
            description="Diagnoses and chronic conditions."
            action={
              <ActionButton
                label="Add condition"
                onClick={() => {
                  setEditing(
                    null
                  );

                  setModal(
                    "condition"
                  );
                }}
              />
            }
          >

            {patient.conditions?.length ? (
              <div className="divide-y divide-[#e2e8f0]">

                {patient.conditions.map(
                  (
                    condition
                  ) => (
                    <div
                      key={
                        condition.id
                      }
                      className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="font-semibold">
                            {condition.name}
                          </p>

                          {condition.isChronic && (
                            <span className="rounded-full bg-[#ede9fe] px-2 py-0.5 text-[10px] font-semibold text-[#6d28d9]">
                              Chronic
                            </span>
                          )}

                          {!condition.isActive && (
                            <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-semibold text-[#64748b]">
                              Archived
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-sm text-[#64748b]">
                          Diagnosed:{" "}
                          {formatDate(
                            condition.diagnosisDate
                          )}
                        </p>

                      </div>

                      {condition.isActive && (
                        <div className="flex gap-1">

                          <IconButton
                            icon={
                              Edit3
                            }
                            title="Edit"
                            onClick={() => {
                              setEditing(
                                condition
                              );

                              setModal(
                                "condition"
                              );
                            }}
                          />

                          <IconButton
                            icon={
                              Trash2
                            }
                            title="Archive"
                            danger
                            onClick={() =>
                              archiveCondition(
                                condition
                              )
                            }
                          />

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>
            ) : (
              <EmptyText>
                No conditions recorded.
              </EmptyText>
            )}

          </CareSection>

          {/* HEALTH METRICS */}

          <CareSection
            icon={
              Activity
            }
            title="Health Metrics"
            description="Vitals and clinical measurements recorded for this patient."
            action={
              <ActionButton
                label="Record metric"
                onClick={() => {
                  setEditing(
                    null
                  );

                  setModal(
                    "healthMetric"
                  );
                }}
              />
            }
          >

            {patient.healthMetrics?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">

                {patient.healthMetrics
                  .slice(
                    0,
                    8
                  )
                  .map(
                    (
                      metric
                    ) => (
                      <div
                        key={
                          metric.id
                        }
                        className="rounded-xl border border-[#e2e8f0] p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <p className="text-sm font-semibold text-[#0f172a]">
                              {metric.metricType}
                            </p>

                            <p className="mt-1 text-lg font-bold text-[#0f766e]">
                              {metric.value}

                              {metric.unit
                                ? ` ${metric.unit}`
                                : ""}
                            </p>

                          </div>

                          {metric.status && (
                            <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] font-semibold text-[#475569]">
                              {metric.status}
                            </span>
                          )}

                        </div>

                        {metric.note && (
                          <p className="mt-2 text-xs leading-5 text-[#64748b]">
                            {metric.note}
                          </p>
                        )}

                        <p className="mt-3 text-[11px] text-[#94a3b8]">
                          {formatDateTime(
                            metric.recordedAt
                          )}
                        </p>

                      </div>
                    )
                  )}

              </div>
            ) : (
              <EmptyText>
                No health metrics recorded yet.
              </EmptyText>
            )}

          </CareSection>

          {/* MEDICATIONS */}

          <CareSection
            icon={
              Pill
            }
            title="Medication"
            description="Medication prescribed and assigned by clinical staff."
            action={
              <ActionButton
                label="Assign medication"
                onClick={() => {
                  setEditing(
                    null
                  );

                  setModal(
                    "medication"
                  );
                }}
              />
            }
          >

            {patient.medications?.length ? (
              <div className="space-y-4">

                {patient.medications.map(
                  (
                    medication
                  ) => (
                    <div
                      key={
                        medication.id
                      }
                      className="rounded-xl border border-[#e2e8f0] p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="font-semibold">
                            {medication.name}
                          </p>

                          <p className="mt-1 text-sm text-[#64748b]">
                            {medication.dosage}
                            {" · "}
                            {medication.form}
                          </p>

                          <p className="mt-2 text-xs text-[#64748b]">
                            {medication.instructions ||
                              "No instructions"}
                          </p>

                        </div>

                        <span
                          className={[
                            "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                            medication.isActive
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#f1f5f9] text-[#64748b]",
                          ].join(
                            " "
                          )}
                        >
                          {medication.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {(medication.schedules ||
                          []).map(
                          (
                            schedule
                          ) => (
                            <span
                              key={
                                schedule.id
                              }
                              className="inline-flex items-center gap-1 rounded-full bg-[#f0fdfa] px-2.5 py-1 text-xs font-semibold text-[#0f766e]"
                            >
                              <Clock3
                                size={12}
                              />

                              {
                                schedule.timeOfDay
                              }
                            </span>
                          )
                        )}

                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {medication.isActive && (
                          <>
                            <SmallButton
                              label="Add dose time"
                              onClick={() => {
                                setEditing(
                                  medication
                                );

                                setModal(
                                  "schedule"
                                );
                              }}
                            />

                            <SmallButton
                              label="Schedule collection"
                              onClick={() => {
                                setEditing(
                                  medication
                                );

                                setModal(
                                  "collection"
                                );
                              }}
                            />
                          </>
                        )}

                        <SmallButton
                          label="Adherence history"
                          onClick={() =>
                            viewLogs(
                              medication
                            )
                          }
                        />

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <EmptyText>
                No medication assigned.
              </EmptyText>
            )}

          </CareSection>

          {/* PROXY */}

          <CareSection
            icon={
              Users
            }
            title="Assigned Proxy"
            description="Community health workers linked to this patient."
            action={
              <ActionButton
                label="Assign Proxy"
                onClick={() => {
                  setEditing(
                    null
                  );

                  setModal(
                    "proxy"
                  );
                }}
              />
            }
          >

            {patient.proxies?.length ? (
              <div className="space-y-3">

                {patient.proxies.map(
                  (
                    proxy
                  ) => (
                    <div
                      key={
                        proxy.proxyLinkId
                      }
                      className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] p-4"
                    >

                      <div>

                        <p className="font-semibold">
                          {proxy.fullName}
                        </p>

                        <p className="mt-1 text-sm text-[#64748b]">
                          {proxy.phoneNumber}
                        </p>

                      </div>

                      <IconButton
                        icon={
                          Trash2
                        }
                        title="Remove Proxy"
                        danger
                        onClick={() =>
                          removeProxy(
                            proxy
                          )
                        }
                      />

                    </div>
                  )
                )}

              </div>
            ) : (
              <EmptyText>
                No Proxy assigned.
              </EmptyText>
            )}

          </CareSection>

          {/* COLLECTIONS */}

          <CareSection
            icon={
              ClipboardList
            }
            title="Collection history"
            description="Recent medication collections."
          >

            {patient.collections?.length ? (
              <div className="divide-y divide-[#e2e8f0]">

                {patient.collections
                  .slice(
                    0,
                    8
                  )
                  .map(
                    (
                      collection
                    ) => (
                      <div
                        key={
                          collection.id
                        }
                        className="py-4 first:pt-0 last:pb-0"
                      >

                        <div className="flex justify-between gap-4">

                          <div>

                            <p className="text-sm font-semibold">
                              {collection.medicationName}
                            </p>

                            <p className="mt-1 text-xs text-[#64748b]">
                              {formatDate(
                                collection.scheduledCollectionDate
                              )}
                            </p>

                          </div>

                          <span className="text-xs font-semibold text-[#475569]">
                            {collection.status}
                          </span>

                        </div>

                      </div>
                    )
                  )}

              </div>
            ) : (
              <EmptyText>
                No collection history.
              </EmptyText>
            )}

          </CareSection>

          {/* APPOINTMENTS */}

          <CareSection
            icon={
              CalendarDays
            }
            title="Appointments"
            description="Recent and upcoming appointments."
            action={
              <div className="flex flex-wrap items-center justify-end gap-2">

                <ActionButton
                  label="Book routine checkup"
                  onClick={() => {
                    setEditing(
                      null
                    );

                    setModal(
                      "appointment"
                    );
                  }}
                />

                <Link
                  to="/nurse/appointments"
                  className="text-xs font-semibold text-[#0f766e]"
                >
                  Open appointments
                </Link>

              </div>
            }
          >

            {patient.appointments?.length ? (
              <div className="divide-y divide-[#e2e8f0]">

                {patient.appointments
                  .slice(
                    0,
                    8
                  )
                  .map(
                    (
                      appointment
                    ) => (
                      <div
                        key={
                          appointment.id
                        }
                        className="py-4 first:pt-0 last:pb-0"
                      >

                        <p className="text-sm font-semibold">
                          {appointment.type ||
                            "Appointment"}
                        </p>

                        <p className="mt-1 text-xs text-[#64748b]">
                          {formatDateTime(
                            appointment.scheduledAt
                          )}
                          {" · "}
                          {appointment.status}
                        </p>

                      </div>
                    )
                  )}

              </div>
            ) : (
              <EmptyText>
                No appointments.
              </EmptyText>
            )}

          </CareSection>

        </div>

      </div>

      {/* MODALS */}

      {modal ===
        "allergy" && (
        <AllergyModal
          patientId={
            patientId
          }
          existing={
            editing
          }
          onClose={() => {
            setModal(
              null
            );

            setEditing(
              null
            );
          }}
          onSaved={async () => {
            setModal(
              null
            );

            setEditing(
              null
            );

            success(
              "Allergy record saved."
            );

            await load();
          }}
        />
      )}

      {modal ===
        "condition" && (
        <ConditionModal
          patientId={
            patientId
          }
          existing={
            editing
          }
          onClose={() => {
            setModal(
              null
            );

            setEditing(
              null
            );
          }}
          onSaved={async () => {
            setModal(
              null
            );

            success(
              "Condition saved."
            );

            await load();
          }}
        />
      )}

      {modal ===
        "appointment" && (
        <RoutineCheckupModal
          patientId={
            patientId
          }
          clinicId={
            patient.clinicId
          }
          patientName={
            patient.fullName
          }
          nurse={
            nurse
          }
          onClose={() =>
            setModal(
              null
            )
          }
          onSaved={async () => {
            setModal(
              null
            );

            success(
              "Routine checkup booked."
            );

            await load();
          }}
        />
      )}

      {modal ===
        "healthMetric" && (
        <HealthMetricModal
          patientId={
            patientId
          }
          onClose={() =>
            setModal(
              null
            )
          }
          onSaved={async () => {
            setModal(
              null
            );

            success(
              "Health metric recorded."
            );

            await load();
          }}
        />
      )}

      {modal ===
        "medication" && (
        <MedicationModal
          patientId={
            patientId
          }
          stock={
            clinicStock
          }
          onClose={() =>
            setModal(
              null
            )
          }
          onSaved={async () => {
            setModal(
              null
            );

            success(
              "Medication assigned."
            );

            await load();
          }}
        />
      )}

      {modal ===
        "schedule" && (
        <ScheduleModal
          medication={
            editing
          }
          onClose={() =>
            setModal(
              null
            )
          }
          onSaved={async () => {
            setModal(
              null
            );

            success(
              "Medication dose time added."
            );

            await load();
          }}
        />
      )}

      {modal ===
        "collection" && (
        <CollectionModal
          patientId={
            patientId
          }
          medication={
            editing
          }
          proxies={
            patient.proxies ||
            []
          }
          onClose={() =>
            setModal(
              null
            )
          }
          onSaved={async () => {
            setModal(
              null
            );

            success(
              "Next medication collection scheduled."
            );

            await load();
          }}
        />
      )}

      {modal ===
        "proxy" && (
        <ProxyModal
          patientId={
            patientId
          }
          proxies={
            clinicProxies
          }
          assigned={
            patient.proxies ||
            []
          }
          onClose={() =>
            setModal(
              null
            )
          }
          onSaved={async () => {
            setModal(
              null
            );

            success(
              "Proxy assigned."
            );

            await load();
          }}
        />
      )}

      {modal ===
        "logs" && (
        <Modal
          title={`Adherence · ${editing?.name || ""}`}
          onClose={() =>
            setModal(
              null
            )
          }
        >

          {medicationLogs.length ===
          0 ? (
            <EmptyText>
              No adherence logs yet.
            </EmptyText>
          ) : (
            <div className="max-h-[420px] divide-y divide-[#e2e8f0] overflow-y-auto">

              {medicationLogs.map(
                (
                  log
                ) => (
                  <div
                    key={
                      log.id
                    }
                    className="py-3"
                  >

                    <div className="flex items-center justify-between">

                      <p className="text-sm font-semibold">
                        {log.taken
                          ? "Taken"
                          : "Skipped"}
                      </p>

                      <p className="text-xs text-[#64748b]">
                        {formatDateTime(
                          log.takenAt
                        )}
                      </p>

                    </div>

                    {log.notes && (
                      <p className="mt-1 text-sm text-[#64748b]">
                        {log.notes}
                      </p>
                    )}

                  </div>
                )
              )}

            </div>
          )}

        </Modal>
      )}

    </div>
  );
}

/* ========================================================= */
/* MODAL FORMS                                               */
/* ========================================================= */

function AllergyModal({
  patientId,
  existing,
  onClose,
  onSaved,
}) {
  const [
    form,
    setForm,
  ] =
    useState({
      name:
        existing?.name ||
        "",

      reaction:
        existing?.reaction ||
        "",

      severity:
        existing?.severity ||
        "",

      notes:
        existing?.notes ||
        "",
    });

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function submit(
    event
  ) {
    event.preventDefault();

    try {
      setSaving(
        true
      );

      setError(
        ""
      );

      if (
        existing
      ) {
        await nursesApi
          .updateAllergy(
            patientId,
            existing.id,
            form
          );
      } else {
        await nursesApi
          .createAllergy(
            patientId,
            form
          );
      }

      onSaved();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not save allergy."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <Modal
      title={
        existing
          ? "Edit allergy"
          : "Add allergy"
      }
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
          <FormError>
            {error}
          </FormError>
        )}

        <Field
          label="Allergy"
          required
          value={
            form.name
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              name:
                value,
            })
          }
        />

        <Field
          label="Reaction"
          value={
            form.reaction
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              reaction:
                value,
            })
          }
        />

        <SelectField
          label="Severity"
          value={
            form.severity
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              severity:
                value,
            })
          }
          options={[
            "",
            "Mild",
            "Moderate",
            "Severe",
          ]}
        />

        <TextArea
          label="Notes"
          value={
            form.notes
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              notes:
                value,
            })
          }
        />

        <SubmitBar
          saving={
            saving
          }
          onCancel={
            onClose
          }
        />

      </form>

    </Modal>
  );
}

function ConditionModal({
  patientId,
  existing,
  onClose,
  onSaved,
}) {
  const [
    form,
    setForm,
  ] =
    useState({
      name:
        existing?.name ||
        "",

      diagnosisDate:
        existing?.diagnosisDate
          ? String(
              existing.diagnosisDate
            ).slice(
              0,
              10
            )
          : "",

      isChronic:
        existing?.isChronic ??
        false,

      notes:
        existing?.notes ||
        "",

      isActive:
        existing?.isActive ??
        true,
    });

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function submit(
    event
  ) {
    event.preventDefault();

    const payload = {
      ...form,

      diagnosisDate:
        form.diagnosisDate ||
        null,
    };

    try {
      setSaving(
        true
      );

      if (
        existing
      ) {
        await nursesApi
          .updateCondition(
            patientId,
            existing.id,
            payload
          );
      } else {
        await nursesApi
          .createCondition(
            patientId,
            payload
          );
      }

      onSaved();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not save condition."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <Modal
      title={
        existing
          ? "Edit condition"
          : "Add condition"
      }
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
          <FormError>
            {error}
          </FormError>
        )}

        <Field
          label="Condition"
          required
          value={
            form.name
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              name:
                value,
            })
          }
        />

        <Field
          label="Diagnosis date"
          type="date"
          value={
            form.diagnosisDate
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              diagnosisDate:
                value,
            })
          }
        />

        <label className="flex items-center gap-3 text-sm font-medium text-[#334155]">

          <input
            type="checkbox"
            checked={
              form.isChronic
            }
            onChange={(
              event
            ) =>
              setForm({
                ...form,

                isChronic:
                  event.target
                    .checked,
              })
            }
          />

          Chronic condition

        </label>

        <TextArea
          label="Notes"
          value={
            form.notes
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              notes:
                value,
            })
          }
        />

        <SubmitBar
          saving={
            saving
          }
          onCancel={
            onClose
          }
        />

      </form>

    </Modal>
  );
}

function RoutineCheckupModal({
  patientId,
  clinicId,
  patientName,
  nurse,
  onClose,
  onSaved,
}) {
  const [
    scheduledAt,
    setScheduledAt,
  ] =
    useState(
      toLocalDateTimeInput()
    );

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
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function submit(
    event
  ) {
    event.preventDefault();

    const appointmentDate =
      new Date(
        scheduledAt
      );

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      setError(
        "Choose a valid appointment date and time."
      );

      return;
    }

    if (
      appointmentDate.getTime() <=
      Date.now()
    ) {
      setError(
        "The appointment must be scheduled for a future date and time."
      );

      return;
    }

    if (
      !patientId ||
      !clinicId
    ) {
      setError(
        "The patient clinic information is unavailable."
      );

      return;
    }

    if (
      !nurse?.nurseId
    ) {
      setError(
        "Your Nurse profile could not be loaded. Refresh the page and try again."
      );

      return;
    }

    try {
      setSaving(
        true
      );

      setError(
        ""
      );

      await nursesApi
        .createAppointment({
          patientId,

          clinicId,

          nurseId:
            nurse.nurseId,

          scheduledAt:
            appointmentDate
              .toISOString(),

          durationMinutes:
            30,

          type:
            "Routine Checkup",

          reason:
            "Routine patient checkup",

          providerName:
            nurse.fullName ||
            null,

          mode,

          status:
            "Scheduled",

          notes:
            notes.trim() ||
            null,
        });

      await onSaved();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not book the routine checkup."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <Modal
      title="Book routine checkup"
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
          <FormError>
            {error}
          </FormError>
        )}

        <div className="rounded-xl bg-[#f8fafc] p-4">

          <p className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
            Patient
          </p>

          <p className="mt-1 text-sm font-semibold text-[#0f172a]">
            {patientName}
          </p>

          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
            Nurse
          </p>

          <p className="mt-1 text-sm font-semibold text-[#0f172a]">
            {nurse?.fullName ||
              "Current Nurse"}
          </p>

          <p className="mt-2 text-xs text-[#64748b]">
            Routine checkup · 30 minutes
          </p>

        </div>

        <Field
          label="Appointment date and time"
          type="datetime-local"
          required
          value={
            scheduledAt
          }
          onChange={
            setScheduledAt
          }
        />

        <div>

          <label className="mb-2 block text-sm font-medium text-[#334155]">
            Visit mode
          </label>

          <select
            value={
              mode
            }
            onChange={(
              event
            ) =>
              setMode(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e]"
          >
            <option value="InPerson">
              In person
            </option>

            <option value="Telehealth">
              Telehealth
            </option>
          </select>

        </div>

        <TextArea
          label="Notes"
          value={
            notes
          }
          onChange={
            setNotes
          }
        />

        <SubmitBar
          saving={
            saving
          }
          onCancel={
            onClose
          }
        />

      </form>

    </Modal>
  );
}

function HealthMetricModal({
  patientId,
  onClose,
  onSaved,
}) {
  const unitByMetric = {
    "Blood Pressure":
      "mmHg",

    "Blood Glucose":
      "mmol/L",

    Weight:
      "kg",

    Temperature:
      "°C",

    "Heart Rate":
      "bpm",

    "Oxygen Saturation":
      "%",
  };

  const [
    form,
    setForm,
  ] =
    useState({
      metricType:
        "Blood Pressure",

      customMetricType:
        "",

      value:
        "",

      unit:
        "mmHg",

      status:
        "",

      note:
        "",
    });

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function submit(
    event
  ) {
    event.preventDefault();

    const metricType =
      form.metricType ===
      "Other"
        ? form.customMetricType
            .trim()
        : form.metricType;

    if (
      !metricType ||
      !form.value.trim()
    ) {
      setError(
        "Metric type and value are required."
      );

      return;
    }

    try {
      setSaving(
        true
      );

      setError(
        ""
      );

      await nursesApi
        .createHealthMetric(
          patientId,
          {
            metricType,

            value:
              form.value.trim(),

            unit:
              form.unit.trim(),

            status:
              form.status ||
              null,

            note:
              form.note ||
              null,
          }
        );

      onSaved();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not record health metric."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <Modal
      title="Record health metric"
      onClose={
        onClose
      }
    >

      <form
        onSubmit={
          submit
        }
        className="grid gap-4 sm:grid-cols-2"
      >

        {error && (
          <div className="sm:col-span-2">
            <FormError>
              {error}
            </FormError>
          </div>
        )}

        <SelectField
          label="Metric"
          value={
            form.metricType
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,

              metricType:
                value,

              unit:
                unitByMetric[
                  value
                ] ??
                "",
            })
          }
          options={[
            "Blood Pressure",
            "Blood Glucose",
            "Weight",
            "Temperature",
            "Heart Rate",
            "Oxygen Saturation",
            "Other",
          ]}
        />

        {form.metricType ===
          "Other" && (
          <Field
            label="Metric name"
            required
            value={
              form.customMetricType
            }
            onChange={(
              value
            ) =>
              setForm({
                ...form,
                customMetricType:
                  value,
              })
            }
          />
        )}

        <Field
          label="Value"
          required
          placeholder={
            form.metricType ===
            "Blood Pressure"
              ? "e.g. 120/80"
              : "Enter reading"
          }
          value={
            form.value
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              value:
                value,
            })
          }
        />

        <Field
          label="Unit"
          value={
            form.unit
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              unit:
                value,
            })
          }
        />

        <SelectField
          label="Status"
          value={
            form.status
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              status:
                value,
            })
          }
          options={[
            "",
            "Normal",
            "Low",
            "Elevated",
            "High",
            "Critical",
          ]}
        />

        <div className="sm:col-span-2">

          <TextArea
            label="Clinical note"
            value={
              form.note
            }
            onChange={(
              value
            ) =>
              setForm({
                ...form,
                note:
                  value,
              })
            }
          />

        </div>

        <div className="sm:col-span-2">

          <SubmitBar
            saving={
              saving
            }
            onCancel={
              onClose
            }
          />

        </div>

      </form>

    </Modal>
  );
}

function MedicationModal({
  patientId,
  stock,
  onClose,
  onSaved,
}) {
  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    form,
    setForm,
  ] =
    useState({
      clinicStockId:
        "",

      instructions:
        "",

      unitsPerDose:
        "1",

      prescribedBy:
        "",

      conditionName:
        "",

      startDate:
        todayInput(),

      endDate:
        "",
    });

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const availableStock =
    Array.isArray(
      stock
    )
      ? stock
      : [];

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredStock =
    availableStock
      .filter(
        (
          item
        ) => {
          if (
            !normalizedSearch
          ) {
            return true;
          }

          return [
            item.medicationName,
            item.strength,
            item.form,
            item.unit,
          ]
            .filter(Boolean)
            .join(
              " "
            )
            .toLowerCase()
            .includes(
              normalizedSearch
            );
        }
      )
      .slice(
        0,
        40
      );

  const selectedStock =
    availableStock.find(
      (
        item
      ) =>
        item.id ===
        form.clinicStockId
    );

  async function submit(
    event
  ) {
    event.preventDefault();

    if (
      !form.clinicStockId
    ) {
      setError(
        "Select a medication from clinic inventory."
      );

      return;
    }

    try {
      setSaving(
        true
      );

      setError(
        ""
      );

      await nursesApi
        .createMedication({
          patientId,

          clinicStockId:
            form.clinicStockId,

          instructions:
            form.instructions,

          unitsPerDose:
            form.unitsPerDose
              ? Number(
                  form.unitsPerDose
                )
              : null,

          prescribedBy:
            form.prescribedBy ||
            null,

          conditionName:
            form.conditionName ||
            null,

          startDate:
            new Date(
              `${form.startDate}T00:00:00`
            )
              .toISOString(),

          endDate:
            form.endDate
              ? new Date(
                  `${form.endDate}T23:59:59`
                )
                  .toISOString()
              : null,
        });

      onSaved();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not assign medication."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <Modal
      title="Assign medication from inventory"
      onClose={
        onClose
      }
    >

      <form
        onSubmit={
          submit
        }
        className="grid gap-4 sm:grid-cols-2"
      >

        {error && (
          <div className="sm:col-span-2">
            <FormError>
              {error}
            </FormError>
          </div>
        )}

        <div className="sm:col-span-2">

          <label className="mb-2 block text-sm font-medium text-[#334155]">
            Medication in clinic inventory
          </label>

          <input
            type="search"
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
            placeholder="Search medication, strength or form..."
            className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
          />

          <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-[#e2e8f0] bg-white">

            {availableStock.length ===
            0 ? (
              <div className="p-4 text-sm text-[#64748b]">
                There is no active medication stock available at this clinic.
              </div>
            ) : filteredStock.length ===
              0 ? (
              <div className="p-4 text-sm text-[#64748b]">
                No inventory item matches your search.
              </div>
            ) : (
              filteredStock.map(
                (
                  item
                ) => {
                  const selected =
                    form.clinicStockId ===
                    item.id;

                  return (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,

                          clinicStockId:
                            item.id,
                        })
                      }
                      className={[
                        "flex w-full items-start justify-between gap-4 border-b border-[#f1f5f9] px-4 py-3 text-left last:border-b-0",
                        selected
                          ? "bg-[#f0fdfa]"
                          : "hover:bg-[#f8fafc]",
                      ].join(
                        " "
                      )}
                    >

                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-[#0f172a]">
                          {item.medicationName}
                        </p>

                        <p className="mt-1 text-xs text-[#64748b]">
                          {item.strength}
                          {" · "}
                          {item.form}
                        </p>

                      </div>

                      <div className="shrink-0 text-right">

                        <p className="text-xs font-semibold text-[#0f766e]">
                          {item.quantityOnHand}
                          {" "}
                          {item.unit ||
                            "units"}
                        </p>

                        <p className="mt-1 text-[10px] text-[#94a3b8]">
                          in stock
                        </p>

                      </div>

                    </button>
                  );
                }
              )
            )}

          </div>

          {selectedStock && (
            <div className="mt-3 rounded-xl bg-[#f0fdfa] p-3 text-sm text-[#115e59]">

              Selected:{" "}

              <span className="font-semibold">
                {selectedStock.medicationName}
                {" · "}
                {selectedStock.strength}
                {" · "}
                {selectedStock.form}
              </span>

            </div>
          )}

        </div>

        <Field
          label="Units per dose"
          type="number"
          value={
            form.unitsPerDose
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              unitsPerDose:
                value,
            })
          }
        />

        <Field
          label="Prescribed by"
          value={
            form.prescribedBy
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              prescribedBy:
                value,
            })
          }
        />

        <Field
          label="Condition"
          value={
            form.conditionName
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              conditionName:
                value,
            })
          }
        />

        <Field
          label="Start date"
          type="date"
          required
          value={
            form.startDate
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              startDate:
                value,
            })
          }
        />

        <Field
          label="End date"
          type="date"
          value={
            form.endDate
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              endDate:
                value,
            })
          }
        />

        <div className="sm:col-span-2">

          <TextArea
            label="Instructions"
            value={
              form.instructions
            }
            onChange={(
              value
            ) =>
              setForm({
                ...form,
                instructions:
                  value,
              })
            }
          />

        </div>

        <div className="sm:col-span-2">

          <SubmitBar
            saving={
              saving
            }
            onCancel={
              onClose
            }
          />

        </div>

      </form>

    </Modal>
  );
}

function ScheduleModal({
  medication,
  onClose,
  onSaved,
}) {
  const [
    time,
    setTime,
  ] =
    useState(
      "08:00"
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function submit(
    event
  ) {
    event.preventDefault();

    try {
      setSaving(
        true
      );

      await nursesApi
        .addMedicationSchedule(
          medication.id,
          time
        );

      onSaved();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not add medication schedule."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <Modal
      title={`Add dose time · ${medication?.name}`}
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
          <FormError>
            {error}
          </FormError>
        )}

        <Field
          label="Dose time"
          type="time"
          required
          value={
            time
          }
          onChange={
            setTime
          }
        />

        <SubmitBar
          saving={
            saving
          }
          onCancel={
            onClose
          }
        />

      </form>

    </Modal>
  );
}

function CollectionModal({
  patientId,
  medication,
  proxies,
  onClose,
  onSaved,
}) {
  const [
    form,
    setForm,
  ] =
    useState({
      date:
        todayInput(),

      quantity:
        "30",

      proxyId:
        "",

      notes:
        "",
    });

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function submit(
    event
  ) {
    event.preventDefault();

    try {
      setSaving(
        true
      );

      await nursesApi
        .scheduleCollection(
          patientId,
          {
            medicationId:
              medication.id,

            scheduledCollectionDate:
              new Date(
                `${form.date}T09:00:00`
              )
                .toISOString(),

            quantity:
              Number(
                form.quantity
              ),

            proxyId:
              form.proxyId ||
              null,

            notes:
              form.notes ||
              null,
          }
        );

      onSaved();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not schedule collection."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <Modal
      title={`Schedule collection · ${medication?.name}`}
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
          <FormError>
            {error}
          </FormError>
        )}

        <Field
          label="Collection date"
          type="date"
          required
          value={
            form.date
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              date:
                value,
            })
          }
        />

        <Field
          label="Quantity"
          type="number"
          required
          value={
            form.quantity
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              quantity:
                value,
            })
          }
        />

        <div>

          <label className="mb-2 block text-sm font-medium text-[#334155]">
            Collection method
          </label>

          <select
            value={
              form.proxyId
            }
            onChange={(
              event
            ) =>
              setForm({
                ...form,

                proxyId:
                  event.target
                    .value,
              })
            }
            className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e]"
          >

            <option value="">
              Patient collects personally
            </option>

            {proxies.map(
              (
                proxy
              ) => (
                <option
                  key={
                    proxy.proxyId
                  }
                  value={
                    proxy.proxyId
                  }
                >
                  Proxy:{" "}
                  {proxy.fullName}
                </option>
              )
            )}

          </select>

        </div>

        <TextArea
          label="Notes"
          value={
            form.notes
          }
          onChange={(
            value
          ) =>
            setForm({
              ...form,
              notes:
                value,
            })
          }
        />

        <SubmitBar
          saving={
            saving
          }
          onCancel={
            onClose
          }
        />

      </form>

    </Modal>
  );
}

function ProxyModal({
  patientId,
  proxies,
  assigned,
  onClose,
  onSaved,
}) {
  const assignedIds =
    new Set(
      assigned.map(
        (
          proxy
        ) =>
          proxy.proxyId
      )
    );

  const available =
    proxies.filter(
      (
        proxy
      ) =>
        !assignedIds.has(
          proxy.proxyId
        )
    );

  const [
    proxyId,
    setProxyId,
  ] =
    useState(
      available[0]
        ?.proxyId ||
        ""
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function submit(
    event
  ) {
    event.preventDefault();

    if (
      !proxyId
    ) {
      setError(
        "Select a Proxy."
      );

      return;
    }

    try {
      setSaving(
        true
      );

      await nursesApi
        .assignProxy(
          patientId,
          proxyId
        );

      onSaved();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not assign Proxy."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <Modal
      title="Assign Proxy"
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
          <FormError>
            {error}
          </FormError>
        )}

        {available.length ===
        0 ? (
          <EmptyText>
            There are no other active Proxies available at this clinic.
          </EmptyText>
        ) : (
          <>

            <div>

              <label className="mb-2 block text-sm font-medium text-[#334155]">
                Proxy
              </label>

              <select
                value={
                  proxyId
                }
                onChange={(
                  event
                ) =>
                  setProxyId(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e]"
              >

                {available.map(
                  (
                    proxy
                  ) => (
                    <option
                      key={
                        proxy.proxyId
                      }
                      value={
                        proxy.proxyId
                      }
                    >
                      {proxy.fullName}
                      {" · "}
                      {proxy.phoneNumber}
                    </option>
                  )
                )}

              </select>

            </div>

            <SubmitBar
              saving={
                saving
              }
              onCancel={
                onClose
              }
            />

          </>
        )}

      </form>

    </Modal>
  );
}

/* ========================================================= */
/* UI                                                        */
/* ========================================================= */

function CareSection({
  icon: Icon,
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">

      <div className="flex items-start justify-between gap-4 border-b border-[#e2e8f0] px-5 py-5">

        <div className="flex gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
            <Icon
              size={18}
            />
          </div>

          <div>

            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="mt-1 text-sm text-[#64748b]">
              {description}
            </p>

          </div>

        </div>

        {action}

      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}

function ActionButton({
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#0f766e] px-3 py-2 text-xs font-semibold text-white hover:bg-[#115e59]"
    >
      <Plus
        size={14}
      />

      <span className="hidden sm:inline">
        {label}
      </span>
    </button>
  );
}

function SmallButton({
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] hover:bg-[#f8fafc]"
    >
      {label}
    </button>
  );
}

function IconButton({
  icon: Icon,
  title,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      title={
        title
      }
      onClick={
        onClick
      }
      className={[
        "flex h-8 w-8 items-center justify-center rounded-lg",
        danger
          ? "text-[#dc2626] hover:bg-[#fef2f2]"
          : "text-[#64748b] hover:bg-[#f1f5f9]",
      ].join(
        " "
      )}
    >
      <Icon
        size={15}
      />
    </button>
  );
}

function Info({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-xs font-medium text-[#94a3b8]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#334155]">
        {value ||
          "—"}
      </p>

    </div>
  );
}

function EmptyText({
  children,
}) {
  return (
    <div className="rounded-xl bg-[#f8fafc] p-5 text-center text-sm text-[#64748b]">
      {children}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/40 p-4">

      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="sticky top-0 flex items-center justify-between border-b border-[#e2e8f0] bg-white px-5 py-4">

          <h3 className="font-semibold">
            {title}
          </h3>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-lg p-2 text-[#64748b] hover:bg-[#f1f5f9]"
          >
            <X
              size={17}
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

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-[#334155]">
        {label}
      </label>

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
        placeholder={
          placeholder
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
      />

    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-[#334155]">
        {label}
      </label>

      <select
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e]"
      >

        {options.map(
          (
            option
          ) => (
            <option
              key={
                option ||
                "blank"
              }
              value={
                option
              }
            >
              {option ||
                "Not specified"}
            </option>
          )
        )}

      </select>

    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-[#334155]">
        {label}
      </label>

      <textarea
        rows={3}
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-[#cbd5e1] px-3 py-3 text-sm outline-none focus:border-[#0f766e]"
      />

    </div>
  );
}

function FormError({
  children,
}) {
  return (
    <div className="rounded-xl bg-[#fef2f2] p-3 text-sm text-[#b91c1c]">
      {children}
    </div>
  );
}

function SubmitBar({
  saving,
  onCancel,
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">

      <button
        type="button"
        onClick={
          onCancel
        }
        className="rounded-xl border border-[#cbd5e1] px-4 py-2.5 text-sm font-semibold text-[#475569]"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={
          saving
        }
        className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : "Save"}
      </button>

    </div>
  );
}
