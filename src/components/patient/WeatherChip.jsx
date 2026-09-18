import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  MapPin,
  Moon,
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

const CLOCK_REFRESH_INTERVAL_MS =
  60 * 1000;

/*
 * We collect several GPS samples and keep
 * the most accurate one instead of blindly
 * accepting the first result returned by
 * the browser.
 */
const GPS_COLLECTION_WINDOW_MS =
  10000;

const GPS_TARGET_ACCURACY_METRES =
  20;


/* =========================================================
   DAY / NIGHT
========================================================= */

function isNightTime(date) {
  const hour =
    date.getHours();

  return (
    hour < 6 ||
    hour >= 18
  );
}


/* =========================================================
   WEATHER CONDITION
========================================================= */

function getWeatherKind(
  description
) {
  const value =
    String(
      description || ""
    ).toLowerCase();


  if (
    value.includes(
      "thunder"
    ) ||
    value.includes(
      "storm"
    )
  ) {
    return "thunder";
  }


  if (
    value.includes(
      "rain"
    ) ||
    value.includes(
      "drizzle"
    ) ||
    value.includes(
      "shower"
    )
  ) {
    return "rain";
  }


  if (
    value.includes(
      "snow"
    ) ||
    value.includes(
      "sleet"
    )
  ) {
    return "snow";
  }


  if (
    value.includes(
      "mist"
    ) ||
    value.includes(
      "fog"
    ) ||
    value.includes(
      "haze"
    ) ||
    value.includes(
      "smoke"
    )
  ) {
    return "fog";
  }


  if (
    value.includes(
      "clear"
    )
  ) {
    return "clear";
  }


  if (
    value.includes(
      "overcast"
    )
  ) {
    return "overcast";
  }


  if (
    value.includes(
      "cloud"
    )
  ) {
    return "partly-cloudy";
  }


  return "cloud";
}


/* =========================================================
   WEATHER ICON
========================================================= */

function WeatherVisual({
  description,
  isNight,
  size = 18,
}) {
  const kind =
    getWeatherKind(
      description
    );


  if (
    kind === "clear"
  ) {
    if (isNight) {
      return (
        <Moon
          size={size}
          strokeWidth={2}
          className="shrink-0 text-[#3b82f6]"
          aria-hidden="true"
        />
      );
    }


    return (
      <Sun
        size={size}
        strokeWidth={2}
        className="shrink-0 text-[#f59e0b]"
        aria-hidden="true"
      />
    );
  }


  /*
   * Separate icons allow us to colour
   * the sun/moon and cloud independently.
   */
  if (
    kind ===
    "partly-cloudy"
  ) {
    const skySize =
      Math.round(
        size * 0.82
      );

    const cloudSize =
      Math.round(
        size * 0.9
      );


    return (
      <span
        className="relative inline-block shrink-0"
        style={{
          width:
            `${size}px`,

          height:
            `${size}px`,
        }}
        aria-hidden="true"
      >
        {isNight ? (
          <Moon
            size={
              skySize
            }
            strokeWidth={2}
            className="absolute right-0 top-0 text-[#3b82f6]"
          />
        ) : (
          <Sun
            size={
              skySize
            }
            strokeWidth={2}
            className="absolute right-0 top-0 text-[#f59e0b]"
          />
        )}


        <Cloud
          size={
            cloudSize
          }
          strokeWidth={2.2}
          className="absolute bottom-0 left-0 text-[#64748b]"
        />
      </span>
    );
  }


  if (
    kind === "overcast"
  ) {
    return (
      <Cloud
        size={size}
        strokeWidth={2}
        className="shrink-0 text-[#64748b]"
        aria-hidden="true"
      />
    );
  }


  if (
    kind === "rain"
  ) {
    return (
      <CloudRain
        size={size}
        strokeWidth={2}
        className="shrink-0 text-[#0284c7]"
        aria-hidden="true"
      />
    );
  }


  if (
    kind === "thunder"
  ) {
    return (
      <CloudLightning
        size={size}
        strokeWidth={2}
        className="shrink-0 text-[#7c3aed]"
        aria-hidden="true"
      />
    );
  }


  if (
    kind === "snow"
  ) {
    return (
      <Snowflake
        size={size}
        strokeWidth={2}
        className="shrink-0 text-[#38bdf8]"
        aria-hidden="true"
      />
    );
  }


  if (
    kind === "fog"
  ) {
    return (
      <CloudFog
        size={size}
        strokeWidth={2}
        className="shrink-0 text-[#94a3b8]"
        aria-hidden="true"
      />
    );
  }


  return (
    <Cloud
      size={size}
      strokeWidth={2}
      className="shrink-0 text-[#64748b]"
      aria-hidden="true"
    />
  );
}


