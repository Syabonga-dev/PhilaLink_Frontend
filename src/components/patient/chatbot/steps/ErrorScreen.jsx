import {
  useTranslation,
} from "react-i18next";

import {
  Button,
} from "../AstraCompat.jsx";

import {
  AlertCircle,
  RefreshCw,
  WifiOff,
} from "lucide-react";

export default function ErrorScreen({
  errorType = "network",
  onRetry,
}) {
  const {
    t,
  } =
    useTranslation();

  const errorMessages = {
    network: {
      title:
        t(
          "chatbot.errorNetworkTitle"
        ),

      description:
        t(
          "chatbot.errorNetworkDescription"
        ),

      icon:
        WifiOff,
    },

    unavailable: {
      title:
        t(
          "chatbot.errorUnavailableTitle"
        ),

      description:
        t(
          "chatbot.errorUnavailableDescription"
        ),

      icon:
        AlertCircle,
    },

    missing: {
      title:
        t(
          "chatbot.errorMissingTitle"
        ),

      description:
        t(
          "chatbot.errorMissingDescription"
        ),

      icon:
        AlertCircle,
    },
  };

  const error =
    errorMessages[
      errorType
    ] ||
    errorMessages
      .network;

  const Icon =
    error.icon;

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
          {
            error.description
          }
        </p>
      </div>

      <Button
        variant="primary"
        iconStart={
          <RefreshCw
            size={15}
          />
        }
        onClick={
          onRetry
        }
      >
        {t(
          "chatbot.tryAgain"
        )}
      </Button>

      <p className="text-video-title leading-5 text-text-tertiary">
        {t(
          "chatbot.emergencyInstead"
        )}
      </p>
    </div>
  );
}
