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
  resources,
} from "./resources.js";

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