import {
  useTranslation,
} from "react-i18next";

import {
  Activity,
  AlertTriangle,
  MessageCircle,
  Pill,
  ShieldCheck,
} from "lucide-react";

export default function QuickStartScreen({
  onStartAssessment,
  onOpenChat,
}) {
  const {
    t,
  } =
    useTranslation();

  const options = [
    {
      title:
        t(
          "chatbot.quickChatTitle"
        ),

      description:
        t(
          "chatbot.quickChatDescription"
        ),

      icon:
        MessageCircle,

      action: "chat",

      prompt: "",
    },

    {
      title:
        t(
          "chatbot.quickSymptomsTitle"
        ),

      description:
        t(
          "chatbot.quickSymptomsDescription"
        ),

      icon:
        Activity,

      action:
        "assessment",

      prompt: "",
    },

    {
      title:
        t(
          "chatbot.quickMedicationsTitle"
        ),

      description:
        t(
          "chatbot.quickMedicationsDescription"
        ),

      icon: Pill,

      action: "chat",

      prompt:
        t(
          "chatbot.quickMedicationsPrompt"
        ),
    },

    {
      title:
        t(
          "chatbot.quickAllergiesTitle"
        ),

      description:
        t(
          "chatbot.quickAllergiesDescription"
        ),

      icon:
        ShieldCheck,

      action: "chat",

      prompt:
        t(
          "chatbot.quickAllergiesPrompt"
        ),
    },

    {
      title:
        t(
          "chatbot.quickHelpTitle"
        ),

      description:
        t(
          "chatbot.quickHelpDescription"
        ),

      icon:
        AlertTriangle,

      action: "chat",

      prompt:
        t(
          "chatbot.quickHelpPrompt"
        ),
    },
  ];

  const handleClick =
    option => {
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
          {t(
            "chatbot.howCanHelp"
          )}
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.quickStartBody"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-md">
        {options.map(
          option => {
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
