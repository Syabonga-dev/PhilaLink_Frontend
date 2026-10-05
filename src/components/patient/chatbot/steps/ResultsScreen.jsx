import {
  useTranslation,
} from "react-i18next";

import {
  Badge,
  Button,
} from "../AstraCompat.jsx";

import {
  Activity,
  AlertTriangle,
  Clock3,
  MessageCircle,
  RefreshCcw,
  Stethoscope,
} from "lucide-react";

import {
  getLanguageLocale,
} from "../../../../i18n/languages.js";

import {
  translateAssessmentValue,
  translateKnownServerText,
} from "../../../../i18n/patientText.js";

function getResultMeta(
  result,
  t
) {
  switch (
    result
  ) {
    case "Emergency":
      return {
        label:
          t(
            "chatbot.emergency"
          ),
        variant:
          "danger",
      };

    case "Urgent":
      return {
        label:
          t(
            "chatbot.urgent"
          ),
        variant:
          "warning",
      };

    case "NonEmergency":
      return {
        label:
          t(
            "chatbot.nonEmergency"
          ),
        variant:
          "success",
      };

    default:
      return {
        label:
          result ||
          t(
            "chatbot.assessmentComplete"
          ),

        variant:
          "default",
      };
  }
}

function formatDate(
  value,
  locale
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  try {
    return date
      .toLocaleString(
        locale
      );
  } catch {
    return date
      .toLocaleString(
        "en-ZA"
      );
  }
}

export default function ResultsScreen({
  assessment,
  assessmentResult,
  onFollowUp,
  onRestart,
}) {
  const {
    t,
    i18n,
  } =
    useTranslation();

  const locale =
    getLanguageLocale(
      i18n.resolvedLanguage ||
        i18n.language
    );

  const result =
    assessmentResult
      ?.result;

  const recommendation =
    translateKnownServerText(
      assessmentResult
        ?.recommendation
    );

  const meta =
    getResultMeta(
      result,
      t
    );

  const symptoms =
    Array.isArray(
      assessment
        ?.symptoms
    ) &&
    assessment
      .symptoms
      .length >
      0
      ? assessment
          .symptoms
          .map(
            symptom =>
              translateAssessmentValue(
                "symptom",
                symptom
              )
          )
          .join(", ")
      : "—";

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <Badge
          label={
            meta.label
          }
          variant={
            meta.variant
          }
        />

        <h2 className="mt-md text-title text-text-primary">
          {t(
            "chatbot.healthAssessment"
          )}
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.healthAssessmentDescription"
          )}
        </p>
      </div>

      <section className="rounded-corner-lg border border-border-secondary bg-white p-lg">
        <div className="flex items-center gap-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
            <Activity
              size={17}
              className="text-brand-primary"
            />
          </div>

          <div>
            <p className="text-video-title text-text-secondary">
              {t(
                "chatbot.triageResult"
              )}
            </p>

            <p className="text-label-sm font-semibold text-text-primary">
              {meta.label}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-md flex items-center gap-sm">
          <Stethoscope
            size={17}
            className="text-brand-primary"
          />

          <h3 className="text-label font-semibold text-text-primary">
            {t(
              "chatbot.recommendation"
            )}
          </h3>
        </div>

        <div className="rounded-corner-lg border border-border-secondary bg-white p-lg">
          <p className="text-label-sm leading-6 text-text-primary">
            {recommendation ||
              t(
                "chatbot.noRecommendation"
              )}
          </p>
        </div>
      </section>

      <section>
        <div className="mb-md flex items-center gap-sm">
          <Activity
            size={17}
            className="text-brand-primary"
          />

          <h3 className="text-label font-semibold text-text-primary">
            {t(
              "chatbot.symptomsSubmitted"
            )}
          </h3>
        </div>

        <div className="rounded-corner-lg bg-bg-faint p-lg">
          <p className="text-label-sm leading-6 text-text-secondary">
            {symptoms}
          </p>
        </div>
      </section>

      <div className="flex items-start gap-sm rounded-corner-md bg-bg-faint p-md">
        <Clock3
          size={15}
          className="mt-[2px] shrink-0 text-text-secondary"
        />

        <p className="text-video-title leading-5 text-text-secondary">
          {t(
            "chatbot.recorded",
            {
              date:
                formatDate(
                  assessmentResult
                    ?.createdAt,
                  locale
                ),
            }
          )}
        </p>
      </div>

      {result ===
        "Emergency" && (
        <div className="rounded-corner-md bg-danger/10 p-md">
          <div className="flex items-start gap-sm">
            <AlertTriangle
              size={17}
              className="mt-[2px] shrink-0 text-danger"
            />

            <p className="text-label-sm font-medium leading-6 text-danger">
              {t(
                "chatbot.emergencyFollow"
              )}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-md">
        <Button
          variant="primary"
          iconStart={
            <MessageCircle
              size={15}
            />
          }
          onClick={
            onFollowUp
          }
          className="w-full"
        >
          {t(
            "chatbot.followUp"
          )}
        </Button>

        <Button
          variant="subtle"
          iconStart={
            <RefreshCcw
              size={15}
            />
          }
          onClick={
            onRestart
          }
          className="w-full"
        >
          {t(
            "chatbot.anotherAssessment"
          )}
        </Button>
      </div>
    </div>
  );
}