/* =========================================================
   DESCRIPTION
========================================================= */

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


/* =========================================================
   HIGH ACCURACY GPS

   Instead of getCurrentPosition() returning the first
   position it finds, watchPosition() is allowed to collect
   several fixes.

   We keep whichever sample has the smallest accuracy radius.
========================================================= */

function getBestCurrentPosition() {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      if (
        typeof navigator ===
          "undefined" ||
        !navigator.geolocation
      ) {
        reject(
          new Error(
            "Location services are unavailable."
          )
        );

        return;
      }


      let watchId =
        null;

      let timerId =
        null;

      let settled =
        false;

      let bestPosition =
        null;

      let lastError =
        null;


      const cleanup =
        () => {
          if (
            watchId !==
            null
          ) {
            navigator.geolocation
              .clearWatch(
                watchId
              );
          }


          if (
            timerId !==
            null
          ) {
            window.clearTimeout(
              timerId
            );
          }
        };


      const finish =
        () => {
          if (settled) {
            return;
          }


          settled =
            true;

          cleanup();


          if (
            bestPosition
          ) {
            resolve(
              bestPosition
            );

            return;
          }


          reject(
            lastError ||
              new Error(
                "Your current location could not be determined."
              )
          );
        };


      watchId =
        navigator.geolocation
          .watchPosition(
            (
              position
            ) => {
              const accuracy =
                Number(
                  position
                    .coords
                    .accuracy
                );


              if (
                !bestPosition
              ) {
                bestPosition =
                  position;
              } else {
                const bestAccuracy =
                  Number(
                    bestPosition
                      .coords
                      .accuracy
                  );


                if (
                  Number.isFinite(
                    accuracy
                  ) &&
                  (
                    !Number.isFinite(
                      bestAccuracy
                    ) ||
                    accuracy <
                      bestAccuracy
                  )
                ) {
                  bestPosition =
                    position;
                }
              }


              /*
               * A reported accuracy radius of
               * 20 m or better is good enough
               * to stop waiting early.
               */
              if (
                Number.isFinite(
                  accuracy
                ) &&
                accuracy <=
                  GPS_TARGET_ACCURACY_METRES
              ) {
                finish();
              }
            },


            (
              geoError
            ) => {
              lastError =
                geoError;


              /*
               * Permission denial will not
               * improve by waiting for more
               * GPS samples.
               */
              if (
                geoError.code ===
                geoError.PERMISSION_DENIED
              ) {
                finish();
              }
            },


            {
              /*
               * Explicitly request GPS /
               * highest-quality positioning.
               */
              enableHighAccuracy:
                true,

              /*
               * Never intentionally reuse
               * a cached position.
               */
              maximumAge:
                0,

              timeout:
                GPS_COLLECTION_WINDOW_MS,
            }
          );


      timerId =
        window.setTimeout(
          finish,
          GPS_COLLECTION_WINDOW_MS
        );
    }
  );
}


/* =========================================================
   LOCATION ERROR MESSAGE
========================================================= */

