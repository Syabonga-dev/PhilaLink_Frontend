import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import NavigationPage from "../components/layout/NavigationBar.jsx";
import "./LandingPage.css";

const DEFAULT_LOCATION = {
  latitude: -33.918,
  longitude: 25.5701,
};

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const earthRadius = 6371;

  const latitudeDifference =
    ((lat2 - lat1) * Math.PI) / 180;

  const longitudeDifference =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(
      distance * 1000
    )} m`;
  }

  return `${distance.toFixed(1)} km`;
}

function getFacilityType(tags = {}) {
  const amenity =
    tags.amenity?.toLowerCase();

  const healthcare =
    tags.healthcare?.toLowerCase();

  if (
    amenity === "hospital" ||
    healthcare === "hospital"
  ) {
    return "Hospital";
  }

  if (
    healthcare === "clinic" ||
    healthcare === "centre" ||
    healthcare === "center"
  ) {
    return "Clinic";
  }

  if (amenity === "clinic") {
    return "Clinic";
  }

  if (healthcare === "doctors") {
    return "Medical Practice";
  }

  return "Healthcare Facility";
}

function getCoordinates(element) {
  if (
    typeof element.lat === "number" &&
    typeof element.lon === "number"
  ) {
    return {
      latitude: element.lat,
      longitude: element.lon,
    };
  }

  if (
    typeof element.center?.lat ===
      "number" &&
    typeof element.center?.lon ===
      "number"
  ) {
    return {
      latitude: element.center.lat,
      longitude: element.center.lon,
    };
  }

  return null;
}

async function fetchHealthcareFacilities(
  latitude,
  longitude,
  radius = 15000
) {
  const query = `
    [out:json][timeout:25];

    (
      node[amenity=hospital]
        (around:${radius},${latitude},${longitude});

      way[amenity=hospital]
        (around:${radius},${latitude},${longitude});

      relation[amenity=hospital]
        (around:${radius},${latitude},${longitude});

      node[healthcare=clinic]
        (around:${radius},${latitude},${longitude});

      way[healthcare=clinic]
        (around:${radius},${latitude},${longitude});

      relation[healthcare=clinic]
        (around:${radius},${latitude},${longitude});

      node[healthcare=centre]
        (around:${radius},${latitude},${longitude});

      way[healthcare=centre]
        (around:${radius},${latitude},${longitude});

      relation[healthcare=centre]
        (around:${radius},${latitude},${longitude});
    );

    out center tags;
  `;

  let lastError = null;

  for (const endpoint of OVERPASS_URLS) {
    try {
      const response = await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body: `data=${encodeURIComponent(
            query
          )}`,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Overpass returned HTTP ${response.status}`
        );
      }

      const data =
        await response.json();

      return data.elements || [];
    } catch (error) {
      lastError = error;
    }
  }

  throw (
    lastError ||
    new Error(
      "Unable to reach the healthcare map service."
    )
  );
}

const hospitalIcon = L.divIcon({
  className:
    "custom-healthcare-marker",

  html: `
    <div class="healthcare-marker hospital-marker">
      <span class="material-symbols-outlined">
        local_hospital
      </span>
    </div>
  `,

  iconSize: [36, 36],
  iconAnchor: [18, 34],
  popupAnchor: [0, -32],
});

const clinicIcon = L.divIcon({
  className:
    "custom-healthcare-marker",

  html: `
    <div class="healthcare-marker clinic-marker">
      <span class="material-symbols-outlined">
        medical_services
      </span>
    </div>
  `,

  iconSize: [36, 36],
  iconAnchor: [18, 34],
  popupAnchor: [0, -32],
});

function RecenterMap({
  latitude,
  longitude,
  zoom = 13,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return;
    }

    map.setView(
      [latitude, longitude],
      zoom,
      {
        animate: false,
      }
    );
  }, [
    latitude,
    longitude,
    zoom,
    map,
  ]);

  return null;
}

