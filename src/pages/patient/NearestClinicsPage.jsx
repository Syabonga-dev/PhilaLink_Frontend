import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import {
  Circle,
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

const MAX_RADIUS_KM =
  10;

const defaultCentre = {
  latitude:
    -30.5595,

  longitude:
    22.9375,
};

const facilityMarkerIcon =
  L.divIcon({
    className:
      "",

    html: `
      <div
        style="
          width:38px;
          height:38px;
          border-radius:50%;
          background:#0f766e;
          border:4px solid #ffffff;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 4px 14px rgba(15,23,42,.28);
          color:#ffffff;
          font-size:17px;
          font-weight:800;
        "
      >
        +
      </div>
    `,

    iconSize: [
      38,
      38,
    ],

    iconAnchor: [
      19,
      19,
    ],

    popupAnchor: [
      0,
      -19,
    ],
  });

function createPatientMarkerIcon(
  heading,
  navigating
) {
  const rotation =
    Number.isFinite(
      Number(
        heading
      )
    )
      ? Number(
          heading
        )
      : 0;

  return L.divIcon({
    className:
      "",

    html:
      navigating
        ? `
          <div style="width:46px;height:46px;display:flex;align-items:center;justify-content:center;position:relative;">
            <div style="position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(37,99,235,.16);"></div>
            <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:#2563eb;border:4px solid #ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(37,99,235,.45);transform:rotate(${rotation}deg);">
              <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:11px solid #ffffff;transform:translateY(-1px);"></div>
            </div>
          </div>
        `
        : `
          <div style="width:24px;height:24px;border-radius:50%;background:#2563eb;border:4px solid #ffffff;box-shadow:0 3px 12px rgba(37,99,235,.45);"></div>
        `,

    iconSize:
      navigating
        ? [
            46,
            46,
          ]
        : [
            24,
            24,
          ],

    iconAnchor:
      navigating
        ? [
            23,
            23,
          ]
        : [
            12,
            12,
          ],
  });
}

function calculateDistanceMetres(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const earthRadius =
    6371000;

  const toRadians =
    degrees =>
      (
        degrees *
        Math.PI
      ) /
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
    toRadians(
      latitude1
    );

  const secondLatitude =
    toRadians(
      latitude2
    );

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
      Math.sqrt(
        a
      ),
      Math.sqrt(
        1 -
          a
      )
    );

  return (
    earthRadius *
    c
  );
}

function calculateDistanceKm(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  return (
    calculateDistanceMetres(
      latitude1,
      longitude1,
      latitude2,
      longitude2
    ) /
    1000
  );
}

function isClinicOrHospital(
  facility
) {
  const text =
    [
      facility?.name,
      facility?.type,
    ]
      .filter(
        Boolean
      )
      .join(" ")
      .toLowerCase();

  return (
    text.includes(
      "clinic"
    ) ||
    text.includes(
      "hospital"
    ) ||
    text.includes(
      "health centre"
    ) ||
    text.includes(
      "health center"
    ) ||
    text.includes(
      "community health"
    )
  );
}

