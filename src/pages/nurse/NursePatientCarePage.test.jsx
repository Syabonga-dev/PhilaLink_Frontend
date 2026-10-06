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
    getPatientCare:
      vi.fn(),

    getClinicProxies:
      vi.fn(),

    getClinicStock:
      vi.fn(),

    getMe:
      vi.fn(),

    deleteAllergy:
      vi.fn(),

    archiveCondition:
      vi.fn(),

    removeProxy:
      vi.fn(),

    getMedicationLogs:
      vi.fn(),

    createHealthMetric:
      vi.fn(),

    createAllergy:
      vi.fn(),

    updateAllergy:
      vi.fn(),

    createCondition:
      vi.fn(),

    updateCondition:
      vi.fn(),

    createMedication:
      vi.fn(),

    addMedicationSchedule:
      vi.fn(),

    scheduleCollection:
      vi.fn(),

    assignProxy:
      vi.fn(),
  }));

vi.mock(
  "../../services/api/nurses.js",
  () => ({
    nursesApi: {
      getPatientCare:
        apiMocks
          .getPatientCare,

      getClinicProxies:
        apiMocks
          .getClinicProxies,

      getClinicStock:
        apiMocks
          .getClinicStock,

      getMe:
        apiMocks.getMe,

      deleteAllergy:
        apiMocks
          .deleteAllergy,

      archiveCondition:
        apiMocks
          .archiveCondition,

      removeProxy:
        apiMocks
          .removeProxy,

      getMedicationLogs:
        apiMocks
          .getMedicationLogs,

      createHealthMetric:
        apiMocks
          .createHealthMetric,

      createAllergy:
        apiMocks
          .createAllergy,

      updateAllergy:
        apiMocks
          .updateAllergy,

      createCondition:
        apiMocks
          .createCondition,

      updateCondition:
        apiMocks
          .updateCondition,

      createMedication:
        apiMocks
          .createMedication,

      addMedicationSchedule:
        apiMocks
          .addMedicationSchedule,

      scheduleCollection:
        apiMocks
          .scheduleCollection,

      assignProxy:
        apiMocks
          .assignProxy,
    },
  })
);

import NursePatientCarePage
  from "./NursePatientCarePage.jsx";

function patientFixture(
  overrides = {}
) {
  return {
    id:
      "patient-1",

    fullName:
      "Patient One",

    patientNumber:
      "PHL-001",

    clinicName:
      "Dora Nginza Hospital",

    idNumber:
      "9001015000000",

    dateOfBirth:
      "1990-01-01",

    gender:
      "Female",

    phoneNumber:
      "0712345678",

    email:
      "patient@philalink.test",

    addressLine1:
      "1 Main Road",

    addressLine2:
      null,

    suburb:
      "Central",

    city:
      "Gqeberha",

    province:
      "Eastern Cape",

    postalCode:
      "6001",

    allergies: [
      {
        id:
          "allergy-1",

        name:
          "Penicillin",

        reaction:
          "Rash",

        severity:
          "Moderate",
      },
    ],

    conditions:
      [],

    medications:
      [],

    proxies:
      [],

    healthMetrics:
      [],

    collections:
      [],

    appointments:
      [],

    ...overrides,
  };
}

function renderPage() {
  return render(
    <MemoryRouter
      initialEntries={[
        "/nurse/patients/patient-1",
      ]}
    >
      <Routes>
        <Route
          path="/nurse/patients/:patientId"
          element={
            <NursePatientCarePage />
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe(
  "NursePatientCarePage",
  () => {
    beforeEach(() => {
      Object.values(
        apiMocks
      ).forEach(
        mock =>
          mock.mockReset()
      );

      apiMocks
        .getPatientCare
        .mockResolvedValue(
          patientFixture()
        );

      apiMocks
        .getClinicProxies
        .mockResolvedValue(
          []
        );

      apiMocks
        .getClinicStock
        .mockResolvedValue(
          []
        );

      apiMocks.getMe
        .mockResolvedValue({
          id:
            "nurse-1",

          fullName:
            "Nurse One",

          clinicId:
            "clinic-1",
        });

      apiMocks
        .deleteAllergy
        .mockResolvedValue(
          null
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
      "loads the patient care record within the route patient scope",
      async () => {
        renderPage();

        expect(
          await screen
            .findByText(
              "Patient One"
            )
        ).toBeInTheDocument();

        expect(
          apiMocks
            .getPatientCare
        ).toHaveBeenCalledWith(
          "patient-1"
        );

        expect(
          apiMocks
            .getClinicProxies
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          apiMocks
            .getClinicStock
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          apiMocks.getMe
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          screen.getByText(
            /PHL-001/
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Dora Nginza Hospital"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Penicillin"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "keeps the patient record available when optional clinic context calls fail",
      async () => {
        apiMocks
          .getClinicProxies
          .mockRejectedValue(
            new Error(
              "Proxy lookup unavailable"
            )
          );

        apiMocks
          .getClinicStock
          .mockRejectedValue(
            new Error(
              "Stock lookup unavailable"
            )
          );

        renderPage();

        expect(
          await screen
            .findByText(
              "Patient One"
            )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Patient information"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows the protected patient-load error instead of a care record",
      async () => {
        apiMocks
          .getPatientCare
          .mockRejectedValue(
            new Error(
              "Patient is outside your clinic scope."
            )
          );

        renderPage();

        expect(
          await screen
            .findByText(
              "Patient is outside your clinic scope."
            )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Patient One"
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "removes an allergy through the nurse API and refreshes the record",
      async () => {
        vi.spyOn(
          window,
          "confirm"
        )
          .mockReturnValue(
            true
          );

        renderPage();

        const removeButton =
          await screen
            .findByTitle(
              "Remove allergy"
            );

        fireEvent.click(
          removeButton
        );

        await waitFor(() => {
          expect(
            apiMocks
              .deleteAllergy
          ).toHaveBeenCalledWith(
            "patient-1",
            "allergy-1"
          );
        });

        expect(
          await screen
            .findByText(
              "Allergy removed."
            )
        ).toBeInTheDocument();

        await waitFor(() => {
          expect(
            apiMocks
              .getPatientCare
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
      "does not remove an allergy when the nurse cancels confirmation",
      async () => {
        vi.spyOn(
          window,
          "confirm"
        )
          .mockReturnValue(
            false
          );

        renderPage();

        const removeButton =
          await screen
            .findByTitle(
              "Remove allergy"
            );

        fireEvent.click(
          removeButton
        );

        expect(
          apiMocks
            .deleteAllergy
        ).not
          .toHaveBeenCalled();
      }
    );
  }
);
