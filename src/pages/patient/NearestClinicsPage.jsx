import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Clock,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";

const clinics = [
  {
    id: "1",
    name: "Soweto Community Health Centre",
    type: "Community Health Centre",
    latitude: -26.2482,
    longitude: 27.8546,
    address: "Soweto, Johannesburg",
    phone: "011 000 1001",
    open: false,
  },
  {
    id: "2",
    name: "Chris Hani Baragwanath Hospital",
    type: "Public Hospital",
    latitude: -26.2618,
    longitude: 27.9437,
    address: "Diepkloof, Soweto",
    phone: "011 933 8000",
    open: true,
  },
  {
    id: "3",
    name: "Diepkloof Zone 6 Clinic",
    type: "Clinic",
    latitude: -26.241,
    longitude: 27.9503,
    address: "Diepkloof Zone 6, Soweto",
    phone: "011 000 1003",
    open: false,
  },
  {
    id: "4",
    name: "Dobsonville Community Health Centre",
    type: "Community Health Centre",
    latitude: -26.2156,
    longitude: 27.8663,
    address: "Dobsonville, Soweto",
    phone: "011 000 1004",
    open: false,
  },
  {
    id: "5",
    name: "Devland Community Health Centre",
    type: "Community Health Centre",
    latitude: -26.285,
    longitude: 27.8907,
    address: "Devland, Johannesburg",
    phone: "011 000 1005",
    open: false,
  },
  {
    id: "6",
    name: "Chiawelo Community Health Centre",
    type: "Community Health Centre",
    latitude: -26.297,
    longitude: 27.8902,
    address: "Chiawelo, Soweto",
    phone: "011 000 1006",
    open: false,
  },
  {
    id: "7",
    name: "Lenasia Community Health Centre",
    type: "Community Health Centre",
    latitude: -26.3208,
    longitude: 27.835,
    address: "Lenasia, Johannesburg",
    phone: "011 000 1007",
    open: false,
  },
  {
    id: "8",
    name: "Eldorado Park Community Health Centre",
    type: "Community Health Centre",
    latitude: -26.2966,
    longitude: 27.8847,
    address: "Eldorado Park, Johannesburg",
    phone: "011 000 1008",
    open: false,
  },
];

const defaultCentre = {
  latitude: -26.2482,
  longitude: 27.8546,
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

  const latitudeDifference = toRadians(
    latitude2 - latitude1
  );

  const longitudeDifference = toRadians(
    longitude2 - longitude1
  );

  const firstLatitude = toRadians(
    latitude1
  );

  const secondLatitude = toRadians(
    latitude2
  );

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
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

function MapController({
  latitude,
  longitude,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      typeof latitude === "number" &&
      typeof longitude === "number"
    ) {
      map.flyTo(
        [latitude, longitude],
        12,
        {
          duration: 1,
        }
      );
    }
  }, [latitude, longitude, map]);

  return null;
}

