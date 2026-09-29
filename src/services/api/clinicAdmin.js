import {
  API_BASE_URL,
  ApiError,
  api,
  tokenStore,
} from "./client.js";

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
      role !== "All"
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
  // REPORTS
  // =====================================================

  downloadReport: async ({
    format,
    rangeDays,
  }) => {
    const normalizedFormat =
      format === "excel"
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

    const token =
      tokenStore.getToken();

    let response;

    try {
      response =
        await fetch(
          `${API_BASE_URL}/api/clinic-admin/reports/export?${query.toString()}`,
          {
            method:
              "GET",

            headers: {
              Accept:
                "*/*",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
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

    if (!response.ok) {
      let message =
        `Report generation failed (${response.status}).`;

      try {
        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

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

    const blob =
      await response.blob();

    const disposition =
      response.headers.get(
        "content-disposition"
      ) || "";

    let fileName =
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
      fileName =
        decodeURIComponent(
          utfMatch[1]
        );
    } else if (
      standardMatch?.[1]
    ) {
      fileName =
        standardMatch[1];
    }

    if (!fileName) {
      const extension =
        normalizedFormat ===
        "xlsx"
          ? "xlsx"
          : normalizedFormat;

      fileName =
        `PhilaLink-clinic-report.${extension}`;
    }

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
  },
};