function getLocationErrorMessage(
  error
) {
  if (!error) {
    return (
      "Location unavailable."
    );
  }


  if (
    error.code === 1
  ) {
    return (
      "Location access was denied. Enable precise location access in your browser settings."
    );
  }


  if (
    error.code === 2
  ) {
    return (
      "Your current GPS position could not be determined."
    );
  }


  if (
    error.code === 3
  ) {
    return (
      "The GPS request timed out. Please try again."
    );
  }


  return (
    error.message ||
    "Location unavailable."
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WeatherChip({
  onNotificationCreated,
}) {
  const [
    weather,
    setWeather,
  ] =
    useState(null);


  const [
    weatherSource,
    setWeatherSource,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    locationError,
    setLocationError,
  ] =
    useState("");


  const [
    currentCoordinates,
    setCurrentCoordinates,
  ] =
    useState(null);


  const [
    gpsAccuracy,
    setGpsAccuracy,
  ] =
    useState(null);


  const [
    mobileDetailsOpen,
    setMobileDetailsOpen,
  ] =
    useState(false);


  const [
    clockTime,
    setClockTime,
  ] =
    useState(
      () =>
        Date.now()
    );


  const lastRefreshRef =
    useRef(0);


  const containerRef =
    useRef(null);


  /* =======================================================
     WEATHER HEALTH TIP
  ======================================================= */

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


  /* =======================================================
     CLINIC FALLBACK

     Only used when precise/current location cannot be used.
  ======================================================= */

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


        setCurrentCoordinates(
          null
        );


        setGpsAccuracy(
          null
        );


        setError("");


        lastRefreshRef.current =
          Date.now();


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


  /* =======================================================
     CURRENT LOCATION WEATHER
  ======================================================= */

  const loadWeather =
    useCallback(
      async ({
        background =
          false,
      } = {}) => {
        if (!background) {
          setLoading(
            true
          );
        }


        setError("");

        setLocationError("");


        const useClinicFallback =
          async (
            geoError
          ) => {
            if (geoError) {
              setLocationError(
                getLocationErrorMessage(
                  geoError
                )
              );
            }


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


        try {
          /*
           * Collect the best GPS fix available
           * during the collection window.
           */
          const position =
            await getBestCurrentPosition();


          const latitude =
            Number(
              position
                .coords
                .latitude
            );


          const longitude =
            Number(
              position
                .coords
                .longitude
            );


          const accuracy =
            Number(
              position
                .coords
                .accuracy
            );


          if (
            !Number.isFinite(
              latitude
            ) ||
            !Number.isFinite(
              longitude
            )
          ) {
            throw new Error(
              "The browser returned invalid GPS coordinates."
            );
          }


          /*
           * These exact coordinates are sent
           * to the existing PhilaLink weather
           * endpoint.
           */
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


          setCurrentCoordinates({
            latitude,
            longitude,
          });


          setGpsAccuracy(
            Number.isFinite(
              accuracy
            )
              ? accuracy
              : null
          );


          setError("");

          setLocationError("");


          lastRefreshRef.current =
            Date.now();


          if (!background) {
            setLoading(
              false
            );
          }


          /*
           * The secondary AI tip also gets the
           * same precise coordinates.
           */
          void generateWeatherTip(
            latitude,
            longitude
          );
        } catch (
          locationWeatherError
        ) {
          console.error(
            "Failed to load precise current-location weather:",
            locationWeatherError
          );


          await useClinicFallback(
            locationWeatherError
          );
        } finally {
          if (!background) {
            setLoading(
              false
            );
          }
        }
      },
      [
        generateWeatherTip,
        loadClinicWeather,
      ]
    );


  /* =======================================================
     WEATHER REFRESH
  ======================================================= */

  useEffect(() => {
    void loadWeather();


    const intervalId =
      window.setInterval(
        () => {
          void loadWeather({
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


        /*
         * Refresh immediately after returning
         * to the app if the existing weather
         * reading is old enough.
         */
        if (
          elapsed >=
          WEATHER_REFRESH_INTERVAL_MS
        ) {
          void loadWeather({
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


  /* =======================================================
     DAY / NIGHT CLOCK REFRESH
  ======================================================= */

  useEffect(() => {
    const intervalId =
      window.setInterval(
        () => {
          setClockTime(
            Date.now()
          );
        },
        CLOCK_REFRESH_INTERVAL_MS
      );


    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          setClockTime(
            Date.now()
          );
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
  }, []);


  /* =======================================================
     MOBILE POPOVER
  ======================================================= */

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


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] sm:w-auto sm:px-3"
        aria-label="Loading precise weather"
        title="Getting your current location and weather"
      >
        <MapPin
          size={17}
          className="shrink-0 animate-pulse text-[#2563eb]"
        />


        <span className="ml-2 hidden text-xs sm:inline">
          Locating...
        </span>
      </div>
    );
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error ||
    !weather
  ) {
    return (
      <button
        type="button"
        onClick={() =>
          void loadWeather()
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


  /* =======================================================
     VIEW MODEL
  ======================================================= */

  const localDate =
    new Date(
      clockTime
    );


  const isNight =
    isNightTime(
      localDate
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


  /*
   * IMPORTANT:
   *
   * When current GPS is being used, do NOT
   * display weather.locationName as the
   * patient's physical location.
   *
   * That value can represent a weather
   * provider's nearest named observation
   * point or area.
   */
  const locationText =
    weatherSource ===
    "current"
      ? "Your current GPS location"
      : weather.locationName ||
        "Assigned clinic area";


  const periodLabel =
    isNight
      ? "Night"
      : "Day";


  const accuracyText =
    weatherSource ===
      "current" &&
    Number.isFinite(
      gpsAccuracy
    )
      ? `GPS accuracy ±${Math.round(
          gpsAccuracy
        )} m`
      : null;


  const title =
    weatherSource ===
    "current"
      ? `Weather at your current GPS location${
          accuracyText
            ? ` (${accuracyText})`
            : ""
        }`
      : `Using assigned clinic weather${
          weather.locationName
            ? `: ${weather.locationName}`
            : ""
        }`;


  /* =======================================================
     UI
  ======================================================= */

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
        aria-label={`${title}. ${description}. ${
          temperature ??
          ""
        } degrees Celsius. ${periodLabel}.`}
        aria-expanded={
          mobileDetailsOpen
        }
      >
        <WeatherVisual
          description={
            weather.description
          }
          isNight={
            isNight
          }
          size={19}
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
        <div className="absolute right-0 top-12 z-50 w-[250px] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl sm:hidden">

          <div className="flex items-start justify-between gap-3 border-b border-[#e2e8f0] px-4 py-3">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#64748b]">
                Weather
              </p>


              <p className="mt-0.5 text-sm font-semibold text-[#0f172a]">
                {weatherSource ===
                "current"
                  ? "Current-location weather"
                  : "Clinic weather"}
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

              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                  isNight
                    ? "bg-[#eff6ff]"
                    : "bg-[#fffbeb]"
                }`}
              >
                <WeatherVisual
                  description={
                    weather.description
                  }
                  isNight={
                    isNight
                  }
                  size={30}
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


                <div className="mt-1 flex items-center gap-1.5">

                  {isNight ? (
                    <Moon
                      size={12}
                      className="text-[#3b82f6]"
                    />
                  ) : (
                    <Sun
                      size={12}
                      className="text-[#f59e0b]"
                    />
                  )}


                  <span className="text-[11px] font-medium text-[#64748b]">
                    {periodLabel}
                  </span>
                </div>
              </div>
            </div>


            <div className="mt-4 rounded-xl bg-[#f8fafc] px-3 py-2.5">

              <div className="flex items-start gap-2">

                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-[#2563eb]"
                />


                <div className="min-w-0">

                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">
                    Location
                  </p>


                  <p className="mt-0.5 break-words text-xs font-medium text-[#475569]">
                    {locationText}
                  </p>


                  {accuracyText && (
                    <p className="mt-1 text-[11px] font-medium text-[#2563eb]">
                      {accuracyText}
                    </p>
                  )}
                </div>
              </div>


              {weatherSource ===
                "current" &&
                currentCoordinates && (
                  <div className="mt-2 border-t border-[#e2e8f0] pt-2">

                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">
                      GPS position
                    </p>


                    <p className="mt-0.5 break-all text-[10px] text-[#64748b]">
                      {currentCoordinates.latitude.toFixed(
                        6
                      )}
                      ,{" "}
                      {currentCoordinates.longitude.toFixed(
                        6
                      )}
                    </p>
                  </div>
                )}
            </div>


            {locationError && (
              <div className="mt-3 rounded-xl bg-[#fff7ed] px-3 py-2.5">
                <p className="text-[11px] leading-4 text-[#9a3412]">
                  {locationError}
                </p>
              </div>
            )}


            {weatherSource ===
              "clinic" && (
              <p className="mt-3 text-[11px] leading-4 text-[#64748b]">
                Precise location was unavailable, so PhilaLink is showing weather for your assigned clinic area.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}