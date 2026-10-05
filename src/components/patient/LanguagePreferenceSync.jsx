import {
  useEffect,
  useRef,
} from "react";

import i18n from "../../i18n/index.js";

import {
  getStoredLanguage,
  normalizeLanguage,
  storeLanguage,
} from "../../i18n/languages.js";

import {
  patientsApi,
} from "../../services/api/patients.js";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

const SAVE_DELAY_MS =
  300;

export default function LanguagePreferenceSync({
  children,
}) {
  const {
    isAuthenticated,
    isLoading,
    role,
  } = useAuth();

  const loadedRef =
    useRef(false);

  const applyingServerLanguageRef =
    useRef(false);

  const lastSavedLanguageRef =
    useRef(null);

  const saveTimerRef =
    useRef(null);

  const isPatient =
    isAuthenticated &&
    role === "Patient";

  /*
   * Load the patient's authoritative language
   * preference from the backend whenever the
   * authenticated patient session becomes ready.
   */
  useEffect(
    () => {
      if (
        isLoading ||
        !isPatient
      ) {
        return undefined;
      }

      let cancelled =
        false;

      loadedRef.current =
        false;

      async function loadLanguage() {
        try {
          const result =
            await patientsApi
              .getLanguage();

          if (cancelled) {
            return;
          }

          const serverLanguage =
            normalizeLanguage(
              result?.language
            );

          applyingServerLanguageRef.current =
            true;

          storeLanguage(
            serverLanguage
          );

          lastSavedLanguageRef.current =
            serverLanguage;

          if (
            normalizeLanguage(
              i18n.language
            ) !==
            serverLanguage
          ) {
            await i18n
              .changeLanguage(
                serverLanguage
              );
          }
        } catch (
          error
        ) {
          console.error(
            "Failed to load patient language preference:",
            error
          );

          /*
           * If the backend is temporarily unavailable,
           * keep the most recently cached preference.
           */
          const cachedLanguage =
            getStoredLanguage();

          if (
            normalizeLanguage(
              i18n.language
            ) !==
            cachedLanguage
          ) {
            await i18n
              .changeLanguage(
                cachedLanguage
              );
          }
        } finally {
          if (!cancelled) {
            loadedRef.current =
              true;

            queueMicrotask(
              () => {
                applyingServerLanguageRef.current =
                  false;
              }
            );
          }
        }
      }

      void loadLanguage();

      return () => {
        cancelled =
          true;
      };
    },
    [
      isLoading,
      isPatient,
    ]
  );

  /*
   * Any future UI control can simply call:
   *
   * i18n.changeLanguage("xh")
   *
   * This listener persists that change to
   * localStorage and the PhilaLink backend.
   */
  useEffect(
    () => {
      if (
        isLoading ||
        !isPatient
      ) {
        return undefined;
      }

      async function handleLanguageChanged(
        nextLanguage
      ) {
        const language =
          storeLanguage(
            normalizeLanguage(
              nextLanguage
            )
          );

        if (
          !loadedRef.current ||
          applyingServerLanguageRef.current
        ) {
          return;
        }

        if (
          language ===
          lastSavedLanguageRef.current
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

        saveTimerRef.current =
          window.setTimeout(
            async () => {
              try {
                const result =
                  await patientsApi
                    .updateLanguage(
                      language
                    );

                const savedLanguage =
                  normalizeLanguage(
                    result?.language
                  );

                lastSavedLanguageRef.current =
                  savedLanguage;

                storeLanguage(
                  savedLanguage
                );

                if (
                  savedLanguage !==
                  normalizeLanguage(
                    i18n.language
                  )
                ) {
                  applyingServerLanguageRef.current =
                    true;

                  await i18n
                    .changeLanguage(
                      savedLanguage
                    );

                  queueMicrotask(
                    () => {
                      applyingServerLanguageRef.current =
                        false;
                    }
                  );
                }
              } catch (
                error
              ) {
                console.error(
                  "Failed to save patient language preference:",
                  error
                );
              }
            },
            SAVE_DELAY_MS
          );
      }

      i18n.on(
        "languageChanged",
        handleLanguageChanged
      );

      return () => {
        i18n.off(
          "languageChanged",
          handleLanguageChanged
        );

        if (
          saveTimerRef.current
        ) {
          window.clearTimeout(
            saveTimerRef.current
          );

          saveTimerRef.current =
            null;
        }
      };
    },
    [
      isLoading,
      isPatient,
    ]
  );

  return children;
}