export default function NearestClinicsPage() {
  const [search, setSearch] =
    useState("");

  const [location, setLocation] =
    useState(null);

  const [locationError, setLocationError] =
    useState("");

  const [locationLoading, setLocationLoading] =
    useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
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
            position.coords.latitude,
          longitude:
            position.coords.longitude,
        });

        setLocationLoading(false);
      },
      (error) => {
        setLocation(null);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationError(
            "Location access denied. Enable it in browser settings to see distances."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationError(
            "Your current location could not be determined."
          );
        } else if (
          error.code === error.TIMEOUT
        ) {
          setLocationError(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            "Location unavailable."
          );
        }

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const clinicsWithDistance = useMemo(
    () =>
      clinics
        .map((clinic) => {
          if (!location) {
            return {
              ...clinic,
              distance: null,
            };
          }

          return {
            ...clinic,
            distance: calculateDistanceKm(
              location.latitude,
              location.longitude,
              clinic.latitude,
              clinic.longitude
            ),
          };
        })
        .sort((first, second) => {
          if (
            first.distance == null ||
            second.distance == null
          ) {
            return 0;
          }

          return (
            first.distance -
            second.distance
          );
        }),
    [location]
  );

  const visibleClinics =
    clinicsWithDistance.filter(
      (clinic) => {
        const query = search
          .trim()
          .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          clinic.name
            .toLowerCase()
            .includes(query) ||
          clinic.type
            .toLowerCase()
            .includes(query) ||
          clinic.address
            .toLowerCase()
            .includes(query)
        );
      }
    );

  const mapCentre = location ?? defaultCentre;

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg lg:mb-xl">
        <h1 className="text-title text-text-primary">
          Nearest Clinics
        </h1>

        <p className="mt-xs text-label-sm text-text-secondary">
          Healthcare facilities in your
          area
        </p>
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,.8fr)] lg:gap-xl">
        <div className="overflow-hidden rounded-corner-lg bg-surface-bg">
          <div className="border-b border-border-secondary p-lg">
            <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-label-sm font-semibold text-text-primary">
                  {location
                    ? "Using your current location"
                    : "Location unavailable"}
                </p>

                {location ? (
                  <p className="mt-xs text-video-title text-text-secondary">
                    Clinics are sorted by
                    distance from you.
                  </p>
                ) : (
                  <p className="mt-xs text-video-title text-text-secondary">
                    {locationError ||
                      "Allow location access to see accurate distances."}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={requestLocation}
                disabled={locationLoading}
                className="inline-flex items-center justify-center gap-xs rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm font-medium text-text-primary transition hover:bg-bg-faint disabled:cursor-not-allowed disabled:opacity-60"
              >
                {locationLoading ? (
                  <RefreshCw
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <LocateFixed size={15} />
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
                    Your current location
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

                        <div
                          style={{
                            marginTop: 4,
                          }}
                        >
                          {clinic.type}
                        </div>

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

        <div className="flex min-h-0 flex-col rounded-corner-lg bg-surface-bg">
          <div className="border-b border-border-secondary p-lg">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search clinics"
                className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {visibleClinics.map(
              (clinic, index) => (
                <div
                  key={clinic.id}
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
                          {clinic.name}
                        </h3>

                        <span
                          className={`rounded-corner-full px-sm py-[2px] text-[11px] font-medium ${
                            clinic.open
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#f1f5f9] text-[#475569]"
                          }`}
                        >
                          {clinic.open
                            ? "Open"
                            : "Closed"}
                        </span>
                      </div>

                      <p className="mt-xs text-video-title text-text-secondary">
                        {clinic.type}
                      </p>

                      <div className="mt-md flex flex-col gap-sm">
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

                        <div className="flex items-center gap-xs">
                          <Phone
                            size={13}
                            className="shrink-0 text-text-tertiary"
                          />

                          <span className="text-video-title text-text-secondary">
                            {
                              clinic.phone
                            }
                          </span>
                        </div>

                        <div className="flex items-center gap-xs">
                          <Clock
                            size={13}
                            className="shrink-0 text-text-tertiary"
                          />

                          <span className="text-video-title text-text-secondary">
                            {clinic.open
                              ? "Currently open"
                              : "Currently closed"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {clinic.distance != null && (
                      <div className="shrink-0 text-right">
                        <p className="text-label-sm font-semibold text-text-primary">
                          {clinic.distance.toFixed(
                            1
                          )}{" "}
                          km
                        </p>

                        <p className="mt-xs text-video-title text-text-tertiary">
                          away
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-lg flex gap-md">
                    <button
                      type="button"
                      onClick={() => {
                        const destination = `${clinic.latitude},${clinic.longitude}`;

                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-xs rounded-corner-md bg-brand-primary px-md py-sm text-label-sm font-medium text-white transition hover:opacity-90"
                    >
                      <Navigation
                        size={14}
                      />

                      Directions
                    </button>

                    <a
                      href={`tel:${clinic.phone.replace(
                        /\s/g,
                        ""
                      )}`}
                      className="inline-flex flex-1 items-center justify-center gap-xs rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm font-medium text-text-primary transition hover:bg-bg-faint"
                    >
                      <Phone size={14} />

                      Call
                    </a>
                  </div>
                </div>
              )
            )}

            {visibleClinics.length === 0 && (
              <div className="p-2xl text-center">
                <MapPin
                  size={28}
                  className="mx-auto text-text-tertiary"
                />

                <h3 className="mt-md text-label font-semibold text-text-primary">
                  No clinics found
                </h3>

                <p className="mt-xs text-label-sm text-text-secondary">
                  Try a different clinic
                  name or area.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}
