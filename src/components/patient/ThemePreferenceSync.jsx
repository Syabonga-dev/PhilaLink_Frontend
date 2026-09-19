import {
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  api,
} from "../../services/api/client.js";

const THEME_STORAGE_KEY =
  "philalink-theme";

const THEME_ENDPOINT =
  "/api/patients/me/theme";

function normalizeTheme(
  value
) {
  return value ===
    "dark"
    ? "dark"
    : "light";
}

function getCurrentTheme() {
  const documentTheme =
    document.documentElement
      .getAttribute(
        "data-theme"
      );

  if (
    documentTheme ===
      "dark" ||
    documentTheme ===
      "light"
  ) {
    return documentTheme;
  }

  try {
    return normalizeTheme(
      localStorage.getItem(
        THEME_STORAGE_KEY
      )
    );
  } catch {
    return "light";
  }
}

function applyTheme(
  theme
) {
  const normalized =
    normalizeTheme(
      theme
    );

  document.documentElement
    .setAttribute(
      "data-theme",
      normalized
    );

  try {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      normalized
    );
  } catch {
    // Database remains the
    // persistent source.
  }

  return normalized;
}

export default function ThemePreferenceSync({
  children,
}) {
  const [
    themeRevision,
    setThemeRevision,
  ] = useState(0);

  const loadedRef =
    useRef(false);

  const applyingServerThemeRef =
    useRef(false);

  const lastSavedThemeRef =
    useRef(null);

  const saveTimerRef =
    useRef(null);

  useEffect(
    () => {
      let cancelled =
        false;

      async function loadTheme() {
        try {
          const previousTheme =
            getCurrentTheme();

          const result =
            await api.get(
              THEME_ENDPOINT
            );

          if (cancelled) {
            return;
          }

          const serverTheme =
            normalizeTheme(
              result?.theme
            );

          applyingServerThemeRef.current =
            true;

          applyTheme(
            serverTheme
          );

          lastSavedThemeRef.current =
            serverTheme;

          /*
           * If the database theme differs from the
           * theme that was present when the patient
           * layout first rendered, remount the patient
           * subtree.
           *
           * SettingsPage will then initialise from the
           * correct database-backed theme.
           */
          if (
            previousTheme !==
              serverTheme
          )
          {
            setThemeRevision(
              (current) =>
                current + 1
            );
          }

          queueMicrotask(
            () => {
              applyingServerThemeRef.current =
                false;
            }
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to load saved theme:",
            error
          );

          /*
           * Keep the most recently cached theme if the
           * backend is temporarily unavailable.
           */
          applyTheme(
            getCurrentTheme()
          );
        } finally {
          if (!cancelled) {
            loadedRef.current =
              true;
          }
        }
      }

      void loadTheme();

      return () => {
        cancelled =
          true;
      };
    },
    []
  );

  useEffect(
    () => {
      const root =
        document.documentElement;

      const observer =
        new MutationObserver(
          () => {
            if (
              !loadedRef.current ||
              applyingServerThemeRef.current
            ) {
              return;
            }

            const theme =
              normalizeTheme(
                root.getAttribute(
                  "data-theme"
                )
              );

            try {
              localStorage.setItem(
                THEME_STORAGE_KEY,
                theme
              );
            } catch {
              // Database save below
              // remains authoritative.
            }

            if (
              theme ===
              lastSavedThemeRef.current
            ) {
              return;
            }

            if (
              saveTimerRef.current
            ) {
              window.clearTimeout(
                saveTimerRef.current
              );
            }

            /*
             * Debounce theme updates so rapidly toggling
             * the switch doesn't generate unnecessary
             * database writes.
             */
            saveTimerRef.current =
              window.setTimeout(
                async () => {
                  try {
                    const result =
                      await api.put(
                        THEME_ENDPOINT,
                        {
                          theme,
                        }
                      );

                    const savedTheme =
                      normalizeTheme(
                        result?.theme
                      );

                    lastSavedThemeRef.current =
                      savedTheme;

                    /*
                     * Keep local state aligned with whatever
                     * the backend accepted.
                     */
                    if (
                      savedTheme !==
                        theme
                    ) {
                      applyingServerThemeRef.current =
                        true;

                      applyTheme(
                        savedTheme
                      );

                      queueMicrotask(
                        () => {
                          applyingServerThemeRef.current =
                            false;
                        }
                      );
                    }
                  } catch (
                    error
                  ) {
                    console.error(
                      "Failed to save theme preference:",
                      error
                    );
                  }
                },
                300
              );
          }
        );

      observer.observe(
        root,
        {
          attributes:
            true,

          attributeFilter: [
            "data-theme",
          ],
        }
      );

      return () => {
        observer.disconnect();

        if (
          saveTimerRef.current
        ) {
          window.clearTimeout(
            saveTimerRef.current
          );
        }
      };
    },
    []
  );

  return (
    <Fragment
      key={
        themeRevision
      }
    >
      {children}
    </Fragment>
  );
}
