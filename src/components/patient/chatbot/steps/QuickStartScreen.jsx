import {
  Activity,
  AlertTriangle,
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
    action: "chat",
    prompt: "",
  },
  {
    title: "Check my symptoms",
    description:
      "Start a guided health assessment.",
    icon: Activity,
    action: "assessment",
    prompt: "",
  },
  {
    title: "My medications",
    description:
      "Ask about your medications, their general use, and your remaining supply.",
    icon: Pill,
    action: "chat",
    prompt:
      "Tell me about the medications recorded in my PhilaLink profile and how much medication supply I have left.",
  },
  {
    title: "My allergies",
    description:
      "Ask about allergy information recorded in your profile.",
    icon: ShieldCheck,
    action: "chat",
    prompt:
      "What allergies are recorded in my PhilaLink profile, and what general information should I keep in mind about them?",
  },
  {
    title: "When should I seek help?",
    description:
      "Ask about warning signs and when urgent or emergency care may be needed.",
    icon: AlertTriangle,
    action: "chat",
    prompt:
      "What warning signs should make someone seek urgent or emergency medical help?",
  },
];

export default function QuickStartScreen({
  onStartAssessment,
  onOpenChat,
}) {
  const handleClick = (
    option
  ) => {
    if (
      option.action ===
      "assessment"
    ) {
      onStartAssessment();
      return;
    }

    onOpenChat(
      option.prompt
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
                    option
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