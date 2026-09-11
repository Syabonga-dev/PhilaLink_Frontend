import { Button } from "../AstraCompat.jsx";

import {
  AlertCircle,
  RefreshCw,
  WifiOff,
} from "lucide-react";

const errorMessages = {
  network: {
    title: "We couldn't connect to PhilaChatBot",
    description:
      "Check your internet connection and try again.",
    icon: WifiOff,
  },

  unavailable: {
    title: "PhilaChatBot is temporarily unavailable",
    description:
      "The health assistant could not process your request right now. Please try again shortly.",
    icon: AlertCircle,
  },

  missing: {
    title: "More information is needed",
    description:
      "Please review your assessment and provide the missing information before continuing.",
    icon: AlertCircle,
  },
};

export default function ErrorScreen({
  errorType = "network",
  onRetry,
}) {
  const error =
    errorMessages[errorType] ||
    errorMessages.network;

  const Icon = error.icon;

  return (
    <div className="flex flex-col items-center gap-xl py-xl text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-corner-full bg-danger/10">
        <Icon
          size={27}
          className="text-danger"
        />
      </div>

      <div>
        <h2 className="text-title text-text-primary">
          {error.title}
        </h2>

        <p className="mt-sm max-w-sm text-label-sm leading-6 text-text-secondary">
          {error.description}
        </p>
      </div>

      <Button
        variant="primary"
        iconStart={
          <RefreshCw size={15} />
        }
        onClick={onRetry}
      >
        Try again
      </Button>

      <p className="text-video-title leading-5 text-text-tertiary">
        If you are experiencing a medical emergency,
        contact emergency services instead of waiting for
        the chatbot.
      </p>
    </div>
  );
}
