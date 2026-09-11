import { Button } from "../AstraCompat.jsx";

import {
  ArrowLeft,
  ArrowRight,
  UserRound,
} from "lucide-react";

export default function AssessmentAge({
  assessment,
  onUpdate,
  onNext,
  onBack,
}) {
  const age = assessment.age || "";

  const numericAge = Number(age);

  const isValid =
    age !== "" &&
    numericAge >= 1 &&
    numericAge <= 120;

  const handleChange = (event) => {
    const value = event.target.value;

    if (
      value === "" ||
      /^\d{0,3}$/.test(value)
    ) {
      onUpdate({
        age: value,
      });
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
          <UserRound
            size={17}
            className="text-brand-primary"
          />
        </div>

        <h2 className="mt-lg text-title text-text-primary">
          How old are you?
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          Your age helps PhilaChatBot provide more
          appropriate general health guidance.
        </p>
      </div>

      <div>
        <label
          htmlFor="assessment-age"
          className="mb-xs block text-video-title font-medium text-text-secondary"
        >
          Age
        </label>

        <input
          id="assessment-age"
          type="number"
          min="1"
          max="120"
          inputMode="numeric"
          value={age}
          onChange={handleChange}
          placeholder="Enter your age"
          className="w-full rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-brand-primary"
        />

        {age !== "" && !isValid && (
          <p className="mt-xs text-video-title text-danger">
            Please enter an age between 1 and 120.
          </p>
        )}
      </div>

      <div className="rounded-corner-md bg-bg-faint p-md">
        <p className="text-video-title leading-5 text-text-secondary">
          PhilaChatBot uses this information only as part
          of your symptom assessment.
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
          disabled={!isValid}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
