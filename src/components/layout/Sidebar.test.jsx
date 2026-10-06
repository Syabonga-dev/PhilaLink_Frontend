import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  MemoryRouter,
} from "react-router-dom";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import Sidebar
  from "./Sidebar.jsx";

function renderSidebar(
  role,
  {
    open =
      true,

    onClose =
      vi.fn(),
  } = {}
) {
  render(
    <MemoryRouter>
      <Sidebar
        role={role}
        open={open}
        onClose={
          onClose
        }
      />
    </MemoryRouter>
  );

  return {
    onClose,
  };
}

describe(
  "Sidebar role permissions",
  () => {
    it(
      "shows only Nurse navigation to Nurse users",
      () => {
        renderSidebar(
          "Nurse"
        );

        expect(
          screen.getByText(
            "Dashboard"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Patients"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Collections"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Register Staff"
          )
        ).not
          .toBeInTheDocument();

        expect(
          screen.queryByText(
            "Manage Clinics"
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "shows only Proxy navigation to Proxy users",
      () => {
        renderSidebar(
          "Proxy"
        );

        expect(
          screen.getByText(
            "Dashboard"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Patients"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Collections"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Manage Staff"
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "shows ClinicAdmin staff registration but not SuperAdmin clinic management",
      () => {
        renderSidebar(
          "ClinicAdmin"
        );

        expect(
          screen.getByText(
            "Register Staff"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Manage Staff"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Audit Log"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Manage Clinics"
          )
        ).not
          .toBeInTheDocument();

        expect(
          screen.queryByText(
            "Register Clinic Admin"
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "shows SuperAdmin clinic management but never ClinicAdmin Register Staff",
      () => {
        renderSidebar(
          "SuperAdmin"
        );

        expect(
          screen.getByText(
            "Manage Staff"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Audit Log"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Manage Clinics"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Register Clinic Admin"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Register Staff"
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "does not expose privileged navigation for an unknown role",
      () => {
        renderSidebar(
          "Patient"
        );

        expect(
          screen.queryByText(
            "Register Staff"
          )
        ).not
          .toBeInTheDocument();

        expect(
          screen.queryByText(
            "Manage Staff"
          )
        ).not
          .toBeInTheDocument();

        expect(
          screen.queryByText(
            "Manage Clinics"
          )
        ).not
          .toBeInTheDocument();

        expect(
          screen.queryByText(
            "Register Clinic Admin"
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "closes the mobile sidebar after a navigation item is selected",
      () => {
        const onClose =
          vi.fn();

        renderSidebar(
          "ClinicAdmin",
          {
            onClose,
          }
        );

        fireEvent.click(
          screen.getByText(
            "Register Staff"
          )
        );

        expect(
          onClose
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );
  }
);
