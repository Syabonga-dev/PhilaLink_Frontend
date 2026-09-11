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
  "Understanding your symptoms",
  "Checking symptom duration",
  "Reviewing allergies and medications",
  "Checking for serious warning signs",
  "Preparing health guidance",
];

export default function LoadingScreen({
  onComplete,
}) {
  const [currentStage, setCurrentStage] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentStage(
          (previous) => {
            if (
              previous >=
              stages.length - 1
            ) {
              clearInterval(
                interval
              );

              setTimeout(
                () => {
                  onComplete();
                },
                700
              );

              return previous;
            }

            return previous + 1;
          }
        );
      },
      700
    );

    return () =>
      clearInterval(interval);
  }, [onComplete]);

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
          PhilaChatBot is analyzing your symptoms
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          This may take a few moments.
        </p>
      </div>

      <div className="w-full rounded-corner-lg border border-border-secondary bg-white p-lg text-left">
        <div className="flex flex-col gap-md">
          {stages.map(
            (stage, index) => {
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

      <div className="flex items-start gap-sm rounded-corner-md bg-bg-faint p-md text-left">
        <ShieldCheck
          size={16}
          className="mt-[2px] shrink-0 text-brand-primary"
        />

        <p className="text-video-title leading-5 text-text-secondary">
          This assessment provides general health
          information and is not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
