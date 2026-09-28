import {
  api,
} from "./client.js";

/* ========================================================= */
/* QUERY STRING                                              */
/* ========================================================= */

function buildQueryString(
  params = {}
) {
  const searchParams =
    new URLSearchParams();

  Object.entries(
    params
  ).forEach(
    ([
      key,
      value,
    ]) => {
      if (
        value ===
          undefined ||
        value === null ||
        value === ""
      ) {
        return;
      }

      searchParams.set(
        key,
        String(value)
      );
    }
  );

  const query =
    searchParams.toString();

  return query
    ? `?${query}`
    : "";
}

/* ========================================================= */
/* PROXY API                                                 */
/* ========================================================= */

export const proxiesApi = {
  // =====================================================
  // PATIENT-FACING ASSIGNED PROXY
  // =====================================================

  getMyAssignedWorker: () =>
    api.get(
      "/api/proxies/me"
    ),

  // =====================================================
  // PROXY PROFILE
  // =====================================================

  getProfile: ({
    signal,
  } = {}) =>
    api.get(
      "/api/proxies/me/profile",
      {
        signal,
      }
    ),

  updateProfile: (
    payload
  ) =>
    api.put(
      "/api/proxies/me/profile",
      payload
    ),

  // =====================================================
  // PROXY PATIENTS
  // =====================================================

  getManagedPatients: () =>
    api.get(
      "/api/proxies/me/patients"
    ),

  getMyPatients: () =>
    api.get(
      "/api/proxies/me/patients"
    ),

  // =====================================================
  // PROXY CARE
  // =====================================================

  getCare: ({
    signal,
  } = {}) =>
    api.get(
      "/api/proxies/me/care",
      {
        signal,
      }
    ),

  // =====================================================
  // PROXY COLLECTIONS
  // =====================================================

  getCollections: ({
    patientId,
    from,
    to,
    status,
    search,
    sort,
    signal,
  } = {}) => {
    const query =
      buildQueryString({
        patientId,
        from,
        to,
        status,
        search,
        sort,
      });

    return api.get(
      `/api/proxies/me/collections${query}`,
      {
        signal,
      }
    );
  },

  // =====================================================
  // COLLECTION DETAILS
  // =====================================================

  getCollectionById: (
    collectionId,
    {
      signal,
    } = {}
  ) => {
    if (!collectionId) {
      throw new Error(
        "A collection ID is required."
      );
    }

    return api.get(
      `/api/proxies/me/collections/${collectionId}`,
      {
        signal,
      }
    );
  },
};