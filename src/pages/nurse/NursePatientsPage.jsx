import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";

import Input from "../../components/ui/Input.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

import {
  ErrorState,
  EmptyState,
} from "../../components/ui/EmptyState.jsx";

import {
  useApi,
} from "../../lib/useApi.js";

import {
  nursesApi,
} from "../../services/api/nurses.js";

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function formatDate(
  value
) {
  if (
    !value
  ) {
    return "—";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
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

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function NursePatientsPage() {
  const navigate =
    useNavigate();

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );

  const {
    data:
      patients,

    loading,

    error,

    refetch,
  } =
    useApi(
      () =>
        nursesApi
          .getAssignedPatients(),
      []
    );

  const patientList =
    Array.isArray(
      patients
    )
      ? patients
      : [];

  const searchTerm =
    search
      .trim()
      .toLowerCase();

  const filtered =
    patientList.filter(
      (
        patient
      ) => {
        if (
          !searchTerm
        ) {
          return true;
        }

        return [
          patient.fullName,
          patient.patientNumber,
          patient.phoneNumber,
          patient.gender,
        ]
          .filter(
            Boolean
          )
          .some(
            (
              value
            ) =>
              String(
                value
              )
                .toLowerCase()
                .includes(
                  searchTerm
                )
          );
      }
    );

  function openPatient(
    patientId
  ) {
    if (
      !patientId
    ) {
      return;
    }

    navigate(
      `/nurse/patients/${patientId}`
    );
  }

  return (
    <div className="space-y-6">

      <Card>

        <CardHeader
          title="Clinic patients"
          subtitle={`${filtered.length} patient${
            filtered.length ===
            1
              ? ""
              : "s"
          }`}
          className="flex-col sm:flex-row"
          action={
            <div className="w-full sm:w-64">

              <Input
                placeholder="Search patients…"
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
                className="w-full"
              />

            </div>
          }
        />

        <CardBody className="pt-0">

          {loading ? (
            <div className="py-12">

              <Spinner
                label="Loading patients…"
              />

            </div>
          ) : error ? (
            <ErrorState
              description={
                error.message
              }
              onRetry={
                refetch
              }
            />
          ) : filtered.length ===
            0 ? (
            <EmptyState
              icon="groups"
              title={
                search
                  ? "No patients found"
                  : "No clinic patients"
              }
              description={
                search
                  ? "Try a different name, patient number or phone number."
                  : "There are currently no active patients assigned to this clinic."
              }
            />
          ) : (
            <>

              {/* =========================================== */}
              {/* DESKTOP TABLE                               */}
              {/* =========================================== */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full text-left text-sm">

                  <thead>

                    <tr className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">

                      <th className="py-3 pr-4 font-medium">
                        Patient
                      </th>

                      <th className="py-3 pr-4 font-medium">
                        Patient number
                      </th>

                      <th className="py-3 pr-4 font-medium">
                        Date of birth
                      </th>

                      <th className="py-3 pr-4 font-medium">
                        Gender
                      </th>

                      <th className="py-3 pr-4 font-medium">
                        Phone
                      </th>

                      <th className="py-3 pr-4 font-medium">
                        Medication
                      </th>

                      <th className="py-3 pr-4 font-medium">
                        Allergies
                      </th>

                      <th className="py-3 pr-4 font-medium">
                        Collections
                      </th>

                      <th className="py-3 text-right font-medium">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-outline-variant/50">

                    {filtered.map(
                      (
                        patient
                      ) => (
                        <tr
                          key={
                            patient.patientId
                          }
                          onClick={() =>
                            openPatient(
                              patient.patientId
                            )
                          }
                          className="cursor-pointer transition-colors hover:bg-surface-container-low"
                        >

                          <td className="py-4 pr-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container/10 text-primary">

                                <span className="material-symbols-outlined text-[18px]">
                                  person
                                </span>

                              </div>

                              <div className="min-w-0">

                                <p className="font-semibold text-on-surface">
                                  {
                                    patient.fullName
                                  }
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="py-4 pr-4 text-on-surface-variant">
                            {patient.patientNumber ||
                              "—"}
                          </td>

                          <td className="py-4 pr-4 text-on-surface-variant">

                            {
                              formatDate(
                                patient.dateOfBirth
                              )
                            }

                          </td>

                          <td className="py-4 pr-4 text-on-surface-variant">
                            {patient.gender ||
                              "—"}
                          </td>

                          <td
                            className="py-4 pr-4 text-on-surface-variant"
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                          >

                            {patient.phoneNumber ? (
                              <a
                                href={`tel:${patient.phoneNumber}`}
                                className="font-medium hover:text-primary hover:underline"
                              >
                                {
                                  patient.phoneNumber
                                }
                              </a>
                            ) : (
                              "—"
                            )}

                          </td>

                          {/* MEDICATION COUNT */}

                          <td className="py-4 pr-4 text-on-surface-variant">

                            {
                              patient.activeMedicationCount ??
                              0
                            }

                          </td>

                          {/* ALLERGY COUNT */}

                          <td className="py-4 pr-4 text-on-surface-variant">

                            {
                              patient.allergyCount ??
                              0
                            }

                          </td>

                          {/* COLLECTION STATUS */}

                          <td className="py-4 pr-4">

                            {patient.overdueCollectionCount >
                            0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-error-container/20 px-2.5 py-1 text-xs font-semibold text-error">

                                <span className="material-symbols-outlined text-[14px]">
                                  warning
                                </span>

                                {
                                  patient.overdueCollectionCount
                                }{" "}
                                overdue

                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-primary-container/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                Up to date
                              </span>
                            )}

                          </td>

                          {/* MANAGE */}

                          <td
                            className="py-4 text-right"
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                          >

                            <button
                              type="button"
                              onClick={() =>
                                openPatient(
                                  patient.patientId
                                )
                              }
                              className="inline-flex min-h-[38px] items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:opacity-90"
                            >

                              <span className="material-symbols-outlined text-[17px]">
                                clinical_notes
                              </span>

                              Manage care

                            </button>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* =========================================== */}
              {/* MOBILE CARDS                                */}
              {/* =========================================== */}

              <div className="space-y-3 md:hidden">

                {filtered.map(
                  (
                    patient
                  ) => (
                    <button
                      key={
                        patient.patientId
                      }
                      type="button"
                      onClick={() =>
                        openPatient(
                          patient.patientId
                        )
                      }
                      className="w-full rounded-2xl border border-outline-variant/60 bg-surface p-4 text-left transition hover:bg-surface-container-low"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container/10 text-primary">

                            <span className="material-symbols-outlined text-[19px]">
                              person
                            </span>

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-on-surface">
                              {
                                patient.fullName
                              }
                            </p>

                            <p className="mt-1 text-xs text-on-surface-variant">

                              {patient.patientNumber ||
                                "No patient number"}

                            </p>

                          </div>

                        </div>

                        <span className="material-symbols-outlined text-on-surface-variant">
                          chevron_right
                        </span>

                      </div>

                      {/* MOBILE COUNTS */}

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <MobileStat
                          label="Medication"
                          value={
                            patient.activeMedicationCount ??
                            0
                          }
                        />

                        <MobileStat
                          label="Allergies"
                          value={
                            patient.allergyCount ??
                            0
                          }
                        />

                      </div>

                      {patient.overdueCollectionCount >
                        0 && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl bg-error-container/20 px-3 py-2 text-xs font-semibold text-error">

                          <span className="material-symbols-outlined text-[16px]">
                            warning
                          </span>

                          {
                            patient.overdueCollectionCount
                          }{" "}
                          overdue medication collection
                          {patient.overdueCollectionCount ===
                          1
                            ? ""
                            : "s"}

                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary">

                        <span className="material-symbols-outlined text-[17px]">
                          clinical_notes
                        </span>

                        Manage patient care

                      </div>

                    </button>
                  )
                )}

              </div>

            </>
          )}

        </CardBody>

      </Card>

    </div>
  );
}

/* ========================================================= */
/* MOBILE STAT                                               */
/* ========================================================= */

function MobileStat({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-surface-container-low p-3">

      <p className="text-xs text-on-surface-variant">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-on-surface">
        {value}
      </p>

    </div>
  );
}