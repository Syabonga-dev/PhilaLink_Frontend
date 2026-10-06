import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const apiMocks =
  vi.hoisted(() => ({
    getCare:
      vi.fn(),
  }));

vi.mock(
  "../../services/api/proxies.js",
  () => ({
    proxiesApi: {
      getCare:
        apiMocks.getCare,
    },
  })
);

import ProxyPatientsPage
  from "./ProxyPatientsPage.jsx";

function careFixture() {
  return {
    clinicName:
      "Dora Nginza Hospital",

    patients: [
      {
        proxyLinkId:
          "link-1",

        patientId:
          "patient-1",

        patientName:
          "Alpha Patient",

        patientNumber:
          "PHL-001",

        clinicName:
          "Dora Nginza Hospital",

        assignedAt:
          "2026-09-01T08:00:00Z",

        nextCollectionDate:
          "2026-09-20T08:00:00Z",

        collectionStatus:
          "Overdue",
      },

      {
        proxyLinkId:
          "link-2",

        patientId:
          "patient-2",

        patientName:
          "Beta Patient",

        patientNumber:
          "PHL-002",

        clinicName:
          "Dora Nginza Hospital",

        assignedAt:
          "2026-09-15T08:00:00Z",

        nextCollectionDate:
          null,

        collectionStatus:
          null,
      },
    ],
  };
}

function LocationProbe() {
  const location =
    useLocation();

  return (
    <div
      data-testid="location"
    >
      {
        location.pathname
      }
      {
        location.search
      }
    </div>
  );
}

function renderPage(
  initialEntry =
    "/proxy/patients"
) {
  return render(
    <MemoryRouter
      initialEntries={[
        initialEntry,
      ]}
    >
      <Routes>
        <Route
          path="/proxy/patients"
          element={
            <ProxyPatientsPage />
          }
        />

        <Route
          path="/proxy/collections"
          element={
            <LocationProbe />
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe(
  "ProxyPatientsPage",
  () => {
    beforeEach(() => {
      apiMocks
        .getCare
        .mockReset();

      apiMocks
        .getCare
        .mockResolvedValue(
          careFixture()
        );

      vi.spyOn(
        console,
        "error"
      )
        .mockImplementation(
          () => {}
        );
    });

    it(
      "loads only the patients returned by the linked-patient API",
      async () => {
        renderPage();

        expect(
          await screen
            .findByText(
              "Linked patients"
            )
        ).toBeInTheDocument();

        expect(
          apiMocks.getCare
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          screen
            .getAllByText(
              "Alpha Patient"
            )
            .length
        ).toBeGreaterThan(
          0
        );

        expect(
          screen
            .getAllByText(
              "Beta Patient"
            )
            .length
        ).toBeGreaterThan(
          0
        );

        expect(
          screen.getByText(
            "2 patients"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "filters linked patients by patient number",
      async () => {
        renderPage();

        await screen.findByText(
          "Linked patients"
        );

        fireEvent.change(
          screen.getByPlaceholderText(
            "Search patient or number"
          ),
          {
            target: {
              value:
                "PHL-002",
            },
          }
        );

        await waitFor(() => {
          expect(
            screen.getByText(
              "1 patients"
            )
          ).toBeInTheDocument();
        });

        expect(
          screen
            .queryAllByText(
              "Alpha Patient"
            )
            .length
        ).toBe(
          0
        );

        expect(
          screen
            .getAllByText(
              "Beta Patient"
            )
            .length
        ).toBeGreaterThan(
          0
        );
      }
    );

    it(
      "filters the proxy list to overdue collections",
      async () => {
        renderPage();

        await screen.findByText(
          "Linked patients"
        );

        fireEvent.change(
          screen.getByDisplayValue(
            "All statuses"
          ),
          {
            target: {
              value:
                "overdue",
            },
          }
        );

        await waitFor(() => {
          expect(
            screen.getByText(
              "1 patients"
            )
          ).toBeInTheDocument();
        });

        expect(
          screen
            .getAllByText(
              "Alpha Patient"
            )
            .length
        ).toBeGreaterThan(
          0
        );

        expect(
          screen
            .queryAllByText(
              "Beta Patient"
            )
            .length
        ).toBe(
          0
        );
      }
    );

    it(
      "opens the selected linked patient's collection view",
      async () => {
        renderPage();

        const buttons =
          await screen
            .findAllByRole(
              "button",
              {
                name:
                  "View Collections",
              }
            );

        fireEvent.click(
          buttons[0]
        );

        expect(
          await screen
            .findByTestId(
              "location"
            )
        ).toHaveTextContent(
          "/proxy/collections?patientId=patient-1"
        );
      }
    );

    it(
      "shows API failures without exposing an unrelated patient list",
      async () => {
        apiMocks
          .getCare
          .mockRejectedValue(
            new Error(
              "Proxy access is no longer active."
            )
          );

        renderPage();

        expect(
          await screen
            .findByText(
              "Proxy access is no longer active."
            )
        ).toBeInTheDocument();

        expect(
          screen
            .queryAllByText(
              "Alpha Patient"
            )
            .length
        ).toBe(
          0
        );
      }
    );
  }
);