function formatTime(
  value
) {
  if (!value) {
    return null;
  }

  const text =
    String(
      value
    );

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
  clinic,
  t
) {
  if (
    !clinic
      ?.openingTime ||
    !clinic
      ?.closingTime
  ) {
    return {
      known:
        false,
      open:
        false,
      label:
        t(
          "clinics.hoursUnavailable"
        ),
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
      known:
        false,
      open:
        false,
      label:
        t(
          "clinics.hoursUnavailable"
        ),
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
      .map(
        Number
      );

  const [
    closeHour,
    closeMinute,
  ] =
    closing
      .split(":")
      .map(
        Number
      );

  const openMinutes =
    openHour *
      60 +
    openMinute;

  const closeMinutes =
    closeHour *
      60 +
    closeMinute;

  const open =
    currentMinutes >=
      openMinutes &&
    currentMinutes <
      closeMinutes;

  return {
    known:
      true,

    open,

    label:
      open
        ? t(
            "clinics.open"
          )
        : t(
            "clinics.closed"
          ),
  };
}

function getLocationErrorMessage(
  geoError,
  t
) {
  if (!geoError) {
    return t(
      "clinics.locationUnavailable"
    );
  }

  if (
    geoError.code ===
    geoError.PERMISSION_DENIED
  ) {
    return t(
      "clinics.locationDenied"
    );
  }

  if (
    geoError.code ===
    geoError.POSITION_UNAVAILABLE
  ) {
    return t(
      "clinics.locationPositionUnavailable"
    );
  }

  if (
    geoError.code ===
    geoError.TIMEOUT
  ) {
    return t(
      "clinics.locationTimeout"
    );
  }

  return t(
    "clinics.locationUnavailable"
  );
}

function formatRouteDistance(
  metres,
  t
) {
  const value =
    Number(
      metres
    );

  if (
    !Number.isFinite(
      value
    )
  ) {
    return "";
  }

  if (
    value <
    1000
  ) {
    return t(
      "clinics.metre",
      {
        count:
          Math.max(
            0,
            Math.round(
              value
            )
          ),
      }
    );
  }

  return `${(
    value /
    1000
  ).toFixed(1)} km`;
}

function formatRouteDuration(
  seconds,
  t
) {
  const value =
    Number(
      seconds
    );

  if (
    !Number.isFinite(
      value
    )
  ) {
    return "";
  }

  const minutes =
    Math.max(
      1,
      Math.round(
        value /
          60
      )
    );

  if (
    minutes <
    60
  ) {
    return t(
      "clinics.minute",
      {
        count:
          minutes,
      }
    );
  }

  const hours =
    Math.floor(
      minutes /
        60
    );

  const remainingMinutes =
    minutes %
    60;

  if (
    remainingMinutes ===
    0
  ) {
    return t(
      "clinics.hour",
      {
        count:
          hours,
      }
    );
  }

  return t(
    "clinics.hourMinutes",
    {
      hours,
      minutes:
        remainingMinutes,
    }
  );
}

function getDirectionText(
  step,
  destinationName,
  t
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
      .replace(
        /_/g,
        " "
      );

  const roadName =
    String(
      step?.name ||
        ""
    ).trim();

  const road =
    roadName
      ? t(
          "clinics.ontoRoad",
          {
            road:
              roadName,
          }
        )
      : "";

  const direction =
    modifier
      ? ` ${modifier}`
      : "";

  if (
    type ===
    "depart"
  ) {
    return roadName
      ? t(
          "clinics.startOn",
          {
            road:
              roadName,
          }
        )
      : t(
          "clinics.startCurrentLocation"
        );
  }

  if (
    type ===
    "arrive"
  ) {
    return t(
      "clinics.arriveAt",
      {
        destination:
          destinationName ||
          t(
            "clinics.theFacility"
          ),
      }
    );
  }

  if (
    type ===
      "roundabout" ||
    type ===
      "rotary"
  ) {
    return roadName
      ? t(
          "clinics.roundaboutRoad",
          {
            road:
              roadName,
          }
        )
      : t(
          "clinics.roundabout"
        );
  }

  if (
    type ===
    "merge"
  ) {
    return t(
      "clinics.merge",
      {
        direction,
        road,
      }
    );
  }

  if (
    type ===
    "fork"
  ) {
    return t(
      "clinics.keep",
      {
        direction:
          modifier ||
          t(
            "clinics.ahead"
          ),
        road,
      }
    );
  }

  if (
    type ===
    "on ramp"
  ) {
    return t(
      "clinics.ramp",
      {
        direction,
        road,
      }
    );
  }

  if (
    type ===
    "off ramp"
  ) {
    return t(
      "clinics.exit",
      {
        direction,
        road,
      }
    );
  }

  if (
    type ===
      "turn" ||
    type ===
      "end of road"
  ) {
    if (
      modifier ===
      "straight"
    ) {
      return t(
        "clinics.continueStraight",
        {
          road,
        }
      );
    }

    return t(
      "clinics.turn",
      {
        direction:
          modifier ||
          t(
            "clinics.ahead"
          ),
        road,
      }
    );
  }

  if (
    type ===
      "continue" ||
    type ===
      "new name"
  ) {
    return t(
      "clinics.continue",
      {
        direction,
        road,
      }
    );
  }

  if (
    roadName
  ) {
    return t(
      "clinics.continueOnto",
      {
        road:
          roadName,
      }
    );
  }

  return t(
    "clinics.continueRoute"
  );
}

function MapController({
  latitude,
  longitude,
  routeCoordinates,
  navigating,
  followUser,
}) {
  const map =
    useMap();

  useEffect(
    () => {
      if (
        navigating &&
        followUser &&
        Number.isFinite(
          latitude
        ) &&
        Number.isFinite(
          longitude
        )
      ) {
        map.setView(
          [
            latitude,
            longitude,
          ],
          16,
          {
            animate:
              true,
          }
        );

        return;
      }

      if (
        Array.isArray(
          routeCoordinates
        ) &&
        routeCoordinates.length >
          1
      ) {
        map.fitBounds(
          L.latLngBounds(
            routeCoordinates
          ),
          {
            padding: [
              45,
              45,
            ],
            maxZoom:
              16,
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
          11,
          {
            duration:
              1,
          }
        );
      }
    },
    [
      latitude,
      longitude,
      routeCoordinates,
      navigating,
      followUser,
      map,
    ]
  );

  return null;
}

function LoadingList() {
  return (
    <div className="flex flex-col gap-md p-lg">
      {[1, 2, 3].map(
        item => (
          <div
            key={
              item
            }
            className="animate-pulse border-b border-border-secondary pb-lg"
          >
            <div className="mb-sm h-4 w-52 rounded bg-border-secondary" />

            <div className="mb-sm h-3 w-36 rounded bg-border-secondary" />

            <div className="h-3 w-64 rounded bg-border-secondary" />
          </div>
        )
      )}
    </div>
  );
}

export default function NearestClinicsPage() {
  const {
    t,
  } =
    useTranslation();

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
    rerouting,
    setRerouting,
  ] =
    useState(false);

  const [
    routeError,
    setRouteError,
  ] =
    useState("");

  const [
    activeStepIndex,
    setActiveStepIndex,
  ] =
    useState(0);

  const [
    followUser,
    setFollowUser,
  ] =
    useState(true);

  const [
    arrived,
    setArrived,
  ] =
    useState(false);

  const lastRouteOriginRef =
    useRef(null);

  const lastRouteRequestRef =
    useRef(0);

  const loadClinics =
    useCallback(
      async () => {
        try {
          setClinicsLoading(
            true
          );

          setError(
            ""
          );

          const result =
            await clinicsApi
              .getAll();

          setClinics(
            Array.isArray(
              result
            )
              ? result.filter(
                  clinic =>
                    clinic
                      ?.isActive !==
                    false
                )
              : []
          );
        } catch (
          err
        ) {
          console.error(
            "Failed to load facilities:",
            err
          );

          setClinics(
            []
          );

          setError(
            err?.message ||
              t(
                "clinics.loadError"
              )
          );
        } finally {
          setClinicsLoading(
            false
          );
        }
      },
      [
        t,
      ]
    );

  const requestLocation =
    useCallback(
      async () => {
        if (
          !navigator
            .geolocation
        ) {
          setLocationError(
            t(
              "clinics.locationUnsupported"
            )
          );

          return null;
        }

        setLocationLoading(
          true
        );

        setLocationError(
          ""
        );

        return new Promise(
          resolve => {
            navigator.geolocation
              .getCurrentPosition(
                position => {
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

                      accuracy:
                        position
                          .coords
                          .accuracy,

                      heading:
                        position
                          .coords
                          .heading,

                      speed:
                        position
                          .coords
                          .speed,
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

                geoError => {
                  setLocationError(
                    getLocationErrorMessage(
                      geoError,
                      t
                    )
                  );

                  setLocationLoading(
                    false
                  );

                  resolve(
                    null
                  );
                },

                {
                  enableHighAccuracy:
                    true,

                  timeout:
                    12000,

                  maximumAge:
                    5000,
                }
              );
          }
        );
      },
      [
        t,
      ]
    );

  useEffect(
    () => {
      void loadClinics();

      void requestLocation();
    },
    [
      loadClinics,
      requestLocation,
    ]
  );

  useEffect(
    () => {
      if (
        !navigationClinic ||
        !navigator
          .geolocation
      ) {
        return undefined;
      }

      const watchId =
        navigator.geolocation
          .watchPosition(
            position => {
              setLocation({
                latitude:
                  position
                    .coords
                    .latitude,

                longitude:
                  position
                    .coords
                    .longitude,

                accuracy:
                  position
                    .coords
                    .accuracy,

                heading:
                  position
                    .coords
                    .heading,

                speed:
                  position
                    .coords
                    .speed,
              });

              setLocationError(
                ""
              );
            },

            geoError => {
              setLocationError(
                getLocationErrorMessage(
                  geoError,
                  t
                )
              );
            },

            {
              enableHighAccuracy:
                true,

              timeout:
                15000,

              maximumAge:
                3000,
            }
          );

      return () => {
        navigator.geolocation
          .clearWatch(
            watchId
          );
      };
    },
    [
      navigationClinic,
      t,
    ]
  );

  const nearbyFacilities =
    useMemo(
      () => {
        if (
          !location
        ) {
          return [];
        }

        return clinics
          .filter(
            clinic =>
              clinic
                ?.isActive !==
                false &&
              Number.isFinite(
                Number(
                  clinic
                    .latitude
                )
              ) &&
              Number.isFinite(
                Number(
                  clinic
                    .longitude
                )
              )
          )
          .map(
            clinic => {
              const latitude =
                Number(
                  clinic.latitude
                );

              const longitude =
                Number(
                  clinic.longitude
                );

              return {
                ...clinic,

                latitude,

                longitude,

                distance:
                  calculateDistanceKm(
                    location.latitude,
                    location.longitude,
                    latitude,
                    longitude
                  ),
              };
            }
          )
          .filter(
            facility =>
              isClinicOrHospital(
                facility
              ) &&
              facility.distance <=
                MAX_RADIUS_KM
          )
          .sort(
            (
              first,
              second
            ) =>
              first.distance -
              second.distance
          );
      },
      [
        clinics,
        location,
      ]
    );

  const visibleFacilities =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (
          !query
        ) {
          return nearbyFacilities;
        }

        return nearbyFacilities
          .filter(
            facility =>
              [
                facility.name,
                facility.type,
                facility.address,
                facility.services,
              ]
                .filter(
                  Boolean
                )
                .join(" ")
                .toLowerCase()
                .includes(
                  query
                )
          );
      },
      [
        nearbyFacilities,
        search,
      ]
    );

  const mapCentre =
    location ??
    defaultCentre;

  const patientMarkerIcon =
    useMemo(
      () =>
        createPatientMarkerIcon(
          location?.heading,
          Boolean(
            navigationClinic
          )
        ),
      [
        location
          ?.heading,
        navigationClinic,
      ]
    );

  const buildRoute =
    useCallback(
      async (
        facility,
        startLocation,
        {
          silent =
            false,
        } = {}
      ) => {
        if (
          !facility ||
          !startLocation
        ) {
          return;
        }

        if (
          !silent
        ) {
          setRouteLoading(
            true
          );

          setRouteCoordinates(
            []
          );

          setRouteSteps(
            []
          );

          setRouteDistance(
            null
          );

          setRouteDuration(
            null
          );

          setActiveStepIndex(
            0
          );
        } else {
          setRerouting(
            true
          );
        }

        setRouteError(
          ""
        );

        try {
          const startLatitude =
            Number(
              startLocation
                .latitude
            );

          const startLongitude =
            Number(
              startLocation
                .longitude
            );

          const destinationLatitude =
            Number(
              facility.latitude
            );

          const destinationLongitude =
            Number(
              facility.longitude
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
              t(
                "clinics.coordinatesRequired"
              )
            );
          }

          const routeUrl =
            "https://router.project-osrm.org/route/v1/driving/" +
            `${startLongitude},${startLatitude};` +
            `${destinationLongitude},${destinationLatitude}` +
            "?overview=full&geometries=geojson&steps=true";

          const response =
            await fetch(
              routeUrl,
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
              t(
                "clinics.routeCalculationFailed"
              )
            );
          }

          const data =
            await response
              .json();

          if (
            data?.code !==
              "Ok" ||
            !Array.isArray(
              data?.routes
            ) ||
            data.routes
              .length ===
              0
          ) {
            throw new Error(
              t(
                "clinics.routeNotFound"
              )
            );
          }

          const route =
            data.routes[0];

          const coordinates =
            Array.isArray(
              route
                ?.geometry
                ?.coordinates
            )
              ? route.geometry
                  .coordinates
                  .map(
                    coordinate => {
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
                    coordinate =>
                      Number.isFinite(
                        coordinate[
                          0
                        ]
                      ) &&
                      Number.isFinite(
                        coordinate[
                          1
                        ]
                      )
                  )
              : [];

          if (
            coordinates.length <
            2
          ) {
            throw new Error(
              t(
                "clinics.routeGeometryInvalid"
              )
            );
          }

          const rawSteps =
            Array.isArray(
              route?.legs
            )
              ? route.legs
                  .flatMap(
                    leg =>
                      Array.isArray(
                        leg?.steps
                      )
                        ? leg.steps
                        : []
                  )
              : [];

          const parsedSteps =
            rawSteps.map(
              (
                step,
                index
              ) => {
                const maneuverLocation =
                  Array.isArray(
                    step
                      ?.maneuver
                      ?.location
                  )
                    ? step
                        .maneuver
                        .location
                    : [];

                return {
                  id:
                    `${index}-${maneuverLocation.join("-")}`,

                  instruction:
                    getDirectionText(
                      step,
                      facility.name,
                      t
                    ),

                  distance:
                    Number(
                      step?.distance
                    ),

                  duration:
                    Number(
                      step?.duration
                    ),

                  latitude:
                    Number(
                      maneuverLocation[
                        1
                      ]
                    ),

                  longitude:
                    Number(
                      maneuverLocation[
                        0
                      ]
                    ),
                };
              }
            );

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
            parsedSteps
          );

          setActiveStepIndex(
            0
          );

          lastRouteOriginRef.current =
            {
              latitude:
                startLatitude,

              longitude:
                startLongitude,
            };

          lastRouteRequestRef.current =
            Date.now();
        } catch (
          err
        ) {
          console.error(
            "Navigation route failed:",
            err
          );

          setRouteError(
            err?.message ||
              t(
                "clinics.navigationUnavailable"
              )
          );
        } finally {
          setRouteLoading(
            false
          );

          setRerouting(
            false
          );
        }
      },
      [
        t,
      ]
    );

  const startNavigation =
    useCallback(
      async facility => {
        setRouteError(
          ""
        );

        setArrived(
          false
        );

        setFollowUser(
          true
        );

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
            t(
              "clinics.currentLocationRequired"
            )
          );

          return;
        }

        setNavigationClinic(
          facility
        );

        await buildRoute(
          facility,
          currentLocation
        );
      },
      [
        location,
        requestLocation,
        buildRoute,
        t,
      ]
    );

  const stopNavigation =
    useCallback(
      () => {
        setNavigationClinic(
          null
        );

        setRouteCoordinates(
          []
        );

        setRouteSteps(
          []
        );

        setRouteDistance(
          null
        );

        setRouteDuration(
          null
        );

        setRouteError(
          ""
        );

        setActiveStepIndex(
          0
        );

        setArrived(
          false
        );

        setFollowUser(
          true
        );

        lastRouteOriginRef.current =
          null;

        lastRouteRequestRef.current =
          0;
      },
      []
    );

  useEffect(
    () => {
      if (
        !navigationClinic ||
        !location ||
        routeSteps.length ===
          0 ||
        arrived
      ) {
        return;
      }

      const currentStep =
        routeSteps[
          activeStepIndex
        ];

      if (
        !currentStep ||
        !Number.isFinite(
          currentStep.latitude
        ) ||
        !Number.isFinite(
          currentStep.longitude
        )
      ) {
        return;
      }

      const distanceToStep =
        calculateDistanceMetres(
          location.latitude,
          location.longitude,
          currentStep.latitude,
          currentStep.longitude
        );

      if (
        distanceToStep <=
          40 &&
        activeStepIndex <
          routeSteps.length -
            1
      ) {
        setActiveStepIndex(
          previous =>
            Math.min(
              previous +
                1,
              routeSteps.length -
                1
            )
        );
      }
    },
    [
      navigationClinic,
      location,
      routeSteps,
      activeStepIndex,
      arrived,
    ]
  );

  useEffect(
    () => {
      if (
        !navigationClinic ||
        !location
      ) {
        return;
      }

      const distanceToClinic =
        calculateDistanceMetres(
          location.latitude,
          location.longitude,
          Number(
            navigationClinic.latitude
          ),
          Number(
            navigationClinic.longitude
          )
        );

      if (
        distanceToClinic <=
        50
      ) {
        setArrived(
          true
        );

        setRouteDistance(
          0
        );

        setRouteDuration(
          0
        );
      }
    },
    [
      navigationClinic,
      location,
    ]
  );

  useEffect(
    () => {
      if (
        !navigationClinic ||
        !location ||
        !lastRouteOriginRef.current ||
        routeLoading ||
        rerouting ||
        arrived
      ) {
        return;
      }

      const movedMetres =
        calculateDistanceMetres(
          lastRouteOriginRef
            .current
            .latitude,

          lastRouteOriginRef
            .current
            .longitude,

          location.latitude,
          location.longitude
        );

      const timeSinceRoute =
        Date.now() -
        lastRouteRequestRef.current;

      if (
        movedMetres >=
          80 &&
        timeSinceRoute >=
          15000
      ) {
        void buildRoute(
          navigationClinic,
          location,
          {
            silent:
              true,
          }
        );
      }
    },
    [
      navigationClinic,
      location,
      routeLoading,
      rerouting,
      arrived,
      buildRoute,
    ]
  );

  const activeStep =
    routeSteps[
      activeStepIndex
    ] ||
    null;

  const distanceToActiveStep =
    useMemo(
      () => {
        if (
          !location ||
          !activeStep ||
          !Number.isFinite(
            activeStep.latitude
          ) ||
          !Number.isFinite(
            activeStep.longitude
          )
        ) {
          return null;
        }

        return calculateDistanceMetres(
          location.latitude,
          location.longitude,
          activeStep.latitude,
          activeStep.longitude
        );
      },
      [
        location,
        activeStep,
      ]
    );

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg lg:mb-xl">
        <h1 className="text-title text-text-primary">
          {t(
            "clinics.title"
          )}
        </h1>

        <p className="mt-xs text-label-sm text-text-secondary">
          {t(
            "clinics.subtitle",
            {
              radius:
                MAX_RADIUS_KM,
            }
          )}
        </p>
      </div>

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
              {t(
                "clinics.tryAgain"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,.75fr)] lg:gap-xl">
        <div className="overflow-hidden rounded-corner-lg border border-border-secondary bg-surface-bg">
          <div className="border-b border-border-secondary p-lg">
            <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-label-sm font-semibold text-text-primary">
                  {navigationClinic
                    ? t(
                        "clinics.navigatingTo",
                        {
                          name:
                            navigationClinic.name,
                        }
                      )
                    : location
                    ? t(
                        "clinics.facilitiesWithin",
                        {
                          count:
                            nearbyFacilities.length,

                          radius:
                            MAX_RADIUS_KM,
                        }
                      )
                    : t(
                        "clinics.locationRequired"
                      )}
                </p>

                <p className="mt-xs text-video-title text-text-secondary">
                  {navigationClinic
                    ? t(
                        "clinics.navigationMapMessage"
                      )
                    : location
                    ? t(
                        "clinics.facilitiesSorted"
                      )
                    : locationError ||
                      t(
                        "clinics.allowLocation"
                      )}
                </p>
              </div>

              <div className="flex flex-wrap gap-sm">
                {navigationClinic && (
                  <button
                    type="button"
                    onClick={() =>
                      setFollowUser(
                        true
                      )
                    }
                    className="inline-flex items-center justify-center gap-xs rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm font-medium text-text-primary hover:bg-bg-faint"
                  >
                    <LocateFixed
                      size={15}
                    />

                    {t(
                      "clinics.recenter"
                    )}
                  </button>
                )}

                {navigationClinic ? (
                  <button
                    type="button"
                    onClick={
                      stopNavigation
                    }
                    className="inline-flex items-center justify-center gap-xs rounded-corner-md border border-danger/30 bg-white px-md py-sm text-label-sm font-medium text-danger"
                  >
                    <X
                      size={15}
                    />

                    {t(
                      "clinics.end"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      requestLocation
                    }
                    disabled={
                      locationLoading
                    }
                    className="inline-flex items-center justify-center gap-xs rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm font-medium text-text-primary hover:bg-bg-faint disabled:opacity-60"
                  >
                    {locationLoading ? (
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <LocateFixed
                        size={15}
                      />
                    )}

                    {locationLoading
                      ? t(
                          "clinics.locating"
                        )
                      : t(
                          "clinics.useMyLocation"
                        )}
                  </button>
                )}
              </div>
            </div>

            {locationError && (
              <div className="mt-md rounded-corner-md bg-[#fff7ed] px-md py-sm text-video-title text-[#9a3412]">
                {
                  locationError
                }
              </div>
            )}

            {routeError && (
              <div className="mt-md flex items-start gap-sm rounded-corner-md bg-danger/10 px-md py-sm text-video-title text-danger">
                <AlertCircle
                  size={15}
                  className="mt-[1px] shrink-0"
                />

                <span>
                  {
                    routeError
                  }
                </span>
              </div>
            )}
          </div>

          <div
            className="relative h-[460px] w-full sm:h-[560px] lg:h-[650px]"
            onPointerDown={() => {
              if (
                navigationClinic
              ) {
                setFollowUser(
                  false
                );
              }
            }}
          >
            {navigationClinic &&
              !routeLoading && (
                <div className="pointer-events-none absolute left-3 right-3 top-3 z-[1000] sm:left-4 sm:right-auto sm:w-[420px]">
                  <div className="rounded-[18px] bg-[#0f766e] p-4 text-white shadow-xl">
                    {arrived ? (
                      <div className="flex items-center gap-sm">
                        <MapPin
                          size={26}
                        />

                        <div>
                          <p className="text-lg font-semibold">
                            {t(
                              "clinics.arrived"
                            )}
                          </p>

                          <p className="mt-1 text-sm text-white/80">
                            {
                              navigationClinic.name
                            }
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-md">
                          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                            <Navigation
                              size={23}
                            />
                          </div>

                          <div className="min-w-0">
                            {distanceToActiveStep !=
                              null && (
                              <p className="mb-1 text-sm font-semibold text-[#ccfbf1]">
                                {formatRouteDistance(
                                  distanceToActiveStep,
                                  t
                                )}
                              </p>
                            )}

                            <p className="text-[17px] font-semibold leading-snug">
                              {activeStep
                                ?.instruction ||
                                t(
                                  "clinics.continueRoute"
                                )}
                            </p>
                          </div>
                        </div>

                        {rerouting && (
                          <div className="mt-3 flex items-center gap-xs border-t border-white/15 pt-3 text-xs text-white/70">
                            <RefreshCw
                              size={12}
                              className="animate-spin"
                            />

                            {t(
                              "clinics.updatingRoute"
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

            {navigationClinic &&
              !arrived &&
              routeDistance !=
                null &&
              routeDuration !=
                null && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2">
                  <div className="flex items-center gap-5 rounded-full bg-white px-5 py-3 shadow-xl">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-text-tertiary">
                        {t(
                          "clinics.eta"
                        )}
                      </p>

                      <p className="whitespace-nowrap text-label-sm font-semibold text-text-primary">
                        {formatRouteDuration(
                          routeDuration,
                          t
                        )}
                      </p>
                    </div>

                    <div className="h-7 w-px bg-border-secondary" />

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-text-tertiary">
                        {t(
                          "clinics.remaining"
                        )}
                      </p>

                      <p className="whitespace-nowrap text-label-sm font-semibold text-text-primary">
                        {formatRouteDistance(
                          routeDistance,
                          t
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                navigating={
                  Boolean(
                    navigationClinic
                  )
                }
                followUser={
                  followUser
                }
              />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {location &&
                !navigationClinic && (
                  <Circle
                    center={[
                      location.latitude,
                      location.longitude,
                    ]}
                    radius={
                      MAX_RADIUS_KM *
                      1000
                    }
                    pathOptions={{
                      color:
                        "#0f766e",
                      weight:
                        2,
                      opacity:
                        0.65,
                      fillColor:
                        "#14b8a6",
                      fillOpacity:
                        0.07,
                      dashArray:
                        "8 8",
                    }}
                  />
                )}

              {navigationClinic &&
                routeCoordinates.length >
                  1 && (
                  <>
                    <Polyline
                      positions={
                        routeCoordinates
                      }
                      pathOptions={{
                        color:
                          "#ffffff",
                        weight:
                          11,
                        opacity:
                          0.95,
                      }}
                    />

                    <Polyline
                      positions={
                        routeCoordinates
                      }
                      pathOptions={{
                        color:
                          "#2563eb",
                        weight:
                          7,
                        opacity:
                          0.95,
                      }}
                    />
                  </>
                )}

              {location && (
                <Marker
                  position={[
                    location.latitude,
                    location.longitude,
                  ]}
                  icon={
                    patientMarkerIcon
                  }
                  zIndexOffset={
                    1000
                  }
                >
                  <Popup>
                    <strong>
                      {t(
                        "clinics.yourLocation"
                      )}
                    </strong>

                    {location.accuracy && (
                      <div
                        style={{
                          marginTop:
                            4,
                        }}
                      >
                        {t(
                          "clinics.gpsAccuracy",
                          {
                            value:
                              Math.round(
                                location.accuracy
                              ),
                          }
                        )}
                      </div>
                    )}
                  </Popup>
                </Marker>
              )}

              {!navigationClinic &&
                visibleFacilities.map(
                  facility => (
                    <Marker
                      key={
                        facility.id
                      }
                      position={[
                        facility.latitude,
                        facility.longitude,
                      ]}
                      icon={
                        facilityMarkerIcon
                      }
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <strong>
                            {
                              facility.name
                            }
                          </strong>

                          {facility.type && (
                            <div
                              style={{
                                marginTop:
                                  4,
                              }}
                            >
                              {
                                facility.type
                              }
                            </div>
                          )}

                          <div
                            style={{
                              marginTop:
                                4,
                            }}
                          >
                            {t(
                              "clinics.kmAway",
                              {
                                distance:
                                  facility.distance
                                    .toFixed(
                                      1
                                    ),
                              }
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              startNavigation(
                                facility
                              )
                            }
                            style={{
                              marginTop:
                                10,

                              border:
                                0,

                              borderRadius:
                                7,

                              padding:
                                "8px 11px",

                              background:
                                "#0f766e",

                              color:
                                "#ffffff",

                              fontSize:
                                12,

                              fontWeight:
                                600,

                              cursor:
                                "pointer",
                            }}
                          >
                            {t(
                              "clinics.startNavigation"
                            )}
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  )
                )}

              {navigationClinic && (
                <Marker
                  position={[
                    Number(
                      navigationClinic.latitude
                    ),
                    Number(
                      navigationClinic.longitude
                    ),
                  ]}
                  icon={
                    facilityMarkerIcon
                  }
                  zIndexOffset={
                    900
                  }
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <strong>
                        {
                          navigationClinic.name
                        }
                      </strong>

                      {navigationClinic.type && (
                        <div
                          style={{
                            marginTop:
                              4,
                          }}
                        >
                          {
                            navigationClinic.type
                          }
                        </div>
                      )}

                      {navigationClinic.address && (
                        <div
                          style={{
                            marginTop:
                              4,
                          }}
                        >
                          {
                            navigationClinic.address
                          }
                        </div>
                      )}

                      <div
                        style={{
                          marginTop:
                            7,

                          fontWeight:
                            600,

                          color:
                            "#0f766e",
                        }}
                      >
                        {t(
                          "clinics.destination"
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {navigationClinic && (
            <div className="border-t border-border-secondary bg-white">
              <div className="flex flex-col gap-md border-b border-border-secondary p-lg sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary">
                    {t(
                      "clinics.navigation"
                    )}
                  </p>

                  <h2 className="mt-xs text-label font-semibold text-text-primary">
                    {
                      navigationClinic.name
                    }
                  </h2>

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
                    null &&
                  !arrived && (
                    <div className="flex items-center gap-xl">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-text-tertiary">
                          {t(
                            "clinics.distance"
                          )}
                        </p>

                        <p className="mt-[2px] text-label-sm font-semibold text-text-primary">
                          {formatRouteDistance(
                            routeDistance,
                            t
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-text-tertiary">
                          {t(
                            "clinics.eta"
                          )}
                        </p>

                        <p className="mt-[2px] text-label-sm font-semibold text-text-primary">
                          {formatRouteDuration(
                            routeDuration,
                            t
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

                  {t(
                    "clinics.calculatingRoute"
                  )}
                </div>
              ) : routeSteps.length >
                0 ? (
                <div className="max-h-[320px] overflow-y-auto">
                  {routeSteps.map(
                    (
                      step,
                      index
                    ) => {
                      const active =
                        index ===
                        activeStepIndex;

                      const completed =
                        index <
                        activeStepIndex;

                      return (
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
                          } ${
                            active
                              ? "bg-[#eff6ff]"
                              : ""
                          } ${
                            completed
                              ? "opacity-45"
                              : ""
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                              active
                                ? "bg-[#2563eb] text-white"
                                : "bg-[#ecfdf5] text-brand-primary"
                            }`}
                          >
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
                                    step.distance,
                                    t
                                  )}
                                </p>
                              )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-col rounded-corner-lg border border-border-secondary bg-surface-bg">
          <div className="border-b border-border-secondary p-lg">
            <div className="mb-md flex items-center justify-between gap-md">
              <div>
                <p className="text-label-sm font-semibold text-text-primary">
                  {t(
                    "clinics.withinRadius",
                    {
                      radius:
                        MAX_RADIUS_KM,
                    }
                  )}
                </p>

                <p className="mt-[2px] text-video-title text-text-secondary">
                  {location
                    ? t(
                        "clinics.nearbyFacilities",
                        {
                          count:
                            nearbyFacilities.length,
                        }
                      )
                    : t(
                        "clinics.waitingForLocation"
                      )}
                </p>
              </div>

              <MapPin
                size={18}
                className="text-brand-primary"
              />
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              />

              <input
                type="text"
                value={
                  search
                }
                onChange={
                  event =>
                    setSearch(
                      event
                        .target
                        .value
                    )
                }
                placeholder={t(
                  "clinics.searchPlaceholder"
                )}
                className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {clinicsLoading ||
            locationLoading ? (
              <LoadingList />
            ) : !location ? (
              <div className="p-xl text-center">
                <LocateFixed
                  size={28}
                  className="mx-auto text-text-tertiary"
                />

                <p className="mt-md text-label font-semibold text-text-primary">
                  {t(
                    "clinics.locationRequired"
                  )}
                </p>

                <p className="mx-auto mt-xs max-w-[260px] text-label-sm text-text-secondary">
                  {t(
                    "clinics.allowLocationRadius",
                    {
                      radius:
                        MAX_RADIUS_KM,
                    }
                  )}
                </p>

                <button
                  type="button"
                  onClick={
                    requestLocation
                  }
                  className="mt-md inline-flex items-center gap-xs rounded-corner-md bg-brand-primary px-md py-sm text-label-sm font-medium text-white"
                >
                  <LocateFixed
                    size={15}
                  />

                  {t(
                    "clinics.useMyLocation"
                  )}
                </button>
              </div>
            ) : visibleFacilities
                .length ===
              0 ? (
              <div className="p-xl text-center">
                <MapPin
                  size={28}
                  className="mx-auto text-text-tertiary"
                />

                <p className="mt-md text-label font-semibold text-text-primary">
                  {t(
                    "clinics.noFacilities"
                  )}
                </p>

                <p className="mx-auto mt-xs max-w-[280px] text-label-sm text-text-secondary">
                  {t(
                    "clinics.noFacilitiesBody",
                    {
                      radius:
                        MAX_RADIUS_KM,
                    }
                  )}
                </p>
              </div>
            ) : (
              visibleFacilities.map(
                (
                  facility,
                  index
                ) => {
                  const state =
                    getClinicOpenState(
                      facility,
                      t
                    );

                  const isNavigating =
                    navigationClinic?.id ===
                    facility.id;

                  return (
                    <div
                      key={
                        facility.id
                      }
                      className={`p-lg ${
                        isNavigating
                          ? "bg-[#eff6ff]"
                          : ""
                      } ${
                        index <
                        visibleFacilities.length -
                          1
                          ? "border-b border-border-secondary"
                          : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-sm">
                        <h3 className="text-label-sm font-semibold text-text-primary">
                          {
                            facility.name
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
                          <span className="rounded-corner-full bg-[#2563eb] px-sm py-[2px] text-[11px] font-medium text-white">
                            {t(
                              "clinics.navigating"
                            )}
                          </span>
                        )}
                      </div>

                      {facility.type && (
                        <p className="mt-xs text-video-title font-medium text-brand-primary">
                          {
                            facility.type
                          }
                        </p>
                      )}

                      <div className="mt-md flex flex-col gap-sm">
                        {facility.address && (
                          <div className="flex items-start gap-xs">
                            <MapPin
                              size={13}
                              className="mt-[2px] shrink-0 text-text-tertiary"
                            />

                            <span className="text-video-title text-text-secondary">
                              {
                                facility.address
                              }
                            </span>
                          </div>
                        )}

                        {facility.contactNumber && (
                          <div className="flex items-center gap-xs">
                            <Phone
                              size={13}
                              className="shrink-0 text-text-tertiary"
                            />

                            <a
                              href={`tel:${facility.contactNumber}`}
                              className="text-video-title text-text-secondary hover:text-brand-primary"
                            >
                              {
                                facility.contactNumber
                              }
                            </a>
                          </div>
                        )}

                        {facility.openingTime &&
                          facility.closingTime && (
                            <div className="flex items-center gap-xs">
                              <Clock
                                size={13}
                                className="shrink-0 text-text-tertiary"
                              />

                              <span className="text-video-title text-text-secondary">
                                {formatTime(
                                  facility.openingTime
                                )}{" "}
                                –{" "}
                                {formatTime(
                                  facility.closingTime
                                )}
                              </span>
                            </div>
                          )}

                        <div className="flex items-center gap-xs">
                          <Navigation
                            size={13}
                            className="shrink-0 text-brand-primary"
                          />

                          <span className="text-video-title font-medium text-text-primary">
                            {t(
                              "clinics.kmAway",
                              {
                                distance:
                                  facility.distance
                                    .toFixed(
                                      1
                                    ),
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {facility.services && (
                        <p className="mt-md text-video-title text-text-secondary">
                          {
                            facility.services
                          }
                        </p>
                      )}

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

                            {t(
                              "clinics.endNavigation"
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              startNavigation(
                                facility
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

                            {t(
                              "clinics.startNavigation"
                            )}
                          </button>
                        )}
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
