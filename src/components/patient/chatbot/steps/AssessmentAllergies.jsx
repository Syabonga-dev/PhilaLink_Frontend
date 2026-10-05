import {
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import {
  Button,
  Input,
} from "../AstraCompat.jsx";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

import {
  translateAssessmentValue,
} from "../../../../i18n/patientText.js";

const commonAllergies = [
  "Penicillin",
  "Ibuprofen",
  "Aspirin",
  "Sulfonamides",
  "Peanuts",
  "Shellfish",
  "Latex",
];

export default function AssessmentAllergies({
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
    customAllergy,
    setCustomAllergy,
  ] =
    useState("");

  const allergies =
    assessment.allergies ||
    [];

  const toggleAllergy =
    allergy => {
      if (
        allergies.includes(
          allergy
        )
      ) {
        onUpdate({
          allergies:
            allergies.filter(
              item =>
                item !==
                allergy
            ),
        });

        return;
      }

      onUpdate({
        allergies: [
          ...allergies,
          allergy,
        ],
      });
    };

  const addCustomAllergy =
    () => {
      const value =
        customAllergy
          .trim();

      if (!value) {
        return;
      }

      const exists =
        allergies.some(
          item =>
            item.toLowerCase() ===
            value.toLowerCase()
        );

      if (!exists) {
        onUpdate({
          allergies: [
            ...allergies,
            value,
          ],
        });
      }

      setCustomAllergy(
        ""
      );
    };

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-warning/10">
          <AlertTriangle
            size={17}
            className="text-warning"
          />
        </div>

        <h2 className="mt-lg text-title text-text-primary">
          {t(
            "chatbot.allergiesTitle"
          )}
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.allergiesDescription"
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-sm">
        {commonAllergies.map(
          allergy => {
            const selected =
              allergies.includes(
                allergy
              );

            return (
              <button
                key={
                  allergy
                }
                type="button"
                onClick={() =>
                  toggleAllergy(
                    allergy
                  )
                }
                className={`rounded-corner-full border px-md py-sm text-label-sm font-medium transition ${
                  selected
                    ? "border-warning bg-warning/10 text-warning"
                    : "border-border-secondary bg-white text-text-secondary hover:border-warning hover:text-text-primary"
                }`}
              >
                {translateAssessmentValue(
                  "allergy",
                  allergy
                )}
              </button>
            );
          }
        )}
      </div>

      <div>
        <label
          htmlFor="custom-allergy"
          className="mb-xs block text-video-title font-medium text-text-secondary"
        >
          {t(
            "chatbot.addAllergy"
          )}
        </label>

        <div className="flex gap-sm">
          <Input
            id="custom-allergy"
            value={
              customAllergy
            }
            onChange={
              event =>
                setCustomAllergy(
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

                  addCustomAllergy();
                }
              }
            }
            placeholder={t(
              "chatbot.allergyPlaceholder"
            )}
          />

          <button
            type="button"
            onClick={
              addCustomAllergy
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-md bg-brand-primary text-white"
            aria-label={t(
              "chatbot.addAllergyAria"
            )}
          >
            <Plus
              size={16}
            />
          </button>
        </div>
      </div>

      {allergies.length >
        0 && (
        <div>
          <p className="mb-sm text-video-title font-medium text-text-secondary">
            {t(
              "chatbot.selectedAllergies"
            )}
          </p>

          <div className="flex flex-wrap gap-sm">
            {allergies.map(
              allergy => (
                <span
                  key={
                    allergy
                  }
                  className="inline-flex items-center gap-xs rounded-corner-full bg-warning/10 px-md py-sm text-video-title text-warning"
                >
                  {translateAssessmentValue(
                    "allergy",
                    allergy
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      toggleAllergy(
                        allergy
                      )
                    }
                    aria-label={t(
                      "chatbot.removeAllergy",
                      {
                        item:
                          translateAssessmentValue(
                            "allergy",
                            allergy
                          ),
                      }
                    )}
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

      <div className="rounded-corner-md bg-bg-faint p-md">
        <p className="text-video-title leading-5 text-text-secondary">
          {t(
            "chatbot.noAllergiesNote"
          )}
        </p>
      </div>

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
