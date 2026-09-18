import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  AlertCircle,
  Clock,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  clinicsApi,
} from "../../services/api/clinics.js";


const defaultCentre = {
  latitude: -30.5595,
  longitude: 22.9375,
};


const clinicMarkerIcon =
  L.divIcon({
    className: "",

    html: `
      <div
        style="
          width:34px;
          height:34px;
          border-radius:50%;
          background:#0f766e;
          border:3px solid #ffffff;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 3px 10px rgba(15,23,42,.25);
          color:white;
          font-size:16px;
          font-weight:700;
        "
      >
        +
      </div>
    `,

    iconSize: [
      34,
      34,
    ],

    iconAnchor: [
      17,
      17,
    ],

    popupAnchor: [
      0,
      -16,
    ],
  });


const patientMarkerIcon =
  L.divIcon({
    className: "",

    html: `
      <div
        style="
          width:22px;
          height:22px;
          border-radius:50%;
          background:#2563eb;
          border:4px solid #ffffff;
          box-shadow:0 2px 10px rgba(37,99,235,.4);
        "
      ></div>
    `,

    iconSize: [
      22,
      22,
    ],

    iconAnchor: [
      11,
      11,
    ],
  });


function calculateDistanceKm(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const earthRadiusKm =
    6371;

  const toRadians =
    (degrees) =>
      (degrees * Math.PI) /
      180;

  const latitudeDifference =
    toRadians(
      latitude2 -
        latitude1
    );

  const longitudeDifference =
    toRadians(
      longitude2 -
        longitude1
    );

  const firstLatitude =
    toRadians(latitude1);

  const secondLatitude =
    toRadians(latitude2);

  const a =
    Math.sin(
      latitudeDifference /
        2
    ) **
      2 +
    Math.cos(
      firstLatitude
    ) *
      Math.cos(
        secondLatitude
      ) *
      Math.sin(
        longitudeDifference /
          2
      ) **
        2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return (
    earthRadiusKm *
    c
  );
}


function formatTime(value) {
  if (!value) {
    return null;
  }

  const text =
    String(value);

  if (
    /^\d{2}:\d{2}/.test(
      text
    )
  ) {
    return text.slice(
      0,
      5
    );
  }

  return text;
}


function getClinicOpenState(
  clinic
) {
  if (
    !clinic?.openingTime ||
    !clinic?.closingTime
  ) {
    return {
      known: false,
      open: false,
      label:
        "Hours unavailable",
    };
  }

  const opening =
    formatTime(
      clinic.openingTime
    );

  const closing =
    formatTime(
      clinic.closingTime
    );

  if (
    !opening ||
    !closing
  ) {
    return {
      known: false,
      open: false,
      label:
        "Hours unavailable",
    };
  }

  const now =
    new Date();

  const currentMinutes =
    now.getHours() *
      60 +
    now.getMinutes();

  const [
    openHour,
    openMinute,
  ] =
    opening
      .split(":")
      .map(Number);

  const [
    closeHour,
    closeMinute,
  ] =
    closing
      .split(":")
      .map(Number);

  const openMinutes =
    openHour * 60 +
    openMinute;

  const closeMinutes =
    closeHour * 60 +
    closeMinute;

  const open =
    currentMinutes >=
      openMinutes &&
    currentMinutes <
      closeMinutes;

  return {
    known: true,
    open,

    label: open
      ? "Open"
      : "Closed",
  };
}


function getLocationErrorMessage(
  geoError
) {
  if (!geoError) {
    return (
      "Location unavailable."
    );
  }

  if (
    geoError.code ===
    geoError.PERMISSION_DENIED
  ) {
    return (
      "Location access denied. Enable location access in your browser settings to use navigation."
    );
  }

  if (
    geoError.code ===
    geoError.POSITION_UNAVAILABLE
  ) {
    return (
      "Your current location could not be determined."
    );
  }

  if (
    geoError.code ===
    geoError.TIMEOUT
  ) {
    return (
      "Location request timed out. Please try again."
    );
  }

  return (
    "Location unavailable."
  );
}


