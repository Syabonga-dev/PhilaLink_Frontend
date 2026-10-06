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

const apiMocks = vi.hoisted(() => ({
  getMine: vi.fn(),
  getSupply: vi.fn(),
  logDose: vi.fn(),
}));

function translate(key, options = {}) {
  if (options?.count !== undefined) {
    return `${key}:${options.count}`;
  }

  if (options?.date !== undefined) {
    return `${key}:${options.date}`;
  }

  return key;
}

/*
 * Keep one stable i18n object for the lifetime of the mocked module.
 *
 * MedicationsPage uses i18n as a useCallback dependency. Returning a new
 * object from useTranslation on every render makes the callback identity
 * change on every render, which causes the loading effect to run again.
 */
vi.mock("react-i18next", () => {
  const i18n = {
    language: "en",
    resolvedLanguage: "en",
    t: translate,
  };

  return {
    useTranslation: () => ({
      t: translate,
      i18n,
    }),
  };
});

vi.mock("../../i18n/languages.js", () => ({
  getLanguageLocale: () => "en-ZA",
}));

vi.mock("../../services/api/medications.js", () => ({
  medicationsApi: {
    getMine: apiMocks.getMine,
    getSupply: apiMocks.getSupply,
    logDose: apiMocks.logDose,
  },
}));

vi.mock(
  "../../components/patient/chatbot/AstraCompat.jsx",
  () => ({
    Badge: ({
      label,
      children,
    }) => (
      <span>
        {label || children}
      </span>
    ),

    Button: ({
      children,
      onClick,
      disabled,
      type = "button",
    }) => (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    ),
  })
);

import MedicationsPage from "./MedicationsPage.jsx";

function medicationFixture(overrides = {}) {
  return {
    id: "med-1",
    name: "Metformin",
    dosage: "500 mg",
    form: "Tablet",
    instructions: "Take with food",
    unitsPerDose: 1,
    isActive: true,
    startDate: "2026-01-01T00:00:00Z",
    endDate: null,

    schedules: [
      {
        id: "schedule-1",
        timeOfDay: "08:00:00",
        isActive: true,
      },
      {
        id: "schedule-2",
        timeOfDay: "20:00:00",
        isActive: true,
      },
    ],

    logs: [],

    ...overrides,
  };
}

function supplyFixture(overrides = {}) {
  return {
    medicationId: "med-1",
    name: "Metformin",
    dosage: "500 mg",
    form: "Tablet",
    unitsPerDose: 1,
    dosesPerDay: 2,
    dispensedQuantity: 60,
    estimatedRemainingQuantity: 40,
    daysRemaining: 20,
    lastCollectedAt: "2026-10-01T08:00:00Z",
    calculationStatus: "Available",

    ...overrides,
  };
}

describe("Patient MedicationsPage", () => {
  beforeEach(() => {
    apiMocks.getMine.mockReset();
    apiMocks.getSupply.mockReset();
    apiMocks.logDose.mockReset();

    apiMocks.getMine.mockResolvedValue([
      medicationFixture(),
    ]);

    apiMocks.getSupply.mockResolvedValue([
      supplyFixture(),
    ]);

    apiMocks.logDose.mockResolvedValue({
      success: true,
    });

    vi.spyOn(
      console,
      "error"
    ).mockImplementation(() => {});
  });

  it(
    "loads medications and supply information",
    async () => {
      render(<MedicationsPage />);

      expect(
        await screen.findByText(
          "Metformin"
        )
      ).toBeInTheDocument();

      expect(
        apiMocks.getMine
      ).toHaveBeenCalled();

      expect(
        apiMocks.getSupply
      ).toHaveBeenCalled();

      expect(
        screen.getByText(
          "500 mg"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "medications.active"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "medications.daysRemaining:20"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "medications.markAsTaken"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "medications.skipDose"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "shows the empty state when the patient has no medications",
    async () => {
      apiMocks.getMine.mockResolvedValue([]);
      apiMocks.getSupply.mockResolvedValue([]);

      render(<MedicationsPage />);

      expect(
        await screen.findByText(
          "medications.noMedicationsTitle"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "medications.noMedicationsBody"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "shows medication loading errors returned by the API",
    async () => {
      apiMocks.getMine.mockRejectedValue(
        new Error(
          "Medication service unavailable"
        )
      );

      render(<MedicationsPage />);

      expect(
        await screen.findByText(
          "Medication service unavailable"
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          "Metformin"
        )
      ).not.toBeInTheDocument();
    }
  );

  it(
    "keeps medication records visible when only supply loading fails",
    async () => {
      apiMocks.getSupply.mockRejectedValue(
        new Error(
          "Supply temporarily unavailable"
        )
      );

      render(<MedicationsPage />);

      expect(
        await screen.findByText(
          "Metformin"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Supply temporarily unavailable"
        )
      ).toBeInTheDocument();
    }
  );

  it(
    "logs a medication dose as taken",
    async () => {
      render(<MedicationsPage />);

      const takenButton =
        await screen.findByRole(
          "button",
          {
            name:
              "medications.markAsTaken",
          }
        );

      fireEvent.click(
        takenButton
      );

      await waitFor(() => {
        expect(
          apiMocks.logDose
        ).toHaveBeenCalledWith(
          "med-1",
          {
            taken: true,
            notes: null,
          }
        );
      });

      await waitFor(() => {
        expect(
          apiMocks
            .getMine
            .mock
            .calls
            .length
        ).toBeGreaterThanOrEqual(
          2
        );
      });
    }
  );

  it(
    "logs a medication dose as skipped",
    async () => {
      render(<MedicationsPage />);

      const skipButton =
        await screen.findByRole(
          "button",
          {
            name:
              "medications.skipDose",
          }
        );

      fireEvent.click(
        skipButton
      );

      await waitFor(() => {
        expect(
          apiMocks.logDose
        ).toHaveBeenCalledWith(
          "med-1",
          {
            taken: false,
            notes: null,
          }
        );
      });
    }
  );

  it(
    "shows completed-dose state when all scheduled doses have already been taken today",
    async () => {
      const now =
        new Date().toISOString();

      apiMocks.getMine.mockResolvedValue([
        medicationFixture({
          logs: [
            {
              id: "log-1",
              taken: true,
              takenAt: now,
            },
            {
              id: "log-2",
              taken: true,
              takenAt: now,
            },
          ],
        }),
      ]);

      render(<MedicationsPage />);

      expect(
        await screen.findByText(
          "Metformin"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "medications.todaysDosesComplete"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByRole(
          "button",
          {
            name:
              "medications.todaysDosesComplete",
          }
        )
      ).toBeDisabled();
    }
  );
});