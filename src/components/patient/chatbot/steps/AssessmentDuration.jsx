import { Button } from "../AstraCompat.jsx";

import {
  ArrowLeft,
  ArrowRight,
  Clock3,
} from "lucide-react";

const durationOptions = [
  "Less than 1 day",
  "1–2 days",
  "3–7 days",
  "1–2 weeks",
  "More than 2 weeks",
  "More than 1 month",
];

export default function AssessmentDuration({
  assessment,
  onUpdate,
  onNext,
  onBack,
}) {
  const duration =
    assessment.duration || "";

  const customDurationValue =
    assessment.customDurationValue || "";

  const customDurationUnit =
    assessment.customDurationUnit || "days";

  const selectDuration = (value) => {
    onUpdate({
      duration: value,
    });
  };

  const selectCustom = () => {
    onUpdate({
      duration: "custom",
    });
  };

  const canContinue =
    duration &&
    (duration !== "custom" ||
      Number(customDurationValue) > 0);

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
          <Clock3
            size={17}
            className="text-brand-primary"
          />
        </div>

        <h2 className="mt-lg text-title text-text-primary">
          How long have you had these symptoms?
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          Select the option that best describes how long
          your symptoms have been present.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-sm">
        {durationOptions.map((option) => {
          const selected =
            duration === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                selectDuration(option)
              }
              className={`rounded-corner-md border px-md py-md text-left text-label-sm transition ${
                selected
                  ? "border-brand-primary bg-brand-tertiary text-brand-primary"
                  : "border-border-secondary bg-surface-bg text-text-primary hover:border-brand-primary"
              }`}
            >
              {option}
            </button>
          );
        })}

        <button
          type="button"
          onClick={selectCustom}
          className={`rounded-corner-md border px-md py-md text-left text-label-sm transition ${
            duration === "custom"
              ? "border-brand-primary bg-brand-tertiary text-brand-primary"
              : "border-border-secondary bg-surface-bg text-text-primary hover:border-brand-primary"
          }`}
        >
          Enter a specific duration
        </button>
      </div>

      {duration === "custom" && (
        <div>
          <label
            htmlFor="custom-duration"
            className="mb-xs block text-video-title font-medium text-text-secondary"
          >
            Duration
          </label>

          <div className="flex gap-sm">
            <input
              id="custom-duration"
              type="number"
              min="1"
              inputMode="numeric"
              value={customDurationValue}
              onChange={(event) =>
                onUpdate({
                  customDurationValue:
                    event.target.value,
                })
              }
              placeholder="Enter number"
              className="min-w-0 flex-1 rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-brand-primary"
            />

            <select
              value={customDurationUnit}
              onChange={(event) =>
                onUpdate({
                  customDurationUnit:
                    event.target.value,
                })
              }
              className="rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
            >
              <option value="hours">
                Hours
              </option>

              <option value="days">
                Days
              </option>

              <option value="weeks">
                Weeks
              </option>

              <option value="months">
                Months
              </option>
            </select>
          </div>

          {customDurationValue &&
            Number(customDurationValue) <= 0 && (
              <p className="mt-xs text-video-title text-danger">
                Please enter a valid duration.
              </p>
            )}
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
