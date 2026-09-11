import { Badge, Button } from "../AstraCompat.jsx";

import {
  Activity,
  AlertTriangle,
  HeartPulse,
  MessageCircle,
  Pill,
  RefreshCcw,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

function determinePossibleCauses(symptoms) {
  const normalized = symptoms.map((item) =>
    item.toLowerCase()
  );

  const causes = [];

  const hasRespiratorySymptoms =
    normalized.some((item) =>
      ["cough", "sore throat", "runny nose"].some(
        (term) => item.includes(term)
      )
    );

  const hasFever = normalized.some((item) =>
    item.includes("fever")
  );

  const hasHeadache = normalized.some((item) =>
    item.includes("headache")
  );

  const hasDigestiveSymptoms =
    normalized.some((item) =>
      [
        "nausea",
        "vomiting",
        "diarrhea",
        "stomach pain",
      ].some((term) => item.includes(term))
    );

  if (hasRespiratorySymptoms) {
    causes.push({
      name: "Viral respiratory infection",
      relevance: "Possible",
      description:
        "Cough, sore throat, runny nose and mild fever can occur with common viral respiratory infections.",
    });
  }

  if (hasFever && hasHeadache) {
    causes.push({
      name: "Influenza-like illness",
      relevance: "Possible",
      description:
        "Fever, headache, fatigue and respiratory symptoms can sometimes occur together during influenza-like illnesses.",
    });
  }

  if (hasDigestiveSymptoms) {
    causes.push({
      name: "Gastrointestinal illness",
      relevance: "Possible",
      description:
        "Nausea, vomiting, diarrhea or stomach pain may occur with gastrointestinal infections or irritation.",
    });
  }

  if (causes.length === 0) {
    causes.push({
      name: "General viral or self-limiting illness",
      relevance: "Possible",
      description:
        "Your symptoms may occur with a number of common short-term illnesses. More information or an examination may be needed to determine the cause.",
    });
  }

  return causes.slice(0, 3);
}

function getMedicationGuidance(assessment) {
  const normalizedSymptoms =
    assessment.symptoms.map((item) =>
      item.toLowerCase()
    );

  const normalizedAllergies =
    assessment.allergies.map((item) =>
      item.toLowerCase()
    );

  const guidance = [];

  const hasPainOrFever =
    normalizedSymptoms.some((item) =>
      ["headache", "fever", "back pain"].some(
        (term) => item.includes(term)
      )
    );

  if (hasPainOrFever) {
    guidance.push({
      name: "Paracetamol",
      purpose:
        "May help relieve mild pain or fever.",
      warning:
        "Follow the package instructions and do not exceed the recommended dose.",
      safe:
        !normalizedAllergies.some((item) =>
          item.includes("paracetamol")
        ),
    });
  }

  if (
    normalizedSymptoms.some((item) =>
      item.includes("sore throat")
    )
  ) {
    guidance.push({
      name: "Throat lozenges",
      purpose:
        "May provide temporary relief from a sore throat.",
      warning:
        "Choose an age-appropriate product and follow package instructions.",
      safe: true,
    });
  }

  return guidance;
}

export default function ResultsScreen({
  assessment,
  onFollowUp,
  onRestart,
}) {
  const possibleCauses =
    determinePossibleCauses(
      assessment.symptoms
    );

  const medicationGuidance =
    getMedicationGuidance(
      assessment
    );

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <Badge
          label="Assessment complete"
          variant="success"
        />

        <h2 className="mt-md text-title text-text-primary">
          Health assessment
        </h2>

        <p className="mt-xs text-label-sm leading-6 text-text-secondary">
          Based on the information you provided, here are
          some possible explanations and general next
          steps.
        </p>
      </div>

      <section className="rounded-corner-lg border border-border-secondary bg-white p-lg">
        <div className="flex items-center gap-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
            <Activity
              size={17}
              className="text-brand-primary"
            />
          </div>

          <div>
            <p className="text-video-title text-text-secondary">
              Symptom level
            </p>

            <p className="text-label-sm font-semibold text-text-primary">
              Mild to moderate
            </p>
          </div>
        </div>

        <p className="mt-md text-video-title leading-5 text-text-secondary">
          Your answers do not currently suggest an
          immediate emergency based on the information
          provided, but you should seek medical care if
          symptoms worsen or new serious symptoms appear.
        </p>
      </section>

      <section>
        <div className="mb-md flex items-center gap-sm">
          <Stethoscope
            size={17}
            className="text-brand-primary"
          />

          <h3 className="text-label font-semibold text-text-primary">
            Possible causes
          </h3>
        </div>

        <div className="flex flex-col gap-md">
          {possibleCauses.map(
            (cause, index) => (
              <div
                key={cause.name}
                className="rounded-corner-lg border border-border-secondary bg-white p-lg"
              >
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <p className="text-label-sm font-semibold text-text-primary">
                      {cause.name}
                    </p>

                    <p className="mt-xs text-video-title leading-5 text-text-secondary">
                      {cause.description}
                    </p>
                  </div>

                  <Badge
                    label={
                      index === 0
                        ? cause.relevance
                        : "Also possible"
                    }
                    variant="default"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section>
        <div className="mb-md flex items-center gap-sm">
          <Pill
            size={17}
            className="text-brand-primary"
          />

          <h3 className="text-label font-semibold text-text-primary">
            Medication guidance
          </h3>
        </div>

        {medicationGuidance.length > 0 ? (
          <div className="flex flex-col gap-md">
            {medicationGuidance.map(
              (medication) => (
                <div
                  key={medication.name}
                  className="rounded-corner-lg border border-border-secondary bg-white p-lg"
                >
                  <div className="flex items-start gap-md">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-corner-full ${
                        medication.safe
                          ? "bg-success/10"
                          : "bg-danger/10"
                      }`}
                    >
                      {medication.safe ? (
                        <ShieldCheck
                          size={15}
                          className="text-success"
                        />
                      ) : (
                        <AlertTriangle
                          size={15}
                          className="text-danger"
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-label-sm font-semibold text-text-primary">
                        {medication.name}
                      </p>

                      <p className="mt-xs text-video-title leading-5 text-text-secondary">
                        {medication.purpose}
                      </p>

                      <p className="mt-sm text-video-title leading-5 text-text-secondary">
                        {medication.warning}
                      </p>

                      {!medication.safe && (
                        <p className="mt-sm text-video-title font-medium text-danger">
                          This may conflict with an allergy
                          you provided. Do not use it without
                          professional advice.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="rounded-corner-lg bg-bg-faint p-lg">
            <p className="text-label-sm leading-6 text-text-secondary">
              No specific over-the-counter medication
              guidance is suggested from the symptoms you
              selected. A pharmacist or healthcare
              professional can help if symptom relief is
              needed.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-corner-lg bg-brand-tertiary/40 p-lg">
        <div className="flex items-start gap-md">
          <HeartPulse
            size={17}
            className="mt-[2px] shrink-0 text-brand-primary"
          />

          <div>
            <p className="text-label-sm font-semibold text-text-primary">
              What you should do next
            </p>

            <ul className="mt-sm flex list-disc flex-col gap-xs pl-lg text-video-title leading-5 text-text-secondary">
              <li>Rest and stay well hydrated.</li>
              <li>Monitor your symptoms.</li>
              <li>
                Follow medication package instructions.
              </li>
              <li>
                Contact your clinic if symptoms persist or
                worsen.
              </li>
              <li>
                Seek urgent medical care if serious warning
                signs develop.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="rounded-corner-md bg-warning/10 p-md">
        <div className="flex items-start gap-sm">
          <AlertTriangle
            size={15}
            className="mt-[2px] shrink-0 text-warning"
          />

          <p className="text-video-title leading-5 text-text-secondary">
            PhilaChatBot does not diagnose illness or
            prescribe medication. Always ask a doctor,
            nurse or pharmacist if you are unsure.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-md">
        <Button
          variant="primary"
          iconStart={
            <MessageCircle size={15} />
          }
          onClick={onFollowUp}
          className="w-full"
        >
          Ask a follow-up question
        </Button>

        <Button
          variant="subtle"
          iconStart={
            <RefreshCcw size={15} />
          }
          onClick={onRestart}
          className="w-full"
        >
          Start another assessment
        </Button>
      </div>
    </div>
  );
}
