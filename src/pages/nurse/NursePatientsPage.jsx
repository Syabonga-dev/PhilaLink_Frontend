import {
  useState,
} from "react";

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

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function NursePatientsPage() {
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

              <Spinner label="Loading patients…" />

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
            <div className="overflow-x-auto">

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
                        className="transition-colors hover:bg-surface-container-low"
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

                        <td className="py-4 pr-4 text-on-surface-variant">

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

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </CardBody>

      </Card>

    </div>
  );
}