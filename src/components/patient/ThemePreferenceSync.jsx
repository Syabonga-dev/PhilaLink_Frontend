import {
  useEffect,
  useRef,
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
    // permanent source.
  }

  return normalized;
}

export default function ThemePreferenceSync({
  children,
}) {
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
          const result =
            await api.get(
              THEME_ENDPOINT
            );

          if (cancelled) {
            return;
          }

          const theme =
            normalizeTheme(
              result?.theme
            );

          applyingServerThemeRef.current =
            true;

          applyTheme(
            theme
          );

          lastSavedThemeRef.current =
            theme;

          /*
           * Keep the flag active until the DOM mutation
           * observer has seen the server-applied change.
           */
          window.setTimeout(
            () => {
              applyingServerThemeRef.current =
                false;
            },
            0
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to load saved theme:",
            error
          );

          /*
           * If the network is temporarily unavailable,
           * preserve the locally remembered appearance.
           */
          let fallback =
            "light";

          try {
            fallback =
              normalizeTheme(
                localStorage.getItem(
                  THEME_STORAGE_KEY
                )
              );
          } catch {
            fallback =
              normalizeTheme(
                document.documentElement
                  .getAttribute(
                    "data-theme"
                  )
              );
          }

          applyTheme(
            fallback
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

            applyTheme(
              theme
            );

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
             * Small debounce prevents unnecessary requests
             * if the user switches themes rapidly.
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

                    lastSavedThemeRef.current =
                      normalizeTheme(
                        result?.theme
                      );
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

  return children;
}
