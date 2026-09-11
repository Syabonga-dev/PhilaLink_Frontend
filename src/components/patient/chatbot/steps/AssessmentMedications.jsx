import { useState } from "react";

import {
  Button,
  Input,
} from "../AstraCompat.jsx";

import {
  ArrowLeft,
  ArrowRight,
  Pill,
  Plus,
  X,
} from "lucide-react";

const profileMedications = [
  "Metformin 500mg",
  "Lisinopril 10mg",
  "Atorvastatin 20mg",
];

export default function AssessmentMedications({
  assessment,
  onUpdate,
  onNext,
  onBack,
}) {
  const [customMedication, setCustomMedication] =
    useState("");

  const medications =
    assessment.medications || [];

  const toggleMedication = (medication) => {
    if (
      medications.includes(
        medication
      )
    ) {
      onUpdate({
        medications:
          medications.filter(
            (item) =>
              item !== medication
          ),
      });

      return;
    }

    onUpdate({
      medications: [
        ...medications,
        medication,
      ],
    });
  };

  const addMedication = () => {
    const value =
      customMedication.trim();

    if (!value) {
      return;
    }

    const exists =
      medications.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );

    if (!exists) {
      onUpdate({
        medications: [
          ...medications,
          value,
        ],
      });
    }

    setCustomMedication("");
  };

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
          <Pill
            size={17}
            className="text-brand-primary"
          />
        </div>

        <h2 className="mt-lg text-title text-text-primary">
          Are you taking any medications?
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          Select medications from your PhilaLink profile
          or add another one.
        </p>
      </div>

      <div>
        <p className="mb-sm text-video-title font-medium text-text-secondary">
          Your PhilaLink medications
        </p>

        <div className="grid grid-cols-1 gap-sm">
          {profileMedications.map(
            (medication) => {
              const selected =
                medications.includes(
                  medication
                );

              return (
                <button
                  key={medication}
                  type="button"
                  onClick={() =>
                    toggleMedication(
                      medication
                    )
                  }
                  className={`flex items-center justify-between rounded-corner-md border px-md py-md text-left text-label-sm transition ${
                    selected
                      ? "border-brand-primary bg-brand-tertiary text-brand-primary"
                      : "border-border-secondary bg-white text-text-primary hover:border-brand-primary"
                  }`}
                >
                  <span>
                    {medication}
                  </span>

                  {selected && (
                    <span className="text-video-title font-medium">
                      Selected
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="custom-medication"
          className="mb-xs block text-video-title font-medium text-text-secondary"
        >
          Add another medication
        </label>

        <div className="flex gap-sm">
          <Input
            id="custom-medication"
            value={customMedication}
            onChange={(event) =>
              setCustomMedication(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                "Enter"
              ) {
                event.preventDefault();
                addMedication();
              }
            }}
            placeholder="Medication name"
          />

          <button
            type="button"
            onClick={addMedication}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-md bg-brand-primary text-white"
            aria-label="Add medication"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {medications.length > 0 && (
        <div>
          <p className="mb-sm text-video-title font-medium text-text-secondary">
            Selected medications
          </p>

          <div className="flex flex-wrap gap-sm">
            {medications.map(
              (medication) => (
                <span
                  key={medication}
                  className="inline-flex items-center gap-xs rounded-corner-full bg-bg-faint px-md py-sm text-video-title text-text-primary"
                >
                  {medication}

                  <button
                    type="button"
                    onClick={() =>
                      toggleMedication(
                        medication
                      )
                    }
                    aria-label={`Remove ${medication}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              )
            )}
          </div>
        </div>
      )}

      <div className="rounded-corner-md bg-bg-faint p-md">
        <p className="text-video-title leading-5 text-text-secondary">
          If you are not currently taking medication,
          leave this section empty and continue.
        </p>
      </div>

      <div className="flex gap-md">
        <Button
          variant="subtle"
          iconStart={
            <ArrowLeft size={15} />
          }
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>

        <Button
          variant="primary"
          iconEnd={
            <ArrowRight size={15} />
          }
          onClick={onNext}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
