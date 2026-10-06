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

const mocks =
  vi.hoisted(() => {
    class MockApiError
      extends Error {
      constructor(
        message,
        {
          status,
        } = {}
      ) {
        super(message);

        this.name =
          "ApiError";

        this.status =
          status;
      }
    }

    return {
      changePassword:
        vi.fn(),

      logout:
        vi.fn(),

      toastSuccess:
        vi.fn(),

      toastError:
        vi.fn(),

      ApiError:
        MockApiError,
    };
  });

vi.mock(
  "../../context/AuthContext.jsx",
  () => ({
    useAuth:
      () => ({
        changePassword:
          mocks
            .changePassword,

        logout:
          mocks.logout,
      }),
  })
);

vi.mock(
  "../../components/ui/Toast.jsx",
  () => ({
    useToast:
      () => ({
        success:
          mocks.toastSuccess,

        error:
          mocks.toastError,
      }),
  })
);

vi.mock(
  "../../services/api/client.js",
  () => ({
    ApiError:
      mocks.ApiError,
  })
);

vi.mock(
  "../../components/layout/NavigationBar.jsx",
  () => ({
    default:
      () => (
        <div
          data-testid="navigation"
        />
      ),
  })
);

vi.mock(
  "../../components/ui/Input.jsx",
  () => ({
    default:
      ({
        label,
        name,
        type =
          "text",
        value,
        onChange,
        error,
        placeholder,
        endAdornment,
      }) => (
        <label>
          <span>
            {label}
          </span>

          <input
            aria-label={
              label
            }
            name={name}
            type={type}
            value={
              value
            }
            onChange={
              onChange
            }
            placeholder={
              placeholder
            }
          />

          {
            endAdornment
          }

          {error ? (
            <span>
              {error}
            </span>
          ) : null}
        </label>
      ),
  })
);

vi.mock(
  "../../components/ui/Button.jsx",
  () => ({
    default:
      ({
        children,
        loading,
        ...props
      }) => (
        <button
          {...props}
        >
          {children}
        </button>
      ),
  })
);

import ChangePasswordPage
  from "./ChangePasswordPage.jsx";

function renderPage() {
  return render(
    <MemoryRouter
      initialEntries={[
        "/change-password",
      ]}
    >
      <Routes>
        <Route
          path="/change-password"
          element={
            <ChangePasswordPage />
          }
        />

        <Route
          path="/patient"
          element={
            <div>
              Patient destination
            </div>
          }
        />

        <Route
          path="/nurse"
          element={
            <div>
              Nurse destination
            </div>
          }
        />

        <Route
          path="/proxy"
          element={
            <div>
              Proxy destination
            </div>
          }
        />

        <Route
          path="/admin"
          element={
            <div>
              Admin destination
            </div>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

function fillPasswords({
  currentPassword =
    "TemporaryPass!123",

  newPassword =
    "PermanentPass!123",

  confirmNewPassword =
    "PermanentPass!123",
} = {}) {
  fireEvent.change(
    screen.getByLabelText(
      "Current password"
    ),
    {
      target: {
        value:
          currentPassword,
      },
    }
  );

  fireEvent.change(
    screen.getByLabelText(
      "New password"
    ),
    {
      target: {
        value:
          newPassword,
      },
    }
  );

  fireEvent.change(
    screen.getByLabelText(
      "Confirm new password"
    ),
    {
      target: {
        value:
          confirmNewPassword,
      },
    }
  );
}

describe(
  "ChangePasswordPage",
  () => {
    beforeEach(() => {
      mocks.changePassword
        .mockReset();

      mocks.logout
        .mockReset();

      mocks.toastSuccess
        .mockReset();

      mocks.toastError
        .mockReset();

      vi.spyOn(
        console,
        "error"
      )
        .mockImplementation(
          () => {}
        );
    });

    it(
      "rejects a password that does not meet the policy",
      () => {
        renderPage();

        fillPasswords({
          newPassword:
            "weak",

          confirmNewPassword:
            "weak",
        });

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Change password and continue",
            }
          )
        );

        expect(
          screen.getByText(
            "Your new password must meet all the requirements below."
          )
        ).toBeInTheDocument();

        expect(
          mocks.changePassword
        ).not
          .toHaveBeenCalled();
      }
    );

    it(
      "rejects mismatched confirmation",
      () => {
        renderPage();

        fillPasswords({
          confirmNewPassword:
            "DifferentPass!123",
        });

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Change password and continue",
            }
          )
        );

        expect(
          screen.getByText(
            "Passwords don't match."
          )
        ).toBeInTheDocument();

        expect(
          mocks.changePassword
        ).not
          .toHaveBeenCalled();
      }
    );

    it(
      "changes the password and sends the user to their role home",
      async () => {
        mocks
          .changePassword
          .mockResolvedValue({
            id:
              "nurse-1",

            role:
              "Nurse",

            mustChangePassword:
              false,
          });

        renderPage();

        fillPasswords();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Change password and continue",
            }
          )
        );

        await waitFor(() => {
          expect(
            mocks
              .changePassword
          ).toHaveBeenCalledWith({
            currentPassword:
              "TemporaryPass!123",

            newPassword:
              "PermanentPass!123",

            confirmNewPassword:
              "PermanentPass!123",
          });
        });

        expect(
          mocks.toastSuccess
        ).toHaveBeenCalledWith(
          "Your password has been changed successfully."
        );

        expect(
          await screen
            .findByText(
              "Nurse destination"
            )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows the backend password-change error",
      async () => {
        mocks
          .changePassword
          .mockRejectedValue(
            new mocks.ApiError(
              "Current password is incorrect.",
              {
                status:
                  400,
              }
            )
          );

        renderPage();

        fillPasswords();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Change password and continue",
            }
          )
        );

        expect(
          await screen
            .findByText(
              "Current password is incorrect."
            )
        ).toBeInTheDocument();
      }
    );

    it(
      "allows the temporary-password user to sign out",
      () => {
        renderPage();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sign out",
            }
          )
        );

        expect(
          mocks.logout
        ).toHaveBeenCalledTimes(
          1
        );
      }
    );
  }
);
