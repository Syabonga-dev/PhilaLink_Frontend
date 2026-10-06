import {
  fireEvent,
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
    getClinicAdmins:
      vi.fn(),

    getClinics:
      vi.fn(),

    assignClinicAdmin:
      vi.fn(),

    deassignClinicAdmin:
      vi.fn(),
  }));

vi.mock(
  "../../services/api/superAdmin.js",
  () => ({
    superAdminApi: {
      getClinicAdmins:
        apiMocks
          .getClinicAdmins,

      getClinics:
        apiMocks
          .getClinics,

      assignClinicAdmin:
        apiMocks
          .assignClinicAdmin,

      deassignClinicAdmin:
        apiMocks
          .deassignClinicAdmin,
    },
  })
);

import ManageClinicAdminsPage
  from "./ManageClinicAdminsPage.jsx";

function adminsFixture() {
  return [
    {
      userId:
        "admin-1",

      fullName:
        "Assigned Admin",

      email:
        "assigned@philalink.test",

      phoneNumber:
        "0711111111",

      clinicId:
        "clinic-1",

      clinicName:
        "Clinic One",

      isActive:
        true,
    },

    {
      userId:
        "admin-2",

      fullName:
        "Unassigned Admin",

      email:
        "unassigned@philalink.test",

      phoneNumber:
        "0722222222",

      clinicId:
        null,

      clinicName:
        null,

      isActive:
        true,
    },
  ];
}

function clinicsFixture() {
  return [
    {
      id:
        "clinic-1",

      name:
        "Clinic One",

      isActive:
        true,
    },

    {
      id:
        "clinic-2",

      name:
        "Clinic Two",

      isActive:
        true,
    },

    {
      id:
        "clinic-3",

      name:
        "Inactive Clinic",

      isActive:
        false,
    },
  ];
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ManageClinicAdminsPage />
    </MemoryRouter>
  );
}

describe(
  "ManageClinicAdminsPage",
  () => {
    beforeEach(() => {
      apiMocks
        .getClinicAdmins
        .mockReset();

      apiMocks
        .getClinics
        .mockReset();

      apiMocks
        .assignClinicAdmin
        .mockReset();

      apiMocks
        .deassignClinicAdmin
        .mockReset();

      apiMocks
        .getClinicAdmins
        .mockResolvedValue(
          adminsFixture()
        );

      apiMocks
        .getClinics
        .mockResolvedValue(
          clinicsFixture()
        );
    });

    it(
      "loads ClinicAdmin accounts and their clinic assignments",
      async () => {
        renderPage();

        expect(
          await screen
            .findByText(
              "Assigned Admin"
            )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Unassigned Admin"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Clinic One"
          )
        ).toBeInTheDocument();

        expect(
          apiMocks
            .getClinicAdmins
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          apiMocks
            .getClinics
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );

    it(
      "assigns an unassigned ClinicAdmin to an active clinic",
      async () => {
        apiMocks
          .assignClinicAdmin
          .mockResolvedValue({
            ...adminsFixture()[1],

            clinicId:
              "clinic-2",

            clinicName:
              "Clinic Two",

            notificationEmailSent:
              true,

            notificationEmailMessage:
              "Notification email sent.",
          });

        renderPage();

        await screen.findByText(
          "Unassigned Admin"
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Assign",
            }
          )
        );

        fireEvent.change(
          screen.getByLabelText(
            "Clinic"
          ),
          {
            target: {
              value:
                "clinic-2",
            },
          }
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Save assignment",
            }
          )
        );

        await waitFor(() => {
          expect(
            apiMocks
              .assignClinicAdmin
          ).toHaveBeenCalledWith(
            "admin-2",
            "clinic-2"
          );
        });

        expect(
          await screen
            .findByText(
              /is now assigned to Clinic Two/
            )
        ).toBeInTheDocument();
      }
    );

    it(
      "deassigns an existing ClinicAdmin",
      async () => {
        apiMocks
          .deassignClinicAdmin
          .mockResolvedValue({
            ...adminsFixture()[0],

            clinicId:
              null,

            clinicName:
              null,

            notificationEmailSent:
              true,

            notificationEmailMessage:
              "Notification email sent.",
          });

        renderPage();

        await screen.findByText(
          "Assigned Admin"
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Deassign",
            }
          )
        );

        expect(
          screen.getByText(
            "Deassign Clinic Administrator"
          )
        ).toBeInTheDocument();

        const deassignButtons =
          screen.getAllByRole(
            "button",
            {
              name:
                "Deassign",
            }
          );

        fireEvent.click(
          deassignButtons[
            deassignButtons.length -
              1
          ]
        );

        await waitFor(() => {
          expect(
            apiMocks
              .deassignClinicAdmin
          ).toHaveBeenCalledWith(
            "admin-1"
          );
        });

        expect(
          await screen
            .findByText(
              /has been deassigned from the clinic/
            )
        ).toBeInTheDocument();
      }
    );

    it(
      "does not offer inactive clinics in the assignment selector",
      async () => {
        renderPage();

        await screen.findByText(
          "Unassigned Admin"
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Assign",
            }
          )
        );

        expect(
          screen.getByRole(
            "option",
            {
              name:
                "Clinic One",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "option",
            {
              name:
                "Clinic Two",
            }
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByRole(
            "option",
            {
              name:
                "Inactive Clinic",
            }
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "shows assignment-directory API failures",
      async () => {
        apiMocks
          .getClinicAdmins
          .mockRejectedValue(
            new Error(
              "Clinic administrator directory unavailable."
            )
          );

        renderPage();

        expect(
          await screen
            .findByText(
              "Clinic administrator directory unavailable."
            )
        ).toBeInTheDocument();
      }
    );
  }
);
