import {
  useTranslation,
} from "react-i18next";

import {
  Button,
} from "../AstraCompat.jsx";

import {
  ArrowLeft,
  ArrowRight,
  Clock3,
} from "lucide-react";

import {
  translateAssessmentValue,
} from "../../../../i18n/patientText.js";

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
  const {
    t,
  } =
    useTranslation();

  const duration =
    assessment.duration ||
    "";

  const customDurationValue =
    assessment
      .customDurationValue ||
    "";

  const customDurationUnit =
    assessment
      .customDurationUnit ||
    "days";

  const canContinue =
    duration &&
    (
      duration !==
        "custom" ||
      Number(
        customDurationValue
      ) > 0
    );

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
          {t(
            "chatbot.durationTitle"
          )}
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.durationDescription"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-sm">
        {durationOptions.map(
          option => {
            const selected =
              duration ===
              option;

            return (
              <button
                key={
                  option
                }
                type="button"
                onClick={() =>
                  onUpdate({
                    duration:
                      option,
                  })
                }
                className={`rounded-corner-md border px-md py-md text-left text-label-sm transition ${
                  selected
                    ? "border-brand-primary bg-brand-tertiary text-brand-primary"
                    : "border-border-secondary bg-surface-bg text-text-primary hover:border-brand-primary"
                }`}
              >
                {translateAssessmentValue(
                  "duration",
                  option
                )}
              </button>
            );
          }
        )}

        <button
          type="button"
          onClick={() =>
            onUpdate({
              duration:
                "custom",
            })
          }
          className={`rounded-corner-md border px-md py-md text-left text-label-sm transition ${
            duration ===
            "custom"
              ? "border-brand-primary bg-brand-tertiary text-brand-primary"
              : "border-border-secondary bg-surface-bg text-text-primary hover:border-brand-primary"
          }`}
        >
          {t(
            "chatbot.specificDuration"
          )}
        </button>
      </div>

      {duration ===
        "custom" && (
        <div>
          <label
            htmlFor="custom-duration"
            className="mb-xs block text-video-title font-medium text-text-secondary"
          >
            {t(
              "chatbot.duration"
            )}
          </label>

          <div className="flex gap-sm">
            <input
              id="custom-duration"
              type="number"
              min="1"
              inputMode="numeric"
              value={
                customDurationValue
              }
              onChange={
                event =>
                  onUpdate({
                    customDurationValue:
                      event
                        .target
                        .value,
                  })
              }
              placeholder={t(
                "chatbot.enterNumber"
              )}
              className="min-w-0 flex-1 rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-brand-primary"
            />

            <select
              value={
                customDurationUnit
              }
              onChange={
                event =>
                  onUpdate({
                    customDurationUnit:
                      event
                        .target
                        .value,
                  })
              }
              className="rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
            >
              {[
                "hours",
                "days",
                "weeks",
                "months",
              ].map(
                unit => (
                  <option
                    key={
                      unit
                    }
                    value={
                      unit
                    }
                  >
                    {translateAssessmentValue(
                      "durationUnit",
                      unit
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          {customDurationValue &&
            Number(
              customDurationValue
            ) <= 0 && (
              <p className="mt-xs text-video-title text-danger">
                {t(
                  "chatbot.invalidDuration"
                )}
              </p>
            )}
        </div>
      )}

      <div className="flex gap-md">
        <Button
          variant="subtle"
          iconStart={
            <ArrowLeft
              size={15}
            />
          }
          onClick={
            onBack
          }
          className="flex-1"
        >
          {t(
            "chatbot.back"
          )}
        </Button>

        <Button
          variant="primary"
          iconEnd={
            <ArrowRight
              size={15}
            />
          }
          onClick={
            onNext
          }
          disabled={
            !canContinue
          }
          className="flex-1"
        >
          {t(
            "chatbot.continue"
          )}
        </Button>
      </div>
    </div>
  );
}
