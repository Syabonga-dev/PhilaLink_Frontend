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
import { proxiesApi } from "../../services/api/proxies.js";

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

export default function ProxyPatientsPage() {
  const [search, setSearch] =
    useState("");

  const {
    data: patients,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      proxiesApi.getManagedPatients(),
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
          patient.patientName,
          patient.patientNumber,
          patient.clinicName,
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
        title="Patients under your care"
        subtitle={`${filtered.length} linked patient${
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
            icon="family_restroom"
            title={
              search
                ? "No patients found"
                : "No patients linked to your account"
            }
            description={
              search
                ? "Try a different search."
                : "Ask your clinic to link a patient to your proxy profile."
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(
              (patient) => (
                <div
                  key={
                    patient.proxyLinkId
                  }
                  className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-container/10 text-primary">
                      <span className="material-symbols-outlined">
                        person
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-on-surface">
                        {
                          patient.patientName
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-on-surface-variant">
                        {patient.patientNumber ||
                          "No patient number"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-outline-variant/50 pt-4">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined mt-0.5 text-[18px] text-on-surface-variant">
                        local_hospital
                      </span>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-on-surface-variant">
                          Clinic
                        </p>

                        <p className="text-sm font-medium text-on-surface">
                          {patient.clinicName ||
                            "Not assigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined mt-0.5 text-[18px] text-on-surface-variant">
                        link
                      </span>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-on-surface-variant">
                          Linked since
                        </p>

                        <p className="text-sm font-medium text-on-surface">
                          {formatDate(
                            patient.assignedAt
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}