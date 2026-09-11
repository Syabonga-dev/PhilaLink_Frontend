import { Button } from "../AstraCompat.jsx";

import {
  Bot,
  ShieldCheck,
} from "lucide-react";

export default function WelcomeScreen({
  onAccept,
}) {
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
          Hi, I'm PhilaChatBot
        </h2>

        <p className="mt-sm text-label-sm leading-6 text-text-secondary">
          Your AI health assistant from PhilaLink. I can
          help you understand your symptoms, check
          medication information, and provide general
          health guidance.
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
              Important disclaimer
            </p>

            <p className="mt-xs text-video-title leading-5 text-text-secondary">
              PhilaChatBot provides general health
              information and does not replace a doctor,
              nurse, pharmacist, or other healthcare
              professional. Always seek professional
              medical advice for any health concerns.
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={onAccept}
        className="w-full"
      >
        I understand — continue
      </Button>
    </div>
  );
}
