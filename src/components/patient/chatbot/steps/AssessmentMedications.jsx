import {
  useEffect,
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
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Pill,
  Plus,
  X,
} from "lucide-react";

import {
  medicationsApi,
} from "../../../../services/api/medications.js";

function medicationLabel(
  medication
) {
  return [
    medication?.name,
    medication?.dosage,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export default function AssessmentMedications({
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
    customMedication,
    setCustomMedication,
  ] =
    useState("");

  const [
    profileMedications,
    setProfileMedications,
  ] =
    useState([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    loadError,
    setLoadError,
  ] =
    useState("");

  const medications =
    assessment.medications ||
    [];

  useEffect(
    () => {
      let cancelled =
        false;

      async function load() {
        try {
          setLoading(
            true
          );

          setLoadError("");

          const result =
            await medicationsApi
              .getMine();

          if (cancelled) {
            return;
          }

          const values =
            (
              Array.isArray(
                result
              )
                ? result
                : []
            )
              .filter(
                medication =>
                  medication
                    ?.isActive !==
                  false
              )
              .map(
                medicationLabel
              )
              .filter(
                Boolean
              )
              .filter(
                (
                  value,
                  index,
                  array
                ) =>
                  array.indexOf(
                    value
                  ) ===
                  index
              );

          setProfileMedications(
            values
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to load patient medications for assessment:",
            error
          );

          if (!cancelled) {
            setProfileMedications(
              []
            );

            setLoadError(
              t(
                "chatbot.medicationLoadError"
              )
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(
              false
            );
          }
        }
      }

      void load();

      return () => {
        cancelled =
          true;
      };
    },
    [
      t,
    ]
  );

  const toggleMedication =
    medication => {
      if (
        medications.includes(
          medication
        )
      ) {
        onUpdate({
          medications:
            medications.filter(
              item =>
                item !==
                medication
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

  const addMedication =
    () => {
      const value =
        customMedication
          .trim();

      if (!value) {
        return;
      }

      const exists =
        medications.some(
          item =>
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

      setCustomMedication(
        ""
      );
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
          {t(
            "chatbot.medicationsTitle"
          )}
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.medicationsDescription"
          )}
        </p>
      </div>

      <div>
        <p className="mb-sm text-video-title font-medium text-text-secondary">
          {t(
            "chatbot.yourMedications"
          )}
        </p>

        {loading ? (
          <div className="flex items-center gap-sm rounded-corner-md bg-bg-faint p-md text-video-title text-text-secondary">
            <LoaderCircle
              size={15}
              className="animate-spin"
            />

            {t(
              "chatbot.loadingMedications"
            )}
          </div>
        ) : profileMedications
            .length >
          0 ? (
          <div className="grid grid-cols-1 gap-sm">
            {profileMedications.map(
              medication => {
                const selected =
                  medications.includes(
                    medication
                  );

                return (
                  <button
                    key={
                      medication
                    }
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
                        {t(
                          "chatbot.selected"
                        )}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>
        ) : (
          <p className="rounded-corner-md bg-bg-faint p-md text-video-title leading-5 text-text-secondary">
            {t(
              "chatbot.noProfileMedications"
            )}
          </p>
        )}

        {loadError && (
          <p className="mt-sm text-video-title leading-5 text-warning">
            {loadError}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="custom-medication"
          className="mb-xs block text-video-title font-medium text-text-secondary"
        >
          {t(
            "chatbot.addMedication"
          )}
        </label>

        <div className="flex gap-sm">
          <Input
            id="custom-medication"
            value={
              customMedication
            }
            onChange={
              event =>
                setCustomMedication(
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

                  addMedication();
                }
              }
            }
            placeholder={t(
              "chatbot.medicationPlaceholder"
            )}
          />

          <button
            type="button"
            onClick={
              addMedication
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-md bg-brand-primary text-white"
            aria-label={t(
              "chatbot.addMedicationAria"
            )}
          >
            <Plus
              size={16}
            />
          </button>
        </div>
      </div>

      {medications.length >
        0 && (
        <div>
          <p className="mb-sm text-video-title font-medium text-text-secondary">
            {t(
              "chatbot.selectedMedications"
            )}
          </p>

          <div className="flex flex-wrap gap-sm">
            {medications.map(
              medication => (
                <span
                  key={
                    medication
                  }
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
                    aria-label={t(
                      "chatbot.removeMedication",
                      {
                        item:
                          medication,
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
            "chatbot.noMedicationNote"
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
