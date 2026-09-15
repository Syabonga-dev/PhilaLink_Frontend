import { useState } from "react";
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
import { useApi } from "../../lib/useApi.js";
import { nursesApi } from "../../services/api/nurses.js";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
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

export default function NursePatientsPage() {
  const [search, setSearch] =
    useState("");

  const {
    data: patients,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      nursesApi.getAssignedPatients(),
    []
  );

  const patientList =
    Array.isArray(patients)
      ? patients
      : [];

  const searchTerm =
    search.trim().toLowerCase();

  const filtered =
    patientList.filter(
      (patient) => {
        if (!searchTerm) {
          return true;
        }

        return [
          patient.fullName,
          patient.patientNumber,
          patient.phoneNumber,
          patient.gender,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchTerm)
          );
      }
    );

  return (
    <Card>
      <CardHeader
        title="Clinic patients"
        subtitle={`${filtered.length} patient${
          filtered.length === 1
            ? ""
            : "s"
        }`}
        action={
          <Input
            placeholder="Search patients…"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="w-56"
          />
        }
      />

      <CardBody className="pt-0">
        {loading ? (
          <div className="py-10">
            <Spinner label="Loading patients…" />
          </div>
        ) : error ? (
          <ErrorState
            description={
              error.message
            }
            onRetry={refetch}
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
                ? "Try a different search."
                : "There are currently no patients assigned to this clinic."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">
                  <th className="py-2 pr-4 font-medium">
                    Patient
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Patient number
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Date of birth
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Gender
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Phone
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-outline-variant/50">
                {filtered.map(
                  (patient) => (
                    <tr
                      key={
                        patient.patientId
                      }
                    >
                      <td className="py-3 pr-4 font-semibold text-on-surface">
                        {
                          patient.fullName
                        }
                      </td>

                      <td className="py-3 pr-4 text-on-surface-variant">
                        {patient.patientNumber ||
                          "—"}
                      </td>

                      <td className="py-3 pr-4 text-on-surface-variant">
                        {formatDate(
                          patient.dateOfBirth
                        )}
                      </td>

                      <td className="py-3 pr-4 text-on-surface-variant">
                        {patient.gender ||
                          "—"}
                      </td>

                      <td className="py-3 pr-4 text-on-surface-variant">
                        {patient.phoneNumber ? (
                          <a
                            href={`tel:${patient.phoneNumber}`}
                            className="hover:text-primary hover:underline"
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
  );
}