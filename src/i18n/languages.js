export const DEFAULT_LANGUAGE =
  "en";

export const LANGUAGE_STORAGE_KEY =
  "philalink-language";

export const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    name: "English",
    locale: "en-ZA",
  },
  {
    code: "zu",
    name: "isiZulu",
    locale: "zu-ZA",
  },
  {
    code: "xh",
    name: "isiXhosa",
    locale: "xh-ZA",
  },
  {
    code: "af",
    name: "Afrikaans",
    locale: "af-ZA",
  },
  {
    code: "nso",
    name: "Sepedi",
    locale: "nso-ZA",
  },
  {
    code: "tn",
    name: "Setswana",
    locale: "tn-ZA",
  },
  {
    code: "st",
    name: "Sesotho",
    locale: "st-ZA",
  },
  {
    code: "ts",
    name: "itsonga",
    locale: "ts-ZA",
  },
  {
    code: "ss",
    name: "siSwati",
    locale: "ss-ZA",
  },
  {
    code: "ve",
    name: "Tshivenda",
    locale: "ve-ZA",
  },
  {
    code: "nr",
    name: "isiNdebele",
    locale: "nr-ZA",
  },
];

export const SUPPORTED_LANGUAGE_CODES =
  SUPPORTED_LANGUAGES.map(
    (language) =>
      language.code
  );

export function normalizeLanguage(
  value
) {
  if (!value) {
    return DEFAULT_LANGUAGE;
  }

  const normalized =
    String(value)
      .trim()
      .replace(
        "_",
        "-"
      )
      .split("-")[0]
      .toLowerCase();

  return SUPPORTED_LANGUAGE_CODES
    .includes(
      normalized
    )
    ? normalized
    : DEFAULT_LANGUAGE;
}

export function getStoredLanguage() {
  try {
    return normalizeLanguage(
      localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      )
    );
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function storeLanguage(
  language
) {
  const normalized =
    normalizeLanguage(
      language
    );

  try {
    localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      normalized
    );
  } catch {
    // Database remains authoritative.
  }

  return normalized;
}

export function isSupportedLanguage(
  language
) {
  const normalized =
    String(
      language ?? ""
    )
      .trim()
      .replace(
        "_",
        "-"
      )
      .split("-")[0]
      .toLowerCase();

  return SUPPORTED_LANGUAGE_CODES
    .includes(
      normalized
    );
}

export function getLanguageName(
  language
) {
  const normalized =
    normalizeLanguage(
      language
    );

  return (
    SUPPORTED_LANGUAGES.find(
      (item) =>
        item.code ===
        normalized
    )?.name ??
    "English"
  );
}

export function getLanguageLocale(
  language
) {
  const normalized =
    normalizeLanguage(
      language
    );

  return (
    SUPPORTED_LANGUAGES.find(
      (item) =>
        item.code ===
        normalized
    )?.locale ??
    "en-ZA"
  );
}