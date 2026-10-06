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

const mocks =
  vi.hoisted(() => {
    class MockApiError
      extends Error {
      constructor(
        message,
        {
          status,
          errors,
        } = {}
      ) {
        super(message);

        this.name =
          "ApiError";

        this.status =
          status;

        this.errors =
          errors ??
          null;
      }
    }

    return {
      getMe:
        vi.fn(),

      registerNurse:
        vi.fn(),

      registerProxy:
        vi.fn(),

      resendInvitation:
        vi.fn(),

      ApiError:
        MockApiError,
    };
  });

vi.mock(
  "../../services/api/admin.js",
  () => ({
    adminApi: {
      getMe:
        mocks.getMe,

      registerNurse:
        mocks
          .registerNurse,

      registerProxy:
        mocks
          .registerProxy,

      resendInvitation:
        mocks
          .resendInvitation,
    },
  })
);

vi.mock(
  "../../services/api/client.js",
  () => ({
    ApiError:
      mocks.ApiError,
  })
);

import RegisterStaffPage
  from "./RegisterStaffPage.jsx";

function changeField(
  label,
  value
) {
  fireEvent.change(
    screen.getByLabelText(
      label
    ),
    {
      target: {
        value,
      },
    }
  );
}

function fillSharedFields({
  fullName =
    "Staff Member",

  idNumber =
    "9001015000000",

  phoneNumber =
    "0712345678",

  email =
    "staff@philalink.test",
} = {}) {
  changeField(
    "Full name",
    fullName
  );

  changeField(
    "SA ID number",
    idNumber
  );

  changeField(
    "Cellphone number",
    phoneNumber
  );

  changeField(
    "Email",
    email
  );

  changeField(
    "Gender",
    "Female"
  );

  changeField(
    "Address line 1",
    "1 Main Road"
  );

  changeField(
    "Suburb",
    "Central"
  );

  changeField(
    "City",
    "Gqeberha"
  );

  changeField(
    "Province",
    "Eastern Cape"
  );

  changeField(
    "Postal code",
    "6001"
  );

  changeField(
    "Emergency contact name",
    "Emergency Person"
  );

  changeField(
    "Emergency contact number",
    "0723456789"
  );

  changeField(
    "Relationship",
    "Parent"
  );
}

function fillNurseFields() {
  changeField(
    "Date of birth",
    "1990-01-01"
  );

  changeField(
    "Employee number",
    "EMP-001"
  );

  changeField(
    "Professional registration number",
    "SANC-001"
  );

  changeField(
    "Qualification",
    "Professional Nurse"
  );

  changeField(
    "Employment date",
    "2026-01-01"
  );
}

describe(
  "RegisterStaffPage",
  () => {
    beforeEach(() => {
      mocks.getMe
        .mockReset();

      mocks.registerNurse
        .mockReset();

      mocks.registerProxy
        .mockReset();

      mocks
        .resendInvitation
        .mockReset();

      mocks.getMe
        .mockResolvedValue({
          userId:
            "admin-1",

          fullName:
            "Clinic Admin",

          clinicId:
            "clinic-1",

          clinicName:
            "Dora Nginza Hospital",
        });
    });

    it(
      "loads the ClinicAdmin assignment before allowing staff registration",
      async () => {
        render(
          <RegisterStaffPage />
        );

        expect(
          await screen
            .findByText(
              "Register staff"
            )
        ).toBeInTheDocument();

        expect(
          mocks.getMe
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          screen.getByText(
            /Dora Nginza Hospital/
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "registers a Nurse inside the authenticated ClinicAdmin clinic",
      async () => {
        mocks
          .registerNurse
          .mockResolvedValue({
            userId:
              "nurse-user-1",

            fullName:
              "Nurse One",

            role:
              "Nurse",

            clinicId:
              "clinic-1",

            clinicName:
              "Dora Nginza Hospital",

            email:
              "nurse@philalink.test",

            emailSent:
              true,

            message:
              "Invitation sent.",
          });

        render(
          <RegisterStaffPage />
        );

        await screen.findByText(
          "Register staff"
        );

        fillSharedFields({
          fullName:
            "Nurse One",

          email:
            "nurse@philalink.test",
        });

        fillNurseFields();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Register Nurse",
            }
          )
        );

        await waitFor(() => {
          expect(
            mocks
              .registerNurse
          ).toHaveBeenCalledWith(
            expect.objectContaining({
              fullName:
                "Nurse One",

              email:
                "nurse@philalink.test",

              clinicId:
                "clinic-1",

              employeeNumber:
                "EMP-001",

              registrationNumber:
                "SANC-001",

              qualification:
                "Professional Nurse",

              employmentDate:
                "2026-01-01",
            })
          );
        });

        expect(
          await screen
            .findByText(
              "Account created"
            )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Invitation sent."
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "registers a Proxy in the ClinicAdmin clinic",
      async () => {
        mocks
          .registerProxy
          .mockResolvedValue({
            userId:
              "proxy-user-1",

            fullName:
              "Proxy One",

            role:
              "Proxy",

            clinicId:
              "clinic-1",

            clinicName:
              "Dora Nginza Hospital",

            email:
              "proxy@philalink.test",

            emailSent:
              true,

            message:
              "Proxy invitation sent.",
          });

        render(
          <RegisterStaffPage />
        );

        await screen.findByText(
          "Register staff"
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Proxy",
            }
          )
        );

        fillSharedFields({
          fullName:
            "Proxy One",

          idNumber:
            "9102025000000",

          phoneNumber:
            "0734567890",

          email:
            "proxy@philalink.test",
        });

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Register Proxy",
            }
          )
        );

        await waitFor(() => {
          expect(
            mocks
              .registerProxy
          ).toHaveBeenCalledWith(
            expect.objectContaining({
              fullName:
                "Proxy One",

              email:
                "proxy@philalink.test",

              clinicId:
                "clinic-1",
            })
          );
        });

        expect(
          await screen
            .findByText(
              "Account created"
            )
        ).toBeInTheDocument();
      }
    );

    it(
      "blocks registration when the ClinicAdmin has no clinic assignment",
      async () => {
        mocks.getMe
          .mockResolvedValue({
            userId:
              "admin-1",

            clinicId:
              null,

            clinicName:
              null,
          });

        render(
          <RegisterStaffPage />
        );

        expect(
          await screen
            .findByText(
              "Your Clinic Administrator account does not have an assigned clinic."
            )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Register Nurse"
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "maps backend validation errors back to the registration form",
      async () => {
        mocks
          .registerNurse
          .mockRejectedValue(
            new mocks.ApiError(
              "Registration validation failed.",
              {
                status:
                  400,

                errors: {
                  EmployeeNumber: [
                    "Employee number already exists.",
                  ],
                },
              }
            )
          );

        render(
          <RegisterStaffPage />
        );

        await screen.findByText(
          "Register staff"
        );

        fillSharedFields();
        fillNurseFields();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Register Nurse",
            }
          )
        );

        expect(
          await screen
            .findByText(
              "Employee number already exists."
            )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Registration validation failed."
          )
        ).toBeInTheDocument();
      }
    );
  }
);
