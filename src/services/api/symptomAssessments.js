import { api } from "./client.js";

function cleanList(
  values
) {
  if (
    !Array.isArray(
      values
    )
  ) {
    return [];
  }

  return values
    .map(
      (value) =>
        String(
          value ?? ""
        ).trim()
    )
    .filter(Boolean);
}

export const symptomAssessmentsApi = {
  create: (
    assessment
  ) => {
    const symptoms =
      Array.isArray(
        assessment?.symptoms
      )
        ? assessment.symptoms
            .map(
              (value) =>
                String(
                  value ?? ""
                ).trim()
            )
            .filter(Boolean)
            .join(", ")
        : String(
            assessment?.symptoms ??
              assessment ??
              ""
          ).trim();

    if (!symptoms) {
      throw new Error(
        "Symptoms are required."
      );
    }

    const rawAge =
      String(
        assessment?.age ??
          ""
      ).trim();

    const parsedAge =
      rawAge
        ? Number(
            rawAge
          )
        : null;

    const age =
      parsedAge !== null &&
      Number.isInteger(
        parsedAge
      ) &&
      parsedAge >= 0 &&
      parsedAge <= 120
        ? parsedAge
        : null;

    let duration =
      String(
        assessment?.duration ??
          ""
      ).trim();

    if (
      duration ===
        "custom" &&
      assessment
        ?.customDurationValue
    ) {
      const value =
        String(
          assessment
            .customDurationValue
        ).trim();

      const unit =
        String(
          assessment
            .customDurationUnit ??
            "days"
        ).trim();

      duration =
        `${value} ${unit}`.trim();
    }

    return api.post(
      "/api/symptom-assessments",
      {
        symptoms,
        age,
        duration:
          duration || null,
        allergies:
          cleanList(
            assessment
              ?.allergies
          ),
        medications:
          cleanList(
            assessment
              ?.medications
          ),
        conditions:
          cleanList(
            assessment
              ?.conditions
          ),
      }
    );
  },

  getMine: () =>
    api.get(
      "/api/symptom-assessments/me"
    ),
};