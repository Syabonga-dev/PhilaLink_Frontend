import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
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

const GPS_COLLECTION_WINDOW_MS =
  10000;

const GPS_TARGET_ACCURACY_METRES =
  20;


/* =========================================================
   DAY / NIGHT
========================================================= */

function isNightTime(
  date
) {
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
      description ||
        ""
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
  size = 20,
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
          size={
            size
          }
          strokeWidth={
            2
          }
          className="shrink-0 text-[#2563eb]"
          aria-hidden="true"
        />
      );
    }


    return (
      <Sun
        size={
          size
        }
        strokeWidth={
          2
        }
        className="shrink-0 text-[#f59e0b]"
        aria-hidden="true"
      />
    );
  }


  if (
    kind ===
    "partly-cloudy"
  ) {
    if (isNight) {
      return (
        <CloudMoon
          size={
            size
          }
          strokeWidth={
            2
          }
          className="shrink-0 text-[#2563eb]"
          aria-hidden="true"
        />
      );
    }


    return (
      <CloudSun
        size={
          size
        }
        strokeWidth={
          2
        }
        className="shrink-0 text-[#f59e0b]"
        aria-hidden="true"
      />
    );
  }


  if (
    kind ===
    "overcast"
  ) {
    return (
      <Cloud
        size={
          size
        }
        strokeWidth={
          2
        }
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
        size={
          size
        }
        strokeWidth={
          2
        }
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
        size={
          size
        }
        strokeWidth={
          2
        }
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
        size={
          size
        }
        strokeWidth={
          2
        }
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
        size={
          size
        }
        strokeWidth={
          2
        }
        className="shrink-0 text-[#94a3b8]"
        aria-hidden="true"
      />
    );
  }


  return (
    <Cloud
      size={
        size
      }
      strokeWidth={
        2
      }
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
  if (
    !description
  ) {
    return "Weather";
  }


  return description
    .split(" ")
    .filter(
      Boolean
    )
    .map(
      (
        word
      ) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}


/* =========================================================
   LOCATION ACCURACY
========================================================= */

function formatLocationAccuracy(
  accuracy
) {
  const value =
    Number(
      accuracy
    );


  if (
    !Number.isFinite(
      value
    ) ||
    value < 0
  ) {
    return "";
  }


  if (
    value <
    1000
  ) {
    return `±${Math.round(
      value
    )} m`;
  }


  return `±${(
    value /
    1000
  ).toFixed(
    value >= 10000
      ? 0
      : 1
  )} km`;
}


/* =========================================================
   HIGH ACCURACY POSITION

   Collect more than one location sample and keep the
   best accuracy reading returned by the browser.
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
            navigator
              .geolocation
              .clearWatch(
                watchId
              );
          }

          if (
            timerId !==
            null
          ) {
            window
              .clearTimeout(
                timerId
              );
          }
        };


      const finish =
        () => {
          if (
            settled
          ) {
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
        navigator
          .geolocation
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

              if (
                geoError.code ===
                geoError.PERMISSION_DENIED
              ) {
                finish();
              }
            },


            {
              enableHighAccuracy:
                true,

              maximumAge:
                0,

              timeout:
                GPS_COLLECTION_WINDOW_MS,
            }
          );


      timerId =
        window
          .setTimeout(
            finish,
            GPS_COLLECTION_WINDOW_MS
          );
    }
  );
}


/* =========================================================
   LOCATION ERROR
========================================================= */

function getLocationErrorMessage(
  error
) {
  if (
    !error
  ) {
    return (
      "Location unavailable."
    );
  }


  if (
    error.code === 1
  ) {
    return (
      "Precise location access was denied."
    );
  }


  if (
    error.code === 2
  ) {
    return (
      "Your current location could not be determined."
    );
  }


  if (
    error.code === 3
  ) {
    return (
      "The location request timed out."
    );
  }


  return (
    error.message ||
    "Location unavailable."
  );
}


/* =========================================================
   WEATHER CHIP
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
    locationAccuracy,
    setLocationAccuracy,
  ] =
    useState(null);

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
     CLINIC FALLBACK WEATHER
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

        /*
         * Clinic fallback is not using the browser's
         * current GPS coordinates.
         */
        setLocationAccuracy(
          null
        );

        setError("");

        lastRefreshRef.current =
          Date.now();


        if (
          !background
        ) {
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
        if (
          !background
        ) {
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
            if (
              geoError
            ) {
              setLocationError(
                getLocationErrorMessage(
                  geoError
                )
              );
            }


            setLocationAccuracy(
              null
            );


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

              if (
                !background
              ) {
                setWeather(
                  null
                );

                setWeatherSource(
                  ""
                );

                setLocationAccuracy(
                  null
                );

                setError(
                  clinicError
                    ?.message ||
                    "Weather unavailable."
                );
              }
            } finally {
              if (
                !background
              ) {
                setLoading(
                  false
                );
              }
            }
          };


        try {
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
              "The browser returned invalid location coordinates."
            );
          }


          if (
            Number.isFinite(
              accuracy
            )
          ) {
            setLocationAccuracy(
              accuracy
            );
          } else {
            setLocationAccuracy(
              null
            );
          }


          /*
           * The backend receives the actual browser
           * latitude and longitude.
           *
           * Any place name returned by the weather provider
           * is deliberately NOT used as the user's physical
           * location.
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

          setError("");

          setLocationError("");

          lastRefreshRef.current =
            Date.now();


          if (
            !background
          ) {
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

          await useClinicFallback(
            locationWeatherError
          );
        } finally {
          if (
            !background
          ) {
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
     INITIAL WEATHER + PERIODIC REFRESH
  ======================================================= */

  useEffect(
    () => {
      void loadWeather();


      const intervalId =
        window
          .setInterval(
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
            document
              .visibilityState !==
            "visible"
          ) {
            return;
          }


          const elapsed =
            Date.now() -
            lastRefreshRef
              .current;


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


      document
        .addEventListener(
          "visibilitychange",
          handleVisibilityChange
        );


      return () => {
        window
          .clearInterval(
            intervalId
          );

        document
          .removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );
      };
    },
    [
      loadWeather,
    ]
  );


  /* =======================================================
     CLOCK REFRESH
  ======================================================= */

  useEffect(
    () => {
      const intervalId =
        window
          .setInterval(
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
            document
              .visibilityState ===
            "visible"
          ) {
            setClockTime(
              Date.now()
            );
          }
        };


      document
        .addEventListener(
          "visibilitychange",
          handleVisibilityChange
        );


      return () => {
        window
          .clearInterval(
            intervalId
          );

        document
          .removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );
      };
    },
    []
  );


  /* =======================================================
     MOBILE DETAILS CLOSE HANDLERS
  ======================================================= */

  useEffect(
    () => {
      if (
        !mobileDetailsOpen
      ) {
        return undefined;
      }


      const handlePointerDown =
        (
          event
        ) => {
          if (
            containerRef.current &&
            !containerRef
              .current
              .contains(
                event.target
              )
          ) {
            setMobileDetailsOpen(
              false
            );
          }
        };


      const handleKeyDown =
        (
          event
        ) => {
          if (
            event.key ===
            "Escape"
          ) {
            setMobileDetailsOpen(
              false
            );
          }
        };


      document
        .addEventListener(
          "pointerdown",
          handlePointerDown
        );

      document
        .addEventListener(
          "keydown",
          handleKeyDown
        );


      return () => {
        document
          .removeEventListener(
            "pointerdown",
            handlePointerDown
          );

        document
          .removeEventListener(
            "keydown",
            handleKeyDown
          );
      };
    },
    [
      mobileDetailsOpen,
    ]
  );


  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading
  ) {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] sm:w-auto sm:px-3"
        aria-label="Loading weather"
        title="Loading weather"
      >
        <MapPin
          size={
            17
          }
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
          size={
            18
          }
          className="shrink-0 text-[#64748b]"
        />

        <span className="ml-2 hidden text-xs font-medium sm:inline">
          Weather unavailable
        </span>
      </button>
    );
  }


  /* =======================================================
     DISPLAY VALUES
  ======================================================= */

  const isNight =
    isNightTime(
      new Date(
        clockTime
      )
    );


  const temperatureValue =
    Number(
      weather
        .temperatureC
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
      weather
        .description
    );


  const formattedAccuracy =
    formatLocationAccuracy(
      locationAccuracy
    );


  /*
   * IMPORTANT:
   *
   * Do not use weather.locationName as the patient's
   * physical location.
   *
   * Weather providers may attach nearby station, airport,
   * suburb or municipality names to coordinates.
   *
   * The weather itself is still requested using the
   * browser-provided latitude and longitude.
   */
  const locationText =
    weatherSource ===
    "current"
      ? "Current location"
      : "Assigned clinic area";


  const title =
    weatherSource ===
    "current"
      ? formattedAccuracy
        ? `Weather at your current location · Location accuracy ${formattedAccuracy}`
        : "Weather at your current location"
      : "Using assigned clinic weather";


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

      {/* ================================================= */}
      {/* WEATHER CHIP */}
      {/* ================================================= */}

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
        title={
          title
        }
        aria-label={`${title}. ${description}. ${
          temperature ??
          ""
        } degrees Celsius.`}
        aria-expanded={
          mobileDetailsOpen
        }
      >
        <WeatherVisual
          description={
            weather
              .description
          }
          isNight={
            isNight
          }
          size={
            20
          }
        />


        {temperature !==
          null && (
          <span className="hidden shrink-0 text-sm font-semibold text-[#0f172a] sm:inline">
            {
              temperature
            }
            °C
          </span>
        )}


        <span className="hidden max-w-[120px] truncate text-xs text-[#64748b] xl:block">
          {
            description
          }
        </span>


        {weatherSource ===
          "clinic" && (
          <span className="hidden rounded-full bg-[#f1f5f9] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#64748b] 2xl:inline">
            Clinic
          </span>
        )}
      </button>


      {/* ================================================= */}
      {/* MOBILE DETAILS */}
      {/* ================================================= */}

      {mobileDetailsOpen && (
        <div className="absolute right-0 top-12 z-50 w-[260px] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl xl:hidden">
          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

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
                size={
                  15
                }
              />
            </button>
          </div>


          {/* ============================================= */}
          {/* WEATHER DETAILS */}
          {/* ============================================= */}

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
                    weather
                      .description
                  }
                  isNight={
                    isNight
                  }
                  size={
                    31
                  }
                />
              </div>


              <div className="min-w-0">

                {temperature !==
                  null && (
                  <p className="text-2xl font-bold leading-none text-[#0f172a]">
                    {
                      temperature
                    }
                    °C
                  </p>
                )}


                <p className="mt-1 text-sm font-medium text-[#475569]">
                  {
                    description
                  }
                </p>


                <div className="mt-1 flex items-center gap-1.5">

                  {isNight ? (
                    <Moon
                      size={
                        12
                      }
                      className="text-[#2563eb]"
                    />
                  ) : (
                    <Sun
                      size={
                        12
                      }
                      className="text-[#f59e0b]"
                    />
                  )}


                  <span className="text-[11px] font-medium text-[#64748b]">
                    {isNight
                      ? "Night"
                      : "Day"}
                  </span>
                </div>
              </div>
            </div>


            {/* =========================================== */}
            {/* LOCATION */}
            {/* =========================================== */}

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f8fafc] px-3 py-3">

              <MapPin
                size={
                  15
                }
                className="mt-0.5 shrink-0 text-[#2563eb]"
              />


              <div className="min-w-0">

                <p className="text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">
                  Location
                </p>


                <p className="mt-0.5 text-xs font-semibold text-[#475569]">
                  {
                    locationText
                  }
                </p>


                {weatherSource ===
                  "current" &&
                  formattedAccuracy && (
                    <p className="mt-1 text-[11px] leading-4 text-[#64748b]">
                      Browser accuracy{" "}
                      <span className="font-semibold text-[#334155]">
                        {
                          formattedAccuracy
                        }
                      </span>
                    </p>
                  )}
              </div>
            </div>


            {/* =========================================== */}
            {/* CURRENT LOCATION EXPLANATION */}
            {/* =========================================== */}

            {weatherSource ===
              "current" && (
              <p className="mt-3 text-[11px] leading-4 text-[#64748b]">
                Weather is requested using the latitude and longitude reported by your device. Nearby weather-station or airport names are not used as your location.
              </p>
            )}


            {/* =========================================== */}
            {/* LOCATION FAILURE / CLINIC FALLBACK */}
            {/* =========================================== */}

            {locationError &&
              weatherSource ===
                "clinic" && (
                <div className="mt-3 rounded-xl bg-[#fff7ed] px-3 py-2.5">

                  <p className="text-[11px] leading-4 text-[#9a3412]">
                    {
                      locationError
                    }
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