export default function LandingPage() {
  const location =
    useLocation();

  const [
    userLocation,
    setUserLocation,
  ] = useState(null);

  const [
    facilities,
    setFacilities,
  ] = useState([]);

  const [
    selectedFacility,
    setSelectedFacility,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loadingLocation,
    setLoadingLocation,
  ] = useState(true);

  const [
    loadingFacilities,
    setLoadingFacilities,
  ] = useState(false);

  const [
    locationError,
    setLocationError,
  ] = useState("");

  const [
    facilityError,
    setFacilityError,
  ] = useState("");

  const [
    mapCenter,
    setMapCenter,
  ] = useState([
    DEFAULT_LOCATION.latitude,
    DEFAULT_LOCATION.longitude,
  ]);

  const requestUserLocation =
    useCallback(() => {
      if (
        !navigator.geolocation
      ) {
        setLoadingLocation(
          false
        );

        setLocationError(
          "Your browser does not support location services."
        );

        setUserLocation(
          DEFAULT_LOCATION
        );

        setMapCenter([
          DEFAULT_LOCATION.latitude,
          DEFAULT_LOCATION.longitude,
        ]);

        return;
      }

      setLoadingLocation(true);
      setLocationError("");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextLocation = {
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,
          };

          setUserLocation(
            nextLocation
          );

          setMapCenter([
            nextLocation.latitude,
            nextLocation.longitude,
          ]);

          setSelectedFacility(
            null
          );

          setLoadingLocation(
            false
          );
        },

        (error) => {
          console.error(
            "Geolocation error:",
            error
          );

          setLoadingLocation(
            false
          );

          setLocationError(
            "We couldn't access your location. Showing healthcare facilities around Gqeberha instead."
          );

          setUserLocation(
            DEFAULT_LOCATION
          );

          setMapCenter([
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
          ]);
        },

        {
          enableHighAccuracy:
            true,

          timeout: 10000,

          maximumAge:
            300000,
        }
      );
    }, []);

  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  useEffect(() => {
    const sectionId =
      location.state?.scrollTo;

    if (!sectionId) {
      return;
    }

    const timer =
      setTimeout(() => {
        const section =
          document.getElementById(
            sectionId
          );

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 150);

    return () =>
      clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    if (!userLocation) {
      return;
    }

    let cancelled = false;

    async function loadFacilities() {
      setLoadingFacilities(true);
      setFacilityError("");

      try {
        const elements =
          await fetchHealthcareFacilities(
            userLocation.latitude,
            userLocation.longitude
          );

        if (cancelled) {
          return;
        }

        const mappedFacilities =
          elements
            .map((element) => {
              const coordinates =
                getCoordinates(
                  element
                );

              if (!coordinates) {
                return null;
              }

              const tags =
                element.tags || {};

              const distance =
                calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  coordinates.latitude,
                  coordinates.longitude
                );

              return {
                id: `${element.type}-${element.id}`,

                name:
                  tags.name ||
                  tags["name:en"] ||
                  "Unnamed healthcare facility",

                type:
                  getFacilityType(
                    tags
                  ),

                latitude:
                  coordinates.latitude,

                longitude:
                  coordinates.longitude,

                distance,

                distanceLabel:
                  formatDistance(
                    distance
                  ),

                phone:
                  tags.phone ||
                  tags[
                    "contact:phone"
                  ] ||
                  null,

                website:
                  tags.website ||
                  tags[
                    "contact:website"
                  ] ||
                  null,

                openingHours:
                  tags.opening_hours ||
                  null,

                address:
                  tags[
                    "addr:street"
                  ] ||
                  tags[
                    "addr:full"
                  ] ||
                  null,

                city:
                  tags[
                    "addr:city"
                  ] ||
                  null,

                emergency:
                  tags.emergency ===
                  "yes",

                operator:
                  tags.operator ||
                  null,

                osmId:
                  element.id,

                osmType:
                  element.type,
              };
            })
            .filter(Boolean)
            .sort(
              (a, b) =>
                a.distance -
                b.distance
            );

        const uniqueFacilities =
          [];

        const seen = new Set();

        for (
          const facility of
          mappedFacilities
        ) {
          const key =
            facility.name
              .toLowerCase()
              .trim();

          if (!seen.has(key)) {
            seen.add(key);

            uniqueFacilities.push(
              facility
            );
          }
        }

        setFacilities(
          uniqueFacilities
        );
      } catch (error) {
        console.error(
          "Healthcare lookup failed:",
          error
        );

        if (!cancelled) {
          setFacilityError(
            "We couldn't load nearby healthcare facilities right now. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingFacilities(
            false
          );
        }
      }
    }

    loadFacilities();

    return () => {
      cancelled = true;
    };
  }, [userLocation]);

  const filteredFacilities =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return facilities;
      }

      return facilities.filter(
        (facility) =>
          facility.name
            .toLowerCase()
            .includes(query) ||
          facility.type
            .toLowerCase()
            .includes(query) ||
          facility.city
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      facilities,
      search,
    ]);

  const handleSelectFacility =
    (facility) => {
      setSelectedFacility(
        facility
      );

      setMapCenter([
        facility.latitude,
        facility.longitude,
      ]);
    };

  const openDirections =
    (facility) => {
      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${facility.latitude},${facility.longitude}`;

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    };

  const openWebsite =
    (facility) => {
      if (!facility.website) {
        return;
      }

      let url =
        facility.website;

      if (
        !url.startsWith(
          "http://"
        ) &&
        !url.startsWith(
          "https://"
        )
      ) {
        url = `https://${url}`;
      }

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="landing-page pt-16">
      <NavigationPage />

      {/* =====================================================
          MAP
      ===================================================== */}

      <section
        id="map"
        className="map-section"
      >
        <div className="map-section-container">
          <div className="map-heading">
            <span className="section-label">
              FIND HEALTHCARE
            </span>

            <h1>
              Find the care you
              need, when you
              need it.
            </h1>

            <p>
              Discover nearby
              clinics and
              hospitals using
              your current
              location, then
              get directions
              straight from
              the map.
            </p>
          </div>

          <div className="map-toolbar">
            <div className="map-search">
              <span className="material-symbols-outlined search-icon">
                search
              </span>

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
                placeholder="Search clinics or hospitals..."
                aria-label="Search healthcare facilities"
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined">
                    close
                  </span>
                </button>
              )}
            </div>

            <button
              type="button"
              className="location-button"
              onClick={
                requestUserLocation
              }
              disabled={
                loadingLocation
              }
            >
              <span className="material-symbols-outlined">
                my_location
              </span>

              <span>
                {loadingLocation
                  ? "Finding location..."
                  : "Use my location"}
              </span>
            </button>
          </div>

          <div className="map-feedback">
            {loadingFacilities && (
              <div className="map-message">
                <span className="material-symbols-outlined">
                  progress_activity
                </span>

                <span>
                  Finding nearby
                  healthcare...
                </span>
              </div>
            )}

            {!loadingFacilities &&
              facilityError && (
                <div className="map-message map-message-error">
                  <span className="material-symbols-outlined">
                    error
                  </span>

                  <span>
                    {
                      facilityError
                    }
                  </span>
                </div>
              )}

            {!loadingFacilities &&
              !facilityError &&
              facilities.length >
                0 && (
                <div className="map-message">
                  <span className="material-symbols-outlined">
                    local_hospital
                  </span>

                  <span>
                    {
                      facilities.length
                    }{" "}
                    healthcare{" "}
                    {facilities.length ===
                    1
                      ? "facility"
                      : "facilities"}{" "}
                    found nearby
                  </span>
                </div>
              )}

            {locationError && (
              <div className="map-message map-message-warning">
                <span className="material-symbols-outlined">
                  location_off
                </span>

                <span>
                  {
                    locationError
                  }
                </span>
              </div>
            )}
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={
                false
              }
              doubleClickZoom={
                true
              }
              dragging={true}
              touchZoom={true}
              className="map-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {userLocation && (
                <>
                  <CircleMarker
                    center={[
                      userLocation.latitude,
                      userLocation.longitude,
                    ]}
                    radius={8}
                    pathOptions={{
                      color:
                        "#ffffff",

                      fillColor:
                        "#006b6b",

                      fillOpacity:
                        1,

                      weight: 3,
                    }}
                  >
                    <Popup>
                      <strong>
                        Your
                        location
                      </strong>
                    </Popup>
                  </CircleMarker>

                  <CircleMarker
                    center={[
                      userLocation.latitude,
                      userLocation.longitude,
                    ]}
                    radius={18}
                    pathOptions={{
                      color:
                        "#006b6b",

                      fillColor:
                        "#006b6b",

                      fillOpacity:
                        0.08,

                      weight: 1,
                    }}
                  />
                </>
              )}

              {filteredFacilities.map(
                (
                  facility
                ) => (
                  <Marker
                    key={
                      facility.id
                    }
                    position={[
                      facility.latitude,
                      facility.longitude,
                    ]}
                    icon={
                      facility.type ===
                      "Hospital"
                        ? hospitalIcon
                        : clinicIcon
                    }
                    eventHandlers={{
                      click:
                        () =>
                          handleSelectFacility(
                            facility
                          ),
                    }}
                  >
                    <Popup>
                      <div className="map-popup">
                        <span className="popup-type">
                          {
                            facility.type
                          }
                        </span>

                        <h3>
                          {
                            facility.name
                          }
                        </h3>

                        <div className="popup-info">
                          <span className="material-symbols-outlined">
                            distance
                          </span>

                          <span>
                            {
                              facility.distanceLabel
                            }{" "}
                            away
                          </span>
                        </div>

                        {facility.openingHours && (
                          <div className="popup-info">
                            <span className="material-symbols-outlined">
                              schedule
                            </span>

                            <span>
                              {
                                facility.openingHours
                              }
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          className="popup-button"
                          onClick={() =>
                            handleSelectFacility(
                              facility
                            )
                          }
                        >
                          View details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              )}

              <RecenterMap
                latitude={
                  mapCenter[0]
                }
                longitude={
                  mapCenter[1]
                }
                zoom={
                  selectedFacility
                    ? 15
                    : 13
                }
              />
            </MapContainer>
          </div>

          {!loadingFacilities &&
            !facilityError &&
            search &&
            filteredFacilities.length ===
              0 && (
              <div className="no-results">
                <span className="material-symbols-outlined">
                  search_off
                </span>

                <div>
                  <strong>
                    No matching
                    facilities
                  </strong>

                  <p>
                    Try another
                    clinic or
                    hospital name.
                  </p>
                </div>
              </div>
            )}

          {selectedFacility && (
            <div className="location-card">
              <div className="location-card-main">
                <div className="location-card-icon">
                  <span className="material-symbols-outlined">
                    {selectedFacility.type ===
                    "Hospital"
                      ? "local_hospital"
                      : "medical_services"}
                  </span>
                </div>

                <div className="location-card-info">
                  <span className="location-type">
                    {
                      selectedFacility.type
                    }
                  </span>

                  <h2>
                    {
                      selectedFacility.name
                    }
                  </h2>

                  <div className="location-distance">
                    <span className="material-symbols-outlined">
                      distance
                    </span>

                    <strong>
                      {
                        selectedFacility.distanceLabel
                      }
                    </strong>

                    <span>
                      from your
                      location
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="close-location"
                  onClick={() =>
                    setSelectedFacility(
                      null
                    )
                  }
                  aria-label="Close location details"
                >
                  <span className="material-symbols-outlined">
                    close
                  </span>
                </button>
              </div>

              <div className="location-details">
                {selectedFacility.openingHours && (
                  <div className="location-detail">
                    <span className="material-symbols-outlined">
                      schedule
                    </span>

                    <div>
                      <small>
                        Opening
                        hours
                      </small>

                      <strong>
                        {
                          selectedFacility.openingHours
                        }
                      </strong>
                    </div>
                  </div>
                )}

                {selectedFacility.phone && (
                  <div className="location-detail">
                    <span className="material-symbols-outlined">
                      call
                    </span>

                    <div>
                      <small>
                        Contact
                      </small>

                      <a
                        href={`tel:${selectedFacility.phone}`}
                      >
                        {
                          selectedFacility.phone
                        }
                      </a>
                    </div>
                  </div>
                )}

                {selectedFacility.address && (
                  <div className="location-detail">
                    <span className="material-symbols-outlined">
                      location_on
                    </span>

                    <div>
                      <small>
                        Address
                      </small>

                      <strong>
                        {
                          selectedFacility.address
                        }
                      </strong>
                    </div>
                  </div>
                )}

                {selectedFacility.operator && (
                  <div className="location-detail">
                    <span className="material-symbols-outlined">
                      business
                    </span>

                    <div>
                      <small>
                        Operator
                      </small>

                      <strong>
                        {
                          selectedFacility.operator
                        }
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="location-actions">
                <button
                  type="button"
                  className="directions-button"
                  onClick={() =>
                    openDirections(
                      selectedFacility
                    )
                  }
                >
                  <span className="material-symbols-outlined">
                    directions
                  </span>

                  Directions
                </button>

                {selectedFacility.website && (
                  <button
                    type="button"
                    className="website-button"
                    onClick={() =>
                      openWebsite(
                        selectedFacility
                      )
                    }
                    aria-label="Open facility website"
                  >
                    <span className="material-symbols-outlined">
                      language
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          <p className="map-scroll-note">
            Scroll normally to
            continue down the page.
            Use the map controls to
            zoom in or out.
          </p>
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="intro-section"
      >
        <div className="section-container">
          <div className="intro-content">
            <span className="section-label">
              PHILALINK
            </span>

            <h2>
              Healthcare should be
              <span>
                {" "}
                connected.
              </span>
            </h2>

            <p>
              PhilaLink brings
              patients, healthcare
              workers and medication
              proxies together
              through one simple
              digital platform.
            </p>
          </div>

          <div className="intro-stats">
            <div className="stat-card">
              <span className="material-symbols-outlined">
                medication
              </span>

              <strong>
                Medication
              </strong>

              <span>
                Made easier
              </span>
            </div>

            <div className="stat-card">
              <span className="material-symbols-outlined">
                location_on
              </span>

              <strong>
                Healthcare
              </strong>

              <span>
                Find care nearby
              </span>
            </div>

            <div className="stat-card">
              <span className="material-symbols-outlined">
                notifications_active
              </span>

              <strong>
                Reminders
              </strong>

              <span>
                Never miss a
                collection
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        id="services"
        className="services-section"
      >
        <div className="section-container">
          <div className="section-heading">
            <span className="section-label">
              OUR SERVICES
            </span>

            <h2>
              Healthcare made
              <span>
                {" "}
                simpler.
              </span>
            </h2>

            <p>
              PhilaLink brings the
              essential parts of
              chronic healthcare
              management together
              in one simple
              platform.
            </p>
          </div>

          <div className="services-grid">
            <article className="service-card">
              <div className="service-icon">
                <span className="material-symbols-outlined">
                  medication
                </span>
              </div>

              <h3>
                Medication
                Management
              </h3>

              <p>
                Keep track of
                medication schedules,
                collections and
                treatment information
                in one place.
              </p>
            </article>

            <article className="service-card">
              <div className="service-icon">
                <span className="material-symbols-outlined">
                  location_on
                </span>
              </div>

              <h3>
                Find Healthcare
              </h3>

              <p>
                Discover nearby
                clinics and hospitals
                using your current
                location and an
                interactive map.
              </p>
            </article>

            <article className="service-card">
              <div className="service-icon">
                <span className="material-symbols-outlined">
                  notifications
                </span>
              </div>

              <h3>
                Smart Reminders
              </h3>

              <p>
                Stay on top of
                medication
                collections,
                appointments and
                important healthcare
                reminders.
              </p>
            </article>

            <article className="service-card">
              <div className="service-icon">
                <span className="material-symbols-outlined">
                  group
                </span>
              </div>

              <h3>
                Proxy Support
              </h3>

              <p>
                Make it easier for
                trusted proxies to
                manage medication
                collections on behalf
                of patients.
              </p>
            </article>

            <article className="service-card">
              <div className="service-icon">
                <span className="material-symbols-outlined">
                  chat
                </span>
              </div>

              <h3>
                Phila Chat
              </h3>

              <p>
                Get helpful
                healthcare guidance
                and information
                through the built-in
                PhilaLink assistant.
              </p>
            </article>

            <article className="service-card">
              <div className="service-icon">
                <span className="material-symbols-outlined">
                  security
                </span>
              </div>

              <h3>
                Secure Records
              </h3>

              <p>
                Keep healthcare
                activity organised
                with secure records,
                verification and
                activity tracking.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          HEALTH TIPS
      ===================================================== */}

      <section
        id="health-tips"
        className="health-tips-section"
      >
        <div className="section-container">
          <div className="section-heading">
            <span className="section-label">
              HEALTH TIPS
            </span>

            <h2>
              Simple steps for
              <span>
                {" "}
                better health.
              </span>
            </h2>

            <p>
              Helpful reminders to
              support your everyday
              healthcare routine.
            </p>
          </div>

          <div className="health-tips-grid">
            <article className="health-tip-card">
              <span className="material-symbols-outlined">
                medication
              </span>

              <h3>
                Take medication as
                prescribed
              </h3>

              <p>
                Follow your
                healthcare
                professional's
                instructions and keep
                track of your
                medication
                collections.
              </p>
            </article>

            <article className="health-tip-card">
              <span className="material-symbols-outlined">
                calendar_month
              </span>

              <h3>
                Keep your
                appointments
              </h3>

              <p>
                Regular healthcare
                visits can help
                identify problems
                early and keep your
                treatment on track.
              </p>
            </article>

            <article className="health-tip-card">
              <span className="material-symbols-outlined">
                water_drop
              </span>

              <h3>
                Stay hydrated
              </h3>

              <p>
                Drink enough water
                throughout the day,
                especially when you
                are active or in hot
                weather.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          SINGLE UNIFIED FOOTER
      ===================================================== */}

      <footer
        id="contacts"
        className="bg-[#073b3b] text-white"
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-7 pt-16 sm:px-8 lg:px-12 lg:pt-20">
          {/* GET STARTED */}
          <div className="grid gap-8 border-b border-white/10 pb-14 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.14em] text-[#70dfdf]">
                GET STARTED
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                A simpler way to{" "}
                <span className="text-[#70dfdf]">
                  stay connected to
                  care.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Join PhilaLink and
                bring your healthcare
                journey into one
                connected platform.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-[#075d5d] transition-colors hover:bg-[#e8f5f5]"
              >
                Create your account

                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>

              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* MAIN FOOTER */}
          <div className="grid gap-12 border-b border-white/10 py-14 lg:grid-cols-[1.2fr_2fr] lg:gap-20">
            <div className="max-w-lg">
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <img
                  src="/logo2.png"
                  alt=""
                  aria-hidden="true"
                  className="h-11 w-11 object-contain"
                />

                <span className="text-2xl font-bold tracking-tight text-white">
                  Phila
                  <span className="text-[#70dfdf]">
                    Link
                  </span>
                </span>
              </Link>

              <h3 className="mt-6 text-xl font-semibold leading-snug text-white sm:text-2xl">
                Healthcare connected
                around you.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
                Connecting patients,
                healthcare workers
                and trusted proxies
                through simpler,
                more accessible
                digital healthcare.
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                  Explore
                </h3>

                <div className="mt-5 flex flex-col gap-3.5">
                  <a
                    href="#map"
                    className="w-fit text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                  >
                    Map
                  </a>

                  <a
                    href="#about"
                    className="w-fit text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                  >
                    About
                  </a>

                  <a
                    href="#services"
                    className="w-fit text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                  >
                    Services
                  </a>

                  <a
                    href="#health-tips"
                    className="w-fit text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                  >
                    Health Tips
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                  Patient Access
                </h3>

                <div className="mt-5 flex flex-col gap-3.5">
                  <Link
                    to="/register"
                    className="w-fit text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                  >
                    Create account
                  </Link>

                  <Link
                    to="/login"
                    className="w-fit text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                  >
                    Log in
                  </Link>

                  <a
                    href="#map"
                    className="w-fit text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                  >
                    Find healthcare
                  </a>

                  <a
                    href="#services"
                    className="w-fit text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                  >
                    View services
                  </a>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                  Healthcare Support
                </h3>

                <div className="mt-5 flex flex-col gap-5">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#70dfdf]">
                      emergency
                    </span>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/40">
                        Emergency
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        10177
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#70dfdf]">
                      location_on
                    </span>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/40">
                        Nearby care
                      </p>

                      <a
                        href="#map"
                        className="mt-1 block text-sm text-white/65 transition-colors hover:text-[#70dfdf]"
                      >
                        Find clinics
                        and hospitals
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#70dfdf]">
                      medication
                    </span>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/40">
                        Treatment
                        support
                      </p>

                      <p className="mt-1 text-sm leading-5 text-white/65">
                        Medication
                        schedules,
                        collections
                        and reminders
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="mt-7 flex flex-col gap-4 rounded-xl bg-white/[0.04] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-white/50">
              © 2026 PhilaLink.
              All rights reserved.
            </span>

            <div className="flex items-center justify-between gap-5 sm:justify-end">
              <div className="flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-[17px] text-[#70dfdf]">
                  emergency
                </span>

                <span className="text-white/50">
                  Emergency:
                </span>

                <span className="font-semibold text-white">
                  10177
                </span>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#087878] text-white transition-colors hover:bg-[#0b8d8d]"
                aria-label="Back to top"
              >
                <span className="material-symbols-outlined text-[19px]">
                  arrow_upward
                </span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}