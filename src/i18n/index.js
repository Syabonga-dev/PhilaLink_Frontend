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
          ];

        const pageTranslation =
          patientPageResources[
            language
          ] ??
          patientPageResources[
            DEFAULT_LANGUAGE
          ];

        return [
          language,
          {
            translation: {
              ...baseTranslation,

              dashboard:
                dashboardTranslation,

              medications:
                pageTranslation
                  .medications,

              appointments:
                pageTranslation
                  .appointments,

              records:
                pageTranslation
                  .records,

              clinics:
                pageTranslation
                  .clinics,
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
