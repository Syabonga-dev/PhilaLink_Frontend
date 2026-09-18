import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  MapPin,
  Snowflake,
  Sun,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  weatherApi,
} from "../../services/api/weather.js";

const WEATHER_REFRESH_INTERVAL_MS =
  60 * 60 * 1000;

function getWeatherIcon(
  description
) {
  const value =
    (
      description || ""
    ).toLowerCase();

  if (
    value.includes(
      "thunder"
    )
  ) {
    return CloudLightning;
  }

  if (
    value.includes("rain") ||
    value.includes(
      "drizzle"
    )
  ) {
    return CloudRain;
  }

  if (
    value.includes("snow")
  ) {
    return Snowflake;
  }

  if (
    value.includes("mist") ||
    value.includes("fog") ||
    value.includes("haze")
  ) {
    return CloudFog;
  }

  if (
    value.includes("clear")
  ) {
    return Sun;
  }

  if (
    value.includes("cloud")
  ) {
    return CloudSun;
  }

  return Cloud;
}

function formatDescription(
  description
) {
  if (!description) {
    return "Weather";
  }

  return description
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export default function WeatherChip({
  onNotificationCreated,
}) {
  const [
    weather,
    setWeather,
  ] = useState(null);

  const [
    weatherSource,
    setWeatherSource,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    mobileDetailsOpen,
    setMobileDetailsOpen,
  ] = useState(false);

  const hasLoadedRef =
    useRef(false);

  const lastRefreshRef =
    useRef(0);

  const containerRef =
    useRef(null);

  const generateWeatherTip =
    useCallback(
      async (
        latitude,
        longitude
      ) => {
        try {
          const result =
            await weatherApi
              .generateTip(
                latitude,
                longitude
              );

          if (
            result
              ?.notificationCreated
          ) {
            await onNotificationCreated?.();
          }
        } catch (
          tipError
        ) {
          console.error(
            "Failed to generate weather health tip:",
            tipError
          );
        }
      },
      [
        onNotificationCreated,
      ]
    );

  const loadClinicWeather =
    useCallback(
      async ({
        background =
          false,
      } = {}) => {
        const result =
          await weatherApi
            .getCurrent();

        setWeather(
          result
        );

        setWeatherSource(
          "clinic"
        );

        setError("");

        lastRefreshRef.current =
          Date.now();

        /*
         * Weather is already available to display.
         * Health-tip generation is useful, but it is not
         * required before the user can see the weather.
         */
        if (!background) {
          setLoading(
            false
          );
        }

        void generateWeatherTip();

        return result;
      },
      [
        generateWeatherTip,
      ]
    );

  const loadWeather =
    useCallback(
      async ({
        background =
          false,
      } = {}) => {
        if (!background) {
          setLoading(true);
        }

        setError("");

        const useClinicFallback =
          async () => {
            try {
              await loadClinicWeather({
                background,
              });
            } catch (
              clinicError
            ) {
              console.error(
                "Failed to load clinic fallback weather:",
                clinicError
              );

              if (!background) {
                setWeather(
                  null
                );

                setWeatherSource(
                  ""
                );

                setError(
                  clinicError
                    ?.message ||
                    "Weather unavailable."
                );
              }
            } finally {
              if (!background) {
                setLoading(
                  false
                );
              }
            }
          };

        if (
          typeof navigator ===
            "undefined" ||
          !navigator.geolocation
        ) {
          await useClinicFallback();

          return;
        }

        navigator.geolocation
          .getCurrentPosition(
            async (
              position
            ) => {
              try {
                const {
                  latitude,
                  longitude,
                } =
                  position.coords;

                const result =
                  await weatherApi
                    .getCurrent(
                      latitude,
                      longitude
                    );

                setWeather(
                  result
                );

                setWeatherSource(
                  "current"
                );

                setError("");

                lastRefreshRef.current =
                  Date.now();

                /*
                 * Do not hold the weather loading state open
                 * while the secondary tip request completes.
                 */
                if (!background) {
                  setLoading(
                    false
                  );
                }

                void generateWeatherTip(
                  latitude,
                  longitude
                );
              } catch (
                locationWeatherError
              ) {
                console.error(
                  "Failed to load current-location weather:",
                  locationWeatherError
                );

                await useClinicFallback();
              } finally {
                if (!background) {
                  setLoading(
                    false
                  );
                }
              }
            },

            async () => {
              await useClinicFallback();
            },

            {
              enableHighAccuracy:
                false,

              timeout:
                10000,

              maximumAge:
                10 *
                60 *
                1000,
            }
          );
      },
      [
        generateWeatherTip,
        loadClinicWeather,
      ]
    );

  useEffect(() => {
    if (
      hasLoadedRef.current
    ) {
      return undefined;
    }

    hasLoadedRef.current =
      true;

    loadWeather();

    const intervalId =
      window.setInterval(
        () => {
          loadWeather({
            background:
              true,
          });
        },
        WEATHER_REFRESH_INTERVAL_MS
      );

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState !==
          "visible"
        ) {
          return;
        }

        const elapsed =
          Date.now() -
          lastRefreshRef.current;

        if (
          elapsed >=
          WEATHER_REFRESH_INTERVAL_MS
        ) {
          loadWeather({
            background:
              true,
          });
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.clearInterval(
        intervalId
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    loadWeather,
  ]);

  useEffect(() => {
    if (
      !mobileDetailsOpen
    ) {
      return undefined;
    }

    const handlePointerDown =
      (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(
            event.target
          )
        ) {
          setMobileDetailsOpen(
            false
          );
        }
      };

    const handleKeyDown =
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          setMobileDetailsOpen(
            false
          );
        }
      };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    mobileDetailsOpen,
  ]);

  if (loading) {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] sm:w-auto sm:px-3"
        aria-label="Loading weather"
        title="Loading weather"
      >
        <Cloud
          size={18}
          className="shrink-0 text-[#94a3b8]"
        />

        <span className="ml-2 hidden text-xs sm:inline">
          Weather...
        </span>
      </div>
    );
  }

  if (
    error ||
    !weather
  ) {
    return (
      <button
        type="button"
        onClick={() =>
          loadWeather()
        }
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] transition hover:bg-[#f8fafc] sm:w-auto sm:px-3"
        title="Retry weather"
        aria-label="Weather unavailable. Retry weather."
      >
        <Cloud
          size={18}
          className="shrink-0 text-[#64748b]"
        />

        <span className="ml-2 hidden text-xs font-medium sm:inline">
          Weather unavailable
        </span>
      </button>
    );
  }

  const WeatherIcon =
    getWeatherIcon(
      weather.description
    );

  const temperatureValue =
    Number(
      weather.temperatureC
    );

  const temperature =
    Number.isFinite(
      temperatureValue
    )
      ? Math.round(
          temperatureValue
        )
      : null;

  const description =
    formatDescription(
      weather.description
    );

  const locationText =
    weather.locationName ||
    (
      weatherSource ===
      "clinic"
        ? "Assigned clinic area"
        : "Current location"
    );

  const title =
    weatherSource ===
    "clinic"
      ? `Using assigned clinic weather${
          weather.locationName
            ? `: ${weather.locationName}`
            : ""
        }`
      : `Current-location weather${
          weather.locationName
            ? `: ${weather.locationName}`
            : ""
        }`;

  return (
    <div
      ref={
        containerRef
      }
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setMobileDetailsOpen(
            (
              current
            ) =>
              !current
          )
        }
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#334155] transition hover:bg-[#f8fafc] sm:w-auto sm:min-w-0 sm:gap-2 sm:px-3"
        title={title}
        aria-label={title}
        aria-expanded={
          mobileDetailsOpen
        }
      >
        <WeatherIcon
          size={18}
          className="shrink-0 text-[#0f766e]"
        />

        {temperature !==
          null && (
          <span className="hidden shrink-0 text-sm font-semibold text-[#0f172a] sm:inline">
            {temperature}
            °C
          </span>
        )}

        <span className="hidden max-w-[120px] truncate text-xs text-[#64748b] xl:block">
          {description}
        </span>

        {weatherSource ===
          "clinic" && (
          <span className="hidden rounded-full bg-[#f1f5f9] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#64748b] 2xl:inline">
            Clinic
          </span>
        )}
      </button>

      {mobileDetailsOpen && (
        <div className="absolute right-0 top-12 z-50 w-[230px] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl sm:hidden">
          <div className="flex items-start justify-between gap-3 border-b border-[#e2e8f0] px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                Weather
              </p>

              <p className="mt-0.5 text-sm font-semibold text-[#0f172a]">
                {weatherSource ===
                "clinic"
                  ? "Clinic weather"
                  : "Current weather"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setMobileDetailsOpen(
                  false
                )
              }
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#64748b] transition hover:bg-[#f1f5f9]"
              aria-label="Close weather details"
            >
              <X
                size={15}
              />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0fdfa]">
                <WeatherIcon
                  size={26}
                  className="text-[#0f766e]"
                />
              </div>

              <div className="min-w-0">
                {temperature !==
                  null && (
                  <p className="text-2xl font-bold leading-none text-[#0f172a]">
                    {temperature}
                    °C
                  </p>
                )}

                <p className="mt-1 text-sm font-medium text-[#475569]">
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f8fafc] px-3 py-2.5">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-[#0f766e]"
              />

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">
                  Location
                </p>

                <p className="mt-0.5 break-words text-xs font-medium text-[#475569]">
                  {locationText}
                </p>
              </div>
            </div>

            {weatherSource ===
              "clinic" && (
              <p className="mt-3 text-[11px] leading-4 text-[#64748b]">
                Location access was unavailable, so PhilaLink is showing weather for your assigned clinic area.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
