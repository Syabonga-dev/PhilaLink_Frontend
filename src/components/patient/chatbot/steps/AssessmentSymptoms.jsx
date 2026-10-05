import {
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import {
  Button,
} from "../AstraCompat.jsx";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

import {
  translateAssessmentValue,
} from "../../../../i18n/patientText.js";

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
  const {
    t,
  } =
    useTranslation();

  const [
    customSymptom,
    setCustomSymptom,
  ] =
    useState("");

  const symptoms =
    assessment.symptoms ||
    [];

  const toggleSymptom =
    symptom => {
      if (
        symptoms.includes(
          symptom
        )
      ) {
        onUpdate({
          symptoms:
            symptoms.filter(
              item =>
                item !==
                symptom
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

  const addCustomSymptom =
    () => {
      const value =
        customSymptom
          .trim();

      if (!value) {
        return;
      }

      const alreadyExists =
        symptoms.some(
          item =>
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

      setCustomSymptom(
        ""
      );
    };

  const canContinue =
    symptoms.length >
    0;

  const hasHighRisk =
    symptoms.some(
      symptom => {
        const value =
          symptom
            .toLowerCase();

        return (
          value.includes(
            "chest pain"
          ) ||
          value.includes(
            "shortness of breath"
          )
        );
      }
    );

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
          {t(
            "chatbot.symptomsTitle"
          )}
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.symptomsDescription"
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-sm">
        {commonSymptoms.map(
          symptom => {
            const selected =
              symptoms.includes(
                symptom
              );

            return (
              <button
                key={
                  symptom
                }
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
                {translateAssessmentValue(
                  "symptom",
                  symptom
                )}
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
          {t(
            "chatbot.addSymptom"
          )}
        </label>

        <div className="flex gap-sm">
          <input
            id="custom-symptom"
            type="text"
            value={
              customSymptom
            }
            onChange={
              event =>
                setCustomSymptom(
                  event
                    .target
                    .value
                )
            }
            onKeyDown={
              event => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  event
                    .preventDefault();

                  addCustomSymptom();
                }
              }
            }
            placeholder={t(
              "chatbot.symptomPlaceholder"
            )}
            className="min-w-0 flex-1 rounded-corner-md border border-border-secondary bg-surface-bg px-md py-sm text-label-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-brand-primary"
          />

          <button
            type="button"
            onClick={
              addCustomSymptom
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-md bg-brand-primary text-on-brand transition hover:bg-brand-hover"
            aria-label={t(
              "chatbot.addSymptomAria"
            )}
          >
            <Plus
              size={16}
            />
          </button>
        </div>
      </div>

      {symptoms.length >
        0 && (
        <div>
          <p className="mb-sm text-video-title font-medium text-text-secondary">
            {t(
              "chatbot.selectedSymptoms"
            )}
          </p>

          <div className="flex flex-wrap gap-sm">
            {symptoms.map(
              symptom => (
                <span
                  key={
                    symptom
                  }
                  className="inline-flex items-center gap-xs rounded-corner-full bg-bg-faint px-md py-sm text-video-title text-text-primary"
                >
                  {translateAssessmentValue(
                    "symptom",
                    symptom
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      toggleSymptom(
                        symptom
                      )
                    }
                    aria-label={t(
                      "chatbot.removeSymptom",
                      {
                        item:
                          translateAssessmentValue(
                            "symptom",
                            symptom
                          ),
                      }
                    )}
                    className="text-text-secondary transition hover:text-danger"
                  >
                    <X
                      size={12}
                    />
                  </button>
                </span>
              )
            )}
          </div>
        </div>
      )}

      {hasHighRisk && (
        <div className="rounded-corner-md border border-danger bg-danger/10 p-md">
          <p className="text-video-title leading-5 text-danger">
            {t(
              "chatbot.seriousSymptoms"
            )}
          </p>
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
