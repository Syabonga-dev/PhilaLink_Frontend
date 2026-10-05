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

function applyDocumentLanguage(
  language
) {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  document.documentElement.lang =
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

        /*
         * PatientExperienceResources currently contains
         * complete English and isiZulu coverage for the
         * newly-localised patient components.
         *
         * Other existing language packs continue to use
         * their current translations and fall back to
         * English for new namespaces until their linguistic
         * review is completed.
         */
        const experienceTranslation =
          patientExperienceResources[
            language
          ]?.translation ??
          patientExperienceResources[
            DEFAULT_LANGUAGE
          ]?.translation ??
          {};

        return [
          language,
          {
            translation: {
              ...baseTranslation,
              ...experienceTranslation,

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
            },
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
