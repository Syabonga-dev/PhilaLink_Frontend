import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Renders an interactive Leaflet map with a marker per clinic.
 *
 * Uses free CARTO "Positron" basemap tiles (built on OpenStreetMap data) —
 * no API key, billing account, or platform/referrer restrictions required.
 * Markers are drawn as plain circle markers (no external icon images), which
 * sidesteps the classic Leaflet-default-icon-path issue you get with bundlers.
 *
 * @param {{lat:number,lng:number}} center
 * @param {Array<{id:string,name:string,lat:number,lng:number,address?:string}>} clinics
 * @param {string|null} selectedId
 * @param {(clinic:object)=>void} onSelect
 */
export default function ClinicMap({ center, clinics = [], selectedId, onSelect }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  // Initialize the map once.
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      mapInstance.current = L.map(mapRef.current, {
        center: [center?.lat ?? 0, center?.lng ?? 0],
        zoom: 12,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(mapInstance.current);

      setStatus("ready");
    } catch {
      setStatus("error");
    }

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when `center` changes (e.g. geolocation resolves).
  useEffect(() => {
    if (status === "ready" && mapInstance.current && center) {
      mapInstance.current.panTo([center.lat, center.lng]);
    }
  }, [center, status]);

  // Sync markers whenever the clinic list changes.
  useEffect(() => {
    if (status !== "ready" || !mapInstance.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = clinics.map((clinic) => {
      const marker = L.circleMarker([clinic.lat, clinic.lng], {
        radius: clinic.id === selectedId ? 10 : 7,
        fillColor: "#006a6a",
        fillOpacity: 1,
        color: "#ffffff",
        weight: 2,
      }).addTo(mapInstance.current);
      marker.bindTooltip(clinic.name);
      marker.on("click", () => onSelect?.(clinic));
      return marker;
    });
  }, [clinics, status, selectedId, onSelect]);

  if (status === "error") {
    return (
      <MapFallback
        title="Couldn't load the map"
        description="Something went wrong initializing the clinic map. You can still pick a clinic from the list below."
        clinics={clinics}
        onSelect={onSelect}
        selectedId={selectedId}
      />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-container-low">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary">
            progress_activity
          </span>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}

function MapFallback({ title, description, clinics, onSelect, selectedId }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
      <span className="material-symbols-outlined text-4xl text-outline">map</span>
      <div>
        <p className="text-sm font-semibold text-on-surface">{title}</p>
        <p className="mt-1 max-w-xs text-xs text-on-surface-variant">{description}</p>
      </div>
      {clinics.length > 0 && (
        <div className="w-full max-w-xs space-y-1.5 text-left">
          {clinics.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect?.(c)}
              className={`block w-full rounded-md border px-3 py-2 text-xs ${
                c.id === selectedId
                  ? "border-primary bg-primary-container/10 text-primary"
                  : "border-outline-variant bg-white text-on-surface"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}