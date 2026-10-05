import {
  useTranslation,
} from "react-i18next";

import {
  Button,
} from "../AstraCompat.jsx";

import {
  AlertTriangle,
  HeartPulse,
  PhoneCall,
  RefreshCcw,
} from "lucide-react";

import {
  translateKnownServerText,
} from "../../../../i18n/patientText.js";

export default function EmergencyScreen({
  assessmentResult,
  onContinue,
  onRestart,
}) {
  const {
    t,
  } =
    useTranslation();

  const recommendation =
    translateKnownServerText(
      assessmentResult
        ?.recommendation
    ) ||
    t(
      "chatbot.defaultEmergencyRecommendation"
    );

  const warningSigns = [
    t(
      "chatbot.warningChestPain"
    ),
    t(
      "chatbot.warningBreathing"
    ),
    t(
      "chatbot.warningConsciousness"
    ),
    t(
      "chatbot.warningSeizure"
    ),
    t(
      "chatbot.warningBleeding"
    ),
    t(
      "chatbot.warningStroke"
    ),
    t(
      "chatbot.warningAllergy"
    ),
  ];

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
              {t(
                "chatbot.emergency"
              )}
            </p>

            <h2 className="mt-xs text-title text-danger">
              {t(
                "chatbot.emergencyTitle"
              )}
            </h2>

            <p className="mt-sm text-label-sm leading-6 text-text-secondary">
              {t(
                "chatbot.emergencyDescription"
              )}
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
              {t(
                "chatbot.emergencyRecommendation"
              )}
            </p>

            <p className="mt-xs text-label-sm leading-6 text-text-primary">
              {recommendation}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-corner-lg bg-bg-faint p-lg">
        <p className="text-video-title font-medium text-text-secondary">
          {t(
            "chatbot.warningSigns"
          )}
        </p>

        <ul className="mt-md flex list-disc flex-col gap-sm pl-lg text-label-sm text-text-primary">
          {warningSigns.map(
            sign => (
              <li
                key={
                  sign
                }
              >
                {sign}
              </li>
            )
          )}
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
          {t(
            "chatbot.callEmergency"
          )}
        </Button>

        <Button
          variant="neutral"
          onClick={
            onContinue
          }
          className="w-full"
        >
          {t(
            "chatbot.viewAssessment"
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

      <p className="text-center text-video-title leading-5 text-text-tertiary">
        {t(
          "chatbot.emergencyFooter"
        )}
      </p>
    </div>
  );
}