function formatRouteDistance(
  metres
) {
  if (
    !Number.isFinite(
      Number(metres)
    )
  ) {
    return "";
  }

  const value =
    Number(metres);

  if (value < 1000) {
    return `${Math.round(
      value
    )} m`;
  }

  return `${(
    value / 1000
  ).toFixed(1)} km`;
}


function formatRouteDuration(
  seconds
) {
  if (
    !Number.isFinite(
      Number(seconds)
    )
  ) {
    return "";
  }

  const minutes =
    Math.max(
      1,
      Math.round(
        Number(seconds) /
          60
      )
    );

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  const remainingMinutes =
    minutes % 60;

  if (
    remainingMinutes === 0
  ) {
    return `${hours} hr`;
  }

  return (
    `${hours} hr ` +
    `${remainingMinutes} min`
  );
}


function getDirectionText(
  step,
  destinationName
) {
  const maneuver =
    step?.maneuver ||
    {};

  const type =
    String(
      maneuver.type ||
        ""
    )
      .trim()
      .toLowerCase();

  const modifier =
    String(
      maneuver.modifier ||
        ""
    )
      .trim()
      .toLowerCase()
      .replaceAll("_", " ");

  const roadName =
    String(
      step?.name || ""
    ).trim();

  const roadText =
    roadName
      ? ` onto ${roadName}`
      : "";

  if (
    type === "depart"
  ) {
    return roadName
      ? `Start on ${roadName}`
      : "Start from your current location";
  }

  if (
    type === "arrive"
  ) {
    return (
      `Arrive at ${
        destinationName ||
        "the clinic"
      }`
    );
  }

  if (
    type ===
      "roundabout" ||
    type === "rotary"
  ) {
    return roadName
      ? `Enter the roundabout and continue onto ${roadName}`
      : "Enter the roundabout";
  }

  if (
    type === "merge"
  ) {
    return (
      `Merge${
        modifier
          ? ` ${modifier}`
          : ""
      }${roadText}`
    );
  }

  if (
    type === "fork"
  ) {
    return (
      `Keep ${
        modifier ||
        "ahead"
      }${roadText}`
    );
  }

  if (
    type === "on ramp"
  ) {
    return (
      `Take the ramp${
        modifier
          ? ` ${modifier}`
          : ""
      }${roadText}`
    );
  }

  if (
    type === "off ramp"
  ) {
    return (
      `Take the exit${
        modifier
          ? ` ${modifier}`
          : ""
      }${roadText}`
    );
  }

  if (
    type === "turn" ||
    type === "end of road"
  ) {
    if (
      modifier ===
      "straight"
    ) {
      return (
        `Continue straight${roadText}`
      );
    }

    return (
      `Turn ${
        modifier ||
        "ahead"
      }${roadText}`
    );
  }

  if (
    type ===
      "continue" ||
    type ===
      "new name"
  ) {
    if (modifier) {
      return (
        `Continue ${modifier}${roadText}`
      );
    }

    return (
      `Continue${roadText}`
    );
  }

  if (roadName) {
    return (
      `Continue onto ${roadName}`
    );
  }

  return "Continue";
}


function MapController({
  latitude,
  longitude,
  routeCoordinates,
}) {
  const map =
    useMap();

  useEffect(() => {
    if (
      Array.isArray(
        routeCoordinates
      ) &&
      routeCoordinates.length >
        1
    ) {
      const bounds =
        L.latLngBounds(
          routeCoordinates
        );

      map.fitBounds(
        bounds,
        {
          padding: [
            40,
            40,
          ],

          maxZoom: 16,
        }
      );

      return;
    }

    if (
      Number.isFinite(
        latitude
      ) &&
      Number.isFinite(
        longitude
      )
    ) {
      map.flyTo(
        [
          latitude,
          longitude,
        ],
        12,
        {
          duration: 1,
        }
      );
    }
  }, [
    latitude,
    longitude,
    routeCoordinates,
    map,
  ]);

  return null;
}


