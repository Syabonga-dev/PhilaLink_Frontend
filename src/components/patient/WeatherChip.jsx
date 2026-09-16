import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
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

  const hasLoadedRef =
    useRef(false);

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
      async () => {
        const result =
          await weatherApi
            .getCurrent();

        setWeather(
          result
        );

        setWeatherSource(
          "clinic"
        );

        await generateWeatherTip();

        return result;
      },
      [
        generateWeatherTip,
      ]
    );

  const loadWeather =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        const useClinicFallback =
          async () => {
            try {
              await loadClinicWeather();
            } catch (
              clinicError
            ) {
              console.error(
                "Failed to load clinic fallback weather:",
                clinicError
              );

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
            } finally {
              setLoading(
                false
              );
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

                await generateWeatherTip(
                  latitude,
                  longitude
                );

                setLoading(
                  false
                );
              } catch (
                locationWeatherError
              ) {
                console.error(
                  "Failed to load current-location weather:",
                  locationWeatherError
                );

                await useClinicFallback();
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
      return;
    }

    hasLoadedRef.current =
      true;

    loadWeather();
  }, [
    loadWeather,
  ]);

  if (loading) {
    return (
      <div
        className="flex h-10 items-center rounded-full border border-[#e2e8f0] bg-white px-3 text-xs text-[#64748b]"
        aria-label="Loading weather"
      >
        Weather...
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
        onClick={
          loadWeather
        }
        className="flex h-10 items-center rounded-full border border-[#e2e8f0] bg-white px-3 text-xs font-medium text-[#64748b] transition hover:bg-[#f8fafc]"
        title="Retry weather"
      >
        Weather unavailable
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
      className="flex h-10 min-w-0 items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 text-[#334155]"
      title={title}
      aria-label={title}
    >
      <WeatherIcon
        size={18}
        className="shrink-0 text-[#0f766e]"
      />

      {temperature !==
        null && (
        <span className="shrink-0 text-sm font-semibold text-[#0f172a]">
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
    </div>
  );
}