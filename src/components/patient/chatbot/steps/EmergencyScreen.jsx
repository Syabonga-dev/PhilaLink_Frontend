import { Button } from "../AstraCompat.jsx";

import {
  AlertTriangle,
  HeartPulse,
  PhoneCall,
  RefreshCcw,
} from "lucide-react";

export default function EmergencyScreen({
  assessmentResult,
  onContinue,
  onRestart,
}) {
  const recommendation =
    assessmentResult
      ?.recommendation ||
    "Your symptoms may require immediate medical attention. Please seek emergency medical help now or go to the nearest emergency facility. Do not rely on PhilaLink for emergency treatment.";

  return (
    <div className="flex flex-col gap-xl">
      <div className="rounded-corner-lg border border-danger/30 bg-danger/5 p-lg">
        <div className="flex items-start gap-md">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-corner-full bg-danger/10">
            <AlertTriangle
              size={20}
              className="text-danger"
            />
          </div>

          <div>
            <p className="text-video-title font-semibold uppercase tracking-wide text-danger">
              Emergency
            </p>

            <h2 className="mt-xs text-title text-danger">
              Seek emergency medical attention now
            </h2>

            <p className="mt-sm text-label-sm leading-6 text-text-secondary">
              One or more of the symptoms you submitted
              matched a serious warning sign. PhilaChatBot
              cannot safely determine the cause through
              this chat.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-corner-lg border border-danger/30 bg-white p-lg">
        <div className="flex items-start gap-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-full bg-danger/10">
            <HeartPulse
              size={17}
              className="text-danger"
            />
          </div>

          <div className="min-w-0">
            <p className="text-label-sm font-semibold text-danger">
              Emergency recommendation
            </p>

            <p className="mt-xs text-label-sm leading-6 text-text-primary">
              {recommendation}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-corner-lg bg-bg-faint p-lg">
        <p className="text-video-title font-medium text-text-secondary">
          Serious warning signs may include:
        </p>

        <ul className="mt-md flex list-disc flex-col gap-sm pl-lg text-label-sm text-text-primary">
          <li>Chest pain</li>
          <li>Severe difficulty breathing</li>
          <li>Loss of consciousness</li>
          <li>Seizure</li>
          <li>Severe bleeding</li>
          <li>Signs of stroke</li>
          <li>Severe allergic reaction</li>
        </ul>
      </div>

      <div className="flex flex-col gap-md">
        <Button
          variant="primary"
          iconStart={
            <PhoneCall
              size={16}
            />
          }
          onClick={() => {
            window.location.href =
              "tel:112";
          }}
          className="w-full"
        >
          Call emergency services
        </Button>

        <Button
          variant="neutral"
          onClick={
            onContinue
          }
          className="w-full"
        >
          View assessment details
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
          Start another assessment
        </Button>
      </div>

      <p className="text-center text-video-title leading-5 text-text-tertiary">
        Do not delay emergency care while using
        PhilaChatBot.
      </p>
    </div>
  );
}