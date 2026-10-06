import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  MemoryRouter,
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
    getDashboard:
      vi.fn(),

    getAssignedWorker:
      vi.fn(),

    getSupply:
      vi.fn(),
  }));

function translate(
  key,
  options = {}
) {
  if (
    options?.name !==
    undefined
  ) {
    return `${key}:${options.name}`;
  }

  if (
    options?.count !==
    undefined
  ) {
    return `${key}:${options.count}`;
  }

  if (
    options?.date !==
    undefined
  ) {
    return `${key}:${options.date}`;
  }

  if (
    options?.time !==
    undefined
  ) {
    return `${key}:${options.time}`;
  }

  return key;
}

vi.mock(
  "react-i18next",
  () => ({
    useTranslation:
      () => ({
        t:
          translate,

        i18n: {
          language:
            "en",

          resolvedLanguage:
            "en",

          t:
            translate,
        },
      }),
  })
);

vi.mock(
  "../../i18n/languages.js",
  () => ({
    getLanguageLocale:
      () =>
        "en-ZA",
  })
);

vi.mock(
  "../../services/api/patients.js",
  () => ({
    patientsApi: {
      getDashboard:
        apiMocks.getDashboard,
    },
  })
);

vi.mock(
  "../../services/api/proxies.js",
  () => ({
    proxiesApi: {
      getMyAssignedWorker:
        apiMocks.getAssignedWorker,
    },
  })
);

vi.mock(
  "../../services/api/medications.js",
  () => ({
    medicationsApi: {
      getSupply:
        apiMocks.getSupply,
    },
  })
);

vi.mock(
  "../../components/patient/chatbot/AstraCompat.jsx",
  () => ({
    Avatar: ({
      name,
      fallback,
    }) => (
      <div
        data-testid="avatar"
      >
        {name ||
          fallback ||
          "avatar"}
      </div>
    ),

    Badge: ({
      label,
      children,
    }) => (
      <span>
        {label ||
          children}
      </span>
    ),

    Button: ({
      children,
      onClick,
      disabled,
      type =
        "button",
    }) => (
      <button
        type={type}
        onClick={
          onClick
        }
        disabled={
          disabled
        }
      >
        {children}
      </button>
    ),
  })
);

import DashboardPage
  from "./DashboardPage.jsx";

function renderPage() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
}

function dashboardFixture(
  overrides = {}
) {
  return {
    fullName:
      "Thabiso Patient",

    patientNumber:
      "PAT-001",

    isProfileComplete:
      true,

    unreadNotifications:
      2,

    nextCollection:
      null,

    medications: [
      {
        id:
          "med-1",

        name:
          "Metformin",

        dosage:
          "500 mg",

        form:
          "Tablet",

        instructions:
          "Take with food",

        nextDoseAt:
          null,
      },
    ],

    upcomingAppointments:
      [],

    healthMetrics:
      [],

    clinic: {
      id:
        "clinic-1",

      name:
        "Dora Nginza Hospital",

      address:
        "Spondo Street",

      phoneNumber:
        "0410000000",

      email:
        "clinic@philalink.test",

      openingTime:
        "08:00:00",

      closingTime:
        "17:00:00",
    },

    ...overrides,
  };
}

function supplyFixture(
  overrides = {}
) {
  return {
    medicationId:
      "med-1",

    name:
      "Metformin",

    dosage:
      "500 mg",

    form:
      "Tablet",

    unitsPerDose:
      1,

    dosesPerDay:
      2,

    dispensedQuantity:
      30,

    estimatedRemainingQuantity:
      24,

    daysRemaining:
      12,

    lastCollectedAt:
      "2026-10-01T08:00:00Z",

    calculationStatus:
      "Available",

    ...overrides,
  };
}

describe(
  "Patient DashboardPage",
  () => {
    beforeEach(() => {
      apiMocks
        .getDashboard
        .mockReset();

      apiMocks
        .getAssignedWorker
        .mockReset();

      apiMocks
        .getSupply
        .mockReset();

      apiMocks
        .getDashboard
        .mockResolvedValue(
          dashboardFixture()
        );

      apiMocks
        .getAssignedWorker
        .mockResolvedValue(
          null
        );

      apiMocks
        .getSupply
        .mockResolvedValue([
          supplyFixture(),
        ]);

      vi.spyOn(
        console,
        "error"
      )
        .mockImplementation(
          () => {}
        );
    });

    it(
      "loads patient dashboard data from the live API services",
      async () => {
        renderPage();

        await waitFor(() => {
          expect(
            apiMocks
              .getDashboard
          ).toHaveBeenCalledTimes(
            1
          );
        });

        expect(
          apiMocks
            .getAssignedWorker
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          apiMocks
            .getSupply
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          await screen
            .findByText(
              "Metformin"
            )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Dora Nginza Hospital"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "PAT-001"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows medication supply days returned by the backend",
      async () => {
        renderPage();

        expect(
          await screen
            .findByText(
              "Metformin"
            )
        ).toBeInTheDocument();

        await waitFor(() => {
          expect(
            screen.getByText(
              "dashboard.daysRemaining:12"
            )
          ).toBeInTheDocument();
        });

        expect(
          screen.getByText(
            "dashboard.unitsLeft:24"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows low-supply state when only a few days remain",
      async () => {
        apiMocks
          .getSupply
          .mockResolvedValue([
            supplyFixture({
              estimatedRemainingQuantity:
                4,

              daysRemaining:
                2,
            }),
          ]);

        renderPage();

        expect(
          await screen
            .findByText(
              "Metformin"
            )
        ).toBeInTheDocument();

        await waitFor(() => {
          expect(
            screen.getByText(
              "dashboard.daysRemaining:2"
            )
          ).toBeInTheDocument();
        });

        expect(
          screen.getByText(
            "dashboard.supplyLow"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "keeps the dashboard usable when medication supply temporarily fails",
      async () => {
        apiMocks
          .getSupply
          .mockRejectedValue(
            new Error(
              "Supply service unavailable"
            )
          );

        renderPage();

        expect(
          await screen
            .findByText(
              "Metformin"
            )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Supply service unavailable"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "dashboard.trySupplyAgain"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows the dashboard error state when the main dashboard request fails",
      async () => {
        apiMocks
          .getDashboard
          .mockRejectedValue(
            new Error(
              "Dashboard service unavailable"
            )
          );

        renderPage();

        expect(
          await screen
            .findByText(
              "dashboard.loadErrorTitle"
            )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Dashboard service unavailable"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Metformin"
          )
        ).not
          .toBeInTheDocument();
      }
    );
  }
);
