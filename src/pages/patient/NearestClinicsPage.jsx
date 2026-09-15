import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MapContainer,
  Marker,
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
} from "lucide-react";
import { clinicsApi } from "../../services/api/clinics.js";

const defaultCentre = {
  latitude: -30.5595,
  longitude: 22.9375,
};

const clinicMarkerIcon = L.divIcon({
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
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -16],
});

const patientMarkerIcon = L.divIcon({
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
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function calculateDistanceKm(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const earthRadiusKm = 6371;

  const toRadians = (degrees) =>
    (degrees * Math.PI) / 180;

  const latitudeDifference =
    toRadians(
      latitude2 - latitude1
    );

  const longitudeDifference =
    toRadians(
      longitude2 - longitude1
    );

  const firstLatitude =
    toRadians(latitude1);

  const secondLatitude =
    toRadians(latitude2);

  const a =
    Math.sin(
      latitudeDifference / 2
    ) **
      2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(
        longitudeDifference / 2
      ) **
        2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
}

function formatTime(value) {
  if (!value) return null;

  const text = String(value);

  if (/^\d{2}:\d{2}/.test(text)) {
    return text.slice(0, 5);
  }

  return text;
}

function getClinicOpenState(clinic) {
  if (
    !clinic?.openingTime ||
    !clinic?.closingTime
  ) {
    return {
      known: false,
      open: false,
      label: "Hours unavailable",
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

  if (!opening || !closing) {
    return {
      known: false,
      open: false,
      label: "Hours unavailable",
    };
  }

  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  const [openHour, openMinute] =
    opening
      .split(":")
      .map(Number);

  const [closeHour, closeMinute] =
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

function getDirectionsUrl(
  latitude,
  longitude
) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

function MapController({
  latitude,
  longitude,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      map.flyTo(
        [latitude, longitude],
        12,
        {
          duration: 1,
        }
      );
    }
  }, [
    latitude,
    longitude,
    map,
  ]);

  return null;
}

function LoadingList() {
  return (
    <div className="p-lg flex flex-col gap-md">
      {[1, 2, 3].map(
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
  const [clinics, setClinics] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [location, setLocation] =
    useState(null);

  const [locationError, setLocationError] =
    useState("");

  const [
    locationLoading,
    setLocationLoading,
  ] = useState(false);

  const [
    clinicsLoading,
    setClinicsLoading,
  ] = useState(true);

  const [error, setError] =
    useState("");

  const loadClinics =
    useCallback(async () => {
      try {
        setClinicsLoading(true);
        setError("");

        const result =
          await clinicsApi.getAll();

        setClinics(
          Array.isArray(result)
            ? result.filter(
                (clinic) =>
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
        setClinicsLoading(false);
      }
    }, []);

  const requestLocation =
    useCallback(() => {
      if (
        !navigator.geolocation
      ) {
        setLocationError(
          "Location services are not supported by this browser."
        );

        return;
      }

      setLocationLoading(true);
      setLocationError("");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude:
              position.coords
                .latitude,
            longitude:
              position.coords
                .longitude,
          });

          setLocationLoading(
            false
          );
        },
        (geoError) => {
          setLocation(null);

          if (
            geoError.code ===
            geoError.PERMISSION_DENIED
          ) {
            setLocationError(
              "Location access denied. Enable it in your browser settings to see distances."
            );
          } else if (
            geoError.code ===
            geoError.POSITION_UNAVAILABLE
          ) {
            setLocationError(
              "Your current location could not be determined."
            );
          } else if (
            geoError.code ===
            geoError.TIMEOUT
          ) {
            setLocationError(
              "Location request timed out. Please try again."
            );
          } else {
            setLocationError(
              "Location unavailable."
            );
          }

          setLocationLoading(
            false
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }, []);

  useEffect(() => {
    loadClinics();
    requestLocation();
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
        .map((clinic) => {
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
        })
        .sort(
          (first, second) => {
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
    }, [clinics, location]);

  const visibleClinics =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return clinicsWithDistance;
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
    (visibleClinics.length > 0
      ? {
          latitude:
            visibleClinics[0]
              .latitude,
          longitude:
            visibleClinics[0]
              .longitude,
        }
      : defaultCentre);

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg lg:mb-xl">
        <h1 className="text-title text-text-primary">
          Nearest Clinics
        </h1>

        <p className="mt-xs text-label-sm text-text-secondary">
          Find active PhilaLink
          healthcare facilities.
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
              onClick={loadClinics}
              className="mt-xs text-label-sm text-brand-primary hover:opacity-70"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,.8fr)] lg:gap-xl">
        <div className="overflow-hidden rounded-corner-lg bg-surface-bg border border-border-secondary">
          <div className="border-b border-border-secondary p-lg">
            <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-label-sm font-semibold text-text-primary">
                  {location
                    ? "Using your current location"
                    : "Location unavailable"}
                </p>

                <p className="mt-xs text-video-title text-text-secondary">
                  {location
                    ? "Clinics are sorted by distance from you."
                    : locationError ||
                      "Allow location access to see accurate distances."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  requestLocation
                }
                disabled={
                  locationLoading
                }
                className="inline-flex items-center justify-center gap-xs rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm font-medium text-text-primary transition hover:bg-bg-faint disabled:cursor-not-allowed disabled:opacity-60"
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
                  ? "Locating..."
                  : "Use my location"}
              </button>
            </div>

            {locationError && (
              <div className="mt-md rounded-corner-md bg-[#fff7ed] px-md py-sm text-video-title text-[#9a3412]">
                {locationError}
              </div>
            )}
          </div>

          <div className="h-[420px] w-full lg:h-[620px]">
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
              />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

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

              {visibleClinics.map(
                (clinic) => (
                  <Marker
                    key={clinic.id}
                    position={[
                      clinic.latitude,
                      clinic.longitude,
                    ]}
                    icon={
                      clinicMarkerIcon
                    }
                  >
                    <Popup>
                      <div className="min-w-[190px]">
                        <strong>
                          {clinic.name}
                        </strong>

                        {clinic.type && (
                          <div
                            style={{
                              marginTop: 4,
                            }}
                          >
                            {clinic.type}
                          </div>
                        )}

                        {clinic.distance !=
                          null && (
                          <div
                            style={{
                              marginTop: 4,
                            }}
                          >
                            {clinic.distance.toFixed(
                              1
                            )}{" "}
                            km away
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )
              )}
            </MapContainer>
          </div>
        </div>

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

                  return (
                    <div
                      key={
                        clinic.id
                      }
                      className={`p-lg ${
                        index <
                        visibleClinics.length -
                          1
                          ? "border-b border-border-secondary"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-md">
                        <div className="min-w-0 flex-1">
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
                          </div>

                          {clinic.type && (
                            <p className="mt-xs text-video-title text-text-secondary">
                              {
                                clinic.type
                              }
                            </p>
                          )}

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

                          <div className="mt-md">
                            <a
                              href={getDirectionsUrl(
                                clinic.latitude,
                                clinic.longitude
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-xs text-label-sm font-medium text-brand-primary hover:opacity-70"
                            >
                              <Navigation
                                size={14}
                              />

                              Directions
                            </a>
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