import {
  useTranslation,
} from "react-i18next";

import {
  Button,
} from "../AstraCompat.jsx";

import {
  Bot,
  ShieldCheck,
} from "lucide-react";

export default function WelcomeScreen({
  onAccept,
}) {
  const {
    t,
  } =
    useTranslation();

  return (
    <div className="flex flex-col gap-xl">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-corner-full bg-brand-tertiary">
          <Bot
            size={28}
            className="text-brand-primary"
          />
        </div>

        <h2 className="mt-lg text-title text-text-primary">
          {t(
            "chatbot.welcomeTitle"
          )}
        </h2>

        <p className="mt-sm text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.welcomeBody"
          )}
        </p>
      </div>

      <div className="rounded-corner-lg border border-border-secondary bg-bg-faint p-lg">
        <div className="flex items-start gap-md">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-corner-full bg-brand-tertiary">
            <ShieldCheck
              size={16}
              className="text-brand-primary"
            />
          </div>

          <div>
            <p className="text-label-sm font-semibold text-text-primary">
              {t(
                "chatbot.disclaimerTitle"
              )}
            </p>

            <p className="mt-xs text-video-title leading-5 text-text-secondary">
              {t(
                "chatbot.disclaimerBody"
              )}
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={
          onAccept
        }
        className="w-full"
      >
        {t(
          "chatbot.understandContinue"
        )}
      </Button>
    </div>
  );
}
