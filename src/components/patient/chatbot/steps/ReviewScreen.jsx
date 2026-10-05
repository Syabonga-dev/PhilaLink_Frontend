import {
  useTranslation,
} from "react-i18next";

import {
  Button,
  Badge,
} from "../AstraCompat.jsx";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Clock3,
  HeartPulse,
  Pencil,
  Pill,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  translateAssessmentValue,
} from "../../../../i18n/patientText.js";

function displayDuration(
  assessment,
  t
) {
  if (
    assessment.duration ===
    "custom"
  ) {
    if (
      !assessment
        .customDurationValue
    ) {
      return t(
        "chatbot.notSpecified"
      );
    }

    return `${
      assessment
        .customDurationValue
    } ${translateAssessmentValue(
      "durationUnit",
      assessment
        .customDurationUnit
    )}`;
  }

  return assessment.duration
    ? translateAssessmentValue(
        "duration",
        assessment.duration
      )
    : t(
        "chatbot.notSpecified"
      );
}

function displayList(
  items,
  category,
  fallback
) {
  return Array.isArray(
    items
  ) &&
    items.length >
      0
    ? items
        .map(
          value =>
            translateAssessmentValue(
              category,
              value
            )
        )
        .join(", ")
    : fallback;
}

export default function ReviewScreen({
  assessment,
  onEdit,
  onAnalyze,
  onBack,
}) {
  const {
    t,
  } =
    useTranslation();

  const sections = [
    {
      title:
        t(
          "chatbot.fields.age"
        ),

      value:
        assessment.age ||
        t(
          "chatbot.notProvided"
        ),

      icon:
        UserRound,

      editTarget:
        "age",
    },

    {
      title:
        t(
          "chatbot.fields.symptoms"
        ),

      value:
        displayList(
          assessment
            .symptoms,
          "symptom",
          t(
            "chatbot.noneSelected"
          )
        ),

      icon: Activity,

      editTarget:
        "symptoms",
    },

    {
      title:
        t(
          "chatbot.fields.duration"
        ),

      value:
        displayDuration(
          assessment,
          t
        ),

      icon: Clock3,

      editTarget:
        "duration",
    },

    {
      title:
        t(
          "chatbot.fields.allergies"
        ),

      value:
        displayList(
          assessment
            .allergies,
          "allergy",
          t(
            "chatbot.noKnownAllergies"
          )
        ),

      icon:
        AlertTriangle,

      editTarget:
        "allergies",
    },

    {
      title:
        t(
          "chatbot.fields.medications"
        ),

      value:
        displayList(
          assessment
            .medications,
          "medication",
          t(
            "chatbot.noneSelected"
          )
        ),

      icon: Pill,

      editTarget:
        "medications",
    },

    {
      title:
        t(
          "chatbot.fields.conditions"
        ),

      value:
        displayList(
          assessment
            .conditions,
          "condition",
          t(
            "chatbot.noneSelected"
          )
        ),

      icon:
        HeartPulse,

      editTarget:
        "conditions",
    },
  ];

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <Badge
          label={t(
            "chatbot.reviewBadge"
          )}
          variant="default"
        />

        <h2 className="mt-md text-title text-text-primary">
          {t(
            "chatbot.reviewTitle"
          )}
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.reviewDescription"
          )}
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border-secondary rounded-corner-lg border border-border-secondary bg-white">
        {sections.map(
          section => {
            const Icon =
              section.icon;

            return (
              <div
                key={
                  section
                    .editTarget
                }
                className="flex items-start gap-md p-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-corner-full bg-bg-faint">
                  <Icon
                    size={15}
                    className="text-text-secondary"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-video-title font-medium text-text-tertiary">
                    {
                      section.title
                    }
                  </p>

                  <p className="mt-xs text-label-sm leading-5 text-text-primary">
                    {
                      section.value
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onEdit(
                      section
                        .editTarget
                    )
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-corner-md text-text-secondary transition hover:bg-bg-faint hover:text-brand-primary"
                  aria-label={t(
                    "chatbot.edit",
                    {
                      item:
                        section
                          .title,
                    }
                  )}
                >
                  <Pencil
                    size={14}
                  />
                </button>
              </div>
            );
          }
        )}
      </div>

      <div className="rounded-corner-md bg-brand-tertiary/50 p-md">
        <p className="text-video-title leading-5 text-text-secondary">
          {t(
            "chatbot.reviewSafety"
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
          iconStart={
            <Sparkles
              size={15}
            />
          }
          onClick={
            onAnalyze
          }
          className="flex-1"
        >
          {t(
            "chatbot.analyzeSymptoms"
          )}
        </Button>
      </div>
    </div>
  );
}
