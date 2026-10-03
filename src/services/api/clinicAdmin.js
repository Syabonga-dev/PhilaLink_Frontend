import {
  API_BASE_URL,
  ApiError,
  api,
  tokenStore,
} from "./client.js";

function buildReportQuery(
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

  if (
    standardMatch?.[1]
  ) {
    return standardMatch[1];
  }

  return fallbackName;
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
    // Keep fallback message.
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

async function downloadFile(
  url,
  fallbackName
) {
  const response =
    await authenticatedFetch(
      url,
      {
        method:
          "GET",
      }
    );

  return saveDownload(
    response,
    fallbackName
  );
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

export const clinicAdminApi = {
  // =====================================================
  // ANALYTICS
  // =====================================================

  getAnalytics: (
    months = 6
  ) =>
    api.get(
      `/api/clinic-admin/analytics?months=${encodeURIComponent(
        months
      )}`
    ),

  // =====================================================
  // STAFF
  // =====================================================

  getStaff: (
    role = "All"
  ) => {
    const query =
      role &&
      role !==
        "All"
        ? `?role=${encodeURIComponent(
            role
          )}`
        : "";

    return api.get(
      `/api/clinic-admin/staff${query}`
    );
  },

  activateStaff: (
    userId
  ) =>
    api.patch(
      `/api/clinic-admin/staff/${userId}/activate`
    ),

  deactivateStaff: (
    userId
  ) =>
    api.patch(
      `/api/clinic-admin/staff/${userId}/deactivate`
    ),

  // =====================================================
  // INVENTORY
  // =====================================================

  getStock: () =>
    api.get(
      "/api/clinic-stock"
    ),

  createStock: (
    payload
  ) =>
    api.post(
      "/api/clinic-stock",
      payload
    ),

  updateStock: (
    stockId,
    payload
  ) =>
    api.put(
      `/api/clinic-stock/${stockId}`,
      payload
    ),

  adjustStock: (
    stockId,
    payload
  ) =>
    api.patch(
      `/api/clinic-stock/${stockId}/adjust`,
      payload
    ),

  // =====================================================
  // DYNAMIC REPORT BUILDER
  // =====================================================

  previewReport: (
    filters
  ) => {
    const query =
      buildReportQuery(
        filters
      );

    return api.get(
      `/api/clinic-admin/report-builder/preview?${query.toString()}`
    );
  },

  downloadDynamicReport:
    async (
      filters,
      format
    ) => {
      const normalizedFormat =
        format ===
        "excel"
          ? "xlsx"
          : format;

      if (
        normalizedFormat ===
        "pdf"
      ) {
        throw new ApiError(
          "PDF exports must use the secure password-protected export flow."
        );
      }

      const query =
        buildReportQuery({
          ...filters,

          format:
            normalizedFormat,
        });

      const reportType =
        filters?.reportType ||
        "report";

      return downloadFile(
        `/api/clinic-admin/report-builder/export?${query.toString()}`,
        `PhilaLink-${reportType}.${normalizedFormat}`
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
          "/api/clinic-admin/report-builder/export/pdf",
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
        `PhilaLink-${filters?.reportType || "clinic-report"}-protected.pdf`
      );
    },

  // =====================================================
  // LEGACY REPORT EXPORT
  // =====================================================

  downloadReport:
    async ({
      format,
      rangeDays,
    }) => {
      const normalizedFormat =
        format ===
        "excel"
          ? "xlsx"
          : format;

      const query =
        new URLSearchParams({
          format:
            normalizedFormat,

          rangeDays:
            String(
              rangeDays
            ),
        });

      return downloadFile(
        `/api/clinic-admin/reports/export?${query.toString()}`,
        `PhilaLink-clinic-report.${normalizedFormat}`
      );
    },
};
