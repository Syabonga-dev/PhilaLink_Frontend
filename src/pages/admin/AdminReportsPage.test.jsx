import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const apiMocks =
  vi.hoisted(() => ({
    previewReport:
      vi.fn(),

    downloadDynamicReport:
      vi.fn(),

    downloadSecurePdf:
      vi.fn(),
  }));

vi.mock(
  "../../services/api/clinicAdmin.js",
  () => ({
    clinicAdminApi: {
      previewReport:
        apiMocks
          .previewReport,

      downloadDynamicReport:
        apiMocks
          .downloadDynamicReport,

      downloadSecurePdf:
        apiMocks
          .downloadSecurePdf,
    },
  })
);

import AdminReportsPage
  from "./AdminReportsPage.jsx";

function previewFixture(
  overrides = {}
) {
  return {
    reportType:
      "Collections",

    title:
      "Medication collections",

    dateFrom:
      "2026-09-01",

    dateTo:
      "2026-10-01",

    totalRecords:
      1,

    filterOptions: {
      status: [
        "All",
        "Collected",
        "Missed",
        "Scheduled",
      ],

      medication: [
        "All",
        "Metformin",
      ],

      role: [
        "All",
        "Nurse",
        "Proxy",
      ],

      provider: [
        "All",
      ],

      appointmentType: [
        "All",
      ],

      mode: [
        "All",
      ],
    },

    columns: [
      {
        key:
          "patient",

        label:
          "Patient",

        dataType:
          "text",
      },

      {
        key:
          "status",

        label:
          "Status",

        dataType:
          "status",
      },
    ],

    rows: [
      {
        id:
          "row-1",

        patient:
          "Alice Patient",

        status:
          "Collected",
      },
    ],

    summary: [
      {
        label:
          "Records",

        value:
          "1",
      },
    ],

    ...overrides,
  };
}

function renderPage() {
  return render(
    <AdminReportsPage />
  );
}

describe(
  "AdminReportsPage",
  () => {
    beforeEach(() => {
      apiMocks
        .previewReport
        .mockReset();

      apiMocks
        .downloadDynamicReport
        .mockReset();

      apiMocks
        .downloadSecurePdf
        .mockReset();

      apiMocks
        .previewReport
        .mockResolvedValue(
          previewFixture()
        );

      apiMocks
        .downloadDynamicReport
        .mockResolvedValue(
          "PhilaLink-Collections.xlsx"
        );

      apiMocks
        .downloadSecurePdf
        .mockResolvedValue(
          "PhilaLink-Collections-protected.pdf"
        );
    });

    it(
      "builds the initial report preview from the default collection filters",
      async () => {
        renderPage();

        expect(
          await screen
            .findByText(
              "Alice Patient"
            )
        ).toBeInTheDocument();

        expect(
          apiMocks
            .previewReport
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            reportType:
              "Collections",

            status:
              "All",

            search:
              "",
          })
        );

        expect(
          screen.getByText(
            "Collected"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "applies the search filter to a new preview request",
      async () => {
        renderPage();

        await screen.findByText(
          "Alice Patient"
        );

        fireEvent.change(
          screen.getByPlaceholderText(
            "Patient, medication or staff…"
          ),
          {
            target: {
              value:
                "Alice",
            },
          }
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Apply filters",
            }
          )
        );

        await waitFor(() => {
          expect(
            apiMocks
              .previewReport
          ).toHaveBeenLastCalledWith(
            expect.objectContaining({
              reportType:
                "Collections",

              search:
                "Alice",
            })
          );
        });
      }
    );

    it(
      "changes the report definition and rebuilds the preview",
      async () => {
        renderPage();

        await screen.findByText(
          "Alice Patient"
        );

        apiMocks
          .previewReport
          .mockResolvedValue(
            previewFixture({
              reportType:
                "Patients",

              title:
                "Patients",

              columns: [
                {
                  key:
                    "patient",

                  label:
                    "Patient",

                  dataType:
                    "text",
                },
              ],

              rows: [
                {
                  id:
                    "patient-row",

                  patient:
                    "Patient Report Row",
                },
              ],
            })
          );

        fireEvent.change(
          screen.getByLabelText(
            "Report type"
          ),
          {
            target: {
              value:
                "Patients",
            },
          }
        );

        await waitFor(() => {
          expect(
            apiMocks
              .previewReport
          ).toHaveBeenLastCalledWith(
            expect.objectContaining({
              reportType:
                "Patients",
            })
          );
        });

        expect(
          await screen
            .findByText(
              "Patient Report Row"
            )
        ).toBeInTheDocument();
      }
    );

    it(
      "rejects an invalid report date range before calling the backend again",
      async () => {
        const {
          container,
        } =
          renderPage();

        await screen.findByText(
          "Alice Patient"
        );

        const dateInputs =
          container
            .querySelectorAll(
              'input[type="date"]'
            );

        expect(
          dateInputs.length
        ).toBeGreaterThanOrEqual(
          2
        );

        const callsBefore =
          apiMocks
            .previewReport
            .mock
            .calls
            .length;

        fireEvent.change(
          dateInputs[0],
          {
            target: {
              value:
                "2026-10-10",
            },
          }
        );

        fireEvent.change(
          dateInputs[1],
          {
            target: {
              value:
                "2026-10-01",
            },
          }
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Apply filters",
            }
          )
        );

        expect(
          screen.getByText(
            "The From date cannot be after the To date."
          )
        ).toBeInTheDocument();

        expect(
          apiMocks
            .previewReport
            .mock
            .calls
            .length
        ).toBe(
          callsBefore
        );
      }
    );

    it(
      "exports Excel using the currently applied filters",
      async () => {
        renderPage();

        await screen.findByText(
          "Alice Patient"
        );

        fireEvent.change(
          screen.getByPlaceholderText(
            "Patient, medication or staff…"
          ),
          {
            target: {
              value:
                "Alice",
            },
          }
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Apply filters",
            }
          )
        );

        await waitFor(() => {
          expect(
            apiMocks
              .previewReport
          ).toHaveBeenLastCalledWith(
            expect.objectContaining({
              search:
                "Alice",
            })
          );
        });

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Export Excel",
            }
          )
        );

        await waitFor(() => {
          expect(
            apiMocks
              .downloadDynamicReport
          ).toHaveBeenCalledWith(
            expect.objectContaining({
              reportType:
                "Collections",

              search:
                "Alice",
            }),
            "xlsx"
          );
        });

        expect(
          await screen
            .findByText(
              /PhilaLink-Collections.xlsx generated/
            )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows preview API failures instead of stale report rows",
      async () => {
        apiMocks
          .previewReport
          .mockRejectedValue(
            new Error(
              "Report preview unavailable."
            )
          );

        renderPage();

        expect(
          await screen
            .findByText(
              "Report preview unavailable."
            )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Alice Patient"
          )
        ).not
          .toBeInTheDocument();
      }
    );
  }
);
