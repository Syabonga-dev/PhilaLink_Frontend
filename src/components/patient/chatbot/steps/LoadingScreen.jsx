import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

const stages = [
  "Sending your symptoms securely",
  "Checking for warning signs",
  "Recording your assessment",
  "Preparing your triage result",
];

export default function LoadingScreen() {
  const [
    currentStage,
    setCurrentStage,
  ] = useState(0);

  useEffect(() => {
    const interval =
      setInterval(() => {
        setCurrentStage(
          (previous) =>
            Math.min(
              previous + 1,
              stages.length -
                1
            )
        );
      }, 700);

    return () =>
      clearInterval(
        interval
      );
  }, []);

  return (
    <div className="flex flex-col items-center gap-xl py-lg text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-corner-full bg-brand-tertiary">
        <LoaderCircle
          size={28}
          className="animate-spin text-brand-primary"
        />
      </div>

      <div>
        <h2 className="text-title text-text-primary">
          PhilaLink is
          assessing your
          symptoms
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          Your assessment
          is being processed
          by the PhilaLink
          backend.
        </p>
      </div>

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
                  key={
                    stage
                  }
                  className="flex items-center gap-md"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                    {completed ? (
                      <CheckCircle2
                        size={
                          18
                        }
                        className="text-success"
                      />
                    ) : active ? (
                      <LoaderCircle
                        size={
                          18
                        }
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

      <div className="flex items-start gap-sm rounded-corner-md bg-bg-faint p-md text-left">
        <ShieldCheck
          size={16}
          className="mt-[2px] shrink-0 text-brand-primary"
        />

        <p className="text-video-title leading-5 text-text-secondary">
          This assessment
          provides triage
          guidance and is
          not a medical
          diagnosis.
        </p>
      </div>
    </div>
  );
}