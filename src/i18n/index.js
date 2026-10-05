import i18n from "i18next";

import {
  initReactI18next,
} from "react-i18next";

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGE_CODES,
  getStoredLanguage,
  normalizeLanguage,
  storeLanguage,
} from "./languages.js";

import {
  resources as baseResources,
} from "./resources.js";

import {
  dashboardResources,
} from "./dashboardResources.js";

import {
  patientPageResources,
} from "./patientPageResources.js";

import {
  patientExperienceResources,
  patientPageFixes,
} from "./patientExperienceResources.js";

import {
  patientCompletenessResources,
} from "./patientCompletenessResources.js";

import {
  patientFinalOverrides,
} from "./patientFinalOverrides.js";

function isPlainObject(
  value
) {
  return (
    value !== null &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value
    )
  );
}

function deepMerge(
  base,
  override
) {
  if (
    !isPlainObject(
      base
    )
  ) {
    base = {};
  }

  if (
    !isPlainObject(
      override
    )
  ) {
    return {
      ...base,
    };
  }

  const result = {
    ...base,
  };

  Object.entries(
    override
  ).forEach(
    ([
      key,
      value,
    ]) => {
      if (
        isPlainObject(
          value
        )
      ) {
        result[
          key
        ] =
          deepMerge(
            isPlainObject(
              result[
                key
              ]
            )
              ? result[
                  key
                ]
              : {},
            value
          );

        return;
      }

      result[
        key
      ] =
        value;
    }
  );

  return result;
}

function applyDocumentLanguage(
  language
) {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  document
    .documentElement
    .lang =
      normalizeLanguage(
        language
      );
}

const initialLanguage =
  getStoredLanguage();

const resources =
  Object.fromEntries(
    SUPPORTED_LANGUAGE_CODES.map(
      language => {
        const baseTranslation =
          baseResources[
            language
          ]?.translation ??
          baseResources[
            DEFAULT_LANGUAGE
          ]?.translation ??
          {};

        const dashboardTranslation =
          dashboardResources[
            language
          ] ??
          dashboardResources[
            DEFAULT_LANGUAGE
          ] ??
          {};

        const pageTranslation =
          patientPageResources[
            language
          ] ??
          patientPageResources[
            DEFAULT_LANGUAGE
          ] ??
          {};

        const pageFix =
          patientPageFixes[
            language
          ] ??
          {};

        const experienceTranslation =
          patientExperienceResources[
            language
          ]?.translation ??
          {};

        let translation =
          deepMerge(
            baseTranslation,
            experienceTranslation
          );

        translation =
          deepMerge(
            translation,
            {
              dashboard:
                dashboardTranslation,

              medications: {
                ...(
                  pageTranslation
                    .medications ??
                  {}
                ),

                ...(
                  pageFix
                    .medications ??
                  {}
                ),
              },

              appointments: {
                ...(
                  pageTranslation
                    .appointments ??
                  {}
                ),

                ...(
                  pageFix
                    .appointments ??
                  {}
                ),
              },

              records: {
                ...(
                  pageTranslation
                    .records ??
                  {}
                ),

                ...(
                  pageFix
                    .records ??
                  {}
                ),
              },

              clinics: {
                ...(
                  pageTranslation
                    .clinics ??
                  {}
                ),

                ...(
                  pageFix
                    .clinics ??
                  {}
                ),
              },
            }
          );

        translation =
          deepMerge(
            translation,
            patientCompletenessResources[
              language
            ] ??
              {}
          );

        /*
         * Always merge the final reviewed corrections last.
         *
         * This prevents older partial language packs from
         * leaking their inherited English values back into
         * the patient portal.
         */
        translation =
          deepMerge(
            translation,
            patientFinalOverrides[
              language
            ] ??
              {}
          );

        return [
          language,
          {
            translation,
          },
        ];
      }
    )
  );

void i18n
  .use(
    initReactI18next
  )
  .init({
    resources,

    lng:
      initialLanguage,

    fallbackLng:
      DEFAULT_LANGUAGE,

    supportedLngs:
      SUPPORTED_LANGUAGE_CODES,

    load:
      "languageOnly",

    nonExplicitSupportedLngs:
      true,

    interpolation: {
      escapeValue:
        false,
    },

    react: {
      useSuspense:
        false,
    },

    returnNull:
      false,

    returnEmptyString:
      false,
  });

applyDocumentLanguage(
  initialLanguage
);

i18n.on(
  "languageChanged",
  language => {
    const normalized =
      storeLanguage(
        language
      );

    applyDocumentLanguage(
      normalized
    );
  }
);

export default i18n;
