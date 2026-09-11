import {
  Button,
  Badge,
} from "../AstraCompat.jsx";

import {
  ArrowLeft,
  Sparkles,
  Pencil,
  UserRound,
  Activity,
  Clock3,
  AlertTriangle,
  Pill,
  HeartPulse,
} from "lucide-react";

function displayDuration(assessment) {
  if (
    assessment.duration === "custom"
  ) {
    if (
      !assessment.customDurationValue
    ) {
      return "Not specified";
    }

    return `${assessment.customDurationValue} ${assessment.customDurationUnit}`;
  }

  return (
    assessment.duration ||
    "Not specified"
  );
}

export default function ReviewScreen({
  assessment,
  onEdit,
  onAnalyze,
  onBack,
}) {
  const sections = [
    {
      title: "Age",
      value:
        assessment.age ||
        "Not provided",
      icon: UserRound,
      editTarget: "age",
    },
    {
      title: "Symptoms",
      value:
        assessment.symptoms
          .length > 0
          ? assessment.symptoms.join(
              ", "
            )
          : "None selected",
      icon: Activity,
      editTarget: "symptoms",
    },
    {
      title: "Duration",
      value:
        displayDuration(
          assessment
        ),
      icon: Clock3,
      editTarget: "duration",
    },
    {
      title: "Allergies",
      value:
        assessment.allergies
          .length > 0
          ? assessment.allergies.join(
              ", "
            )
          : "No known allergies selected",
      icon: AlertTriangle,
      editTarget: "allergies",
    },
    {
      title: "Current medications",
      value:
        assessment.medications
          .length > 0
          ? assessment.medications.join(
              ", "
            )
          : "None selected",
      icon: Pill,
      editTarget: "medications",
    },
    {
      title: "Medical conditions",
      value:
        assessment.conditions
          .length > 0
          ? assessment.conditions.join(
              ", "
            )
          : "None selected",
      icon: HeartPulse,
      editTarget: "conditions",
    },
  ];

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <Badge
          label="Review"
          variant="default"
        />

        <h2 className="mt-md text-title text-text-primary">
          Review your information
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          Make sure everything is correct before
          PhilaChatBot prepares your health guidance.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border-secondary rounded-corner-lg border border-border-secondary bg-white">
        {sections.map((section) => {
          const Icon =
            section.icon;

          return (
            <div
              key={section.title}
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
                  {section.title}
                </p>

                <p className="mt-xs text-label-sm leading-5 text-text-primary">
                  {section.value}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onEdit(
                    section.editTarget
                  )
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-corner-md text-text-secondary transition hover:bg-bg-faint hover:text-brand-primary"
                aria-label={`Edit ${section.title}`}
              >
                <Pencil size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-corner-md bg-brand-tertiary/50 p-md">
        <p className="text-video-title leading-5 text-text-secondary">
          PhilaChatBot will first check for serious
          warning signs before preparing possible
          causes, medication guidance, and next steps.
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
          iconStart={
            <Sparkles size={15} />
          }
          onClick={onAnalyze}
          className="flex-1"
        >
          Analyze symptoms
        </Button>
      </div>
    </div>
  );
}