function LoadingList() {
  return (
    <div className="p-lg flex flex-col gap-md">
      {[
        1,
        2,
        3,
      ].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse border-b border-border-secondary pb-lg"
          >
            <div className="h-4 w-52 rounded bg-border-secondary mb-sm" />

            <div className="h-3 w-36 rounded bg-border-secondary mb-sm" />

            <div className="h-3 w-64 rounded bg-border-secondary" />
          </div>
        )
      )}
    </div>
  );
}


export default function NearestClinicsPage() {
  const [
    clinics,
    setClinics,
  ] =
    useState([]);


  const [
    search,
    setSearch,
  ] =
    useState("");


  const [
    location,
    setLocation,
  ] =
    useState(null);


  const [
    locationError,
    setLocationError,
  ] =
    useState("");


  const [
    locationLoading,
    setLocationLoading,
  ] =
    useState(false);


  const [
    clinicsLoading,
    setClinicsLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  /* ===================================== */
  /* NAVIGATION STATE */
  /* ===================================== */

  const [
    navigationClinic,
    setNavigationClinic,
  ] =
    useState(null);


  const [
    routeCoordinates,
    setRouteCoordinates,
  ] =
    useState([]);


  const [
    routeSteps,
    setRouteSteps,
  ] =
    useState([]);


  const [
    routeDistance,
    setRouteDistance,
  ] =
    useState(null);


  const [
    routeDuration,
    setRouteDuration,
  ] =
    useState(null);


  const [
    routeLoading,
    setRouteLoading,
  ] =
    useState(false);


  const [
    routeError,
    setRouteError,
  ] =
    useState("");


  const loadClinics =
    useCallback(
      async () => {
        try {
          setClinicsLoading(
            true
          );

          setError("");

          const result =
            await clinicsApi.getAll();

          setClinics(
            Array.isArray(
              result
            )
              ? result.filter(
                  (
                    clinic
                  ) =>
                    clinic?.isActive !==
                    false
                )
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load clinics:",
            err
          );

          setClinics([]);

          setError(
            err?.message ||
              "We could not load clinics."
          );
        } finally {
          setClinicsLoading(
            false
          );
        }
      },
      []
    );


  const requestLocation =
    useCallback(
      async () => {
        if (
          !navigator.geolocation
        ) {
          const message =
            "Location services are not supported by this browser.";

          setLocationError(
            message
          );

          return null;
        }

        setLocationLoading(
          true
        );

        setLocationError("");

        return new Promise(
          (resolve) => {
            navigator.geolocation.getCurrentPosition(
              (
                position
              ) => {
                const nextLocation =
                  {
                    latitude:
                      position
                        .coords
                        .latitude,

                    longitude:
                      position
                        .coords
                        .longitude,
                  };

                setLocation(
                  nextLocation
                );

                setLocationLoading(
                  false
                );

                resolve(
                  nextLocation
                );
              },

              (
                geoError
              ) => {
                const message =
                  getLocationErrorMessage(
                    geoError
                  );

                setLocation(
                  null
                );

                setLocationError(
                  message
                );

                setLocationLoading(
                  false
                );

                resolve(null);
              },

              {
                enableHighAccuracy:
                  true,

                timeout: 10000,

                maximumAge: 60000,
              }
            );
          }
        );
      },
      []
    );


  useEffect(() => {
    loadClinics();

    void requestLocation();
  }, [
    loadClinics,
    requestLocation,
  ]);


  const clinicsWithDistance =
    useMemo(() => {
      return clinics
        .filter(
          (clinic) =>
            Number.isFinite(
              Number(
                clinic.latitude
              )
            ) &&
            Number.isFinite(
              Number(
                clinic.longitude
              )
            )
        )
        .map(
          (clinic) => {
            const latitude =
              Number(
                clinic.latitude
              );

            const longitude =
              Number(
                clinic.longitude
              );

            const distance =
              location
                ? calculateDistanceKm(
                    location.latitude,
                    location.longitude,
                    latitude,
                    longitude
                  )
                : null;

            return {
              ...clinic,

              latitude,
              longitude,
              distance,
            };
          }
        )
        .sort(
          (
            first,
            second
          ) => {
            if (
              first.distance ==
                null &&
              second.distance ==
                null
            ) {
              return first.name.localeCompare(
                second.name
              );
            }

            if (
              first.distance ==
              null
            ) {
              return 1;
            }

            if (
              second.distance ==
              null
            ) {
              return -1;
            }

            return (
              first.distance -
              second.distance
            );
          }
        );
    }, [
      clinics,
      location,
    ]);


  const visibleClinics =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return (
          clinicsWithDistance
        );
      }

      return clinicsWithDistance.filter(
        (clinic) =>
          [
            clinic.name,
            clinic.type,
            clinic.address,
            clinic.services,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }, [
      clinicsWithDistance,
      search,
    ]);


  const mapCentre =
    location ??
    (
      visibleClinics.length >
      0
        ? {
            latitude:
              visibleClinics[0]
                .latitude,

            longitude:
              visibleClinics[0]
                .longitude,
          }
        : defaultCentre
    );


  /* ===================================== */
  /* CREATE LEAFLET ROAD ROUTE */
  /* ===================================== */

  const buildRoute =
    useCallback(
      async (
        clinic,
        startLocation
      ) => {
        if (
          !clinic ||
          !startLocation
        ) {
          return;
        }

        setNavigationClinic(
          clinic
        );

        setRouteLoading(
          true
        );

        setRouteError("");

        setRouteCoordinates(
          []
        );

        setRouteSteps([]);

        setRouteDistance(
          null
        );

        setRouteDuration(
          null
        );

        try {
          const startLatitude =
            Number(
              startLocation.latitude
            );

          const startLongitude =
            Number(
              startLocation.longitude
            );

          const destinationLatitude =
            Number(
              clinic.latitude
            );

          const destinationLongitude =
            Number(
              clinic.longitude
            );

          if (
            !Number.isFinite(
              startLatitude
            ) ||
            !Number.isFinite(
              startLongitude
            ) ||
            !Number.isFinite(
              destinationLatitude
            ) ||
            !Number.isFinite(
              destinationLongitude
            )
          ) {
            throw new Error(
              "Valid map coordinates are required for navigation."
            );
          }

          const url =
            "https://router.project-osrm.org/route/v1/driving/" +
            `${startLongitude},${startLatitude};` +
            `${destinationLongitude},${destinationLatitude}` +
            "?overview=full&geometries=geojson&steps=true";

          const response =
            await fetch(
              url,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          if (
            !response.ok
          ) {
            throw new Error(
              "Navigation route could not be calculated."
            );
          }

          const data =
            await response.json();

          if (
            data?.code !==
              "Ok" ||
            !Array.isArray(
              data?.routes
            ) ||
            data.routes.length ===
              0
          ) {
            throw new Error(
              "No driving route was found to this clinic."
            );
          }

          const route =
            data.routes[0];

          const coordinates =
            Array.isArray(
              route?.geometry
                ?.coordinates
            )
              ? route.geometry.coordinates
                  .map(
                    (
                      coordinate
                    ) => {
                      const [
                        longitude,
                        latitude,
                      ] =
                        coordinate;

                      return [
                        Number(
                          latitude
                        ),
                        Number(
                          longitude
                        ),
                      ];
                    }
                  )
                  .filter(
                    (
                      coordinate
                    ) =>
                      Number.isFinite(
                        coordinate[0]
                      ) &&
                      Number.isFinite(
                        coordinate[1]
                      )
                  )
              : [];

          if (
            coordinates.length <
            2
          ) {
            throw new Error(
              "The navigation route did not contain enough map data."
            );
          }

          const steps =
            Array.isArray(
              route?.legs
            )
              ? route.legs.flatMap(
                  (leg) =>
                    Array.isArray(
                      leg?.steps
                    )
                      ? leg.steps
                      : []
                )
              : [];

          setRouteCoordinates(
            coordinates
          );

          setRouteDistance(
            Number(
              route.distance
            )
          );

          setRouteDuration(
            Number(
              route.duration
            )
          );

          setRouteSteps(
            steps.map(
              (
                step,
                index
              ) => ({
                id:
                  `${index}-${step?.maneuver?.location?.join("-") || "step"}`,

                instruction:
                  getDirectionText(
                    step,
                    clinic.name
                  ),

                distance:
                  Number(
                    step?.distance
                  ),

                duration:
                  Number(
                    step?.duration
                  ),
              })
            )
          );
        } catch (err) {
          console.error(
            "Navigation route failed:",
            err
          );

          setRouteError(
            err?.message ||
              "Navigation is currently unavailable."
          );

          setRouteCoordinates(
            []
          );

          setRouteSteps([]);
        } finally {
          setRouteLoading(
            false
          );
        }
      },
      []
    );


  const startNavigation =
    useCallback(
      async (
        clinic
      ) => {
        setRouteError("");

        let currentLocation =
          location;

        if (
          !currentLocation
        ) {
          currentLocation =
            await requestLocation();
        }

        if (
          !currentLocation
        ) {
          setRouteError(
            "Your current location is required before navigation can begin."
          );

          return;
        }

        await buildRoute(
          clinic,
          currentLocation
        );
      },
      [
        location,
        requestLocation,
        buildRoute,
      ]
    );


  const refreshNavigation =
    useCallback(
      async () => {
        if (
          !navigationClinic
        ) {
          return;
        }

        const latestLocation =
          await requestLocation();

        if (
          !latestLocation
        ) {
          setRouteError(
            "Your current location could not be updated."
          );

          return;
        }

        await buildRoute(
          navigationClinic,
          latestLocation
        );
      },
      [
        navigationClinic,
        requestLocation,
        buildRoute,
      ]
    );


  const stopNavigation =
    useCallback(() => {
      setNavigationClinic(
        null
      );

      setRouteCoordinates(
        []
      );

      setRouteSteps([]);

      setRouteDistance(
        null
      );

      setRouteDuration(
        null
      );

      setRouteError("");
    }, []);


  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="mb-lg lg:mb-xl">
        <h1 className="text-title text-text-primary">
          Nearest Clinics
        </h1>

        <p className="mt-xs text-label-sm text-text-secondary">
          Find active PhilaLink
          healthcare facilities and
          navigate to them directly
          from the map.
        </p>
      </div>


      {/* ===================================== */}
      {/* CLINIC ERROR */}
      {/* ===================================== */}

      {error && (
        <div className="mb-lg flex items-start gap-md rounded-corner-lg border border-danger/20 bg-danger/10 p-md">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-danger"
          />

          <div>
            <p className="text-label-sm text-text-primary">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadClinics
              }
              className="mt-xs text-label-sm text-brand-primary hover:opacity-70"
            >
              Try again
            </button>
          </div>
        </div>
      )}


      {/* ===================================== */}
      {/* MAIN LAYOUT */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,.8fr)] lg:gap-xl">

        {/* =================================== */}
        {/* MAP */}
        {/* =================================== */}

        <div className="overflow-hidden rounded-corner-lg bg-surface-bg border border-border-secondary">
          <div className="border-b border-border-secondary p-lg">
            <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-label-sm font-semibold text-text-primary">
                  {navigationClinic
                    ? `Navigating to ${navigationClinic.name}`
                    : location
                    ? "Using your current location"
                    : "Location unavailable"}
                </p>

                <p className="mt-xs text-video-title text-text-secondary">
                  {navigationClinic
                    ? "Your route is displayed directly on the PhilaLink map."
                    : location
                    ? "Clinics are sorted by distance from you."
                    : locationError ||
                      "Allow location access to see accurate distances."}
                </p>
              </div>


              <div className="flex flex-wrap items-center gap-sm">
                {navigationClinic && (
                  <button
                    type="button"
                    onClick={
                      stopNavigation
                    }
                    className="inline-flex items-center justify-center gap-xs rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm font-medium text-text-primary transition hover:bg-bg-faint"
                  >
                    <X
                      size={15}
                    />

                    End navigation
                  </button>
                )}


                <button
                  type="button"
                  onClick={
                    navigationClinic
                      ? refreshNavigation
                      : requestLocation
                  }
                  disabled={
                    locationLoading ||
                    routeLoading
                  }
                  className="inline-flex items-center justify-center gap-xs rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm font-medium text-text-primary transition hover:bg-bg-faint disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationLoading ||
                  routeLoading ? (
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                  ) : navigationClinic ? (
                    <Navigation
                      size={15}
                    />
                  ) : (
                    <LocateFixed
                      size={15}
                    />
                  )}

                  {locationLoading
                    ? "Locating..."
                    : routeLoading
                    ? "Loading route..."
                    : navigationClinic
                    ? "Refresh route"
                    : "Use my location"}
                </button>
              </div>
            </div>


            {locationError && (
              <div className="mt-md rounded-corner-md bg-[#fff7ed] px-md py-sm text-video-title text-[#9a3412]">
                {locationError}
              </div>
            )}


            {routeError && (
              <div className="mt-md flex items-start gap-sm rounded-corner-md bg-danger/10 px-md py-sm text-video-title text-danger">
                <AlertCircle
                  size={15}
                  className="mt-[1px] shrink-0"
                />

                <span>
                  {routeError}
                </span>
              </div>
            )}
          </div>


          {/* ================================= */}
          {/* LEAFLET MAP */}
          {/* ================================= */}

          <div className="h-[420px] w-full sm:h-[500px] lg:h-[620px]">
            <MapContainer
              center={[
                mapCentre.latitude,
                mapCentre.longitude,
              ]}
              zoom={11}
              scrollWheelZoom
              className="h-full w-full"
            >
              <MapController
                latitude={
                  mapCentre.latitude
                }
                longitude={
                  mapCentre.longitude
                }
                routeCoordinates={
                  routeCoordinates
                }
              />


              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {/* CURRENT LOCATION */}

              {location && (
                <Marker
                  position={[
                    location.latitude,
                    location.longitude,
                  ]}
                  icon={
                    patientMarkerIcon
                  }
                >
                  <Popup>
                    Your current
                    location
                  </Popup>
                </Marker>
              )}


              {/* ROUTE */}

              {routeCoordinates.length >
                1 && (
                <Polyline
                  positions={
                    routeCoordinates
                  }
                  pathOptions={{
                    color:
                      "#0f766e",

                    weight: 6,

                    opacity: 0.9,
                  }}
                />
              )}


              {/* CLINICS */}

              {visibleClinics.map(
                (
                  clinic
                ) => (
                  <Marker
                    key={
                      clinic.id
                    }
                    position={[
                      clinic.latitude,
                      clinic.longitude,
                    ]}
                    icon={
                      clinicMarkerIcon
                    }
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <strong>
                          {
                            clinic.name
                          }
                        </strong>


                        {clinic.type && (
                          <div
                            style={{
                              marginTop:
                                4,
                            }}
                          >
                            {
                              clinic.type
                            }
                          </div>
                        )}


                        {clinic.distance !=
                          null && (
                          <div
                            style={{
                              marginTop:
                                4,
                            }}
                          >
                            {clinic.distance.toFixed(
                              1
                            )}{" "}
                            km away
                          </div>
                        )}


                        <button
                          type="button"
                          onClick={() =>
                            startNavigation(
                              clinic
                            )
                          }
                          style={{
                            marginTop:
                              10,

                            border: 0,

                            borderRadius:
                              6,

                            padding:
                              "7px 10px",

                            background:
                              "#0f766e",

                            color:
                              "#ffffff",

                            cursor:
                              "pointer",

                            fontSize:
                              12,

                            fontWeight:
                              600,
                          }}
                        >
                          Navigate
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              )}
            </MapContainer>
          </div>


          {/* ================================= */}
          {/* TURN-BY-TURN NAVIGATION */}
          {/* ================================= */}

          {navigationClinic && (
            <div className="border-t border-border-secondary bg-white">
              <div className="flex flex-col gap-md border-b border-border-secondary p-lg sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-sm">
                    <Navigation
                      size={18}
                      className="text-brand-primary"
                    />

                    <h2 className="text-label font-semibold text-text-primary">
                      Directions to{" "}
                      {
                        navigationClinic.name
                      }
                    </h2>
                  </div>


                  {navigationClinic.address && (
                    <p className="mt-xs text-video-title text-text-secondary">
                      {
                        navigationClinic.address
                      }
                    </p>
                  )}
                </div>


                {routeDistance !=
                  null &&
                  routeDuration !=
                    null && (
                    <div className="flex items-center gap-lg">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-text-tertiary">
                          Distance
                        </p>

                        <p className="mt-[2px] text-label-sm font-semibold text-text-primary">
                          {formatRouteDistance(
                            routeDistance
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-text-tertiary">
                          Estimated
                        </p>

                        <p className="mt-[2px] text-label-sm font-semibold text-text-primary">
                          {formatRouteDuration(
                            routeDuration
                          )}
                        </p>
                      </div>
                    </div>
                  )}
              </div>


              {routeLoading ? (
                <div className="flex items-center gap-sm p-lg text-label-sm text-text-secondary">
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />

                  Calculating your
                  route...
                </div>
              ) : routeSteps.length >
                0 ? (
                <div className="max-h-[280px] overflow-y-auto">
                  {routeSteps.map(
                    (
                      step,
                      index
                    ) => (
                      <div
                        key={
                          step.id
                        }
                        className={`flex items-start gap-md p-md ${
                          index <
                          routeSteps.length -
                            1
                            ? "border-b border-border-secondary"
                            : ""
                        }`}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] text-[11px] font-semibold text-brand-primary">
                          {index +
                            1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-label-sm font-medium text-text-primary">
                            {
                              step.instruction
                            }
                          </p>

                          {Number.isFinite(
                            step.distance
                          ) &&
                            step.distance >
                              0 && (
                              <p className="mt-[3px] text-video-title text-text-secondary">
                                {formatRouteDistance(
                                  step.distance
                                )}
                              </p>
                            )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>


        {/* =================================== */}
        {/* CLINIC LIST */}
        {/* =================================== */}

        <div className="flex min-h-0 flex-col rounded-corner-lg bg-surface-bg border border-border-secondary">
          <div className="border-b border-border-secondary p-lg">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              />

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search clinics"
                className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
              />
            </div>
          </div>


          <div className="flex-1 overflow-y-auto">
            {clinicsLoading ? (
              <LoadingList />
            ) : visibleClinics.length ===
              0 ? (
              <div className="p-xl text-center">
                <MapPin
                  size={26}
                  className="mx-auto text-text-tertiary"
                />

                <p className="mt-md text-label font-semibold text-text-primary">
                  No clinics found
                </p>

                <p className="mt-xs text-label-sm text-text-secondary">
                  Try changing your
                  search.
                </p>
              </div>
            ) : (
              visibleClinics.map(
                (
                  clinic,
                  index
                ) => {
                  const state =
                    getClinicOpenState(
                      clinic
                    );

                  const isNavigating =
                    navigationClinic?.id ===
                    clinic.id;

                  return (
                    <div
                      key={
                        clinic.id
                      }
                      className={`p-lg ${
                        isNavigating
                          ? "bg-[#f0fdfa]"
                          : ""
                      } ${
                        index <
                        visibleClinics.length -
                          1
                          ? "border-b border-border-secondary"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-md">
                        <div className="min-w-0 flex-1">

                          {/* CLINIC TITLE */}

                          <div className="flex flex-wrap items-center gap-sm">
                            <h3 className="text-label-sm font-semibold text-text-primary">
                              {
                                clinic.name
                              }
                            </h3>


                            {state.known && (
                              <span
                                className={`rounded-corner-full px-sm py-[2px] text-[11px] font-medium ${
                                  state.open
                                    ? "bg-[#dcfce7] text-[#166534]"
                                    : "bg-[#f1f5f9] text-[#475569]"
                                }`}
                              >
                                {
                                  state.label
                                }
                              </span>
                            )}


                            {isNavigating && (
                              <span className="rounded-corner-full bg-brand-primary px-sm py-[2px] text-[11px] font-medium text-white">
                                Navigating
                              </span>
                            )}
                          </div>


                          {clinic.type && (
                            <p className="mt-xs text-video-title text-text-secondary">
                              {
                                clinic.type
                              }
                            </p>
                          )}


                          {/* DETAILS */}

                          <div className="mt-md flex flex-col gap-sm">
                            {clinic.address && (
                              <div className="flex items-start gap-xs">
                                <MapPin
                                  size={13}
                                  className="mt-[2px] shrink-0 text-text-tertiary"
                                />

                                <span className="text-video-title text-text-secondary">
                                  {
                                    clinic.address
                                  }
                                </span>
                              </div>
                            )}


                            {clinic.contactNumber && (
                              <div className="flex items-center gap-xs">
                                <Phone
                                  size={13}
                                  className="shrink-0 text-text-tertiary"
                                />

                                <a
                                  href={`tel:${clinic.contactNumber}`}
                                  className="text-video-title text-text-secondary hover:text-brand-primary"
                                >
                                  {
                                    clinic.contactNumber
                                  }
                                </a>
                              </div>
                            )}


                            {clinic.openingTime &&
                              clinic.closingTime && (
                                <div className="flex items-center gap-xs">
                                  <Clock
                                    size={13}
                                    className="shrink-0 text-text-tertiary"
                                  />

                                  <span className="text-video-title text-text-secondary">
                                    {formatTime(
                                      clinic.openingTime
                                    )}{" "}
                                    –{" "}
                                    {formatTime(
                                      clinic.closingTime
                                    )}
                                  </span>
                                </div>
                              )}


                            {clinic.distance !=
                              null && (
                              <div className="flex items-center gap-xs">
                                <Navigation
                                  size={13}
                                  className="shrink-0 text-brand-primary"
                                />

                                <span className="text-video-title text-text-secondary">
                                  {clinic.distance.toFixed(
                                    1
                                  )}{" "}
                                  km away
                                </span>
                              </div>
                            )}
                          </div>


                          {clinic.services && (
                            <p className="mt-md text-video-title text-text-secondary">
                              {
                                clinic.services
                              }
                            </p>
                          )}


                          {/* ================================= */}
                          {/* IN-APP LEAFLET DIRECTIONS BUTTON */}
                          {/* ================================= */}

                          <div className="mt-md">
                            {isNavigating ? (
                              <button
                                type="button"
                                onClick={
                                  stopNavigation
                                }
                                className="inline-flex items-center gap-xs text-label-sm font-medium text-danger hover:opacity-70"
                              >
                                <X
                                  size={14}
                                />

                                End navigation
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  startNavigation(
                                    clinic
                                  )
                                }
                                disabled={
                                  routeLoading
                                }
                                className="inline-flex items-center gap-xs text-label-sm font-medium text-brand-primary hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Navigation
                                  size={14}
                                />

                                Directions
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
      </div>


      <div className="h-20 lg:hidden" />
    </div>
  );
}
