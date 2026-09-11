import { useState } from "react";

import {
  Button,
  Input,
} from "../AstraCompat.jsx";

import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Plus,
  X,
} from "lucide-react";

const commonConditions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "High cholesterol",
  "Heart disease",
  "Kidney disease",
  "Epilepsy",
];

export default function AssessmentConditions({
  assessment,
  onUpdate,
  onNext,
  onBack,
}) {
  const [customCondition, setCustomCondition] =
    useState("");

  const conditions =
    assessment.conditions || [];

  const toggleCondition = (condition) => {
    if (
      conditions.includes(
        condition
      )
    ) {
      onUpdate({
        conditions:
          conditions.filter(
            (item) =>
              item !== condition
          ),
      });

      return;
    }

    onUpdate({
      conditions: [
        ...conditions,
        condition,
      ],
    });
  };

  const addCondition = () => {
    const value =
      customCondition.trim();

    if (!value) {
      return;
    }

    const exists =
      conditions.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );

    if (!exists) {
      onUpdate({
        conditions: [
          ...conditions,
          value,
        ],
      });
    }

    setCustomCondition("");
  };

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
          <HeartPulse
            size={17}
            className="text-brand-primary"
          />
        </div>

        <h2 className="mt-lg text-title text-text-primary">
          Do you have any existing medical conditions?
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          This step is optional, but it can help make
          the assessment more relevant.
        </p>
      </div>

      <div className="flex flex-wrap gap-sm">
        {commonConditions.map(
          (condition) => {
            const selected =
              conditions.includes(
                condition
              );

            return (
              <button
                key={condition}
                type="button"
                onClick={() =>
                  toggleCondition(
                    condition
                  )
                }
                className={`rounded-corner-full border px-md py-sm text-label-sm font-medium transition ${
                  selected
                    ? "border-brand-primary bg-brand-tertiary text-brand-primary"
                    : "border-border-secondary bg-white text-text-secondary hover:border-brand-primary hover:text-text-primary"
                }`}
              >
                {condition}
              </button>
            );
          }
        )}
      </div>

      <div>
        <label
          htmlFor="custom-condition"
          className="mb-xs block text-video-title font-medium text-text-secondary"
        >
          Add another condition
        </label>

        <div className="flex gap-sm">
          <Input
            id="custom-condition"
            value={customCondition}
            onChange={(event) =>
              setCustomCondition(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                "Enter"
              ) {
                event.preventDefault();
                addCondition();
              }
            }}
            placeholder="Condition name"
          />

          <button
            type="button"
            onClick={addCondition}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-md bg-brand-primary text-white"
            aria-label="Add condition"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {conditions.length > 0 && (
        <div>
          <p className="mb-sm text-video-title font-medium text-text-secondary">
            Selected conditions
          </p>

          <div className="flex flex-wrap gap-sm">
            {conditions.map(
              (condition) => (
                <span
                  key={condition}
                  className="inline-flex items-center gap-xs rounded-corner-full bg-bg-faint px-md py-sm text-video-title text-text-primary"
                >
                  {condition}

                  <button
                    type="button"
                    onClick={() =>
                      toggleCondition(
                        condition
                      )
                    }
                    aria-label={`Remove ${condition}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              )
            )}
          </div>
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
          className="flex-1"
        >
          Review
        </Button>
      </div>
    </div>
  );
}
