import {
  useEffect,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import {
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import {
  ThinkingOrb,
} from "thinking-orbs";

export default function LoadingScreen() {
  const {
    t,
  } =
    useTranslation();

  const stages = [
    t(
      "chatbot.stageSending"
    ),
    t(
      "chatbot.stageWarningSigns"
    ),
    t(
      "chatbot.stageRecording"
    ),
    t(
      "chatbot.stageResult"
    ),
  ];

  const [
    currentStage,
    setCurrentStage,
  ] =
    useState(0);

  useEffect(
    () => {
      const interval =
        window.setInterval(
          () => {
            setCurrentStage(
              previous =>
                Math.min(
                  previous + 1,
                  stages.length - 1
                )
            );
          },
          700
        );

      return () =>
        window.clearInterval(
          interval
        );
    },
    [
      stages.length,
    ]
  );

  return (
    <div className="flex flex-col items-center gap-xl py-lg text-center">
      {/* ===============================================
          PHILANI ANALYSIS STATE
          =============================================== */}

      <div
        className="flex min-h-[84px] items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Philani is analysing symptoms"
      >
        <ThinkingOrb
          state="working"
          size={64}
        />
      </div>

      {/* ===============================================
          TITLE
          =============================================== */}

      <div>
        <h2 className="text-title text-text-primary">
          {t(
            "chatbot.loadingTitle"
          )}
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          {t(
            "chatbot.loadingDescription"
          )}
        </p>
      </div>

      {/* ===============================================
          ANALYSIS STAGES
          =============================================== */}

      <div className="w-full rounded-corner-lg border border-border-secondary bg-white p-lg text-left">
        <div className="flex flex-col gap-md">
          {stages.map(
            (
              stage,
              index
            ) => {
              const completed =
                index <
                currentStage;

              const active =
                index ===
                currentStage;

              return (
                <div
                  key={stage}
                  className="flex items-center gap-md"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                    {completed ? (
                      <CheckCircle2
                        size={18}
                        className="text-success"
                      />
                    ) : active ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin text-brand-primary"
                      />
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-corner-full bg-border-secondary" />
                    )}
                  </div>

                  <span
                    className={`text-label-sm ${
                      completed ||
                      active
                        ? "text-text-primary"
                        : "text-text-tertiary"
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* ===============================================
          MEDICAL DISCLAIMER
          =============================================== */}

      <div className="flex items-start gap-sm rounded-corner-md bg-bg-faint p-md text-left">
        <ShieldCheck
          size={16}
          className="mt-[2px] shrink-0 text-brand-primary"
        />

        <p className="text-video-title leading-5 text-text-secondary">
          {t(
            "chatbot.loadingDisclaimer"
          )}
        </p>
      </div>
    </div>
  );
}