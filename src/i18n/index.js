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

void i18n
  .use(
    initReactI18next
  )
  .init({
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

    /*
     * Translation resources are deliberately
     * added separately from the localization
     * infrastructure.
     *
     * This file establishes the runtime,
     * persistence and React integration first.
     */
    resources: {},

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
  });

applyDocumentLanguage(
  initialLanguage
);

i18n.on(
  "languageChanged",
  (
    language
  ) => {
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