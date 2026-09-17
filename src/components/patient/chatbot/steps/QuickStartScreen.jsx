import {
  Activity,
  AlertTriangle,
  HeartPulse,
  MessageCircle,
  Pill,
  ShieldCheck,
} from "lucide-react";

const options = [
  {
    title: "Chat with Phila",
    description:
      "Ask a health question or talk about your PhilaLink information.",
    icon: MessageCircle,
    action: "followup",
  },
  {
    title: "Check my symptoms",
    description:
      "Start a guided health assessment.",
    icon: Activity,
    action: "assessment",
  },
  {
    title: "Medication information",
    description:
      "Learn about your medication and general use.",
    icon: Pill,
    action: "followup",
  },
  {
    title: "My allergies",
    description:
      "Ask about allergy information linked to your profile.",
    icon: ShieldCheck,
    action: "followup",
  },
  {
    title: "My medications",
    description:
      "Ask about medications linked to your profile.",
    icon: HeartPulse,
    action: "followup",
  },
  {
    title: "When should I seek help?",
    description:
      "Learn about serious warning signs.",
    icon: AlertTriangle,
    action: "emergency",
  },
];

export default function QuickStartScreen({
  onStartAssessment,
  onSelectOption,
}) {
  const handleClick = (
    action
  ) => {
    if (
      action ===
      "assessment"
    ) {
      onStartAssessment();
      return;
    }

    onSelectOption(
      action
    );
  };

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="text-title text-text-primary">
          How can I help?
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          Chat freely with
          Phila or start a
          guided symptom
          assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-md">
        {options.map(
          (option) => {
            const Icon =
              option.icon;

            return (
              <button
                key={
                  option.title
                }
                type="button"
                onClick={() =>
                  handleClick(
                    option.action
                  )
                }
                className="flex items-start gap-md rounded-corner-lg border border-border-secondary bg-white p-lg text-left transition hover:border-brand-primary hover:bg-brand-tertiary/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-full bg-brand-tertiary">
                  <Icon
                    size={17}
                    className="text-brand-primary"
                  />
                </div>

                <div>
                  <p className="text-label-sm font-semibold text-text-primary">
                    {
                      option.title
                    }
                  </p>

                  <p className="mt-xs text-video-title leading-5 text-text-secondary">
                    {
                      option.description
                    }
                  </p>
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}