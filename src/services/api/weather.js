import { api } from "./client.js";

function buildCoordinatesQuery(
  latitude,
  longitude
) {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return "";
  }

  const params =
    new URLSearchParams({
      latitude:
        latitude.toString(),
      longitude:
        longitude.toString(),
    });

  return `?${params.toString()}`;
}

export const weatherApi = {
  getCurrent: (
    latitude,
    longitude
  ) =>
    api.get(
      `/api/weather/me/current${buildCoordinatesQuery(
        latitude,
        longitude
      )}`
    ),

  getForecast: (
    latitude,
    longitude
  ) =>
    api.get(
      `/api/weather/me/forecast${buildCoordinatesQuery(
        latitude,
        longitude
      )}`
    ),

  generateTip: (
    latitude,
    longitude
  ) =>
    api.post(
      `/api/weather/me/tips${buildCoordinatesQuery(
        latitude,
        longitude
      )}`
    ),
};