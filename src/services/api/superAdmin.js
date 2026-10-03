import {
  API_BASE_URL,
  ApiError,
  api,
  tokenStore,
} from "./client.js";

function buildQuery(
  filters = {}
) {
  const params =
    new URLSearchParams();

  Object.entries(
    filters
  ).forEach(
    ([
      key,
      value,
    ]) => {
      if (
        value ===
          null ||
        value ===
          undefined ||
        value ===
          "" ||
        value ===
          "All"
      ) {
        return;
      }

      params.set(
        key,
        String(
          value
        )
      );
    }
  );

  return params;
}

function fileNameFromResponse(
  response,
  fallbackName
) {
  const disposition =
    response.headers.get(
      "content-disposition"
    ) ||
    "";

  const utfMatch =
    disposition.match(
      /filename\*=UTF-8''([^;]+)/i
    );

  const standardMatch =
    disposition.match(
      /filename="?([^";]+)"?/i
    );

  if (
    utfMatch?.[1]
  ) {
    try {
      return decodeURIComponent(
        utfMatch[1]
      );
    } catch {
      return utfMatch[1];
    }
  }

  return standardMatch?.[1] ||
    fallbackName;
}

async function authenticatedFetch(
  path,
  init = {}
) {
  const token =
    tokenStore.getToken();

  try {
    return await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...init,

        headers: {
          Accept:
            "*/*",

          ...(init.body
            ? {
                "Content-Type":
                  "application/json",
              }
            : {}),

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),

          ...(init.headers ||
            {}),
        },
      }
    );
  } catch {
    throw new ApiError(
      "Can't reach the PhilaLink server.",
      {
        isNetworkError:
          true,
      }
    );
  }
}

async function throwDownloadError(
  response
) {
  if (
    response.status ===
    401
  ) {
    tokenStore.clear();

    throw new ApiError(
      "Your session has expired. Please log in again.",
      {
        status:
          401,
      }
    );
  }

  let message =
    `Report generation failed (${response.status}).`;

  try {
    const contentType =
      response.headers.get(
        "content-type"
      ) ||
      "";

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      const data =
        await response.json();

      message =
        data?.message ||
        data?.title ||
        message;
    } else {
      const text =
        await response.text();

      if (text) {
        message =
          text;
      }
    }
  } catch {
    // Keep fallback.
  }

  throw new ApiError(
    message,
    {
      status:
        response.status,
    }
  );
}

async function saveDownload(
  response,
  fallbackName
) {
  if (
    !response.ok
  ) {
    await throwDownloadError(
      response
    );
  }

  const blob =
    await response.blob();

  const fileName =
    fileNameFromResponse(
      response,
      fallbackName
    );

  const objectUrl =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    objectUrl;

  link.download =
    fileName;

  document.body
    .appendChild(
      link
    );

  link.click();

  link.remove();

  URL.revokeObjectURL(
    objectUrl
  );

  return fileName;
}

async function buildLogoJpegBase64() {
  try {
    const image =
      new Image();

    image.decoding =
      "async";

    const loaded =
      new Promise(
        (
          resolve,
          reject
        ) => {
          image.onload =
            resolve;

          image.onerror =
            reject;
        }
      );

    image.src =
      "/logo2.png";

    await loaded;

    const size =
      220;

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      size;

    canvas.height =
      size;

    const context =
      canvas.getContext(
        "2d"
      );

    if (!context) {
      return null;
    }

    context.fillStyle =
      "#ffffff";

    context.fillRect(
      0,
      0,
      size,
      size
    );

    const ratio =
      Math.min(
        size /
          image.naturalWidth,
        size /
          image.naturalHeight
      );

    const width =
      Math.max(
        1,
        Math.round(
          image.naturalWidth *
            ratio
        )
      );

    const height =
      Math.max(
        1,
        Math.round(
          image.naturalHeight *
            ratio
        )
      );

    const x =
      Math.round(
        (
          size -
          width
        ) /
          2
      );

    const y =
      Math.round(
        (
          size -
          height
        ) /
          2
      );

    context.drawImage(
      image,
      x,
      y,
      width,
      height
    );

    const dataUrl =
      canvas.toDataURL(
        "image/jpeg",
        0.9
      );

    const comma =
      dataUrl.indexOf(
        ","
      );

    return comma >=
      0
      ? dataUrl.slice(
          comma +
            1
        )
      : null;
  } catch {
    return null;
  }
}

export const superAdminApi = {
  getMe: () =>
    api.get(
      "/api/super-admin/me"
    ),

  getClinics: () =>
    api.get(
      "/api/super-admin/clinics"
    ),

  getClinicAdmins:
    () =>
      api.get(
        "/api/super-admin/clinic-admins"
      ),

  assignClinicAdmin: (
    userId,
    clinicId
  ) => {
    if (
      !userId ||
      !clinicId
    ) {
      throw new Error(
        "A Clinic Administrator and clinic are required."
      );
    }

    return api.patch(
      `/api/super-admin/clinic-admins/${userId}/assign`,
      {
        clinicId,
      }
    );
  },

  deassignClinicAdmin:
    userId => {
      if (!userId) {
        throw new Error(
          "A Clinic Administrator is required."
        );
      }

      return api.patch(
        `/api/super-admin/clinic-admins/${userId}/deassign`
      );
    },

  getAnalytics: (
    filters = {}
  ) => {
    const query =
      buildQuery(
        filters
      );

    return api.get(
      `/api/super-admin/analytics?${query.toString()}`
    );
  },

  previewReport: (
    filters = {}
  ) => {
    const query =
      buildQuery(
        filters
      );

    return api.get(
      `/api/super-admin/report-builder/preview?${query.toString()}`
    );
  },

  downloadExcel:
    async (
      filters = {}
    ) => {
      const query =
        buildQuery({
          ...filters,

          format:
            "xlsx",
        });

      const response =
        await authenticatedFetch(
          `/api/super-admin/report-builder/export?${query.toString()}`,
          {
            method:
              "GET",
          }
        );

      return saveDownload(
        response,
        `PhilaLink-${filters?.reportType || "system-report"}.xlsx`
      );
    },

  downloadSecurePdf:
    async (
      filters,
      password
    ) => {
      if (
        !password ||
        password.length <
          8
      ) {
        throw new ApiError(
          "A PDF password of at least 8 characters is required."
        );
      }

      const logoJpegBase64 =
        await buildLogoJpegBase64();

      const response =
        await authenticatedFetch(
          "/api/super-admin/report-builder/export/pdf",
          {
            method:
              "POST",

            body:
              JSON.stringify({
                filters,
                password,
                logoJpegBase64,
              }),
          }
        );

      return saveDownload(
        response,
        `PhilaLink-${filters?.reportType || "system-report"}-protected.pdf`
      );
    },
};
