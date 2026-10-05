export const DEFAULT_LANGUAGE =
  "en";

export const LANGUAGE_STORAGE_KEY =
  "philalink-language";

export const SUPPORTED_LANGUAGES =
  [
    {
      code: "en",
      name: "English",
    },
    {
      code: "zu",
      name: "isiZulu",
    },
    {
      code: "xh",
      name: "isiXhosa",
    },
    {
      code: "af",
      name: "Afrikaans",
    },
    {
      code: "nso",
      name: "Sepedi",
    },
    {
      code: "tn",
      name: "Setswana",
    },
    {
      code: "st",
      name: "Sesotho",
    },
    {
      code: "ts",
      name: "itsonga",
    },
    {
      code: "ss",
      name: "siSwati",
    },
    {
      code: "ve",
      name: "Tshivenda",
    },
    {
      code: "nr",
      name: "isiNdebele",
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
    /*
     * localStorage may be unavailable
     * in restricted browser contexts.
     *
     * The backend preference remains
     * authoritative.
     */
  }

  return normalized;
}

export function isSupportedLanguage(
  language
) {
  return SUPPORTED_LANGUAGE_CODES
    .includes(
      normalizeLanguage(
        language
      )
    );
}

export function getLanguageName(
  language
) {
  const normalized =
    normalizeLanguage(
      language
    );

  return SUPPORTED_LANGUAGES
    .find(
      (item) =>
        item.code ===
        normalized
    )
    ?.name ??
    "English";
}
