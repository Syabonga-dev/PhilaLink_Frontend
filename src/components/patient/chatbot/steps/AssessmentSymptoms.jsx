import { useState } from "react";
import { Button } from "../AstraCompat.jsx";

import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Activity,
} from "lucide-react";

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Stomach pain",
  "Back pain",
  "Dizziness",
  "Fatigue",
  "Runny nose",
  "Shortness of breath",
  "Chest pain",
];

export default function AssessmentSymptoms({
  assessment,
  onUpdate,
  onNext,
  onBack,
}) {
  const [customSymptom, setCustomSymptom] =
    useState("");

  const symptoms =
    assessment.symptoms || [];

  const toggleSymptom = (symptom) => {
    if (symptoms.includes(symptom)) {
      onUpdate({
        symptoms: symptoms.filter(
          (item) => item !== symptom
        ),
      });

      return;
    }

    onUpdate({
      symptoms: [
        ...symptoms,
        symptom,
      ],
    });
  };

  const addCustomSymptom = () => {
    const value =
      customSymptom.trim();

    if (!value) {
      return;
    }

    const alreadyExists =
      symptoms.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );

    if (!alreadyExists) {
      onUpdate({
        symptoms: [
          ...symptoms,
          value,
        ],
      });
    }

    setCustomSymptom("");
  };

  const canContinue =
    symptoms.length > 0;

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
          <Activity
            size={17}
            className="text-brand-primary"
          />
        </div>

        <h2 className="mt-lg text-title text-text-primary">
          What symptoms are you experiencing?
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          Select all symptoms that apply. You can also add
          a symptom that is not listed.
        </p>
      </div>

      <div className="flex flex-wrap gap-sm">
        {commonSymptoms.map(
          (symptom) => {
            const selected =
              symptoms.includes(
                symptom
              );

            return (
              <button
                key={symptom}
                type="button"
                onClick={() =>
                  toggleSymptom(
                    symptom
                  )
                }
                className={`rounded-corner-full border px-md py-sm text-label-sm font-medium transition ${
                  selected
                    ? "border-brand-primary bg-brand-tertiary text-brand-primary"
                    : "border-border-secondary bg-surface-bg text-text-secondary hover:border-brand-primary hover:text-text-primary"
                }`}
              >
                {symptom}
              </button>
            );
          }
        )}
      </div>

      <div>
        <label
          htmlFor="custom-symptom"
          className="mb-xs block text-video-title font-medium text-text-secondary"
        >
          Add another symptom
        </label>

        <div className="flex gap-sm">
          <input
            id="custom-symptom"
            type="text"
            value={customSymptom}
            onChange={(event) =>
              setCustomSymptom(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                event.preventDefault();
                addCustomSymptom();
              }
            }}
            placeholder="Type a symptom"
            className="min-w-0 flex-1 rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-brand-primary"
          />

          <button
            type="button"
            onClick={addCustomSymptom}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-md bg-brand-primary text-on-brand transition hover:bg-brand-hover"
            aria-label="Add symptom"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {symptoms.length > 0 && (
        <div>
          <p className="mb-sm text-video-title font-medium text-text-secondary">
            Selected symptoms
          </p>

          <div className="flex flex-wrap gap-sm">
            {symptoms.map(
              (symptom) => (
                <span
                  key={symptom}
                  className="inline-flex items-center gap-xs rounded-corner-full bg-bg-faint px-md py-sm text-video-title text-text-primary"
                >
                  {symptom}

                  <button
                    type="button"
                    onClick={() =>
                      toggleSymptom(
                        symptom
                      )
                    }
                    aria-label={`Remove ${symptom}`}
                    className="text-text-secondary transition hover:text-danger"
                  >
                    <X size={12} />
                  </button>
                </span>
              )
            )}
          </div>
        </div>
      )}

      {symptoms.some(
        (symptom) =>
          symptom
            .toLowerCase()
            .includes(
              "chest pain"
            ) ||
          symptom
            .toLowerCase()
            .includes(
              "shortness of breath"
            )
      ) && (
        <div className="rounded-corner-md border border-danger bg-danger/10 p-md">
          <p className="text-video-title leading-5 text-danger">
            Some symptoms you selected can be serious.
            PhilaChatBot will perform an emergency safety
            check before showing general guidance.
          </p>
        </div>
      )}

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
          disabled={!canContinue}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
